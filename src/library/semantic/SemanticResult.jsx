import { useState, useEffect} from 'react'
import { Star, StarHalf } from 'lucide-react'
import tempData from '../../temp.json'
import { computeTF, computeIDF, computeTFIDF } from './TfIdf'
import Stem from './Stemming'
import cosineSimilarity from './CosineSim'

// Enhanced text preprocessing
const preprocess = (text) => {
  const tokens = text.toLowerCase().split(/\W+/)
  const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'ought'])
  return tokens.filter(token => token && !stopWords.has(token))
}

const synonyms = {
  'love': ['affection', 'passion', 'adoration'],
  'war': ['conflict', 'battle', 'fight'],
  'money': ['wealth', 'fortune', 'cash'],
  'power': ['authority', 'control', 'influence'],
  'freedom': ['liberty', 'independence', 'autonomy'],
}

const NLP = ({ query }) => {
    const [results, setResults] = useState([])
    const [idf, setIDF] = useState({})
    const [tfidfDocs, setTfidfDocs] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const booksPerPage = 20
  
    useEffect(() => {
      // init here
      const processedDocs = Object.entries(tempData).map(([key, book]) => ({
        title: preprocess(book.book_title),
        authors: preprocess(book.book_authors.join(' ')),
        genres: preprocess(book.genres.join(' ')),
        description: preprocess(book.book_desc)
      }))
      
      const allTokens = processedDocs.flatMap(doc => [...doc.title, ...doc.authors, ...doc.genres, ...doc.description])
      const idf = computeIDF([allTokens])
      setIDF(idf)
  
      const tfidfDocs = processedDocs.map(doc => ({
        title: computeTFIDF(computeTF(doc.title), idf),
        authors: computeTFIDF(computeTF(doc.authors), idf),
        genres: computeTFIDF(computeTF(doc.genres), idf),
        description: computeTFIDF(computeTF(doc.description), idf)
      }))
      setTfidfDocs(tfidfDocs)
    }, [])
  
    useEffect(() => {
      if (query && idf && tfidfDocs.length > 0) {
        handleSearch(query)
      }
    }, [query, idf, tfidfDocs])
  
    const handleSearch = (searchQuery) => {
      let processedQuery = preprocess(searchQuery)
      
      // synonyms
      processedQuery = processedQuery.flatMap(word => {
        const stemmedWord = Stem(word)
        return [stemmedWord, ...(synonyms[stemmedWord] || [])]
      })
  
      const queryTF = computeTF(processedQuery)
      const queryTFIDF = computeTFIDF(queryTF, idf)
  
      const searchResults = Object.entries(tempData).map(([key, book], index) => {
        const docTFIDF = tfidfDocs[index]
        
        // thresholds for the search
        const titleSimilarity = cosineSimilarity(queryTFIDF, docTFIDF.title) * 0.4
        const authorsSimilarity = cosineSimilarity(queryTFIDF, docTFIDF.authors) * 0.1
        const genresSimilarity = cosineSimilarity(queryTFIDF, docTFIDF.genres) * 0.2
        const descriptionSimilarity = cosineSimilarity(queryTFIDF, docTFIDF.description) * 0.3
  
        const semanticScore = titleSimilarity + authorsSimilarity + genresSimilarity + descriptionSimilarity
  
        const titleWords = book.book_title.toLowerCase().split(/\s+/)
        const authorWords = book.book_authors.join(' ').toLowerCase().split(/\s+/)
        const partialMatchScore = titleWords.concat(authorWords).reduce((score, word) => {
          return score + (word.startsWith(searchQuery.toLowerCase()) ? 0.05 : 0)
        }, 0)
  
        return {
          key,
          similarity: semanticScore + partialMatchScore,
          book: book
        }
      })
  
      setResults(searchResults.filter(result => result.similarity > 0).sort((a, b) => b.similarity - a.similarity))
    }
  
    const renderStars = (rating) => {
      const filledStars = Math.floor(rating)
      const decimalPart = rating - filledStars
  
      const stars = []
      for (let i = 0; i < filledStars; i++) {
        stars.push(<Star key={`star-filled-${i}`} size={15} color="#ffdd00" />)
      }
      if (decimalPart > 0) {
        stars.push(<StarHalf key="star-half" size={15} color="#ffdd00" />)
      }
  
      return <div className="flex">{stars}</div>
    }
  
    function kFormatter(num) {
      return Math.abs(num) > 999 
        ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' 
        : Math.sign(num) * Math.abs(num)
    }
  
    const indexOfLastBook = currentPage * booksPerPage
    const indexOfFirstBook = indexOfLastBook - booksPerPage
    const currentBooks = results.slice(indexOfFirstBook, indexOfLastBook)
    const totalPages = Math.ceil(results.length / booksPerPage)
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1)
      }
    }
  
    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  
    return (
      <div className="w-full">
        {results.length > 0 ? (
          <div className="grid grid-flow-row grid-cols-4 gap-4 w-full">
            {currentBooks.map(({ key, similarity, book }) => (
              <div key={key} className="flex flex-col justify-center items-center h-auto pb-10 relative group overflow-visible w-full">
                <img src={book.image_url} alt={book.book_title} className="h-52 w-auto object-cover mb-3" />
                <div className="h-10 w-full flex justify-center items-center">
                  <p className="line-clamp-2 font-semibold">{book.book_title}</p>
                </div>
                <p className="flex flex-row justify-center items-center absolute bottom-2">
                  {renderStars(book.book_rating)} {book.book_rating} {kFormatter(book.book_rating_count)}
                </p>
  
                <div className="flex flex-row justify-center items-center scale-0 group-hover:scale-100 transition-all duration-300 absolute bg-gradient-to-b from-slate-950 to-black p-10 rounded-xl z-10 max-h-90 w-[35rem] gap-5 border-indigo-700 border">
                  <img src={book.image_url} alt={book.book_title} className="h-52 w-auto mb-3" />
                  <div className="flex flex-col justify-between items-center w-full h-full gap-2">
                    <p className="font-semibold text-lg">{book.book_title}</p>
                    <p className="text-sm line-clamp-1">{book.book_authors.join(", ")}</p>
                    <p className="text-sm line-clamp-[7] font-light">{book.book_desc}</p>
                    <p className="text-sm line-clamp-1"> {book.genres.join(", ")}</p>
                    <p className="flex flex-row justify-center items-center absolute bottom-[5%] left-52">{book.book_pages} Pages</p>
                    <p className="flex flex-row justify-center items-center absolute bottom-3 right-5">
                      {renderStars(book.book_rating)} {book.book_rating} {kFormatter(book.book_rating_count)}
                    </p>
                    <p className="text-sm mt-1">Similarity: {(similarity * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No books found.</div>
        )}
  
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-transparent border border-indigo-700 text-indigo-700 rounded cursor-pointer font-semibold"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-transparent border border-indigo-700 text-indigo-700 rounded font-semibold"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

export default NLP