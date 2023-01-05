describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Adam the First',
      username: 'adam',
      password: 'password123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('adam')
      cy.get('#password').type('password123')
      cy.get('#login-button').click()

      cy.contains('Adam the First logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('adam')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Adam the First logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'adam', password: 'password123' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('title by cypress')
      cy.get('#author').type('author by cypress')
      cy.get('#url').type('url by cypress')
      cy.contains('create').click()
      cy.contains('title by cypress')
    })

    describe('and some blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'first author', url: 'www.firsturl.com', likes: 0 })
        cy.createBlog({ title: 'second blog', author: 'second author', url: 'www.secondurl.com', likes: 2 })
        cy.createBlog({ title: 'third blog', author: 'third author', url: 'www.thirdurl.com', likes: 5 })
      })

      it('one of those can be liked', function () {
        cy.contains('view').as('viewButton')
        cy.get('@viewButton').click()
        cy.contains('like').as('likeButton')
        cy.get('@likeButton').click()
        cy.contains('likes 6')
      })

      it('user who created one can remove it', function () {
        cy.contains('view').as('viewButton')
        cy.get('@viewButton').click()
        cy.contains('remove').as('removeButton')
        cy.get('@removeButton').click()
        cy.get('html').should('not.contain', 'third blog')
      })

      it('the blogs are ordered by likes', function () {
        cy.get('#blogList').find('li').eq(0).should('contain', 'third blog')
        cy.get('#blogList').find('li').eq(1).should('contain', 'second blog')
        cy.get('#blogList').find('li').last().should('contain', 'first blog')
      })
    })
  })
})