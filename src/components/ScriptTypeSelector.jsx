//user can select : manually type their own script,type a topic,enter a video url, updates the state accordingly

export default function ScriptTypeSelector({value,setValue}){
    return(
        <select value={value} onChange={(e)=>setValue(e.target.value)}>
            {/* options */}
            <option value="manual">Write own script</option>
            <option value="topic">Generate script from topic/keyword</option>
            <option value="video">Generate script from a video link</option>
        </select>
    );
}