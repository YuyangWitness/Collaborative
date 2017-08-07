import { Week1Page } from './app.po';

describe('week1 App', () => {
  let page: Week1Page;

  beforeEach(() => {
    page = new Week1Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
