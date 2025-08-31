class FlappyBirdGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'menu'; // 'menu', 'playing', 'gameOver'
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('flappyBirdBest') || '0');
        
        // Game objects
        this.bird = null;
        this.pipes = [];
        this.particles = [];
        
        // Game settings
        this.gravity = 0.5;
        this.jumpForce = -10;
        this.pipeSpeed = 3;
        this.pipeGap = 180;
        this.pipeWidth = 80;
        this.pipeSpacing = 300;
        
        // Animation
        this.lastTime = 0;
        this.animationId = null;
        
        // Input handling
        this.keys = {};
        this.mouseDown = false;
        this.touchActive = false;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupControls();
        this.setupUI();
        this.bird = new Bird(this.canvas.width / 4, this.canvas.height / 2, this.canvas);
        this.gameLoop();
    }
    
    setupCanvas() {
        // Make canvas responsive
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            // Prefer container width; fall back to viewport width
            const containerWidth = (container && container.clientWidth) ? container.clientWidth : Math.max(320, window.innerWidth - 32);
            
            const aspectRatio = 800 / 600; // base virtual canvas is 800x600
            let canvasWidth = Math.min(containerWidth, 800);
            let canvasHeight = Math.round(canvasWidth / aspectRatio);

            // Cap height to available viewport minus header/footers if needed
            const header = document.querySelector('.header');
            const controls = document.querySelector('.controls-info');
            const reserved = (header ? header.offsetHeight : 0) + (controls ? controls.offsetHeight : 0) + 40;
            const availH = Math.max(200, window.innerHeight - reserved);
            if (canvasHeight > availH) {
                canvasHeight = availH;
                canvasWidth = Math.round(canvasHeight * aspectRatio);
            }

            // Only scale the CSS size; keep the drawing buffer at 800x600
            this.canvas.style.width = canvasWidth + 'px';
            this.canvas.style.height = canvasHeight + 'px';
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleInput();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse controls
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.mouseDown = true;
            this.handleInput();
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        
        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this.touchActive = true; this.handleInput(); }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => { e.preventDefault(); this.touchActive = false; }, { passive: false });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    setupUI() {
        const startButton = document.getElementById('startButton');
        const restartButton = document.getElementById('restartButton');
        const menuButton = document.getElementById('menuButton');
        
        const __start = (e) => { e && e.preventDefault && e.preventDefault(); this.startGame(); };
    if (startButton) {
        startButton.addEventListener('click', __start);
        startButton.addEventListener('touchend', __start, { passive: false });
        startButton.addEventListener('pointerup', __start, { passive: false });
    }
        const __restart = (e) => { e && e.preventDefault && e.preventDefault(); this.restartGame(); };
    if (restartButton) {
        restartButton.addEventListener('click', __restart);
        restartButton.addEventListener('touchend', __restart, { passive: false });
        restartButton.addEventListener('pointerup', __restart, { passive: false });
    }
        const __menu = (e) => { e && e.preventDefault && e.preventDefault(); this.showMenu(); };
    if (menuButton) {
        menuButton.addEventListener('click', __menu);
        menuButton.addEventListener('touchend', __menu, { passive: false });
        menuButton.addEventListener('pointerup', __menu, { passive: false });
    }
        
        // Update best score display (guarded)
        const bestScoreEl = document.getElementById('bestScore');
        if (bestScoreEl) bestScoreEl.textContent = this.bestScore;

        const startOverlay = document.getElementById('startScreen');
        const startAnywhere = (e) => { e && e.preventDefault && e.preventDefault(); if (this.gameState === 'menu') this.startGame(); };
        if (startOverlay) {
            startOverlay.addEventListener('click', startAnywhere);
            startOverlay.addEventListener('touchend', startAnywhere, { passive: false });
            startOverlay.addEventListener('pointerup', startAnywhere, { passive: false });
        }
    }
    
    handleInput() {
        if (this.gameState === 'playing') {
            this.bird.jump();
            this.createParticles(this.bird.x, this.bird.y, '#f1c40f', 5);
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.bird = new Bird(this.canvas.width / 4, this.canvas.height / 2, this.canvas);
        this.pipes = [];
        this.particles = [];
        this.generatePipes();
        
        const startScreenEl = document.getElementById('startScreen');
        if (startScreenEl) startScreenEl.classList.add('hidden');
        
        const currentScoreEl = document.getElementById('currentScore');
        if (currentScoreEl) currentScoreEl.textContent = this.score;
    }
    
    restartGame() {
        const gameOverEl = document.getElementById('gameOverScreen');
        if (gameOverEl) gameOverEl.classList.add('hidden');
        this.startGame();
    }
    
    showMenu() {
        this.gameState = 'menu';
        const gameOverEl = document.getElementById('gameOverScreen');
        if (gameOverEl) gameOverEl.classList.add('hidden');
        const startScreenEl = document.getElementById('startScreen');
        if (startScreenEl) startScreenEl.classList.remove('hidden');
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('flappyBirdBest', this.bestScore.toString());
        }
        
        // Show game over screen (guarded)
        const finalScoreEl = document.getElementById('finalScore');
        if (finalScoreEl) finalScoreEl.textContent = `Score: ${this.score}`;
        const bestScoreEl = document.getElementById('bestScore');
        if (bestScoreEl) bestScoreEl.textContent = `Best: ${this.bestScore}`;
        const gameOverEl = document.getElementById('gameOverScreen');
        if (gameOverEl) gameOverEl.classList.remove('hidden');
        
        // Create explosion effect
        this.createParticles(this.bird.x, this.bird.y, '#e74c3c', 15);
    }
    
    generatePipes() {
        // Ensure a safe range for pipe height even on small viewports
        const minPipeHeight = 100;
        const maxAvailable = Math.max(minPipeHeight, this.canvas.height - this.pipeGap - 200);
        const pipeHeight = Math.random() * (maxAvailable - minPipeHeight) + minPipeHeight;
        this.pipes.push(new Pipe(this.canvas.width, pipeHeight, this.pipeGap));
    }
    
    updateScore() {
        this.score++;
        const currentScoreEl = document.getElementById('currentScore');
        if (currentScoreEl) currentScoreEl.textContent = this.score;
        this.createParticles(this.canvas.width / 2, 50, '#2ecc71', 8);
    }
    
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Update bird
        this.bird.update();
        
        // Update pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.update(this.pipeSpeed);
            
            // Check for scoring
            if (!pipe.scored && pipe.x + pipe.width < this.bird.x) {
                pipe.scored = true;
                this.updateScore();
            }
            
            // Remove pipes that are off screen
            if (pipe.x + pipe.width < 0) {
                this.pipes.splice(i, 1);
            }
        }
        
        // Generate new pipes
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - this.pipeSpacing) {
            this.generatePipes();
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Check collisions
        this.checkCollisions();
    }
    
    checkCollisions() {
        // Ground and ceiling collision
        if (this.bird.y + this.bird.radius > this.canvas.height || this.bird.y - this.bird.radius < 0) {
            this.gameOver();
            return;
        }
        
        // Pipe collision
        for (const pipe of this.pipes) {
            if (this.bird.x + this.bird.radius > pipe.x && 
                this.bird.x - this.bird.radius < pipe.x + pipe.width) {
                
                if (this.bird.y - this.bird.radius < pipe.topHeight || 
                    this.bird.y + this.bird.radius > pipe.topHeight + pipe.gap) {
                    this.gameOver();
                    return;
                }
            }
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background elements
        this.drawBackground();
        
        if (this.gameState === 'playing' || this.gameState === 'gameOver') {
            // Draw pipes
            this.pipes.forEach(pipe => pipe.draw(this.ctx));
            
            // Draw bird
            this.bird.draw(this.ctx);
            
            // Draw particles
            this.particles.forEach(particle => particle.draw(this.ctx));
        } else {
            // Draw bird in menu state
            this.bird.drawIdle(this.ctx);
        }
        
        // Draw ground
        this.drawGround();
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.7);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.7);
        
        // Ground area
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, this.canvas.height * 0.7, this.canvas.width, this.canvas.height * 0.3);
        
        // Clouds
        this.drawClouds();
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        const cloudPositions = [
            { x: 100, y: 80, size: 40 },
            { x: 300, y: 120, size: 50 },
            { x: 600, y: 100, size: 35 },
            { x: 500, y: 60, size: 45 }
        ];
        
        cloudPositions.forEach(cloud => {
            this.drawCloud(cloud.x, cloud.y, cloud.size);
        });
    }
    
    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.3, y, size * 0.7, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.6, y, size * 0.5, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.3, y - size * 0.3, size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawGround() {
        const groundHeight = 50;
        const groundY = this.canvas.height - groundHeight;
        
        // Ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, groundY, this.canvas.width, groundHeight);
        
        // Grass
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, groundY, this.canvas.width, 20);
        
        // Ground pattern
        this.ctx.fillStyle = '#654321';
        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.fillRect(x, groundY + 20, 20, 30);
        }
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class Bird {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.velocity = 0;
        this.radius = 20;
        this.color = '#f1c40f';
        this.strokeColor = '#f39c12';
        this.rotation = 0;
        this.wingPhase = 0;
    }
    
    update() {
        // Apply gravity
        this.velocity += game.gravity;
        this.y += this.velocity;
        
        // Update rotation based on velocity
        this.rotation = Math.min(Math.max(this.velocity * 0.1, -0.5), 0.5);
        
        // Wing animation
        this.wingPhase += 0.3;
    }
    
    jump() {
        this.velocity = game.jumpForce;
    }
    
    draw(ctx) {
        ctx.save();
        
        // Translate to bird position
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw bird body
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw wing
        const wingOffset = Math.sin(this.wingPhase) * 5;
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.ellipse(-8, wingOffset, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(8, -5, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(10, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(25, 2);
        ctx.lineTo(15, 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    drawIdle(ctx) {
        // Floating animation for menu
        const floatOffset = Math.sin(Date.now() * 0.003) * 10;
        this.y = this.canvas.height / 2 + floatOffset;
        this.velocity = 0;
        this.wingPhase += 0.1;
        this.draw(ctx);
    }
}

class Pipe {
    constructor(x, topHeight, gap) {
        this.x = x;
        this.topHeight = topHeight;
        this.gap = gap;
        this.width = game.pipeWidth;
        this.scored = false;
        this.color = '#2ecc71';
        this.strokeColor = '#27ae60';
    }
    
    update(speed) {
        this.x -= speed;
    }
    
    draw(ctx) {
        const bottomY = this.topHeight + this.gap;
        const bottomHeight = ctx.canvas.height - bottomY - 50; // Account for ground
        
        // Draw top pipe
        this.drawPipeSegment(ctx, this.x, 0, this.width, this.topHeight);
        
        // Draw bottom pipe
        this.drawPipeSegment(ctx, this.x, bottomY, this.width, bottomHeight);
        
        // Draw pipe caps
        this.drawPipeCap(ctx, this.x - 5, this.topHeight - 30, this.width + 10, 30);
        this.drawPipeCap(ctx, this.x - 5, bottomY, this.width + 10, 30);
    }
    
    drawPipeSegment(ctx, x, y, width, height) {
        // Main pipe body
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, width, height);
        
        // Pipe border
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Pipe highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x + 5, y, 10, height);
        
        // Pipe shadows
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(x + width - 10, y, 10, height);
    }
    
    drawPipeCap(ctx, x, y, width, height) {
        // Pipe cap
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(x, y, width, height);
        
        ctx.strokeStyle = '#1e8449';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // Cap highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x + 5, y + 5, width - 10, 8);
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1.0;
        this.decay = 0.02;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity effect
        this.life -= this.decay;
        this.size *= 0.98;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize game when page loads
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new FlappyBirdGame();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (game) {
        game.destroy();
    }
});

// Prevent space bar from scrolling the page
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
    }
});
