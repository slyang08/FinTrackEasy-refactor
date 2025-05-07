# FinTrackEasy

FinTrackEasy is a user-friendly personal finance tracking application that helps users manage their daily income and expenses.

# Member

|      Name      | ID  |
| :------------: | :-: |
|   Aaron Liu    |  105515233  |
|  Carrie Leung  |  106844228  |
|  Wing Ho Chau  |  150924231  |
| Sheng-Lin Yang |  160443222  |

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

### Start Backend Service

```bash
cd express
pnpm dev
```

### Start Frontend Development Server

```bash
cd fte-react
pnpm dev
```
