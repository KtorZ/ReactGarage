import React from 'react'
import './HandyUI.sass'

export default React.createClass({
    propTypes: {
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string,
            displayName: React.PropTypes.string
        })).isRequired,
        onPopulate: React.PropTypes.func.isRequired,
        onEnter: React.PropTypes.func.isRequired,
        onExit: React.PropTypes.func.isRequired
    },

    onEnter() {
        this.props.onEnter(this.refs.license.value, this.refs.type.value)
    },

    onExit() {
        this.props.onExit(this.refs.license.value)
    },

    render() {
        let options = this.props.options.map(x => (
            <option key={x.id}value={x.id}>{x.displayName}</option>
        ))

        return (<div className='handy-ui'>
            <div>
                <input ref='license' type='text' placeholder='License' />
                <select ref='type'>{options}</select>
                <div className='button enter' onClick={this.onEnter}>
                    <span className='icon'><i className='fa fa-car'></i></span>
                    <span>Enter</span>
                </div>
                <div className='button exit' onClick={this.onExit}>
                    <span className='icon'><i className='fa fa-sign-out'></i></span>
                    <span>Exit</span>
                </div>
            </div>
            <div>
                <div className='button populate' onClick={this.props.onPopulate}>
                    <span className='icon'><i className='fa fa-magic'></i></span>
                    <span>Populate</span>
                </div>
            </div>
        </div>)
    }
})
