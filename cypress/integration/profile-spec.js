/// <reference types="Cypress" />

describe('Profile', () => {
  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.registerUserIfNeeded()
    cy.login()
  })

  it('shows my profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy=edit-profile-settings]').click()
  })

  it('logs out via profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy=edit-profile-settings]').click()
    cy.get('[data-cy=logout]').click()
    cy.get('[data-cy=sign-in]').should('be.visible')
  })

  it('can update my profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy="edit-profile-settings"]').click()
    cy.get('[data-cy=bio]')
      .clear()
      .type('my new bio')
    cy.get('form').submit()
    cy.location('pathname').should('equal', '/')

    // saved bio should be displayed
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy=user-info]')
      .should('be.visible')
      .find('[data-cy=bio]')
      .should('have.text', 'my new bio')
  })

})
