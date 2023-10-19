import asyncPool from "tiny-async-pool";
import {
  WikidataResponseParsed,
  WikidataResponseRaw,
  QualityScoresResponse,
  QualityScore,
  Result
} from "./ArticleQualityService.types";

export const ERROR_CODES = {
  WIKIDATA_GET: 200,
  WIKIDATA_PARSE: 300,
  LIFTWING: 400
};
class ArticleQualityService {
  private batchSize = 50;
  private maxWorkers = 2;

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

    // Get the Quality scores for the revisions
    const batchResponses = await asyncPool(
      this.maxWorkers,
      batchRevisions,
      input => this.provideScores(input)
    );

    // Assign the scores to the revisions
    const articleQuality: {
      [key: string]: Result;
    } = Object.assign({}, ...batchRevisions.flat());
    batchResponses.forEach(responses => {
      for (const response of responses as QualityScoresResponse[]) {
        for (const [revId, content] of Object.entries(response || {})) {
          articleQuality[revId].score = this.computeWeightedSum(
            content[this.modelName].score
          );
          articleQuality[revId].probability =
            content[this.modelName].score.probability;
        }
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
   * Prepares the response from the Wikidata API to send to Liftwing
   *
   * @param response Raw JSON response from Wikidata API
   */
  private parseWikidataResponse(
    response: WikidataResponseRaw
  ): WikidataResponseParsed {
    const parsed: WikidataResponseParsed = {};
    try {
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
    } catch (e) {
      throw {
        code: ERROR_CODES.WIKIDATA_PARSE,
        description:
          "There was a problem parsing the results from the APIs. This is probably a problem with our code. <br>If you know how, <a href='https://phabricator.wikimedia.org/tag/item_quality_evaluator/' target='_blank'> report the issue</a>.",
        message: e.message
      };
    }
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
      throw {
        code: e.code || ERROR_CODES.WIKIDATA_GET,
        description:
          e.description ||
          "There was a problem connecting to the Wikidata service. Please check your internet connection or try again later",
        message: e.message
      };
    }
  }

  private async provideScores(
    batchRevisions: WikidataResponseParsed
  ): Promise<void | QualityScoresResponse[]> {
    // get revisions as numbers
    const revisions = this.extractRevisions(batchRevisions);
    // get a promise with all the scores for each revision
    const scoresPromises = revisions.map(revision =>
      this.getQualityScores(revision)
    );

    return Promise.all(scoresPromises);
  }

  private extractRevisions(response: WikidataResponseParsed): Array<number> {
    return Object.values(response)
      .filter(rev => !rev.missing)
      .map(rev => Number(rev.revid));
  }

  private async getQualityScores(
    revision: number
  ): Promise<QualityScoresResponse> {
    const response = await fetch(
      "https://api.wikimedia.org/service/lw/inference/v1/models/wikidatawiki-itemquality:predict",
      {
        method: "POST",
        /* eslint-disable @typescript-eslint/camelcase */
        body: JSON.stringify({ rev_id: revision })
      }
    );
    const data = await response.json();
    return data.wikidatawiki.scores;
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
   * Computes the weighted sum of a LiftWing score object
   *
   * The LiftWing score is calculated by weight of the most relevant score.
   * See LiftWing on https://wikitech.wikimedia.org/wiki/Machine_Learning/LiftWing
   *
   * @param score A quality score object
   */
  private computeWeightedSum(score: QualityScore) {
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
