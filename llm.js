// The only file that talks to the LLM provider.
// The provider, the model and the key come from .env:
//   process.env.LLM_BASE_URL, process.env.LLM_MODEL, process.env.LLM_API_KEY
const SYSTEM = `다음과 같은 규칙을 따른다.
                1. 말투 : 존댓말을 사용한다, 초등학생한테 가르치듯이 친절하게 설명한다.
                2. 길이 : 한 문단 이내로 답한다.
                3. 형식 : 제목, 목록, 굵은 글씨 등 마크다운을 사용하지 않는다.`;
// TODO P4: make a constant SYSTEM here: the rules for every answer (tone, length, format).
//          Then send it as the first message, before the user's message, in ask().

// ask("a question")  ->  the model's answer, as a string
export async function ask(question) {
  const url = `${process.env.LLM_BASE_URL}/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      messages: [
        { role: "system", content: SYSTEM},
        { role: "user", content: question }
      ]
    })
  });

  if (!res.ok) {
    throw new Error(`LLM: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// chat([{ role: "user", content: "..." }, { role: "assistant", content: "..." }, ...])
//   ->  the model's next answer, as a string
export async function chat(history) {
  const url = `${process.env.LLM_BASE_URL}/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      messages: [
        { role: "system", content: SYSTEM },
        ...history
      ]
    })
  });

  if (!res.ok) {
    throw new Error(`LLM: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// analyze("a review")  ->  an object, not a sentence:
//   { sentiment: "positive" | "negative" | "neutral", score: 1..5, summary: "one short sentence" }
export async function analyze(text) {
  // TODO P6: write this function (see problems/P6_json.md). Delete the throw line below.
  throw new Error("analyze() is not written yet");
}
