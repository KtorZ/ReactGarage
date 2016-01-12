import React from 'react'
import './VehicleList.sass'

export default React.createClass({
    propTypes: {
        vehicles: React.PropTypes.arrayOf(React.PropTypes.shape({
            license: React.PropTypes.string,
            level: React.PropTypes.number,
            type: React.PropTypes.string,
            slot: React.PropTypes.number
        })).isRequired
    },

    render() {
        const { vehicles } = this.props
        let vehiclesDivs = vehicles.map(v => (
            <div key={v.license} className='row'>
                <div className='col'>{v.license}<br/>{v.type}</div>
                <div className='spacer'></div>
                <div className='col'>Level {v.level}<br/>Slot: {v.slot}</div>
            </div>
        ))
        return (
            <div className='vehicle_list'>
                {vehiclesDivs}
            </div>
        )
    }
})
