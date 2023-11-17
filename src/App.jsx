import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";
import "tailwindcss/tailwind.css";

function App() {
  return (
    <Router>
      <div>
        <nav className="flex items-center justify-between p-5 bg-blue-500 text-white">
          <h1 className="text-2xl">My Website</h1>
          <div>
            <Link className="mx-2 text-white hover:text-blue-200" to="/">
              Home
            </Link>
            <Link className="mx-2 text-white hover:text-blue-200" to="/about">
              About
            </Link>
            <Link className="mx-2 text-white hover:text-blue-200" to="/post">
              Post
            </Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
