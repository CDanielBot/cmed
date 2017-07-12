import { browser, by, element } from 'protractor';

export class FunkyNodesIdsProjPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
