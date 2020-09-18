var newYearStr = "1 January YEAR";
var offSet = 0;

var nextYear = new Date().getFullYear() + 1;
var newYears = new Date(newYearStr.replace("YEAR", nextYear.toString()));

var remaining = 0;
var playing = false;

// Set some variables
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new window.AudioContext();
var player = null;
var timer = null;
var audioBuffer = null;

function playSong(offset) {
    if (player != null && !playing) {
        player.start(0, offset);
        playing = true;
    }
}

function stopSong() {
    if (player != null && playing) {
        player.stop();
        playing = false;
        player = null;
    }
}

function makePlayer() {
    player = context.createBufferSource();
    player.connect(context.destination);
    player.buffer = audioBuffer;
}

function loadSong(event) {
    var file = event.target.files[0];
    var freader = new FileReader();
    freader.onload = function (event) {
        context.decodeAudioData(event.target.result, function (buf) {
            audioBuffer = buf;
            makePlayer();
            document.getElementById("song-desc").innerHTML = file.name;
        });
    };
    stopSong();
    freader.readAsArrayBuffer(file);
}

function loadOffset(event) {
    offSet = document.getElementById("offset").value;
    stopSong();
    makePlayer();
}

function loadBackground(event) {
    if (event.target.files && event.target.files[0]) {
        var file = event.target.files[0]
        url = URL.createObjectURL(file);
        document.getElementById("parallax-container").style.backgroundImage = "url(" + url + ")";
        document.getElementById("image-desc").innerHTML = file.name;
    }
}

function update() {
    remaining = Math.floor((newYears - new Date()) / 1000);
    var seconds = remaining;
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    if (seconds <= offSet)
        playSong(offSet - seconds);

    seconds -= minutes * 60;
    minutes -= hours * 60;
    hours -= days * 24;

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    if (remaining == 0)
        clearInterval(timer);
}


function main() {
    // Repeat every second
    timer = setInterval(update, 1000);
}

// Load song file when user updates it.
document.getElementById("songfile").addEventListener("change", loadSong);
// Load background.
document.getElementById("imagefile").addEventListener("change", loadBackground);
// Reload offset.
document.getElementById("offset").addEventListener("change", loadOffset);

// First run
update();
// Sync to second.
var now = Date.now();
var delta = now - Math.floor(now / 1000) * 1000;
setTimeout(main, delta);
