-- Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'editor',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Press Releases Table
CREATE TABLE public.press_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'draft',
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    attachments TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Public Notices Table
CREATE TABLE public.public_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'active',
    priority TEXT DEFAULT 'normal',
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Announcements Table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'active',
    priority TEXT DEFAULT 'normal',
    pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Contacts Table
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Media Items Table
CREATE TABLE public.media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    file_path TEXT,
    size INTEGER,
    mime_type TEXT,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed Initial Data
-- Insert an admin user (Password is 'password123' hashed with bcrypt, assuming standard bcrypt hash)
-- Bcrypt hash for 'password123': $2a$10$tZ92E.Y09CqL8W/7m69LKe3s84P1RkYjO.uC61R0Y9P7j2O0e0SZi
INSERT INTO public.users (id, name, email, password, role, is_active)
VALUES (
    'd8a9e4b1-1b3c-4d5e-8f7g-9h0i1j2k3l4m',
    'Admin User', 
    'admin@example.com', 
    '$2a$10$tZ92E.Y09CqL8W/7m69LKe3s84P1RkYjO.uC61R0Y9P7j2O0e0SZi', 
    'admin', 
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample press release
INSERT INTO public.press_releases (title, summary, content, category, status, author_id, tags)
VALUES (
    'Annual Tech Conference 2026', 
    'Join us for the biggest tech conference of the year.', 
    'We are excited to announce our upcoming annual tech conference. It will feature industry leaders and cutting-edge innovations.', 
    'Technology', 
    'published', 
    'd8a9e4b1-1b3c-4d5e-8f7g-9h0i1j2k3l4m',
    ARRAY['tech', 'conference', '2026']
);

-- Insert sample public notice
INSERT INTO public.public_notices (title, content, status, priority)
VALUES (
    'Scheduled Maintenance', 
    'The system will undergo scheduled maintenance this weekend from 12 AM to 4 AM.', 
    'active', 
    'high'
);

-- Insert sample announcement
INSERT INTO public.announcements (title, content, status, priority, pinned)
VALUES (
    'Welcome to the new Portal', 
    'We have successfully migrated to our new communication portal. Explore the new features today!', 
    'active', 
    'normal', 
    true
);

-- Insert sample contact message
INSERT INTO public.contacts (name, email, subject, message, status)
VALUES (
    'Jane Doe', 
    'jane@example.com', 
    'Inquiry about Press Release', 
    'Could you provide more details regarding the recent press release on sustainability?', 
    'new'
);
