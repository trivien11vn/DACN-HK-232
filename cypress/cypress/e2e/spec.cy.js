describe('template spec', () => {
  it('auto-passes', () => {
    cy.visit("/");
  })
})

describe('HomePage Test', () => {
  it('Successfully load after admin login - Header', () => {
    cy.visit("/");
    cy.get("[cytest='component']").contains("Admin Workspace");
  });
});