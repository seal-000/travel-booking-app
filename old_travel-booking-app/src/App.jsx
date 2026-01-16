import { useState } from 'react'
import './App.css'
import { Link, Route, Routes } from "react-router-dom";
import Home from './pages/Home';

function App() {
  

  return (
     <div className='app-container'>
       <Routes>
         <Route path='/' element={<Home />} />
       </Routes>
     </div>
  )
}

export default App
