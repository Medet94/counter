# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Create React App project bootstrapped with TypeScript. The application is a simple counter component using React hooks (useReducer) to demonstrate state management patterns.

## Development Commands

- `npm start` - Start development server on http://localhost:3000 with hot reload
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Build production-ready app to build/ folder
- `npm run eject` - Eject from Create React App (one-way operation)

## Architecture

- **Entry point**: `src/index.tsx` - React 18 root with StrictMode
- **Main component**: `src/App.tsx` - Counter component using useReducer pattern
- **Styling**: `src/styles.css` - Basic CSS styles
- **TypeScript config**: Uses path aliases with `@/*` mapping to `src/*`

## Key Patterns

- Uses `useReducer` hook for state management with typed actions
- Enum-based action types (`Types.inc`, `Types.dec`)
- Functional components with TypeScript
- React 18 concurrent features enabled