# Contributing to MaiPro

Thank you for your interest in contributing to MaiPro! This guide will help you get started.

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards others

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**
- Clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### Suggesting Enhancements

We welcome enhancement suggestions! Please provide:
- Clear description of the enhancement
- Why this enhancement would be useful
- Possible implementation approach
- Examples from other projects (if applicable)

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/ArrobaLab/maipro.git
   cd maipro
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Write clear, commented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test Your Changes**
   ```bash
   # Check syntax
   node -c server.js
   
   # Run the server
   npm run dev
   
   # Test API endpoints
   ./test-api.sh
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit Message Format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit!

## Development Setup

### Prerequisites
- Node.js 14+
- MongoDB 4.4+
- Git

### Setup Steps
```bash
# Clone repository
git clone https://github.com/ArrobaLab/maipro.git
cd maipro

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start MongoDB (with Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Seed database
npm run seed

# Start development server
npm run dev
```

## Coding Guidelines

### JavaScript Style

**Follow these conventions:**

```javascript
// Use const/let, not var
const userId = req.userId;
let status = 'pending';

// Use arrow functions for callbacks
array.map(item => item.id);

// Use async/await, not callbacks
const user = await User.findById(id);

// Proper error handling
try {
  await someOperation();
} catch (error) {
  res.status(500).json({ message: 'Error', error: error.message });
}

// Clear variable names
const userBookings = await Booking.find({ customer: userId });

// Add comments for complex logic
// Calculate average rating from all reviews
const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
```

### File Organization

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
└── routes/          # Route definitions
```

### Naming Conventions

- **Files**: camelCase (e.g., `authController.js`)
- **Classes/Models**: PascalCase (e.g., `User`, `Booking`)
- **Functions**: camelCase (e.g., `getProfile`, `createBooking`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Routes**: kebab-case (e.g., `/my-bookings`)

## Adding New Features

### Adding a New Model

1. Create model file in `src/models/`
2. Define Mongoose schema
3. Export model
4. Update documentation

Example:
```javascript
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
```

### Adding a New Endpoint

1. Create/update controller in `src/controllers/`
2. Add route in `src/routes/`
3. Add appropriate middleware (auth, rate limiting)
4. Update API documentation
5. Test the endpoint

Example:
```javascript
// Controller
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Route
router.get('/', apiLimiter, auth, getNotifications);
```

### Adding Middleware

1. Create file in `src/middleware/`
2. Export middleware function
3. Apply to routes as needed
4. Document usage

## Testing

### Manual Testing

```bash
# Start server
npm run dev

# Run test script
./test-api.sh

# Test specific endpoint
curl http://localhost:5000/api/services
```

### API Testing with Postman

1. Import `postman_collection.json`
2. Set up environment variables
3. Test each endpoint
4. Verify responses

## Security

### Security Checklist

Before submitting code:
- [ ] No secrets in code
- [ ] Input validation added
- [ ] Authentication required for protected routes
- [ ] Rate limiting applied
- [ ] Error messages don't leak sensitive info
- [ ] SQL injection prevention (Mongoose handles this)
- [ ] XSS prevention

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Email: security@maipro.com

## Documentation

Update documentation when you:
- Add new endpoints
- Change API behavior
- Add new features
- Update dependencies
- Change configuration

**Files to update:**
- `README.md` - Main documentation
- `API.md` - API reference
- `SECURITY.md` - Security information
- Code comments

## Review Process

1. **Automated Checks**
   - Syntax validation
   - Linting (if configured)
   - Security scanning

2. **Code Review**
   - Maintainer reviews code
   - Checks for style, logic, security
   - May request changes

3. **Testing**
   - Manual testing
   - API endpoint verification
   - Edge case testing

4. **Approval & Merge**
   - Approved by maintainer
   - Merged to main branch
   - Deployed (if applicable)

## Project Structure

```
maipro/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── providerController.js
│   │   ├── reviewController.js
│   │   └── serviceController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Provider.js
│   │   ├── Review.js
│   │   ├── Service.js
│   │   └── User.js
│   └── routes/
│       ├── auth.js
│       ├── bookings.js
│       ├── providers.js
│       ├── reviews.js
│       └── services.js
├── client/              # Frontend (to be implemented)
├── server.js            # Entry point
├── seed.js              # Database seeder
├── package.json
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── Documentation files
```

## Getting Help

- 📧 Email: support@maipro.com
- 💬 Discord: [Join our server](#)
- 📚 Documentation: Check README.md
- 🐛 Issues: GitHub Issues

## Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Recognized in the community

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Questions?

Don't hesitate to ask! Open an issue with the "question" label or reach out via email.

Thank you for contributing to MaiPro! 🎉
