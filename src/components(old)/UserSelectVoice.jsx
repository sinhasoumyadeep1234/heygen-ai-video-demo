import "../App.css";

export default function UserSelectVoice({voices,value,setValue}){

    //refer : https://docs.heygen.com/reference/list-voices-v2

    //same as avatar selection, here to capture the voice id of the selected voice. Value state will hold the voice_id

    return(
          <select onChange={(e)=>setValue(e.target.value)} value={value}>
            <option value="">Select your desired voice</option>
            {voices.map((element)=>(
                <option key={element.voice_id} value={element.voice_id}>{element.name} (gender : {element.gender})</option>
            ))}
          </select>  
    );

}