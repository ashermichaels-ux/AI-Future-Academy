export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

export async function POST(req: NextRequest) {
  try {
    const { studentName, courseName } = await req.json()

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))
    
    doc.fontSize(24).text('Certificate of Completion', { align: 'center' })
    doc.moveDown()
    doc.fontSize(18).text(`This certifies that`, { align: 'center' })
    doc.moveDown()
    doc.fontSize(22).text(studentName || 'Student', { align: 'center', underline: true })
    doc.moveDown()
    doc.fontSize(18).text(`has completed the course:`, { align: 'center' })
    doc.moveDown()
    doc.fontSize(20).text(courseName || 'Course', { align: 'center' })
    doc.moveDown(2)
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' })

    doc.end()

    await new Promise((resolve) => doc.on('end', resolve))
    const pdfBuffer = Buffer.concat(chunks)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="certificate.pdf"',
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
