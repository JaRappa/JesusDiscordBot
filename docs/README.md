# Jesus Bot Website

A modern, professional website showcasing the Jesus Discord Bot - perfect for portfolios and resumes.

## Features

- **Modern Design**: Clean, professional, and visually appealing
- **Responsive**: Fully responsive across all devices (desktop, tablet, mobile)
- **Dark Theme**: Eye-catching gradient design with dark theme
- **Smooth Animations**: Floating cards and scroll animations
- **Interactive Elements**: Toast notifications and smooth scrolling
- **Professional Layout**: Hero section, features showcase, tech stack, and CTA buttons

## Project Structure

```
website/
├── index.html       # Main landing page
├── styles.css       # All styling and animations
├── script.js        # Interactive functionality
└── README.md        # This file
```

## Customization

### Update Bot Invite Link

In `script.js`, update the `copyInviteLink()` function:

```javascript
const inviteLink = 'https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=68608&scope=bot';
```

Replace `YOUR_BOT_ID` with your actual Discord bot ID.

### Update Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #5865F2;
    --secondary-color: #FF6B6B;
    --accent-color: #4A5899;
    /* ... more variables */
}
```

### Update GitHub Link

In `index.html`, update GitHub links:

```html
<a href="https://github.com/your-username/repo" target="_blank">View on GitHub</a>
```

## Sections

1. **Navigation**: Sticky navbar with smooth scrolling
2. **Hero**: Eye-catching headline with CTA buttons and floating cards
3. **Features**: Showcase of bot capabilities in a grid layout
4. **How It Works**: 3-step process visualization
5. **Tech Stack**: Technologies used in the project
6. **CTA**: Call-to-action button to add the bot
7. **Footer**: Links and copyright information

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Optimized CSS animations
- Lazy loading for images
- Smooth scroll behavior
- Responsive grid layouts

## Future Enhancements

- [ ] Add a dashboard page
- [ ] Discord OAuth integration
- [ ] Stats/analytics section
- [ ] Blog for updates
- [ ] User testimonials section
- [ ] Dark/Light theme toggle

## License

This website is part of the Jesus Discord Bot project.
