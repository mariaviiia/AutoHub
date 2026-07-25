# AutoHub

A modern car marketplace platform that connects dealerships and buyers through a fast, intuitive, and scalable web experience.

https://sr-paisa-cars.vercel.app/

## Overview

Auto Marker is a modern web platform designed to simplify the process of discovering, managing, and showcasing vehicles.

The application provides dealerships with a centralized space to publish and manage inventory while allowing users to browse vehicles, save favorites, and explore listings through an intuitive experience.

The project is currently under active development, with the MVP completed and new functionality continuously being planned and implemented.

## Core Features

- Authentication with Supabase
- Vehicle catalog
- Dynamic vehicle pages
- Favorites system
- Dealer dashboard
- Vehicle management
- Responsive interface
- Form validation with React Hook Form and Zod
- Server state management with React Query

## Tech Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Forms | React Hook Form |
| Validation | Zod |
| Server State | TanStack Query |
| Client State | Zustand |

## Architecture

The application follows a feature-oriented architecture built around the Next.js App Router.

Reusable UI components are separated from business logic, while global state, server state, and backend integrations remain isolated to improve scalability and maintainability.

The project prioritizes predictable folder organization, type safety, and modularity to support long-term development.

## Development Status

Auto Marker is currently in active development.

The MVP has been completed and provides the core functionality required for dealerships and users.

Upcoming iterations will focus on expanding product capabilities, improving user experience, and strengthening overall platform architecture.

## Roadmap

### Completed

- [ ] Authentication
- [x] Vehicle listings
- [x] Dealer dashboard
- [ ] Favorites
- [x] Dynamic routing

### In Progress

- [ ] Advanced search filters
- [ ] Image optimization
- [ ] Notifications

### Planned

- [ ] Messaging system
- [ ] Analytics dashboard
- [ ] Vehicle comparison
- [ ] Vehicle customization
- [ ] Unit testing
- [ ] CI/CD

## Why Auto Marker?

Auto Marker was created as a real-world engineering project to explore how a modern marketplace application can be designed using scalable frontend architecture, type-safe development, and a production-oriented workflow.

Rather than being a tutorial or coding exercise, the project is intended to evolve continuously, with each iteration introducing new product features and architectural improvements.
