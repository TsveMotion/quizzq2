import { Bot, User } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${
        isUser ? 'bg-blue-500/10' : 'bg-indigo-500/10'
      }`}>
        {isUser ? (
          <User className="h-6 w-6 text-blue-500" />
        ) : (
          <Bot className="h-6 w-6 text-indigo-500" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-white/90">{message.content}</p>
      </div>
    </div>
  );
}
