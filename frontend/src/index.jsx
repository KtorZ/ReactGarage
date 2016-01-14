import React from 'react'
import ReactDOM from 'react-dom'
import Filtering from './containers/filtering/Filtering'
import Listing from './containers/listing/Listing'
import Navbar from './containers/navbar/Navbar'
import { filterEntries } from './utils/filters'

import './vars.sass'
import './index.sass'

const PAGE_SIZE = 10

let levels = [
    new YsuraGarage.Level(5),
    new YsuraGarage.Level(5),
    new YsuraGarage.Level(5),
    new YsuraGarage.Level(5),
    new YsuraGarage.Level(5)
]

let garage = new YsuraGarage.Garage(levels)

let vehicles = []
for (var i = 0; i < 30; i += 1) {
    let type = YsuraGarage.Vehicle[Math.random() > 0.5 ? 'CAR' : 'MOTORBIKE']
    vehicles.push(new YsuraGarage.Vehicle(type, `qwerty${i}`))
}
vehicles.map(v => garage.enter(v))


const levelOptions = levels.map((_, i) => ({ id: i, displayName: `Level ${i}`}))
const typeOptions = [
    { id: YsuraGarage.Vehicle.CAR, displayName: 'Car' },
    { id: YsuraGarage.Vehicle.MOTORBIKE, displayName: 'Motorbike' }
]

let App = React.createClass({
    getInitialState() {
        return {
            garage: garage,
            filters: { level: [], type: [] },
            query: null
        }
    },

    getVehicleList() {
        let { filters, garage, query } = this.state
        let vehicles = filterEntries(
            Object.keys(filters).map(k => ({ prop: k, allowed: filters[k] })),
            garage.list(PAGE_SIZE).map(e => ({
                license: e.vehicle.license,
                slot: e.spot.place,
                type: e.vehicle.type,
                level: e.spot.floor
            }))
        )

        if (query != null) { vehicles = vehicles.filter(x => query.test(x.license)) }
        return vehicles
    },

    render() {
        return (<div className='wrapper'>
            <Navbar
                title='Vehicles'
            />
            <div className='sides'>
                <Filtering
                    levels={levelOptions}
                    types={typeOptions}
                    filters={this.state.filters}
                    update={s => this.setState(s) }
                />
                <Listing
                    vehicles={this.getVehicleList()}
                    update={s => this.setState(s)}
                />
            </div>
        </div>)
    }
})

ReactDOM.render(<App />, document.getElementById("app"))
