import React from 'react'
import ReactDOM from 'react-dom'
import Filtering from './containers/filtering/Filtering'
import Listing from './containers/listing/Listing'
import Navbar from './containers/navbar/Navbar'
import HandyUI from './containers/handy_ui/HandyUI'
import { filterEntries } from './utils/filters'

import './vars.sass'
import './index.sass'

const BATCH_SIZE = 80
const PAGE_SIZE = 10

// ----- Initialize 'backend'

let levels = [
    new YsuraGarage.Level(10),
    new YsuraGarage.Level(20),
    new YsuraGarage.Level(30),
    new YsuraGarage.Level(40),
    new YsuraGarage.Level(50)
]

let garage = new YsuraGarage.Garage(levels)

const levelOptions = levels.map((_, i) => ({ id: i, displayName: `Level ${i}`}))
const typeOptions = [
    { id: YsuraGarage.Vehicle.CAR, displayName: 'Car' },
    { id: YsuraGarage.Vehicle.MOTORBIKE, displayName: 'Motorbike' }
]

// ----- Declare the application itself
let App = React.createClass({
    getInitialState() {
        return {
            entries: Object.assign({}, ...loadEntries()),
            lastServerEntry: null,
            lowerIndex: 0,
            filters: { level: [], type: [] },
            query: null
        }
    },

    /** () -> Boolean */
    noFilterEnabled() {
        return this.state.filters.level.length === 0 &&
            this.state.filters.type.length === 0 &&
            this.state.query == null
    },

    /** () -> [{license, type, slot, level}] */
    getVehicleList() {
        let { filters, entries, query } = this.state
        let vehicles = filterEntries(
                Object.keys(filters).map(k => ({ prop: k, allowed: filters[k] })),
                Object.keys(entries).map(k => ({ license: k, ...entries[k] }))
        )

        if (query != null) { vehicles = vehicles.filter(x => query.test(x.license)) }
        return vehicles
    },

    /** () -> () | Take care of updating the lower index and if needed, the entries as well */
    updateLowerIndex(index) {
        let state = { lowerIndex: index }
        if (this.noFilterEnabled() && index + PAGE_SIZE >= this.getVehicleList().length) {
            let entries = loadEntries(this.state.lastServerEntry)
            let nbEntries = entries.length
            if (nbEntries > 0) {
                state = Object.assign(state, {
                    lastServerEntry: Object.keys(entries[nbEntries - 1])[0],
                    entries: Object.assign(this.state.entries, ...entries)
                })
            }
        }
        this.setState(state)
    },

    // ----- Handy UI
    populate() {
        populateGarage()
        let entries = loadEntries()
        this.setState({
            entries: Object.assign(this.state.entries, ...entries),
            lastServerEntry: Object.keys(entries.slice(-1)[0])[0],
        })
    },

    onEnter(license, type) {
        let entry = garage.enter(new YsuraGarage.Vehicle(type, license))
        if (entry === YsuraGarage.ErrNoMoreSpace || entry === YsuraGarage.ErrAlreadyInGarage) {
            alert(entry.message)
            return
        }
        this.setState({
            entries: Object.assign(this.state.entries, {
                [entry.vehicle.license]: {
                    slot: entry.spot.place,
                    type: entry.vehicle.type,
                    level: entry.spot.floor
                }
            })
        })
    },

    onExit(license) {
        let vehicle = garage.exit(license)
        if (vehicle === YsuraGarage.ErrNotInGarage) {
            alert(vehicle.message)
            return
        }
        let entries = this.state.entries
        delete entries[license]

        if (entries.length <= this.state.lowerIndex + PAGE_SIZE) {
            this.setState({ entries: entries, lowerIndex: Math.max(this.state.lowerIndex - PAGE_SIZE, 0)})
            return
        }
        this.setState({ entries: entries })
    },
    // -----

    render() {
        let { lowerIndex } = this.state
        let vehicles = this.getVehicleList()
        return (<div className='wrapper'>
            <Navbar
                title='Vehicles'
            />
            <div className='sides'>
                <Filtering
                    levels={levelOptions}
                    types={typeOptions}
                    filters={this.state.filters}
                    updateFilters={filters => this.setState({ filters, lowerIndex: 0 })}
                    updateQuery={query => this.setState({ query, lowerIndex: 0 })}
                />
                <Listing
                    vehicles={vehicles.slice(lowerIndex, lowerIndex + PAGE_SIZE)}
                    lower={lowerIndex}
                    step={PAGE_SIZE}
                    max={vehicles.length-1}
                    updateIndex={this.updateLowerIndex}
                />
            </div>
            <HandyUI
                onPopulate={this.populate}
                onEnter={this.onEnter}
                onExit={this.onExit}
                options={typeOptions}
            />
        </div>)
    }
})

ReactDOM.render(<App />, document.getElementById("app"))


// ----- Define helpers for the 'backend'

function loadEntries(from) {
    return garage.list(BATCH_SIZE, from).map(e => ({
        [e.vehicle.license]: {
            slot: e.spot.place,
            type: e.vehicle.type,
            level: e.spot.floor
        }
    }))
}

function populateGarage() {
    let vehicles = []
    for (var i = 0; i < 140; i += 1) {
        let type = YsuraGarage.Vehicle[Math.random() > 0.5 ? 'CAR' : 'MOTORBIKE']
        var license = ""
        for (var j = 0; j < 10; j += 1) {
            license += String.fromCharCode(Math.floor(Math.random() * 50) + 65) // Very artificial
        }

        vehicles.push(new YsuraGarage.Vehicle(type, license))
    }
    vehicles.forEach(v => garage.enter(v))
}
