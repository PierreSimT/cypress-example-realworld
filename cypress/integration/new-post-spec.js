/// <reference types="Cypress" />

import { title, about, article, tags } from '../fixtures/post'
import { stripIndent } from 'common-tags'

describe('New post', () => {
  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.registerUserIfNeeded()
    cy.login()
  })

  it('writes a post', () => {
    // I have added "data-cy" attributes
    // following Cypress best practices
    // https://on.cypress.io/best-practices#Selecting-Elements
    cy.get('[data-cy=new-post]').click()

    cy.get('[data-cy=title]').type('my title')
    cy.get('[data-cy=about]').type('about X')
    cy.get('[data-cy=article]').type('this post is **important**.')
    cy.get('[data-cy=tags]').type('test{enter}')
    cy.get('[data-cy=publish]').click()

    // changed url means the post was successfully created
    cy.location('pathname').should('include', '/article/my-title')
  })

  it('can edit an article', () => {
    cy.contains('a.nav-link', 'New Post').click()

    // I have added "data-cy" attributes to select input fields
    cy.get('[data-cy=title]').type('my title')
    cy.get('[data-cy=about]').type('about X')
    cy.get('[data-cy=article]').type('this post is **important**.')
    cy.get('[data-cy=tags]').type('test{enter}')
    cy.get('[data-cy=publish]').click()
    cy.location('pathname').should('include', '/article/my-title')

    cy.get('[data-cy=edit-article]').click()
    cy.location('pathname').should('include', '/editor/my-title')
    cy.get('[data-cy=title]')
      .clear()
      .type('a brand new title')
    cy.get('[data-cy=publish]').click()
    cy.location('pathname').should('include', '/article/my-title')
  })

  it('sets the post body at once', () => {
    cy.contains('a.nav-link', 'New Post').click()

    // I have added "data-cy" attributes to select input fields
    cy.get('[data-cy=title]').type('my title')
    cy.get('[data-cy=about]').type('about X')

    // to speed up creating the post, set the text as value
    // and then trigger change event by typing "Enter"
    const post = stripIndent`
      # Fast tests

      > Speed up your tests using direct access to DOM elements

      You can set long text all at once and then trigger \`onChange\` event.
    `

    cy.get('[data-cy=article]')
      .invoke('val', post)
      .type('{enter}')

    cy.get('[data-cy=tags]').type('test{enter}')
    cy.get('[data-cy=publish]').click()

    cy.contains('h1', 'my title')
  })

  it('deletes post', () => {
    cy.contains('a.nav-link', 'New Post').click()

    // instead hard-coding text in this test
    // the blog post contents comes from cypress/fixtures/post.js
    cy.get('[data-cy=title]').type(title)
    cy.get('[data-cy=about]').type(about)

    // dispatch Redux actions
    cy.window()
      .its('store')
      .invoke('dispatch', {
        type: 'UPDATE_FIELD_EDITOR',
        key: 'body',
        value: article
      })

    // need to click "Enter" after each tag
    cy.get('[data-cy=tags]').type(tags.join('{enter}') + '{enter}')

    // and post the new article
    cy.get('[data-cy=publish]').click()

    // the url should show the new article
    cy.url().should('include', '/article/' + Cypress._.kebabCase(title))

    cy.get('[data-cy=delete-article]').click()

    // goes back to the main page
    cy.location('pathname').should('equal', '/')
  })

  it('creates article using API', () => {
    cy.postArticle({
      title: 'first post',
      description: 'first description',
      body: 'first article',
      tagList: ['first', 'testing']
    })
  })
})
