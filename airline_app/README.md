
# Node.js airline web Application

This Node.js application leverages Express.js for server-side logic, integrates with PostgreSQL for data management, and supports real-time communication via Socket.IO.

## Features

- **Express.js Framework**: Utilizes Express.js for routing and middleware.
- **EJS Templating**: Server-side rendering with EJS templating engine.
- **Passport.js Authentication**: Implements local authentication strategy with Passport.js.
- **PostgreSQL Database**: Connects to PostgreSQL for data persistence.
- **Socket.IO Real-Time Communication**: Enables real-time interaction with chat functionality.
- **Stripe Payment Integration**: Configures Stripe for handling payments.
- **Session Management**: Uses express-session for handling user sessions.

## Prerequisites

Before you start, ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- PostgreSQL Database

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/fmushumba/airline_system.git
cd airline-app
npm install
```

## Configuration

Create a `.env` file in the root directory and update it with your credentials:

```
PORT=3000
STRIPE_API_KEY=your_stripe_secret_key
POSTGRES_USER=your_postgres_username
POSTGRES_HOST=your_postgres_host
POSTGRES_DB=your_postgres_database
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_PORT=your_postgres_port
```

## Running the Application

To start the server, run:

```bash
npm run dev
```

This will start the HTTP server on the port specified in your `.env` file.

## Database Setup

Ensure your PostgreSQL database is configured as per the settings in your `.env` file. Connect and set up necessary tables before starting the application.

## Usage

Once the server is running, you can access the web application by navigating to `http://localhost:<PORT>` in your web browser.


