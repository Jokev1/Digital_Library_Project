import Stem from "./Stemming"

const computeTF = (text) => {
  const tf = {}
  text.forEach(word => {
    const stemmed = Stem(word)
    tf[stemmed] = (tf[stemmed] || 0) + 1
  })
  Object.keys(tf).forEach(word => {
    tf[word] = tf[word] / text.length
  })
  return tf
}

const computeIDF = (documents) => {
  const idf = {}
  const n = documents.length
  documents.forEach(doc => {
    const stemmedDoc = new Set(doc.map(Stem))
    stemmedDoc.forEach(word => {
      idf[word] = (idf[word] || 0) + 1
    })
  })
  Object.keys(idf).forEach(word => {
    idf[word] = Math.log(n / (idf[word] + 1))
  })

  return idf
}

const computeTFIDF = (tf, idf) => {
  const tfidf = {}
  Object.keys(tf).forEach(word => {
    tfidf[word] = tf[word] * (idf[word] || 0)
  })
  return tfidf
}

export {computeTF, computeIDF, computeTFIDF}