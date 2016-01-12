import React from 'react'
import './Filters.sass'

export default React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        options: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
            displayName: React.PropTypes.string
        })).isRequired,
        selected: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])),
        toggleOption: React.PropTypes.func.isRequired
    },

    toggleOption(option) {
        this.props.toggleOption(option)
    },

    render() {
        const { title, options } = this.props
        let optsLi = options.map(o => {
            let selected = this.props.selected || []
            let c = selected.indexOf(o.id) === -1 ? '' : 'active'
            return (<li
                className={c}
                key={o.id}
                onClick={() => this.toggleOption(o.id)}>
                <span>{o.displayName}</span>
            </li>)
        })
        return (
            <div className='filters'>
                <h4>{title}</h4>
                <ul>{optsLi}</ul>
            </div>
        )
    }
})
