import { filterEntries } from './filters'

describe('FilterEntries() should filter a given list of entity', () => {
    var xs = [
        { id: 0, prop1: 'a', prop2: 1 },
        { id: 1, prop1: 'b', prop2: 2 },
        { id: 2, prop1: 'a', prop2: 14 },
        { id: 3, prop1: 'c', prop2: 1 },
        { id: 4, prop1: 'b', prop2: 1 },
        { id: 5, prop1: 'a', prop2: 2 }
    ]

    it('it should return the same list if no filter is applied', () => {
        let filtered = filterEntries([], xs)
        expect(filtered).to.eql(xs)
        filtered = filterEntries([], [])
        expect(filtered).to.eql([])
    })

    it('it should filter an empty list', () => {
        let filtered = filterEntries([
            { prop: 'prop1', allowed: ['a', 'b'] }
        ], [])
        expect(filtered).to.eql([])
    })

    it('it should filter values horizontally depending of a prop', () => {
        let filtered = filterEntries([
            { prop: 'prop1', allowed: ['a'] }
        ], xs)
        expect(filtered).to.eql([
            { id: 0, prop1: 'a', prop2: 1 },
            { id: 2, prop1: 'a', prop2: 14 },
            { id: 5, prop1: 'a', prop2: 2 }
        ])
    })

    it('it should filter values vertically depending of several props', () => {
        let filtered = filterEntries([
            { prop: 'prop1', allowed: ['a'] },
            { prop: 'prop2', allowed: [2] }
        ], xs)
        expect(filtered).to.eql([
            { id: 5, prop1: 'a', prop2: 2 }
        ])
    })

    it('it should filter even if there is nothing more to filter', () => {
        let filtered = filterEntries([
            { prop: 'prop1', allowed: ['f'] },
            { prop: 'prop2', allowed: [2] }
        ], xs)
        expect(filtered).to.eql([])
    })

    it('it should filter nothing if filters are too permissive', () => {
        let filtered = filterEntries([
            { prop: 'prop1', allowed: ['a', 'b', 'c'] },
            { prop: 'prop2', allowed: [1, 2, 14] }
        ], xs)
        expect(filtered).to.eql(xs)
    })
})
