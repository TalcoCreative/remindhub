
-- Add channel column to chats table to support multi-platform inbox
ALTER TABLE public.chats 
ADD COLUMN channel TEXT NOT NULL DEFAULT 'whatsapp';

-- Add index for filtering by channel
CREATE INDEX idx_chats_channel ON public.chats(channel);

-- Update webhook to also store channel info in messages if needed
ALTER TABLE public.messages
ADD COLUMN channel TEXT DEFAULT 'whatsapp';
