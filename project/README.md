# Document Intelligence Frontend

A beautiful, modern frontend for the Document Intelligence Pipeline that transforms documents into structured Excel data using AI-powered OCR.

## Features

- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Real-time Processing**: Visual feedback during document processing
- **Animated UI**: Smooth animations and transitions throughout the user journey
- **Responsive Design**: Works perfectly on all device sizes
- **Excel Export**: Download formatted Excel files with structured data

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Lucide React for icons
- Modern CSS animations

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Running FastAPI backend (see backend requirements)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```
VITE_API_URL=http://localhost:8000
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

1. **Upload Document**: Drag and drop or click to select a document (JPEG, PNG, or TIFF, max 10MB)
2. **Processing**: Watch the real-time processing animation as your document is analyzed
3. **Download**: Once complete, download your formatted Excel file

## API Integration

The frontend communicates with three backend endpoints:

- `POST /upload` - Upload document and start processing
- `GET /status/{task_id}` - Check processing status
- `GET /download/{task_id}` - Download the Excel file

## Project Structure

```
src/
├── components/
│   ├── FileUpload.tsx        # File upload component with drag-drop
│   ├── ProcessingAnimation.tsx # Animated processing state
│   └── SuccessState.tsx       # Success and download state
├── App.tsx                    # Main application component
├── index.css                  # Global styles and animations
└── main.tsx                   # Application entry point
```

## Customization

### Colors

The app uses a blue-to-emerald gradient theme. To customize colors, update:
- Tailwind classes in components
- CSS gradients in `index.css`

### Animations

Custom animations are defined in `index.css`:
- `animate-fade-in` - Fade in with slide up
- `animate-scale-in` - Scale in effect
- `animate-float` - Floating animation
- `animate-pulse-slow` - Slow pulse effect
- `animate-spin-slow` - Slow rotation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
