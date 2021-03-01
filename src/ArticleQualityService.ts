import asyncPool from "tiny-async-pool";
import {
  WikidataResponseParsed,
  WikidataResponseRaw,
  OresScoresResponse,
  OresScore,
  Result
} from "./ArticleQualityService.types";
class ArticleQualityService {
  private batchSize = 50;
  private maxWorkers = 2;

  private oresHost = "https://ores.wikimedia.org";
  private weights: { [key: string]: number } = {
    E: 1,
    D: 2,
    C: 3,
    B: 4,
    A: 5
  };
  private dbname = "wikidatawiki";
  private modelName = "itemquality";
  private wikidataEndpoint = "https://www.wikidata.org";

  /**
   * Calculates the article quality by Item ID using the Wikidata and ORES API.
   * If there is more than 50 Items, the requests will be batched.
   *
   * @param itemList List of Item IDs
   */
  async calculateArticleQuality(
    itemList: Array<string>
  ): Promise<{
    results: Array<Result>;
    unprocessedItems: Array<string>;
    missingItems: Array<string>;
  }> {
    // Filter out the Items that don't match the pattern: Q[any sequence of real numbers]
    const itemIdPattern = /Q\d+$/;
    const unprocessedItems: Array<string> = [];
    const filteredItems: Array<string> = [];

    for (let i = 0; i < itemList.length; i++) {
      if (itemIdPattern.test(itemList[i])) {
        filteredItems.push(itemList[i]);
      } else {
        unprocessedItems.push(itemList[i]);
      }
    }

    // Get the latest revisions
    const batchRevisions = await asyncPool(
      this.maxWorkers,
      this.chunk(filteredItems, this.batchSize),
      input => this.getLatestRevisions(input)
    );

    // Get the ORES scores for the revisions
    const batchScores = await asyncPool(
      this.maxWorkers,
      batchRevisions,
      input => this.getOresScores(input)
    );

    // Assign the scores to the revisions
    const articleQuality: {
      [key: string]: Result;
    } = Object.assign({}, ...batchRevisions.flat());
    batchScores.map(scores => {
      for (const [key, value] of Object.entries(scores || {})) {
        articleQuality[key].score = this.computeWeightedSum(
          value.itemquality.score
        );
        articleQuality[key].probability = value.itemquality.score.probability;
      }
    });

    // Filter out the Items that could not be resolved
    const missingItems = Object.values(articleQuality)
      .filter(result => result.missing)
      .map(item => item.title);

    const results = Object.values(articleQuality).filter(
      result => !result.missing
    );

    return { results, unprocessedItems, missingItems };
  }

  /**
   * Prepares the response from the Wikidata API to send to ORES
   *
   * @param response Raw JSON response from Wikidata API
   */
  private parseWikidataResponse(
    response: WikidataResponseRaw
  ): WikidataResponseParsed {
    const parsed: WikidataResponseParsed = {};
    Object.values(response.query.pages).map(
      page =>
        (parsed[page.revisions ? page.revisions[0].revid : page.title] = {
          pageid: page.pageid,
          revid: page.revisions && page.revisions[0].revid,
          title: page.title,
          missing: page.missing,
          label: page.entityterms && page.entityterms.label?.join(", ")
        })
    );
    return parsed;
  }

  /**
   * Gets the latest revisions for a list of Item IDs from the Wikidata API
   * Limit of 50 Items per request
   *
   * @param itemList Array of Item IDs e.g, Q1234
   */
  public async getLatestRevisions(
    itemList: Array<string>
  ): Promise<WikidataResponseParsed> {
    const queryUrl = `${
      this.wikidataEndpoint
    }/w/api.php?action=query&format=json&formatversion=2&prop=revisions|entityterms&titles=${itemList.join(
      "|"
    )}&origin=*`;
    try {
      return await fetch(queryUrl)
        .then(data => data.json())
        .then(this.parseWikidataResponse);
    } catch (e) {
      throw "Error getting revisions from Wikidata | " + e.message;
    }
  }

  /**
   * Gets the ORES scores for a list of revisions
   *
   * @param revisions Response from the Wikidata API parsed through parseWikidataResponse()
   */
  public async getOresScores(
    revisions: WikidataResponseParsed
  ): Promise<OresScoresResponse | void> {
    const validRevisions = Object.values(revisions).filter(rev => !rev.missing);

    const queryUrl = `${this.oresHost}/v3/scores/${this.dbname}?models=${
      this.modelName
    }&revids=${validRevisions.map(rev => rev.revid).join("|")}`;
    try {
      return await fetch(queryUrl)
        .then(data => data.json())
        .then(response => response.wikidatawiki.scores);
    } catch (e) {
      throw "ORES Error: " + e.message;
    }
  }

  /**
   * Splits an Array into chunks
   *
   * @param arr Array of Items
   * @param len Maximum length of a chunk
   */
  private chunk(arr: Array<string>, len: number) {
    const chunks = [];
    let i = 0;
    const n = arr.length;

    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }

    return chunks;
  }

  /**
   * Computes the weighted sum of an ORES score object
   *
   * @param score An ORES score object
   */
  private computeWeightedSum(score: OresScore) {
    const clsProba = score.probability;
    let weightedSum = 0;
    for (const cls in clsProba) {
      if (clsProba[cls]) {
        const proba = clsProba[cls];
        weightedSum += proba * this.weights[cls];
      }
    }
    return weightedSum;
  }
}

export default ArticleQualityService;
