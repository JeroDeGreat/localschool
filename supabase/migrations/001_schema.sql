-- ============================================================================
-- SCHOOL HUB DATABASE SCHEMA
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "http";

-- ============================================================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  department_id UUID,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. DEPARTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '📚',
  color TEXT DEFAULT '#7C6EFF',
  emoji TEXT DEFAULT '📚',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. DEPARTMENT MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department_id, user_id)
);

ALTER TABLE public.department_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  is_lobby BOOLEAN DEFAULT FALSE,
  has_attachment BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_department ON public.messages(department_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. MESSAGE REACTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. ASSIGNMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ,
  points INTEGER DEFAULT 100,
  file_url TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assignments_department ON public.assignments(department_id);
CREATE INDEX idx_assignments_due_date ON public.assignments(due_date);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. SUBMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  status TEXT CHECK (status IN ('pending', 'submitted', 'late', 'graded')) DEFAULT 'pending',
  grade INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student ON public.submissions(student_id);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 8. HELP REQUESTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  points_reward INTEGER DEFAULT 10,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_help_requests_status ON public.help_requests(status);
CREATE INDEX idx_help_requests_requester ON public.help_requests(requester_id);

ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. HELP RESPONSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.help_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  help_request_id UUID NOT NULL REFERENCES public.help_requests(id) ON DELETE CASCADE,
  helper_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.help_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 10. BADGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT,
  requirement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 11. USER BADGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 12. NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 13. ANNOUNCEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  is_global BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_announcements_department ON public.announcements(department_id);
CREATE INDEX idx_announcements_pinned ON public.announcements(pinned);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 14. INSERT DEFAULT BADGES
-- ============================================================================
INSERT INTO public.badges (name, description, icon, color, requirement) VALUES
('🎓 Top Helper', 'Helped 10 students', '🎓', '#fbbf24', 'help_count:10'),
('⚡ Active Contributor', '100+ contributions', '⚡', '#f59e0b', 'contribution_count:100'),
('📘 Note Master', 'Shared 25+ notes', '📘', '#3b82f6', 'notes_shared:25'),
('🚀 Early Bird', 'Joined in first week', '🚀', '#8b5cf6', 'early_joiner:true'),
('🌟 All-Rounder', 'Member of 5+ departments', '🌟', '#ec4899', 'departments:5'),
('💯 Perfect Score', 'Got A+ on all assignments', '💯', '#22c55e', 'perfect_score:true');

-- ============================================================================
-- 15. INSERT DEFAULT DEPARTMENTS
-- ============================================================================
INSERT INTO public.departments (name, description, icon, color, emoji) VALUES
('Science', 'Biology, Chemistry, Physics, Environmental Science', '🔬', '#38bdf8', '🔬'),
('Information & Communication Technology', 'Computer Science, Programming, Digital Skills', '💻', '#a78bfa', '💻'),
('Mathematics', 'Algebra, Geometry, Calculus, Statistics', '∑', '#fb923c', '∑'),
('Engineering', 'Robotics, Mechanical, Civil, Electronics', '⚙️', '#4ade80', '⚙️'),
('Arts & Design', 'Visual Arts, Design, Photography, Creativity', '🎨', '#f472b6', '🎨'),
('English & Literature', 'Writing, Literature, Communication, Language', '📝', '#fbbf24', '📝'),
('History & Social Studies', 'History, Geography, Civics, Cultures', '🏛️', '#f87171', '🏛️'),
('Music & Performing Arts', 'Music, Dance, Theater, Performance', '🎵', '#c084fc', '🎵'),
('Physical Education', 'Sports, Fitness, Health, Wellness', '⚽', '#34d399', '⚽');
