import { useState, useEffect } from "react"
import '../App.css';

export default function Dashboard(){
  //create a state to hold the video details of local storage if any
  const [videos,setVideos]=useState([]);

  //whenever user opens this component we wanna make sure local storage gets fetched and the video state is populated with the data, so that we can use map over it and display the items
  useEffect(()=>{
    const stored = JSON.parse(localStorage.getItem("videos")) || [];
    //update the state
    setVideos(stored);
  },[]);

  //if the state is empty show user no videos created to show
  if(videos.length === 0){
    return <h2 className="heading">Sorry!! No videos created till now</h2>;
  }

  //else map over the state and display the videos
  return(
    <div className="dashBoardContainer">
        <h2 className="heading"> Your Recently Generated Videos 🤩</h2>

        {videos.map((video,index)=>(
            <div className="videoDashCon" key={index}>
                <video className="vid" src={video.url} controls width="100%"/>

                <h4>Created on: {new Date(video.createdAt).toLocaleString()}</h4>

                <a href={video.url} target="_blank">Download Now</a>
            </div>
        ))}
    </div>
  );
}