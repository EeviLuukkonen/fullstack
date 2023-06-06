describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testaaja',
      username: 'testuser',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login page can be opened', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Testaaja logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('väärä')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'testuser',
        password: 'salasana'
      })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('testblog')
      cy.get('#author').type('testauthor')
      cy.get('#url').type('testurl')
      cy.contains('create').click()
      cy.get('.success').should('contain', 'New blog testblog by testauthor added')
      cy.contains('testblog testauthor')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'testblog',
          author: 'testauthor',
          url: 'testurl'
        })
        cy.contains('testblog testauthor').find('button').as('viewButton')
      })
      
      it('a blog can be liked', function() {
        cy.get('@viewButton').click()
        cy.contains('testblog')
          .get('#like')
          .click()
        cy.contains('testblog')
          .contains('Likes: 1')
      })

      it('creator can remove a blog', function() {
        cy.get('@viewButton').click()
        cy.contains('testblog')
          .get('#remove')
          .click()
        cy.get('.success').should('contain', 'Blog testblog removed!')
      })
    })
  })
})