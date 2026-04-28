import { useEffect, useMemo, useRef, useState } from 'react';
import ChatBubble from '../components/ChatBubble.jsx';
import ChatInput from '../components/ChatInput.jsx';
import StatsPanel from '../components/StatsPanel.jsx';
import { getMemory, sendChatMessage } from '../services/api.js';

const starter = {
  role: 'assistant',
  message: 'Soy Olie. Recuerdo tu progreso y optimizo tus decisiones. ¿Cómo estuvo tu día?'
};

export default function App() {
  const [messages, setMessages] = useState([starter]);
  const [loading, setLoading] = useState(false);
  const [memory, setMemory] = useState(null);
  const [lastMeta, setLastMeta] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    getMemory().then(setMemory).catch(() => null);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const headerInfo = useMemo(() => {
    if (!lastMeta) return 'Sin análisis todavía';
    return `Clima: ${lastMeta.weather?.description || 'n/a'} · Hora local: ${lastMeta.localTime}`;
  }, [lastMeta]);

  const onSend = async (text) => {
    setMessages((prev) => [...prev, { role: 'user', message: text }]);
    setLoading(true);
    try {
      const response = await sendChatMessage(text);
      setMessages((prev) => [...prev, { role: 'assistant', message: response.reply }]);
      setLastMeta({ weather: response.weather, localTime: response.localTime });
      const freshMemory = await getMemory();
      setMemory(freshMemory);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', message: 'No pude procesarlo ahora. Intenta de nuevo en unos segundos.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-slate-950 text-slate-100 flex">
      <section className="flex-1 flex flex-col">
        <header className="px-6 py-4 border-b border-slate-800">
          <h1 className="text-2xl font-bold">Olie</h1>
          <p className="text-sm text-slate-400">Olie no responde, optimiza.</p>
          <p className="text-xs text-slate-500 mt-1">{headerInfo}</p>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <ChatBubble key={`${msg.role}-${idx}`} role={msg.role} message={msg.message} />
          ))}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={onSend} loading={loading} />
      </section>

      <StatsPanel memory={memory} />
    </main>
  );
}
