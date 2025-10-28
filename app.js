// Font Maker Application
class FontMaker {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.brushSize = 3;
        this.currentCharIndex = 0;

        // Define all characters to draw
        this.characters = [
            ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            ...'abcdefghijklmnopqrstuvwxyz',
            ...'0123456789',
            ...'!@#$%^&*()_+-=[]{}|;:\'",.<>?/ '
        ];

        // Store drawn glyphs as ImageData
        this.glyphs = {};

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupCharacterButtons();
        this.setupEventListeners();
        this.loadCurrentChar();
        this.updateProgress();
    }

    setupCanvas() {
        // Set up canvas with white background
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    setupCharacterButtons() {
        const container = document.getElementById('characterButtons');

        // Create buttons for each character
        this.characters.forEach((char, index) => {
            const btn = document.createElement('button');
            btn.textContent = char === ' ' ? '␣' : char;
            btn.className = 'char-btn';
            btn.dataset.index = index;

            if (index === 0) btn.classList.add('active');

            btn.addEventListener('click', () => {
                this.saveCurrentChar();
                this.currentCharIndex = index;
                this.loadCurrentChar();
                this.updateCharacterButtons();
            });

            container.appendChild(btn);
        });
    }

    setupEventListeners() {
        // Drawing events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events for iPad/tablets
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });

        // Tool buttons
        document.getElementById('penBtn').addEventListener('click', () => {
            this.currentTool = 'pen';
            this.updateToolButtons();
        });

        document.getElementById('eraserBtn').addEventListener('click', () => {
            this.currentTool = 'eraser';
            this.updateToolButtons();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearCanvas();
        });

        // Brush size
        const brushSizeInput = document.getElementById('brushSize');
        brushSizeInput.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            document.getElementById('brushSizeValue').textContent = this.brushSize;
            this.ctx.lineWidth = this.brushSize;
        });

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.saveCurrentChar();
            this.generateFont();
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }

    draw(e) {
        if (!this.isDrawing) return;

        const pos = this.getMousePos(e);

        if (this.currentTool === 'pen') {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = 'black';
        } else if (this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
        }

        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath();
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    clearCanvas() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    saveCurrentChar() {
        const char = this.characters[this.currentCharIndex];
        this.glyphs[char] = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.updateProgress();
        this.markCharacterAsDrawn(this.currentCharIndex);
    }

    loadCurrentChar() {
        const char = this.characters[this.currentCharIndex];
        document.getElementById('currentChar').textContent = char === ' ' ? 'Space' : char;

        // Clear canvas first
        this.clearCanvas();

        // Load existing glyph if available
        if (this.glyphs[char]) {
            this.ctx.putImageData(this.glyphs[char], 0, 0);
        }
    }

    updateCharacterButtons() {
        const buttons = document.querySelectorAll('.char-btn');
        buttons.forEach((btn, index) => {
            btn.classList.toggle('active', index === this.currentCharIndex);
        });
    }

    markCharacterAsDrawn(index) {
        const buttons = document.querySelectorAll('.char-btn');
        if (buttons[index]) {
            buttons[index].classList.add('drawn');
        }
    }

    updateProgress() {
        const drawn = Object.keys(this.glyphs).length;
        const total = this.characters.length;
        document.getElementById('progressText').textContent =
            `Characters drawn: ${drawn}/${total}`;
    }

    updateToolButtons() {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (this.currentTool === 'pen') {
            document.getElementById('penBtn').classList.add('active');
        } else if (this.currentTool === 'eraser') {
            document.getElementById('eraserBtn').classList.add('active');
        }
    }

    async generateFont() {
        const fontName = document.getElementById('fontName').value || 'MyCustomFont';

        if (Object.keys(this.glyphs).length === 0) {
            alert('Please draw at least one character before downloading!');
            return;
        }

        try {
            // Create a new font
            const notdefGlyph = new opentype.Glyph({
                name: '.notdef',
                unicode: 0,
                advanceWidth: 650,
                path: new opentype.Path()
            });

            const glyphs = [notdefGlyph];

            // Convert each drawn character to a glyph
            for (const [char, imageData] of Object.entries(this.glyphs)) {
                const path = this.imageDataToPath(imageData);
                const unicode = char.charCodeAt(0);

                const glyph = new opentype.Glyph({
                    name: char === ' ' ? 'space' : char,
                    unicode: unicode,
                    advanceWidth: 650,
                    path: path
                });

                glyphs.push(glyph);
            }

            // Create the font
            const font = new opentype.Font({
                familyName: fontName,
                styleName: 'Regular',
                unitsPerEm: 1000,
                ascender: 800,
                descender: -200,
                glyphs: glyphs
            });

            // Download the font
            font.download(`${fontName}.ttf`);

            alert(`Font "${fontName}" has been generated and downloaded successfully!`);
        } catch (error) {
            console.error('Error generating font:', error);
            alert('Error generating font. Please try again.');
        }
    }

    imageDataToPath(imageData) {
        const path = new opentype.Path();
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        // Simple path tracing - convert black pixels to path
        // This is a basic implementation; for better results, you'd want path tracing algorithms
        const scale = 2.5; // Scale factor to fit font units
        const yOffset = 800; // Flip Y coordinate for font space

        // Sample the image and create rectangles for black pixels
        const step = 4; // Sample every 4 pixels for performance

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                // If pixel is dark (not white/transparent)
                if (a > 128 && (r + g + b) / 3 < 128) {
                    const fx = x * scale;
                    const fy = yOffset - (y * scale);
                    const size = step * scale;

                    // Draw a small rectangle for this pixel
                    path.moveTo(fx, fy);
                    path.lineTo(fx + size, fy);
                    path.lineTo(fx + size, fy - size);
                    path.lineTo(fx, fy - size);
                    path.close();
                }
            }
        }

        return path;
    }
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    new FontMaker();
});
