import React from 'react'
import SearchBar from '../../components/search_bar/SearchBar'
import Filters from '../../components/filters/Filters'

export default React.createClass({
    propTypes: {
        levels: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.number,
            displayName: React.PropTypes.string
        })).isRequired,
        types: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.string,
            displayName: React.PropTypes.string
        })).isRequired,
        filters: React.PropTypes.objectOf(React.PropTypes.arrayOf(React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string
        ]))).isRequired,
        updateFilters: React.PropTypes.func.isRequired,
        updateQuery: React.PropTypes.func.isRequired

    },

    handleFilter(prop, f) {
        let filter = this.props.filters[prop]
        if (filter.indexOf(f) === -1) {
            this.props.updateFilters(
                Object.assign({}, this.props.filters, { [prop]: filter.concat(f) }))
            return
        }
        this.props.updateFilters(
            Object.assign({}, this.props.filters, { [prop]: filter.filter(x => x !== f) }))
    },

    handleSearch(query){
        this.props.updateQuery(query == null ? null : new RegExp(query))
    },

    render() {
        let {levels, types, filters} = this.props

        return (<div className='filtering'>
            <div id='search_bar'>
                <SearchBar
                    onSearch={this.handleSearch}
                    onCancel={this.handleSearch}
                />
            </div>
            <div id='filters'>
                <Filters
                    title='Levels'
                    options={levels}
                    selected={filters.level}
                    toggleOption={this.handleFilter.bind(this, 'level')}
                />
                <Filters
                    title='Type'
                    options={types}
                    selected={filters.type}
                    toggleOption={this.handleFilter.bind(this, 'type')}
                />
            </div>
        </div>)
    }
})
