import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <>
      <hr />
      <div className='w-full flex justify-center gap-2 text-black text-xs lgtext-sm p-2'>
        <div> Copyrights 2024 |</div>
        <div>Roubly |</div>
        <div>Built with <Link href="https://roubly.com" className='cursor-pointer text-green-500 font-extrabold'>Roubly.com ⚡</Link></div>
      </div>
    </>
    
  )
}

export default Footer