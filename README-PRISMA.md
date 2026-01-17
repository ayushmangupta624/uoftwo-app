# Prisma Setup

This project uses Prisma ORM to manage database schema and queries. The database operations are handled through Prisma, while Supabase is still used for authentication.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Add `DATABASE_URL` to your `.env.local` file:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
   ```
   
   You can find this connection string in your Supabase dashboard:
   - Go to Project Settings > Database
   - Copy the "Connection string" > "URI" value

3. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

4. **Push schema to database:**
   ```bash
   npm run db:push
   ```
   
   This will create/update the `users` table in your Supabase database based on your Prisma schema.

5. **Optional: View database in Prisma Studio:**
   ```bash
   npm run db:studio
   ```

## Database Schema

The schema is defined in `prisma/schema.prisma`. Currently, it includes:
- `User` model with gender and gender preferences

## Migrations

- Push schema directly (for development): `npm run db:push`
- Create migration (for production): `npm run db:migrate`
- Generate Prisma Client: `npm run db:generate`

## Notes

- Supabase is still used for authentication (`auth.users` table)
- All database queries now go through Prisma instead of Supabase client
- Row Level Security (RLS) policies must still be set up in Supabase dashboard for the `users` table
- The schema can be managed entirely through code using Prisma migrations
- Gender values: `'male'`, `'female'`, `'other'`, `'non-binary'`

