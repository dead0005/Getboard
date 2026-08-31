const API_BASE = "/api";
async function fetchProgress() {
  const res = await fetch(`${API_BASE}/progress`);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}
async function fetchTopics() {
  const res = await fetch(`${API_BASE}/topics`);
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
}
async function triggerSync() {
  const res = await fetch(`${API_BASE}/sync`, { method: "POST" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to sync");
  }
  return res.json();
}
async function fetchUnmatched() {
  const res = await fetch(`${API_BASE}/unmatched`);
  if (!res.ok) throw new Error("Failed to fetch unmatched questions");
  return res.json();
}
async function linkQuestion({ striverQuestionId, leetcodeSlug }) {
  const res = await fetch(`${API_BASE}/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ striverQuestionId, leetcodeSlug })
  });
  if (!res.ok) throw new Error("Failed to link question");
  return res.json();
}
export {
  fetchProgress,
  fetchTopics,
  fetchUnmatched,
  linkQuestion,
  triggerSync
};
