document.addEventListener('DOMContentLoaded', init);
const colors = ['red', 'green', 'blue', 'green', 'yellow', 'purple'];
let i = 0;

function init() {
    const code = setCode();
    console.log(code);
    setCirclePanel(1);
}

function setCirclePanel(number){
    const div = document.getElementById('content-div');
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper' + number;
    wrapper.classList.add('wrapper');
    for (let i = 0; i < 4; i++) {
        wrapper.appendChild(getCircleElement());
    }
    const panel = document.createElement('div');
    panel.id = 'panel' + number;
    panel.classList.add('send-code');
    panel.addEventListener('click', sendCode);
    panel.innerText = 'Test Code';
    wrapper.appendChild(panel);
    div.appendChild(wrapper);

}

async function setCode(){
    await fetch('/getCode').then(resp => resp.json()).then( json => console.log(json));
}

async function sendCode() {

    let wrapper = document.getElementById('wrapper' + getRowCount());

    let colors = [];
    for (let circle of wrapper.childNodes){
        let color = circle.getAttribute('color');
        if (color !== null){

            colors.push(color);
        }
    }
    await fetch("/compareCodes",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(colors)
        }).then(resp => resp.json()).then(json => setHintPanel(json));

}

function getCircleElement() {
    let circle = document.createElement('div');
    circle.classList.add('circle');
    circle.addEventListener('click', function () {
        if (i === 5) {
            i = 0;
        }
        circle.style.backgroundColor = colors[i];
        circle.setAttribute('color', colors[i]);

        i++;
    });
    return circle;
}

function getRowCount(){
    let contentDiv = document.getElementById('content-div');
    return contentDiv.childElementCount;
}

async function setHintPanel(hints) {

    let numberOfRows = getRowCount();
    let panel = document.getElementById('panel'+numberOfRows);
    panel.innerText = "";
    panel.classList.remove('send-code');
    panel.classList.add('hints');
    let correctPosition = hints[0];
    let correctColors = hints[1];

    while (correctPosition !== 0){
        let pos = document.createElement('div');
        pos.classList.add('correct-position');
        panel.appendChild(pos);
        correctPosition--;

    }

     while (correctColors !== 0){
        let color = document.createElement('div');
        color.classList.add('correct-color');
        panel.appendChild(color);
        correctColors--;

    }
    setCirclePanel(numberOfRows+1);

}

async function resetAnimation() {
    const allCircles = document.querySelectorAll('.circle');

}