//logic to generate texts from AI goes here..as of now we are getting demo data from backend as API are not free

const backendUrl="http://localhost:5000/api/script";

//function to send post request to backend with user entered data and return back the generated result to the ui components(home)
export async function generateScriptFromText(topic,tone) {
    const res=await fetch(`${backendUrl}/topic`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},body:JSON.stringify({topic,tone})
    });

    //return the generated response back to the frontend input field so that user can edit if required
    return res.json();
}

//function to send post request to backend with user entered videoUrl and return back the generated text extracted from the video and made a script from it to the UI(home)
export async function generateVideoScript(videoUrl) {
    const res=await fetch(`${backendUrl}/video`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},body:JSON.stringify({videoUrl})
    });
    
    // return back the response back to the UI
    return res.json();
}
