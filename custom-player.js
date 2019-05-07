var media = document.querySelector('video');
var controls = document.querySelector('.controls');

var play = document.querySelector('.play');
var stop = document.querySelector('.stop');
var rwd = document.querySelector('.rwd');
var fwd = document.querySelector('.fwd');

var timerWrapper = document.querySelector('.timer');
var timer = document.querySelector('.timer span');
var timerBar = document.querySelector('.timer div');

// Removes the default media controls and makes the custom controls visible
media.removeAttribute('controls');
controls.style.visibility = 'visible';

// Defines the controlling functions
// PLAY-PAUSE toggle
play.addEventListener('click', playPauseMedia);

function playPauseMedia() {
    // Makes sure the video is played/paused while winding
    clearInterval(intervalFwd);
    fwd.classList.remove('active');
    clearInterval(intervalRwd);
    rwd.classList.remove('active');

    if(media.paused) {
        play.setAttribute('data-icon','u');
        media.play();
    } else {
        play.setAttribute('data-icon','P');
        media.pause();
    }
}

// STOP
stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);

function stopMedia() {
    media.pause();
    media.currentTime = 0;
    play.setAttribute('data-icon','P');

    // Makes sure the video is stopped while winding
    clearInterval(intervalFwd);
    fwd.classList.remove('active');
    clearInterval(intervalRwd);
    rwd.classList.remove('active');
}

// REWIND and FAST FORWARD
rwd.addEventListener('click', mediaBackward);
fwd.addEventListener('click', mediaForward);

var intervalFwd;
var intervalRwd;

function mediaBackward() {
    clearInterval(intervalFwd);
    fwd.classList.remove('active');

    if(rwd.classList.contains('active')) {
        //rwd.classList.remove('active'); //these lines are performed by play/pause toggle function
        //clearInterval(intervalRwd);
        media.play();
    } else {
        rwd.classList.add('active');
        media.pause();
        intervalRwd = setInterval(windBackward, 200);
    }
}

function mediaForward() {
    clearInterval(intervalRwd);
    rwd.classList.remove('active');

    if(fwd.classList.contains('active')) {
        //fwd.classList.remove('active');
        //clearInterval(intervalFwd);
        media.play();
    } else {
        fwd.classList.add('active');
        media.pause();
        intervalFwd = setInterval(windFoward, 200);
    }
}

// Defines the winding functions
function windBackward() {
    if(media.currentTime <= 3) {
        rwd.classList.remove('active');
        clearInterval(intervalRwd);
        stopMedia();
    } else {
        media.currentTime -= 3;
    }
}

function windFoward() {
    if(media.currentTime >= media.duration - 3) {
        fwd.classList.remove('active');
        clearInterval(intervalFwd);
        stopMedia();
    } else {
        media.currentTime += 3;
    }
}

// Updates the timer on every 'timeupdate' event
media.addEventListener('timeupdate', setTime);

function setTime() {
    var minutes = Math.floor(media.currentTime / 60);
    var seconds = Math.floor(media.currentTime - minutes * 60);
    var minuteValue;
    var secondValue;
    // Adds a zero to the left of single-digit minutes
    if(minutes < 10) {
        minuteValue = '0' + minutes;
    } else {
        minuteValue = minutes;
    }
    // Adds a zero to the left of single-digit seconds
    if(seconds < 10) {
        secondValue = '0' + seconds;
    } else {
        secondValue = seconds;
    }

    //var mediaTime = minuteValue + ':' + secondValue;
    //timer.textContext = mediaTime;
    timer.textContent = minuteValue + ':' + secondValue;
    var barLength = timerWrapper.clientWidth * (media.currentTime/media.duration);
    timerBar.style.width = barLength + 'px';
}

// Creates a seekbar from the timer div (timerWrapper)
timerWrapper.addEventListener('click', jumpToPos);

function jumpToPos(e) {
    var timerBoundaries = timerWrapper.getBoundingClientRect();
    var barLength = e.x - timerBoundaries.left;
    //Sets the current time, which triggers 'timeupdate' event
    media.currentTime = media.duration * (barLength / timerWrapper.clientWidth);
}