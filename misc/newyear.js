// Viewport width and height for canvas size.
const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const VH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
// Number of frequency bands for spectrometer.
const BANDS = 512;
// p5 instance.
var p5lib = new p5();

// Format String for new year's date.
var newYearStr = "1 January YEAR";
// Time before new year when song should be played, if any.
var beforeZero = 0;

// Setting up the next year on page load.
var nextYear = new Date().getFullYear() + 1;
var newYears = new Date(newYearStr.replace("YEAR", nextYear.toString()));

// Remaining seconds.
var remaining = 0;
// Wether the song is currently being played.
var playing = false;
// Wether a song has been loaded.
var songReady = false;
// Song file to play.
var song = null;
// Timer for countdown update.
var timer = null;
// Canvas to draw spectrometer on.
var canvas = null;
// Fft analyzer.
var fft = null;

/**
 * Setting up p5 canvas. 255 color levels for RGB and alpha.
 * 0.8 FFT smoothing.
 */
function setup() {
    canvas = p5lib.createCanvas(VW, VH);
    canvas.class("spectrum");
    p5lib.colorMode(p5lib.RGB, 255, 255, 255, 255);
    p5lib.stroke(255, 255, 255, 100);
    fft = new p5.FFT(0.8, BANDS);
}

/**
 * On each frame draw the spectrogram of the song being played on the canvas.
 */
function draw() {
    p5lib.clear();
    bandW = canvas.width / BANDS;
    bandMaxH = canvas.height * 0.6;
    p5lib.strokeWeight(bandW * 0.66);
    leftOffset = bandW / 2;
    if (playing) {
        var spectrum = fft.analyze();
        for (var i = 0; i < BANDS; i++) {
            var amp = spectrum[i];
            if (amp == 0)
                continue;
            var x = p5lib.map(i, 0, BANDS, 0, canvas.width);
            var y = p5lib.map(amp, 0, 255, 0, bandMaxH);
            p5lib.line(x + leftOffset, canvas.height, x + leftOffset, canvas.height - y);
        }
    }
}

/**
 * Start playing the currently selected song.
 * @param {int} offset The offset at which to play the song. 
 */
function playSong(offset) {
    if (song != null && !playing && songReady) {
        song.play();
        song.jump(offset);
        playing = true;
    }
}

/**
 * Stop playing the currently selected song.
 */
function stopSong() {
    if (song != null && playing) {
        song.stop();
        playing = false;
    }
}

/**
 * Callback for song file selection.
 * @param {*} event The file selection event.
 */
function loadSong(event) {
    var file = event.target.files[0];
    stopSong();
    songReady = false;
    song = p5lib.loadSound(URL.createObjectURL(file), function () {
        document.getElementById("song-desc").innerHTML = file.name;
        songReady = true;
    });
}

/**
 * Callback for offset setting.
 * @param {*} event Unused.
 */
function loadOffset(event) {
    beforeZero = document.getElementById("offset").value;
    stopSong();
}

/**
 * Callback for background image selection.
 * @param {*} event The file selection event.
 */
function loadBackground(event) {
    if (event.target.files && event.target.files[0]) {
        var file = event.target.files[0];
        var url = URL.createObjectURL(file);
        document.getElementById("parallax-container").style.backgroundImage = "url(" + url + ")";
        document.getElementById("image-desc").innerHTML = file.name;
    }
}

/**
 * Function to be called when updating the countdown timers.
 */
function updateTimer() {
    remaining = Math.floor((newYears - new Date()) / 1000);
    var seconds = remaining;
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    if (seconds <= beforeZero)
        playSong(beforeZero - seconds);

    seconds -= minutes * 60;
    minutes -= hours * 60;
    hours -= days * 24;

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
    document.getElementById("left").innerHTML = (remaining - beforeZero) + " remaining.";

    if (remaining == 0)
        clearInterval(timer);
}

/**
 * Set the update interval to 1 second.
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

// First run
updateTimer();
// Sync to second.
var now = Date.now();
var delta = now - Math.floor(now / 1000) * 1000;
setTimeout(main, delta);
