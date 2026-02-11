
-- Master Contacts table
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT DEFAULT 'b2c',
  company TEXT,
  area TEXT,
  source TEXT DEFAULT 'manual',
  sources TEXT[] DEFAULT '{}',
  assigned_pic TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE,
  is_contacted BOOLEAN NOT NULL DEFAULT false,
  lead_id UUID REFERENCES public.leads(id),
  chat_id UUID REFERENCES public.chats(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT contacts_phone_unique UNIQUE(phone)
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view contacts" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update contacts" ON public.contacts FOR UPDATE USING (true);
CREATE POLICY "Admins can delete contacts" ON public.contacts FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Broadcast logs table
CREATE TABLE public.broadcast_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sent_by TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message_template TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  total_recipients INTEGER NOT NULL DEFAULT 0,
  recipient_phones TEXT[] DEFAULT '{}',
  delivery_status TEXT NOT NULL DEFAULT 'sent',
  mode TEXT NOT NULL DEFAULT 'dummy',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.broadcast_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view broadcast logs" ON public.broadcast_logs FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert broadcast logs" ON public.broadcast_logs FOR INSERT WITH CHECK (true);
