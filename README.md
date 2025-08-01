# 3D FBX Viewer

A modern, interactive web application for uploading and viewing 3D FBX models Developed By Reza Abdolmaleki geeekboy92@gmail.com.

## Features

- **Upload FBX Files**: Drag and drop or click to upload FBX 3D model files
- **Progress Tracking**: Real-time upload progress bar with smooth animations
- **3D Visualization**: Interactive 3D viewer with realistic lighting and shadows
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Interactive Controls**: 
  - Mouse rotation
  - Scroll to zoom
  - Right-click and drag to pan
  - Reset view button

![home](https://github.com/geeekboy92/FBX_3D_Model_Viewer/blob/main/1.jpeg)
![home](https://github.com/geeekboy92/FBX_3D_Model_Viewer/blob/main/2.jpeg)
![home](https://github.com/geeekboy92/FBX_3D_Model_Viewer/blob/main/3.jpeg)
![home](https://github.com/geeekboy92/FBX_3D_Model_Viewer/blob/main/4.jpeg)


## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd fbx-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Usage

1. **Upload**: Drag and drop an FBX file onto the upload area or click "Choose FBX File"
2. **View**: Once uploaded, the 3D model will be displayed in the interactive viewer
3. **Interact**: Use mouse controls to explore the model:
   - **Rotate**: Left-click and drag
   - **Zoom**: Mouse wheel
   - **Pan**: Right-click and drag
4. **Reset**: Click the reset button to return to the default view
5. **Back**: Click the back arrow to upload a new model

## Supported File Formats

- `.fbx` - Autodesk FBX format

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Three.js** - 3D graphics library  
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
fbx-viewer/
├── app/                    # Next.js 13+ app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AnimatedBackground.tsx  # Animated background
│   ├── FBXViewer.tsx      # 3D model viewer
│   └── FileUpload.tsx     # File upload component
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## Build for Production

```bash
npm run build
npm start
```

## License

This project is open source and available under the [MIT License](LICENSE).
