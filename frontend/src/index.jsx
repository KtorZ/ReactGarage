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

let App = React.createClass({
    getInitialState() {
        return {
            entries: loadEntries(BATCH_SIZE),
            lowerIndex: 0,
            filters: { level: [], type: [] },
            query: null
        }
    },

    getVehicleList() {
        let { filters, entries, query } = this.state
        let vehicles = filterEntries(
                Object.keys(filters).map(k => ({ prop: k, allowed: filters[k] })),
                entries
        )

        if (query != null) { vehicles = vehicles.filter(x => query.test(x.license)) }
        return vehicles
    },

    updateLowerIndex(index) {
        let state = { lowerIndex: index }
        if (index + PAGE_SIZE >= this.getVehicleList().length) {
            let lastEntry = this.state.entries.slice(-1)
            let entries = loadEntries(BATCH_SIZE, lastEntry.length > 0 ? lastEntry[0].license : undefined)
            if (entries && entries.length > 0) {
                state = Object.assign(state, { entries: [].concat.apply(this.state.entries, entries) })
            }
        }
        this.setState(state)
    },

    // ----- Handy UI
    populate() {
        populateGarage()
        this.setState({ entries: loadEntries(BATCH_SIZE) })
    },

    onEnter(license, type) {
        let entry = garage.enter(new YsuraGarage.Vehicle(type, license))
        if (entry === YsuraGarage.ErrNoMoreSpace || entry === YsuraGarage.ErrAlreadyInGarage) {
            alert(entry.message)
            return
        }
        this.setState({
            entries: this.state.entries.concat({
                license: entry.vehicle.license,
                slot: entry.spot.place,
                type: entry.vehicle.type,
                level: entry.spot.floor
            })
        })
    },

    onExit(license) {
        let vehicle = garage.exit(license)
        if (vehicle === YsuraGarage.ErrNotInGarage) {
            alert(vehicle.message)
            return
        }
        let newEntries = loadEntries(this.state.entries.length - 1)
        if (newEntries.length <= this.state.lowerIndex + PAGE_SIZE) {
            this.setState({ entries: newEntries, lowerIndex: Math.max(this.state.lowerIndex - PAGE_SIZE, 0)})
            console.log(this.state.lowerIndex)
            return
        }
        console.log(this.state.lowerIndex)
        this.setState({ entries: newEntries })
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
                    updateQuery={query => this.setState({ query })}
                />
                <Listing
                    vehicles={vehicles.slice(lowerIndex, lowerIndex + PAGE_SIZE)}
                    lower={lowerIndex}
                    step={PAGE_SIZE}
                    max={vehicles.length-1}
                    updateIndex={i => this.updateLowerIndex(i)}
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

function loadEntries(batch, from) {
    return garage.list(batch, from).map(e => ({
        license: e.vehicle.license,
        slot: e.spot.place,
        type: e.vehicle.type,
        level: e.spot.floor
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
