"use strict"

var expect = require('expect.js')
var YsuraGarage = require('../YsuraGarage')

function expectValidSlot(slot) {
    expect(slot).to.be.an('object')
    expect(slot.vehicle).to.be.a(YsuraGarage.Vehicle)
    expect(slot.spot).to.be.an('object')
    expect(slot.spot.place).to.be.a('number')
    expect(slot.spot.floor).to.be.a('number')
}

describe("Garage management", () => {
    it("One should be able to create a garage from a set of levels", () => {
        let garage = new YsuraGarage.Garage([
                new YsuraGarage.Level(5),
                new YsuraGarage.Level(10),
                new YsuraGarage.Level(7)
            ])
        expect(garage).to.be.ok()
    })

    context("Given an empty garage", () => {
        var garage, vehicle
        beforeEach(() => {
            garage = new YsuraGarage.Garage([
                new YsuraGarage.Level(3),
                new YsuraGarage.Level(3),
                new YsuraGarage.Level(3)
            ])
            vehicle = new YsuraGarage.Vehicle(YsuraGarage.Vehicle.CAR, "qwerty")
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
                let v = new YsuraGarage.Vehicle(YsuraGarage.Vehicle.MOTORBIKE, `moto${i}`)
                let slot = garage.enter(v)
                expectValidSlot(slot)
            }
            let err = garage.enter(vehicle)
            expect(err).to.equal(YsuraGarage.ErrNoMoreSpace)
        })

        it("One should be able to exit the garage once entered", () => {
            garage.enter(vehicle)
            let out = garage.exit(vehicle.license)
            expect(out).to.be.a(YsuraGarage.Vehicle)
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
            let list = garage.list()
            expect(list).to.be.an('array')
            expect(list.length).to.equal(0)
        })
    })

    context("Given a non-empty garage", () => {
        var garage
        beforeEach(() => {
            garage = new YsuraGarage.Garage([
                new YsuraGarage.Level(3),
                new YsuraGarage.Level(3),
                new YsuraGarage.Level(3)
            ])
            for (var i = 0; i < 5; i += 1) {
                garage.enter(new YsuraGarage.Vehicle(YsuraGarage.Vehicle.CAR, `qwerty${i}`))
            }
        })

        it("One should be able to list the vehicles inside the garage", () => {
            let list = garage.list()
            expect(list).to.be.an('array')
            expect(list.length).to.be.greaterThan(0)
            expectValidSlot(list[0])
        })
    })
})
