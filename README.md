# WingSearch Flight Search Application

# NOTE: GITHUB WILL CONTAIN ONLINE API CALLS WHILTE COURSEWORK SUBMISSION WILL CONTAIN LOCAL API CALLS
# EXAMPLE:
#      const response = await axios.get('http://localhost:3001/api/wishlist', {
#      const response = await axios.get('https://wingsearch.onrender.com/api/wishlist', {


A full-stack flight search application that allows users to search for flights, track flights, and maintain a wishlist of destinations.

# Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (Required for database management)
- A code editor (like [VS Code](https://code.visualstudio.com/))

# Project Structure

The project is divided into two main parts:
- `frontend/` - Frontend React application
- `backend/` - Backend Node.js server

# Setup Instructions
# .ENV File is not on github only submitted with coursework, github will not have .env and you will have to create your own database and api keys.

# 1. Install Required Software

1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - Follow the installation wizard
   - Verify installation by opening a terminal and running:
     CMD:

     node --version
     npm --version

2. Set up MongoDB Database
   You have two options:

   Option 1: MongoDB Atlas (Cloud Database)
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account
   - Create a new cluster (choose the free tier)
   - Set up database access (create a user with password)
   - Set up network access (allow access from anywhere or your IP)
   - Get your connection string from the "Connect" button
   - Use MongoDB Compass to connect to your cluster using the connection string

   Option 2: Local MongoDB
   - Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Follow the installation wizard
   - MongoDB will run as a service on your computer
   - Use MongoDB Compass to connect to localhost:27017

3. Download and install MongoDB Compass from [mongodb.com](https://www.mongodb.com/try/download/compass)
   - This is a GUI tool that helps you:
     - Connect to your MongoDB database (local or cloud)
     - View and manage your databases
     - Debug database operations
     - Monitor database performance
     - Create and manage indexes

# 2. Setup Backend

1. Navigate to the backend folder e.g:
   
   CMD:
   cd documents/wingsearch/backend


2. Install dependencies:
   CMD:
   npm install
   

3. Create a `.env` file in the backend folder with the following content:
   ```
   # For MongoDB Atlas (Cloud)
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/wingsearch?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   RAPIDAPI_KEY=your_rapidapi_key
   PORT=3001
   ```

   Note: You'll need to:
   - Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials
   - Get a RapidAPI key from [RapidAPI](https://rapidapi.com/)
   - Create a JWT secret key (can be any random string)

4. Start the backend server:
   CMD:
   node server.js
   
   The server should start on http://localhost:3001

# 3. Setup Frontend

1. Open a new terminal and navigate to the wingsearch folder e.g: 
   CMD:
   cd documents/wingsearch/frontend
   

2. Install dependencies:
   CMD:
   npm install
   

3. Start the development server:
   CMD:
   npm run dev
   
   The frontend should start on http://localhost:5173


# API Keys

This application uses the following APIs:
- Booking Flight Search API from RapidAPI
- Flight Radar API from RapidAPI


# Troubleshooting

Common issues and solutions:

1. MongoDB Connection Error
   - Ensure MongoDB service is running
   - Check if the MongoDB URI in `.env` is correct
   - Verify MongoDB is installed correctly

2. API Errors
   - Verify your RapidAPI key is correct
   - Check if you're subscribed to the required APIs
   - Ensure you haven't exceeded API rate limits

3. Frontend Not Loading
   - Check if the backend server is running
   - Verify all dependencies are installed
   - Clear browser cache and reload

4. Authentication Issues
   - Ensure JWT_SECRET is set in `.env`
   - Check if MongoDB is running
   - Verify user data is being saved correctly

# Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure all environment variables are set correctly
4. Check if both frontend and backend servers are running


