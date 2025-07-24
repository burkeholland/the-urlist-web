# The Urlist - AI Coding Guide

The application is already running on port 4321. You do not need to start it again.

**Link sharing application built with Astro + React + Postgres**

*Owner: burkeholland | Server-side rendered | Native Postgres (no ORM)*

---

## 🏗 Architecture Overview

**Core Pattern**: Astro SSR pages + React islands for interactivity
- **Static pages**: `.a## 🔥 Final Thoughts

1. **Avoid over-engineering.** Keep it simple.
2. **Prioritize readability over cleverness.**
3. **Only abstract when it provides real value.**
4. **Keep state management minimal.**
5. **Use Tailwind properly—don't fight it.**
6. **Use `.astro` files effectively—static content in `.astro`, interactivity in React.**

---s handle routing, SEO, initial data fetching
- **Interactive components**: React components with `client:load` directive
- **State management**: Nanostores for client-side state
- **Data layer**: Raw Postgres queries via `src/utils/db.ts`

### Key Data Flow
1. Astro pages fetch initial data server-side
2. Interactive React components manage client state via Nanostores  
3. API routes (`src/pages/api/`) handle mutations
4. Metadata scraped automatically when adding links

```astro
<!-- Example: Server data + client interactivity -->
---
const list = await client.query("SELECT * FROM lists WHERE slug = $1", [slug]);
---
<Layout>
  <ListContainer client:load listId={list.id} />
