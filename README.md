# Quiz Port Educational Platform

## Project Overview
Quiz Port is an educational platform designed to provide students with a user-friendly environment for practicing quizzes in various subjects. The platform aims to enhance the learning experience by offering features that promote engagement and knowledge retention.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Deployment:** Heroku, GitHub Actions for CI/CD

## Architecture
The architecture of Quiz Port follows a client-server model:
1. **Client Side:** Built with React.js to provide a dynamic user interface.
2. **Server Side:** Node.js and Express.js handle API requests and connect with the MongoDB database.
   - **Data Flow:** Client communicates with the server through RESTful API endpoints.

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/NaveenGEHU/QUIZ_PORT.git
   cd QUIZ_PORT
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory and define your variables.
4. **Run the application:**
   ```bash
   npm start
   ```
   The app will be running on `http://localhost:3000`.

## Implementation Guide
1. **Creating Quizzes:**
   - Navigate to the `Create Quiz` page from the dashboard.
   - Fill in the quiz title, description, and questions.
2. **Taking Quizzes:**
   - Select a quiz from the available list and click on `Start Quiz`.
   - Answer the questions and submit your results.
3. **Viewing Results:**
   - After submission, you can view the results and performance analytics.

For any issues or contributions, please open an issue or submit a pull request in this repository.
