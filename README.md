Ysura Garage Assignment
=======================

The repository is split in two (though unbalanced) parts:

- backend which holds the mock business logic
- frontend which is the actual application, written with React.js

Everything is built around npm, such that `npm test` can be used to test both applications, and
`npm run build` to create distribution files. The build folder contains those exported build
files.


A small UI is available to operate over the mock backend. The select options are ignored by the
`exit` and `populate` actions. Incidentally, `populate` will generate 140 random vehicles and stores
them into the garage (unless there's no place left).

Besides, the frontend loads vehicles by batches from the backend. The size is configurable and,
it will only load more vehicles if and only if there's no active filtering (either a search or
an option filter). 
