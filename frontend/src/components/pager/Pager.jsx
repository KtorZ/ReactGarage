import React from 'react'

export default React.createClass({
    propTypes: {
        lower: React.PropTypes.number.isRequired,
        upper: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        title: React.PropTypes.string.isRequired,
        onClickUp: React.PropTypes.func.isRequired,
        onClickDown: React.PropTypes.func.isRequired
    },

    render() {
        const {lower, upper, max, title} = this.props
        return(
            <div className='pager'>
                <div className='pager_semiheightline'>
                    {lower}<br/>{upper}
                </div>
                <div className='pager_fullheightline pager_title'>
                    /{max}
                </div>
                <div className='pager_semiheightline'>
                    {title}
                </div>
                <div className='pager_fullheightline'>
                    <span className='icon'><i className='fa fa-chevron-up'></i></span>
                    <span className='icon'><i className='fa fa-chevron-down'></i></span>
                </div>
            </div>
        )
    }
})
