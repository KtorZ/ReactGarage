import React from 'react'
import './SearchBar.sass'

export default React.createClass({
    propTypes: {
        onSearch: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    },

    handleSubmit(e) {
        let value = e.target.value || ""
        if (value.length <= 3) {
            this.props.onCancel()
            return
        }
        this.props.onSearch(value)
    },

    render() {
        return (
            <div className='search_bar'>
                <span className='icon'><i className='fa fa-search'></i></span>
                <input type='search' onChange={this.handleSubmit} />
            </div>
        )
    }
})
