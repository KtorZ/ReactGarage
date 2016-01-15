import React from 'react'
import './Navbar.sass'

export default React.createClass({
    propTypes: {
        title: React.PropTypes.string
    },

    render() {
        return (<div className='navbar'>
            <span className='icon'><i className='fa fa-bars'></i></span>
            <span className='title'>{this.props.title}</span>
        </div>)
    }
})
