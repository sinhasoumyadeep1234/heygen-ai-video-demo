import {Routes, Route} from "react-router-dom"
import './App.css'


// navbar
import Navbar from "./components/Navbar";
// dashboard(coming soon)
import Dashboard from "./pages/Dashboard";
// Home component(handles avatar,voice fetching and generate video using user selected settings main logic page)
import Home from "./pages/Home";




function App() {
 
  return (
    <>
        {/* navbar component */}
        <Navbar/>
        {/* define the routes */}
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      
    </>
  )
}

export default App
