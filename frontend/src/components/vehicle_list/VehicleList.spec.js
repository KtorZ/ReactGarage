import React from 'react'
import TestUtils from 'react-addons-test-utils'
import VehicleList from './VehicleList'

const {
    renderIntoDocument,
    scryRenderedDOMComponentsWithTag,
} = TestUtils

describe('VehicleList', () => {
    var component

    beforeEach(() => {
        component = renderIntoDocument(
            <VehicleList
                vehicles={[
                    { license: "ll", level: 1, spot: 14, type: "CAR" },
                    { license: "lk", level: 2, spot: 12, type: "CAR" },
                    { license: "lj", level: 1, spot: 6, type: "MOTO" },
                ]}
            />
        )
    })

    it('it renders a list of vehicles', () => {
        let rows = scryRenderedDOMComponentsWithTag(component, 'tr')
        expect(rows).to.be.ok()
        expect(rows.length).to.equal(3)
    })
})
