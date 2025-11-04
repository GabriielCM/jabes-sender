// pdf-reader.js
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;

async function stampPdf(pdfPath, contato) {
  const pdfBytes = await fs.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();
  const text = `Nome: ${contato.nome}\nCNPJ: ${contato.cnpj}\nTelefone: ${contato.telefone}`;
  const lines = text.split('\n');
  const fontSize = 10;
  const lineHeight = 14;
  const padding = 10;
  const boxHeight = lines.length * lineHeight + padding * 2;
  const boxWidth = 280;

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Posição: canto inferior esquerdo
    const x = 40;
    const y = 30;

    // Fundo branco com borda preta
    page.drawRectangle({
      x,
      y,
      width: boxWidth,
      height: boxHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1.5,
      color: rgb(1, 1, 1),
    });

    // Desenha o texto linha por linha
    lines.forEach((line, i) => {
      page.drawText(line, {
        x: x + padding,
        y: y + boxHeight - padding - (i + 1) * lineHeight,
        size: fontSize,
        font: helvetica,
        color: rgb(0, 0, 0),
      });
    });
  }

  return await pdfDoc.save();
}

module.exports = { stampPdf };