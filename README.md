# Tree Donation Platform - Frontend Only Version

This is a frontend-only version of the Tree Donation Platform designed for deployment on GitHub Pages. It includes user registration, login, personal cabinet (dashboard), and admin panel functionalities using only HTML, CSS, and JavaScript.

## Features

1. **User Authentication**
   - User registration and login
   - Session management using localStorage
   - Password-less implementation (for demo purposes)

2. **Personal Cabinet (Dashboard)**
   - User profile display
   - Donation history
   - Application status tracking

3. **Admin Panel**
   - User management
   - Application review and status updates
   - Statistics dashboard

4. **Responsive Design**
   - Mobile-friendly layout
   - Modern UI with animations and glassmorphism effects

## Files Structure

```
gh-pages/
├── index.html       # Main HTML file with all pages
├── styles.css       # Complete styling with animations
├── script.js        # All JavaScript functionality
└── README.md        # This file
```

## How to Deploy to GitHub Pages

1. Create a new repository on GitHub or use an existing one
2. Copy all files from this `gh-pages` directory to your repository
3. Commit and push the files to GitHub
4. Go to your repository settings
5. Scroll down to the "Pages" section
6. Select "Deploy from a branch" as the source
7. Choose your branch (usually `main` or `master`)
8. Set the folder to `/ (root)`
9. Click "Save"
10. Wait for GitHub to build and deploy your site

## Sample Accounts

For demonstration purposes, the application comes with sample accounts:

1. **Administrator Account**
   - Email: `admin@example.com`
   - Password: `admin123`

2. **Regular User Account**
   - Email: `ivan@example.com`
   - Password: `user123`

## Data Storage

All data is stored in the browser's localStorage:
- User accounts
- Donation records
- Applications

This means data persists between sessions but is specific to each browser/device.

## Customization

To customize the platform:
1. Modify `index.html` to change content and structure
2. Update `styles.css` to change the appearance
3. Edit `script.js` to modify functionality

## Browser Support

This frontend works on all modern browsers that support:
- localStorage
- CSS3 animations and transitions
- ES6 JavaScript features

## Limitations

Since this is a frontend-only implementation:
- Data is not synchronized between devices/browsers
- No server-side validation or security
- Not suitable for production use without a backend

For a production implementation, you would need to integrate with a backend service for:
- Secure authentication
- Database storage
- Real-time updates
- Payment processing