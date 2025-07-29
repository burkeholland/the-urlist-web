# The Urlist - Link Sharing Application

A beautiful, fast link sharing application built with Astro, React, and Tailwind CSS.

## ✨ Features

- **Create and Share Lists**: Build collections of links with beautiful, shareable URLs
- **Rich Link Previews**: Automatic metadata extraction for titles, descriptions, and images
- **Dark/Light Mode**: Toggle between themes with smooth transitions and persistence
- **Drag & Drop**: Reorder links with intuitive drag and drop functionality
- **Custom URLs**: Choose your own URL or let the system generate one
- **Real-time Updates**: Instant UI updates without page reloads

## 🌙 Theme Support

The application includes comprehensive light and dark mode support:

- **Toggle Button**: Located in the navigation header for easy access
- **System Preference**: Automatically detects your system's theme preference on first visit
- **Persistence**: Your theme choice is saved and remembered across sessions
- **Smooth Transitions**: Elegant fade transitions when switching themes
- **Comprehensive Styling**: All UI elements are styled for both light and dark modes

### Theme Customization

The theme system uses Tailwind CSS's built-in dark mode support with the `class` strategy. To customize theme colors or add new theme variants:

1. **Colors**: Modify the color scheme in `tailwind.config.js`
2. **Components**: Add dark mode variants using Tailwind's `dark:` prefix
3. **Animations**: Theme transitions are defined in `src/styles/global.css`

### Theme Store

The theme is managed using Nanostores for reactive state management:

```typescript
import { theme, toggleTheme, setTheme } from './stores/theme';

// Get current theme
const currentTheme = theme.get(); // 'light' | 'dark'

// Toggle between themes
toggleTheme();

// Set specific theme
setTheme('dark');
```

## 🚀 Project Structure

```text
./
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # React components
│   │   ├── ThemeToggle.tsx  # Theme switching component
│   │   ├── Button.tsx       # Styled button component
│   │   └── ...
│   ├── layouts/
│   │   └── Layout.astro     # Main layout with navigation
│   ├── pages/               # Astro pages and API routes
│   │   ├── api/            # API endpoints
│   │   └── index.astro     # Homepage
│   ├── stores/             # Nanostores state management
│   │   ├── theme.ts        # Theme store and utilities
│   │   └── lists.ts        # Lists state management
│   ├── styles/
│   │   └── global.css      # Global styles and theme transitions
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm test`                | Run unit tests with Vitest                       |
| `npm run test:ui`         | Run tests with Vitest UI                         |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 🛠 Technology Stack

- **Frontend**: Astro + React + TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: Nanostores for reactive state
- **Database**: PostgreSQL with raw SQL queries
- **Testing**: Vitest + Testing Library
- **Deployment**: Node.js server-side rendering

## 🎨 Design System

The application follows a consistent design system:

- **Primary Color**: `#15BFAE` (teal brand color)
- **Typography**: Inter font family
- **Spacing**: Consistent Tailwind spacing scale
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: ARIA labels, keyboard navigation, color contrast

## 🧪 Testing

The project includes comprehensive tests for theme functionality:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

Tests cover:
- Theme store functionality
- Component rendering and interactions
- LocalStorage persistence
- System preference detection

## 👀 Want to learn more?

Feel free to check [Astro documentation](https://docs.astro.build) or explore the codebase to understand the implementation details.
