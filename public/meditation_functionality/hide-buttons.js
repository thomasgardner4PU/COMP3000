const app = document.querySelector(".app");

// amount of time to consider user inactive
const inactiveTime = 3000; // 3 seconds
// last time the mouse has moved
let mouseLastMOveTime = new Date();

// listen for a mouse move
document.addEventListener('mousemove', () => {
    // reset last time mouse has moved
    mouseLastMOveTime = new Date();


    // show app
    app.classList.remove("inactive");

    // show cursor
    document.body.style.cursor = "auto";
});

// deactivate app
function deactivateApp(){
    // check if the user was inactive for a certain amount of time
    let now = new Date();
    let deltaTime = now - mouseLastMOveTime;

    if (deltaTime >= inactiveTime) {
        // hide app
        app.classList.add("inactive");

        // hhide cursor
        document.body.style.cursor = "none";
    }

    // loop
    requestAnimationFrame(deactivateApp)
}
deactivateApp();

