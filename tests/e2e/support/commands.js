Cypress.Commands.add("inputItemList", text => {
  cy.get("textarea").type(text);
});

Cypress.Commands.add("getResults", () => {
  cy.get("button#get-results").click();
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

/**
 * Simulates a paste event.
 * https://gist.github.com/nickytonline/bcdef8ef00211b0faf7c7c0e7777aaf6
 *
 * @param subject A jQuery context representing a DOM element.
 * @param pasteOptions Set of options for a simulated paste event.
 * @param pasteOptions.pastePayload Simulated data that is on the clipboard.
 * @param pasteOptions.simple Determines whether or not to use a simple paste. Use this when there is no paste event bound to the element
 *                              resolved by the selector.
 * @param pasteOptions.pasteFormat The format of the simulated paste payload. Default value is 'text'.
 *
 * @returns The subject parameter.
 *
 * @example
 * cy.get('some-selector').paste({
 *  pastePayload: 'yolo,
 *  simple: false,
 *  });
 */
function paste(subject, { payload, simple = true, pasteType = "text/plain" }) {
  if (simple) {
    subject[0].value = payload;
    return;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
  const pasteEvent = Object.assign(
    new Event("paste", { bubbles: true, cancelable: true }),
    {
      clipboardData: {
        getData: (type = pasteType) => payload
      }
    }
  );

  subject[0].dispatchEvent(pasteEvent);

  return subject;
}

/*
  Simulate paste events in Cypress
  Call cy.restoreLocalStorage() in beforeEach() and cy.saveLocalStorage() in afterEach()
*/
Cypress.Commands.add(
  "paste",
  {
    prevSubject: true
  },
  paste
);
