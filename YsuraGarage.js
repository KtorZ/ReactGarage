var YsuraGarage =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Garage = Garage;
	exports.Level = Level;
	exports.Vehicle = Vehicle;
	// ----- Errors
	var ErrNoMoreSpace = exports.ErrNoMoreSpace = new Error("No more space available");
	var ErrIllegalFree = exports.ErrIllegalFree = new Error("Illegal attempt to free a slot");
	var ErrNotInGarage = exports.ErrNotInGarage = new Error("Vehicle not present in the garage");
	var ErrAlreadyInGarage = exports.ErrAlreadyInGarage = new Error("Vehicle already in the garage");

	// ----- Garage
	function Garage(levels) {
	    this.db = {};
	    this.levels = levels;
	}

	/** Entry: { vehicle: Vehicle, spot: { place: Number, floor: Number } } */

	/** Vehicle -> Error | Entry */
	Garage.prototype.enter = function enterVehicle(vehicle) {
	    if (this.db[vehicle.license] != null) {
	        return ErrAlreadyInGarage;
	    }
	    var spot = this.levels.reduce(function (spot, level, floor) {
	        if (spot != null) {
	            return spot;
	        }
	        var place = level.take();
	        if (place === ErrNoMoreSpace) {
	            return null;
	        }
	        return { floor: floor, place: place };
	    }, null);

	    if (spot == null) {
	        return ErrNoMoreSpace;
	    }
	    return this.db[vehicle.license] = { vehicle: vehicle, spot: spot };
	};

	/** String -> Error | Vehicle */
	Garage.prototype.exit = function exitVehicle(license) {
	    var entry = this.db[license];
	    if (entry == null) {
	        return ErrNotInGarage;
	    }
	    var err = this.levels[entry.spot.floor].free(entry.spot.place);
	    if (err === ErrIllegalFree) {
	        return ErrNotInGarage;
	    }
	    delete this.db[license];
	    return entry.vehicle;
	};

	/** String -> [Entry] */
	Garage.prototype.list = function listVehicle(pageSize, from) {
	    var _this = this;

	    var keys = Object.keys(this.db);
	    var fromIndex = keys.indexOf(from);
	    return keys.map(function (k) {
	        return _this.db[k];
	    }).slice(fromIndex + 1, fromIndex + pageSize + 1);
	};

	// ----- Level
	function Level(nbSlots) {
	    this.slots = [];
	    for (var i = 0; i < nbSlots; i += 1) {
	        this.slots.push(nbSlots - i);
	    }
	}

	/** () -> Error | Number */
	Level.prototype.take = function take() {
	    var slot = this.slots.pop();
	    return slot == null ? ErrNoMoreSpace : slot;
	};

	/** Number -> Error | Number */
	Level.prototype.free = function free(slot) {
	    var existing = this.slots.indexOf(slot);
	    return existing !== -1 ? ErrIllegalFree : this.slots.push(slot);
	};

	// ----- Vehicle
	function Vehicle(type, license) {
	    this.type = type;
	    this.license = license;
	}
	Vehicle.CAR = "Car";
	Vehicle.MOTORBIKE = "Motorbike";

/***/ }
/******/ ]);