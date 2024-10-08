const cosineSimilarity = (vec1, vec2) => {
  if (!vec1 || !vec2) return 0
  const intersection = new Set([...Object.keys(vec1), ...Object.keys(vec2)])
  const numerator = Array.from(intersection).reduce((sum, key) => sum + (vec1[key] || 0) * (vec2[key] || 0), 0)
  
  const sum1 = Object.values(vec1).reduce((sum, val) => sum + val * val, 0)
  const sum2 = Object.values(vec2).reduce((sum, val) => sum + val * val, 0)
  const denominator = Math.sqrt(sum1) * Math.sqrt(sum2)
  
  if (!denominator) return 0
  return numerator / denominator
}

export default cosineSimilarity;