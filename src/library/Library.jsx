import { ArrowLeftFromLine, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Books from "./Books"

function Library() {
  const [search, setSearch] = useState("");

  const clear = () => {
    setSearch("");
  };

  return (
    <div className="flex flex-col">
      <Link to={"/"} className="text-white">
        <button className="absolute top-5 left-5 bg-transparent hover:drop-shadow-[0_0_40px_rgba(255,255,255,1)]">
          {" "}
          <ArrowLeftFromLine />
        </button>
      </Link>
      <form className="flex justify-between items-center flex-row w-[70vw] rounded-xl px-10 py-5 bg-black mb-10">
        <Search></Search>
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
      <Books/>
    </div>
  );
}

export default Library;
