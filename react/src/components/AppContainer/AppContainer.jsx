import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Home from '../Pages/Home'
import API from '../Pages/API'
import Cache from '../Pages/Cache'
import TestPlayer from '../Pages/TestPlayer'
import MyAccount from '../Pages/MyAccount'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function AppContainer() {
  return (
    <Router>
    <div className='flex flex-row'>
        <div className='w-1/8 h-dvh overflow-y-auto'>
            <Sidebar />
        </div>
        <div className='w-7/8 h-dvh overflow-y-auto scroll-smooth' id='main_content'>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api" element={<API />} />
        <Route path="/testplayer" element={<TestPlayer />} />
        <Route path="/cache" element={<Cache />} />
        <Route path="account" element={<MyAccount/>} />
        </Routes>
        </div>
    </div>
    </Router>
  )
}

export default AppContainer
