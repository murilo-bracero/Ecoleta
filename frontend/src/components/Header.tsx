import React, { FunctionComponent } from 'react'
import logo from '../assets/logo.svg'

const Header: FunctionComponent = props => {
    return (
        <header id="component-header">
            <img src={logo} alt="ecoleta logo"/>
            {props.children}
        </header>
    )
}


export default Header