export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import topicSkillMap from '@/lib/topic-skill-map.json'
import { db } from '@/lib/db' // adjust path if your prisma client is elsewhere

const updateSkillProgress = async (studentId: string, level: string, topicId: string) => {
  const levelMap = topicSkillMap[level as keyof typeof topicSkillMap]
  let skillName = null

  if (levelMap) {
    for (const [skill, topics] of Object.entries(levelMap)) {
      if (topics.includes(topicId)) {
        skillName = skill
        break
      }
    }
  }

  if (!skillName) return { skill: null, shouldTriggerCert: false, progress: 0 }

  const totalTopics = levelMap[skillName].length
  const progressIncrement = 100 / totalTopics

  const skillRecord = await db.studentSkill.upsert({
    where: { studentId_skillName: { studentId, skillName } },
    update: { progress: { increment: progressIncrement } },
    create: { studentId, skillName, progress: progressIncrement }
  })

  return { skill: skillName, shouldTriggerCert: skillRecord.progress >= 80, progress: skillRecord.progress }
}

export async function POST(req: NextRequest) {
  try {
    const { studentName, courseName, studentId, topicId } = await req.json()

    // 1. Check skill progress
    const skillUpdate = await updateSkillProgress(studentId, student.level, topicId)
    const certType = skillUpdate.shouldTriggerCert? 'skill' : 'topic'
    const skillName = skillUpdate.skill

    // 2. Generate PDF
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' })
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))

    doc.fontSize(24).text('Certificate of Completion', { align: 'center' })
    doc.moveDown()
    doc.fontSize(18).text(`This certifies that`, { align: 'center' })
    doc.moveDown()
    doc.fontSize(22).text(studentName || 'Student', { align: 'center', underline: true })
    doc.moveDown()
    doc.fontSize(18).text(`has completed: ${certType === 'skill'? 'Skill ' + skillName : courseName}`, { align: 'center' })
    doc.moveDown(2)
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' })

    doc.end()
    await new Promise((resolve) => doc.on('end', resolve))
    const pdfBuffer = Buffer.concat(chunks)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${certType}-certificate.pdf"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
