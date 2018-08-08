
export default {
    downloadFile(json, fileName) {
        let content = new Blob([JSON.stringify(json)])
        let urlObject = window.URL || window.webkitURL || window
        let url = urlObject.createObjectURL(content)
        let el = document.createElement('a')
        el.href = url
        el.download = fileName? `${fileName}.dat` : "wallet.dat"
        document.body.appendChild(el)
        el.click()
        urlObject.revokeObjectURL(url)
    },
    readWalletFile($file) {

        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (params) {
                resolve(reader.result)
            }
            reader.onerror = reject

            reader.readAsText($file)
        })
    }
}
