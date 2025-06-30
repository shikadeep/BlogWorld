import { useState } from 'react'
import './App.css'
// import Navbar from './component/Navbar'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>

     <div>
      {/* <Navbar/> */}
      <Outlet/>
     </div>

    </>
  )
}
export default App