import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Filters from './Filters'

const {
    Simulate,
    renderIntoDocument,
    scryRenderedDOMComponentsWithTag,
} = TestUtils

describe('Filter', () => {
    var onToggle, component

    beforeEach(() => {
        onToggle = newSpyHandler()
        component = renderIntoDocument(
            <Filters
                title={"myFilter"}
                options={[
                    {id: 0, displayName: "opt1"},
                    {id: 1, displayName: "opt2"},
                    {id: 2, displayName: "opt3"}
                ]}
                selected={[1]}
                toggleOption={onToggle.handler}
            />
        )
    })

    it('it renders a list of filtering option', () => {
        let filters = scryRenderedDOMComponentsWithTag(component, 'li')
        expect(filters).to.be.ok()
        expect(filters.length).to.equal(3)
    })

    it('it adds a marker to active filters', () => {
        let filters = scryRenderedDOMComponentsWithTag(component, 'li')
        expect(filters).to.be.ok()
        let actives = filters
                .filter(x => !/unactive/.test(x.className))
                .filter(x => /active/.test(x.className))
        expect(actives.length).to.equal(1)
    })

    it('it trigger an event when a filter is clicked', () => {
        let filters = scryRenderedDOMComponentsWithTag(component, 'li')
        Simulate.click(filters[0])
        expect(onToggle.hasBeenCalled()).to.be.ok()

        Simulate.click(filters[1])
        expect(onToggle.hasBeenCalled()).to.be.ok()
    })
})
