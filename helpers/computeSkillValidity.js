function computeSkillValidity(subSkills) {
  const priorityValue = { low: 1, medium: 2, high: 3 };

    if (!Array.isArray(subSkills) || subSkills.length === 0) {
    return false;
  }

  const total = subSkills.length;
  const validated = subSkills.filter(s => s.isValid);
  const notValidated = subSkills.filter(s => !s.isValid);

  const half = total / 2;

  if (validated.length > half) {
    return true;
  }

  if (total % 2 === 0 && validated.length === half) {
    const validPriority = validated.reduce((sum, s) => sum + priorityValue[s.priority], 0);
    const invalidPriority = notValidated.reduce((sum, s) => sum + priorityValue[s.priority], 0);
    return validPriority > invalidPriority;
  }

  return false;
}

module.exports = computeSkillValidity
