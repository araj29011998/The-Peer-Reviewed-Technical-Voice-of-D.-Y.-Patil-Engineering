-- ============================================================================
-- DY PATIL TECHVERSE: COMPLETE PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- Target: Supabase (PostgreSQL 15+)
-- Version: 2026-04-01-000000
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing schema if running as clean migration
-- Note: In production Supabase migrations, do not drop unless needed.

-- ============================================================================
-- 1. ENUMS & DOMAINS
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE article_status AS ENUM (
        'draft',
        'pending_verification',
        'pending_review',
        'changes_requested',
        'approved',
        'published',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. TABLES DEFINITIONS
-- ============================================================================

-- PROFILES (Linked directly to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role user_role NOT NULL DEFAULT 'student',
    verification_status verification_status NOT NULL DEFAULT 'pending',
    student_id TEXT,
    department TEXT,
    batch_year INTEGER,
    technical_interests TEXT[] DEFAULT '{}',
    is_institutional_email BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    tags TEXT[] DEFAULT '{}',
    cover_image_url TEXT,
    status article_status NOT NULL DEFAULT 'draft',
    rejection_reason TEXT,
    changes_feedback TEXT,
    read_time_minutes INTEGER NOT NULL DEFAULT 4,
    published_at TIMESTAMPTZ,
    views_count INTEGER NOT NULL DEFAULT 0,
    parent_version_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ARTICLE LIKES (One like per user per article)
CREATE TABLE IF NOT EXISTS public.article_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_article_user_like UNIQUE (article_id, user_id)
);

-- COMMENTS (On published articles)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    report_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- FOLLOWS (Follow peer authors, prevent self-follow)
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_follower_following UNIQUE (follower_id, following_id),
    CONSTRAINT prevent_self_follow CHECK (follower_id <> following_id)
);

-- VERIFICATION REQUESTS (For personal email or college ID review)
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institutional_email TEXT,
    personal_email TEXT,
    student_id_number TEXT NOT NULL,
    college_id_card_url TEXT,
    department TEXT NOT NULL,
    batch_year INTEGER NOT NULL,
    status verification_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- MODERATION LOGS (Audit trail for article approval, rejection, comment hides)
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    target_type TEXT NOT NULL CHECK (target_type IN ('article', 'verification', 'comment', 'category')),
    target_id UUID NOT NULL,
    action TEXT NOT NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON public.comments(article_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON public.article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON public.verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_target ON public.moderation_logs(target_type, target_id);

-- ============================================================================
-- 4. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to check if calling user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if calling user is verified
CREATE OR REPLACE FUNCTION public.is_verified_author()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND verification_status = 'verified'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatic profile creation upon Supabase Auth sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    email_domain TEXT;
    is_institution BOOLEAN;
    initial_verification verification_status;
BEGIN
    email_domain := split_part(NEW.email, '@', 2);
    
    -- Check if registered with an institutional domain (configurable)
    IF email_domain = 'dypatil.edu' 
       OR email_domain = 'dypatilpune.edu' 
       OR email_domain = 'dypatilkolhapur.edu' 
       OR email_domain = 'dypiemr.ac.in' 
       OR email_domain = 'dypvp.edu.in' THEN
        is_institution := true;
        -- Email verification confirmed; pending formal batch verification
        initial_verification := 'pending';
    ELSE
        is_institution := false;
        initial_verification := 'pending';
    END IF;

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        role,
        verification_status,
        is_institutional_email
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'student',
        initial_verification,
        is_institution
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (runs automatically in Supabase)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_articles_updated_at ON public.articles;
CREATE TRIGGER set_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_comments_updated_at ON public.comments;
CREATE TRIGGER set_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- --- PROFILES POLICIES ---
-- Anyone can view public author profiles
CREATE POLICY "Public profiles are readable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can update only their non-privileged fields (cannot change role or verification_status)
CREATE POLICY "Users can update own profile fields"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        role = (SELECT role FROM public.profiles WHERE id = auth.uid()) AND
        verification_status = (SELECT verification_status FROM public.profiles WHERE id = auth.uid())
    );

-- Admins can update any profile (including role and verification_status)
CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- --- CATEGORIES POLICIES ---
-- Active categories are readable by everyone
CREATE POLICY "Active categories are readable by everyone"
    ON public.categories FOR SELECT
    USING (is_active = true OR public.is_admin());

