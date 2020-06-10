import React from 'react'
import Header from '../../components/Header'
import Main from '../../components/Main'

import './styles.css'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <Header />
                <Main />
            </div>
        </div>
    )
}

export default Home