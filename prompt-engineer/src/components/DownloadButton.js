import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { React, useState, forwardRef, useRef } from "react"
import { jsPDF } from "jspdf"


const DownloadButton = forwardRef(({ dialogueContent, sceneDescription, editCount = 0, sliderCount = 0, generateCount = 0 }, ref) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const generatePDF = async () => {
    setIsDownloading(true)
    try {
      // Create new document with Courier font
      const doc = new jsPDF()
      doc.setFont("courier")
      
      // Set page margins and dimensions
      const margin = 20
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const contentWidth = pageWidth - (2 * margin)
      
      // Set initial Y position
      let yPos = margin

      // Add page numbers to bottom of each page
      const addPageNumber = () => {
        const pageNumber = doc.internal.getNumberOfPages()
        doc.setFontSize(12)
        doc.text(String(pageNumber) + ".", pageWidth - margin - 10, pageHeight - margin)
      }

      // Function to check if we need a new page
      const checkNewPage = (height) => {
        if (yPos + height > pageHeight - margin) {
          doc.addPage()
          yPos = margin
          addPageNumber()
        }
      }

      // Add scene description if provided
      if (sceneDescription) {
        doc.setFontSize(12)
        const sceneText = sceneDescription.toUpperCase()
        checkNewPage(20)
        doc.text(sceneText, margin, yPos)
        yPos += 20
      }

      // Add each dialogue block
      dialogueContent.forEach((entry) => {
        checkNewPage(40) // Check if we need a new page for this dialogue block

        // Character name (centered, all caps)
        doc.setFontSize(12)
        const characterName = entry.character.toUpperCase()
        const characterWidth = doc.getStringUnitWidth(characterName) * 12 / doc.internal.scaleFactor
        const characterX = (pageWidth - characterWidth) / 2
        doc.text(characterName, characterX, yPos)
        yPos += 10

        // Dialogue text (indented)
        doc.setFontSize(12)
        const dialogueIndent = 30
        const dialogueWidth = contentWidth - (2 * dialogueIndent)
        
        const splitDialogue = doc.splitTextToSize(entry.dialogue, dialogueWidth)
        checkNewPage(splitDialogue.length * 7) // 7 points per line of dialogue
        
        splitDialogue.forEach(line => {
          doc.text(line, margin + dialogueIndent, yPos)
          yPos += 7
        })

        yPos += 15 // Space between dialogue blocks
      })

      // Add statistics section at the end
      checkNewPage(40) // Check if we need a new page for stats
      yPos += 10 // Add some extra space before stats
      
      doc.setFontSize(12)
      const statsHeader = "SCRIPT STATISTICS"
      const statsHeaderWidth = doc.getStringUnitWidth(statsHeader) * 12 / doc.internal.scaleFactor
      const statsHeaderX = (pageWidth - statsHeaderWidth) / 2
      
      // Add divider line
      doc.setLineWidth(0.5)
      doc.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 15

      // Add header
      doc.text(statsHeader, statsHeaderX, yPos)
      yPos += 15

      // Add statistics
      doc.text(`Total Dialogue Edits: ${editCount}`, margin, yPos)
      yPos += 10
      doc.text(`Total Character Adjustments: ${sliderCount}`, margin, yPos)
      yPos += 10
      doc.text(`Total Dialogue Generations: ${generateCount}`, margin, yPos)

      // Add final page number
      addPageNumber()
      
      // Save the PDF
      const date = new Date().toISOString().split('T')[0]
      doc.save(`screenplay-${date}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      ref={ref}
      onClick={generatePDF}
      variant="outline"
      className="text-gray-400 hover:text-gray-200 flex items-center gap-2 border-transparent"
      disabled={isDownloading}
    >
      <Download size={16} />
      {isDownloading ? 'Downloading...' : 'Download Script'}
    </Button>
  )
})

export default DownloadButton