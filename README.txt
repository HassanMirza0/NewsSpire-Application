
# News Application

This is a **News Application** project built using Node.js, Express, MongoDB, and various other libraries. The application allows users to register, login, reset their password, and fetch real-time news using the News API.

## Features
- **User Registration**: Users can sign up and create an account.
- **User Login**: Existing users can log in with their credentials.
- **Password Reset**: Functionality for users to reset their password if forgotten.
- **Session Management**: User sessions are managed using Express sessions.
- **Real-time News Fetching**: The app fetches real-time news data from the News API.
- **User Authentication**: Secure user authentication with password hashing using `bcryptjs`.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/news-application.git
   cd news-application
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file**:
   Add your MongoDB URL and session key in a `.env` file:
   ```env
   MONGO_URI=your-mongodb-url
   SESSION_SECRET=your-session-secret
   NEWS_API_KEY=your-news-api-key
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

## Dependencies

```json
"dependencies": {
  "axios": "^1.7.7",
  "bcryptjs": "^2.4.3",
  "connect-flash": "^0.1.1",
  "dotenv": "^16.4.5",
  "ejs": "^3.1.10",
  "express": "^4.21.0",
  "express-session": "^1.18.1",
  "git": "^0.1.5",
  "mongoose": "^8.7.1"
}
```

