import React from 'react'
import Header from '../../components/Header'
import SignupForm from '../../components/SignupForm'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import './styles.css'

const CreatePoint = () => {
    return (
        <div>
            <div id="page-create-point">
                <Header>
                    <Link to="/">
                        <FiArrowLeft />Voltar a Home
                    </Link>
                </Header>
                <SignupForm/>
            </div>
        </div>
    )
}

export default CreatePoint