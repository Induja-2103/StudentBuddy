# 🎓 StudentBuddy - AI-Powered Mentorship Platform

StudentBuddy is a comprehensive, multi-role application providing AI-powered mentorship to students through Google's Gemini Pro, along with assessment tools and performance tracking.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Student, Admin, SuperAdmin)
- Password reset with email verification
- OAuth support (Google, GitHub) - Ready for integration

### 👨‍🎓 Student Features
- **Dashboard**: Real-time stats, notifications, and quick actions
- **AI Mentors**: Activate and chat with personalized AI mentors powered by Gemini Pro
- **Tests**: Take timed assessments with auto-grading
- **Analytics**: Detailed performance tracking and subject-wise analysis
- **Todo List**: Task management with priority levels
- **Custom Animated Cursor**: Premium UI experience

### 👨‍💼 Admin Features
- User management (Create, Delete, Reset passwords)
- Test creation and bulk upload (Excel/CSV)
- AI Mentor configuration
- Student performance monitoring

### 🎨 Design
- iOS-inspired UI with glassmorphism
- Gradient animations and smooth transitions
- Custom animated cursor
- Fully responsive design
- Dark mode ready

## 🛠️ Tech Stack

### Frontend
- **React** 18 with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Socket.io-client** for real-time chat
- **Axios** for API calls
- **Vanilla CSS** with CSS custom properties

### Backend
- **Node.js** & **Express.js**
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Multer** for file uploads
- **XLSX** for Excel parsing

### Database
- **MongoDB** with Mongoose ODM
- Optimized schemas with indexing
- TTL indexes for temporary data

### AI
- **Google Gemini Pro** for AI mentorship
- Dedicated 1:1 chat sessions
- Context-aware responses

## 📁 Project Structure

```
StudentBuddy/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   │   └── UI/
│   │   │       └── AnimatedCursor.jsx
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Test/
│   │   │   ├── Mentor/
│   │   │   ├── Details/
│   │   │   └── Admin/
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/            # Express server
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── testRoutes.js
│   │   ├── mentorRoutes.js
│   │   ├── todoRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── services/
│   │   ├── aiService.js
│   │   └── emailService.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── db/                 # Database schemas
    ├── models/
    │   ├── User.js
    │   ├── StudentProfile.js
    │   ├── Test.js
    │   ├── TestAttempt.js
    │   ├── MentorMaster.js
    │   ├── UserMentor.js
    │   ├── ChatHistory.js
    │   ├── ActivationCode.js
    │   ├── Notification.js
    │   └── Todo.js
    ├── connect.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd StudentBuddy
   ```

2. **Install dependencies for all modules**:

   **Note**: Due to PowerShell execution policy restrictions, use the full node path:

   ```powershell
   # Backend
   cd backend
   node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
   
   # Frontend
   cd ../frontend
   node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
   
   # Database
   cd ../db
   node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
   
   cd ..
   ```

3. **Set up environment variables**:

   Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   copy .env.example .env
   ```

   Edit `.env` and add your configuration:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/studentbuddy
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   GEMINI_API_KEY=your_gemini_api_key_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Start MongoDB**:
   - If using local MongoDB, ensure it's running
   - If using MongoDB Atlas, update the `MONGODB_URI` in `.env`

### Running the Application

You'll need **three terminal windows**:

#### Terminal 1 - Backend Server
```powershell
cd backend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```
Server will run on `http://localhost:5000`

#### Terminal 2 - Frontend Development Server
```powershell
cd frontend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```
Frontend will run on `http://localhost:3000`

#### Terminal 3 - MongoDB (if running locally)
```powershell
mongod
```

### First Time Setup

1. **Create a SuperAdmin user** (via MongoDB or a seed script):
   ```javascript
   // You can use MongoDB Compass or mongosh
   use studentbuddy
   db.users.insertOne({
     email: "admin@studentbuddy.com",
     password_hash: "$2a$10$...", // Use bcrypt to hash "admin123"
     full_name: "Super Admin",
     role: "SuperAdmin",
     is_active: true,
     created_at: new Date()
   })
   ```

2. **Create sample mentors** via the Admin panel or directly in MongoDB

3. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Register new student
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code

### Student Endpoints
- `GET /api/student/dashboard` - Get dashboard data
- `GET /api/student/analytics` - Get detailed analytics
- `GET /api/student/notifications` - Get notifications
- `PUT /api/student/notifications/:id/read` - Mark notification as read

### Test Endpoints
- `GET /api/test/active` - Get active tests
- `POST /api/test/:id/start` - Start a test
- `POST /api/test/:attemptId/submit` - Submit test answers
- `GET /api/test/:attemptId/results` - Get test results

### Mentor Endpoints
- `GET /api/mentor/available` - Get available mentors
- `GET /api/mentor/activated` - Get activated mentors
- `POST /api/mentor/register` - Request mentor activation
- `POST /api/mentor/activate` - Activate mentor with code
- `POST /api/mentor/chat/:sessionId/message` - Send message to mentor
- `GET /api/mentor/chat/:sessionId/history` - Get chat history

### Todo Endpoints
- `GET /api/todo` - Get all todos
- `POST /api/todo` - Create todo
- `PUT /api/todo/:id` - Update todo
- `PUT /api/todo/:id/toggle` - Toggle completion
- `DELETE /api/todo/:id` - Delete todo

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/reset-password` - Reset user password
- `POST /api/admin/users/create-admin` - Create admin (SuperAdmin only)
- `GET /api/admin/tests` - Get all tests
- `POST /api/admin/tests` - Create test
- `POST /api/admin/tests/bulk-upload` - Bulk upload tests
- `GET /api/admin/mentors` - Get all mentors
- `POST /api/admin/mentors` - Create mentor

## 🎨 Customization

### Changing Colors
Edit `frontend/src/index.css` and modify the CSS custom properties:
```css
:root {
  --primary-hue: 240;  /* Change this for different primary color */
  --primary-sat: 85%;
  --primary-light: 58%;
}
```

### Adding New Pages
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Create corresponding API route in `backend/routes/`

## 🔒 Security Notes

- Always use HTTPS in production
- Change `JWT_SECRET` to a strong random string
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Validate all user inputs
- Use prepared statements for database queries

## 🐛 Troubleshooting

### PowerShell Execution Policy Error
If you get execution policy errors, use the full node path:
```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" <command>
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### Gemini API Error
- Verify your API key is correct
- Check API quota limits
- Ensure proper internet connectivity

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI**
