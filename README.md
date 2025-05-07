# FinTrackEasy

FinTrackEasy is a user-friendly personal finance tracking application that helps users manage their daily income and expenses.

# Member

|      Name      | ID  |
| :------------: | :-: |
|   Aaron Liu    |     |
|  Carrie Leung  |     |
|  Wing Ho Chau  |     |
| Sheng-Lin Yang |     |

## Technology Stack

### Frontend

- React
- React Router
- Axios
- Shadcn UI/Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose

## Installation Guide

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- pnpm

### Installation Steps

1. Clone the project

```bash
git clone [repository-url]
cd FinTrackEasy
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
   Create a `.env` file in the project root directory and add the necessary environment variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## Running the Project

### Start both Backend and Frontend at the same time

```bash
pnpm dev
```

## Prettier (only handles formatting)

```bash
pnpm format:fix
```

- Execution tool: Prettier
- Purpose: Unify code formats (such as indentation, semicolons, quotes, line breaks, etc.), and do not check for syntax errors or potential bugs

## ESLint (which handles syntax, quality, and some formatting (such as import ordering))

```bash
pnpm lint:fix
```

- Execution tool: ESLint
- Function: Check and automatically correct syntax errors and code quality issues (such as import order, unused variables, etc.) according to ESLint rules, and can also correct some formatting issues
