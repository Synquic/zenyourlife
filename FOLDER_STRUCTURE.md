# Zenurlife Frontend - Folder Structure

## Project Overview
This is a React + TypeScript + Vite application for the Zenurlife wellness platform.

## Directory Structure

```
frontend/
├── public/                          # Static assets served directly
├── src/                            # Source code directory
│   ├── assets/                     # Images and static resources
│   │   ├── Frame1.jpg             # Hero section background image
│   │   ├── znlogo.png             # Zenurlife logo
│   │   ├── Expert1.png            # Expert profile image
│   │   ├── service 1.png          # Service card image 1
│   │   ├── service 2.png          # Service card image 2
│   │   ├── MasterButton.png       # Button graphics
│   │   ├── MasterButton (1).png
│   │   ├── MasterButton (2).png
│   │   ├── MasterButton (3).png
│   │   ├── profile1.png           # Testimonial profile images
│   │   ├── profile2.png
│   │   ├── profile3.png
│   │   └── profile4.png
│   │
│   ├── components/                 # Reusable React components
│   │   ├── HeroSection.tsx        # Homepage hero section with main CTA
│   │   ├── Navbar.tsx             # Main navigation bar
│   │   ├── NavbarHome.tsx         # Home-specific navigation
│   │   ├── Service.tsx            # Service cards/section
│   │   ├── Philosophy.tsx         # Company philosophy section
│   │   ├── Overview.tsx           # Overview section
│   │   ├── Expert.tsx             # Expert profiles section
│   │   ├── Testimonial.tsx        # Customer testimonials
│   │   └── Footer.tsx             # Site footer
│   │
│   ├── Pages/                      # Page-level components
│   │   ├── Home.tsx               # Homepage
│   │   └── About.tsx              # About page
│   │
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles (Tailwind CSS)
│
├── node_modules/                   # Dependencies (gitignored)
│
├── index.html                      # HTML entry point
├── package.json                    # Project dependencies & scripts
├── package-lock.json              # Locked dependency versions
│
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # App-specific TS config
├── tsconfig.node.json             # Node-specific TS config
│
├── tailwind.config.cjs            # Tailwind CSS configuration
├── postcss.config.cjs             # PostCSS configuration
│
├── eslint.config.js               # ESLint configuration
└── README.md                       # Project documentation
```

## Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.2
- **Styling**: Tailwind CSS 4.1.17
- **Routing**: React Router DOM 7.9.6
- **Icons**: Lucide React 0.554.0
- **Fonts**: Inter (via @fontsource)

## Component Architecture

### Layout Components
- `Navbar.tsx` / `NavbarHome.tsx` - Navigation bars
- `Footer.tsx` - Site footer

### Content Components
- `HeroSection.tsx` - Main landing section with hero image and CTA
- `Service.tsx` - Service offerings display
- `Philosophy.tsx` - Company values and philosophy
- `Overview.tsx` - Product/service overview
- `Expert.tsx` - Expert team profiles
- `Testimonial.tsx` - Customer reviews and feedback

### Pages
- `Home.tsx` - Main landing page (composes multiple components)
- `About.tsx` - About the company page

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Key Features

- Responsive design with Tailwind CSS
- TypeScript for type safety
- Fast HMR with Vite
- Component-based architecture
- Modern React 19 features
- ESLint for code quality
