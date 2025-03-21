# GTK4/LibAdwaita Mockup Editor

> [!WARNING]
> Everything in this repository is AI-generated. I’m not a professional software engineer—in fact, I wouldn’t even call myself a programmer.
> I just know some basics. Please keep that in mind while exploring this repo. Use at your own risk!

An interactive mockup and wireframe editor specifically designed for creating UI prototypes for GTK4 and LibAdwaita applications.

## Features

- Drag and drop UI elements such as buttons, text fields, labels, and containers onto a canvas
- Customize the properties of each element (text content, size, position, styling)
- Create multiple screens with the ability to link elements between screens
- Preview mode to visualize the mockup as a running GTK4/LibAdwaita application
- Export/import mockups as JSON files

## Development

This project uses a development container for a consistent development experience.

### Prerequisites

- Docker
- VS Code with the Remote - Containers extension

### Getting Started

1. Clone this repository
2. Open the project in VS Code
3. VS Code will prompt you to reopen the project in a container. Click "Reopen in Container"
4. Once the container is built and running, open a terminal in VS Code and run:

```bash
npm run dev
```

5. Access the application at http://localhost:5173

## Project Structure

- `src/components/` - Vue components
- `src/views/` - Vue views/pages
- `src/assets/` - Static assets and global CSS
- `src/store/` - Pinia store modules for state management
- `src/router/` - Vue Router configuration

## Building for Production

```bash
npm run build
```

## License

MIT 
