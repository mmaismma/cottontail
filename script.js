let picData = [];
let tempArray = [];

let httpRequest = new XMLHttpRequest();
httpRequest.open('GET', 'https://www.reddit.com/r/rabbits/best.json?limit=80');
httpRequest.send();
httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === 4) {
        tempArray = JSON.parse(httpRequest.responseText).data.children;
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
        nextPic.click()
        console.log('done')
    }
}

const prevPic = document.getElementById('prev-pic');
const nextPic = document.getElementById('next-pic');
const shotModer = document.getElementById('shot-moder');
const pic = document.getElementById('pic')

let picNum = -1;

function changePic(diff) {
    picNum += diff;
    picNum === 0 ? prevPic.disabled = true :prevPic.disabled = false
    picNum === picData.length ? nextPic.disabled = true : nextPic.disabled = false

    pic.style.animation = '';
    pic.src = "";
    pic.src = picData[picNum].data.url;
}

function toggleShotMode() {
    document.fullscreenElement === null ? document.body.requestFullscreen() : document.exitFullscreen()
}

prevPic.onclick = () => {changePic(-1)}
nextPic.onclick = () => {changePic(1)}
shotModer.onclick = () => {toggleShotMode()}