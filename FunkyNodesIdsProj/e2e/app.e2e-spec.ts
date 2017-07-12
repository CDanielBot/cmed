import { FunkyNodesIdsProjPage } from './app.po';

describe('funky-nodes-ids-proj App', () => {
  let page: FunkyNodesIdsProjPage;

  beforeEach(() => {
    page = new FunkyNodesIdsProjPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
