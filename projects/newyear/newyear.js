// Viewport width and height for canvas size.
const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const VH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
const fireworksContainer = document.getElementById('fireworks-container');

// Format String for new year's date.
var newYearStr = "1 January YEAR";
// Time before new year when song should be played, if any.
var beforeZero = 0;

// Setting up the next year on page load.
var nextYear = new Date().getFullYear() + 1;
var newYears = new Date(newYearStr.replace("YEAR", nextYear.toString()));

// Remaining seconds.
var remaining = 0;
// Timer for countdown update.
var timer = null;

// Spectrum visualizer.
const spectrum = new Spectrum("spectrum", 64);

// Fireworks.
const fireworks = new Fireworks(fireworksContainer, {});

// Load Fireworks settings.
fetch("fireworks-config.json").then(res => res.json()).then(json => {
    fireworks.setOptions(json);
});

/**
 * Callback for song file selection.
 * @param {*} event The file selection event.
 */
function loadSong(event) {
    let file = event.target.files[0];
    spectrum.changeSource(
        URL.createObjectURL(file),
        function () {
            document.getElementById("song-desc").textContent = file.name;
        }
    );
}

/**
 * Callback for offset setting.
 * @param {*} event Unused.
 */
function loadOffset(event) {
    beforeZero = document.getElementById("offset").value;
    // Song may need to be played again from another timestamp.
    spectrum.stop();
}

/**
 * Callback for background image selection.
 * @param {*} event The file selection event.
 */
function loadBackground(event) {
    if (event.target.files && event.target.files[0]) {
        let file = event.target.files[0];
        let url = URL.createObjectURL(file);
        document.getElementById("parallax-container").style.backgroundImage = "url(" + url + ")";
        document.getElementById("image-desc").textContent = file.name;
    }
}

/**
 * Function to be called when updating the countdown timers.
 */
function updateTimer() {
    remaining = Math.floor((newYears - new Date()) / 1000);
    let seconds = remaining;
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    // Play the song if the time has come.
    if (seconds <= beforeZero)
        spectrum.play(beforeZero - seconds);

    seconds -= minutes * 60;
    minutes -= hours * 60;
    hours -= days * 24;

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    document.getElementById("left").textContent = (remaining - beforeZero) + " remaining.";

    // Avoid going to negative time when midnight passes.
    if (remaining == 0) {
        clearInterval(timer);
        fireworks.start();
    }
        
}

/**
 * Update the timers every 1000 milliseconds.
 */
function main() {
    // Repeat every second
    timer = setInterval(updateTimer, 1000);
}

// Load song file when user updates it.
document.getElementById("songfile").addEventListener("change", loadSong);
// Load background.
document.getElementById("imagefile").addEventListener("change", loadBackground);
// Reload offset.
document.getElementById("offset").addEventListener("change", loadOffset);

// First run, set everything up.
updateTimer();

// Roughly wait until the next second before starting the update loop.
var now = Date.now();
var delta = now - Math.floor(now / 1000) * 1000;
setTimeout(main, delta);