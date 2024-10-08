// Levenshtein Distance Function (for fuzzy matching)
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
  
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));
  
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
  
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
  
    return dp[m][n];
  }
  
  // Fuzzy match checker
  function isFuzzyMatch(term, token, threshold = 2) {
    return levenshteinDistance(term, token) <= threshold;
  }
  
  // Updated termFrequencyVector to account for fuzzy matches
  const termFrequencyVectorTypo = (tokens, allTerms, threshold = 1) => {
    return allTerms.map(term => 
      tokens.reduce((count, token) => 
        count + (isFuzzyMatch(term, token, threshold) ? 1 : 0), 0)
    );
  };
  
  export default termFrequencyVectorTypo;
  