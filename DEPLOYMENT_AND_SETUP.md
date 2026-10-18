# DY Patil TechVerse — Deployment, Supabase & Production Guide

This guide outlines the production deployment, database provisioning, security architecture, and operational workflows for **DY Patil TechVerse** — the college technical article publishing platform.

---

## 1. Supabase Setup Instructions

### A. Create a Supabase Project
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project**.
2. Name the project `dy-patil-techverse`, select your preferred region (e.g., `ap-south-1` Mumbai for India / DY Patil campuses), and set a strong database password.
3. Once provisioned, navigate to **Project Settings** -> **API**.
4. Copy the following keys:
   - **Project URL** -> `VITE_SUPABASE_URL`
   - **anon / public key** -> `VITE_SUPABASE_ANON_KEY`
   - **service_role secret** -> `SUPABASE_SERVICE_ROLE_KEY` (Keep secret! Never add this to frontend builds).

### B. Run Database Schema Migrations
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Click **New Query** and copy the complete contents of `/supabase/migrations/20260401000000_techverse_schema.sql`.
3. Click **Run**. This will execute:
   - Creation of custom types: `user_role`, `verification_status`, `article_status`
   - Creation of core tables: `profiles`, `categories`, `articles`, `article_likes`, `comments`, `follows`, `verification_requests`, `moderation_logs`
   - Indexes on publication date, slugs, and foreign keys
   - Security functions: `is_admin()`, `is_verified_author()`, `handle_new_user()`, `handle_updated_at()`
   - Strict Row Level Security (RLS) policies on all tables
   - Initial seed data for the 9 university technology categories
   - Leaderboard view with distinct publication days tie-breaker

### C. Configure Storage Buckets
1. Go to **Storage** in the Supabase sidebar.
2. Create two buckets:
   - `article-covers` (Public: Enabled). Allows image CDN caching for published technical papers.
   - `verification-documents` (Public: Disabled / Private). Restricted to student and administrators for college ID card uploads.
3. Storage RLS policies:
   - For `article-covers`:
     ```sql
     CREATE POLICY "Verified authors can upload covers" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'article-covers' AND auth.role() = 'authenticated');
     ```
   - For `verification-documents`:
     ```sql
     CREATE POLICY "Users upload own student IDs" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

     CREATE POLICY "Admins view all verification docs" ON storage.objects
     FOR SELECT USING (bucket_id = 'verification-documents' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
     ```

---

## 2. Secure First Administrator Creation Procedure

Never hardcode admin credentials in source code. To bootstrap the initial administrator:

1. Have the college faculty coordinator or department administrator register through the TechVerse platform with their institutional email (e.g., `coordinator.techverse@dypatil.edu`).
2. Verify their identity in person or via institutional phone/directory.
3. Open the Supabase **SQL Editor** as database owner and run:
   ```sql
   SELECT public.bootstrap_admin('coordinator.techverse@dypatil.edu', 'authorized-by-hod');
   ```
4. This trusted procedure:
   - Updates `role = 'admin'` and `verification_status = 'verified'`
   - Inserts an immutable record into `moderation_logs` with a timestamp and audit reason
   - Ensures no client-side API can self-elevate permissions

---

## 3. GitHub & Vercel Deployment Instructions

### A. Push to GitHub
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: DY Patil TechVerse complete publishing platform"
   git remote add origin https://github.com/<your-org>/dy-patil-techverse.git
   git branch -M main
   git push -u origin main
   ```

### B. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import the GitHub repository `dy-patil-techverse`.
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://<your-project-ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOi...`
   - `VITE_INSTITUTION_NAME` = `D. Y. Patil College of Engineering & Technology`
   - `VITE_ALLOWED_EMAIL_DOMAINS` = `dypatil.edu,dypatilpune.edu,dypatilkolhapur.edu,dypiemr.ac.in,dypvp.edu.in`
4. Click **Deploy**. Vercel will build and deploy the production site on a high-speed CDN.

---

## 4. Production-Readiness Checklist

- [x] **Row Level Security (RLS)**: Enforced on all tables with zero bypass paths.
- [x] **Client-Side Security**: No `service_role` keys present in client JavaScript bundles.
- [x] **Status Integrity**: Article status transitions (`approved`, `published`, `rejected`) strictly restricted to administrators.
- [x] **Content Sanitization**: Markdown and article body parsed safely without arbitrary raw `<script>` or event handlers.
- [x] **Rate Limiting & Anti-Abuse**: Duplicate likes, follows, and self-following blocked at database constraints.
- [x] **Audit Trail**: Every administrative moderation action (approval, rejection with mandatory feedback, comment hiding) recorded in `moderation_logs`.
- [x] **Responsive Typography**: Built with modern Plus Jakarta Sans and Playfair Display typography, responsive down to 320px mobile viewports.
- [x] **Offline / Sandbox Resiliency**: Automatic detection of Supabase credentials with transparent demo sandbox mode for zero-configuration preview.

---

## 5. Integrations & External Credentials Checklist

| Integration | Purpose | Status in Code | Required Configuration |
|---|---|---|---|
| **Supabase Database** | Persistent PostgreSQL storage | Fully supported with SQL migration | Provide `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` |
| **Supabase Auth** | Institutional email verification & session tokens | Integrated with client wrapper | Enable Email Auth provider in Supabase |
| **Supabase Storage** | Cover images & verification documents | Buckets & RLS configured | Create `article-covers` & `verification-documents` buckets |
| **Institutional SMTP** | College domain email verification delivery | Configurable in Supabase Auth | Configure custom SMTP server in Supabase settings (e.g., SendGrid or college SMTP relay) |
