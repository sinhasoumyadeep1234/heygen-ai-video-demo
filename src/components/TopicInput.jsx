import { useState } from "react";
import {generateScriptFromText} from "../api/generateScripts";

//set text to set the finally generated script to ui and setstatus to show the script generation status to the Ui.

//user entered text
export default function TopicInput({setText,setStatustextScript}){
    // state to handle the topic user entered and the tone
    const [topic,setTopic]=useState("");
    const[tone,setTone]=useState("casual"); //by default

    return(
        <>
            {/* input field for topic/product/service */}
            <input placeholder="Enter your script topic/product/service here" onChange={(e)=>setTopic(e.target.value)} style={{width:"360px"}}/>

            {/* dropdown select for tone choice */}
            <select onChange={(e)=>setTone(e.target.value)}>
                {/* options */}
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="energetic">Energetic</option>
                <option value="educational">Educational</option>
            </select>

            {/* button to send the data to the generatescript.js and further to backend */}
            <button onClick={async()=>{
                setStatustextScript("Generating script...");
                const res=await generateScriptFromText(topic,tone);

                // update the states of text and status
                setText(res.script); //as res.json({script}) is sent from backend

                setStatustextScript("Script ready");
            }}>
                Generate Script
            </button>
        </>
    );

}