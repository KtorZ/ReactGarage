React showcase: Multi-level garage
==================================

The repository is split in two (though unbalanced) parts:

- backend which holds the mock business logic
- frontend which is the actual application, written with **React.js**
- frontend-elm which is the same application but written in **Elm**

Everything is built around npm, such that `npm test` can be used to test both applications, and
`npm run build` to create distribution files. The build folder contains those exported build
files.


A small UI is available to operate over the mock backend. The select options are ignored by the
`exit` and `populate` actions. Incidentally, `populate` will generate 140 random vehicles and stores
them into the garage (unless there's no place left).

Besides, the frontend loads vehicles by batches from the backend. The size is configurable and,
it will only load more vehicles if and only if there's no active filtering (either a search or
an option filter). 

Both applications are accessible via the following links:

[frontend React](http://ktorz.github.io/ReactGarage/index.html)

[frontend Elm](http://ktorz.github.io/ReactGarage/index-elm.html)

PS: The Elm application is still in a raw state. The application has to be split in smaller
pieces to enhance and illustrate composability within Elm.
