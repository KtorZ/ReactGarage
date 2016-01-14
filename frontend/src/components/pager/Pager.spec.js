import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Pager from './Pager'

const {
    Simulate,
    renderIntoDocument,
    findAllInRenderedTree,
} = TestUtils

describe('Pager', () => {
    context("Given a pager with a lower bound of 1", () => {
        let onDown = newSpyHandler()
        let onUp = newSpyHandler()
        let component = renderIntoDocument(
            <Pager
                onClickUp={onUp.handler}
                onClickDown={onDown.handler}
                lower={1}
                upper={10}
                max={20}
                title='Pager'
            />
        )

        it("it should not trigger any event when up is clicked", () => {
            let controlUp = findAllInRenderedTree(component, x => /angle-up/.test(x.className))
            expect(controlUp).to.be.ok()
            expect(controlUp.length).to.equal(1)
            Simulate.click(controlUp[0])
            expect(onUp.hasBeenCalled()).not.to.be.ok()
        })

        it("it should trigger an event when down is clicked", () => {
            let controlDown = findAllInRenderedTree(component, x => /angle-down/.test(x.className))
            expect(controlDown).to.be.ok()
            expect(controlDown.length).to.equal(1)
            Simulate.click(controlDown[0])
            expect(onDown.hasBeenCalled()).to.be.ok()
        })

    })
    context("Given a pager with an upper bound = max", () => {
        let onDown = newSpyHandler()
        let onUp = newSpyHandler()
        let component = renderIntoDocument(
            <Pager
                onClickUp={onUp.handler}
                onClickDown={onDown.handler}
                lower={10}
                upper={20}
                max={20}
                title='Pager'
            />
        )

        it("it should not trigger any event when down is clicked", () => {
            let controlDown = findAllInRenderedTree(component, x => /angle-down/.test(x.className))
            expect(controlDown).to.be.ok()
            expect(controlDown.length).to.equal(1)
            Simulate.click(controlDown[0])
            expect(onDown.hasBeenCalled()).not.to.be.ok()
        })

        it("it should trigger an event when up is clicked", () => {
            let controlUp = findAllInRenderedTree(component, x => /angle-up/.test(x.className))
            expect(controlUp).to.be.ok()
            expect(controlUp.length).to.equal(1)
            Simulate.click(controlUp[0])
            expect(onUp.hasBeenCalled()).to.be.ok()
        })
    })
})
