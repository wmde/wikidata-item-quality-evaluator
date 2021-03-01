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
    expect(localStorage.getItem("itemList")).to.be.equal(
      "Q67\nQ234\nQ1234\nQ154"
    );
  });

  it("Should get the results for the Items", () => {
    cy.getResults();
  });
});
