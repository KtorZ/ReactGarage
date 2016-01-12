global.expect = require('expect.js')
global.document = require('jsdom').jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
