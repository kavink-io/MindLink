import { useEffect, useState } from "react";
import API from "../api/client";
import { Link } from "react-router-dom";

type Question = {
  _id: string;
  title: string;
  createdAt: string;
};

export default function Feed() {
  const [items, setItems] = useState<Question[]>([]);

  useEffect(() => {
    API.get<Question[]>("/questions")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  return (
    <div>
      <h2>Latest Questions</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((q) => (
          <Link
            key={q._id}
            to={`/q/${q._id}`}
            style={{
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 12,
              textDecoration: "none",
              color: "black",
            }}
          >
            <b>{q.title}</b>
            <div style={{ opacity: 0.6, fontSize: 14 }}>
              {new Date(q.createdAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
