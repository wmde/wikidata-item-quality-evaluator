// https://docs.cypress.io/api/introduction/api.html

describe("Item Quality Evaluator Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Itemset Quality Tool");
  });

  it("Checks the results for an Item", () => {
    cy.get("textarea");
    cy.inputText("Q67");
    cy.get("button").click();
    cy.url().should("include", "/results");
    cy.get(".total-score");
  });
});
