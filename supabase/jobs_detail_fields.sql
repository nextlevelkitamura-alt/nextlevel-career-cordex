-- Add extended job detail fields for public and admin pages
alter table public.jobs
    add column if not exists hero_title text,
    add column if not exists hero_lead text,
    add column if not exists hero_image_url text,
    add column if not exists gallery_image_url text,
    add column if not exists recommendation text,
    add column if not exists job_description text,
    add column if not exists work_location text,
    add column if not exists nearest_station text,
    add column if not exists work_time text,
    add column if not exists work_days text,
    add column if not exists holidays text,
    add column if not exists requirements text,
    add column if not exists welcome text,
    add column if not exists benefits text,
    add column if not exists selection_flow text,
    add column if not exists remarks text;

-- Index to support search by job_code/title (already used in UI)
create index if not exists jobs_job_code_title_idx on public.jobs (job_code, title);
