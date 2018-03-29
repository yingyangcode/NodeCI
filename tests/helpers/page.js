const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  // generate a puppeteer page
  // create a new instance of customPage
  // use proxy to combine and return
  static async build(){
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, property){
        // we include browser because in our test suite,
        // we use browser to get a page and then close the browser and page
        // by including browser here, we never have to work with the browser obj anymore
        // we let our proxy handle all browser functions such as creating a page
        // browser is given a higher priority than page here so that when page.close()
        // is called it calls browser's close fn and not page's close fn
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    
    
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });

    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector){
    return this.page.$eval(selector, el => el.innerHtml);
  }

// evaluate turns the contents inside it into a string and passes it to the chromium browser instance
// since it converts to a string, all information about its scope are lost, hence, path becomes undefined
// evaluate takes a list of arguments that also gets converted to string and passed
// we make use of that to pass in the path variable as an argument to the fn inside evaluate()
  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: 'My Title', content: 'My Content'})
      }).then(res => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate((_path, _data) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_data)
      }).then(res => res.json());
    }, path, data);
  }

  execRequests(actions) {
    // this entire statement will return an array of promises
    // promises that represent the running evaluate fns in our chromium instance
    // to make sure we wait for all the promises to resolve we use Promise.all
    return Promise.all(
      actions.map(({ method, path, data }) => {
      // this is a ref to the current page obj we are working with
      // so this[method] returns either the post or get fns above
      // invoke it and pass arguments
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;