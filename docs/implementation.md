# Implementation Guide: To-Do Reminder PWA

**Versi:** 1.0  
**Tanggal:** Juni 2026  
**Stack:** Next.js 14+ · TypeScript · Tailwind CSS · Supabase · Telegram Bot (grammY) · Upstash · Vercel

---

## Persiapan Sebelum Mulai

### Akun & Service yang Dibutuhkan
- [ ] [Vercel](https://vercel.com) — hosting frontend
- [ ] [Supabase](https://supabase.com) — database + auth + edge functions
- [ ] [Telegram BotFather](https://t.me/BotFather) — buat bot baru, simpan `BOT_TOKEN`
- [ ] [Upstash](https://upstash.com) — cron job (QStash/Workflow)
- [ ] [Google Cloud Console](https://console.cloud.google.com) — OAuth credentials untuk Google login

### Environment Variables
Buat file `.env.local` di root project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx

# Telegram
TELEGRAM_BOT_TOKEN=xxxx
TELEGRAM_WEBHOOK_SECRET=xxxx   # string random, bebas kamu buat sendiri

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Fase 1: Fondasi & Setup (~1 minggu)

### 1.1 Init Project Next.js

```bash
npx create-next-app@latest todo-pwa \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd todo-pwa
```

Install dependencies:

```bash
# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Telegram Bot
npm install grammy

# PWA
npm install @ducanh2912/next-pwa

# Utility
npm install date-fns
npm install -D @types/node
```

### 1.2 Struktur Folder

```
todo-pwa/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── telegram/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts          # GET, POST
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # PATCH
│   │   │   ├── remind/
│   │   │   │   └── route.ts          # dipanggil cron job
│   │   │   └── webhook/
│   │   │       └── telegram/
│   │   │           └── route.ts      # terima callback dari Telegram
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # redirect ke /dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── tasks/
│   │   │   ├── Top3Highlight.tsx
│   │   │   ├── TaskGroup.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── AddTaskModal.tsx
│   │   │   └── EditTaskModal.tsx
│   │   ├── telegram/
│   │   │   ├── TelegramConnect.tsx
│   │   │   └── TelegramStatus.tsx
│   │   └── ui/
│   │       ├── Modal.tsx
│   │       ├── FAB.tsx
│   │       ├── EmptyState.tsx
│   │       └── Navbar.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # browser client
│   │   │   ├── server.ts             # server client (SSR)
│   │   │   └── middleware.ts
│   │   └── telegram/
│   │       ├── bot.ts                # instance grammY
│   │       └── reminder.ts           # logic format & kirim pesan
│   ├── types/
│   │   └── index.ts                  # semua TypeScript types
│   └── middleware.ts                 # proteksi route auth
├── public/
│   ├── manifest.json
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── .env.local
├── next.config.js
├── PRD.md
├── summaries.md
├── implementation.md
└── checklist.md
```

### 1.3 Konfigurasi next.config.js (PWA)

```js
// next.config.js
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
```

### 1.4 Web App Manifest

```json
// public/manifest.json
{
  "name": "Todo Reminder",
  "short_name": "TodoApp",
  "description": "To-Do Reminder dengan integrasi Telegram",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 1.5 Setup Supabase — Skema Database

Jalankan SQL berikut di **Supabase SQL Editor**:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tabel users (extend dari auth.users Supabase)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email varchar not null,
  full_name varchar,
  avatar_url text,
  provider varchar(20) default 'email',
  is_active boolean default true,
  deactivated_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Tabel tasks
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title varchar(255) not null,
  notes text,
  status varchar(20) default 'to_do' check (status in ('to_do','done','hold','cancel')),
  reminder_date timestamp with time zone not null,
  next_remind_at timestamp with time zone,
  reminder_count integer default 0,
  last_reminded_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabel telegram_connections
create table public.telegram_connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade unique not null,
  telegram_chat_id varchar(50),
  connect_token varchar(64),
  is_connected boolean default false,
  connected_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Index untuk performa query reminder
create index idx_tasks_next_remind on public.tasks(next_remind_at)
  where status in ('to_do','hold');

create index idx_tasks_user_id on public.tasks(user_id);

-- Trigger: auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function update_updated_at();

-- Trigger: auto-sync user baru dari auth.users ke public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url, provider)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_app_meta_data->>'provider', 'email')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.users.full_name);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 1.6 Row Level Security (RLS)

```sql
-- Aktifkan RLS
alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.telegram_connections enable row level security;

-- Policy: users hanya bisa lihat dan edit data sendiri
create policy "users: own data only"
  on public.users for all
  using (auth.uid() = id);

create policy "tasks: own data only"
  on public.tasks for all
  using (auth.uid() = user_id);

create policy "telegram_connections: own data only"
  on public.telegram_connections for all
  using (auth.uid() = user_id);
```

### 1.7 TypeScript Types

```ts
// src/types/index.ts

export type TaskStatus = 'to_do' | 'done' | 'hold' | 'cancel';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: 'email' | 'google';
  is_active: boolean;
  deactivated_at: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  status: TaskStatus;
  reminder_date: string;
  next_remind_at: string | null;
  reminder_count: number;
  last_reminded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TelegramConnection {
  id: string;
  user_id: string;
  telegram_chat_id: string | null;
  connect_token: string | null;
  is_connected: boolean;
  connected_at: string | null;
  created_at: string;
}
```

### 1.8 Supabase Client Setup

```ts
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

---

## Fase 2: Auth & Manajemen Akun (~1 minggu)

### 2.1 Middleware — Proteksi Route

```ts
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(r => pathname.includes(r));

  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)'],
};
```

### 2.2 Halaman Login

```tsx
// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/dashboard');
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">Masuk</h1>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Masuk...' : 'Masuk'}
        </button>

        <div className="relative text-center text-sm text-gray-400">
          <span className="bg-white px-2 relative z-10">atau</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <span>🇬 Masuk dengan Google</span>
        </button>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <a href="/register" className="text-indigo-600 font-medium">Daftar</a>
        </p>
      </div>
    </div>
  );
}
```

### 2.3 Halaman Register

```tsx
// src/app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) setError(error.message);
    else router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">Daftar</h1>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
        )}

        <input
          type="text"
          placeholder="Nama Lengkap"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <a href="/login" className="text-indigo-600 font-medium">Masuk</a>
        </p>
      </div>
    </div>
  );
}
```

### 2.4 Auth Callback Route (Google OAuth)

```ts
// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
```

### 2.5 Soft Delete Akun

```ts
// src/app/api/account/deactivate/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await supabase
    .from('users')
    .update({ is_active: false, deactivated_at: new Date().toISOString() })
    .eq('id', user.id);

  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
```

---

## Fase 3: Frontend & Core CRUD (~2 minggu)

### 3.1 API Routes — Tasks

```ts
// src/app/api/tasks/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET: ambil semua task user
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('reminder_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: tambah task baru
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, notes, reminder_date } = body;

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title,
      notes: notes || null,
      status: 'to_do',
      reminder_date,
      next_remind_at: reminder_date, // set sama dengan reminder_date untuk trigger pertama
      reminder_count: 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

```ts
// src/app/api/tasks/[id]/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PATCH: edit task atau update status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  // Jika ada reminder_date baru, reset next_remind_at dan reminder_count
  if (body.reminder_date) {
    body.next_remind_at = body.reminder_date;
    body.reminder_count = 0;
    body.last_reminded_at = null;
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(body)
    .eq('id', params.id)
    .eq('user_id', user.id) // pastikan hanya bisa update task milik sendiri
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
```

### 3.2 Komponen Top3Highlight

```tsx
// src/components/tasks/Top3Highlight.tsx
import { Task } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusBadge from './StatusBadge';

interface Props {
  tasks: Task[];
}

export default function Top3Highlight({ tasks }: Props) {
  const top3 = tasks
    .filter(t => t.status === 'to_do' || t.status === 'hold')
    .sort((a, b) => new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime())
    .slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        ⚡ Segera
      </h2>
      <div className="space-y-2">
        {top3.map(task => (
          <div key={task.id} className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-gray-800">{task.title}</p>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-xs text-indigo-500 mt-1">
              {format(new Date(task.reminder_date), "EEEE, d MMM · HH:mm", { locale: id })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3.3 Komponen TaskGroup & TaskCard

```tsx
// src/components/tasks/TaskGroup.tsx
import { Task } from '@/types';
import { format, isToday, isTomorrow } from 'date-fns';
import { id } from 'date-fns/locale';
import TaskCard from './TaskCard';

interface Props {
  date: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Hari Ini';
  if (isTomorrow(date)) return 'Besok';
  return format(date, 'EEEE, d MMM', { locale: id });
}

export default function TaskGroup({ date, tasks, onEdit, onStatusChange }: Props) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
        {getDayLabel(date)}
      </h3>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEdit(task)}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
```

```tsx
// src/components/tasks/TaskCard.tsx
import { Task } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusBadge from './StatusBadge';

interface Props {
  task: Task;
  onEdit: () => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export default function TaskCard({ task, onEdit, onStatusChange }: Props) {
  const isDone = task.status === 'done';
  const isCancel = task.status === 'cancel';
  const isEditable = !isDone && !isCancel;

  return (
    <div className={`bg-white border rounded-xl p-4 ${isDone || isCancel ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox done */}
        <button
          onClick={() => onStatusChange(task.id, isDone ? 'to_do' : 'done')}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
            ${isDone ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-indigo-400'}`}
        >
          {isDone && <span className="text-white text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </p>
          {task.notes && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{task.notes}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            🕐 {format(new Date(task.reminder_date), "HH:mm", { locale: id })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={task.status} />
          {isEditable && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              ✏️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 3.4 StatusBadge

```tsx
// src/components/tasks/StatusBadge.tsx
import { TaskStatus } from '@/types';

const config: Record<TaskStatus, { label: string; className: string }> = {
  to_do: { label: 'To Do', className: 'bg-blue-50 text-blue-600' },
  done: { label: 'Done', className: 'bg-green-50 text-green-600' },
  hold: { label: 'Hold', className: 'bg-yellow-50 text-yellow-600' },
  cancel: { label: 'Cancel', className: 'bg-gray-100 text-gray-400' },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
}
```

### 3.5 Modal AddTask

```tsx
// src/components/tasks/AddTaskModal.tsx
'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; notes?: string; reminder_date: string }) => Promise<void>;
}

export default function AddTaskModal({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !reminderDate) return;
    setLoading(true);
    await onAdd({ title: title.trim(), notes: notes || undefined, reminder_date: reminderDate });
    setTitle(''); setNotes(''); setReminderDate('');
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Tambah Task">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Judul task *"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="datetime-local"
          value={reminderDate}
          onChange={e => setReminderDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          placeholder="Catatan (opsional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim() || !reminderDate}
          className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </Modal>
  );
}
```

### 3.6 Dashboard Page

```tsx
// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Task } from '@/types';
import { format } from 'date-fns';
import Top3Highlight from '@/components/tasks/Top3Highlight';
import TaskGroup from '@/components/tasks/TaskGroup';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import FAB from '@/components/ui/FAB';
import EmptyState from '@/components/ui/EmptyState';
import Navbar from '@/components/ui/Navbar';

export default function DashboardPage() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  // Group tasks by date
  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const day = format(new Date(task.reminder_date), 'yyyy-MM-dd');
    if (!acc[day]) acc[day] = [];
    acc[day].push(task);
    return acc;
  }, {});

  const handleAdd = async (data: { title: string; notes?: string; reminder_date: string }) => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    fetchTasks();
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {loading ? (
          <div className="text-center text-sm text-gray-400 py-12">Memuat...</div>
        ) : tasks.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          <>
            <Top3Highlight tasks={tasks} />
            {Object.entries(grouped).map(([date, dayTasks]) => (
              <TaskGroup
                key={date}
                date={date}
                tasks={dayTasks}
                onEdit={setEditTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </>
        )}
      </div>

      <FAB onClick={() => setShowAdd(true)} />
      <AddTaskModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={async (data) => {
            await fetch(`/api/tasks/${editTask.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            fetchTasks();
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
}
```

---

## Fase 4: Integrasi Telegram Bot (~1 minggu)

### 4.1 Setup grammY Bot

```ts
// src/lib/telegram/bot.ts
import { Bot } from 'grammy';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set');
}

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
```

### 4.2 Format & Kirim Reminder

```ts
// src/lib/telegram/reminder.ts
import { Task } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const REMINDER_INTERVALS_MINUTES = [15, 15, 15, 15]; // 4x 15 menit = 1 jam pertama
const HOURLY_INTERVAL_MINUTES = 60;
const MAX_REMINDER_HOURS = 24;

export function getNextRemindAt(task: Task): Date | null {
  const now = new Date();
  const firstReminder = new Date(task.reminder_date);
  const hoursSinceFirst = (now.getTime() - firstReminder.getTime()) / (1000 * 60 * 60);

  // Berhenti setelah 24 jam
  if (hoursSinceFirst >= MAX_REMINDER_HOURS) return null;

  const count = task.reminder_count;
  let minutesUntilNext: number;

  if (count < REMINDER_INTERVALS_MINUTES.length) {
    // Masih dalam fase 15 menit
    minutesUntilNext = REMINDER_INTERVALS_MINUTES[count];
  } else {
    // Fase 1 jam
    minutesUntilNext = HOURLY_INTERVAL_MINUTES;
  }

  return new Date(now.getTime() + minutesUntilNext * 60 * 1000);
}

export function formatReminderMessage(task: Task): string {
  const urgencyEmoji = task.reminder_count === 0 ? '🔔' : task.reminder_count <= 3 ? '⚠️' : '🚨';
  const reminderText = task.reminder_count > 0 ? `\n<i>Pengingat ke-${task.reminder_count + 1}</i>` : '';

  return `${urgencyEmoji} <b>Pengingat Tugas</b>${reminderText}

📌 <b>${task.title}</b>

🕐 ${format(new Date(task.reminder_date), "EEEE, d MMMM yyyy · HH:mm", { locale: id })}${task.notes ? `\n\n📝 ${task.notes}` : ''}`;
}

export function getReminderInlineKeyboard(taskId: string) {
  return {
    inline_keyboard: [[
      { text: '✅ Tandai Selesai', callback_data: `done:${taskId}` }
    ]]
  };
}
```

### 4.3 API Route: Cron Job Trigger

```ts
// src/app/api/remind/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { formatReminderMessage, getReminderInlineKeyboard, getNextRemindAt } from '@/lib/telegram/reminder';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role untuk bypass RLS
);

export async function POST(request: Request) {
  // Validasi request dari Upstash (opsional: tambah header secret)
  const now = new Date().toISOString();

  // Ambil tasks yang sudah waktunya dikirimi reminder
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      telegram_connections!inner(telegram_chat_id, is_connected)
    `)
    .in('status', ['to_do', 'hold'])
    .lte('next_remind_at', now)
    .not('telegram_connections.telegram_chat_id', 'is', null)
    .eq('telegram_connections.is_connected', true);

  if (error || !tasks?.length) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;

  for (const task of tasks) {
    const chatId = task.telegram_connections.telegram_chat_id;

    try {
      // Kirim pesan ke Telegram
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: formatReminderMessage(task),
          parse_mode: 'HTML',
          reply_markup: getReminderInlineKeyboard(task.id),
        }),
      });

      // Kalkulasi next_remind_at
      const nextRemindAt = getNextRemindAt(task);

      // Update task di DB
      await supabase
        .from('tasks')
        .update({
          reminder_count: task.reminder_count + 1,
          last_reminded_at: now,
          next_remind_at: nextRemindAt ? nextRemindAt.toISOString() : null,
        })
        .eq('id', task.id);

      sent++;
    } catch (err) {
      console.error(`Failed to send reminder for task ${task.id}:`, err);
    }
  }

  return NextResponse.json({ sent });
}
```

### 4.4 API Route: Telegram Webhook

```ts
// src/app/api/webhook/telegram/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  // Validasi secret token dari Telegram
  const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
  if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Handle koneksi akun Telegram (/start <token>)
  if (body.message?.text?.startsWith('/start ')) {
    const token = body.message.text.split(' ')[1];
    const chatId = String(body.message.chat.id);

    const { data: conn } = await supabase
      .from('telegram_connections')
      .select('*')
      .eq('connect_token', token)
      .eq('is_connected', false)
      .single();

    if (conn) {
      await supabase
        .from('telegram_connections')
        .update({
          telegram_chat_id: chatId,
          is_connected: true,
          connected_at: new Date().toISOString(),
          connect_token: null,
        })
        .eq('id', conn.id);

      await sendTelegramMessage(chatId, '✅ Akun Telegram berhasil terhubung! Kamu akan menerima reminder tugas di sini.');
    } else {
      await sendTelegramMessage(chatId, '❌ Token tidak valid atau sudah digunakan.');
    }

    return NextResponse.json({ ok: true });
  }

  // Handle callback_query (klik tombol Tandai Selesai)
  if (body.callback_query) {
    const { id: callbackId, data, message } = body.callback_query;
    const chatId = String(message.chat.id);

    if (data?.startsWith('done:')) {
      const taskId = data.replace('done:', '');

      // Ambil task dan validasi pemiliknya
      const { data: conn } = await supabase
        .from('telegram_connections')
        .select('user_id')
        .eq('telegram_chat_id', chatId)
        .eq('is_connected', true)
        .single();

      if (conn) {
        await supabase
          .from('tasks')
          .update({ status: 'done', updated_at: new Date().toISOString() })
          .eq('id', taskId)
          .eq('user_id', conn.user_id);

        // Answer callback query (hapus loading di Telegram)
        await answerCallbackQuery(callbackId, '✅ Task ditandai selesai!');

        // Edit pesan original
        await editTelegramMessage(
          chatId,
          message.message_id,
          `${message.text}\n\n✅ <b>Selesai</b>`
        );
      }
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

async function sendTelegramMessage(chatId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

async function answerCallbackQuery(callbackQueryId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

async function editTelegramMessage(chatId: string, messageId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML' }),
  });
}
```

### 4.5 Halaman Settings — Koneksi Telegram

```tsx
// src/app/settings/telegram/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TelegramConnection } from '@/types';

export default function TelegramSettingsPage() {
  const supabase = createClient();
  const [conn, setConn] = useState<TelegramConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchConnection = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('telegram_connections')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setConn(data);
    setLoading(false);
  };

  useEffect(() => { fetchConnection(); }, []);

  const generateToken = async () => {
    setGenerating(true);
    const res = await fetch('/api/telegram/connect', { method: 'POST' });
    const data = await res.json();
    setConn(data);
    setGenerating(false);
  };

  if (loading) return <div className="p-6 text-sm text-gray-400">Memuat...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-lg font-semibold mb-6">Koneksi Telegram</h1>

      {conn?.is_connected ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-medium text-green-700">✅ Telegram terhubung</p>
          <p className="text-xs text-green-500 mt-1">Chat ID: {conn.telegram_chat_id}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Hubungkan akun Telegram kamu untuk menerima reminder tugas langsung di Telegram.
          </p>
          <div className="bg-gray-50 border rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium">Cara menghubungkan:</p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Klik tombol di bawah untuk generate token</li>
              <li>Buka bot Telegram kamu</li>
              <li>Kirim perintah: <code className="bg-gray-100 px-1 rounded">/start TOKEN</code></li>
            </ol>
          </div>

          {conn?.connect_token && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <p className="text-xs text-indigo-500 mb-1">Token kamu:</p>
              <code className="text-sm font-mono font-bold text-indigo-700 break-all">
                {conn.connect_token}
              </code>
              <p className="text-xs text-indigo-400 mt-2">
                Kirim ke bot: <code>/start {conn.connect_token}</code>
              </p>
            </div>
          )}

          <button
            onClick={generateToken}
            disabled={generating}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {generating ? 'Generating...' : conn?.connect_token ? 'Generate Token Baru' : 'Generate Token'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Fase 5: Cron Job, Testing & Deployment (~1 minggu)

### 5.1 Setup Upstash QStash (Cron)

Di dashboard Upstash, buat QStash schedule:
- **URL:** `https://your-app.vercel.app/api/remind`
- **Method:** POST
- **Schedule:** `*/5 * * * *` (setiap 5 menit)
- **Headers:** tambah header auth jika perlu

### 5.2 Register Telegram Webhook

Jalankan sekali setelah deploy ke Vercel:

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.vercel.app/api/webhook/telegram",
    "secret_token": "<TELEGRAM_WEBHOOK_SECRET>"
  }'
```

### 5.3 Checklist Testing End-to-End

**Auth flow:**
- [ ] Register email baru → redirect dashboard
- [ ] Login email → redirect dashboard
- [ ] Login Google → redirect dashboard
- [ ] Akses `/dashboard` tanpa login → redirect login

**Task CRUD:**
- [ ] Tambah task baru → muncul di dashboard
- [ ] Edit task → perubahan tersimpan
- [ ] Cancel task → status berubah, tidak terhapus
- [ ] Tandai selesai dari checkbox → status done
- [ ] Top 3 Highlight hanya tampilkan to_do dan hold
- [ ] Grouping per hari benar

**Telegram integration:**
- [ ] Generate token → kirim ke bot → status terhubung
- [ ] Buat task dengan reminder 1 menit ke depan → reminder diterima di Telegram
- [ ] Klik "Tandai Selesai" di Telegram → status task berubah di app
- [ ] Persistent reminder: cek reminder ke-2 muncul 15 menit kemudian
- [ ] Reminder berhenti setelah task di-done

**PWA:**
- [ ] Install prompt muncul di mobile
- [ ] App bisa dibuka dari home screen
- [ ] Load time < 1.5 detik

### 5.4 Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard atau via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_APP_URL

# Deploy production
vercel --prod
```

---

## Catatan Penting

- **Service Role Key** jangan pernah diekspos ke client. Hanya dipakai di API routes server-side (`/api/remind`, `/api/webhook`).
- **RLS** harus aktif di semua tabel — pastikan policy sudah di-test sebelum production.
- **Cron interval** minimum 1 menit untuk akurasi reminder, tapi Upstash free tier minimum 1 menit.
- **next_remind_at = null** berarti reminder sudah berhenti (sudah 24 jam atau task done) — cron query harus filter `next_remind_at IS NOT NULL`.
