'use client';

import { useState, useRef, useEffect } from 'react';
import { collection, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Bot, Loader2, Send, User } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ChatMessage = {
  id?: string;
  text: string;
  createdAt: any; // Firestore timestamp
  userId: string;
  userName: string;
  userPhotoURL?: string | null;
};

export default function CommunityChatPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'communityChat');
  }, [firestore]);

  const messagesQuery = useMemoFirebase(() => {
    if (!messagesCollectionRef) return null;
    return query(messagesCollectionRef, orderBy('createdAt', 'asc'));
  }, [messagesCollectionRef]);

  const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // A slight delay ensures the new message is rendered before scrolling
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !messagesCollectionRef) return;

    setIsSending(true);
    const messageText = input;
    setInput('');

    const newMessage: Omit<ChatMessage, 'id'> = {
      text: messageText,
      createdAt: serverTimestamp(),
      userId: user.uid,
      userName: user.displayName || 'Anonymous Farmer',
      userPhotoURL: user.photoURL,
    };

    // Use the non-blocking update which handles errors via the global listener
    addDocumentNonBlocking(messagesCollectionRef, newMessage);
    
    // We can optimistically assume success. The error handler will catch issues.
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        title="Community Chat"
        description="Connect and share with fellow farmers across India."
      />
      <div className="flex-grow flex flex-col bg-card border rounded-lg">
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            {isLoading && (
              <div className="flex justify-center items-center h-full pt-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && messages?.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-24">
                <User className="h-12 w-12 mb-4" />
                <p>Welcome to the community chat!</p>
                <p className="text-sm">Be the first to start a conversation.</p>
              </div>
            )}
            {messages?.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3',
                  message.userId === user?.uid ? 'justify-end' : 'justify-start'
                )}
              >
                {/* Avatar for other users */}
                {message.userId !== user?.uid && (
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={message.userPhotoURL ?? undefined} alt={message.userName} />
                    <AvatarFallback>{message.userName?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}

                <div className={cn("flex flex-col gap-1", message.userId === user?.uid ? 'items-end' : 'items-start')}>
                   {message.userId !== user?.uid && <span className="text-xs text-muted-foreground px-1">{message.userName}</span>}
                    <div
                    className={cn(
                        'max-w-lg rounded-lg p-3 text-sm shadow-sm',
                        message.userId === user?.uid
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    )}
                    >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                </div>

                {/* Avatar for the current user */}
                {message.userId === user?.uid && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} />
                    <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 bg-card border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending || !user}
              autoComplete="off"
            />
            <Button type="submit" disabled={isSending || !input.trim()}>
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

    