const termFrequencyVector = (tokens, allTerms) => {
  return allTerms.map(term => tokens.filter(t => t === term).length);
};

export default termFrequencyVector;