import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { db } from '@/lib/db' // your DB client

export async function POST(req: NextRequest) {
  const { studentId, type, topicId, skillId } = await req.json()
  
  // 1. Fetch data - school name + logo captured at registration
  const student = await db.student.findUnique({ where: { id: studentId } })
  const school = await db.school.findUnique({ where: { id: student.schoolId } })
  const topic = topicId ? await db.topic.findUnique({ where: { id: topicId } }) : null
  const skill = skillId ? await db.skill.findUnique({ where: { id: skillId } }) : null
  
  // 2. Generate PDF
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
  const chunks: Buffer[] = []
  doc.on('data', chunk => chunks.push(chunk))
  
  // Header logos
  if (school.logoUrl) doc.image(school.logoUrl, 50, 40, { width: 80 })
  doc.image('/ai-academy-logo.png', 650, 40, { width: 80 })
  doc.fontSize(10).text(school.name, 50, 125) // School name beside logo
  
  // Main header - FIXED: Learning with 'g'
  doc.fontSize(24).text('AI + Coding Future Academy Learning', 0, 50, { align: 'center' })
  
  // Certificate body
  doc.moveDown(3)
  doc.fontSize(18).text(`Topic/Skill Covered: ${skill ? skill.name : topic.name}`, { align: 'center' })
  doc.moveDown(1)
  doc.fontSize(16).text(`Course Completed By: ${student.fullName}`, { align: 'center' })
  doc.fontSize(14).text(`Month and Year: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, { align: 'center' })
  
  if (skill) {
    doc.moveDown(1)
    doc.fontSize(14).text(`Top Skill Covered: ${skill.name}`, { align: 'center' })
  }
  
  // Signature
  doc.moveDown(3)
  doc.fontSize(14).text('Michael Oluwatosin Talabi', { align: 'center' })
  doc.fontSize(12).text('Head of Learning, AI + Coding Future Academy Learning', { align: 'center' })
  
  // Certificate ID
  const certId = `ACFA-${student.level}-${skillId || topicId}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  doc.moveDown(2)
  doc.fontSize(10).text(`Certificate ID: ${certId}`, { align: 'center' })
  
  doc.end()
  
  await new Promise(resolve => doc.on('end', resolve))
  const pdfBuffer = Buffer.concat(chunks)
  
  // 3. Save to Vercel Blob + DB
  // ... upload logic here
  
  return new NextResponse(pdfBuffer, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${certId}.pdf"` }
  })
}
