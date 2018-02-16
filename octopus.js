(function () {
    //collect elements
    //proxy this for access hooks?
    const stat = { playing: 0, current: 0 };

    const handler_stat = {
        get(target, propKey, receiver) {
            console.log('get ' + propKey);
        }
    };
    
    //creating a proxy of stat to intercept requests for properties
    const proxy_stat = new Proxy(stat, handler_stat);

    const vid = document.querySelector('.octopus_video video');
    const playBtn = document.querySelector('.octopus_btn .btnPlayPause');
    const timeline = document.querySelector('.octopus_timeline');
    const progress = document.querySelector('.octopus_progress');

    //event listeners
    vid.addEventListener('playing', (e) => { stat.playing = 1; });
    vid.addEventListener('pause', (e) => { stat.playing = 0; });
    playBtn.addEventListener('click', playVid);
    timeline.addEventListener('click', track);

    //returns the percentage difference between 'num1' and 'num2'
    function getPercent(num1, num2) {
        let decimal = num1 / num2;
        return Math.ceil(decimal * 100);
    }

    //returns decimal thats 'percent' of 'target'
    function percentOff(percent, target) {
        let decimal = parseFloat(percent) / 100.0;
        return decimal * target;
    }

    function track(e) {
        const target = e.target;
        rect = target.getBoundingClientRect(),
            [offsetX, offsetY] = [e.clientX - rect.left, e.clientY - rect.top];

        console.log([offsetX, offsetY]);
        console.log(progress);

        // get percentage of offsetX to line width
        // match this to currentTime vs duration
        progress.style.width = `${getPercent(offsetX, rect.width)}%`
        console.log('percent ' + getPercent(offsetX, rect.width));
        console.log('runtime: ' + percentOff(getPercent(offsetX, rect.width), vid.duration));
    }

    function playVid() {
        vid.play();
    }

    render();


    //requestAnimationFrame for animation rendering of progress bar
    function render() {
        if (stat.playing === 1) {
            stat.current = vid.currentTime;
            console.log(Math.trunc(vid.currentTime));
            progress.style.width = `${getPercent(vid.currentTime, vid.duration)}%`
        }
        requestAnimationFrame(render);
    }
}());