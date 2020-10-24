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

let picNum = 0;

prevPic.onclick = changePic(-1);
nextPic.onclick = changePic(1);

function changePic(diff) {
    picNum += diff;
}