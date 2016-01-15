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

    render() {
        let { title, options } = this.props
        let selected = this.props.selected || []
        let optsLi = options.map(o => {
            let c = selected.indexOf(o.id) === -1 ? '' : 'active'
            return (<li
                className={c}
                key={o.id}
                onClick={() => this.props.toggleOption(o.id)}>
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
