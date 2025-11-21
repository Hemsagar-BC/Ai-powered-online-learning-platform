import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const generateCertificate = async (certificateData) => {
  const {
    studentName,
    courseName,
    completionDate,
    instructorName,
    certificateNumber,
    elementId = 'certificate'
  } = certificateData

  try {
    // Get the certificate element
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Certificate element not found')
    }

    // Convert to canvas
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const width = pdf.internal.pageSize.getWidth()
    const height = pdf.internal.pageSize.getHeight()

    pdf.addImage(imgData, 'PNG', 0, 0, width, height)

    // Download
    pdf.save(`${studentName}_${courseName}_Certificate.pdf`)

    return {
      success: true,
      message: 'Certificate generated successfully'
    }
  } catch (error) {
    throw new Error(`Failed to generate certificate: ${error.message}`)
  }
}

export const createCertificateHTML = (data) => {
  const {
    studentName,
    courseName,
    completionDate,
    instructorName,
    certificateNumber,
    courseDuration
  } = data

  return `
    <div class="certificate-container">
      <div class="certificate-border">
        <h1>Certificate of Completion</h1>
        <p class="certificate-text">This is to certify that</p>
        <h2 class="student-name">${studentName}</h2>
        <p class="certificate-text">has successfully completed the course</p>
        <h3 class="course-name">${courseName}</h3>
        <p class="certificate-text">Certificate Number: ${certificateNumber}</p>
        <p class="certificate-text">Duration: ${courseDuration}</p>
        <p class="certificate-text">Completion Date: ${completionDate}</p>
        <p class="instructor">Instructor: ${instructorName}</p>
        <div class="signature">
          <div class="signature-line"></div>
          <p>Digital Signature</p>
        </div>
      </div>
    </div>
  `
}

export const downloadCertificate = (pdfUrl, filename) => {
  const link = document.createElement('a')
  link.href = pdfUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
