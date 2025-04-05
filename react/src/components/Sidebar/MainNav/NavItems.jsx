import React from 'react'
import { Link, useLocation } from 'react-router-dom';

function NavItems() {
  const location = useLocation();

  return (
    <>
    <div className={`w-full h-1/10 flex flex-col items-center ${location.pathname === '/' ? 'bg-black/50' : 'hover:bg-black/35'} transition-all duration-300 ease-in-out overflow-hidden mt-5`}>
        <Link to='/' className='flex w-8/10 items-center'>
          <img src='/home.svg' alt='Home' className='flex h-5/10 w-3/10'/>
          <p className='w-7/10 h-full flex items-center text-xl text-white'>Home</p>
        </Link>
    </div>
    <div className={`w-full h-1/10 flex flex-col items-center ${location.pathname === '/Cache' ? 'bg-black/50' : 'hover:bg-black/35'} transition-all duration-300 ease-in-out overflow-hidden`}>
        <Link to='/Cache' className='flex w-8/10 items-center'>
          <img src='/search.svg' alt='Search' className='flex h-5/10 w-3/10'/>
          <p className='w-7/10 h-full flex items-center text-xl text-white'>Cache</p>
        </Link>
    </div>
    <div className={`w-full h-1/10 flex flex-col items-center ${location.pathname === '/TestPlayer' ? 'bg-black/50' : 'hover:bg-black/35'} transition-all duration-300 ease-in-out overflow-hidden`}>
        <Link to='/TestPlayer' className='flex w-8/10 items-center'>
          <img src='/video.svg' alt='Test Player' className='flex h-5/10 w-3/10'/>
          <p className='w-7/10 h-full flex items-center text-xl text-white'>Test Player</p>
        </Link>
    </div>
    <div className={`w-full h-1/10 flex flex-col items-center ${location.pathname === '/API' ? 'bg-black/50' : 'hover:bg-black/35'} transition-all duration-300 ease-in-out overflow-hidden`}>
        <Link to='/API' className='flex w-8/10 items-center'>
          <img src='/api.svg' alt='API' className='flex h-5/10 w-3/10'/>
          <p className='w-7/10 h-full flex items-center text-xl text-white'>API</p>
        </Link>
    </div>
    <div className={`w-full h-1/10 flex flex-col items-center ${location.pathname === '/Account' ? 'bg-black/50' : 'hover:bg-black/35'} transition-all duration-300 ease-in-out overflow-hidden mt-auto`}>
        <Link to='/Account' className='flex w-8/10 items-center'>
          <img src='/profile.svg' alt='Account' className='flex h-5/10 w-3/10'/>
          <p className='w-7/10 h-full flex items-center text-xl text-white'>My Account</p>
        </Link>
    </div>
    </>
  )
}

export default NavItems
