alter table public.site_settings
  alter column company_name set default 'Digital Visions',
  alter column intro set default 'Digital Visions designs, rebuilds, and cares for considered websites.';

update public.site_settings
set
  company_name = 'Digital Visions',
  intro = replace(intro, 'Digital Vision', 'Digital Visions')
where id = true;