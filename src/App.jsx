import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './Pages/Login'
import MainPage from './Pages/MainPage';

import {MyContextProvider} from './Context/ContextDetails';
import TitleBar from './Pages/TitleBar';
import About from './Pages/About';


const NoPageFound = () => { return (<h1>No Page Found</h1>) }

function App() {
  return (
    <div>
 
      <MyContextProvider>
        <BrowserRouter>
        {/* <TitleBar /> */}
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/MainPage' element={<MainPage  />} />
            <Route path='*' element={<NoPageFound />} />

          </Routes>

        </BrowserRouter>
      </MyContextProvider>
    </div>
  )
}

export default App
