import {generateVideoScript} from "../api/generateScripts";
import { useState } from "react";

export default function VideoLinkInput({setText,setStatustextScript}){
    //state to hold the video url
    const [url,setUrl]=useState("");

    return(
        <>
            {/* input for videourl */}
            <input placeholder="Type/paste video link here" onChange={(e)=>setUrl(e.target.value)} style={{width:"300px"}}/>

            {/* button for submit and call backend function with the user entered data */}
            <button onClick={async ()=>{
                setStatustextScript("Processing video please wait....");
                const res=await generateVideoScript(url);
                setText(res.script);
                setStatustextScript("Script ready");
            }}>Generate script</button>
        </>
    );
}