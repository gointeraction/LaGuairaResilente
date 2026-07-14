const PDFParser = require('pdf2json');
const fs = require('fs');

const pdfPath = 'C:\\Users\\iaege\\Downloads\\GUIA-TECNICA-DE-SM-en-situaciones-de-desastre.pdf';

if (!fs.existsSync(pdfPath)) {
    console.log('Error: Archivo no encontrado');
    process.exit(1);
}

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));
pdfParser.on('pdfParser_dataReady', pdfData => {
    const text = pdfParser.getRawTextContent();
    console.log(text);
});

pdfParser.loadPDF(pdfPath);
