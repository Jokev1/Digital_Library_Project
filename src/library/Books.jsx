import { useState, useEffect } from "react";
import BookList from "../temp.json";

function Books() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const StarCount = (Star) => {

        
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

  return (
    <div className="grid grid-flow-row grid-cols-4 gap-4">

      {data && Object.keys(data).map((key) => {
        const book = data[key]; 
        return (
          <div key={key} className="flex flex-col justify-center items-center h-auto w-auto p-5 border">
            <img src={book.image_url} alt={book.book_title} className="h-52 w-auto object-cover" />
            <p className="">{book.book_title}</p>
            <p> {book.book_rating} {book.book_rating_count}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Books;
