import "../App.css";
// refer : https://docs.heygen.com/reference/list-avatars-v2
//for this there will be a select area with a dropdown from where user can select his/her desired avatar( name and gender shown)

export default function UserSelectAvatar({avatars,value,setValue}){
   if(!Array.isArray(avatars) || avatars.length === 0){
        // Show loading
        return <p>Loading avatars please wait⌛</p>;
   }    

   //removing select, adding card style display

//    avatarcard class + if avatarid is currently equal to value..in other words if the clicked on the specific avatar card then it gets a class added named as selected. Thus selected avatar will have slightly different color than others.
    return(
        <div>
            <h4 className="label">Select your avatar</h4>
            <div className="avatar-con">
            <div className="card">
                {avatars.map((avatar)=>(
                    <div key={avatar.avatar_id} className={`avatarCard ${value === avatar.avatar_id ? "selected" : ""}`} onClick={()=>setValue(avatar.avatar_id)}><img src={avatar.preview_image_url} alt={avatar.avatar_name}/>
                    <p>{avatar.avatar_name} ({avatar.gender})</p></div>
                ))}
            </div>
            </div>
        </div>
    );
}