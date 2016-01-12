"use strict"

describe("Level creation", () => {
    it("One should be able to create a level from a number of available slots", () => {
        let level = new Level(20)
        expect(level).to.be.ok()
    })

    context("Given an existing level of 3 slots", () => {
        var level
        beforeEach(() => {
            level = new Level(3)
        })

        it("One should be able to take one slot", () => {
            let slot = level.take()
            expect(slot).to.be.a('number')
        })

        it("One shouldn't be able to take more than 3 slots", () => {
            level.take()
            level.take()
            level.take()
            let err = level.take()
            expect(err).to.be.equal(YsuraGarage.ErrNoMoreSpace)
        })

        it("One should be able to free a previously taken slot", () => {
            let slot = level.take()
            let remaining = level.free(slot)
            expect(remaining).to.be.a('number')
        })

        it("One shouldn't be able to free a non taken slot", () => {
            // Free a random slot while full
            let err = level.free(2)
            expect(err).to.be.equal(YsuraGarage.ErrIllegalFree)

            // Free two times the same slot
            let slot = level.take()
            level.free(slot)
            err = level.free(slot)
            expect(err).to.be.equal(YsuraGarage.ErrIllegalFree)

            // Free a random slot while partially-full
            slot = level.take()
            err = level.free(slot + 1)
            expect(err).to.be.equal(YsuraGarage.ErrIllegalFree)
        })
    })
})
