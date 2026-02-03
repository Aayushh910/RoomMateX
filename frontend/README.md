# RoomMateX - Room & Roommate Discovery Platform

A modern, production-ready room and roommate discovery platform built with React, Vite, and Tailwind CSS.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Public Routes**: Landing page, Login, Signup (auto-redirect if logged in)
- **Protected Routes**: Full authentication guard
- **Role-Based Access**: Seeker, Owner, and Admin roles with specific permissions

### 👤 User Roles

#### Room Seeker
- Browse and search verified rooms
- Advanced filtering (city, rent, gender, amenities)
- Wishlist functionality
- Message owners
- Leave reviews

#### Room Owner
- List rooms with comprehensive details
- Photo gallery (min 3, max 10 images)
- View potential roommates
- Manage listings
- Respond to inquiries

#### Admin
- User management dashboard
- Room moderation
- Report handling system
- Analytics and insights
- Platform-wide controls

### 🏠 Core Features
- **Room Discovery**: Advanced search and filtering
- **Verified Listings**: Trust badges and verification system
- **Reviews & Ratings**: User and room reviews
- **Trust & Safety**: Report system for users and rooms
- **Responsive Design**: Mobile-first, fully responsive UI
- **Modern UX**: Loading states, empty states, animations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
roomatex/
├── src/
│   ├── admin/              # Admin pages
│   │   ├── AdminUsers.jsx
│   │   ├── AdminRooms.jsx
│   │   └── AdminReports.jsx
│   ├── components/         # Reusable components
│   │   └── ui/            # UI components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       ├── Badge.jsx
│   │       ├── Alert.jsx
│   │       ├── Modal.jsx
│   │       ├── Loader.jsx
│   │       └── EmptyState.jsx
│   ├── context/           # React contexts
│   │   └── AuthContext.jsx
│   ├── data/              # Mock data
│   │   ├── rooms.js
│   │   ├── reviews.js
│   │   └── admin.js
│   ├── layouts/           # Layout components
│   │   ├── Navbar.jsx
│   │   └── MainLayout.jsx
│   ├── pages/             # Application pages
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Rooms.jsx
│   │   ├── RoomDetails.jsx
│   │   ├── AddRoom.jsx
│   │   ├── Profile.jsx
│   │   ├── Messages.jsx
│   │   ├── Reviews.jsx
│   │   ├── Wishlist.jsx
│   │   ├── Info.jsx
│   │   └── NotFound.jsx
│   ├── routes/            # Route guards
│   │   ├── PrivateRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   └── RoleRoute.jsx
│   ├── styles/            # Global styles
│   │   └── index.css
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🎨 Design System

### Colors
- **Primary**: Light Green (#22c55e)
- **Dark**: Neutral grays for text and UI elements
- **Semantic**: Success (green), Warning (yellow), Danger (red), Info (blue)

### Typography
- **Display Font**: Clash Display (headings)
- **Body Font**: DM Sans (content)

### Components
- Consistent card-based layouts
- Soft shadows and rounded corners
- Smooth animations and transitions
- Professional color palette

## 🔑 Demo Credentials

```javascript
// Seeker Account
Email: seeker@test.com
Password: password

// Owner Account
Email: owner@test.com
Password: password

// Admin Account
Email: admin@test.com
Password: password
```

## 🛣️ Route Structure

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (All Users)
- `/dashboard` - Role-based dashboard
- `/rooms` - Browse rooms (Seeker)
- `/room/:id` - Room details
- `/profile` - User profile
- `/messages` - Chat/messages
- `/reviews` - Reviews
- `/wishlist` - Saved rooms
- `/info` - Info/FAQ

### Owner Routes
- `/add-room` - Create new listing

### Admin Routes
- `/admin/users` - User management
- `/admin/rooms` - Room management
- `/admin/reports` - Handle reports

## 🎯 Key Features Implementation

### Trust & Safety System
- User verification badges
- Report functionality for rooms and users
- Trust score system
- Review moderation (admin)

### UX Polish
- **Loading States**: Skeleton screens, spinners
- **Empty States**: Helpful messages when no data
- **Status Alerts**: Success, error, warning notifications
- **Animations**: Smooth transitions and micro-interactions

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Adaptive layouts

## 🔧 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Local Storage** - Data persistence

## 📱 Features by Page

### Landing Page
- Hero with typing animation
- Feature showcase
- Demo room cards
- Testimonials
- FAQ section
- Footer

### Dashboard
- Role-specific content
- Quick stats
- Recommended rooms (Seeker)
- Potential roommates (Owner)
- Admin analytics (Admin)

### Room Listing
- Advanced filters
- Sort options
- Grid/list views
- Pagination ready

### Room Details
- Image gallery
- Full description
- Amenities list
- House rules
- Owner profile
- Reviews section
- Wishlist toggle
- Report functionality

### Profile
- View/edit mode
- Trust score display
- Activity stats
- Settings

### Admin Dashboard
- User management
- Room moderation
- Report handling
- Analytics

## 🚧 Future Enhancements

- Real-time messaging
- Payment integration
- Email notifications
- Advanced search filters
- Map integration
- Photo verification
- Calendar for availability
- Mobile app

## 📄 License

This is a portfolio/educational project.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

---

Built with ❤️ using React, Vite, and Tailwind CSS
