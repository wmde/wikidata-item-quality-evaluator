// https://docs.cypress.io/api/introduction/api.html
const expect = chai.expect;

// Persist localStorage across tests
beforeEach(() => {
  cy.restoreLocalStorage();
});

afterEach(() => {
  cy.saveLocalStorage();
});

describe("Item List", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Item Quality Evaluator");
  });

  it("User can input Items", () => {
    cy.inputItemList(`Q67`);
    cy.get("textarea").should("have.value", "Q67");
  });

  it("User cannot enter spaces", () => {
    cy.inputItemList(`  \nQ234\n`);
    cy.get("textarea").should("have.value", "Q67\nQ234\n");
  });

  it("User cannot enter non-alphanumeric characters", () => {
    cy.inputItemList(`!@#$%^&*(),./`);
    cy.get("textarea").should("have.value", "Q67\nQ234\n");
  });

  it("Pasted Items are formatted", () => {
    cy.get("textarea").paste({ payload: "Q1234  ,Q154", simple: false });
    cy.get("textarea").should("have.value", "Q67\nQ234\nQ1234\nQ154");
  });

  it("The Item list is stored in localStorage", () => {
    expect(
      localStorage.getItem("wikidata.itemQuality.ui.itemList")
    ).to.be.equal("Q67\nQ234\nQ1234\nQ154");
  });

  it("Should get the results for the Items", () => {
    cy.getResults();
  });
});

describe("SPARQL Query", () => {
  const testQuery = `#Cats\n  \nSELECT ?item ?itemLabel \nWHERE\n{\n  ?item wdt:P31 wd:Q146.\n  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }\n}`;

  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Item Quality Evaluator");
  });

  it("User can open the SPARQL input tab", () => {
    cy.contains("SPARQL").click();
  });

  it("User can input a SPARQL query", () => {
    cy.get(".CodeMirror textarea").type(testQuery, {
      parseSpecialCharSequences: false
    });
  });

  it("The Item list is stored in localStorage", () => {
    expect(localStorage.getItem("wikibase.queryService.ui.Editor")).to.exist;
  });

  it("Should get the results for the Items", () => {
    cy.getResults();
  });
});
