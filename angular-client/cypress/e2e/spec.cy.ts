describe('General home page tests when not logged in', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the header component and navigate to signup page on header button click', () => {
    cy.get('app-header').should('exist');
    cy.get('app-header .btn').click();
    cy.url().should('include', 'signup/register');
  });

  it('navigate to signup page on home button click', () => {
    cy.get('app-home').should('exist');
    cy.get('app-home .btn').click();
    cy.url().should('include', 'signup/register');
  });

  it('should display the footer component and navigate to signup page on link click', () => {
    cy.get('app-footer').should('exist');
    cy.get('.footer-links a').contains('Анализ на храни').click();
    cy.url().should('include', 'signup/register');
  });
});

describe('Register tests', () => {
  beforeEach(() => {
    cy.visit('/signup/register');

    cy.intercept('POST', 'http://localhost:3000/users/register', {
      statusCode: 200,
      body: {
        user: {
          id: 123,
          username: 'test-user',
          email: 'test@example.com',
          allergy: 'Peanuts'
        }
      }
    }).as('registerRequest');
  });

  it('should register successfully with mocked response', () => {
    cy.get('kendo-textbox[formControlName="email"]').type('test@example.com');
    cy.get('kendo-textbox[formControlName="username"]').type('testuser1');
    cy.get('kendo-textbox[formControlName="password"]').type('Password@123');
    cy.get('kendo-multiselect[formControlName="allergy"]').type('Peanuts{enter}');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest').its('request.body').should('deep.equal', {
      email: 'test@example.com',
      username: 'testuser1',
      password: 'Password@123',
      allergy: 'Peanuts'
    });

    cy.get('kendo-dialog').should('contain', 'Регистрацията е успешна! Искате ли да влезете в профила си?');
    cy.get('.k-dialog-actions .k-button').contains('Влизане').click();
    cy.url().should('include', '/login');
  });
});

describe('Login tests', () => {
  beforeEach(() => {
    cy.visit('/signup/login');

    cy.intercept('POST', 'http://localhost:3000/users/login', {
      statusCode: 200,
      body: {
        token: '',
        user: {
          id: 123,
          username: 'test-user',
          email: 'test@example.com',
          allergy: 'Peanuts'
        }
      }
    }).as('loginRequest');

    cy.intercept('GET', 'http://localhost:3000/users?id=null',  {
      statusCode: 200,
      body: {
        id: 123,
        username: 'test-user',
        email: 'test@example.com',
        allergy: 'Peanuts'
      }
    }).as('getUserRequest');
  });

  it('should log in successfully and get user allergy with mocked response', () => {
    cy.get('kendo-textbox[formControlName="email"]').type('test@example.com');
    cy.get('kendo-textbox[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('request.body').should('deep.equal', {
      email: 'test@example.com',
      password: 'password123'
    });

    cy.wait('@getUserRequest');

    cy.url().should('include', '/analyze');
    cy.get('.allergy-tag').should('contain', 'Peanuts');
  });
});

describe('Logged in tests', () => {
  beforeEach(() => {
    cy.visit('/signup/login');

    cy.intercept('POST', 'http://localhost:3000/users/login', {
      statusCode: 200,
      body: {
        token: '',
        user: {
          id: 123,
          username: 'test-user',
          email: 'test@example.com',
          allergy: 'Peanuts'
        }
      }
    }).as('loginRequest');

    cy.intercept('GET', 'http://localhost:3000/users?id=null',  {
      statusCode: 200,
      body: {
        id: 123,
        username: 'test-user',
        email: 'test@example.com',
        allergy: 'Peanuts'
      }
    }).as('getUserRequest');

    cy.get('kendo-textbox[formControlName="email"]').type('test@example.com');
    cy.get('kendo-textbox[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('request.body').should('deep.equal', {
      email: 'test@example.com',
      password: 'password123'
    });

    cy.wait('@getUserRequest');

    cy.url().should('include', '/analyze');
    cy.get('.allergy-tag').should('contain', 'Peanuts');
  });

  it('should navigate to home page on header button click', () => {
    cy.get('app-header .k-menu-item').contains('Начало').click();
    cy.url().should('include', '/home');
  });

  it('should navigate to recipes generate page on header button click', () => {
    cy.get('app-header .k-menu-item').contains('Рецепти').click();
    cy.url().should('include', '/recipes/generate');
  });

  it('should give a response when asking AI text completion with mocked response', () => {
    cy.get('.k-prompt .k-textarea').type('Can I eat a burger?');
    cy.get('.k-prompt-footer .k-button').contains('Генерирай отговор').click();

    cy.intercept('POST', 'http://localhost:3000/ai/text', {
      statusCode: 200,
      body: {
        answer: {
          content: '{"keyword": "Dangerous", "details": "You should not eat this food."}'
        }
      }
    }).as('askAIRequest');

    cy.wait('@askAIRequest').its('request.body').should('deep.equal', {
      question: 'Can I eat a burger?',
      allergy: 'Peanuts'
    });

    cy.get('.k-prompt .k-card').should('exist');
    cy.get('.k-prompt .k-card .k-card-title').contains('DANGEROUS');
    cy.get('.k-prompt .k-card .k-card-body').contains('You should not eat this food.');
  });
});