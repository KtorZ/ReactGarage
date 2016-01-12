"use strict"

function expectValidSlot(slot) {
    expect(slot).to.be.an('object')
    expect(slot.vehicle).to.be.a(Vehicle)
    expect(slot.spot).to.be.an('object')
    expect(slot.spot.place).to.be.a('number')
    expect(slot.spot.floor).to.be.a('number')
}

describe("Garage management", () => {
    it("One should be able to create a garage from a set of levels", () => {
        let garage = new Garage([
                new Level(5),
                new Level(10),
                new Level(7)
            ])
        expect(garage).to.be.ok()
    })

    context("Given an empty garage", () => {
        var garage, vehicle
        beforeEach(() => {
            garage = new Garage([
                new Level(3),
                new Level(3),
                new Level(3)
            ])
            vehicle = new Vehicle(Vehicle.CAR, "qwerty")
        })

        it("One should be able to enter in the garage", () => {
            let slot = garage.enter(vehicle)
            expectValidSlot(slot)
        })

        it("One shouldn't be able to enter the garage if already entered", () => {
            garage.enter(vehicle)
            let err = garage.enter(vehicle)
            expect(err).to.equal(YsuraGarage.ErrAlreadyInGarage)
        })

        it("One should be able to make the garage full", () => {
            for (var i = 0; i < 9; i += 1) {
                let v = new Vehicle(Vehicle.MOTORBIKE, `moto${i}`)
                let slot = garage.enter(v)
                expectValidSlot(slot)
            }
            let err = garage.enter(vehicle)
            expect(err).to.equal(YsuraGarage.ErrNoMoreSpace)
        })

        it("One should be able to exit the garage once entered", () => {
            garage.enter(vehicle)
            let out = garage.exit(vehicle.license)
            expect(out).to.be.a(Vehicle)
            expect(out).to.be.eql(vehicle)
        })

        it("One shouldn't be able to exit the garage if not entered", () => {
            let err = garage.exit(vehicle.license)
            expect(err).to.equal(YsuraGarage.ErrNotInGarage)
        })

        it("One shouldn't be able to exit the garage more than once", () => {
            garage.enter(vehicle)
            garage.exit(vehicle.license)
            let err = garage.exit(vehicle.license)
            expect(err).to.equal(YsuraGarage.ErrNotInGarage)
        })

        it("One should be able to list the vehicles inside the garage", () => {
            let list = garage.list(10)
            expect(list).to.be.an('array')
            expect(list.length).to.equal(0)
        })
    })

    context("Given a non-empty garage", () => {
        const NB_VEHICLE = 5
        var garage
        beforeEach(() => {
            garage = new Garage([
                new Level(3),
                new Level(3),
                new Level(3)
            ])
            for (var i = 0; i < NB_VEHICLE; i += 1) {
                garage.enter(new Vehicle(Vehicle.CAR, `qwerty${i}`))
            }
        })

        it("One should be able to list the vehicles inside the garage", () => {
            let list = garage.list(5)
            expect(list).to.be.an('array')
            expect(list.length).to.be.equal(NB_VEHICLE)
            expectValidSlot(list[0])
        })

        it("One should be able to list vehicles after a given one", () => {
            let fullList = garage.list(5)
            let offsetList = garage.list(5, fullList[2].vehicle.license)
            expect(offsetList).to.be.an('array')
            expect(offsetList.length).to.be.equal(NB_VEHICLE - 3)
            expectValidSlot(offsetList[0])
            expect(offsetList[0]).to.eql(fullList[3])
        })

        it("One should be able to list vehicle correctly after a small traffic", () => {
            let vehicle = garage.exit('qwerty0')
            garage.enter(vehicle)
            let list = garage.list(5, vehicle.license)
            expect(list).to.be.an('array')
            expect(list.length).to.equal(0)
        })
    })
})
