// ----- Errors
export const ErrNoMoreSpace = new Error("No more space available")
export const ErrIllegalFree = new Error("Illegal attempt to free a slot")
export const ErrNotInGarage = new Error("Vehicle not present in the garage")
export const ErrAlreadyInGarage = new Error("Vehicle already in the garage")

// ----- Garage
export function Garage (levels) {
    this.db = []
    this.levels = levels
}

/** Entry: { vehicle: Vehicle, spot: { place: Number, floor: Number } } */

/** [Entry], String -> Maybe(Entry) */
function find(xs, license) {
    return xs.reduce((res, x) => res || x.vehicle.license === license && x, false) || null
}

/** [Entry], String -> Maybe(Number) */
function findIndex(xs, license) {
    let index = xs.reduce((res, x, i) => res || x.vehicle.license === license && i+1, false)
    return !index ? null : index - 1
}

/** [Entry], entry -> () */
function remove(xs, x) {
    let index = xs.indexOf(x)
    if (index === -1) { return }
    xs.splice(index, 1)
}

/** Vehicle -> Either(Error, Entry) */
Garage.prototype.enter = function enterVehicle(vehicle) {
    if (find(this.db, vehicle.license)) { return ErrAlreadyInGarage }
    let spot = this.levels.reduce((spot, level, floor) => {
        if (spot != null) { return spot }
        let place = level.take()
        if (place === ErrNoMoreSpace) { return null }
        return { floor, place  }
    }, null)

    if (spot == null) { return ErrNoMoreSpace }
    let entry = { vehicle, spot }
    this.db.push(entry)
    return entry
}

/** String -> Either(Error, Vehicle) */
Garage.prototype.exit = function exitVehicle(license) {
    let entry = find(this.db, license)
    if (entry == null) { return ErrNotInGarage }
    let err = this.levels[entry.spot.floor].free(entry.spot.place)
    if (err === ErrIllegalFree) { return ErrNotInGarage }
    remove(this.db, entry)
    return entry.vehicle
}

/** String -> [Entry] */
Garage.prototype.list = function listVehicle(pageSize, fromLicense) {
    let fromIndex = findIndex(this.db, fromLicense)
    if (fromIndex == null) { fromIndex = -1 }
    return this.db.slice(fromIndex + 1, fromIndex + pageSize + 1)
}

// ----- Level
export function Level(nbSlots) {
    this.slots = []
    for (var i = 0; i < nbSlots; i += 1) { this.slots.push(nbSlots - i) }
}

/** () -> Either(Error, Number) */
Level.prototype.take = function take() {
    let slot = this.slots.pop()
    return slot == null ? ErrNoMoreSpace : slot
}

/** Number -> Either(Error, Number) */
Level.prototype.free = function free(slot) {
    let existing = this.slots.indexOf(slot)
    return existing !== -1 ? ErrIllegalFree : this.slots.push(slot)
}

// ----- Vehicle
export function Vehicle(type, license) {
    this.type = type
    this.license = license
}
Vehicle.CAR = "Car"
Vehicle.MOTORBIKE = "Motorbike"
