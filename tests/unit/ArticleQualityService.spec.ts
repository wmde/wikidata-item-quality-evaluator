import ArticleQualityService from "@/ArticleQualityService";
import fetchMock from "fetch-mock";
import {
  mockCalculatedOresScores,
  mockOresScores,
  mockOresScoresResponse,
  mockRevisions,
  mockRevisionsResponse
} from "./mocks/data";

fetchMock.mock(
  "https://www.wikidata.org/w/api.php?action=query&format=json&formatversion=2&prop=revisions|entityterms&titles=Q67|Q761|Q1235&origin=*",
  {
    status: 200,
    body: mockRevisionsResponse
  }
);

fetchMock.mock(
  "https://ores.wikimedia.org/v3/scores/wikidatawiki?models=itemquality&revids=1363285722|1363329108|1367880583",
  {
    status: 200,
    body: mockOresScoresResponse
  }
);

describe("ArticleQualityService", () => {
  const service = new ArticleQualityService();

  it("gets the latest revisions for a set of Item ids", async () => {
    const revisions = await service.getLatestRevisions([
      "Q67",
      "Q761",
      "Q1235"
    ]);
    expect(JSON.stringify(revisions)).toEqual(JSON.stringify(mockRevisions));
  });

  it("gets the ORES scores for a set of revisions", async () => {
    const scores = await service.getOresScores(mockRevisions);
    expect(JSON.stringify(scores)).toEqual(JSON.stringify(mockOresScores));
  });

  it("calculates the average score for all items", async () => {
    const scores = await service.calculateArticleQuality([
      "Q67",
      "Q761",
      "Q1235"
    ]);
    expect(JSON.stringify(scores)).toEqual(
      JSON.stringify(mockCalculatedOresScores)
    );
  });

  //   it("identifies missing or invalid Item ids", () => {});

  //   it("generates a csv from the results", () => {});
});