</Layout>
```

---

## � Essential Development Patterns

### Database Access
**Always use `src/utils/db.ts`** - single Postgres client instance:
```typescript
import { client } from '../../utils/db';
const result = await client.query('SELECT * FROM lists WHERE id = $1', [id]);
```

### API Route Structure
All API routes return consistent JSON responses:
```typescript
export const POST: APIRoute = async ({ request }) => {
  try {
    const result = await client.query(/* SQL */, [params]);
    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### State Management
Use Nanostores for client state that needs to persist across components:
```typescript
// src/stores/lists.ts
export const currentLinks = atom<Link[]>([]);
export async function fetchLinks(listId: number) {
  const links = await fetch(`/api/links?list_id=${listId}`);
  currentLinks.set(links);
}
```

---

## 🚀 Development Workflow

### Commands (PowerShell compatible)
```powershell
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build
npm run preview      # Preview production build
npm test            # Run Vitest tests
```

### Adding New Features
1. **API endpoint**: Add to `src/pages/api/` with proper error handling
2. **Database**: Write raw SQL queries using parameterized statements
3. **UI component**: Create React component in `src/components/`
4. **Page integration**: Use `client:load` directive for interactivity
5. **Types**: Update `src/types/` for TypeScript safety

### Metadata Scraping
Links automatically fetch metadata via `metascraper`:
- Title, description, and image extracted from URLs
- Handled in `src/pages/api/links.ts` and `src/pages/api/metadata.ts`
- Fallback values provided for failed scrapes

---

## 🎨 UI & Styling Conventions

### Tailwind Patterns
**Consistent spacing & colors** used throughout:
- Primary color: `#15BFAE` (teal brand color)
- Focus states: `focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20`
- Form styling: `px-6 py-4 bg-white border border-gray-200 rounded-xl`

### Component Structure
Components follow focused responsibility pattern:
- `CreateList.tsx`: Form with validation, navigation on success
- `ListContainer.tsx`: Manages links state, drag & drop
- `AddLink.tsx`: URL input with auto-metadata fetching
- `LinkItem.tsx`: Individual link display with edit/delete

### Interactive Components
Use React for dynamic behavior, Astro for static content:
```tsx
// Interactive component gets client:load
<ShareButton client:load url={Astro.url.href} />
<DeleteListButton client:load listId={list.id} onDeleted={handleListDeleted} />
```

---

## 🔍 Key Integration Points

### Drag & Drop (DnD Kit)
Links support reordering via `@dnd-kit/*`:
- Wrapped in `<SortableContext>` with `verticalListSortingStrategy`
- Position updates sent to `PATCH /api/links` endpoint
- Optimistic UI updates via Nanostores

### URL Validation
All URLs processed through `src/utils/validation.ts`:
```typescript
// Handles protocol-less URLs, ensures valid format
const normalizedUrl = sanitizeUrl(url.trim());
```

### Error Handling
Consistent patterns across components:
- API errors caught and displayed in UI
- Loading states managed locally
- Toast notifications for user feedback

---

## 🚨 Critical Implementation Notes

1. **Database connections**: Single shared client in `src/utils/db.ts`
2. **PowerShell compatibility**: All commands tested for Windows
3. **No ORM**: Raw SQL with parameterized queries only
4. **Client hydration**: Use `client:load` sparingly, only for interactivity
5. **Type safety**: All API responses typed via `src/types/link.ts`

---

## ⚛ React Component Best Practices

### ✅ When to Create a New Component

1. **If the JSX exceeds ~30 lines.**
2. **If the UI is used more than once.**
3. **If it has a clear single responsibility.**

```tsx
// ❌ BAD: Bloated file
export function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Click Me
      </button>
      <table>...</table>
    </div>
  );
}

// ✅ GOOD: Extracted components
export function Dashboard() {
  return (
    <div className="p-4">
      <Title>Dashboard</Title>
      <Button>Click Me</Button>
      <DataTable />
    </div>
  );
}
```

📌 **Rules:**

- **Keep components small and focused.**
- **Avoid abstraction unless it provides real value.**

---

## 🚀 Astro Best Practices

### ✅ Keep Astro Components Focused

- Use **.astro** files for page structure and layout.
- Prefer using **React for interactive components**.
- Keep **Astro pages clean**—avoid unnecessary logic.

```astro
---
import { Button } from '../components/Button.tsx';
---

<Layout>
  <h1 class="text-2xl font-bold">Welcome</h1>
  <Button>Click Me</Button>
</Layout>
```

📌 **Rules:**

- **Use `.astro` files for static content.**
- **Use React only when interactivity is needed.**
- **Keep logic out of `.astro` files when possible.**

---

## 🎨 Tailwind Best Practices

### ✅ Use Utility Classes Over Custom CSS

```tsx
// ✅ Prefer Tailwind utility classes
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="p-4 rounded-lg shadow-md bg-white">{children}</div>;
}
```

📌 **Rules:**

- **Avoid unnecessary `class` extractions.**
- **Use Tailwind’s built-in utilities.**

---

## 🏪 Nanostores Best Practices

### ✅ Keep Stores Small & Independent

```tsx
// src/stores/auth.ts
import { atom } from "nanostores";

export const user = atom<User | null>(null);
export const isAuthenticated = computed(user, (u) => !!u);
```

📌 **Rules:**

- **Use `atom` for simple state.**
- **Use `computed` for derived state.**
- **Keep stores independent.**

---

## 🌿 Hooks Best Practices

### ✅ Only Create Hooks for Reusable Logic

```tsx
// src/hooks/useFetch.ts
import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData);
  }, [url]);

  return data;
}
```

📌 **Rules:**

- **No "just in case" hooks.**
- **Keep hooks simple and focused.**

---

## 🛠 Development Workflow Best Practices

### ✅ Consistent Coding Style

- Use **ESLint + Prettier** to enforce formatting.
- Keep **imports organized**:

```tsx
import { useState } from "react"; // React first
import { user } from "@/stores/auth"; // Stores second
import { Button } from "@/components/Button"; // Components last
```

---

## 🔥 Final Thoughts

1. **Avoid over-engineering.** Keep it simple.
2. **Prioritize readability over cleverness.**
3. **Only abstract when it provides real value.**
4. **Keep state management minimal.**
5. **Use Tailwind properly—don’t fight it.**
6. **Use `.astro` files effectively—static content in `.astro`, interactivity in React.**

---
