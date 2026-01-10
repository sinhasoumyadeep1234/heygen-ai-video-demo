import "../App.css";

export default function UserSelectVoice({voices,value,setValue,setAudioPreviewUrl}){

    //refer : https://docs.heygen.com/reference/list-voices-v2

    if(!Array.isArray(voices) || voices.length === 0){
        return <p>Loading the voices please wait⌛</p>
    }

    return(  
        <div>  
    
            <h4 className="label">Select your desired voice</h4>
            <div className="voiceCon">
            
                {voices.map((voice)=>{
                //create a variable that will track the voice that has preview available
                const hasPreview=voice.preview_audio && voice.preview_audio.trim() !== "";
                return(
                        <div key={voice.voice_id} className="voiceR">
                                <input type="radio" name="voice" value={voice.voice_id} checked={value === voice.voice_id} onChange={()=>setValue(voice.voice_id)}/>
                                <span>{voice.name} ({voice.gender})</span>

                                {/* a button with each voice sample so that when clicked it will set the audiopreview url state with the current url..but check if it has audio preview url or not */}
                            {hasPreview ? (<button key={voice.voice_id} onClick={()=>setAudioPreviewUrl(voice.preview_audio)} style={{margin:"2px"}}>▶️Preview {voice.name} ({voice.gender})</button>) : (<span>No preview available for this voice</span>)}
                        </div>
                );
                })}     
            </div>
          </div> 
          
    );
        
}