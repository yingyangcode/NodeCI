class Page {
  goto() {
    console.log('Im going to another page');
  }
  setCookie(){
    console.log('Im setting a cookie');
  }
}
// could use ES5 extends keyword to extend from library class
// problem: cannot tell puppeteer to use customPage class instead of its own Page class
// Hence cannot use this
/*
class customPage extends Page{
  login() {
    console.log('All of our login logic');
  }
}
*/

// If we cannot extend Page class
// We can wrap it with customPage instead
// 
class customPage extends Page{
  // Whenever a new instance of customPage is created
  // Its constructor function gets called
  // We have to call this thing with an instance of page
  constructor(page) {
    // We take page 
    // assign it to an interior variable
    this.page = page;
  }
  // set up all of our login functionality
  login() {
    this.page.goto('localhost:3000');
    this.page.setCookie();
  }
}

// const page = browser.launch();
const page = new Page();
// use page instance to create new instance of customPage
const customPage = new customPage(page);
customPage.login();

// Downside: to interact with the underlying page
// we wud have to write
// customPage.page.goto();
// We are only using one function and  
// always working with the underlying page object
// So shud be easier to access than doing customPage.page.whatever()



/**Proxy Pattern */

class Greetings {
  english() { return 'Hello'; }
  spanish() { return 'Hola'; }
}
class MoreGreetings {
  german() { return 'Hallo'; }
  french() { return 'Bonjour'; }
}

const greetings =  new Greetings();
const moreGreetings =  new MoreGreetings();

// Proxy is a new global constructor function in ES5
// takes two args: target
// target is the obj that we want to manage access to
// handler is an obj that contains a set of functions which get executed anytime 
// we try to get access to the underlying target obj

// assigning the proxy to a new var
const allGreetings = new Proxy(moreGreetings, {
  // handler has a single key called get and has a value of function
  // this function has a first arg of target which is identical to target above
  // second arg is property
  // 
  get: function(target, property) {
    return target[property] || greetings[property];
  }
});
// no paranthesis
// the get takes whatever property we are trying to acces on the proxy itself
// and calls the function that is assigned to the get key
// first arg is target and property is the string name of the prop we are trying to access
// we can also access properties that do not exist
// the get intercepts the call and runs the get function instead
// allGreetings.evenpropertiesthatdonotexist
console.log(allGreetings.french());

// Using a proxy we can look for a function defined in one class and
// if not found we can look for a function defined in another class in our application
// this allows us to just call proxy which decideds which function in which class to be executed.