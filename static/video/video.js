(function () {
    init();
    function init() {
        let contentDiv = document.getElementById('content-div');
        let video = document.createElement('video');
        video.src = '/static/media/sauerbraten.mp4';
        video.controls = 'controls';
        contentDiv.appendChild(video);

    }
}());

