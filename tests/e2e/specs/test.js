// https://docs.cypress.io/api/introduction/api.html
const expect = chai.expect;

// Persist localStorage across tests
beforeEach(() => {
  cy.restoreLocalStorage();
});

afterEach(() => {
  cy.saveLocalStorage();
});

describe("Item Quality Evaluator Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Itemset Quality Tool");
  });

  it("User can input Items", () => {
    cy.inputItemList("Q67");
  });

  it("The Item list is stored in localStorage", () => {
    expect(localStorage.getItem("itemList")).to.be.equal("Q67");
  });

  it("Should get the results for the Items", () => {
    cy.getResults();
  });
});
