This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## UofTwo - University of Toronto Dating App

A dating app exclusively for University of Toronto students. Upload your schedule, discover your dorm archetype, and connect with fellow UofT students through an interactive 3D Planet experience!

### ✨ New Feature: Planet View

An interactive Soul App-inspired 3D sphere where you can explore and connect with other UofT students. Each glowing dot represents a user profile!

**Features:**
- 🌍 Interactive 3D sphere with drag-to-rotate
- 🎨 Color-coded profiles by dorm archetype
- 👤 Click dots to view profile previews
- 🔒 Protected route for authenticated users only

See [PLANET_FEATURE_GUIDE.md](./PLANET_FEATURE_GUIDE.md) for detailed documentation.

### 🧠 New Feature: Preference Learning System

A two-layer matching system that learns from your viewing behavior to refine matches:
- **Layer 1**: Initial matching from questionnaire (50%)
- **Layer 2**: Behavioral refinement from viewing history (25%)
- **Layer 3**: Schedule compatibility placeholder (25%)

As you view profiles, the system learns your preferences and adjusts matches accordingly. Profiles you spend more time viewing influence which archetypes you're matched with next.

See [PREFERENCE_SYSTEM.md](./PREFERENCE_SYSTEM.md) for full documentation and [PREFERENCE_SETUP.md](./PREFERENCE_SETUP.md) for setup instructions.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