-- Only admins can insert, update or delete categories
CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- --- ARTICLES POLICIES ---
-- Public can read approved & published articles
CREATE POLICY "Published articles are readable by everyone"
    ON public.articles FOR SELECT
    USING (status = 'published');

-- Authors can view their own articles (any status)
CREATE POLICY "Authors can view own articles"
    ON public.articles FOR SELECT
    USING (auth.uid() = author_id);

-- Admins can view all articles in moderation queue
CREATE POLICY "Admins can view all articles"
    ON public.articles FOR SELECT
    USING (public.is_admin());

-- Verified authors can create drafts or submit articles
CREATE POLICY "Verified authors can create articles"
    ON public.articles FOR INSERT
    WITH CHECK (
        auth.uid() = author_id AND
        status IN ('draft', 'pending_review') AND
        public.is_verified_author()
    );

-- Authors can update their own drafts or articles in changes_requested
CREATE POLICY "Authors can update own drafts and revisions"
    ON public.articles FOR UPDATE
    USING (
        auth.uid() = author_id AND
        status IN ('draft', 'changes_requested')
    )
    WITH CHECK (
        auth.uid() = author_id AND
        status IN ('draft', 'pending_review')
    );

-- Authors can delete only drafts
CREATE POLICY "Authors can delete own drafts"
    ON public.articles FOR DELETE
    USING (
        auth.uid() = author_id AND
        status = 'draft'
    );

-- Admins can moderate, approve, publish, reject, or unpublish any article
CREATE POLICY "Admins can moderate any article"
    ON public.articles FOR ALL
    USING (public.is_admin());

-- --- ARTICLE LIKES POLICIES ---
-- Public can view like counts
CREATE POLICY "Likes are readable by everyone"
    ON public.article_likes FOR SELECT
    USING (true);

-- Verified users can insert likes for published articles
CREATE POLICY "Verified users can like published articles"
    ON public.article_likes FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        public.is_verified_author() AND
        EXISTS (
            SELECT 1 FROM public.articles
            WHERE id = article_id AND status = 'published'
        )
    );

-- Users can delete their own like
CREATE POLICY "Users can remove own like"
    ON public.article_likes FOR DELETE
    USING (auth.uid() = user_id);

-- --- COMMENTS POLICIES ---
-- Non-hidden comments on published articles are readable by everyone
CREATE POLICY "Comments on published articles are readable"
    ON public.comments FOR SELECT
    USING (
        (is_hidden = false AND EXISTS (
            SELECT 1 FROM public.articles WHERE id = article_id AND status = 'published'
        )) OR
        auth.uid() = user_id OR
        public.is_admin()
    );

-- Verified users can comment on published articles
CREATE POLICY "Verified users can post comments"
    ON public.comments FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        public.is_verified_author() AND
        EXISTS (
            SELECT 1 FROM public.articles WHERE id = article_id AND status = 'published'
        )
    );

-- Comment authors can edit or delete their own comment
CREATE POLICY "Users can update own comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);

-- Admins can moderate (hide or delete) any comment
CREATE POLICY "Admins can moderate comments"
    ON public.comments FOR ALL
    USING (public.is_admin());

-- --- FOLLOWS POLICIES ---
-- Follows are readable by everyone
CREATE POLICY "Follows are viewable by everyone"
    ON public.follows FOR SELECT
    USING (true);

-- Verified users can follow other authors
CREATE POLICY "Verified users can follow authors"
    ON public.follows FOR INSERT
    WITH CHECK (
        auth.uid() = follower_id AND
        follower_id <> following_id AND
        public.is_verified_author()
    );

-- Users can unfollow
CREATE POLICY "Users can unfollow"
    ON public.follows FOR DELETE
    USING (auth.uid() = follower_id);

-- --- VERIFICATION REQUESTS POLICIES ---
-- Students can view only their own verification request
CREATE POLICY "Students can view own verification requests"
    ON public.verification_requests FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- Students can create a verification request for themselves
CREATE POLICY "Students can submit verification requests"
    ON public.verification_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins have full access to verification requests
