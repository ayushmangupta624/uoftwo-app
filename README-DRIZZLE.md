# Drizzle ORM Setup

This project uses Drizzle ORM to manage database schema and queries. The database operations are handled through Drizzle, while Supabase is still used for authentication.

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

3. **Generate migrations:**
   ```bash
   npm run db:generate
   ```

4. **Push schema to database:**
   ```bash
   npm run db:push
   ```
   
   This will create/update the `users` table in your Supabase database.

5. **Optional: View database in Drizzle Studio:**
   ```bash
   npm run db:studio
   ```

## Database Schema

The schema is defined in `db/schema.ts`. Currently, it includes:
- `users` table with gender and gender preferences

## Migrations

- Generate migrations: `npm run db:generate`
- Run migrations: `npm run db:migrate`
- Push schema directly (for development): `npm run db:push`

## Notes

- Supabase is still used for authentication (`auth.users` table)
- All database queries now go through Drizzle ORM instead of Supabase client
- Row Level Security (RLS) policies must still be set up in Supabase dashboard for the `users` table
- The schema can be managed entirely through code using Drizzle migrations

