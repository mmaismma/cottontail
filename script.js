let picData = [];

let httpRequest = new XMLHttpRequest();
httpRequest.open('GET', 'https://www.reddit.com/r/rabbits/best.json');
httpRequest.send();
httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === 4) {
        let tempArray = JSON.parse(httpRequest.responseText).data.children;
        tempArray.forEach(post => {
            if (!post.data.stickied || !post.data.is_video || !post.data.over_18) {
                picData.push(post)
            }
        });
        console.log('done')
    }
}

const prevPic = document.getElementById('prev-pic');
const nextPic = document.getElementById('next-pic');
const shotModer = document.getElementById('shot-moder');

let picNum = 0;

function changePic(diff) {
    picNum += diff;
    
}

function toggleShotMode() {
    document.fullscreenElement === null ? document.body.requestFullscreen() : document.exitFullscreen()
}

prevPic.onclick = changePic.bind(-1);
nextPic.onclick = changePic.bind(1);
shotModer.onclick = toggleShotMode.bind();