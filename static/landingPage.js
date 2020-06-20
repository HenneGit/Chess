document.addEventListener('DOMContentLoaded', init);


function init() {
    buildLetterGrid("Hello")
    makeAjaxCall('/getLetters', 'GET', null, 'application/json', colorLetters);

}

function buildLetterGrid(word) {

    let letters = 0;
    let mainDiv = document.getElementById('main-div');
    let table = document.createElement('div');
    table.id = 'table';
    while (letters < word.length) {
        let rows = 0;
        let letterDiv = document.createElement('div');
        letterDiv.id = 'l' + letters;
        letterDiv.class = 'column';
        while (rows < 7) {
            let row = document.createElement('tr')
            let cells = 0;
            while (cells < 6) {
                let cell = document.createElement('td');
                cell.id = 'l' + letters + 'r' + rows + 'c' + cells;
                row.appendChild(cell);
                cells++;
            }
            letterDiv.appendChild(row);
            rows++;

        }
        table.appendChild(letterDiv);
        letters++;
    }
    mainDiv.appendChild(table);
}


function colorLetters(data) {
    let l = 0;
    for (let letter of data) {
        for (let id of letter) {
            let td = document.getElementById('l' + l + id);
            td.style.backgroundColor = 'green';
        }
        l++;
    }
}


function makeAjaxCall(url, method, data, datatype, callback) {

    var request = new XMLHttpRequest();
    request.open(method, url, false);
    request.setRequestHeader('Content-type', datatype);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.readyState === 204) {
                console.log("request success");
                callback();
            }
            if (request.readyState === 200) {
                var response = request.responseText;
                callback(response);
            } else {
                console.log(request.status + " :request failed");

            }
        } else {
            console.log(request.status + " :request processing...")
        }

    }
    request.send(data);
    if (datatype === 'application/json') {
        callback(JSON.parse(request.responseText));
    } else {
        callback(request.responseText);
    }
    console.log(" request success");
}
