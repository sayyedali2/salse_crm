# SalesPilot CRM

SalesPilot CRM is a comprehensive Customer Relationship Management system designed to streamline sales processes, manage leads, and enhance team productivity.

ProjectLink: https://salse-crm.vercel.app/

## Project Structure

The project is divided into two main parts:

- **Client**: The frontend application built with Next.js, React, and Material UI.
- **Server**: The backend API built with NestJS, GraphQL, and MongoDB.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (or yarn/pnpm)
- MongoDB (running locally or a cloud instance like MongoDB Atlas)

## Setup and Installation

### 1. Clone the Repository

```bash
git clone <repository_url>
cd salse_crm
```

### 2. server Setup

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure your environment variables (MongoDB URI, JWT Secret, SendGrid Keys, etc.).

### 3. Client Setup

Navigate to the `client` directory and install dependencies:

```bash
cd ../client
npm install
```

Create a `.env.local` file in the `client` directory if needed for environment-specific configurations.

## How to Run

### Running the Server

In the `server` directory:

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The server will typically run on `http://localhost:3000` (or the port specified in your .env).

### Running the Client

In the `client` directory:

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

The client will typically run on `http://localhost:3001` (or the default Next.js port).

## Key Features

- **Lead Management**: Create, view, update, and delete leads.
- **Auto-Assignment**: Leads are automatically assigned to the best available agent based on workload.
- **Authentication**: Secure login and role-based access control (Admin, Agent, etc.).
- **Proposal Generation**: **[NEW]** Generate and email professional PDF proposals directly from the Lead View.
- **Organization Management**: Manage multiple organizations and teams.
- **Dashboard**: Visual insights into sales performance and lead status.
