export default function ChatBubble({ role, message }) {
  const isUser = role === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 whitespace-pre-wrap ${
          isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-100 border border-slate-700'
        }`}
      >
        {message}
      </div>
    </div>
  );
}
