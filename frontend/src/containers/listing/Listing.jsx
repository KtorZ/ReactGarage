import React from 'react'
import VehicleList from '../../components/vehicle_list/VehicleList'

export default React.createClass({
    propTypes: {
        vehicles: React.PropTypes.arrayOf(React.PropTypes.shape({
            license: React.PropTypes.string,
            slot: React.PropTypes.number,
            type: React.PropTypes.string,
            level: React.PropTypes.number
        })).isRequired,
        update: React.PropTypes.func.isRequired
    },

    render() {
        return (<div id='listing'>
            <VehicleList vehicles={this.props.vehicles} />
        </div>)
    }
})
