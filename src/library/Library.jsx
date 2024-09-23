import { ArrowLeftFromLine, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Books from "./Books"
import Result from "./Result"

function Library() {
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false)

  const clear = () => {
    setSearch("");
    setLoading(true)
    setSearchTerm("");
    setLoading(false)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    setSubmitting(true);
    setSearchTerm(search);  // Update searchTerm when the form is submitted
    setSubmitting(false);
    setLoading(false)
  };

  if(loading){
    return(
      <div className="text-3xl">
        loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center w-[80vw]">
      <Link to={"/"} className="text-white">
        <button className="absolute top-5 left-5 bg-transparent hover:drop-shadow-[0_0_40px_rgba(255,255,255,1)]">
          {" "}
          <ArrowLeftFromLine />
        </button>
      </Link>
      <form onSubmit={handleSubmit} className="flex justify-between items-center flex-row w-[70vw] rounded-xl px-5 py-3 bg-black mb-10">
        <button type="submit" disabled={submitting} className="bg-transparent m-0 p-0">
          <Search></Search>
        </button>
        <input
          type="text"
          className="outline-none bg-transparent w-full ml-5 text-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        {search ? (
          <button
            onClick={clear}
            className="bg-transparent font-semibold hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)] p-0 m-0"
          >
            X
          </button>
        ) : (
          <div></div>
        )}
      </form>
      
      { searchTerm ? (<Result query={searchTerm}/>) : (<Books/>)
      }
    </div>
  );
}

export default Library;
