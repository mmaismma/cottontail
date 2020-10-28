const elId = function (el) {
    return document.getElementById(el)
};

const prevPic = elId('prev-pic');
const nextPic = elId('next-pic');

const a11yModer = elId('a11y-moder');
const a11yPrevPic = elId('a11y-prev-pic');
const a11yNextPic = elId('a11y-next-pic');
const a11yShotModer = elId('a11y-shot-moder');
const a11ySetter = elId('a11y-settings-toggler');
const a11yControls = elId('a11y-controls');

const pic = elId('pic');
const picTitle = elId('pic-title');

const controls = elId('controls');
const settings = elId('settings');

const modeSelector = elId('mode-selector');
const titleInShot = elId('title-in-shot')

let picData = [];
let gst = [];
let picNum = -1;
let scoutMode = localStorage.getItem('scoutMode') === null ? "rabbits" : localStorage.getItem('scoutMode');
modeSelector.value = scoutMode;
let httpRequest = new XMLHttpRequest();

function changePic(diff) {
    picNum += diff;

    if (picNum === 0) {
        prevPic.disabled = true;
        a11yPrevPic.disabled = true;
    } else {
        prevPic.disabled = false;
        a11yPrevPic.disabled = false;
    }
    if (picNum === picData.length) {
        nextPic.disabled = true;
        a11yNextPic.disabled = true;
    } else {
        nextPic.disabled = false;
        a11yNextPic.disabled = false;
    }

    setTimeout(() => {
        pic.style.animation = '';
        pic.style.mask = '';
        pic.style["-webkit-mask"] = '';
        pic.style["-moz-mask"] = '';
        pic.style["-ms-mask"] = '';
        pic.src = "";
        picTitle.textContent = "";
    }, 0)

    let tempImg = new Image();
    tempImg.onload = () => {
        pic.src = tempImg.src;
        picTitle.textContent = picData[picNum].data.title;
    }
    tempImg.src = picData[picNum].data.url;
}

function toggleShotMode() {
    if (document.fullscreenElement === null) {
        !titleInShot.checked ? picTitle.style.opacity = 0 : picTitle.style.opacity = 1;
        document.documentElement.requestFullscreen();
    } else {
        picTitle.style.opacity = 1;
        document.exitFullscreen();
    }
}

function toggleSettings(e = event, state = "toggle") {
    state === "toggle" ? e.preventDefault() : null

    let theDis = settings.style.display;

    if (state === "show" && theDis === "none") {
        settings.style.display = "block";
        pic.style.transform = "scale(0.9)"
        settings.style.pointerEvents = "all";
        document.body.style.pointerEvents = "none";
        setTimeout(() => {
            settings.style.opacity = 1;
        }, 0)
    } else if (state === "hide" && theDis === "block") {
        pic.style.transform = "";
        settings.style.opacity = 0;
        document.body.style.pointerEvents = "all";
        setTimeout(() => {
            settings.style.display = "none";
        }, 200);
    } else if (state === "toggle") {
        if (theDis === "none") {
            toggleSettings(e, "show")
        } else if (theDis === "block") {
            toggleSettings(undefined, "hide")
        }
    }
}

function handleTouchStart(e) {
    if (a11yModer.checked) return;

    if (e.touches.length === 2) {
        gst.ix1 = e.touches[0].clientX;
        gst.ix2 = e.touches[1].clientX;
        gst.iy1 = e.touches[0].clientY;
        gst.iy2 = e.touches[1].clientY;
        gst.fx1 = gst.ix1;
        gst.fx2 = gst.ix2;
        gst.fy1 = gst.iy1;
        gst.fy2 = gst.iy2;

        controls.ontouchend = () => {
            resultGesture();
        };
        controls.ontouchcancel = () => {
            resultGesture();
        };
        controls.ontouchmove = (ev) => {
            ev.preventDefault();
            if (ev.touches.length === 2) {
                gst.fx1 = ev.touches[0].clientX;
                gst.fx2 = ev.touches[1].clientX;
                gst.fy1 = ev.touches[0].clientY;
                gst.fy2 = ev.touches[1].clientY;
            }
        };
        
        settings.ontouchend = () => {
            resultGesture();
        };
        settings.ontouchcancel = () => {
            resultGesture();
        };
        settings.ontouchmove = (ev) => {
            ev.preventDefault();
            if (ev.touches.length === 2) {
                gst.fx1 = ev.touches[0].clientX;
                gst.fx2 = ev.touches[1].clientX;
                gst.fy1 = ev.touches[0].clientY;
                gst.fy2 = ev.touches[1].clientY;
            }
        };
    }
}

function resultGesture() {
    controls.ontouchend = () => {
        return
    }
    controls.ontouchcancel = () => {
        return
    }
    
    let oldDist = Math.hypot(gst.ix1 - gst.ix2, gst.iy1 - gst.iy2);
    let newDist = Math.hypot(gst.fx1 - gst.fx2, gst.fy1 - gst.fy2);
    
    if (newDist < oldDist) {
        toggleSettings(undefined, 'show');
    } else if (newDist > oldDist) {
        toggleSettings(undefined, 'hide');
    } else {
        console.log('no pinching')
    }
}

function showTutorial() {
    return
}

function toggleA11yMode() {
    if (a11yModer.checked) {
        document.body.classList.toggle('a11y') ? null : document.body.classList.add('a11y');
        localStorage.setItem('a11yEnabled', true);
    } else if (!a11yModer.checked) {
        !document.body.classList.toggle('a11y') ? null : document.body.classList.remove('a11y');
        localStorage.setItem('a11yEnabled', false);
    }
}

if (localStorage.getItem('a11yEnabled') === "true") {
    a11yModer.checked ? null : a11yModer.click()
} else if (localStorage.getItem('a11yEnabled') === "false") {
    a11yModer.checked ? a11yModer.click() : null
} else {
    localStorage.setItem('a11yEnabled', a11yModer.checked);
}

a11yModer.checked ? (document.body.classList.add('a11y'), localStorage.setItem('a11yEnabled', true)) : null

prevPic.onclick = () => {
    changePic(-1);
}
nextPic.onclick = () => {
    changePic(1);
}
controls.ondblclick = (e) => {
    if (e.target === e.currentTarget) {
        toggleShotMode();
    }
}

a11yPrevPic.onclick = () => {
    changePic(-1);
}
a11yNextPic.onclick = () => {
    changePic(1);
}
a11yShotModer.onclick = () => {
    toggleShotMode();
}
a11ySetter.onclick = (e) => {
    toggleSettings(e);
}

document.documentElement.oncontextmenu = (e) => {
    if (a11yModer.checked) return;
    toggleSettings(e);
}

controls.ontouchstart = (e) => {
    handleTouchStart(e);
}

settings.ontouchstart = (e) => {
    if (e.target === e.currentTarget) {
        handleTouchStart(e);
    };
}

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
                            }
                        }
                    }
                }
            });

            document.body.style.pointerEvents = 'all';
            picNum = -1;
            nextPic.click();
            picTitle.style.display = 'block';
            return
        }
        pic.classList.add('error');
    }
}

sendHttpRequest();