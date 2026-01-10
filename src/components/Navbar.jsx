import { Link } from "react-router-dom";
import '../App.css'

export default function Navbar(){
    return(
        <nav style={navbarStyles}>
            <h1>AI Video Generation Platform(SOU-AI)</h1>
            <div style={navbarStyles}>
                <Link className="l" to="/">Create Video</Link>
                <Link className="l" to="/dashboard">My Videos</Link>
            </div>
        </nav>
    );
}

const navbarStyles={
    display:"flex",
    justifyContent:"space-between",
    padding:"10px 15px",
    background:"#efbf99",
    color: "#000000",
    gap:"12px",
    alignItems:"center",
    fontSize:"12px",
    textDecoration:"none"
};
