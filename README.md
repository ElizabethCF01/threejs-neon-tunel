# Neon Tunnel - Interactive 3D Experience

A mesmerizing interactive 3D tunnel experience built with Three.js, featuring dynamic audio visualization, post-processing effects, and smooth camera movement through a neon-lit cyberpunk tunnel.

![Neon Tunnel](https://img.shields.io/badge/Three.js-Interactive-brightgreen)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-blue)
![WebGL](https://img.shields.io/badge/WebGL-Graphics-orange)

## ✨ Features

- **Interactive 3D Tunnel**: Navigate through a procedurally generated neon tunnel
- **Audio-Reactive Visuals**: Real-time audio analysis that affects visual effects
- **Post-Processing Effects**:
  - Radial blur based on movement speed
  - Unreal Bloom for glowing effects
  - RGB shift for retro aesthetics
  - FXAA anti-aliasing
- **Dynamic Camera Movement**: Smooth scrolling-based camera control through the tunnel
- **Animated Objects**: Moving geometric objects with rotation animations
- **Particle Systems**: Dynamic particle effects throughout the scene
- **Neon Textures**: Billboard planes with neon-style textures
- **Audio Controls**: Built-in music player with mute/unmute functionality

## 🚀 Demo

The experience features:

- Scroll-controlled navigation through the tunnel
- Real-time color cycling and audio-reactive effects
- Smooth post-processing transitions
- Background music with audio analysis

## 🛠️ Technologies Used

- **Three.js** - 3D graphics library
- **Vite** - Build tool and development server
- **WebGL** - Hardware-accelerated graphics
- **Web Audio API** - Real-time audio analysis
- **GLSL Shaders** - Custom visual effects

## 📦 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd vitejs-vite-evypwpe2
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 Controls

- **Mouse Wheel**: Navigate forward/backward through the tunnel
- **Mute Button**: Toggle background music on/off (top-right corner)

The faster you scroll, the more intense the visual effects become!

## 📁 Project Structure

```
src/
├── main.js                     # Main application entry point
├── style.css                   # Global styles
├── audio/
│   └── audioManager.js         # Audio handling and analysis
├── controls/
│   └── cameraController.js     # Camera movement and scroll controls
├── effects/
│   └── postProcessingManager.js # Post-processing effects pipeline
├── geometry/
│   └── tunnelGeometry.js       # Tunnel generation and wireframe
├── objects/
│   └── sceneObjects.js         # 3D objects, particles, and animations
└── shaders/
    ├── index.vert              # Vertex shader
    ├── index.frag              # Fragment shader (radial blur)
    └── radialBlurShader.js     # Shader configuration

public/
├── textures/                   # Neon texture assets
├── neon-shadows.mp3           # Background music
├── sound.svg                  # Audio control icons
└── muted.svg
```

## 🎨 Visual Effects

### Post-Processing Pipeline

1. **Render Pass**: Base scene rendering
2. **Bloom Pass**: Creates glowing neon effects
3. **Radial Blur**: Speed-based motion blur
4. **RGB Shift**: Retro chromatic aberration
5. **FXAA**: Anti-aliasing for smooth edges

### Audio Reactivity

- **Bass Frequency Analysis**: Affects RGB shift intensity
- **Mid Frequency Analysis**: Influences neon plane scaling
- **Real-time Spectrum**: Updates visual effects dynamically

### Dynamic Elements

- **Color Cycling**: HSL-based color transitions
- **Moving Objects**: Wireframe geometries with rotation
- **Particle System**: Ambient floating particles
- **Tunnel Lines**: Dynamic color-changing wireframe

## ⚙️ Configuration

### Performance Settings

- Automatic device pixel ratio detection (capped at 2x)
- Optimized render loop with `requestAnimationFrame`
- Efficient geometry instancing for moving objects

### Audio Settings

- Automatic audio context initialization
- Frequency analysis with 64 FFT size
- Smooth audio data processing

## 🔧 Development

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Performance Monitoring

The project includes `stats.js` for real-time performance monitoring:

- FPS counter
- Memory usage
- Render time statistics

## 🎵 Audio Assets

Place your audio files in the `public/` directory:

- `neon-shadows.mp3` - Background music (included)
- Format: MP3, OGG, or WAV
- Recommended: Loopable tracks for seamless experience

## 🖼️ Texture Assets

Neon textures are located in `public/textures/`:

- Support for PNG format with transparency
- Recommended size: 512x512 or 1024x1024
- Used for billboard neon signs throughout the tunnel

## 🐛 Known Issues

- Audio autoplay may be blocked by browser policies (user interaction required)
- Performance may vary on lower-end devices
- WebGL support required

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

**Enjoy your journey through the neon tunnel! 🌈✨**
