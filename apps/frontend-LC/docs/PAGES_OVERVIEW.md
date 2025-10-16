# Pages Overview

## Portal Web Pages

### Public Pages (No Authentication Required)

#### `/` - Landing Page
- Hero section with call-to-action
- Server statistics (players, dungeons, achievements)
- Latest news preview (3 articles)
- Features showcase
- Sign-up and download buttons

#### `/news` - News Listing
- Grid layout of news articles
- Category badges (Update, Event, PvP, etc.)
- Pagination
- Search functionality (planned)
- Filter by category (planned)

#### `/news/[id]` - News Detail
- Full article content
- Author and publish date
- Category badge
- Back to news button
- Related articles (planned)

#### `/market` - Item Shop
- Grid of purchasable items
- Category badges
- Item details (name, description, price)
- Buy now buttons
- Shopping cart (planned)

#### `/rankings` - Leaderboards
- Tab navigation (Characters/Guilds)
- Top 100 characters table with rank, name, level, class, guild, exp
- Top 50 guilds table with rank, name, level, members, master
- Real-time updates (planned)
- Class/level filters (planned)

#### `/vote` - Vote for Rewards
- Multiple vote sites
- Reward amount display
- Cooldown timer
- Availability status
- Vote history
- How it works section

#### `/downloads` - Client Downloads
- Game client download
- Launcher download
- Patch notes
- System requirements (minimum and recommended)
- Installation guide

#### `/auth/login` - Login Page
- Username/email input
- Password input
- 2FA code input (optional)
- Forgot password link
- Register link
- Remember me option (planned)

#### `/auth/register` - Registration Page
- Username input (min 3 chars)
- Email input
- Password input (min 6 chars)
- Password confirmation
- Terms acceptance (planned)
- ReCaptcha (planned)
- Login link

### Protected Pages (Authentication Required)

#### `/dashboard` - User Dashboard
- Cash balance card
- Game accounts count
- Member since date
- Last login date
- Game accounts list with details
- Recent activity log
- Quick actions (planned)

#### `/redeem` - Code Redemption
- Code input form
- Active promotional codes
- Redemption history
- Success/error messages
- Code validation

#### `/support/tickets` - Support Tickets
- Create new ticket button
- Ticket list with status badges
- Priority indicators
- Reply count
- Creation and update dates
- Ticket detail view (planned)

## Admin UI Pages

### Authentication

#### `/` - Admin Landing
- Shield icon
- App description
- Login button
- Access restriction notice

#### `/login` - Admin Login (Planned)
- Username input
- Password input
- 2FA requirement
- RBAC validation

### Dashboard (Planned)

#### `/dashboard` - Admin Dashboard
- Live statistics
- Server status indicators
- Quick actions
- Recent activity
- User metrics
- System health

### User Management (Planned)

#### `/users` - User List
- Searchable user table
- Ban/unban actions
- Cash editing
- Role management
- User details view
- Activity history

### Support (Planned)

#### `/tickets` - Ticket Management
- Filter by status/priority
- Assign to staff
- Reply to tickets
- Close/reopen tickets
- Bulk actions

### Content Management (Planned)

#### `/news` - News Management
- Create new article
- Edit existing articles
- Markdown editor
- Preview mode
- Publish/unpublish
- Category management

#### `/events` - Event Management
- Create new events
- Event scheduler
- Start/end date picker
- Reward configuration
- Active/inactive toggle

### Code Management (Planned)

#### `/redeem` - Code Generator
- Generate new codes
- Set code type (cash, item, bundle)
- Configure max uses
- Set expiration date
- View usage statistics

### Audit (Planned)

#### `/audit` - Audit Log
- Filter by user/action
- Date range selector
- Export logs
- Detailed view
- IP tracking

## Page States

### Loading States
- Skeleton loaders for content
- Spinner for actions
- Progressive loading for lists

### Error States
- 404 Not Found page
- 500 Server Error page
- Network error messages
- Form validation errors
- API error handling

### Empty States
- No news articles
- No tickets
- No activity
- No search results
- Call-to-action buttons

## Navigation

### Portal Web Navigation
- Home
- News
- Market
- Rankings
- Vote
- Redeem
- Downloads
- Support
- Login/Dashboard (conditional)

### Admin UI Navigation (Planned)
- Dashboard
- Users
- Tickets
- News
- Events
- Redeem Codes
- Audit Logs
- Settings

## Mobile Responsiveness

All pages are fully responsive:
- Mobile menu (hamburger)
- Touch-friendly buttons
- Stacked layouts on mobile
- Optimized tables (horizontal scroll)
- Adjusted font sizes
- Collapsed navigation

## SEO Optimization

- Dynamic meta titles
- Meta descriptions
- Open Graph tags
- Canonical URLs
- Sitemap (planned)
- Robots.txt (planned)

## Performance

- Static page generation where possible
- Dynamic imports for heavy components
- Image optimization
- Code splitting
- Lazy loading
- Cache strategies

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast

## Future Pages

### Portal Web
- [ ] `/profile` - User profile
- [ ] `/friends` - Friend list
- [ ] `/messages` - Private messaging
- [ ] `/guilds` - Guild directory
- [ ] `/events` - Active events
- [ ] `/leaderboards/pvp` - PvP rankings
- [ ] `/forum` - Community forum

### Admin UI
- [ ] `/settings` - System settings
- [ ] `/logs` - System logs
- [ ] `/reports` - Analytics and reports
- [ ] `/maintenance` - Maintenance mode
- [ ] `/announcements` - System announcements
- [ ] `/bans` - Ban management
