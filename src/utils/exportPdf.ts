import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePdfDocument(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }

  // Create canvas screenshot of element
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#090d16'
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 10;

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  pdf.save(fileName);
}
