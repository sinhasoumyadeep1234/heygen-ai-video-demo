import "../App.css";
//if a video got generated we will use this component to show the generated video

export default function GeneratedVideoOutput({videoUrl}){
    if(!videoUrl){
        return null;
    }

    //else show the video using video tag
    return(
        <div>
            <h3>Congratulations🤩👏 Your Video Is Ready</h3>
            <video src={videoUrl} controls width="400"/>
            <h5>You can also access and download your video here : <a href={videoUrl} target="_blank" rel="noopener noreferrer">Click here👇</a></h5>
        </div>
    );
}