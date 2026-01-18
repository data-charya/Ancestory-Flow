# 🌳 Ancestry Flow

A beautiful family tree visualization application built with React and PostgreSQL (Aiven).

![Family Tree](https://img.shields.io/badge/React-18-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Aiven-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **Interactive Family Tree** - Visual tree with dotted connection lines
- **Fullscreen Presentation Mode** - Cinema-style slideshow through generations
- **Auto-Animation** - Automatically cycles through generations every 5 seconds
- **CRUD Operations** - Add, edit, and delete family members
- **Demo Data** - One-click loading of sample family tree
- **Responsive Design** - Works on desktop and mobile
- **PostgreSQL Backend** - Persistent storage with Aiven cloud database

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL Database** - [Aiven](https://aiven.io/) (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ancestry-flow.git
cd ancestry-flow
```

### 2. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for the root, backend, and frontend.

### 3. Configure Database

Create a `.env` file in the `backend` folder:

```bash
# backend/.env
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=5432
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=your-password
```

### 4. Run the Application

```bash
npm run dev
```

This starts both servers:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 📖 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run client` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run build` | Build frontend for production |
| `npm run install:all` | Install all dependencies |

## 🎮 Usage

### Tree View
- Click on any family member to edit their details
- Use the **Add Member** button to add new family members
- Set parent relationships in the edit form

### Presentation Mode
1. Click **Presentation** button in the header
2. App enters fullscreen with dark theme
3. Generations auto-cycle every 5 seconds
4. Use controls at bottom to navigate:
   - ◀ Previous generation
   - ▶/❚❚ Play/Pause
   - ▶ Next generation
5. Press **ESC** or click **X** to exit

### Demo Data
- If database is empty, click **Load Demo Data** to populate sample family

## 📁 Project Structure

```
ancestry-flow/
├── backend/
│   ├── server.js          # Express API server
│   ├── schema.sql          # Database schema
│   ├── api/
│   │   └── index.js        # Vercel serverless function
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # API service layer
│   │   ├── components/     # React components
│   │   ├── config/         # App configuration
│   │   ├── data/           # Demo data
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.jsx         # Main app component
│   │   └── index.jsx       # Entry point
│   └── package.json
├── package.json            # Root package with dev scripts
├── vercel.json             # Vercel deployment config
└── README.md
```

## 🌐 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
4. Click **Deploy**

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Aiven)
- **Deployment**: Vercel

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members?userId=X` | Get all members for user |
| GET | `/api/members/:id` | Get single member |
| POST | `/api/members` | Create new member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member |
| GET | `/api/health` | Health check |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using React and PostgreSQL

