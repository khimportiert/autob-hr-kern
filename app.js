const fs = require('fs')
const path = require('path')
const pdf_extract = require('pdf-extract')

console.log("Usage: node app.js the/path/tothe.pdf")
const absolute_path_to_pdf = path.resolve(process.argv[2])
if (absolute_path_to_pdf.includes(" ")) throw new Error("will fail for paths w spaces like "+absolute_path_to_pdf)

const options = {
    type: 'ocr', // perform ocr to get the text within the scanned image
    ocr_flags: ['--psm 1', '-l deu'], // automatically detect page orientation
    mode: 'simple',
}
const processor = pdf_extract(absolute_path_to_pdf, options, ()=>console.log("Starting…"))
processor.on('complete', data => callback(null, data))
processor.on('error', callback)
function callback (error, data) { error ? console.error(error) : test_file_write(data.text_pages[0]) }





test_file_write = function (content) {
    try {
        fs.writeFileSync('output.txt', content);
        // file written successfully
    } catch (err) {
        console.error(err);
    }
}