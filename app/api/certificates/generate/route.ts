export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

const mockStudent = {
  id: "1",
  fullName: "Test Student",
  schoolId: "1",
  level: "Beginner"
}

const mockSchool = {
  id: "1", 
  name: "AI Future Academy Demo School",
  logoUrl: null
}

const mockTopic = {
  id: "1",
  name: "Next.js Basics"
}

const mockSkill = {
  id: "1", 
  name: "API Routes"
}

export async function POST(req: NextRequest) {
  const { studentId, type, topicId, skillId } = await req.json()
  
  const student = studentId === "1" ? mockStudent : mockStudent
  const school = student.schoolId === "1" ? mockSchool : mockSchool
  const topic = topicId === "1" ? mockTopic : mockTopic
  const skill = skillId === "1" ? mockSkill : null
  
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
  const chunks: Buffer[] = []
  doc.on('data', chunk => chunks.push(chunk))
  
  if (school.logoUrl) doc.image(school.logoUrl, 50, 40, { width: 80 })
  doc.fontSize(14).text('AI Academy', 650, 40)
  doc.fontSize(10).text(school.name, 50, 125)
  
  doc.fontSize(24).text('AI + Coding Future Academy Learning', 0, 50, { align: 'center' })
  
  doc.moveDown(3)
  doc.fontSize(18).text(`Topic/Skill Covered: ${skill ? skill.name : topic.name}`, { align: 'center' })
  doc.moveDown(1)
  doc.fontSize(16).text(`Course Completed By: ${student.fullName}`, { align: 'center' })
  doc.fontSize(14).text(`Month and Year: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, { align: 'center' })
  
  if (skill) {
    doc.moveDown(1)
    doc.fontSize(14).text(`Top Skill Covered: ${skill.name}`, { align: 'center' })
  }
  
  doc.moveDown(3)
  doc.fontSize(14).text('Michael Oluwatosin Talabi', { align: 'center' })
  doc.fontSize(12).text('Head of Learning, AI + Coding Future Academy Learning', { align: 'center' })
  
  const certId = `ACFA-${student.level}-${skillId || topicId}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  doc.moveDown(2)
  doc.fontSize(10).text(`Certificate ID: ${certId}`, { align: 'center' })
  
  doc.end()
  await new Promise(resolve => doc.on('end', resolve))
  const pdfBuffer = Buffer.concat(chunks)
  
  return new NextResponse(pdfBuffer, {
    headers: { 
      'Content-Type': 'application/pdf', 
      'Content-Disposition': `attachment; filename="${certId}.pdf"` 
    }
  })
}
