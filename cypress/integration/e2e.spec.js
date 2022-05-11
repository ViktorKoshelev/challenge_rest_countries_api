function waitUrl(url, name) {
  cy.intercept('GET', url).as(name)
  cy.wait('@' + name);
}

function waitAll() {
  waitUrl('**/all*', 'getAll');
}

function checkThemeElements(theme) {
  ['background', 'element'].forEach((rule) => {
    cy.get(`[class*=${theme}-${rule}]`);
  })
}

function checkIcon(theme) {
  cy.get(`[class*=icon-${theme}]`);
}

describe('App', () => {
  it('Change color palette', () => {
    cy.visit('http://localhost:3000')
    checkThemeElements('light');
    checkIcon('light');

    cy.get('[data-testid="switcher"]').click()
    checkThemeElements('dark');
    checkIcon('dark');

    cy.get('[data-testid="switcher"]').click()
    checkThemeElements('light');
    checkIcon('light');
  })
})

describe('Index page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    waitAll()
  });

  it('Show the title and grid', () => {
    cy.contains('Where in the world?')

    cy.get('[data-testid="grid"] > a')
      .its('length')
      .should('be.gt', 1);
  })

  it('Looking for country', () => {
    cy.get('[data-testid="search"]')
      .type('china')
    waitUrl('**/name/*', 'search');

    cy.get('[data-testid="grid"] > a')
      .contains('China');

    cy.get('[data-testid="grid"] > a')
      .its('length')
      .should('be.eq', 3)

    cy.get('[data-testid="search"]')
      .clear();

    // debounce wait
    cy.wait(300)

    cy.get('[data-testid="grid"] > a')
      .its('length')
      .should('be.gt', 3);
  })

  it('Filter by region', () => {
    cy.contains('Filter by Region').click({ force: true });

    cy.contains('Asia').click();

    cy.contains('China');
  })

  it('Goes to country page', () => {
    cy.contains('Republic of Paraguay').click();

    cy.location('pathname').should('eq', '/PRY');
  })
})

const INFO = `Oriental Republic of Uruguay
Native Name: República Oriental del Uruguay
Population: 3473727
Region: Americas
Sub Region: South America
Capital: Montevideo
Top Level Domain: .uy
Currencies: Uruguayan peso
Languages: Spanish
Border Countries:Argentine RepublicFederative Republic of Brazil`
  .split('\n');
// TODO test back
// TODO test another country
describe('Country page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/URY');
    waitUrl('**/alpha/*', 'country');
  })

  it('Show country info', () => {
    INFO.forEach((infoPart) => {
      cy.contains(infoPart);
    });
  })

  it('Goes to index', () => {
    cy.contains('Back').click();
    cy.location('href').should('eq', 'http://localhost:3000/');
  })

  it('Goes to border country', () => {
    cy.contains('Argentine Republic').click();
    cy.location('pathname').should('eq', '/ARG');
  })
})
