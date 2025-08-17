import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Feed from "./pages/Feed";
import Ask from "./pages/Ask";
import Question from "./pages/Question";
import { ensureAnonSession } from "./api/client";

export default function App() {
  useEffect(() => { ensureAnonSession(); }, []);
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">MindLink</Link>
        <Link to="/ask">Ask</Link>
      </header>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/q/:id" element={<Question />} />
      </Routes>
    </div>
  );
}
