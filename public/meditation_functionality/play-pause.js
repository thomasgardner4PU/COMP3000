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
        update();
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

    // calculate remaining time in seconds
    let remainingTimeInSec = audioDuration - audio.currentTime;
    renderRemainingTime(remainingTimeInSec);

    if (!audio.paused){
        requestAnimationFrame(update);
        console.log("update");
    }
}
update();

// render remaining time
function renderRemainingTime(timeInSec){
    let min = Math.floor(timeInSec / 60);
    let sec = Math.floor(timeInSec % 60);

    // if min/sec is a single digit(ex:9) we add a zero to the beginning of the digit (ex: 9 becomes 09)
    min = min < 10 ? `0${min}` : min;
    sec = min < 10 ? `0${sec}` : sec;


    remainingTimeEl.innerHTML = `${min}:${sec}`;
}