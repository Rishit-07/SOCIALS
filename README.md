# ⚡ Socials — Gamified Social Productivity Platform

> **Make consistency a competition.**
> Socials turns your goals into shared challenges. Create, compete, check in daily, and watch your profile card evolve as you win.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Gamification System](#gamification-system)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)

---

## 🧠 Overview

Socials is a full-stack MERN social productivity app where users create short-term challenges, invite friends to compete, and stay consistent through daily check-ins, streaks, and a live leaderboard.

Unlike traditional productivity tools that are solo experiences, Socials makes accountability a shared, competitive, and rewarding experience.

**The goal is simple: make people more consistent by making them less alone.**

---

## ✨ Features

### 🎯 Core
- **Create Challenges** — Set a goal with a title, description, category, duration (3–30 days), and start date
- **Public & Private Challenges** — Public challenges are open to all; private ones require owner approval to join
- **Invite Code System** — Every challenge gets a unique 6-character invite code to share with friends
- **Daily Check-ins** — Users check in once per day with an optional note to maintain their streak
- **Auto Check-in for Owners** — Challenge creators are automatically added as participants

### 🏆 Gamification
- **Streak Tracking** — Consecutive daily check-ins build your streak
- **Live Leaderboard** — Participants ranked by streak count in real time
- **5 Rarity Tiers** — Common → Rare → Epic → Legendary → Mythic
- **Holographic Profile Card** — 3D tilt card that evolves visually based on your rarity tier
- **Badge System** — 9 unique badges to earn based on your activity and achievements
- **Rarity Engine** — Auto-calculates your card rarity based on wins, rewards, and streaks

### 👥 Social
- **Real-time Group Chat** — Socket.io powered chat inside every challenge
- **Community Page** — Browse all challenges, global leaderboard, and recent activity
- **Join Requests** — Challenge owners can approve or reject join requests for private challenges
- **Leave Challenge** — Participants can leave challenges they've joined

### 🔔 Notifications
- **Check-in Notifications** — Confirmation when you successfully check in
- **Daily Reminders** — Alerts if you haven't checked in today
- **Missed Check-in Alerts** — Notified when you miss a day
- **Unread Badge** — Bell icon in dock shows unread notification count

### 👤 Profile
- **Editable Profile** — Update display name, role/title, and avatar
- **3D Profile Card** — Interactive holographic card with pointer tilt and shimmer
- **Badge Showcase** — View all badges, see tasks to unlock them, claim earned ones
- **Challenge Management** — View and delete your created challenges

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Framer Motion, GSAP |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcryptjs |
| **Real-time** | Socket.io |
| **Styling** | CSS, Inline Styles |
| **Animations** | Framer Motion, GSAP, OGL (Particles) |
| **File Upload** | Multer |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
socials/
├── client/                          # React Frontend
│   └── src/
│       ├── api/
│       │   └── axios.js             # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── CardSwap.js          # GSAP card swap animation
│       │   ├── Dock.js              # macOS-style dock
│       │   ├── DockNav.js           # Navigation dock with notification badge
│       │   ├── DrawOutlineButton.js # Animated outline button
│       │   ├── Particles.js         # OGL WebGL particle system
│       │   ├── ProfileCard.js       # Holographic 3D profile card
│       │   ├── TextType.js          # Typewriter effect component
│       │   └── *.css                # Component styles
│       ├── config/
│       │   └── badges.js            # Badge definitions and unlock conditions
│       ├── context/
│       │   └── AuthContext.js       # Global auth state
│       └── pages/
│           ├── Landing.js           # Home page with particles + typewriter
│           ├── About.js             # About page with CardSwap feature showcase
│           ├── Login.js             # Login form
│           ├── Register.js          # Register form
│           ├── Dashboard.js         # Main dashboard with challenges
│           ├── ChallengeDetail.js   # Challenge page with tabs
│           ├── CreateChallenge.js   # Challenge creation form
│           ├── Community.js         # Community leaderboard + browse
│           ├── Profile.js           # User profile with badges
│           ├── EditProfile.js       # Edit profile with tabs
│           └── Notifications.js     # Notification center
│
└── server/                          # Express Backend
    ├── models/
    │   ├── user.js                  # User schema with rarity fields
    │   ├── challenge.js             # Challenge schema
    │   ├── participant.js           # Participant schema with status
    │   ├── checkin.js               # Daily check-in schema
    │   ├── reward.js                # Reward/badge schema
    │   └── notification.js          # Notification schema
    ├── controllers/
    │   ├── authController.js        # Register, login
    │   ├── challengeController.js   # CRUD + join + delete
    │   ├── participantController.js # Approve, reject, leaderboard, leave
    │   ├── checkinController.js     # Daily check-in logic
    │   ├── rewardController.js      # Reward management
    │   └── notificationController.js # Notification generation + delivery
    ├── routes/
    │   ├── auth.js
    │   ├── challenge.js
    │   ├── participant.js
    │   ├── checkin.js
    │   ├── reward.js
    │   ├── notification.js
    │   └── user.js                  # Profile + stats + badge claim
    ├── middleware/
    │   └── auth.js                  # JWT protect middleware
    ├── utils/
    │   └── rarityEngine.js          # Auto rarity calculation engine
    ├── uploads/                     # Avatar image storage
    └── server.js                    # Entry point + Socket.io setup
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/socials.git
cd socials
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/socials
JWT_SECRET=your_super_secret_key
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd client
npm install
npm start
```

The app will be running at `http://localhost:3000`

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token signing |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login and get token | ❌ |

### Challenges
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/challenges` | Get all challenges | ❌ |
| GET | `/api/challenges/:id` | Get single challenge | ❌ |
| POST | `/api/challenges` | Create challenge | ✅ |
| POST | `/api/challenges/join` | Join via invite code | ✅ |
| DELETE | `/api/challenges/:id` | Delete challenge | ✅ |

### Participants
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/participants/:challengeId` | Get all participants | ❌ |
| GET | `/api/participants/:challengeId/leaderboard` | Get leaderboard | ❌ |
| GET | `/api/participants/:challengeId/pending` | Get pending requests | ✅ |
| PUT | `/api/participants/:id/approve` | Approve participant | ✅ |
| PUT | `/api/participants/:id/reject` | Reject participant | ✅ |
| DELETE | `/api/participants/:challengeId/leave` | Leave challenge | ✅ |

### Check-ins
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/checkins` | Submit daily check-in | ✅ |
| GET | `/api/checkins/:challengeId` | Get check-in history | ❌ |

### Rewards
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/rewards` | Get user rewards | ✅ |
| POST | `/api/rewards/assign` | Assign reward | ✅ |

### Notifications
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/notifications` | Get all notifications | ✅ |
| PUT | `/api/notifications/:id/read` | Mark as read | ✅ |
| PUT | `/api/notifications/read-all` | Mark all as read | ✅ |

### User
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/profile` | Get profile + update rarity | ✅ |
| PUT | `/api/users/profile` | Update name, role, avatar | ✅ |
| GET | `/api/users/stats` | Get user stats for badges | ✅ |
| POST | `/api/users/claim-badge` | Claim an earned badge | ✅ |

---

## 🎮 Gamification System

### Card Rarity Tiers

| Tier | Visual | Requirement |
|---|---|---|
| ⭐ Common | Silver stars | Default |
| ⚡ Rare | Blue lightning | 3+ completed challenges |
| 🔥 Epic | Red/orange flames | 7+ rewards earned |
| 👑 Legendary | Golden crowns | 3+ challenge wins |
| ✦ Mythic | Purple runes | 5+ wins AND 10+ day streak |

### Badge System

| Badge | Icon | Requirement |
|---|---|---|
| First Step | ✅ | Complete first check-in |
| On Fire | 🔥 | 3-day streak |
| Week Warrior | ⚡ | 7-day streak |
| First Blood | 🏆 | Win first challenge |
| Social Butterfly | 🦋 | Join 3 challenges |
| Challenge Creator | ⚙️ | Create first challenge |
| Diamond Hands | 💎 | 30-day streak |
| Triple Crown | 👑 | Win 3 challenges |
| Mythic Legend | ✦ | Win 5 challenges + 10-day streak |

### Rarity Auto-Calculation
The rarity engine runs automatically whenever:
- A reward is assigned
- A profile is fetched
- A badge is claimed

---

## 🗺 Roadmap

- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Challenge templates
- [ ] Team challenges
- [ ] Public profile pages
- [ ] Challenge end auto-detection and winner announcement
- [ ] Streak freeze power-ups
- [ ] Dark/Light theme toggle

---

## 👨‍💻 Author

Built by **Sai Rishit Sunku** — a solo developer project built with React, Node.js, MongoDB, Socket.io, Framer Motion, and GSAP.

---

> *"Make people more consistent by making them less alone."*