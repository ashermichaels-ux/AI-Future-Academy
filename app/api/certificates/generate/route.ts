export {}
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import topicSkillMap from '../../../../lib/topic-skill-map.json'

let prisma: any = null
try {
  // Only load prisma if DATABASE_URL exists - prevents build crash
  if (process.env.DATABASE_URL) {
    prisma = require('../../../../lib/prisma').prisma
  }
} catch (e) {
  console.log('Prisma not available, running in test mode')
}

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

  // If prisma not available,
