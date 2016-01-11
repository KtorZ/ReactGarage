// ----- Errors
export const ErrNoMoreSpace = new Error("No more space available")
export const ErrIllegalFree = new Error("Illegal attempt to free a slot")

// ----- Garage
export function Garage (levels) {}

/** Entry: { vehicle: Vehicle, spot: { place: Number, floor: Number } } */

/** Vehicle -> Error | Entry */
Garage.prototype.enter = function enterVehicle(vehicle) {
    return null
}

/** String -> Error | Vehicle */
Garage.prototype.exit = function exitVehicle(license) {
    return null
}

/** String -> [Entry] */
Garage.prototype.list = function listVehicle(from) {
    return null
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
