const prevPic = document.getElementById('prev-pic');
const nextPic = document.getElementById('next-pic');
const pic = document.getElementById('pic')
const picTitle = document.getElementById('pic-title')
const controls = document.getElementById('controls')
const settings = document.getElementById('settings')
const modeSelector = document.getElementById('mode-selector')
let picData = [];
let scoutMode = "rabbits";

let httpRequest = new XMLHttpRequest();

function sendHttpRequest() {
    setTimeout(() => {
        pic.src = "";
        pic.style.animation = "";
        pic.style.mask = '';
        pic.style["-webkit-mask"] = '';
        pic.style["-moz-mask"] = '';
        pic.style["-ms-mask"] = '';
        picTitle.textContent = "";
        
        httpRequest.open('GET', `https://www.reddit.com/r/${scoutMode}/best.json?limit=80`);
        httpRequest.send();
    }, 0)
}

httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status >= 200 && httpRequest.status < 400) {
            let tempArray = JSON.parse(httpRequest.responseText).data.children;
            picData = [];
            tempArray.forEach(post => {
                if (!post.data.stickied) {
                if (!post.data.is_video) {
                if (!post.data.over_18) {
                if (!post.data.gallery_data) {
                    picData.push(post)
                }}}}
            });
            
            document.body.style.pointerEvents = 'all';
            nextPic.click();
            picTitle.style.display = 'block';
            return
        }
        pic.classList.add('error');
    }
}

sendHttpRequest();

let picNum = -1;

function changePic(diff) {
    picNum += diff;

    if (picNum === 0) {
        prevPic.disabled = true;
    } else {
        prevPic.disabled = false;
    }
    if (picNum === picData.length) {
        nextPic.disabled = true;
    } else {
        nextPic.disabled = false;
    }

    pic.style.animation = '';
    pic.style.mask = '';
    pic.style["-webkit-mask"] = '';
    pic.style["-moz-mask"] = '';
    pic.style["-ms-mask"] = '';
    pic.src = "";
    picTitle.textContent = "";

    let tempImg = new Image();
    tempImg.onload = () => {
        pic.src = tempImg.src;
        picTitle.textContent = picData[picNum].data.title;
    }
    tempImg.src = picData[picNum].data.url;
}

function toggleShotMode() {
    if (document.fullscreenElement === null) {
        picTitle.style.opacity = 0;
        document.body.requestFullscreen();
    } else {
        picTitle.style.opacity = 1;
        document.exitFullscreen();
    }
}

function toggleSettings(state = "toggle") {
    let theDis = window.getComputedStyle(settings).getPropertyValue('display');
    if (state === "show" && theDis === "none") {
        settings.style.display = "block";
        pic.style.transform = "scale(0.9)"
        setTimeout(() => {
            settings.style.opacity = 1;
            settings.style.pointerEvents = "all";
            document.body.style.pointerEvents = "none";
        }, 0)
    } else if (state === "hide" && theDis === "block") {
        pic.style.transform = "";
        settings.style.opacity = 0;
        setTimeout(() => {
            settings.style.display = "none";
            document.body.style.pointerEvents = "all";
        }, 200);
    } else if (state === "toggle") {
        if (theDis === "none") {
            settings.style.display = "block";
            pic.style.transform = "scale(0.9)"
            setTimeout(() => {
                settings.style.opacity = 1;
                settings.style.pointerEvents = "all";
                document.body.style.pointerEvents = "none";
            }, 0)
        } else if (theDis === "block") {
            pic.style.transform = "";
            settings.style.opacity = 0;
            setTimeout(() => {
                settings.style.display = "none";
                document.body.style.pointerEvents = "all";
            }, 200);
        }
    }
}

prevPic.onclick = () => {
    changePic(-1);
}
nextPic.onclick = () => {
    changePic(1);
}

controls.ondblclick = () => {
    toggleShotMode();
}

document.body.oncontextmenu = (e) => {
    e.preventDefault();
    toggleSettings();
}

let gest = [];

controls.ontouchstart = (e) => {
    if (e.touches.length === 2) {
        gest.ix1 = e.touches[0].clientX;
        gest.ix2 = e.touches[1].clientX;
        gest.iy1 = e.touches[0].clientY;
        gest.iy2 = e.touches[1].clientY;
        gest.fx1 = gest.ix1;
        gest.fx2 = gest.ix2;
        gest.fy1 = gest.iy1;
        gest.fy2 = gest.iy2;

        controls.ontouchend = () => {resultGesture()}
        controls.ontouchcancel = () => {resultGesture()}
        controls.ontouchmove = (ev) => {
            ev.preventDefault();
            if (ev.touches.length === 2) {
                gest.fx1 = ev.touches[0].clientX;
                gest.fx2 = ev.touches[1].clientX;
                gest.fy1 = ev.touches[0].clientY;
                gest.fy2 = ev.touches[1].clientY;
            }
        }
    }
}

function resultGesture() {
    controls.ontouchend = () => {return}
    controls.ontouchcancel = () => {return}

    let oldDist = Math.hypot(gest.ix1 - gest.ix2, gest.iy1 - gest.iy2);
    let newDist = Math.hypot(gest.fx1 - gest.fx2, gest.fy1 - gest.fy2);

    if (newDist < oldDist) {
        toggleSettings('show');
    } else if (newDist > oldDist) {
        toggleSettings('hide');
    } else {
        console.log('no pinching')
    }
}