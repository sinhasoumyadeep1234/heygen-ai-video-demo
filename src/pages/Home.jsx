import '../App.css'
import { useState, useEffect } from 'react'

//importing all the created components
import UserScriptInput from '../components/UserScriptInput';
import UserSelectAvatar from '../components/UserSelectAvatar';
import UserSelectVoice from '../components/UserSelectVoice';
import GeneratedVideoOutput from '../components/GeneratedVideoOutput';

//importing all the api call functions created
import { getAvatar,getVoice,createVideo,getVideoStatus } from '../api/script';

import ScriptTypeSelector from '../components/ScriptTypeSelector'
import TopicInput from '../components/TopicInput';
import VideoLinkInput from '../components/VideoLinkInput';

const Home = () => {
    //State to hold the avatars data(array of objects)
  const [avatars,setAvatars]=useState([]);

  //state to hold the voices data(array of objects)
  const [voices,setVoices]=useState([]);

  //state to hold the user typed prompt: will be sent as props to the component UserScriptInput
  //const [text,setText]=useState("");

  //state to hold the avatar_id, will go as props(value,setValue) into UserSelectAvatar component
  const [avatarId,setAvatarId]=useState("");

  //state to hold the voice_id, will go as props(value,setValue) into UserSelectVoice component
  const [voiceId,setVoiceId]=useState("");

  //state to hold the status of our video generation
  const [status,setStatus]=useState("");

  //state to hold the video url, will go as props(value,setValue) into GeneratedVideoOutput component
  const [videoUrl,setVideoUrl]=useState("");

  //state to hold current user clicked url
  const [audioPreviewUrl,setAudioPreviewUrl]=useState(null); 
    //adding a global audio element whose src will be the one user clicks to hear the sample audio. We have to pass this state and its updater function to the userselectvoice component so as to set this state with appropriate audio url.

  

   // state to hold the script type user selects and based on this state value we show diffrent components
    const [scriptType,setScriptType]=useState("manual");//by default its manual


  //set status of script generation by ai
  const [statusTextScript,setStatustextScript]=useState("Script not generated yet..please wait");

    
  //state to hold the user typed prompt: will be sent as props to the component UserScriptInput..for every script there is this state finalScript
  //state to handle and manage final script that goes for video creation
  const [finalScript,setFinalScript]=useState("");


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
    if(!finalScript || !avatarId || !voiceId){
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
                        input_text:finalScript,
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
    <div id='containerMain'>
          <h2 className='heading'>AI-Video-Generation-Website</h2>

          <h3 className='heading'>Step 1 : Choose your script type</h3>

           {/* based on the state scriptType we will show respective components for data input as user selects*/}
          <ScriptTypeSelector value={scriptType} setValue={setScriptType}/>

          {/* call different inputs based on state */}
          {scriptType === "manual" && (
              <UserScriptInput text={finalScript} setText={setFinalScript}/>
          )}

          {scriptType === "topic" && (
            <TopicInput setText={setFinalScript} setStatustextScript={setStatustextScript}/>
          )}

          {scriptType === "video" && (
            <VideoLinkInput setText={setFinalScript} setStatustextScript={setStatustextScript}/>
          )}
            
          {/* status of generated text   */}
          <h4>{statusTextScript}</h4>

          {/* final text that goes to generate video*/}
          <label className='label'>Final Script(Editable)</label>
          <textarea value={finalScript} onChange={(e)=>setFinalScript(e.target.value)} rows={6} placeholder='Your final script appears here...'/>

           <br/>
          <h3 className='heading'>Step 2 : Select your avatar</h3>
          <UserSelectAvatar avatars={avatars} value={avatarId} setValue={setAvatarId}/> <br/>

          <h3 className='heading'>Step 3 : Select your desired voice(You can listen to the sample audio)</h3>
            <UserSelectVoice voices={voices} value={voiceId} setValue={setVoiceId} setAudioPreviewUrl={setAudioPreviewUrl}/> <br/>
          <h3>Click here to listen the sample voice</h3>
          {/* Global audio element for sample voice: add the state as key else the first selected audiopreviewurl selected as state value will remain permanent and will not change..key makes the component load when state changes.also for some voices there is no sample voice present hence dont show the audio player for them using conditionalrendering */}

          {audioPreviewUrl && (<audio key={audioPreviewUrl} id="voice-Preview" src={audioPreviewUrl} autoPlay controls/> )}
          

          <h3 className='heading'>Step 4 : Click here to generate your video</h3>
          {/* button that will trigger the function handleGenerateVideo to start generation process with user entered data.  */}
          <button className='btn' onClick={handleGenerateVideo}>Generate your video</button> <br/>

          {/* showing video generation status only when there is some status..i.e. conditional rendering */}
          {status && <h4 className='status'>{status}</h4>} <br/>

          {/* video player */}
          <GeneratedVideoOutput videoUrl={videoUrl} />
      </div>
  )
}

export default Home