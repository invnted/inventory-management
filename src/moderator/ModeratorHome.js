import React from 'react'
import ModeratorNavbar from './ModeratorNavbar'

function ModeratorHome() {
  return (
    <div className='bg-sky-300 h-screen'>
      <ModeratorNavbar/>
      <div className=' flex justify-center items-center'>
        This is a Moderator Home page
      </div>
    </div>
  )
}

export default ModeratorHome