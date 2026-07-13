# Behind the Force / NexaSoul Srujana Quiz App

This repository contains a full-stack quiz platform built with Next.js, React, Prisma, and SQLite. It is designed for the NexaSoul technical club’s weekly Srujana event, where participants can join a timed trivia challenge, answer multiple-choice questions, and receive instant results. The experience is intentionally bold and playful, with a brutalist visual style and a fast, game-like flow.

## Overview

Behind the Force is a polished quiz experience with two main audiences:

- Participants who take the quiz and see their score, accuracy, and breakdown
- Admins who create quizzes, manage question sets, activate or deactivate quizzes, and view analytics

The app is built around a simple but effective flow:

1. A quiz is created and activated by an admin
2. Participants enter the quiz from the public landing page
3. Their answers are recorded and scored in real time
4. The system finishes the attempt and shows a detailed results page

## Key Features

- Public landing page with an active quiz banner
- Quiz-taking experience with one-tap answer selection
- Hidden timer so participants are not shown the countdown
- Automatic question progression after each answer
- Scoring system with base points and speed bonuses
- Results page showing score, accuracy, time taken, and per-question breakdown
- Admin login and protected dashboard
- Quiz creation, activation, deactivation, and editing
- Prisma-backed persistence with SQLite for local development
- Seeded starter content for a sample Srujana Week 1 quiz

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Prisma ORM
- SQLite via Prisma Better SQLite3 adapter
- Tailwind CSS 4
- ESLint

## Project Structure

```text
src/
  app/
    admin/            # Admin login, dashboard, quiz management pages
    api/              # REST-style API routes for quiz, attempts, and admin actions
    quiz/             # Public quiz entry, play, and results pages
    page.tsx          # Home page
  components/         # Reusable UI components such as cards and buttons
  lib/                # Auth, Prisma client, scoring helpers
  types/              # Shared TypeScript types
prisma/
  schema.prisma       # Database schema
  seed.ts             # Seed data for the starter quiz
  migrations/         # Prisma migration history
```

## Database Model

The project uses four main database entities:

- Quiz: contains quiz metadata, duration, activation state, and related questions
- Question: holds the prompt, options, correct answer, and ordering
- Attempt: tracks an individual participant’s session and final score
- Answer: records each selected answer, correctness, and scoring details

## Prerequisites

Make sure you have the following installed:

- Node.js 20 or newer
- npm

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd behind-the-force
npm install
```

Create a local environment file with the required variables:

```env
DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD="your-secure-admin-password"
```

## Database Setup

Run the Prisma migrations and seed the starter quiz data:

```bash
npm run db:setup
```

This command will:

- Apply the Prisma schema to the local SQLite database
- Seed the database with a sample Srujana Week 1 quiz

## Running the App Locally

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Admin Access

The admin portal is available at:

```text
/admin
```

Use the password defined in the environment variable `ADMIN_PASSWORD`. If no environment variable is set, the app falls back to the default password `nexasoul2026`.

After logging in, the admin can:

- Create a new quiz
- Set quiz metadata such as title, week number, duration, and deadline
- Add and edit questions
- Activate or deactivate quizzes
- View analytics for quiz attempts

## Quiz Flow

A typical participant journey looks like this:

1. The participant visits the home page
2. They click into the active quiz
3. The app starts a quiz attempt and stores session state in the browser
4. Each question is shown one at a time
5. Selecting an answer records the response and advances to the next question
6. When the quiz ends, the participant is taken to a results page showing their full breakdown

## Scoring Logic

The scoring model is intentionally simple and competitive:

- Correct answer: +10 points
- Speed bonus: +5 for taking 5 seconds or less, +3 for taking 10 seconds or less
- Wrong answer: 0 points

The app calculates accuracy, total score, and per-question scoring automatically.

## Available Scripts

```bash
npm run dev          # start Next.js in development mode
npm run build        # generate Prisma client and build the app
npm run start        # start the production build
npm run lint         # run ESLint
npm run db:migrate   # run Prisma migrations
npm run db:seed      # seed the database
npm run db:setup     # migrate and seed in one step
```

## Environment Variables

The application expects the following environment variables:

- `DATABASE_URL`: path to the SQLite database file
- `ADMIN_PASSWORD`: password used for the admin login page

## Development Notes

- The project is configured for local development and uses SQLite by default
- The UI uses a playful “brutalism” aesthetic and custom styling
- The quiz content and starter data are seeded from [prisma/seed.ts](prisma/seed.ts)
- Prisma client files are generated into [src/generated/prisma](src/generated/prisma)

## Deployment Notes

This project is currently set up for local-first development. For production deployments:

- Use a persistent database volume or a managed database service
- Ensure the environment variables are set correctly
- Consider switching from SQLite to a production-ready database if the app is expected to scale beyond a small local or internal deployment

## License

No formal license has been declared for this repository yet.
