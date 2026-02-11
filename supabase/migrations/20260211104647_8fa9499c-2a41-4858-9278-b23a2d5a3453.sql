
CREATE OR REPLACE FUNCTION public.handle_new_chat_after()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _contact_id uuid;
BEGIN
  SELECT id INTO _contact_id FROM public.contacts WHERE phone = NEW.contact_phone;
  
  IF _contact_id IS NULL THEN
    INSERT INTO public.contacts (name, phone, source, sources, type, is_contacted, chat_id, lead_id)
    VALUES (NEW.contact_name, NEW.contact_phone, 'whatsapp', ARRAY['whatsapp'], 'b2c', true, NEW.id, NEW.lead_id)
    RETURNING id INTO _contact_id;
  ELSE
    UPDATE public.contacts 
    SET chat_id = NEW.id,
        is_contacted = true,
        lead_id = COALESCE(lead_id, NEW.lead_id)
    WHERE id = _contact_id;
  END IF;

  RETURN NEW;
END;
$$;