CREATE POLICY "Admins manage verification requests"
    ON public.verification_requests FOR ALL
    USING (public.is_admin());

-- --- MODERATION LOGS POLICIES ---
-- Moderation logs are readable only by administrators
CREATE POLICY "Admins can view moderation logs"
    ON public.moderation_logs FOR SELECT
    USING (public.is_admin());

-- Admins can insert moderation logs
CREATE POLICY "Admins can record moderation logs"
    ON public.moderation_logs FOR INSERT
    WITH CHECK (public.is_admin() AND auth.uid() = admin_id);

-- ============================================================================
-- 6. MONTHLY LEADERBOARD CALCULATION WITH TIE-BREAKER
-- ============================================================================
CREATE OR REPLACE VIEW public.monthly_leaderboard_view AS
SELECT 
    p.id AS author_id,
    p.full_name,
    p.avatar_url,
    p.department,
    p.batch_year,
    date_trunc('month', a.published_at) AS publication_month,
    COUNT(a.id) AS eligible_article_count,
    COUNT(DISTINCT date_trunc('day', a.published_at)) AS distinct_publication_days,
    MIN(a.published_at) AS earliest_publication_time
FROM public.articles a
JOIN public.profiles p ON a.author_id = p.id
WHERE a.status = 'published' AND a.published_at IS NOT NULL
GROUP BY p.id, p.full_name, p.avatar_url, p.department, p.batch_year, date_trunc('month', a.published_at)
ORDER BY 
    eligible_article_count DESC,
    distinct_publication_days DESC,
    earliest_publication_time ASC;

-- ============================================================================
-- 7. INITIAL CATEGORY SEED DATA
-- ============================================================================
INSERT INTO public.categories (name, slug, description, display_order)
VALUES
    ('Artificial Intelligence', 'artificial-intelligence', 'Machine learning algorithms, neural network architectures, LLMs, and computer vision research.', 1),
    ('Data Science', 'data-science', 'Statistical modeling, big data analytics, distributed data pipelines, and predictive algorithms.', 2),
    ('Software Engineering', 'software-engineering', 'System architecture, design patterns, clean code principles, CI/CD, and testing methodologies.', 3),
    ('Web Development', 'web-development', 'Modern full-stack frameworks, browser engines, WebAssembly, performance, and accessibility.', 4),
    ('Programming and Python', 'programming-and-python', 'Algorithmic problem-solving, Python internals, systems programming, and concurrency.', 5),
    ('Cybersecurity', 'cybersecurity', 'Applied cryptography, penetration testing, network defense, threat modeling, and zero-trust.', 6),
    ('Cloud Computing', 'cloud-computing', 'Kubernetes orchestration, serverless microservices, cloud infra reliability, and DevOps.', 7),
    ('Electronics and IoT', 'electronics-and-iot', 'Microcontroller architecture, embedded firmware, sensor telemetry, and hardware protocols.', 8),
    ('Research and Innovation', 'research-and-innovation', 'Peer-reviewed academic research, patent filings, undergraduate capstones, and scientific literature.', 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 8. SECURE PROCEDURE: CREATING THE FIRST ADMINISTRATOR
-- ============================================================================
-- Step 1: User signs up normally via Supabase Auth with an approved administrator email.
-- Step 2: An authorized database operator runs the following SQL function in Supabase SQL editor:
CREATE OR REPLACE FUNCTION public.bootstrap_admin(target_email TEXT, secret_security_passphrase TEXT)
RETURNS TEXT AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Verify target user exists
    SELECT id INTO target_user_id FROM public.profiles WHERE email = target_email;
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Target user email % not found in profiles table', target_email;
    END IF;

    -- Elevate role and mark verified
    UPDATE public.profiles 
    SET 
        role = 'admin',
        verification_status = 'verified'
    WHERE id = target_user_id;

    -- Log action in audit trail
    INSERT INTO public.moderation_logs (
        admin_id,
        target_type,
        target_id,
        action,
        reason,
        metadata
    ) VALUES (
        target_user_id,
        'verification',
        target_user_id,
        'bootstrap_initial_admin',
        'Initial administrative credential granted via secure database bootstrapping procedure',
        jsonb_build_object('bootstrapped_at', now(), 'email', target_email)
    );

    RETURN 'Success: Admin role granted to ' || target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
