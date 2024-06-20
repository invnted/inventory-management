import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import Asidebar from '../components/Asidebar'
import DashBoard from '../pages/DashBoard'

function Home() {
    return (
        <>
            <Navbar/>
            <DashBoard/>
        </>




    )
}

export default Home