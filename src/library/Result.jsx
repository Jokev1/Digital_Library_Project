import { useState, useEffect } from "react";
import BookList from "../temp.json";
import { StarHalfIcon, StarIcon } from "lucide-react";

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
      return Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K';
    } else if (Math.abs(num) > 1000000) {
      return Math.sign(num) * ((Math.abs(num) / 1000000).toFixed(1)) + 'M';
    } else {
      return Math.sign(num) * Math.abs(num);
    }
  }

  useEffect(() => {
    try {
      setData(BookList);
      setLoading(false);
    } catch (error) {
      setError("Error loading the book data.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Query Data
  const filteredBooks = data
    ? Object.keys(data).filter((key) => {
        const book = data[key];
        return book.book_title.toLowerCase().includes(query.toLowerCase());
      })
    : [];

    //Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

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

  return (
    <div className="w-full">
      {filteredBooks.length > 0 ? (
        <div className="grid grid-flow-row grid-cols-4 gap-4 w-full">
          {currentBooks.map((key) => {
            const book = data[key];
            return (
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
                      <p className=" flex flex-row justify-center items-center absolute bottom-[5%] left-52">{book.book_pages} Pages</p>
                      <p className="flex flex-row justify-center items-center absolute bottom-3 right-5">
                        {renderStars(book.book_rating)} {book.book_rating} {kFormatter(book.book_rating_count)}
                      </p>
                    </div>
                  </div>
                </div>
              );
          })}
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
  );
}

export default Books;
