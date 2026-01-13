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

const Home = ({isGenerating,setIsgenerating}) => {
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
  const [statusTextScript,setStatustextScript]=useState("Script not generated yet..please type something to generate");

    
  //state to hold the user typed prompt: will be sent as props to the component UserScriptInput..for every script there is this state finalScript
  //state to handle and manage final script that goes for video creation
  const [finalScript,setFinalScript]=useState("");


  //state to hold the video orientation details/dimension
  const [orientation,setOrientation]=useState("");


  


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
    if(!finalScript || !avatarId || !voiceId || !orientation){
      alert("Please fill all the required fields and choose the avatar,voices,video orientation if not done");
      return;
    }

    //if input is too short
    if(finalScript.length<10 || finalScript.length>200){
      alert("Script is either too short or too long to process(Tip: Keep the script short to avoid loosing credits)");
      return;
    }

    //update : 12/01/26 : set the dimension of the video to pass it during video creation request
    const dimension = orientation==="horizontal" ? {width:1280,height:720} : {width:720,height:1280};

    //replace this with dimension entry in video input's dimesion..previously we were sending horizontal specs by default.


    //else show status generating video
    setStatus("Generating video..please wait⌛");

    //video generation status for button
    setIsgenerating(true);

    setVideoUrl("");


    try{
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
            ],dimension,
            });

            //now matter video generation is successful or not we get a video_id thus extracting the video_id
            const videoId=res.data.video_id;

            //now running an infinite while loop to check the video generation status after 5 seconds and show the updates to user..for status refer : https://docs.heygen.com/reference/video-status

            while(true){
              await new Promise((r)=>setTimeout(r,5000));

              //after returning from 5 seconds rest check status of the video
              const statusCondition=await getVideoStatus(videoId);

              //if completed : update the url and finish
              if(statusCondition.data.status === "completed"){

                //update : save the latest created video details by user to the localstorage(so as to show them in the dashboard)..created an object to store the video details we need
                const newVideo={
                  url:statusCondition.data.video_url,
                  createdAt:new Date().toISOString(), //as we need date in string format
                  orientation,
                };

                //get the list of existing videos in localstorage if any(after 2-3 use) or create an empty array
                const existingVideos = JSON.parse(localStorage.getItem("videos")) || [];

                // set the current video object to it
                localStorage.setItem("videos",JSON.stringify([newVideo,...existingVideos]));

                //now modifying dashboad.jsx to handle this case



                setVideoUrl(statusCondition.data.video_url);
                setStatus("Video generated successfully✅");
                break;
              }

              //if pending then loop will continue....else if status is failed then break
              if(statusCondition.data.status === "failed"){
                setStatus("Sorry..video generation failed❌");
                break;
              }
            }
    }catch(err){
      setStatus("Something went wrong ❌");
    }finally{
      setIsgenerating(false); //no matter what change the status to false at end
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
              <UserScriptInput text={finalScript} setText={setFinalScript} disabled={isGenerating}/>
          )}

          {scriptType === "topic" && (
            <TopicInput setText={setFinalScript} setStatustextScript={setStatustextScript} disabled={isGenerating}/>
          )}

          {scriptType === "video" && (
            <VideoLinkInput setText={setFinalScript} setStatustextScript={setStatustextScript} disabled={isGenerating}/>
          )}
            
          {/* status of generated text   */}
          <h4>{statusTextScript}</h4>

          {/* final text that goes to generate video*/}
          <label className='label'>Final Script(Editable)</label>
          <textarea value={finalScript} onChange={(e)=>setFinalScript(e.target.value)} rows={6} placeholder='Your final script appears here...'/>

           <br/>
          <h3 className='heading'>Step 2 : Select your avatar</h3>
          <UserSelectAvatar avatars={avatars} value={avatarId} setValue={setAvatarId} disabled={isGenerating}/> <br/>

          <h3 className='heading'>Step 3 : Select your desired voice(You can listen to the sample audio)</h3>
            <UserSelectVoice voices={voices} value={voiceId} setValue={setVoiceId} setAudioPreviewUrl={setAudioPreviewUrl} disabled={isGenerating}/> <br/>
          <h3 className='heading'>Click on the voice from above list to play the sample voice here</h3>
          {/* Global audio element for sample voice: add the state as key else the first selected audiopreviewurl selected as state value will remain permanent and will not change..key makes the component load when state changes.also for some voices there is no sample voice present hence dont show the audio player for them using conditionalrendering */}

          {audioPreviewUrl && (<audio key={audioPreviewUrl} id="voice-Preview" src={audioPreviewUrl} autoPlay controls/> )}
          
          {/* video dimension selector for ratio of the video */}
          <h3 className='heading'>Step 4 : Choose video orientation</h3>
          <div className='orBox'>
              <label>
                <input type="radio" value="horizontal" checked={orientation==="horizontal"} onChange={(e)=>setOrientation(e.target.value)}/> Horizontal (16:9)
              </label>
              <label>
                <input type='radio' value="vertical" checked={orientation==="vertical"} onChange={(e)=>setOrientation(e.target.value)}/> Vertical (9:16)
              </label>
          </div>



          <h3 className='heading'>Step 5 : Click here to generate your video</h3>
          {/* button that will trigger the function handleGenerateVideo to start generation process with user entered data. Update 12/01/2026 : Disable the button if already generating a video */}
          <button className='btn' disabled={isGenerating} onClick={handleGenerateVideo} >{isGenerating ? "Generating..." : "Generate your video"}</button> <br/>

          {/* showing video generation status only when there is some status..i.e. conditional rendering */}
          {status && <h4 className='status'>{status}</h4>} <br/>

          {/* video player */}
          <GeneratedVideoOutput videoUrl={videoUrl} />
      </div>
  )
}

export default Home