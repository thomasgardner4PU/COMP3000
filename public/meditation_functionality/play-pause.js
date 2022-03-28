// select the play and pause buttons
const play = document.querySelector('.play'),
    pause = document.querySelector('.pause');
    // select audio element
const audio = document.querySelector('.audio audio');

play.addEventListener('click', () => {
        audio.play();
    })

play.addEventListener('click', () => {
    audio.play();
})

pause.addEventListener('click', () => {
    audio.pause();
})