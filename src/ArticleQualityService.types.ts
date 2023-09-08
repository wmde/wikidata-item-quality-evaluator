export interface WikidataResponseRaw {
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

export interface WikidataResponseParsed {
  [key: string]: WikidataRevision;
}

export interface WikidataRevision {
  pageid: number;
  revid: number;
  title: string;
  weightedSum?: number;
  missing?: boolean;
  label: string;
}

export interface Result extends WikidataRevision {
  score: number;
  probability: {
    [key: string]: number;
  };
}

export interface QualityScoresResponse {
  [key: string]: ModelScores;
}

export interface QualityScore {
  prediction: string;
  probability: {
    [key: string]: number;
  };
}

export interface ModelScores {
  [key: string]: {
    score: QualityScore;
  };
}
