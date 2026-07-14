const PDFParser = require('pdf2json');
const fs = require('fs');

const pdfPath = 'C:\\Users\\iaege\\Downloads\\GUIA-TECNICA-DE-SM-en-situaciones-de-desastre.pdf';
const outputPath = 'C:\\Users\\iaege\\Proyectos Cavecom-e\\Resilente\\guia-tecnica.txt';

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataError', errData => {});
pdfParser.on('pdfParser_dataReady', pdfData => {
    const text = pdfParser.getRawTextContent();
    fs.writeFileSync(outputPath, text, 'utf8');
    console.log('PDF extraído exitosamente a: ' + outputPath);
    console.log('Longitud del texto:', text.length, 'caracteres');
});

pdfParser.loadPDF(pdfPath);
