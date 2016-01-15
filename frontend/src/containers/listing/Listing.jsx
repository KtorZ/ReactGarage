import React from 'react'
import VehicleList from '../../components/vehicle_list/VehicleList'
import Pager from '../../components/pager/Pager'

export default React.createClass({
    propTypes: {
        vehicles: React.PropTypes.arrayOf(React.PropTypes.shape({
            license: React.PropTypes.string,
            slot: React.PropTypes.number,
            type: React.PropTypes.string,
            level: React.PropTypes.number
        })).isRequired,
        updateIndex: React.PropTypes.func.isRequired,
        step: React.PropTypes.number.isRequired,
        lower: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired
    },

    render() {
        let { max, lower, step, vehicles } = this.props

        if (max < 0) {
            return (<div className='listing'></div>)
        }

        return (<div className='listing'>
            <Pager
                max={max}
                lower={lower}
                upper={Math.min(max, lower+step-1)}
                title='Vehicles'
                onClickUp={() => this.props.updateIndex(lower - step)}
                onClickDown={() => this.props.updateIndex(lower + step)}
            />
            <VehicleList
                vehicles={vehicles}
            />
        </div>)
    }
})
