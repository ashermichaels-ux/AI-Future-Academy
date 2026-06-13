import topicSkillMap from '@/lib/topic-skill-map.json'

// Add this function inside the file, above POST
const updateSkillProgress = async (studentId: string, level: string, topicId: string) => {
  // 1. Find which skill this topic belongs to
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

  if (!skillName) return { skill: null, shouldTriggerCert: false }

  // 2. Update skill % in DB - each topic = 100/total_topics for that skill
  const totalTopics = levelMap[skillName].length
  const progressIncrement = 100 / totalTopics

  const skillRecord = await db.studentSkill.upsert({
    where: { studentId_skillName: { studentId, skillName } },
    update: { progress: { increment: progressIncrement } },
    create: { studentId, skillName, progress: progressIncrement }
  })

  // 3. Check if ≥80% for Skill Mastery Cert
  const shouldTriggerCert = skillRecord.progress >= 80

  return { skill: skillName, shouldTriggerCert, progress: skillRecord.progress }
}

// Then inside your POST function, after fetching topic:
const skillUpdate = await updateSkillProgress(studentId, student.level, topicId)

// Use this to decide cert type:
const certType = skillUpdate.shouldTriggerCert? 'skill' : 'topic'
const skillId = skillUpdate.skill
