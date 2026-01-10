import "../App.css";

export default function UserSelectVoice({voices,value,setValue}){

    //refer : https://docs.heygen.com/reference/list-voices-v2

    if(!Array.isArray(voices) || voices.length === 0){
        return <p>Loading the voices please wait⌛</p>
    }

    return(
        <div>
            <h4 className="label">Select your desired voice</h4>
            <div className="voiceCon">

            {voices.map((voice)=>(
                <div key={voice.voice_id} className="voiceR">
                    <input type="radio" name="voice" value={voice.voice_id} checked={value === voice.voice_id} onChange={()=>setValue(voice.voice_id)}/>
                    <span>{voice.name} ({voice.gender})</span>

                    {/* conditional rendering to show the audio play button when we have the preview_audio */}
                    {voice.preview_audio && (
                        <audio controls src={voice.preview_audio}/>
                    )}

                </div>
            ))}
            </div>
        </div>

    );
}