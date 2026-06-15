export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import topicSkillMap from '../../../../lib/topic-skill-map.json'
import type { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null
try {
  if (process.env.DATABASE_URL) {
    prisma = require('../../../../lib/prisma').prisma
  }
} catch (e) {
  console.log('Prisma not available, running in test mode')
}

type SkillProgress = {
  skill: string | null
  shouldTriggerCert: boolean
  progress: number
}

const updateSkillProgress = async (
  studentId: string,
  level: string,
  topicId: string
): Promise<SkillProgress> => {
  const levelMap = topicSkillMap[level as keyof typeof topicSkillMap]
  if (!levelMap) return { skill: null, shouldTriggerCert: false, progress: 0 }

  let skillName: string | null = null
  for (const [skill, topics] of Object.entries(levelMap)) {
    if (Array.isArray(topics) && topics.includes(topicId)) {
      skillName = skill
      break
    }
  }
  if (!skillName) return { skill: null, shouldTriggerCert: false, progress: 0 }

  const skillTopics = levelMap[skillName]
