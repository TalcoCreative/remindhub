import { useState, useRef, useEffect } from 'react';
import { dummyChats, statusLabels, statusColors, quickReplies, type Chat, type ChatMessage } from '@/data/dummy';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search, Send, Paperclip, MessageSquare, ChevronLeft, Zap, User, Phone, ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WhatsAppInbox() {
  const [chats, setChats] = useState<Chat[]>(dummyChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [reply, setReply] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId) ?? null;

  const filteredChats = chats.filter(
    (c) =>
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages.length]);

  const handleSend = () => {
    if (!reply.trim() || !selectedChatId) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      text: reply,
      sender: 'agent',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChatId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: reply, lastTimestamp: newMsg.timestamp, unread: 0 }
          : c,
      ),
    );
    setReply('');
    setShowQuickReplies(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Chat List */}
      <div
        className={cn(
          'w-full border-r border-border bg-card sm:w-80 lg:w-96',
          selectedChatId ? 'hidden sm:flex sm:flex-col' : 'flex flex-col',
        )}
      >
        <div className="border-b border-border p-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">WhatsApp Inbox</h2>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                'flex cursor-pointer gap-3 border-b border-border p-3 transition-colors hover:bg-muted/50',
                selectedChatId === chat.id && 'bg-accent',
              )}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{chat.contactName}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {chat.lastTimestamp.split(' ')[1]}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-medium', statusColors[chat.status])}>
                    {statusLabels[chat.status]}
                  </span>
                  {chat.unread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Detail */}
      {selectedChat ? (
        <div className={cn('flex flex-1 flex-col', !selectedChatId && 'hidden sm:flex')}>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-card p-3">
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setSelectedChatId(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{selectedChat.contactName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> +{selectedChat.contactPhone}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusColors[selectedChat.status])}>
                {statusLabels[selectedChat.status]}
              </span>
              {selectedChat.assignedPic && (
                <Badge variant="outline" className="text-xs">PIC: {selectedChat.assignedPic}</Badge>
              )}
              {selectedChat.leadId && (
                <Badge variant="secondary" className="text-xs">Lead: {selectedChat.leadId}</Badge>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 bg-muted/30 p-4">
            <div className="mx-auto max-w-2xl space-y-3">
              {selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex', msg.sender === 'agent' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                      msg.sender === 'agent'
                        ? 'rounded-br-md bg-primary text-primary-foreground'
                        : 'rounded-bl-md bg-card text-card-foreground border border-border',
                    )}
                  >
                    <p>{msg.text}</p>
                    <p className={cn(
                      'mt-1 text-[10px]',
                      msg.sender === 'agent' ? 'text-primary-foreground/70' : 'text-muted-foreground',
                    )}>
                      {msg.timestamp.split(' ')[1]}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick replies */}
          {showQuickReplies && (
            <div className="border-t border-border bg-card p-2">
              <div className="flex flex-wrap gap-1.5">
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-accent"
                    onClick={() => {
                      setReply(qr);
                      setShowQuickReplies(false);
                    }}
                  >
                    {qr.length > 50 ? qr.slice(0, 50) + '...' : qr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reply box */}
          <div className="border-t border-border bg-card p-3">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon" className="shrink-0" title="Attach file">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                title="Quick replies"
                onClick={() => setShowQuickReplies(!showQuickReplies)}
              >
                <Zap className="h-4 w-4" />
              </Button>
              <Textarea
                placeholder="Type a message..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
              <Button
                size="icon"
                className="shrink-0"
                onClick={handleSend}
                disabled={!reply.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center bg-muted/20 sm:flex">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-lg font-medium text-muted-foreground">Select a conversation</p>
            <p className="text-sm text-muted-foreground">Choose a chat from the left panel to start</p>
          </div>
        </div>
      )}
    </div>
  );
}
