const { clipboard, shell } = require('electron').remote
const { ipcRenderer } = require('electron')
var Tesseract = require('tesseract.js')

window.Tesseract = Tesseract.create({
    workerPath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/master/index.js',
    langPath: 'eng.traineddata',
    corePath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/0.1.0/index.js',
})

final_result = ""

progress_bar = document.getElementById("progress_bar")

sctext = function () {
    clipboard_image = clipboard.readImage()
    pp = clipboard_image.toDataURL()
    if (pp != "data:image/png;base64,") {
        document.getElementById("screenshort").setAttribute('src', pp)

        startLoading()

        Tesseract.recognize(clipboard_image.toPNG())
            .progress(function (p) {
                if (p.status == "recognizing text")
                    changeProgressBar(p.progress)
            })
            .then(function (result) {
                final_result = result.text
                stopLoading()
            })
    }
}
sctext()

document.getElementById("search").addEventListener("click", function search() {
    if (final_result) {
        usageCount(final_result)
        search_string = final_result.trim().replace(/\s/g, "+").replace(/\n/g, '+')
        shell.openExternal("http://www.google.com/search?q=" + search_string)
    }
})

function changeProgressBar(val) {
        val = Math.round(val*100)
        progress_bar.value = val
}
function stopLoading() {
    document.getElementById("progress").style.display = "none"
    document.getElementById("search").style.display = "block"
}
function startLoading() {
    document.getElementById("progress").style.display = "block"
    document.getElementById("search").style.display = "none"
}

function usageCount(value) {
    ipcRenderer.send('usage_history', ['User Interaction', 'Search', "Google", value])
}