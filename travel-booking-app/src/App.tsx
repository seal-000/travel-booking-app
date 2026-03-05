import { useState } from 'react';
import './App.css';
import { Link, Route, Routes } from "react-router-dom";
import Home from './pages/Home.tsx';
import SearchResults from './pages/SearchResults.tsx';

function App() {
  

  return (
     <div className='app-container'>
       <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/flights' element={<SearchResults />} />
       </Routes>
     </div>
  )
}


export default App
