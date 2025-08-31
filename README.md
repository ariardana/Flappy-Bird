# Flappy Bird - HTML5 Canvas Game

A modern, responsive implementation of the classic Flappy Bird game built with HTML5 Canvas and vanilla JavaScript. Features smooth 60fps gameplay, particle effects, and mobile-friendly controls.

## Features

- **Smooth Gameplay**: 60fps animation with optimized rendering
- **Responsive Design**: Adapts to different screen sizes and devices
- **Cross-Platform Controls**: Keyboard, mouse, and touch input support
- **Visual Effects**: Particle systems and smooth animations
- **Score System**: Real-time scoring with local storage for best scores
- **Game States**: Menu, playing, and game over screens
- **Mobile Optimized**: Touch controls and responsive canvas sizing
- **Clean UI**: Modern design with pixel-perfect typography

## Installation & Setup

### Quick Start
1. Download or clone all project files to a local directory
2. Open `index.html` in any modern web browser
3. No additional setup or dependencies required!

### Local Development
If you want to run this on a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## How to Play

### Objective
Guide the yellow bird through pipes without hitting them or the ground/ceiling.

### Controls
- **Desktop**: Press `SPACEBAR` to make the bird jump
- **Mouse**: Click anywhere on the game canvas to jump
- **Mobile/Tablet**: Tap the screen to jump

### Gameplay Rules
1. The bird continuously falls due to gravity
2. Each jump gives the bird upward momentum
3. Navigate through the gaps between green pipes
4. Score increases by 1 for each pipe successfully passed
5. Game ends when the bird hits a pipe, ground, or ceiling
6. Your best score is automatically saved locally

### Game States
- **Menu**: Starting screen with instructions
- **Playing**: Active gameplay state
- **Game Over**: Shows final score and restart options

## Technical Implementation

### Architecture
The game follows object-oriented programming principles with separate classes for different game entities:

- **FlappyBirdGame**: Main game controller managing state, input, and game loop
- **Bird**: Player character with physics and rendering
- **Pipe**: Obstacle objects with collision detection
- **Particle**: Visual effect system for feedback

### Key Technologies
- **HTML5 Canvas**: All graphics rendering
- **RequestAnimationFrame**: Smooth 60fps animation loop
- **CSS3**: Responsive design and UI styling
- **Local Storage**: Persistent best score tracking
- **Touch Events**: Mobile device support

### Performance Optimizations
- Efficient collision detection algorithms
- Object pooling for particles
- Optimized rendering pipeline
- Responsive canvas scaling
- Memory management for removed objects

### Browser Compatibility
- **Chrome**: Fully supported (recommended)
- **Firefox**: Fully supported
- **Safari**: Fully supported
- **Edge**: Fully supported
- **Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet

## File Structure

```
flappy-bird/
├── index.html          # Main HTML file with canvas element
├── style.css           # Game styling and responsive design
├── script.js           # Complete game logic and classes
└── README.md           # This documentation file
```

### File Descriptions

#### `index.html`
Contains the game canvas, UI overlays, and screen elements. Includes:
- Responsive meta tags for mobile optimization
- Google Fonts integration for pixel-perfect typography
- Semantic HTML structure for accessibility
- Game screens (menu, game over) with proper ARIA labels

#### `style.css`
Comprehensive styling including:
- Mobile-first responsive design with breakpoints
- Modern CSS features (flexbox, grid, custom properties)
- Smooth animations and transitions
- Cross-browser compatibility
- Touch-friendly interactive elements

#### `script.js`
Complete game implementation featuring:
- Object-oriented architecture with ES6 classes
- Game loop with delta time calculations
- Physics simulation for realistic bird movement
- Collision detection algorithms
- Particle system for visual effects
- Input handling for multiple device types
- Local storage integration

## Customization Options

### Game Difficulty
Modify these values in the `FlappyBirdGame` constructor:

```javascript
this.gravity = 0.5;        // Bird fall speed
this.jumpForce = -10;      // Bird jump strength
this.pipeSpeed = 3;        // Pipe movement speed
this.pipeGap = 180;        // Gap between pipes
this.pipeSpacing = 300;    // Distance between pipe pairs
```

### Visual Customization
- Bird colors: Modify `Bird` class color properties
- Pipe colors: Change `Pipe` class color values
- Background: Edit `drawBackground()` method gradients
- Particle effects: Customize `Particle` class properties

### Controls
Add new input methods by extending the `setupControls()` method in the main game class.

## Browser Support

### Minimum Requirements
- HTML5 Canvas support
- ES6 JavaScript features
- CSS3 animations and transforms
- Touch event support (for mobile)

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Chrome 90+
- Mobile Safari 14+

## Performance Considerations

### Frame Rate
The game targets 60fps and includes:
- Efficient rendering with minimal canvas operations
- Object pooling for frequently created/destroyed objects
- Optimized collision detection algorithms
- Memory leak prevention

### Mobile Performance
- Responsive canvas sizing
- Touch event optimization
- Reduced particle counts on mobile devices
- Efficient memory management

## Future Enhancements

### Potential Features
- **Power-ups**: Temporary abilities or score multipliers
- **Multiple Bird Characters**: Unlock different bird designs
- **Achievements System**: Goals and milestones for players
- **Sound Effects**: Audio feedback for jumps, scoring, and collisions
- **Background Music**: Ambient game soundtrack
- **Leaderboards**: Online score sharing and competition
- **Themes**: Different visual themes (night, space, underwater)
- **Difficulty Modes**: Easy, normal, hard with different physics
- **Pipe Variations**: Moving pipes, colored pipes, different sizes

### Technical Improvements
- WebGL rendering for enhanced performance
- Progressive Web App (PWA) features
- Offline gameplay capability
- Social media sharing integration
- Analytics and gameplay tracking
- Server-side leaderboards

## Credits & Acknowledgments

### Original Concept
- Original Flappy Bird created by Dong Nguyen
- This implementation is created for educational purposes

### Technologies Used
- HTML5 Canvas API for graphics rendering
- Vanilla JavaScript ES6+ for game logic
- CSS3 for responsive design and animations
- Google Fonts for typography
- RequestAnimationFrame for smooth animations

### Development
- Built with modern web standards
- Follows accessibility best practices
- Optimized for performance across devices
- Created with mobile-first responsive design principles

## License

This project is open source and available for educational and personal use. Please respect the original Flappy Bird trademark and use this implementation responsibly.

## Contributing

Feel free to fork this project and submit improvements! Areas where contributions are welcome:
- Performance optimizations
- New visual effects
- Additional game features
- Bug fixes and browser compatibility
- Documentation improvements

---

**Enjoy the game and happy coding!** 🐦🎮