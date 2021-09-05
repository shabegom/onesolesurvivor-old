import React, { Component } from 'react'
import logo from './survivor-logo.WEBP'

const imageStyle = {
    width: "15%"
}

class Header extends Component {
    render() {
        return (
            <div className="header">
                <img alt='Survivor Logo' src={logo} style={imageStyle} />
                <div>
                <div className="site-header">
                    <h1>One Sole Survivor</h1>
                    </div>
                <h2 className="subhead">Out pick, Out watch, Out score </h2>
                </div>
            </div>
        )
    }
}

export default Header
