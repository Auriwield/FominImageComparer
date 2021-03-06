function onSelectOrDragImage() {
    return new window.Promise(function (resolve) {
        $(".drop-zone:first")
            .on("dragover", function (event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).addClass('dragging');
            })
            .on("dragleave", function (event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).removeClass('dragging');
            })
            .on("drop", function (event) {
                event.preventDefault();
                event.stopPropagation();
                let file = event.originalEvent.dataTransfer.files[0];
                resolve(file);
            });

        $("a#preview").click(function () {
            let url = window.location.href + "/img/1.png";

            let xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";

            xhr.onload = function () {
                if (this.status === 200) {
                    let blob = this.response;
                    resolve(blob);
                }
            };

            xhr.send();
        });

        let input = $("input#fake-button");

        input.on("change", function (event) {
            let file = event.delegateTarget.files[0];
            resolve(file);
        });

        $(".drop-zone .btn").click(function () {
            input.click();
        });
    });
}

$(document).ready(function () {
    onSelectOrDragImage()
        .then(function (file) {
            let dropZone = $(".drop-zone:first");
            let tabs = $("#tabs");
            dropZone.addClass("hidden");
            tabs.removeClass("hidden");
            return canvasUtils.getImageData(file);
        })
        .then(function (leftImageData) {
            let data = bc1.encode(leftImageData);

            imageData.left = leftImageData;
            imageData.right = bc1.decode(data);

            $(".header nav li a.active").first().parent().click();
        });
});

const imageData = (function () {
    return {
        left: null,
        right: null
    }
});