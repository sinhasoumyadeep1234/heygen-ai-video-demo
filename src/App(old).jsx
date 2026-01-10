import { useState, useEffect } from 'react'
import './App.css'

//importing all the created components
import UserScriptInput from './components/UserScriptInput';
import UserSelectAvatar from './components/UserSelectAvatar';
import UserSelectVoice from './components/UserSelectVoice';
import GeneratedVideoOutput from './components/GeneratedVideoOutput';

//importing all the api call functions created
import { getAvatar,getVoice,createVideo,getVideoStatus } from './api/script';


function App() {
  //State to hold the avatars data(array of objects)
  const [avatars,setAvatars]=useState([]);

  //state to hold the voices data(array of objects)
  const [voices,setVoices]=useState([]);

  //state to hold the user typed prompt: will be sent as props to the component UserScriptInput
  const [text,setText]=useState("");

  //state to hold the avatar_id, will go as props(value,setValue) into UserSelectAvatar component
  const [avatarId,setAvatarId]=useState("");

  //state to hold the voice_id, will go as props(value,setValue) into UserSelectVoice component
  const [voiceId,setVoiceId]=useState("");

  //state to hold the status of our video generation
  const [status,setStatus]=useState("");

  //state to hold the video url, will go as props(value,setValue) into GeneratedVideoOutput component
  const [videoUrl,setVideoUrl]=useState("");

  //whenever our component loads for the first time we wanna make sure our avatar list and voice list is populated, so that user can select effectively



  //fixing error: d.data and v.data not always an array returned(a object is returned actually: data.voices and data.avatars which are array of objects) : https://docs.heygen.com/reference/list-voices-v2 hence add a check 
  useEffect(()=>{
    //fetching avatars and voices and populating the respective states
    getAvatar().then((d)=>setAvatars(d.data.avatars || []));
    getVoice().then((v)=>setVoices(v.data.voices || []));
  },[]);

  //now the function to use the user typed details and calls the beckend logic function to generate the video(when user clicks on the button to generate)

  async function handleGenerateVideo(){
    //checking if user has written anything/choose avatar/voice or not
    if(!text || !avatarId || !voiceId){
      alert("Please fill all the required fields and choose the avatar,voices if not done");
      return;
    }

    //else show status generating video
    setStatus("Generating video..please wait⌛");
    setVideoUrl("");

    //now sending the request of creating the video with the user data(in object format)
    const res=await createVideo({
      video_inputs:[
                {
                    character:{
                        type:"avatar",
                        avatar_id:avatarId,
                        avatar_style:"normal",
                    },
                    voice: {
                        type:"text",
                        input_text:text,
                        voice_id:voiceId,    
                    },
                    background:{
                        type:"color",
                        value:"#FFFFFF",
                    },
                } ,   
            ],dimension:{
                width:1280,
                height:720,
            },});

            //now matter video generation is successful or not we get a video_id thus extracting the video_id
            const videoId=res.data.video_id;

            //now running an infinite while loop to check the video generation status after 5 seconds and show the updates to user..for status refer : https://docs.heygen.com/reference/video-status

            while(true){
              await new Promise((r)=>setTimeout(r,5000));

              //after returning from 5 seconds rest check status of the video
              const statusCondition=await getVideoStatus(videoId);

              //if completed : update the url and finish
              if(statusCondition.data.status === "completed"){
                setVideoUrl(statusCondition.data.video_url);
                setStatus("Video generated successfully");
                break;
              }

              //if pending then loop will continue....else if status is failed then break
              if(statusCondition.data.status === "failed"){
                setStatus("Sorry..video generation failed");
                break;
              }
            }
  }

  return (
    <>
      <div id='containerMain'>
          <h2 className='heading'>AI-Video-Generation-Website</h2>

          <label className='label'>Enter Prompt</label>
          {/* Adding the components and passing the appropriate props */}
          <UserScriptInput text={text} setText={setText}/> <br/>

          <label className='label'>Choose Avatar</label>
          <UserSelectAvatar avatars={avatars} value={avatarId} setValue={setAvatarId}/> <br/>


          <label className='label'>Choose Voice</label>
          <UserSelectVoice voices={voices} value={voiceId} setValue={setVoiceId}/> <br/>

          {/* button that will trigger the function handleGenerateVideo to start generation process with user entered data  */}
          <button className='btn' onClick={handleGenerateVideo}>Generate your video</button> <br/>

          {/* showing video generation status only when there is some status..i.e. conditional rendering */}
          {status && <h4 className='status'>{status}</h4>} <br/>

          {/* video player */}
          <GeneratedVideoOutput videoUrl={videoUrl} />
      </div>
    </>
  )
}

export default App
