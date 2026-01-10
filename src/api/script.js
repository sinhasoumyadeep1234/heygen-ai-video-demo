 // to read API key and base url
const API_KEY=import.meta.env.VITE_HEYGEN_API_KEY;
const BASE_URL=import.meta.env.VITE_HEYGEN_WEBSITE_URL;


//functions to fetch avatars,voices,video status,generate video etc...

//1. Fetch avatar list from heygen: get request
export async function getAvatar(){
    //tested in postman
    const res = await fetch(`${BASE_URL}/v2/avatars`,{
        headers:{
            "X-API-KEY":API_KEY
        },
    });

    //return the fetched data object of avatars
    return res.json();
} 

//2. Fetch voices list from heygen : get request
export async function getVoice(){
    //tested in postman
    const res =  await fetch(`${BASE_URL}/v2/voices`,{
        headers:{
            "X-API-KEY":API_KEY
        },
    });

    //return the fetched data object of voices
    return res.json(); //as data comes in string format hence we need to convert it into json to use it.
}

//3. Function to create video : Note create video with the data user gives
export async function createVideo(userData){
    //post request to generate video with user provided data
    const res = await fetch(`${BASE_URL}/v2/video/generate`,{
        method:"POST",
        headers:{
            "X-API-KEY":API_KEY,
            "Content-Type":"application/json",
        },
        body:JSON.stringify(userData),
    });

    //return the result(error or data object that contains the generated video_id)
    return res.json();
}

//4. Function to check the status of our video creation
export async function getVideoStatus(videoId){
    //get request with video_id as query parameter to get the status of our video being generated
    const res = await fetch(`${BASE_URL}/v1/video_status.get?video_id=${videoId}`,{
        headers:{
            "X-API-KEY":API_KEY,
        },
    }

    );
    return res.json();
}