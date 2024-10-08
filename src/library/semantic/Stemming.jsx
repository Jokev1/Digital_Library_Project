const Stem = (word) => {
    if (word.endsWith('ing')) return word.slice(0, -3)
    if (word.endsWith('ly')) return word.slice(0, -2)
    if (word.endsWith('s')) return word.slice(0, -1)
    return word
  }

  export default Stem