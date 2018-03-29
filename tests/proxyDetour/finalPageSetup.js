class Page {
  goto() {
    console.log('Im going to another page');
  }
  setCookie(){
    console.log('Im setting a cookie');
  }
}

/* Initially
class customPage extends Page{
  constructor(page) {
    this.page = page;
  }
  login() {
    this.page.goto('localhost:3000');
    this.page.setCookie();
  }
} 
*/
// Before each test we are creating a new page everytime
// so we wrap page building logic in one function
/* 
const buildPage = () => {
const page = new Page();
const customPage = new customPage(page);
const superPage = new Proxy(customPage, {
  get: function(target, property){
      return target[property] || page[property];
    }
  });
  return superPage;
}

buildPage();
*/

 /* 
superPage.goto();
superPage.setCookie();
superPage.login(); */

/**
 * if customPage was not there, we would not need to 
 * use buildpage or anything like this.
 * So we can create a static function on customPage class
 * that static function can be used to define the new page
 * the customPage, combine them in a proxy and return
 */
class customPage extends Page{
  // static functions can be called without the instance of the underlying class
  static build() {
    const page = new Page();
    const customPage = new customPage(page);
    const superPage = new Proxy(customPage, {
      get: function(target, property){
          return target[property] || page[property];
        }
      });
    return superPage;
  }
  constructor(page) {
    this.page = page;
  }
  login() {
    this.page.goto('localhost:3000');
    this.page.setCookie();
  }
}

const superPage = customPage.build();
superPage.login();
superPage.goto();