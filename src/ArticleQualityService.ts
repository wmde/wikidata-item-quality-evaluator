interface WikidataResponseRaw {
  query: {
    pages: {
      [key: number]: {
        ns: number;
        pageid: number;
        revisions: [
          {
            parentid: number;
            revid: number;
          }
        ];
        title: string;
        missing?: boolean;
        entityterms: {
          alias: Array<string>;
          description: Array<string>;
          label: Array<string>;
        };
      };
    };
  };
}

interface WikidataResponseParsed {
  [key: string]: WikidataRevision;
}

interface WikidataRevision {
  pageid: number;
  revid: number;
  title: string;
  weightedSum?: number;
  missing?: boolean;
  label: string;
  score?: number;
}

interface OresScoresResponse {
  itemquality: {
    score: OresScore;
  };
}

interface OresScore {
  prediction: string;
  probability: {
    [key: string]: number;
  };
}

class ArticleQualityService {
  private taskQueue = [];

  private batchSize = 50;
  private maxWorkers = 2;
  private requestDelay = 500;

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

  // constructor() {

  // }
  async calculateArticleQuality(itemList: Array<string>) {
    const { revisions, unprocessedItems } = await this.getLatestRevisions(
      itemList
    );

    const scores = await this.getOresScores(revisions);

    const articleQuality = revisions;

    for (const [key, value] of Object.entries(scores || {})) {
      articleQuality[key].score = this.computeWeightedSum(
        value.itemquality.score
      );
    }

    unprocessedItems.push(
      ...Object.values(articleQuality)
        .filter(result => result.missing)
        .map(item => item.title)
    );

    const results = Object.values(articleQuality).filter(
      result => !result.missing
    );

    return { results, unprocessedItems };
  }

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
          label: page.entityterms && page.entityterms.label.join(", ")
        })
    );
    return parsed;
  }

  public async getLatestRevisions(
    itemList: Array<string>
  ): Promise<{
    revisions: WikidataResponseParsed;
    unprocessedItems: Array<string>;
  }> {
    const itemIdPattern = /Q\d+$/; // Q[any sequence of real numbers]
    const unprocessedItems: Array<string> = [];
    const filteredItems: Array<string> = [];

    for (let i = 0; i < itemList.length; i++) {
      if (itemIdPattern.test(itemList[i])) {
        filteredItems.push(itemList[i]);
      } else {
        unprocessedItems.push(itemList[i]);
      }
    }

    const queryUrl = `${
      this.wikidataEndpoint
    }/w/api.php?action=query&format=json&formatversion=2&prop=revisions|entityterms&titles=${filteredItems.join(
      "|"
    )}&origin=*`;
    try {
      const data = await fetch(queryUrl);
      const response: WikidataResponseRaw = await data.json();
      const revisions = this.parseWikidataResponse(response);

      const validRevisions = Object.values(revisions).filter(
        rev => !rev.missing
      );
      if (validRevisions.length === 0) {
        throw Error("No revisions found");
      }

      return { revisions, unprocessedItems };
    } catch (e) {
      throw "Error getting revisions from Wikidata | " + e.message;
    }
  }

  public async getOresScores(
    revisions: WikidataResponseParsed
  ): Promise<OresScoresResponse | void> {
    const validRevisions = Object.values(revisions).filter(rev => !rev.missing);

    const queryUrl = `${this.oresHost}/v3/scores/${this.dbname}?models=${
      this.modelName
    }&revids=${validRevisions.map(rev => rev.revid).join("|")}`;
    try {
      const data = await fetch(queryUrl);
      const response = await data.json();
      if (!response.wikidatawiki.scores) {
        throw Error("Couldn't get scores");
      }
      return response.wikidatawiki.scores;
    } catch (e) {
      throw "ORES Error: " + e.message;
    }
  }

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

  private computeWeightedProportion(score: any) {
    const weightedSum = this.computeWeightedSum(score);
    return weightedSum / Math.max.apply(null, Object.values(this.weights));
  }
}

export default ArticleQualityService;
