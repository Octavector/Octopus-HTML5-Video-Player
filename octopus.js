window.addEventListener("load", function(e){

    //TODO
   

    //collect elements
    //proxy this for access hooks?
    const stat = { playing: 0, current: 0 };


    //the hadler for our proxy allows us to hook onto 'get' and 'set' requests
    const handler_stat = {
        get: function(target, propKey) {
            //get trap
            console.log('get ' + propKey);
           // console.log(`GET: target: ${target} - propKey: ${propKey}`);
           current.textContent = convertToMinutes(vid.currentTime);
            return Reflect.get(target, propKey);
        },
        set: function(target, propKey, value) {
            //set trap
            console.log('set ' + propKey);
            console.log(`SET: target: ${target} - propKey: ${propKey} - value: ${value}`);
            Reflect.set(target, propKey, value);
            //vid.currentTime = newRuntime;
            //vid.currentTime = proxy_stat.current;
        }
    };
    //creating a proxy of stat to intercept requests for properties
    const proxy_stat = new Proxy(stat, handler_stat);

    const vid = document.querySelector('.octopus_video video');
    var playBtn = document.querySelector('.octopus_btn .btnPlayPause');
    const timeline = document.querySelector('.octopus_timeline');
    const progress = document.querySelector('.octopus_progress');
    const current = document.querySelector('.octopus_current');
    const duration = document.querySelector('.octopus_duration');
    

    //event listeners
    vid.addEventListener('playing', (e) => { proxy_stat.playing = 1; });
    vid.addEventListener('pause', (e) => { proxy_stat.playing = 0; });
    //Chrome requires 'loadeddata', Firefox does not
    //If we cant grab vid.duration on load then we wait for 'loadeddata' event (chrome)
    vid.duration ? duration.textContent = convertToMinutes(vid.duration) : vid.addEventListener('loadeddata',(e) => {
        duration.textContent = convertToMinutes(vid.duration);
    });


    playBtn.addEventListener('click', playVid);
    timeline.addEventListener('click', track);

    //convert video duration in seconds 'total' to minutes and seconds, add to UI
    function convertToMinutes(total){
        let minutes = Math.floor(total / 60);
        let seconds = Math.floor(total - minutes * 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    

    //returns the percentage difference between 'num1' and 'num2'
    function getPercent(num1, num2) {
        let decimal = num1 / num2;
        //return Math.ceil(decimal * 100);
        return decimal * 100;
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
        let newRuntime = percentOff(getPercent(offsetX, rect.width), vid.duration);
        console.log('runtime: ' + newRuntime);
        //jump to new location in video
        vid.currentTime = newRuntime;
        //proxy_stat.current = newRuntime;
    }


    //toggle play and pause functionality and btn image
    function playVid() {
        if(proxy_stat.playing !== 1){
            vid.play();
            playBtn.style.backgroundImage = "url('img/btn_pause.svg')";
        }else{
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
            progress.style.width = `${getPercent(vid.currentTime, vid.duration)}%`
        }
        requestAnimationFrame(render);
    }
});