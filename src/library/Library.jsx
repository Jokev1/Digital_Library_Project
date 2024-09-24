import { ArrowLeftFromLine, Search, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Books from "./Books"
import Result from "./Result"

function Library() {
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [genre, setGenre] = useState([])
  const [sort, setSort] = useState("")
  const[asc, setAsc] = useState(true)

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
    setSearchTerm(search); 
    setSubmitting(false);
    setLoading(false)
  };

  const handleShowFilter = () => {
    setShowFilter(!showFilter)
  }

  if(loading){
    return(
      <div className="text-3xl">
        loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-[80vw] p-10">
      <Link to={"/"} className="text-white">
        <button className="absolute top-5 left-5 bg-transparent hover:drop-shadow-[0_0_40px_rgba(255,255,255,1)]">
          {" "}
          <ArrowLeftFromLine />
        </button>
      </Link>
      <form onSubmit={handleSubmit} className="flex flex-col mb-10">
        <div className="flex justify-between items-center flex-row w-[70vw] rounded-xl px-5 py-3 bg-black">
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
        </div>
        <div className="flex flex-col justify-end items-end">
          <button onClick={handleShowFilter} className="flex flex-row bg-transparent gap-3 cursor-pointer hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)] text-slate-600 hover:text-indigo-300 text-sm">
            <SlidersHorizontalIcon/>
            <p>Filter</p>
          </button>
          <div className={"flex w-full animate-fade" + (showFilter ? "" : "hidden")}>
              <div>
                
              </div>
          </div>
        </div>
        
      </form>
      
      { searchTerm ? (
        <Result query={searchTerm} filter={genre}/>
      ) : (
      <Books/>
    )}
    </div>
  );
}

export default Library;
