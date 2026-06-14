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

  // If prisma not available, simulate instead of crashing
  if (!prisma) {
    return { skill: skillName, shouldTriggerCert: progressIncrement >= 80, progress: progressIncrement }
  }

  // Real DB call only runs if prisma loaded successfully
  const skillRecord = await prisma.studentSkill.upsert({
    where: { studentId_skillName: { studentId, skillName } },
    update: { progress: { increment: progressIncrement } },
    create: { studentId, skillName, progress: progressIncrement }
  })

  return { skill: skillName, shouldTriggerCert: skillRecord.progress >= 80, progress: skillRecord.progress }
}
