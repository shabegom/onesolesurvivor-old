import React, { Component } from 'react'
import logo from './survivor-logo.png'

const imageStyle = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '300px',
    width: '50%',
    paddingTop: '10px'
}

class Header extends Component {
    render() {
        return (
            <div>
                <div className="site-header">
                    <h1>One Sole Survivor</h1>
                    </div>
                <h2 className="subhead">Outwatch, OutPick, Outscore </h2>
                <img alt='Survivor Logo' src={logo} style={imageStyle} />
            </div>
        )
    }
}

export default Header
