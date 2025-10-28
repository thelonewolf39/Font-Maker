# Custom Font Maker

A web-based tool that allows you to create custom fonts by drawing each character directly in your browser. Perfect for iPad and tablet users with stylus support!

## Features

- Draw custom glyphs for A-Z, a-z, 0-9, and special characters
- Touch-friendly interface optimized for iPad and tablets
- Pen and eraser tools with adjustable brush sizes
- Real-time progress tracking
- Download your custom font as a .ttf (TrueType Font) file
- No server required - runs entirely in the browser

## How to Use

1. **Select a Character**: Click on any character button from the character selector panel
2. **Draw**: Use your mouse, finger, or stylus to draw the character on the canvas
3. **Tools**:
   - **Pen**: Draw your character
   - **Eraser**: Erase parts of your drawing
   - **Clear**: Clear the entire canvas
   - **Brush Size**: Adjust the thickness of your pen/eraser
4. **Progress**: The app tracks how many characters you've drawn
5. **Download**: Once you've drawn the characters you want, enter a font name and click "Download Font (.ttf)"
6. **Install**: Install the downloaded .ttf file on your computer to use it in any application

## Browser Compatibility

Works best on:
- Safari on iPad (with Apple Pencil)
- Chrome/Edge/Safari on desktop
- Modern mobile browsers with touch support

## Technical Details

- Built with vanilla JavaScript (no frameworks required)
- Uses HTML5 Canvas API for drawing
- Uses [opentype.js](https://opentype.js.org/) for font generation
- Generates TrueType Font (.ttf) format
- Fully client-side - no server required

## Tips for Best Results

- Use an iPad or tablet with a stylus for best drawing precision
- Draw characters centered in the canvas
- The red guidelines help you align your characters consistently
- You don't have to draw all characters - only the ones you want
- Characters are saved automatically when you switch between them

## Limitations

- Basic path tracing algorithm (characters are converted to pixel-based paths)
- For professional-quality fonts, consider using dedicated font editing software
- Font rendering quality depends on drawing resolution

## License

Free to use and modify for personal and commercial projects.

## Contributing

Feel free to fork and improve! Some ideas:
- Better path tracing algorithms
- Export to multiple font formats
- Import existing fonts for modification
- Advanced drawing tools (shapes, fill, etc.)
- Undo/redo functionality

---

Made with ❤️ for font enthusiasts and creative minds!
