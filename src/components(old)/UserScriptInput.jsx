import "../App.css";

export default function UserScriptInput({text,setText}){
    //getting the state text and to set its value a function as props from app.jsx.. aslo make sure to put limit on the text that can be typed, because credits are limited.
    return(
        <textarea id="textIn" value={text} maxLength={200} placeholder="Enter your script here(Max 200 chars)" onChange={(e)=>setText(e.target.value)}/>
    );
}