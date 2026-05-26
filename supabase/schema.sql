-- Spendwise AI — Supabase Schema
-- Run this in the Supabase SQL Editor to set up the database.
-- Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- ─────────────────────────────────────────────
-- Table: audits
-- Stores full audit context and results for shareable report URLs.
-- PII-free: no email, no company name stored here.
-- ─────────────────────────────────────────────
create table if not exists audits (
  id          uuid primary key default gen_random_uuid(),
  context     jsonb not null,           -- AuditContext: teamSize, primaryUseCase, tools[]
  result      jsonb not null,           -- AuditResult: savings, recommendations, breakdown
  annual_savings numeric(10,2) not null,-- Denormalized for fast querying (e.g., lead scoring)
  created_at  timestamptz not null default now()
);

-- Index for dashboard analytics: "show all audits with >$500/mo savings"
create index if not exists idx_audits_annual_savings on audits (annual_savings desc);
create index if not exists idx_audits_created_at on audits (created_at desc);

-- ─────────────────────────────────────────────
-- Table: leads
-- Stores email leads from the post-audit capture form.
-- Linked to the audit that generated the lead.
-- ─────────────────────────────────────────────
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  report_id   uuid references audits(id) on delete set null,
  contacted   boolean not null default false, -- Has sales team reached out?
  created_at  timestamptz not null default now()
);

-- Unique constraint: one lead per email (prevent duplicates from retries)
create unique index if not exists idx_leads_email on leads (email);
create index if not exists idx_leads_created_at on leads (created_at desc);
create index if not exists idx_leads_contacted on leads (contacted) where contacted = false;

-- ─────────────────────────────────────────────
-- Row Level Security
-- Reports are public (anyone with the URL can view).
-- Leads are private (only service role can read).
-- ─────────────────────────────────────────────
alter table audits enable row level security;
alter table leads enable row level security;

-- Allow anyone to INSERT a new audit (form submission)
create policy "Anyone can create audits"
  on audits for insert
  with check (true);

-- Allow anyone to SELECT an audit by ID (shareable report URL)
create policy "Anyone can view audits by ID"
  on audits for select
  using (true);

-- Allow anyone to INSERT a lead (email capture form)
create policy "Anyone can submit leads"
  on leads for insert
  with check (true);

-- Only service role (server-side) can read leads — protects PII
-- (No SELECT policy for anon role on leads table — defaults to deny)
