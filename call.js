let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")

localVideo.style.opacity = 0
remoteVideo.style.opacity = 0

localVideo.onplaying = () => { localVideo.style.opacity = 1 }
remoteVideo.onplaying = () => { remoteVideo.style.opacity = 1 }

let peer
function init() {
    var userId = document.getElementById("userid").value;
    if (userId == " " || userId == "") {
        alert("Please enter a userId")
        return;
    }
    peer = new Peer(userId,{    //available in peer js file
        host: 'localhost',
        port: 9000,
        path: '/video'
    })
    listen()
}

let localStream
function listen() {     //function to pick the call
    peer.on('call', (call) => {
        navigator.getUserMedia({
            audio: true, 
            video: {
                frameRate: 24,
                width: {
                    min: 480, ideal: 720, max: 1280
                },
                aspectRatio: 1.33333
            }
        }, (stream) => {
            localVideo.srcObject = stream
            localStream = stream
            call.answer(stream)
            call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream
                // remoteVideo.className = "primary-video"
                // localVideo.className = "secondary-video"
            })
        })
    })
}
function startCall() {  //function to start call
    var otherUserId = document.getElementById("fid").value;
    if (otherUserId == " " || otherUserId == "") {
        alert("Please enter a valid userId")
        return;
    }
    document.getElementById("wrapper_id").style.display = "none";
    document.getElementById("call_id").style.display = "block";
    navigator.getUserMedia({
        audio: true,
        video: {
            frameRate: 24,
            width: {
                min: 480, ideal: 720, max: 1280
            },
            aspectRatio: 1.33333
        }
    }, (stream) => {

        localVideo.srcObject = stream
        localStream = stream

        const call = peer.call(otherUserId, stream)
        notify("Waiting for friend to join..")
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream
        })
    })
}
document.getElementById("muteaudio").addEventListener("click", () => {
    console.log("audiomute");
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
    if (localStream.getAudioTracks()[0].enabled) {
        document.getElementById("muteaudio").style.background = '#5f6368';
        return;
    }
    document.getElementById("muteaudio").style.background = 'red';
})
document.getElementById("mutevideo").addEventListener("click", () => {
    console.log("videomute");
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
    if (localStream.getVideoTracks()[0].enabled) {
        document.getElementById("mutevideo").style.background = '#5f6368';
        return;
    }
    document.getElementById("mutevideo").style.background = 'red';
})
document.getElementById("EndCall").addEventListener("click", () => {
    
})
