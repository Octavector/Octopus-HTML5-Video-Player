//octopus object is exposed in global space for Mocha testing, normally would be wrapped in IIFE
const octopus = {};

//returns the percentage difference between 'num1' and 'num2'
octopus.getPercent = function (num1, num2) {
    let decimal = num1 / num2;
    return decimal * 100;
}

//returns decimal thats 'percent' of 'target'
octopus.percentOff = function (percent, target) {
    let decimal = parseFloat(percent) / 100.0;
    return decimal * target;
}

window.addEventListener("load", function (e) {

    const stat = { playing: 0, current: 0 };

    //the handler for our proxy allows us to hook onto 'get' and 'set' requests
    const handler_stat = {
        get: function (target, propKey) {
            //get trap
            current.textContent = convertToMinutes(vid.currentTime);
            return Reflect.get(target, propKey);
        },
        set: function (target, propKey, value) {
            //set trap
            Reflect.set(target, propKey, value);
        }
    };
    //creating a proxy of stat to intercept requests for properties
    const proxy_stat = new Proxy(stat, handler_stat);

    //grab DOM elements
    const vid = document.querySelector('.octopus_video video');
    const playBtn = document.querySelector('.octopus_btn .btnPlayPause');
    const timeline = document.querySelector('.octopus_timeline');
    const progress = document.querySelector('.octopus_progress');
    const current = document.querySelector('.octopus_current');
    const duration = document.querySelector('.octopus_duration');

    //event listeners
    vid.addEventListener('playing', (e) => { proxy_stat.playing = 1; });
    vid.addEventListener('pause', (e) => { proxy_stat.playing = 0; });
    //Chrome requires 'loadeddata', Firefox does not
    //If we cant grab vid.duration on load then we wait for 'loadeddata' event (chrome)
    vid.duration ? duration.textContent = convertToMinutes(vid.duration) : vid.addEventListener('loadeddata', (e) => {
        duration.textContent = convertToMinutes(vid.duration);
    });

    playBtn.addEventListener('click', playVid);
    timeline.addEventListener('click', track);

    //convert video duration in seconds 'total' to minutes and seconds, add to UI
    function convertToMinutes(total) {
        let minutes = Math.floor(total / 60);
        let seconds = Math.floor(total - minutes * 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    //track function manages clicks on timeline
    function track(e) {
        const target = e.target;
        rect = target.getBoundingClientRect(),
            [offsetX, offsetY] = [e.clientX - rect.left, e.clientY - rect.top];

        // get percentage of offsetX to line width
        // match this to currentTime vs duration
        progress.style.width = `${octopus.getPercent(offsetX, rect.width)}%`
        let newRuntime = octopus.percentOff(octopus.getPercent(offsetX, rect.width), vid.duration);
        //jump to new location in video
        vid.currentTime = newRuntime;
        //proxy_stat.current = newRuntime;
    }

    //toggle play and pause functionality and btn image
    function playVid() {
        if (proxy_stat.playing !== 1) {
            vid.play();
            playBtn.style.backgroundImage = "url('img/btn_pause.svg')";
        } else {
            vid.pause();
            playBtn.style.backgroundImage = "url('img/btn_play.svg')";
        }
    }

    //begin animation loop
    render();

    //requestAnimationFrame for animation rendering of progress bar
    function render() {
        if (proxy_stat.playing === 1) {
            proxy_stat.current = vid.currentTime;
            current.textContent = convertToMinutes(vid.currentTime);
            //console.log(Math.trunc(vid.currentTime));
            progress.style.width = `${octopus.getPercent(vid.currentTime, vid.duration)}%`
        }
        requestAnimationFrame(render);
    }
});

//Uncomment below to run Mocha tests (requires jsdom-global)
//module.exports = octopus;