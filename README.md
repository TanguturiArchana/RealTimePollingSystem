# Real Time Polling Sytem
 An interactive full-stack web application that allows users to create polls, vote in real-time, and view instant results.
 
## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
## Features
- Create polls
- Vote in real-time
- View results immediately
- User authentication with JWT
- Responsive design for mobile & desktop

## Used Libraries and Dependencies
### Frontend
- axios : for making HTTP requests
- bootstrap & react-bootstrap : for responsive UI styling
- react-router-dom : for routing and navigation
- recharts : for rendering charts and graphs
- react-icons : for icons

### Backend
- express : to create API routes
- mongoose :  to connect and interact with MongoDB
- dotenv :  for managing environment variables
- cors : to enable cross-origin requests
- jsonwebtoken : for secure user authentication
- bcryptjs : for hashing passwords


 
##  Installation & Setup
### Frontend
- Create the React app
npx create-react-app realtimepollingsystem
- Navigate to the client folder
cd realtimepollingsystem
- Install required packages
npm install axios bootstrap react react-bootstrap react-dom react-icons react-router-dom react-scripts recharts
- Start the development server
npm start

### Backend
- Initialize the backend
npm init -y
- Install required packages
npm install express mongoose dotenv cors jsonwebtoken bcryptjs
- Start the server
node server.js

### Environment Variables
- Create a .env file in your backend root and include:
  - MONGO_URI=<your-mongodb-connection-string>
  - JWT_SECRET=<your-secret-key>
  - PORT=5000

### Running the Application Locally
- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:5000



### Deployment
To deploy the Real-Time Polling System on Render.com, follow these steps:
1. Push Code to GitHub
- Ensure your full-stack application (both frontend and backend) is committed and pushed to a GitHub repository.
2. Deploying the Backend (Node.js + Express)
- Log in to Render.com and click "New Web Service".
- Connect your GitHub repository when prompted.
- Fill out the deployment settings:
  - Name: Choose a name for your backend service.
  - Root Directory: The folder containing your backend code (e.g., server).
  - Build Command:
    - npm install
  - Start Command:
    - node server.js
- Add the following environment variables under Environment:
  - MONGO_URI – your MongoDB connection string
  - JWT_SECRET – secret key for JWT
  - PORT – port number (e.g., 5000)
- Click "Create Web Service" and wait for the build and deployment to complete. Once successful, you’ll see “Server is live.”
3. Deploying the Frontend (React)
- Before deploying, replace all instances of the local backend API (e.g., http://localhost:5000) with your deployed backend URL in the frontend code.
- On Render.com, choose "New Static Site".
- Fill out the deployment settings:
  - Name: Choose a name for your frontend site.
  - Root Directory: The folder containing your React frontend code (e.g., client).
  - Build Command:
   -  npm install && npm run build
  - Publish Directory:
    - ./build
- Click "Create Static Site" and wait for the build and deployment to complete.
- Once live, Render will provide a public URL where your frontend is hosted and connected to your backend.
  


