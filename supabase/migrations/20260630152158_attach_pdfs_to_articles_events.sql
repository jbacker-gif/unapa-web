alter table public.articles
  add column if not exists attachment_pdf_url text,
  add column if not exists attachment_pdf_storage_path text,
  add column if not exists attachment_pdf_file_name text;

alter table public.events
  add column if not exists attachment_pdf_url text,
  add column if not exists attachment_pdf_storage_path text,
  add column if not exists attachment_pdf_file_name text;
