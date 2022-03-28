// select the play and pause buttons
const play = document.querySelector('.play'),
    pause = document.querySelector('.pause');
    // select audio element
const audio = document.querySelector('.audio audio');
play.addEventListener('click', () => {
        audio.play();
});

// play the audio file
play.addEventListener('click', () => {
    audio.play();
    update();
});

// pause the audio file
pause.addEventListener('click', () => {
    audio.pause();
});

//select video's for seasons
const seasons = document.querySelectorAll(".season");
video = document.querySelector(".video video");

// change background video
seasons.forEach( season => {
    season.addEventListener('click', () => {
        video.src = season.getAttribute("video-src");
    });
});

//select durations buttons
const duration = document.querySelectorAll('.duration');

// default audio durations
let audioDuration = 120; // 2minutes

// change audio duration
duration.forEach( duration => {
    duration.addEventListener('click', () => {
        audioDuration = duration.getAttribute('audio-duration');
        console.log(audioDuration)
    })
})

// select rect and remaining timer element
const path = document.querySelector('.rect2'),
    remainingTimeEl = document.querySelector(".audio-remaining-time");

// total length of the path (perimeter of the rectangle)
const pathLength = path.getTotalLength();
// set the length of a dash to pathLength
path.style.strokeDasharray = pathLength;

function update(){
    // stop audio
    if (audio.currentTime >= audioDuration) {
        audio.pause(); // pause audio
        audio.currentTime = 0; // stop audio
    }

    // portion played from the audio
    let portionPlayed = audio.currentTime / audioDuration;

    // stoke dashoffset is proportional to the portionPlayed
    path.style.strokeDashoffset = -portionPlayed * pathLength;

    if (!audio.paused){
        requestAnimationFrame(update);
        console.log("update");
    }
}

update();