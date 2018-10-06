require( 'babel-register' )();

var Enzyme = require( 'enzyme' );
var Adapter = require( 'enzyme-adapter-react-16' );
Enzyme.configure({ adapter: new Adapter() });

var jsdom = require( 'jsdom' ).jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom( '' );
global.window = document.defaultView;
Object.keys( document.defaultView ).forEach(( property ) => {
  if ( typeof global[property] === 'undefined' ) {
    exposedProperties.push( property );
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
    userAgent: 'node.js'
};

if (!global.window.localStorage) {
  global.window.localStorage = {
    getItem() { return '{}'; },
    setItem() {}
  };
}

documentRef = document;
