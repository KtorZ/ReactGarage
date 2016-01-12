import React from 'react'
import TestUtils from 'react-addons-test-utils'
import SearchBar from './SearchBar'

const {
    Simulate,
    renderIntoDocument,
    findRenderedDOMComponentWithTag,
} = TestUtils

describe('Search', () => {
    var onSearch, onCancel, searchbar

    beforeEach(() => {
        onSearch = newSpyHandler()
        onCancel = newSpyHandler()
        searchbar = renderIntoDocument(
            <SearchBar
                onSearch={onSearch.handler}
                onCancel={onCancel.handler}
            />
        )
    })

    it('it renders an input and a search icon', () => {
        let input = findRenderedDOMComponentWithTag(searchbar, 'input')
        let icon = findRenderedDOMComponentWithTag(searchbar, 'i')
        expect(input).to.be.ok()
        expect(icon).to.be.ok()
    })

    it("it triggers onSearch when its appropriated", () => {
        let input = findRenderedDOMComponentWithTag(searchbar, 'input')

        // Simulate 3 keys down
        Simulate.change(input, { target: { value: 'K' } })
        Simulate.change(input, { target: { value: 'Kt' } })
        Simulate.change(input, { target: { value: 'Kto' } })
        expect(onSearch.hasBeenCalled()).not.to.be.ok()

        // One more and it starts triggering
        Simulate.change(input, { target: { value: 'Ktor' } })
        expect(onSearch.hasBeenCalled()).to.be.ok()
        Simulate.change(input, { target: { value: 'KtorZ' } })
        expect(onSearch.hasBeenCalled()).to.be.ok()

        // Returning below 3 chars shouldn't trigger anymore
        Simulate.change(input, { target: { value: 'Ktor' } })
        expect(onSearch.hasBeenCalled()).to.be.ok()
        Simulate.change(input, { target: { value: 'Kto' } })
        expect(onSearch.hasBeenCalled()).not.to.be.ok()
    })

    it("it triggers onCancel when appropriate", () => {
        let input = findRenderedDOMComponentWithTag(searchbar, 'input')

        // Simulate 3 keys down
        Simulate.change(input, { target: { value: 'K' } })
        expect(onCancel.hasBeenCalled()).to.be.ok()
        Simulate.change(input, { target: { value: 'Kt' } })
        expect(onCancel.hasBeenCalled()).to.be.ok()
        Simulate.change(input, { target: { value: 'Kto' } })
        expect(onCancel.hasBeenCalled()).to.be.ok()

        // One more and it shouldn't trigger anymore
        Simulate.change(input, { target: { value: 'Ktor' } })
        expect(onCancel.hasBeenCalled()).not.to.be.ok()

        // Simulate a clear
        Simulate.change(input, { target: { value: '' } })
        expect(onSearch.hasBeenCalled()).to.be.ok()
    })
})
