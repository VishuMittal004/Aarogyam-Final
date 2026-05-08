import ChatInterface from './chat-interface';

export default function ChatPage() {
  return (
    <div className="flex h-full flex-col p-6 lg:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          AI Health Assistant
        </h1>
        <p className="text-muted-foreground text-lg">
          Get personalized health guidance in your preferred language
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
