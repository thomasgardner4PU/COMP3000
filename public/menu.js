let side1 = document.querySelector(".side1");
let side2 = document.querySelector(".side2");
let overlay = document.querySelector(".menu_overlay");
let open = document.querySelector(".fa-bars");
let close = document.querySelector(".fa-times");

console.log(side1, side2, overlay, open, close);

open.addEventListener("click", () => {
    overlay.style.transform = "translateY(0)";
});

close.addEventListener("click", () => {
    overlay.style.transform = "translateY(-110%)";
});