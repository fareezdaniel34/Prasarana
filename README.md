# Rapid Rail Digital Plotting Board

A web-based plotting board for tracking train positions on Rapid KL's **Ampang Line** and its depots. Operators drag train markers on the line and depot maps, and every move is saved and logged with who made it and when.

Originally built during my IT internship at **Prasarana Malaysia (Rapid Rail)** in 2022 as a digital backup for the IT department's plotting board, then rewritten in 2026 with TypeScript, Express and SQLite.

![Screenshot](docs/screenshot.png)

## Features

- **Interactive board:** drag and drop trains to update their position on the map
- **Multiple locations:** Ampang Line, Ampang Depot and KKSB Depot, each with its own map
- **Train controls:** add trains, set direction (left / right), move a train to another location, delete with confirmation
- **Movement log:** every change records the before/after position, direction, location and user
- **Login:** JWT authentication (12-hour sessions) with bcrypt-hashed passwords
- **Validation:** all API input checked with Zod; database constraints on positions and directions
- **Accessible:** keyboard support (Enter / Space opens a train's menu), ARIA labels, fullscreen mode

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite (built-in `node:sqlite`) |
| Auth & validation | JSON Web Tokens, bcryptjs, Zod |

## Getting Started

**Requirements:** Node.js 22.13 or newer (needed for the built-in SQLite module).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
