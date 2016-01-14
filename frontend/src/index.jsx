import React from 'react'
import ReactDOM from 'react-dom'
import Filtering from './containers/filtering/Filtering'
import Listing from './containers/listing/Listing'
import Navbar from './containers/navbar/Navbar'
import { filterEntries } from './utils/filters'

import './vars.sass'
import './index.sass'

const BATCH_SIZE = 80
const PAGE_SIZE = 10

let levels = [
    new YsuraGarage.Level(40),
    new YsuraGarage.Level(50),
    new YsuraGarage.Level(50),
    new YsuraGarage.Level(50),
    new YsuraGarage.Level(50)
]

let garage = new YsuraGarage.Garage(levels)

let vehicles = []
for (var i = 0; i < 200; i += 1) {
    let type = YsuraGarage.Vehicle[Math.random() > 0.5 ? 'CAR' : 'MOTORBIKE']
    vehicles.push(new YsuraGarage.Vehicle(type, `qwerty${i}`))
}
vehicles.map(v => garage.enter(v))


const levelOptions = levels.map((_, i) => ({ id: i, displayName: `Level ${i}`}))
const typeOptions = [
    { id: YsuraGarage.Vehicle.CAR, displayName: 'Car' },
    { id: YsuraGarage.Vehicle.MOTORBIKE, displayName: 'Motorbike' }
]

function loadEntries(from) {
    return garage.list(BATCH_SIZE, from).map(e => ({
        license: e.vehicle.license,
        slot: e.spot.place,
        type: e.vehicle.type,
        level: e.spot.floor
    }))
}

let App = React.createClass({
    getInitialState() {
        return {
            entries: loadEntries(),
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
            let entries = loadEntries(lastEntry.length > 0 ? lastEntry[0].license : undefined)
            if (entries && entries.length > 0) {
                state = Object.assign(state, { entries: [].concat.apply(this.state.entries, entries) })
            }
        }
        this.setState(state)
    },

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
        </div>)
    }
})

ReactDOM.render(<App />, document.getElementById("app"))
