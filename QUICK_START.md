# RoomMateX - Quick Start Guide

## Installation & Setup (3 Steps)

### Step 1: Install Dependencies
```bash
cd roomatex
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to: `http://localhost:3000`

---

## Demo Credentials

### Admin Login
- **Email**: `admin@roomatex.com`
- **Password**: `admin123`
- **Access**: Full admin panel, user management, room management

### Regular User Login
- **Email**: Any valid email (e.g., `user@test.com`)
- **Password**: Any password (e.g., `password`)
- **Access**: User dashboard, browse rooms, add listings, wishlist

---

## Key Features to Test

### As a User:
1. **Dashboard** - View recommended rooms and roommates
2. **Browse Rooms** - Filter by city, rent, amenities
3. **Room Details** - View full details, add to wishlist, contact owner
4. **List a Room** - Add your own room listing (min 3 images required)
5. **Profile** - Edit profile, view listings, manage wishlist
6. **Roommate Profiles** - View detailed roommate information

### As an Admin:
1. **Admin Dashboard** - View platform statistics
2. **Manage Users** - Verify users, change roles
3. **Manage Rooms** - Activate/deactivate or delete listings

---

## Test Scenarios

### Scenario 1: New User Journey
1. Go to landing page (`/`)
2. Click "Sign Up"
3. Register with any credentials
4. Explore dashboard with recommendations
5. Browse rooms using filters
6. Add a room to wishlist
7. View room details and contact owner

### Scenario 2: Room Owner Journey
1. Login as user
2. Go to "List Room"
3. Fill form with minimum 3 image URLs (use Unsplash)
4. Submit room listing
5. See listing in Dashboard → "My Listings"
6. Edit or delete the listing
7. View in "Find Rooms"

### Scenario 3: Admin Journey
1. Login with admin credentials
2. View admin dashboard stats
3. Go to "Manage Users"
4. Verify a user account
5. Change user role
6. Go to "Manage Rooms"
7. Activate/deactivate rooms
8. Delete a room listing

---

## Sample Image URLs for Testing

Use these Unsplash URLs when adding rooms:

```
https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800
https://images.unsplash.com/photo-1502672260066-6bc35f0a1ec1?w=800
https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800
https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800
https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800
```

---

## Quick Navigation

### Public Pages (No Login Required)
- `/` - Landing Page
- `/login` - Login
- `/signup` - Signup

### User Pages (Login Required)
- `/dashboard` - User Dashboard
- `/rooms` - Browse Rooms
- `/room/:id` - Room Details
- `/roommate/:id` - Roommate Profile
- `/add-room` - List New Room
- `/profile` - User Profile
- `/wishlist` - Saved Rooms
- `/contact` - Contact Support

### Admin Pages (Admin Only)
- `/admin` - Admin Dashboard
- `/admin/users` - Manage Users
- `/admin/rooms` - Manage Rooms

---

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or specify a different port
npm run dev -- --port 3001
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Browser Not Opening Automatically
Manually navigate to: `http://localhost:3000`

---

## Mobile Testing

The app is fully responsive. To test on mobile:
1. Start dev server: `npm run dev`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On mobile browser: `http://YOUR_IP:3000`

Or use Chrome DevTools:
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select mobile device

---

## Customization Tips

### Change Colors
Edit `tailwind.config.js` → `theme.extend.colors`

### Change Fonts
Edit `index.html` → Google Fonts link
Edit `tailwind.config.js` → `fontFamily`

### Add More Mock Data
Edit `src/data/mockData.js`

---

## Build for Production

```bash
npm run build
```

Output: `dist/` folder ready for deployment

Preview production build:
```bash
npm run preview
```

---

## Verification Checklist

- [ ] All pages load without errors
- [ ] Login/Signup works
- [ ] Dashboard shows dynamic content
- [ ] Room filtering works
- [ ] Wishlist add/remove works
- [ ] Room CRUD operations work
- [ ] Profile editing works
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] No console errors

---

## Tips

1. **LocalStorage**: All data is saved in browser LocalStorage
2. **Mock Data**: Pre-loaded with 6 rooms and 6 roommates
3. **No Backend**: Everything runs client-side
4. **Images**: Uses Unsplash and Pravatar for demos
5. **Production Ready**: Clean code, no broken links

---

**Need Help?** Check the main README.md for full documentation.

**Ready to Deploy?** Run `npm run build` and deploy the `dist` folder to any static hosting (Vercel, Netlify, GitHub Pages).
