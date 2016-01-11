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
export function Level(nbSlots) {}

/** () -> Error | Number */
Level.prototype.take = function take() {
    return null
}

/** Number -> Error | Number */
Level.prototype.free = function free(slot) {
    return null
}

// ----- Vehicle
export function Vehicle(type, license) {}
Vehicle.CAR = "CAR"
Vehicle.MOTORBIKE = "MOTORBIKE"
