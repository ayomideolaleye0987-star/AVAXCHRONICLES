-- Supabase schema for AVAXCHRONICLES
-- Run this in your Supabase SQL editor to create required tables.

-- Enable pgcrypto for gen_random_uuid() if not enabled
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Create extension if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE IF NOT EXISTS users (
  address text PRIMARY KEY,
  username text,
  avatar text,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Cases
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  description text,
  txs jsonb,
  images jsonb,
  submitter text REFERENCES users(address),
  status text DEFAULT 'queued',
  selectionVotes integer DEFAULT 0,
  createdAt bigint DEFAULT (extract(epoch from now()) * 1000)::bigint
);

-- Evidence
CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caseId uuid REFERENCES cases(id) ON DELETE CASCADE,
  author text REFERENCES users(address),
  content text,
  txExplain boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  createdAt bigint DEFAULT (extract(epoch from now()) * 1000)::bigint
);

-- Verdict votes
CREATE TABLE IF NOT EXISTS verdict_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caseId uuid REFERENCES cases(id) ON DELETE CASCADE,
  choice text,
  voter text REFERENCES users(address),
  createdAt bigint DEFAULT (extract(epoch from now()) * 1000)::bigint
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_createdAt ON cases(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_case ON evidence(caseId);

-- RLS / Policies
-- Run policies AFTER the tables above have been created. Apply this whole file in one SQL run.

-- Enable RLS on all application tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE verdict_votes ENABLE ROW LEVEL SECURITY;

-- USERS
-- Public read of user profiles; only a user can insert/update their own row. Clients cannot change points.
CREATE POLICY users_select_public ON users FOR SELECT USING (true);

CREATE POLICY users_insert_authenticated_self ON users FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND new.address = auth.uid());

CREATE POLICY users_update_owner_no_points ON users FOR UPDATE
  USING (auth.role() = 'authenticated' AND old.address = auth.uid())
  WITH CHECK (auth.role() = 'authenticated' AND new.address = auth.uid() AND new.points = old.points);

CREATE POLICY users_no_delete ON users FOR DELETE USING (false);

-- CASES
CREATE POLICY cases_select_public ON cases FOR SELECT USING (true);

CREATE POLICY cases_insert_submitter_is_auth ON cases FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND new.submitter = auth.uid());

CREATE POLICY cases_update_submitter_restricted ON cases FOR UPDATE
  USING (auth.role() = 'authenticated' AND old.submitter = auth.uid())
  WITH CHECK (
    auth.role() = 'authenticated' AND
    new.submitter = auth.uid() AND
    new.status = old.status AND
    new.selectionVotes = old.selectionVotes
  );

CREATE POLICY cases_no_delete ON cases FOR DELETE USING (false);

-- EVIDENCE
CREATE POLICY evidence_select_public ON evidence FOR SELECT USING (true);

CREATE POLICY evidence_insert_author_is_auth ON evidence FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND new.author = auth.uid());

CREATE POLICY evidence_update_author_no_upvotes ON evidence FOR UPDATE
  USING (auth.role() = 'authenticated' AND old.author = auth.uid())
  WITH CHECK (auth.role() = 'authenticated' AND new.author = auth.uid() AND new.upvotes = old.upvotes);

CREATE POLICY evidence_no_delete ON evidence FOR DELETE USING (false);

-- VERDICT VOTES
CREATE POLICY verdict_select_public ON verdict_votes FOR SELECT USING (true);

CREATE POLICY verdict_insert_voter_is_auth ON verdict_votes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND new.voter = auth.uid() AND new.choice IN ('guilty','not_guilty','adjourn'));

CREATE POLICY verdict_no_update ON verdict_votes FOR UPDATE USING (false);
CREATE POLICY verdict_no_delete ON verdict_votes FOR DELETE USING (false);

-- STORAGE: images (evidence-images bucket)
-- CREATE THE BUCKET via Supabase UI: Storage → New bucket → name: evidence-images
-- Then run the storage policy block below (it is safe and will only run if the storage.objects table exists).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'storage' AND c.relname = 'objects'
  ) THEN
    -- Enable RLS on storage.objects
    EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY';

    -- INSERT policy: uploader metadata must match auth.uid()
    EXECUTE $policy$
      CREATE POLICY storage_insert_uploader_match ON storage.objects
      FOR INSERT
      WITH CHECK (auth.role() = 'authenticated' AND (new.metadata->> 'uploader') = auth.uid());
    $policy$;

    -- DELETE policy: only owner (metadata.uploader) can delete
    EXECUTE $policy$
      CREATE POLICY storage_delete_owner ON storage.objects
      FOR DELETE
      USING ((old.metadata->> 'uploader') = auth.uid());
    $policy$;

    -- SELECT policy: allow authenticated users to read objects (adjust if public access desired)
    EXECUTE $policy$
      CREATE POLICY storage_select_authenticated ON storage.objects
      FOR SELECT
      USING (auth.role() = 'authenticated');
    $policy$;
  END IF;
END
$$;

-- Notes & guidance
-- 1) These policies assume `auth.uid()` contains the wallet address or an identifier you map to the `address` column.
--    If you use Supabase Auth's default UUID user IDs, either store that UUID on `users` and change policies
--    to compare to that value, or add a custom claim in the JWT that contains the wallet address and compare to that.
-- 2) Points modifications are deliberately blocked for client-side updates. Only use server-side functions
--    (Edge Functions, serverless endpoints, or service_role key) to modify `users.points` and other privileged fields.
-- 3) Uploads should include `metadata` with `{ "uploader": "<auth.uid()>", "caseId": "<case-uuid>" }`.
--    This allows policies above to verify ownership and associate images with cases.
-- 4) If you need public image access for evidence, consider making the bucket public via the dashboard or
--    adding a `storage.objects` SELECT policy that allows public reads for that bucket only.

