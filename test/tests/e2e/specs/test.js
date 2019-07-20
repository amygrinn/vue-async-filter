// https://docs.cypress.io/api/introduction/api.html
/// <reference types="Cypress" />

before(() => cy.visit('/'))

describe('Async pipe', () => {
  it('Updates value from an observable', () => {
    cy
      .wait(1000)
      .get('[data-cy=observable]')
      .then(el => +el[0].innerText)
      .then(firstNum => {
        cy.wait(1000)
          .get('[data-cy=observable]')
          .then(el => +el[0].innerText)
          .should('be.equal', ++firstNum)
      })
  })

  it('Resolves a promise asynchronously', () => {
    cy.get('[data-cy=promise')
      .contains('Promise has resolved!')
  })

  it('Has factors of 6, 7, 8, and 9', () => {
    cy.get('[data-cy=function] > :nth-child(1) > input')
      .then(text => +text[0].placeholder)
      .then(num => assert(num % 6 === 0))

    cy.get('[data-cy=function] > :nth-child(2) > input')
      .then(text => +text[0].placeholder)
      .then(num => assert(num % 7 === 0))

    cy.get('[data-cy=function] > :nth-child(3) > input')
      .then(text => +text[0].placeholder)
      .then(num => assert(num % 8 === 0))

    cy.get('[data-cy=function] > :nth-child(4) > input')
      .then(text => +text[0].placeholder)
      .then(num => assert(num % 9 === 0))
  })
})
