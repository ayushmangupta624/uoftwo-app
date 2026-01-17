# Supabase Setup Instructions

## 1. Database Setup

### Get Your Connection String
1. Go to your Supabase project dashboard
2. Navigate to Settings > Database
3. Copy the connection string (use the "Transaction" pooler for `DATABASE_URL`)
4. Copy the direct connection string for `DIRECT_URL`

### Environment Variables
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## 2. Run Migrations

```bash
# Push schema to Supabase
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

## 3. Enable pgvector (Optional)

If you want to use native vector types in the future:

1. Go to SQL Editor in Supabase
2. Run:
```sql
create extension if not exists vector;
```

**Note**: Current implementation uses JSON for embeddings, so this is optional.

## 4. Storage Setup (Optional)

If you want to use Supabase Storage instead of Vercel Blob:

### Create Storage Buckets
1. Go to Storage in Supabase dashboard
2. Create two buckets:
   - `schedules` (for schedule uploads)
   - `profile-pictures` (for profile photos)
3. Set both to **public** access

### Update Your Code
Use the `lib/supabaseStorage.ts` file instead of Vercel Blob:

```typescript
// In app/api/schedule/upload/route.ts
import { uploadScheduleFile } from '@/lib/supabaseStorage';

// Replace:
const blob = await put(...);

// With:
const fileUrl = await uploadScheduleFile(user.id, file);
```

### Environment Variables for Storage
```env
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."
```

## 5. Row Level Security (RLS)

For production, enable RLS on your tables:

```sql
-- Enable RLS
alter table "User" enable row level security;
alter table "Match" enable row level security;
alter table "Conversation" enable row level security;
alter table "Message" enable row level security;

-- Example policy: Users can only read their own data
create policy "Users can view own profile"
  on "User"
  for select
  using (auth.uid()::text = id);

-- Add more policies as needed for your security requirements
```

## 6. Authentication with Supabase (Optional)

If you want to use Supabase Auth instead of NextAuth:

```bash
npm install @supabase/auth-helpers-nextjs
```

See Supabase docs for Next.js integration: https://supabase.com/docs/guides/auth/auth-helpers/nextjs

## Differences from Standard PostgreSQL

1. **Connection Pooling**: Supabase uses PgBouncer, so use both `DATABASE_URL` (pooled) and `DIRECT_URL` (direct)
2. **Vector Extension**: Pre-installed on most Supabase projects
3. **Storage**: Built-in S3-compatible storage (alternative to Vercel Blob)
4. **Auth**: Built-in authentication system (alternative to NextAuth)
5. **Real-time**: Built-in real-time subscriptions for chat features

## Troubleshooting

### "relation does not exist" error
```bash
npx prisma db push --force-reset
npx prisma generate
```

### Connection timeout
- Use `DIRECT_URL` for migrations
- Use `DATABASE_URL` for app queries

### Vector extension not found
```sql
-- Run in SQL Editor
create extension vector;
```
