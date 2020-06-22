document.addEventListener('DOMContentLoaded', init);
const colors = ['red', 'green', 'blue', "green"];
let i = 0;

function init() {
    const div = document.getElementById('content-div');

    for (let i = 0; i < 4; i++) {

        div.appendChild(getCircleElement());

    }
    sendCode(colors);
}

async function sendCode(data) {
    fetch("/compareCodes",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data)
        }).then(resp => resp.json()).then(json => console.log(json))

}

function getCircleElement() {
    let circle = document.createElement('div');
    circle.classList.add('circle');
    circle.addEventListener('click', function () {
        if (i === 3) {
            i = 0;
        }
        circle.style.backgroundColor = colors[i];
        i++;
    })
    return circle;
}