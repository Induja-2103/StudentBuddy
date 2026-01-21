# 🚀 Quick Start Guide - StudentBuddy

## Prerequisites Check
- [ ] Node.js installed (v16+)
- [ ] MongoDB installed or Atlas account
- [ ] Gemini API key obtained
- [ ] Email account for notifications (Gmail recommended)

## 5-Minute Setup

### Step 1: Install Dependencies (3 minutes)

Open PowerShell in the StudentBuddy directory:

```powershell
# Backend
cd backend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install

# Frontend  
cd ..\frontend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install

# Database
cd ..\db
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install

cd ..
```

### Step 2: Configure Environment (1 minute)

```powershell
cd backend
copy .env.example .env
notepad .env
```

**Minimum required configuration:**
```env
GEMINI_API_KEY=your_actual_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/studentbuddy
JWT_SECRET=change_this_to_random_string_min_32_chars
```

### Step 3: Start the Application (1 minute)

**Terminal 1 - Backend:**
```powershell
cd backend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

**Terminal 3 - MongoDB (if local):**
```powershell
mongod
```

### Step 4: Access the App

Open browser: `http://localhost:3000`

## First Login

Since there are no users yet, you can:

1. **Click "Sign up"** to create a student account
2. **Or** create a SuperAdmin via MongoDB:

```javascript
// In MongoDB Compass or mongosh
use studentbuddy

// First, hash a password using bcrypt (use an online tool or Node.js)
// For "admin123", the hash might look like: $2a$10$...

db.users.insertOne({
  email: "admin@studentbuddy.com",
  password_hash: "$2a$10$YourBcryptHashHere",
  full_name: "Super Admin",
  role: "SuperAdmin",
  is_active: true,
  created_at: new Date()
})
```

## Testing the Features

### As a Student:
1. Sign up with email/password
2. View dashboard (stats will be 0 initially)
3. Navigate to "My Mentors" (placeholders for now)
4. Navigate to "Tests" (placeholders for now)

### As an Admin:
1. Login with admin credentials
2. Access `/admin` route
3. Manage users, tests, and mentors

## Common Issues

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas and update `MONGODB_URI`

### "Gemini API error"
- Verify your API key is correct
- Check you have API quota remaining

### "Port already in use"
- Change `PORT` in backend `.env`
- Change `port` in frontend `vite.config.js`

### PowerShell execution policy
- Always use: `node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"`
- Or run as admin: `Set-ExecutionPolicy RemoteSigned`

## What's Working Right Now

✅ **Backend API** - All endpoints functional
✅ **Authentication** - Login/Signup/Password Reset
✅ **Database** - All schemas ready
✅ **Custom Cursor** - Animated cursor on all pages
✅ **Design System** - Premium iOS-inspired UI
✅ **Login Page** - Fully functional with glassmorphism

## What Needs Implementation

⏳ **Test UI** - Taking tests, viewing results
⏳ **Chat UI** - Real-time mentor chat interface
⏳ **Admin UI** - User/test/mentor management panels
⏳ **Analytics** - Charts and performance graphs
⏳ **Todo Widget** - Task management interface

## Development Workflow

1. **Backend changes**: Edit files in `backend/`, server auto-restarts
2. **Frontend changes**: Edit files in `frontend/src/`, hot-reload active
3. **Database changes**: Edit schemas in `db/models/`, restart backend

## Useful Commands

```powershell
# Backend
cd backend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev    # Development
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" start      # Production

# Frontend
cd frontend
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev    # Development
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build  # Production build
```

## Next Steps

1. **Explore the codebase** - Check `PROJECT_SUMMARY.md`
2. **Read the README** - Full documentation available
3. **Start building** - Implement remaining UI pages
4. **Test features** - Use Postman for API testing
5. **Customize** - Modify colors, add features

## Getting Help

- Check `README.md` for detailed documentation
- Review `PROJECT_SUMMARY.md` for implementation status
- Check backend console for API errors
- Check browser console for frontend errors

---

**Ready to build! 🚀**

The foundation is complete. Now it's time to implement the remaining UI pages and bring the full vision to life!
