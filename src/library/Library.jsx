import {
  ALargeSmallIcon,
  ArrowLeftFromLine,
  Search,
  SlidersHorizontalIcon,
  TrendingUpDownIcon, BrainCircuitIcon
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Books from "./Books";
import Result from "./searchResult/Result";
import Semantic from "./semantic/SemanticResult";
import Llama from "./sbert/Result_Llama"

function Library() {
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [type, setType] = useState("sbert");

  const clear = () => {
    setSearch("");
    setSearchTerm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    setSearchTerm(search);
    setSubmitting(false);
    setLoading(false);
  };

  const handleShowFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  if (loading) {
    return <div className="text-3xl">loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-10">
      <Link to="/" className="text-white">
        <button className="absolute top-5 left-5 bg-transparent hover:drop-shadow-[0_0_40px_rgba(255,255,255,1)]">
          <ArrowLeftFromLine />
        </button>
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col mb-10">
        <div className="flex justify-between items-center flex-row w-[70vw] rounded-xl px-5 py-3 bg-black">
          <button type="submit" disabled={submitting} className="bg-transparent m-0 p-0">
            <Search />
          </button>
          <input
            type="text"
            className="outline-none bg-transparent w-full ml-5 text-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={clear} className="bg-transparent font-semibold hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)] p-0 m-0">
              X
            </button>
          )}
        </div>
        <div className="flex flex-col justify-end items-end">
          <button
            type="button"
            onClick={handleShowFilter}
            className="flex flex-row bg-transparent gap-3 cursor-pointer hover:drop-shadow-[0_0_20px_rgba(255,255,255,1)] text-white hover:text-indigo-300 text-sm"
          >
            <SlidersHorizontalIcon />
            <p>Filter</p>
          </button>
          <div
            className={`flex flex-col w-full transition-all ease-in-out duration-300 overflow-hidden ${
              showFilter ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <section className={`flex flex-row justify-between items-center w-full`}>
              {showFilter && (
                <div className="flex w-full rounded-lg ">
                  <div className="flex flex-col w-full p-5 gap-5">
                    <label
                      htmlFor="Semantic-Simple"
                      className={`flex flex-row rounded-lg hover:bg-indigo-700 p-5 gap-5 ${type === "semantic" ? "underline" : ""}`}
                    >
                      <input
                        id="Semantic-Simple"
                        type="radio"
                        name="search-type"
                        value="semantic"
                        checked={type === "semantic"}
                        onChange={handleTypeChange}
                      />
                      <TrendingUpDownIcon />
                      Cosine Similarity
                    </label>
                    <label
                      htmlFor="Full-Text"
                      className={`flex flex-row rounded-lg hover:bg-indigo-700 p-5 gap-5 ${type === "full-text" ? "underline" : ""}`}
                    >
                      <input
                        id="Full-Text"
                        type="radio"
                        name="search-type"
                        value="full-text"
                        checked={type === "full-text"}
                        onChange={handleTypeChange}
                      />
                      <ALargeSmallIcon />
                      Full Text
                    </label>
                    <label
                      htmlFor="AI"
                      className={`flex flex-row rounded-lg hover:bg-indigo-700 p-5 gap-5 ${type === "sbert" ? "underline" : ""}`}
                    >
                      <input
                        id="AI"
                        type="radio"
                        name="search-type"
                        value="sbert"
                        checked={type === "sbert"}
                        onChange={handleTypeChange}
                      />
                      <BrainCircuitIcon />
                      AI Semantic
                    </label>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </form>

      <div className={`transition-all duration-300 ${showFilter ? 'mt-5' : 'mt-0'}`}>
        {searchTerm && type === "semantic" ? (
          <Semantic query={searchTerm} />
        ) : searchTerm && type === "full-text" ? (
          <Result query={searchTerm} />
        ) : searchTerm && type === "sbert" ? (
          <Llama query={searchTerm} />
        ) : (
          <Books />
        )}
      </div>
    </div>
  );
}

export default Library;
