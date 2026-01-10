import "../App.css";

//for this there will be a select area with a dropdown from where user can select his/her desired avatar( name and gender shown)

export default function UserSelectAvatar({avatars,value,setValue}){
    //avatar state: holds all avatar data,value state: to hold the one avatar_id value user selects and the function to update the state with the value user selected..using map function traverse the avtar state and creating the options.Note: Extract the value as "avatar_id" to get the respective avatar : refer : https://docs.heygen.com/reference/list-avatars-v2
    return(
    <select onChange={(e)=>setValue(e.target.value)} value={value}>
        <option value="">Select your Avatar</option>
        {avatars.map((element)=>(
            <option key={element.avatar_id} value={element.avatar_id}>{element.avatar_name} ({element.gender})</option>
        ))}
    </select>
    );
}