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
        update: React.PropTypes.func.isRequired
    },

    render() {
        return (<div className='listing'>
            <Pager
                lower={0}
                upper={10}
                max={100}
                title='Vehicle'
                onClickUp={ () => console.log('click up') }
                onClickDown={ () => console.log('click down') }
            />
            <VehicleList
                vehicles={this.props.vehicles}
            />
        </div>)
    }
})
