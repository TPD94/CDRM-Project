import React from 'react'

function NavHead() {
  return (
    <div className='flex flex-row w-full h-full shadow-lg shadow-black items-center justify-center overflow-hidden'>
        <a href='/' className='w-2/3 h-2/3 flex'>
            <img src='/logo.svg' alt='CDRM Logo'/>
        </a>
    </div>
  )
}

export default NavHead
