import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/client";

export default function Question() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [body, setBody] = useState("");

  useEffect(() => {
    API.get(`/questions/${id}`).then(r => setData(r.data));
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: ans } = await API.post(`/questions/${id}/answers`, { body });
    setData((d:any)=>({ ...d, answers: [ans, ...d.answers] }));
    setBody("");
  };

  if (!data) return <div>Loading…</div>;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2>{data.question.title}</h2>
      {data.question.body && <p>{data.question.body}</p>}

      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write answer…" required />
        <button type="submit">Answer</button>
      </form>

      <h3>Answers</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {data.answers.map((a:any) => (
          <div key={a._id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10 }}>
            {a.body}
          </div>
        ))}
      </div>
    </div>
  );
}
