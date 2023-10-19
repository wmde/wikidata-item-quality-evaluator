export const mockRevisionsResponse = {
  batchcomplete: true,
  query: {
    pages: [
      {
        pageid: 194,
        ns: 0,
        title: "Q67",
        revisions: [
          {
            revid: 1363329108,
            parentid: 1362621975,
            minor: false,
            user: "Mtrizio",
            timestamp: "2021-02-17T10:52:47Z",
            comment: "/* wbsetdescription-add:1|ksh */ Fluchzeuschbaurkompanei"
          }
        ],
        entityterms: {
          alias: ["Airbus SE", "Airbus Commercial Aircraft"],
          label: ["Airbus"],
          description: ["European aircraft manufacturer"]
        }
      },
      {
        pageid: 1068,
        ns: 0,
        title: "Q761",
        revisions: [
          {
            revid: 1363285722,
            parentid: 1361765024,
            minor: false,
            user: "Polarbear8",
            timestamp: "2021-02-17T09:48:09Z",
            comment:
              "/* wbsetclaim-create:2||1 */ [[Property:P150]]: [[Q105542004]]"
          }
        ],
        entityterms: {
          alias: ["Bialystok"],
          label: ["Białystok"],
          description: ["capital of Podlaskie Voivodeship, Poland"]
        }
      },
      {
        pageid: 1606,
        ns: 0,
        title: "Q1235",
        revisions: [
          {
            revid: 1367880583,
            parentid: 1367551615,
            minor: false,
            user: "Reinheitsgebot",
            timestamp: "2021-02-23T01:33:11Z",
            comment:
              "/* wbcreateclaim-create:1| */ [[Property:P9179]]: 13548, #quickstatements; invoked by Mix'n'match:add_person_dates"
          }
        ],
        entityterms: {
          label: ["Giovanni Leone"],
          description: ["6th President of Italy (1908-2001)"]
        }
      }
    ]
  }
};

export const mockRevisions = {
  "1363285722": {
    pageid: 1068,
    revid: 1363285722,
    title: "Q761",
    missing: undefined,
    label: "Białystok"
  },
  "1363329108": {
    pageid: 194,
    revid: 1363329108,
    title: "Q67",
    missing: undefined,
    label: "Airbus"
  },
  "1367880583": {
    pageid: 1606,
    revid: 1367880583,
    title: "Q1235",
    missing: undefined,
    label: "Giovanni Leone"
  }
};

export function getMockQualityScoresResponseFor(revId: string) {
  const response = {
    wikidatawiki: {
      models: {
        itemquality: {
          version: "0.5.0"
        }
      },
      scores: {
        [revId]: {}
      }
    }
  };

  const score = {
    itemquality: {
      score: {
        prediction: "",
        probability: {}
      }
    }
  };

  switch (revId) {
    case "1363285722":
      score.itemquality.score.prediction = "A";
      score.itemquality.score.probability = {
        A: 0.8670674579788645,
        B: 0.10351433099213198,
        C: 0.023287000149854437,
        D: 0.0035507445036629228,
        E: 0.0025804663754859978
      };
      response.wikidatawiki.scores[revId] = score;
      return response;

    case "1363329108":
      score.itemquality.score.prediction = "A";
      score.itemquality.score.probability = {
        A: 0.8828895279282934,
        B: 0.09098863535251028,
        C: 0.02094533949830334,
        D: 0.003010187630113764,
        E: 0.0021663095907791248
      };
      response.wikidatawiki.scores[revId] = score;
      return response;

    case "1367880583":
      score.itemquality.score.prediction = "B";
      score.itemquality.score.probability = {
        A: 0.23725823263223536,
        B: 0.7166130678139061,
        C: 0.036345944365185616,
        D: 0.005664660117133298,
        E: 0.00411809507153952
      };
      response.wikidatawiki.scores[revId] = score;
      return response;
  }
}

export const mockCalculatedQualityScores = [
  {
    pageid: 1068,
    revid: 1363285722,
    title: "Q761",
    label: "Białystok",
    score: 4.828937569695226,
    probability: {
      A: 0.8670674579788645,
      B: 0.10351433099213198,
      C: 0.023287000149854437,
      D: 0.0035507445036629228,
      E: 0.0025804663754859978
    }
  },
  {
    pageid: 194,
    revid: 1363329108,
    title: "Q67",
    label: "Airbus",
    score: 4.849424884397425,
    probability: {
      A: 0.8828895279282934,
      B: 0.09098863535251028,
      C: 0.02094533949830334,
      D: 0.003010187630113764,
      E: 0.0021663095907791248
    }
  },
  {
    pageid: 1606,
    revid: 1367880583,
    title: "Q1235",
    label: "Giovanni Leone",
    score: 4.177228682818163,
    probability: {
      A: 0.23725823263223536,
      B: 0.7166130678139061,
      C: 0.036345944365185616,
      D: 0.005664660117133298,
      E: 0.00411809507153952
    }
  }
];
