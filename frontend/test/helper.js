global.expect = require('expect.js')

// Mock dom and browser
global.document = require('jsdom').jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
Object.keys(window).forEach(k => !global[k] && (global[k] = window[k])) // Augment global with window

// Add a little helper for the tests
global.newSpyHandler = function () {
    let called = false
    return {
        handler: () => {
            called = true
        },
        hasBeenCalled() {
            let c = called
            called = false // reset
            return c
        }
    }
}

// Take care of component which import css
require('css-modules-require-hook')({
    extensions: ['.sass'],
    preprocessCss: data => require('node-sass').renderSync({
        data,
        indentedSyntax: true,
        includePaths: [__dirname + '/../src']
    }).css
})
