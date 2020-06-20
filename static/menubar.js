document.addEventListener('DOMContentLoaded', initSidebar);

function initSidebar() {
    makeAjaxCall('/getMenu', 'GET', null, 'application/json', addSideBar);

}

function addSideBar(data) {
    let mainDiv = document.getElementById('main-div');
    let dataJson = JSON.parse(data)
    for (let entry of dataJson) {

        let div = document.createElement("div");
        let p = document.createElement("div");
        p.id = entry[0] + "entryId";
        p.textContent = entry[0];
        p.addEventListener('click', function () {
            createContentPage(entry[1]);
        });

        div.appendChild(p);
        mainDiv.appendChild(div)

    }
}

function createContentPage(url) {
    let contentDiv = document.getElementById('content-div');
    clearElement(contentDiv);
    makeAjaxCall(url, 'GET', null, null, function (data) {
        let p = document.createElement("p");
        p.innerText = data;
        contentDiv.appendChild(p);
    })
}

function clearElement(element) {
    while(element.firstChild){
        element.removeChild(element.firstChild);
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
    if(datatype === 'application/json'){
        callback(JSON.parse(request.responseText));
    } else {
        callback(request.responseText);
    }
    console.log(" request success");
}

