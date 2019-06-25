/// <reference types="Cypress" />

describe('following user', () => {
  const secondUser = {
    username: 'seconduser',
    image: 'https://robohash.org/MQ9.png?set=set3&size=150x150',
    email: 'seconduser@email.com',
    password: 'seconduser'
  }

  before(() => cy.registerUserIfNeeded(secondUser))
  before(() => cy.registerUserIfNeeded())

  beforeEach(() => {
    cy.task('deleteAllArticles')
  })

  it('can follow second user', () => {
    // the second user should write a post
    cy.login(secondUser)
    cy.contains('[data-cy=profile]', secondUser.username).should('be.visible')
    // write post
    cy.contains('a.nav-link', 'New Post').click()
    cy.get('[data-cy=title]').type('my title')
    cy.get('[data-cy=about]').type('about X')
    cy.get('[data-cy=article]').type('this post is **important**.')
    cy.get('[data-cy=tags]').type('test{enter}')
    cy.get('[data-cy=publish]').click()
    // log out
    cy.contains('[data-cy=profile]', secondUser.username).click()
    cy.get('[data-cy="edit-profile-settings"]').click()
    cy.get('[data-cy=logout]').click()
    cy.get('[data-cy=sign-in]').should('be.visible')
    // login as our test user
    cy.login()
    cy.get('[data-cy=global-feed]').click()
    cy.get('.article-preview')
      .should('have.length', 1)
      .first()
      .find('.author')
      .click()
    // we should get to the user profile page
    cy.location('pathname').should('equal', '/@seconduser')
    cy.get('[data-cy=follow-unfollow-user]')
      .should(c => {
        expect(c.text()).to.include('Follow seconduser')
      })
      .click()
    cy.get('[data-cy=follow-unfollow-user]').should(c => {
      expect(c.text()).to.include('Unfollow seconduser')
    })
  })
})