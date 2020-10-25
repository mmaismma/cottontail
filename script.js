const prevPic = document.getElementById('prev-pic');
const nextPic = document.getElementById('next-pic');
const shotModer = document.getElementById('shot-moder');
const pic = document.getElementById('pic')
const picTitle = document.getElementById('pic-title')
let picData = [];

let httpRequest = new XMLHttpRequest();
httpRequest.open('GET', 'https://www.reddit.com/r/rabbits/best.json?limit=80');
httpRequest.send();
httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === 4) {
        console.log(httpRequest.status)
        if (httpRequest.status >= 200 && httpRequest.status < 400) {
            let tempArray = JSON.parse(httpRequest.responseText).data.children;
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
            nextPic.disabled = false;
            prevPic.disabled = false;
            shotModer.disabled = false;

            nextPic.click();
            picTitle.style.display = 'block';
            console.log('done')
            return
        }
        pic.classList.add('error');
    }
}

let picNum = -1;

function changePic(diff) {
    picNum += diff;
    picNum === 0 ? prevPic.disabled = true : prevPic.disabled = false

    if (picNum === picData.length) {
        nextPic.disabled = true;
    } else {
        nextPic.disabled = false;
    }

    pic.style.animation = '';
    pic.style.mask = '';
    pic.style["-webkit-mask"] = '';
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

prevPic.onclick = () => {
    changePic(-1)
}
nextPic.onclick = () => {
    changePic(1)
}
shotModer.onclick = () => {
    toggleShotMode()
}