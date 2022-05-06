const app = () => {
    const song = document.querySelector('.song');
    const play = document.querySelector('.play');
    const outline = document.querySelector('.moving-outline circle');
    const video = document.querySelector('.vid-container video');


    //sounds
    const sounds = document.querySelectorAll('.sound-picker button');
    //Time Display
    const timeDisplay = document.querySelector('.time-display');
    const timeSelect = document.querySelectorAll('.time-select button');
    // get the length of the outline
    const outlineLength = outline.getTotalLength();
    console.log(outlineLength);

    //duration
    let fakeDuration = 600;

    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = outlineLength;

    // play sound
    play.addEventListener('click', () => {
        checkPlaying(song);
    });

    // select sound

    timeSelect.forEach(option => {
        option.addEventListener('click', function (){
            fakeDuration = this.getAttribute('data-time');
            timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`;
        });
    });

    // create a function to stop and play sounds
    const checkPlaying = song => {
        if (song.paused){
            song.play();
            video.play();
            play.src = '/weatherMeditation/svg/pause.svg'
        } else {
            song.pause();
            video.pause();
            play.src = '/weatherMeditation/svg/play.svg'
        }
    }

    // animate the circle
    song.ontimeupdate = () => {
        let currentTime = song.currentTime;
        let elapsed = fakeDuration - currentTime;
        let seconds = Math.floor(elapsed % 60);
        let minutes = Math.floor(elapsed / 60);

        //animate the circle

        let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
        outline.style.strokeDashoffset = progress;

        // animate the text

        timeDisplay.textContent = `${minutes}:${seconds}`;
    }
}

app();