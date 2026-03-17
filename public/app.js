const chatForm = document.getElementById("chatForm");
const questionInput = document.getElementById("questionInput");
const chatHistory = document.getElementById("chatHistory");
const sendButton = document.getElementById("sendButton");

function appendMessage(role, content) {
  const article = document.createElement("article");
  article.className = `message ${role}`;
  article.textContent = content;
  chatHistory.appendChild(article);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function setSendingState(isSending) {
  sendButton.disabled = isSending;
  sendButton.textContent = isSending ? "Enviando..." : "Enviar";
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = questionInput.value.trim();

  if (!question) {
    return;
  }

  appendMessage("user", question);
  questionInput.value = "";
  setSendingState(true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
      appendMessage("bot", data.error || "No se pudo procesar tu consulta.");
      return;
    }

    appendMessage("bot", data.answer);
  } catch (error) {
    appendMessage("bot", "Error de conexión con VetGPT. Inténtalo nuevamente.");
  } finally {
    setSendingState(false);
    questionInput.focus();
  }
});
