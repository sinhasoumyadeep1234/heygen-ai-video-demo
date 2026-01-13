import {Routes, Route} from "react-router-dom"
import { useState } from "react";
import './App.css'


// navbar
import Navbar from "./components/Navbar";
// dashboard(coming soon)
import Dashboard from "./pages/Dashboard";
// Home component(handles avatar,voice fetching and generate video using user selected settings main logic page)
import Home from "./pages/Home";




function App() {
 //state to hold the videogenerating true/false. And disable the button when video already generating
  const [isGenerating,setIsgenerating]=useState(false);

  return (
    <>
        {/* navbar component : passing isGenerating to disable navigation during video creation process */}
        <Navbar isGenerating={isGenerating}/>
        {/* define the routes */}
        <Routes>
          {/* passing the setter isGenerating to home to change the state accordingly when video creation is done/not done */}
            <Route path="/" element={<Home isGenerating={isGenerating} setIsgenerating={setIsgenerating}/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      
    </>
  )
}

export default App
