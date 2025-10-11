# 🎥 SmileyDy Chatbot Video Setup Guide

## Overview

This guide explains how to set up a 4-second video for the SmileyDy chatbot icon instead of a static image.

## 🎯 Implementation Options

### Option 1: HTML5 Video (Recommended)

-   **File formats**: MP4, WebM
-   **Pros**: Smaller size, better quality, more control
-   **Cons**: Requires modern browser support

### Option 2: Animated GIF

-   **File format**: GIF
-   **Pros**: Universal compatibility
-   **Cons**: Larger file size, less control

## 📁 File Structure

```
public/
├── icons/
│   ├── smiley.png (fallback image)
│   ├── smiley-video.mp4 (main video)
│   ├── smiley-video.webm (alternative format)
│   └── smiley-animated.gif (GIF alternative)
```

## 🎬 Video Specifications

### Recommended Settings:

-   **Duration**: 4 seconds
-   **Resolution**: 64x64px (or 128x128px for high-DPI)
-   **Format**: MP4 (H.264) + WebM
-   **Frame rate**: 24-30 FPS
-   **Loop**: Seamless loop
-   **File size**: < 500KB total

### Video Content Ideas:

-   Smiling face animation
-   Waving gesture
-   Blinking eyes
-   Bouncing motion
-   Rotating logo

## 🛠️ Implementation Steps

### Step 1: Create Your Video

1. **Record/Create** a 4-second video
2. **Export** in MP4 and WebM formats
3. **Optimize** for web (compress if needed)
4. **Test** the loop is seamless

### Step 2: Add Files to Project

```bash
# Place your video files in:
public/icons/smiley-video.mp4
public/icons/smiley-video.webm
```

### Step 3: Test the Implementation

The code is already updated to use video. Just add your video files!

## 🎨 Video Behavior

### Current Features:

-   **Auto-play**: Starts playing when page loads
-   **Loop**: Continuously loops
-   **Muted**: No sound (required for autoplay)
-   **Hover control**: Pauses on hover, resumes on leave
-   **Responsive**: Scales with button size
-   **Fallback**: Shows static image if video fails

### Customization Options:

#### Change Video Behavior:

```jsx
// To pause video when chatbot is open:
<SmileyDyIcon
    className="w-6 h-6 sm:w-7 sm:h-7 mx-auto group-hover:scale-110 transition-transform duration-300"
    isOpen={isOpen}
    pauseOnOpen={true} // Add this prop
/>
```

#### Add Click to Play:

```jsx
// Add onClick handler to video
<video
    onClick={(e) => e.target.play()}
    // ... other props
>
```

## 🔧 Alternative: GIF Implementation

If you prefer GIF over video, replace the SmileyDyIcon with:

```jsx
const SmileyDyIcon = ({ className = "w-6 h-6" }) => (
    <img
        src="/icons/smiley-animated.gif"
        alt="SmileyDy - Dental AI Assistant"
        className={className}
        style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
        }}
    />
);
```

## 📱 Mobile Considerations

### Video Performance:

-   **Battery usage**: Videos use more battery than images
-   **Data usage**: Consider file size for mobile users
-   **Autoplay**: May be restricted on some mobile browsers

### Optimization Tips:

-   Keep video file size small (< 200KB)
-   Use WebM format for better compression
-   Test on actual mobile devices
-   Consider disabling autoplay on mobile

## 🎯 Recommended Tools

### Video Creation:

-   **Adobe After Effects**: Professional animation
-   **Lottie**: Vector animations (lighter than video)
-   **Figma**: Simple animations
-   **Canva**: Easy video creation

### Video Optimization:

-   **HandBrake**: Video compression
-   **FFmpeg**: Command-line video processing
-   **Online tools**: CloudConvert, etc.

## 🚀 Advanced Features

### Lottie Animation (Alternative):

For even smaller file sizes, consider Lottie animations:

```jsx
import Lottie from "lottie-react";
import animationData from "/icons/smiley-animation.json";

const SmileyDyLottieIcon = ({ className = "w-6 h-6" }) => (
    <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
    />
);
```

## ✅ Testing Checklist

-   [ ] Video plays automatically
-   [ ] Video loops seamlessly
-   [ ] Video pauses on hover
-   [ ] Fallback image shows if video fails
-   [ ] Works on mobile devices
-   [ ] File size is reasonable (< 500KB)
-   [ ] Video quality is good at small sizes
-   [ ] No performance issues

## 🎨 Design Tips

1. **Keep it simple**: Complex animations can be distracting
2. **Match brand**: Use your brand colors and style
3. **Test at size**: View at actual button size (64x64px)
4. **Consider context**: Animation should fit the professional dental theme
5. **Accessibility**: Ensure it's not too fast or distracting

## 🔄 Switching Between Options

To switch between video and GIF, simply change the import in the SmileyDy component:

```jsx
// For video:
<SmileyDyIcon className="..." isOpen={isOpen} />

// For GIF:
<SmileyDyGifIcon className="..." />
```

The implementation is flexible and ready for your video files!
