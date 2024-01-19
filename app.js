const fs = require('fs')
const path = require('path')
const { PDFDocument, rgb } = require('pdf-lib')
const pdf_extract = require('pdf-extract')

console.log("Usage: node app.js the/path/tothe.pdf")
const absolute_path_to_pdf = path.resolve(process.argv[2])
if (absolute_path_to_pdf.includes(" ")) throw new Error("will fail for paths w spaces like "+absolute_path_to_pdf)

const absolute_path_safed_pdf = path.resolve('pages/o.pdf')

safeFirstPage(absolute_path_to_pdf, absolute_path_safed_pdf)

const options = {
    type: 'ocr', // perform ocr to get the text within the scanned image
    ocr_flags: ['--psm 1', 
                '-l deu',
                '-c tessedit_page_number=0' // nur 1. Seite
               ], 
    mode: 'simple',
}
const processor = pdf_extract(absolute_path_safed_pdf, options, ()=>console.log("Starting…"))
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

async function safeFirstPage(pdfPath, safePath) {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath))
    try {
        while(1) pdfDoc.removePage(1)
    } catch (err) {
        // console.log(err)
    }
    fs.writeFileSync(safePath, await pdfDoc.save())
}