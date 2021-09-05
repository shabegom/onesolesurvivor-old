import React, { Component } from 'react'
import logo from './survivor-logo.WEBP'

const imageStyle = {
    width: "20%",
    minWidth: "150px"
}

class Header extends Component {
    render() {
        return (
            <div className="header">
                    <div className="site-header">
                    <h1 className="site-name">One Sole Survivor</h1>
                </div>
                                <img alt='Survivor Logo' src={logo} style={imageStyle} className="survivor-logo" />
                <h2 className="subhead">Out pick, Out watch, Out score </h2>
            </div>
        )
    }
}

export default Header
