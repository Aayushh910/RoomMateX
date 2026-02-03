# RoomMateX - Setup & Installation Guide

## 📦 Quick Setup

1. **Extract the project folder** to your preferred location

2. **Navigate to the project directory**:
   ```bash
   cd roomatex
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and visit: `http://localhost:5173`

## 🎯 First Steps

### 1. Login with Demo Accounts

Use these credentials to explore different user roles:

**Room Seeker:**
- Email: `seeker@test.com`
- Password: `password`

**Room Owner:**
- Email: `owner@test.com`
- Password: `password`

**Admin:**
- Email: `admin@test.com`
- Password: `password`

### 2. Explore Features

**As a Seeker:**
1. Browse rooms on the Dashboard
2. Use filters to find specific rooms
3. Click on any room to view details
4. Add rooms to wishlist
5. View your profile and reviews

**As an Owner:**
1. Click "List Room" to add a new room
2. Fill in all details and upload at least 3 photos
3. View potential roommates on the Dashboard
4. Manage your listings

**As an Admin:**
1. Access admin dashboard
2. Manage users and rooms
3. Handle reports
4. View platform analytics

## 🏗️ Project Architecture

### Component Structure
```
UI Components (src/components/ui/)
├── Button.jsx          - Reusable button with variants
├── Input.jsx           - Form input with label and error handling
├── Card.jsx            - Container with hover effects
├── Badge.jsx           - Status badges
├── Alert.jsx           - Notification alerts
├── Modal.jsx           - Modal dialogs
├── Loader.jsx          - Loading states and skeletons
└── EmptyState.jsx      - Empty state messages
```

### Authentication Flow
```
1. User visits Landing page (/)
2. Clicks Login/Signup
3. After authentication -> Redirects to /dashboard
4. Can never access landing page again while logged in
5. Protected routes check authentication
6. Role routes check user role permissions
```

### Routing Guard System
```
PublicRoute (/, /login, /signup)
└── If authenticated -> Redirect to /dashboard

PrivateRoute (All app pages)
└── If not authenticated -> Redirect to /login

RoleRoute (Owner/Admin pages)
└── If wrong role -> Redirect to /dashboard
```

## 🎨 Customization Guide

### Changing Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change these hex values
    500: '#22c55e',
    600: '#16a34a',
    // ...
  }
}
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/layouts/Navbar.jsx`

Example:
```jsx
// In App.jsx
<Route path="/new-page" element={
  <PrivateRoute>
    <NewPage />
  </PrivateRoute>
} />
```

### Modifying Dummy Data

Edit files in `src/data/`:
- `rooms.js` - Room listings
- `reviews.js` - User reviews
- `admin.js` - Admin statistics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist` folder with optimized files.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## 🐛 Troubleshooting

### Issue: "npm install" fails
**Solution**: Make sure you have Node.js 16+ installed
```bash
node --version  # Should be 16 or higher
```

### Issue: Port 5173 already in use
**Solution**: Kill the process or use a different port
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue: Styles not loading
**Solution**: Make sure Tailwind is properly configured
```bash
# Rebuild
rm -rf node_modules
npm install
npm run dev
```

### Issue: Images not loading
**Solution**: Check your internet connection (images are from external URLs)

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## 🔧 Development Tips

### Hot Module Replacement
Vite provides instant HMR. Save any file and see changes immediately.

### React DevTools
Install React DevTools browser extension for better debugging.

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

## 📚 Learning Resources

### React
- [Official React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)

### Vite
- [Vite Docs](https://vitejs.dev)

## 🎓 Code Examples

### Creating a New Component
```jsx
// src/components/ui/NewComponent.jsx
export const NewComponent = ({ children, variant = 'default' }) => {
  return (
    <div className={`base-styles ${variant}`}>
      {children}
    </div>
  );
};
```

### Using Context
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, logout } = useAuth();
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Protected Route Example
```jsx
<Route path="/protected" element={
  <PrivateRoute>
    <ProtectedPage />
  </PrivateRoute>
} />
```

## 💡 Best Practices

1. **Always use Tailwind classes** instead of custom CSS
2. **Keep components small** and focused
3. **Use the existing UI components** for consistency
4. **Follow the folder structure** for organization
5. **Test in multiple screen sizes** for responsiveness

## 🆘 Getting Help

If you encounter issues:
1. Check the console for error messages
2. Review this setup guide
3. Check the README.md file
4. Inspect the code comments

## 🎉 Next Steps

1. ✅ Run the project
2. ✅ Test all demo accounts
3. ✅ Explore all pages
4. 🔄 Customize for your needs
5. 🚀 Deploy to production

---

**Congratulations!** You now have a fully functional room discovery platform. Happy coding! 🎊
