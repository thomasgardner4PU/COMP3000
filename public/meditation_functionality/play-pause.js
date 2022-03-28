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

// chnage audio duration

duration.forEach( duration => {
    duration.addEventListener('click', () => {
        audioDuration = duration.getAttribute('audio-duration');
    })
})