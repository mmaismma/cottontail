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
let scoutMode = localStorage.getItem('CTscoutMode') === null ? "rabbits" : localStorage.getItem('CTscoutMode');
modeSelector.value = scoutMode;
let httpRequest = new XMLHttpRequest();

a11yControls.style.visibility = 'hidden';

if (localStorage.getItem('CTa11yEnabled') === "true") {
    a11yModer.checked ? null : a11yModer.click()
} else if (localStorage.getItem('CTa11yEnabled') === "false") {
    a11yModer.checked ? a11yModer.click() : null
} else {
    localStorage.setItem('CTa11yEnabled', a11yModer.checked);
}

a11yModer.checked ? (document.body.classList.add('a11y'), localStorage.setItem('CTa11yEnabled', true)) : null

if (localStorage.getItem('CTfirstTime') === 'nope') {
    document.getElementsByTagName('main')[0].remove();
} else {
    document.getElementsByTagName('main')[0].style.opacity = 1;
    showTutorial();
}

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

    let theDis = window.getComputedStyle(settings).getPropertyValue('display');

    if (state === "show" && theDis === "none") {
        settings.style.display = "block";
        pic.style.transform = "scale(0.9)"
        setTimeout(() => {
            settings.style.opacity = 1;
        }, 0)
    } else if (state === "hide" && theDis === "block") {
        pic.style.transform = "";
        settings.style.opacity = 0;
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

function showTutorial(step = 'pic') {
    toggleSettings(undefined, 'hide');
    document.body.classList.contains('in-tut') ? null : document.body.classList.add('in-tut');
    var tutBox = document.getElementsByClassName('tutBox')[0];
    var tutButton = document.getElementsByClassName('tutButton')[0];

    if (tutBox === undefined) {
        tutBox = document.createElement('div');
        tutButton = document.createElement('button');
        tutButton.textContent = 'Continue';
        tutButton.setAttribute('onclick','showTutorial(\'pic\')')
        tutBox.appendChild(tutButton);
        tutBox.className = 'tutBox';
        tutButton.className = 'tutButton';
        document.body.appendChild(tutBox);
    }
    Array.from(document.getElementsByClassName('tut-highlight')).forEach(elm => {
        elm.classList.remove('tut-highlight');
    })
    tutBox.classList.add('tut-highlight');
    tutButton.classList.add('tut-highlight');
    switch (step) {
    case 'prevPic':
        tutButton.setAttribute('onclick', 'showTutorial("shotMode")');
        tutBox.innerHTML = 'Click here to see the previous picture.<br>' + tutButton.outerHTML;
        if (a11yModer.checked) {
            a11yPrevPic.classList.add('tut-highlight');
            tutBox.style.borderBottomLeftRadius = 0;
            tutBox.style.borderBottomRightRadius = '';
            tutBox.style.top = a11yPrevPic.getBoundingClientRect().top - tutBox.getBoundingClientRect().height - 12 + 'px';
            tutBox.style.left = a11yPrevPic.getBoundingClientRect().left + a11yPrevPic.getBoundingClientRect().width / 2 + 'px';
        } else {
            prevPic.classList.add('tut-highlight');
            tutBox.style.borderBottomLeftRadius = 0;
            tutBox.style.borderBottomRightRadius = '';
            tutBox.style.top = prevPic.getBoundingClientRect().top - tutBox.getBoundingClientRect().height / 2 + prevPic.getBoundingClientRect().height / 2 + 'px';
            tutBox.style.left = prevPic.getBoundingClientRect().right + 10 + 'px';
        }
        break;
    case 'nextPic':
        tutButton.setAttribute('onclick', 'showTutorial("prevPic")');
        tutBox.innerHTML = 'Click here to see the next picture.<br>' + tutButton.outerHTML;
        if (a11yModer.checked) {
            a11yNextPic.classList.add('tut-highlight');
            tutBox.style.borderBottomLeftRadius = '';
            tutBox.style.borderBottomRightRadius = 0;
            tutBox.style.top = a11yNextPic.getBoundingClientRect().top - tutBox.getBoundingClientRect().height - 12 + 'px';
            tutBox.style.left = a11yNextPic.getBoundingClientRect().left + a11yNextPic.getBoundingClientRect().width / 2 - tutBox.getBoundingClientRect().width + 'px';
        } else {
            nextPic.classList.add('tut-highlight');
            tutBox.style.borderBottomLeftRadius = '';
            tutBox.style.borderBottomRightRadius = 0;
            tutBox.style.top = nextPic.getBoundingClientRect().top - tutBox.getBoundingClientRect().height / 2 + nextPic.getBoundingClientRect().height / 2 + 'px';
            tutBox.style.left = nextPic.getBoundingClientRect().left - tutBox.getBoundingClientRect().width - 10 + 'px';
        }
        break;
    case 'pic':
        tutButton.setAttribute('onclick', 'showTutorial("nextPic")');
        tutBox.innerHTML = 'This is the image.<br>' + tutButton.outerHTML;
        tutBox.style.borderBottomLeftRadius = '';
        tutBox.style.borderBottomRightRadius = '';
        pic.classList.add('tut-highlight');
        tutBox.style.top = `calc(100% - ${tutBox.getBoundingClientRect().height + 10}px)`;
        tutBox.style.left = `calc(50% - ${tutBox.getBoundingClientRect().width / 2}px)`;
        break;
    case 'shotMode':
        tutButton.setAttribute('onclick', 'showTutorial("settings")');
        tutBox.innerHTML = 'Click here to toggle shot-mode, a mode perfect for taking screenshots of your favourite images.<br>' + tutButton.outerHTML;
        if (a11yModer.checked) {
            a11yShotModer.classList.add('tut-highlight');
            tutBox.style.borderBottomLeftRadius = 0;
            tutBox.style.borderBottomRightRadius = '';
            tutBox.style.top = a11yShotModer.getBoundingClientRect().top - tutBox.getBoundingClientRect().height - 12 + 'px';
            tutBox.style.left = a11yShotModer.getBoundingClientRect().left + a11yShotModer.getBoundingClientRect().width / 2 + 'px';
        } else {
            pic.classList.add('tut-highlight');
            tutBox.innerHTML = 'Double click at the center to toggle shot-mode, a mode perfect for taking screenshots of your favourite images.<br>' + tutButton.outerHTML;
            tutBox.style.borderBottomLeftRadius = '';
            tutBox.style.borderBottomRightRadius = '';
            tutBox.style.top = `calc(100% - ${tutBox.getBoundingClientRect().height + 10}px)`;
            tutBox.style.left = `calc(50% - ${tutBox.getBoundingClientRect().width / 2}px)`;
        }
        break;
    case 'settings':
        tutButton.setAttribute('onclick', 'showTutorial("close")');
        tutButton.innerHTML = 'End Tutorial';
        tutBox.innerHTML = 'Click here to open and close settings, where you can also redo the tutorial.<br>' + tutButton.outerHTML;
        if (a11yModer.checked) {
            a11ySetter.classList.add('tut-highlight');
            tutBox.style.borderBottomLeftRadius = '';
            tutBox.style.borderBottomRightRadius = 0;
            tutBox.style.top = a11ySetter.getBoundingClientRect().top - tutBox.getBoundingClientRect().height - 12 + 'px';
            tutBox.style.left = a11ySetter.getBoundingClientRect().left + a11ySetter.getBoundingClientRect().width / 2 - tutBox.getBoundingClientRect().width + 'px';
        } else {
            pic.classList.add('tut-highlight');
            tutBox.innerHTML = 'Right click or pinch in and out to open and close settings, where you can also redo the tutorial.<br>' + tutButton.outerHTML;
            tutBox.style.borderBottomLeftRadius = '';
            tutBox.style.borderBottomRightRadius = '';
            tutBox.style.top = `calc(100% - ${tutBox.getBoundingClientRect().height + 10}px)`;
            tutBox.style.left = `calc(50% - ${tutBox.getBoundingClientRect().width / 2}px)`;
        }
        break;
    case 'close':
        document.body.classList.remove('in-tut');
        tutBox.remove();
    }
}

function toggleA11yMode() {
    if (a11yModer.checked) {
        document.body.classList.toggle('a11y') ? null : document.body.classList.add('a11y');
        localStorage.setItem('CTa11yEnabled', true);
    } else if (!a11yModer.checked) {
        !document.body.classList.toggle('a11y') ? null : document.body.classList.remove('a11y');
        localStorage.setItem('CTa11yEnabled', false);
    }
}

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
            a11yControls.style.visibility = '';
            return
        }
        pic.classList.add('error');
    }
}

sendHttpRequest();