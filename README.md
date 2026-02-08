# RoomMateX - Room & Roommate Discovery Platform

A modern, production-level room and roommate discovery platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

### User Features
- **Dashboard**: Dynamic dashboard with recommended rooms, roommates, and personalized sections
- **Find Rooms**: Browse and filter rooms by city, rent range, room type, and amenities
- **Room Details**: Comprehensive room information with image gallery, amenities, and owner contact
- **Roommate Profiles**: View detailed roommate profiles with preferences and interests
- **Wishlist**: Save favorite rooms for later viewing
- **List Rooms**: Full CRUD functionality for room listings
- **Profile Management**: Edit profile with completion score tracking
- **Contact**: Contact form for support inquiries

### Admin Features
- **Admin Dashboard**: Overview of platform statistics
- **Manage Users**: View, verify, and change user roles
- **Manage Rooms**: Activate/deactivate and remove room listings

### Technical Features
- ✅ Fully working navigation with React Router
- ✅ Context API for state management
- ✅ Protected routes with role-based access
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications
- ✅ Modal dialogs
- ✅ LocalStorage persistence
- ✅ Professional UI with Tailwind CSS

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

### Admin Account
- **Email**: admin@roomatex.com
- **Password**: admin123

### User Account
- **Email**: any valid email
- **Password**: any password

## 📁 Project Structure

```
roomatex/
├── src/
│   ├── admin/              # Admin pages
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageUsers.jsx
│   │   └── ManageRooms.jsx
│   ├── components/         # Reusable components
│   │   ├── ui/
│   │   │   ├── Toast.jsx
│   │   │   └── Modal.jsx
│   │   └── Navbar.jsx
│   ├── context/            # React Context
│   │   └── AuthContext.jsx
│   ├── data/               # Mock data
│   │   └── mockData.js
│   ├── pages/              # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── RoomsPage.jsx
│   │   ├── RoomDetailsPage.jsx
│   │   ├── RoommateProfilePage.jsx
│   │   ├── AddRoomPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── WishlistPage.jsx
│   │   └── ContactPage.jsx
│   ├── routes/             # Route protection
│   │   └── ProtectedRoute.jsx
│   ├── styles/             # Global styles
│   │   └── index.css
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### Colors
- **Primary**: Blue tones (#0ea5e9)
- **Secondary**: Teal/Emerald (#14b8a6)
- **Accent**: Amber (#f59e0b)
- **Background**: Off-white/Gray (#f9fafb)

### Typography
- **Display**: Poppins (headings, titles)
- **Body**: Inter (paragraphs, text)

## 🔄 User Flow

### Public Routes
1. **Landing Page** (`/`) - Marketing page with features and testimonials
2. **Login** (`/login`) - User authentication
3. **Signup** (`/signup`) - New user registration

### Protected Routes (Logged In)
1. **Dashboard** (`/dashboard`) - Personalized home with recommendations
2. **Find Rooms** (`/rooms`) - Browse and filter available rooms
3. **Room Details** (`/room/:id`) - Full room information
4. **Roommate Profile** (`/roommate/:id`) - View roommate details
5. **List Room** (`/add-room`) - Add new room listing
6. **Profile** (`/profile`) - User profile with tabs (Profile, Listings, Wishlist, Settings)
7. **Wishlist** (`/wishlist`) - Saved rooms
8. **Contact** (`/contact`) - Support contact form

### Admin Routes
1. **Admin Dashboard** (`/admin`) - Platform overview
2. **Manage Users** (`/admin/users`) - User management
3. **Manage Rooms** (`/admin/rooms`) - Room moderation

## ✨ Key Features

### Dynamic Dashboard Sections
- Recommended Rooms (always visible)
- Recommended Roommates (always visible)
- My Listings (conditional - only if user has listings)
- Recently Viewed (conditional - only if user has viewed rooms)
- Wishlist (conditional - only if user has wishlist items)

### Room Management (Full CRUD)
- ✅ **Create**: Add new room with validation (min 3 images)
- ✅ **Read**: View room details with gallery
- ✅ **Update**: Edit existing room listings
- ✅ **Delete**: Remove rooms with confirmation modal

### Profile Completion
- Tracks completion percentage based on:
  - Profile photo
  - Phone number
  - City
  - Room listings
  - Wishlist activity

## 🛠️ Technologies

- **Frontend**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3
- **State Management**: Context API
- **Storage**: LocalStorage

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Hamburger menu for mobile
- Optimized layouts for all screen sizes

## 🔒 Authentication

- Role-based access control (user, admin)
- Protected routes
- Public routes redirect to dashboard if authenticated
- LocalStorage persistence

## 🎯 Production Ready

- No broken links or dead buttons
- All routes fully functional
- Proper error handling
- Professional UI/UX
- Clean code structure
- Ready for deployment

## 📝 Notes

- All data is stored in browser LocalStorage
- Mock data includes 6 rooms and 6 roommates
- Contact form submissions show success message (no backend)
- Images use Unsplash and Pravatar for demo purposes

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ using React + Vite + Tailwind CSS**
