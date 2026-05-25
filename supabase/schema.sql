-- Configurações gerais do usuário
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  custo_por_hora decimal(10,2) default 50.00,
  imposto_padrao decimal(5,4) default 0.04,
  updated_at timestamptz default now()
);

-- Matérias-primas customizadas por usuário
create table if not exists public.materiais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  unidade text default 'm²',
  preco_por_m2 decimal(10,2) not null,
  ordem int default 0,
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table public.user_settings enable row level security;
alter table public.materiais enable row level security;

-- Policies: usuário acessa somente seus próprios dados
create policy "user_settings_own" on public.user_settings
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "materiais_own" on public.materiais
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger: ao criar usuário, popula dados padrão
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_settings (user_id)
  values (new.id);

  insert into public.materiais (user_id, nome, preco_por_m2, ordem)
  values
    (new.id, 'Acrílico 3mm',      95.00, 0),
    (new.id, 'MDF 3mm',           45.00, 1),
    (new.id, 'Papel Fotográfico', 18.00, 2),
    (new.id, 'EVA',               12.00, 3),
    (new.id, 'Vinil Adesivo',     25.00, 4),
    (new.id, 'Tecido',            35.00, 5);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
