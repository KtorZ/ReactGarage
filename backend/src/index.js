// ----- Errors
export const ErrNoMoreSpace = new Error("No more space available")
export const ErrIllegalFree = new Error("Illegal attempt to free a slot")
export const ErrNotInGarage = new Error("Vehicle not present in the garage")
export const ErrAlreadyInGarage = new Error("Vehicle already in the garage")

// ----- Garage
export function Garage (levels) {
    this.db = {}
    this.levels = levels
}

/** Entry: { vehicle: Vehicle, spot: { place: Number, floor: Number } } */

/** Vehicle -> Error | Entry */
Garage.prototype.enter = function enterVehicle(vehicle) {
    if (this.db[vehicle.license] != null) { return ErrAlreadyInGarage }
    let spot = this.levels.reduce((spot, level, floor) => {
        if (spot != null) { return spot }
        let place = level.take()
        if (place === ErrNoMoreSpace) { return null }
        return { floor, place  }
    }, null)

    if (spot == null) { return ErrNoMoreSpace }
    return this.db[vehicle.license] = { vehicle, spot }
}

/** String -> Error | Vehicle */
Garage.prototype.exit = function exitVehicle(license) {
    let entry = this.db[license]
    if (entry == null) { return ErrNotInGarage }
    let err = this.levels[entry.spot.floor].free(entry.spot.place)
    if (err === ErrIllegalFree) { return ErrNotInGarage }
    delete this.db[license]
    return entry.vehicle
}

/** String -> [Entry] */
Garage.prototype.list = function listVehicle(pageSize, from) {
    let keys = Object.keys(this.db)
    let fromIndex = keys.indexOf(from)
    return keys.map(k => this.db[k]).slice(fromIndex + 1, fromIndex + pageSize + 1)
}

// ----- Level
export function Level(nbSlots) {
    this.slots = []
    for (var i = 0; i < nbSlots; i += 1) { this.slots.push(nbSlots - i) }
}

/** () -> Error | Number */
Level.prototype.take = function take() {
    let slot = this.slots.pop()
    return slot == null ? ErrNoMoreSpace : slot
}

/** Number -> Error | Number */
Level.prototype.free = function free(slot) {
    let existing = this.slots.indexOf(slot)
    return existing !== -1 ? ErrIllegalFree : this.slots.push(slot)
}

// ----- Vehicle
export function Vehicle(type, license) {
    this.type = type
    this.license = license
}
Vehicle.CAR = "CAR"
Vehicle.MOTORBIKE = "MOTORBIKE"
