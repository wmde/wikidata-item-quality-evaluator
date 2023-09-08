import ArticleQualityService from "@/ArticleQualityService";
import fetchMock from "jest-fetch-mock";
import {
  getMockQualityScoresResponseFor,
  mockCalculatedQualityScores,
  mockRevisions,
  mockRevisionsResponse
} from "./ArticleQualityService.mock";

fetchMock.enableMocks();

describe("ArticleQualityService", () => {
  const service = new ArticleQualityService();
  beforeEach(() => {
    // @ts-ignore
    fetch.resetMocks();
  });

  it("gets the latest revisions for a set of Item ids", async () => {
    // @ts-ignore
    fetch.mockResponseOnce(JSON.stringify(mockRevisionsResponse));
    const revisions = await service.getLatestRevisions([
      "Q67",
      "Q761",
      "Q1235"
    ]);
    expect(JSON.stringify(revisions)).toEqual(JSON.stringify(mockRevisions));
  });

  it("calculates the average score for all items", async () => {
    
    fetch
    // @ts-ignore
      .once(JSON.stringify(mockRevisionsResponse))
      .once(JSON.stringify(getMockQualityScoresResponseFor("1363285722")))
      .once(JSON.stringify(getMockQualityScoresResponseFor("1363329108")))
      .once(JSON.stringify(getMockQualityScoresResponseFor("1367880583")));
    const { results } = await service.calculateArticleQuality([
      "Q67",
      "Q761",
      "Q1235"
    ]);
    expect(JSON.stringify(results)).toEqual(
      JSON.stringify(mockCalculatedQualityScores)
    );
  });

  //   it("filters missing or invalid Item ids", () => {});

  //   it("generates a csv from the results", () => {});
});
