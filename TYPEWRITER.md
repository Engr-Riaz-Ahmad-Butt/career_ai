# Typewriter Effect - Implementation Guide

The typewriter effect cycles through different document types (Resumes, Cover Letters, CVs, etc.) with a smooth typing and deleting animation.

## ✨ What's Included

- **Typewriter Component** (`components/ui/Typewriter.tsx`) - Reusable typewriter with customizable speed
- **Blinking Cursor** - Animated gradient cursor that blinks
- **Two Hero Variations** - Choose your preferred headline style

## 🎯 Current Implementation

The hero now shows:

```
Build AI-Powered [Resumes|Cover Letters|CVs|SOPs|...]
That Get You Hired
```

The typewriter cycles through:
- Resumes
- Cover Letters
- CVs
- SOPs
- Scholarships
- LinkedIn Bios
- Portfolios

## 🔧 Customization

### Change the Words

Edit `/components/sections/Hero.tsx`:

```tsx
<Typewriter
  words={[
    "Resumes",           // Add or remove words
    "Cover Letters",
    "Your Custom Word",
  ]}
  typingSpeed={120}      // Speed of typing (ms per character)
  deletingSpeed={80}     // Speed of deleting (ms per character)
  delayBetweenWords={2000} // Pause before deleting (ms)
/>
```

### Change the Speeds

```tsx
typingSpeed={100}        // Faster typing
deletingSpeed={50}       // Faster deleting
delayBetweenWords={3000} // Longer pause (3 seconds)
```

### Change the Colors

The typewriter text uses a gradient. Edit in `Typewriter.tsx`:

```tsx
className="bg-gradient-to-r from-[#60a5fa] via-[#22d3ee] to-[#10b981]"
```

## 📝 Alternative Headline Options

### Option 1: Current (Multiline)
```
Build AI-Powered [Typewriter]
That Get You Hired
```

### Option 2: Inline (HeroAlt.tsx)
```
AI-Powered [Typewriter]
That Get You Hired
```

To use Option 2, replace in `app/page.tsx`:

```tsx
import Hero from "@/components/sections/Hero";
// Change to:
import Hero from "@/components/sections/HeroAlt";
```

## 🎨 Cursor Customization

The cursor is a blinking vertical line. To change it:

```tsx
// In Typewriter.tsx, find:
<span className="ml-1 w-[3px] h-[0.8em] bg-gradient-to-b from-[#60a5fa] to-[#22d3ee] animate-blink" />

// Modify:
w-[3px]     // Cursor width
h-[0.8em]   // Cursor height
ml-1        // Space from text
```

## 🚀 How It Works

1. **State Management** - Tracks current word, current text, and typing/deleting state
2. **useEffect Hook** - Runs on every character change
3. **Typing Phase** - Adds one character at a time
4. **Waiting Phase** - Pauses when word is complete
5. **Deleting Phase** - Removes one character at a time
6. **Loop** - Moves to next word and repeats

## 📦 Files Added/Modified

**New Files:**
- `components/ui/Typewriter.tsx` - Main typewriter component
- `components/sections/HeroAlt.tsx` - Alternative hero layout

**Modified Files:**
- `components/sections/Hero.tsx` - Updated headline with typewriter
- `styles/globals.css` - Added blink animation for cursor

## 🎯 SEO Tip

The typewriter is client-side only. For SEO, make sure your page title and meta description include all key terms:

```tsx
// In app/layout.tsx or page metadata
title: "AI Resume Builder | Cover Letters | CV Generator"
description: "Build ATS-optimized resumes, cover letters, CVs, and more..."
```

## 🐛 Troubleshooting

**Typewriter not showing?**
- Check that Hero component has `"use client"` at the top
- Verify Typewriter.tsx is in `components/ui/` folder

**Animation too fast/slow?**
- Adjust `typingSpeed`, `deletingSpeed`, `delayBetweenWords` props

**Cursor not blinking?**
- Check `styles/globals.css` has the `@keyframes blink` animation
- Verify `.animate-blink` class is added

## 💡 Pro Tips

1. **Keep words similar length** - Looks better when words are roughly the same size
2. **3-7 words ideal** - Too many words = long wait, too few = repetitive
3. **Match typing speed to reading speed** - Not too fast, not too slow
4. **Test on mobile** - Ensure headline fits on small screens with longest word

Enjoy your new typewriter effect! 🎉
