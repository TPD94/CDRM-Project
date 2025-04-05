import React from 'react'

function Footer() {
  return (
    <div className='flex flex-row w-full h-full items-center justify-around overflow-hidden'>
      <a href='https://discord.cdrm-project.com' className='w-1/6 h-1/6 hover:animate-bounce'>
        <img src='/discord.svg' alt='Discord Logo'/>
      </a>
      <a href='https://telegram.cdrm-project.com' className='w-1/6 h-1/6 hover:animate-bounce'>
        <img src='/telegram.svg' alt='Telegram Logo' />
      </a>
      <a href='https://github.com/tpd94' className='w-1/6 h-1/6 hover:animate-bounce'>
        <img src='/github.svg' alt='Github Logo' />
      </a>
    </div>
  )
}

export default Footer
