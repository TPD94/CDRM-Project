import React from 'react'
import MainNav from './MainNav/MainNav' 
import Footer from './Footer/Footer'
import NavHead from './Header/Header'

function Sidebar() {
  return (
    <div className='flex flex-col w-full h-full bg-zinc-900 border-r-1'>
        <div className='w-full h-1/10'>
            <NavHead />
        </div>
        <div className='w-full h-8/10'>
            <MainNav />
        </div>
        <div className='w-full h-1/10'>
            <Footer />
        </div>
    </div>
  )
}

export default Sidebar
