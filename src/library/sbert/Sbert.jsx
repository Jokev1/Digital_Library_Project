import { useState, useEffect } from "react";
import { StarHalfIcon, StarIcon } from "lucide-react";
import PropTypes from "prop-types";
import axios from "axios";
import Data from "../../temp.json"; // Assuming temp.json is available locally

Books.propTypes = {
  query: PropTypes.string.isRequired,
};

function Books({ query }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 20;

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const decimalPart = rating - filledStars;

    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<StarIcon size={15} color="#ffdd00" key={`star-filled-${i}`} />); // Filled star
    }
    for (let i = 0; i < decimalPart; i++) {
      stars.push(<StarHalfIcon size={15} color="#ffdd00" key={`star-half-${i}`} />); // Half-filled star
    }

    return <div style={{ display: "flex" }}>{stars}</div>;
  };

  function kFormatter(num) {
    if (Math.abs(num) > 999 && Math.abs(num) < 1000000) {
      return Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + "K";
    } else if (Math.abs(num) > 1000000) {
      return Math.sign(num) * ((Math.abs(num) / 1000000).toFixed(1)) + "M";
    } else {
      return Math.sign(num) * Math.abs(num);
    }
  }

  // Fetch book data from the backend (which uses temp.json)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Backend request with the query passed to the component
        const response = await axios.post("http://localhost:5000/search", {
          query: query,
          model_type: "original", //'fine_tuned' or 'original'
          top_k: 30,
        });
        console.log(response.data); // Log the response for debugging

        // Step 1: Get book titles from backend response
        const bookTitles = response.data.map((book) => book.book_title.toLowerCase());

        // Step 2: Filter books from temp.json based on the titles from the backend
        const booksArray = Object.values(Data); // Convert Data object to an array of books
        const matchedBooks = booksArray.filter((book) =>
          bookTitles.includes(book.book_title.toLowerCase()) // Match the titles
        );

        // Step 3: Set the filtered books as data
        setData(matchedBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  // Pagination Logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = data ? data.slice(indexOfFirstBook, indexOfLastBook) : [];

  const totalPages = data ? Math.ceil(data.length / booksPerPage) : 0;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // If no results are found
  if (!data || data.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div className="w-full">
      {data.length > 0 ? (
        <div className="grid grid-flow-row grid-cols-4 gap-4 w-full">
          {currentBooks.map((book, index) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-center items-center h-auto pb-10 relative group overflow-visible w-full"
              >
                <img
                  src={book.image_url || "default_image_url.jpg"}
                  alt={book.book_title || "Book Title"}
                  className="h-52 w-auto object-cover mb-3"
                />
                <div className="h-10 w-full flex justify-center items-center">
                  <p className="line-clamp-2 font-semibold">
                    {book.book_title || "Title Not Available"}
                  </p>
                </div>
                <p className="flex flex-row justify-center items-center absolute bottom-2">
                  {renderStars(book.book_rating || 0)}{" "}
                  {book.book_rating || "N/A"} {kFormatter(book.book_rating_count || 0)}
                </p>

                {/* Hover details */}
                <div className="flex flex-row justify-center items-center scale-0 group-hover:scale-100 transition-all duration-300 absolute bg-gradient-to-b from-slate-950 to-black p-10 rounded-xl z-10 max-h-90 w-[35rem] gap-5 border-indigo-700 border">
                  <img
                    src={book.image_url || "default_image_url.jpg"}
                    alt={book.book_title || "Book Title"}
                    className="h-52 w-auto mb-3"
                  />
                  <div className="flex flex-col justify-between items-center w-full h-full gap-2">
                    <p className="font-semibold text-lg">{book.book_title || "Title Not Available"}</p>
                    <p className="text-sm line-clamp-1">
                      {book.book_authors || "Unknown Author"}
                    </p>
                    <p className="text-sm line-clamp-[7] font-light">
                      {book.book_desc || "No description available."}
                    </p>
                    <p className="text-sm line-clamp-1">
                      {book.genres ? book.genres.join(", ") : "No genres available"}
                    </p>
                    <p className="flex flex-row justify-center items-center absolute bottom-[5%] left-52">
                      {book.book_pages || "N/A"} Pages
                    </p>
                    <p className="flex flex-row justify-center items-center absolute bottom-3 right-5">
                      {renderStars(book.book_rating || 0)}{" "}
                      {book.book_rating || "N/A"} {kFormatter(book.book_rating_count || 0)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No results found.</div>
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
  );
}

export default Books;
