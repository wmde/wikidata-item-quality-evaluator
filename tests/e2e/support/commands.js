Cypress.Commands.add("inputItemList", text => {
  cy.get("textarea").type(text);
});

Cypress.Commands.add("getResults", () => {
  cy.get("button").click();
  cy.url().should("include", "/results");
});

/*
  Persist localStorage across Cypress tests.
  Call cy.restoreLocalStorage() in beforeEach() and cy.saveLocalStorage() in afterEach()
*/
const LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
