# FinTrackEasy-refactor

**FinTrackEasy-refactor** is a personal finance tracking application refactored from the original [FinTrackEasy](https://github.com/Project-Implementation-PRJ666/FinTrackEasy).

This version focuses on back-end improvements by refactoring the original monolithic architecture into a microservices-based structure, improving scalability, maintainability, and modularity.

Users can still manage their daily income and expenses, while developers benefit from a cleaner and more flexible service-oriented back-end design.

## Credits

This project is a refactored version of [FinTrackEasy](https://github.com/Project-Implementation-PRJ666/FinTrackEasy), originally developed by the PRJ666 project team:

|      Name      |    ID     |
| :------------: | :-------: |
|   Aaron Liu    | 105515233 |
|  Carrie Leung  | 106844228 |
| Sheng-Lin Yang | 160443222 |
|   Tracy Tran   | 109604223 |
|  Wing Ho Chau  | 150924231 |

All original design and implementation credits go to the respective authors.

**This repository is independently maintained by _Sheng-Lin Yang_ as a personal refactoring project.**

## Technology Stack

### Frontend

- React
- React Router
- Axios
- Shadcn UI
- Tailwind CSS

### Backend

- Node.js & Express (Main API)
- Python & FastAPI (Auth service)
- Golang & Gin (User service)
- MongoDB
- PostgreSQL

## Installation Guide

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.9 or higher)
- FastAPI
- Go (v1.24 or higher)
- Gin
- MongoDB
- pnpm

### Installation Steps

1. Clone the project

```bash
git clone https://github.com/slyang08/FinTrackEasy-refactor
cd FinTrackEasy-refactor
```

2. Install backend dependencies

```bash
cd express
pnpm install
```

3. Install frontend dependencies

```bash
cd ../fte-react
pnpm install
```

4. Configure environment variables  
   Create a `.env` file inside the `express` directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## Running the Project

### Start both Backend and Frontend at the same time

```bash
pnpm dev
```

## Code Formatting & Linting

### Prettier – Code Formatter

```bash
pnpm format:fix
```

- Formats code (indentation, semicolons, quotes, etc.)
- Does **not** check for syntax errors or code quality issues

### ESLint – Code Linter

```bash
pnpm lint:fix
```

- Checks for syntax errors and code quality issues
- Enforces consistent import order and usage rules
- Can auto-fix many common issues
