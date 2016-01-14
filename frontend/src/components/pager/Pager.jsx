import React from 'react'
import './Pager.sass'

export default React.createClass({
    propTypes: {
        lower: React.PropTypes.number.isRequired,
        upper: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        title: React.PropTypes.string.isRequired,
        onClickUp: React.PropTypes.func.isRequired,
        onClickDown: React.PropTypes.func.isRequired
    },

    isDownEnabled() {
        return this.props.upper < this.props.max
    },

    isUpEnabled() {
        return this.props.lower > 1
    },

    onClickUp() {
        if (!this.isUpEnabled()) { return }
        this.props.onClickUp()
    },

    onClickDown() {
        if (!this.isDownEnabled()) { return }
        this.props.onClickDown()
    },

    render() {
        const {lower, upper, max, title} = this.props
        let classUp = this.isUpEnabled() ? 'icon enabled' : 'icon'
        let classDown = this.isDownEnabled() ? 'icon enabled' : 'icon'
        return(
            <div className='pager'>
                <div className='figures'>
                    <div>{lower}</div>
                    <div>{upper}</div>
                </div>
                <div className='max'>
                    /<span className='max-number'>{max}</span>
                </div>
                <div className='title'>
                    {title}
                </div>
                <div>
                    <span className={classUp} onClick={this.onClickUp}>
                        <i className='fa fa-angle-up'></i>
                    </span>
                    <span className={classDown} onClick={this.onClickDown}>
                        <i className='fa fa-angle-down'></i>
                    </span>
                </div>
            </div>
        )
    }
})
