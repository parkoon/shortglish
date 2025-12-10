# Video Learning Page Specification (Mobile Web)

## Overview
This document describes the functional specifications for a **mobile web** video learning page that displays educational video content with interactive subtitles, practice modes, and learning features. This specification is optimized for mobile devices and touch interactions.

## Page Structure

### Route
- Path: `/videos/[videoId]`
- Dynamic parameter: `videoId` (string) - Unique identifier for the video

### Main Components

#### 1. VideoContent (Main Container)
- Manages overall page state and data fetching
- Coordinates between video player and subtitle display
- Handles video playback state and subtitle tracking

#### 2. VideoHeader
- Displays video player and metadata (single column layout for mobile)
- Contains custom video controls optimized for touch
- Shows title, synopsis, and share button

#### 3. SubtitleDisplay
- Displays current subtitle card
- Shows previous/next subtitle navigation
- Practice mode toggle

#### 4. CustomVideoController
- Playback controls (play/pause, previous/next)
- Playback rate selector
- Repeat mode toggle

---

## Core Features

### 1. Video Player Integration

#### Player Requirements
- Must support embedding external video content (e.g., YouTube, Vimeo, custom player)
- Must expose the following methods:
  - `play()` - Start playback
  - `pause()` - Pause playback
  - `seekTo(seconds: number)` - Jump to specific time
  - `getCurrentTime()` - Get current playback time in seconds
  - `getDuration()` - Get total video duration in seconds
  - `getPlayerState()` - Get current player state
  - `setPlaybackRate(rate: number)` - Set playback speed

#### Player States
The player must support the following states:
- `UNSTARTED: -1` - Player not initialized
- `ENDED: 0` - Video playback ended
- `PLAYING: 1` - Video is playing
- `PAUSED: 2` - Video is paused
- `BUFFERING: 3` - Video is buffering
- `CUED: 5` - Video is cued/ready

#### State Change Callback
- Player must call `onStateChange(state: number)` whenever playback state changes
- This callback is critical for subtitle tracking and UI updates

---

### 2. Subtitle System

#### Subtitle Data Structure
Each subtitle entry must contain:
```typescript
{
  original: string;           // Original text in target language
  pronunciation: string;      // Phonetic pronunciation guide
  translation: string;         // Translation to user's language
  grammar: Array<{            // Grammar explanations (optional)
    pattern: string;          // Grammar pattern
    explanation: string;      // Explanation of the pattern
    example: string;          // Example usage
  }>;
  culture: string | null;     // Cultural context (optional)
  timestamps: {               // Human-readable timestamps
    from: string;             // Format: "00:00:00,000"
    to: string;               // Format: "00:00:17,680"
  };
  offsets: {                  // Precise timing in milliseconds
    from: number;             // Start time in ms (e.g., 0)
    to: number;               // End time in ms (e.g., 17680)
  };
}
```

#### Video Detail Data Structure
```typescript
{
  title: string;              // Video title
  synopsis: string;           // Video description/summary
  contents: Array<Subtitle>;   // Array of subtitle entries
}
```

---

### 3. Subtitle Tracking

#### Real-time Tracking
- Must track current playback time continuously while video is playing
- Use `requestAnimationFrame` for smooth, efficient tracking
- Check player's current time every frame
- Match current time against subtitle offsets to find active subtitle

#### Tracking Logic
1. When video starts playing (`PLAYING` state):
   - Start tracking loop
   - Check current time against subtitle offsets
   - Update displayed subtitle when time matches

2. When video pauses or stops:
   - Stop tracking loop
   - Keep current subtitle displayed

3. When subtitle ends:
   - Find next subtitle that matches current time
   - If no subtitle matches, keep previous subtitle visible

#### Repeat Mode
- When repeat mode is active AND practice mode is active:
  - When current subtitle ends, automatically seek back to subtitle start time
  - Creates a loop effect for practice

---

### 4. Navigation Controls

#### Previous/Next Subtitle
- **Previous Button**: 
  - Find current subtitle index in contents array
  - If not first subtitle, move to previous subtitle
  - Update displayed subtitle
  - Seek video player to previous subtitle's start time (`offsets.from / 1000`)

- **Next Button**:
  - Find current subtitle index in contents array
  - If not last subtitle, move to next subtitle
  - Update displayed subtitle
  - Seek video player to next subtitle's start time (`offsets.from / 1000`)

#### Play/Pause
- Toggle between playing and paused states
- Update UI to show appropriate icon (Play or Pause)

#### Playback Rate
- Supported rates: `[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]`
- User can select playback speed from touch-friendly dropdown menu
- Large touch targets for mobile
- Apply rate to video player immediately

---

### 5. Practice Mode

#### Toggle Switch
- Located in subtitle card header
- Label: "Practice Mode"
- Toggle state: `isPracticeActive` (boolean)

#### Behavior When Active
1. **Hide Subtitle Content**:
   - Original text, pronunciation, translation are hidden
   - Grammar and culture sections are hidden
   - Show placeholder UI with "Press to see subtitles" message

2. **Press to Reveal**:
   - User can press/hold on subtitle card to temporarily reveal content
   - While pressing, show full subtitle content
   - Release to hide again

3. **Visual Indicator**:
   - Card border changes color when practice mode is active
   - Cursor changes to pointer

4. **Touch Interaction Handling**:
   - Touch start: Show subtitle
   - Touch end: Hide subtitle
   - Ignore touches on switch button itself
   - Support both tap and hold gestures

#### Repeat Mode Interaction
- When practice mode is active, repeat mode is automatically enabled
- Repeat button is disabled when practice mode is active
- When practice mode is active, subtitle automatically loops

---

### 6. Repeat Mode

#### Toggle Button
- Located in custom video controller
- Visual indicator when active (highlighted color)
- Disabled when practice mode is active

#### Behavior
- When active AND practice mode is active:
  - Current subtitle automatically loops
  - When subtitle ends, seek back to start time

---

### 7. Subtitle Display

#### Card Layout (Mobile Optimized)
- Full width card (mobile viewport)
- Fixed height: 420px (or appropriate mobile height)
- Scrollable content area (vertical scroll)
- Header section with:
  - Current subtitle index (e.g., "5 / 20")
  - Practice Mode switch (touch-friendly)

#### Content Display
- **Always Visible**:
  - Original text (large, bold, mobile-readable)
  - Pronunciation (smaller, muted)
  - Translation (smaller, muted)

- **Conditionally Visible** (only for active subtitle):
  - Grammar section with list of patterns
  - Culture section with cultural context

#### Navigation Arrows (Touch Optimized)
- Left arrow: Previous subtitle (only if previous exists)
- Right arrow: Next subtitle (only if next exists)
- Positioned absolutely on card edges
- Large touch targets (minimum 44x44px for mobile)
- Smooth animations on tap
- Visual feedback on touch (scale animation)

#### Visual States
- Active subtitle: Full content visible
- Single subtitle card displayed at a time (mobile view)

---

### 8. Share Functionality

#### Share Button
- Located below synopsis in video header
- Icon: Share icon
- Label: "Share" (or "Sharing..." when active)

#### Share Behavior (Mobile Optimized)
1. **Web Share API** (Primary method for mobile):
   - Use native share dialog on mobile devices
   - Share title, synopsis, and current page URL
   - Show success toast on completion
   - This is the primary sharing method on mobile web

2. **Clipboard Fallback** (if Web Share API unavailable):
   - Copy current page URL to clipboard
   - Show success toast: "Link copied to clipboard!"
   - Note: Clipboard API may have limitations on some mobile browsers

3. **Error Handling**:
   - If share fails, fallback to clipboard copy
   - Show error toast if clipboard copy also fails
   - Provide clear feedback to user

---

### 9. Video End Modal

#### Trigger
- When player state changes to `ENDED`

#### Modal Content
- Title: "Video Ended"
- Description: "Great job! Continue learning with other videos."
- Button: "Go to Home"
- Action: Navigate to home page (`/`)

#### Behavior
- Modal appears automatically when video ends
- User can close modal or click button to go home
- Modal can be dismissed by clicking outside or close button

---

### 10. Data Fetching

#### API Requirements
- Endpoint: `GET /api/videos/[videoId]` or equivalent
- Returns: `VideoDetail` object
- Must handle loading states
- Must handle error states

#### Loading State
- Show loading skeleton/placeholder while fetching
- Display appropriate loading UI

#### Error State
- Show error message if fetch fails
- Provide retry option if applicable

---

## State Management

### Required State Variables

```typescript
{
  // Video data
  video: VideoDetail | null;
  isLoading: boolean;
  error: Error | null;
  
  // Player state
  playerState: number;  // Player state constant
  playerRef: RefObject<PlayerRef>;
  
  // Subtitle state
  currentSubtitle: Subtitle | null;
  
  // Mode states
  isPracticeActive: boolean;
  isRepeatActive: boolean;
  
  // UI states
  showEndModal: boolean;
}
```

---

## Key Interactions

### 1. Video Playback Flow
1. User loads page → Fetch video data
2. Video player initializes → Ready state
3. User clicks play → State changes to PLAYING
4. Subtitle tracking starts → Updates current subtitle
5. Video plays → Subtitles update in real-time
6. Video ends → Modal appears

### 2. Subtitle Navigation Flow (Touch)
1. User taps Previous/Next button → Find subtitle index
2. Update current subtitle state
3. Seek player to subtitle start time
4. Subtitle tracking updates to new subtitle
5. Provide haptic feedback (if available) on successful navigation

### 3. Practice Mode Flow (Touch)
1. User toggles Practice Mode ON (tap switch)
2. Subtitle content hides → Shows placeholder
3. User touches and holds card → Content reveals temporarily
4. User releases touch → Content hides again
5. If repeat mode also active → Subtitle loops automatically
6. Prevent page scroll while touching card in practice mode

---

## Technical Requirements

### Performance
- Use `requestAnimationFrame` for subtitle tracking (not setInterval)
- Clean up animation frames on component unmount
- Debounce rapid state changes if needed

### Accessibility (Mobile)
- All buttons must have `aria-label` attributes
- Touch targets must be at least 44x44px (iOS) or 48x48px (Android)
- Screen reader friendly labels
- Support for mobile screen readers (VoiceOver, TalkBack)

### Browser Compatibility (Mobile Web)
- **iOS Safari**: Full support for Web Share API, Clipboard API, requestAnimationFrame
- **Android Chrome**: Full support for Web Share API, Clipboard API, requestAnimationFrame
- **Samsung Internet**: Full support for Web Share API, Clipboard API, requestAnimationFrame
- **Mobile Firefox**: Limited Web Share API support, Clipboard API, requestAnimationFrame
- **Mobile Edge**: Full support for Web Share API, Clipboard API, requestAnimationFrame

### Mobile-Specific Considerations
- Viewport meta tag required: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Touch event handling (touchstart, touchend, touchmove)
- Prevent default touch behaviors when needed (e.g., prevent scrolling during practice mode press)
- Optimize for portrait orientation (primary mobile usage)
- Consider landscape orientation support if needed
- Handle safe area insets for devices with notches

---

## Data Flow

```
Page Load
  ↓
Fetch Video Data (videoId)
  ↓
Initialize Player
  ↓
Player Ready → Start Tracking (if playing)
  ↓
Tracking Loop:
  - Get current time
  - Find matching subtitle
  - Update UI
  ↓
User Interactions:
  - Previous/Next → Update subtitle + Seek player
  - Play/Pause → Update tracking state
  - Practice Mode → Toggle visibility
  - Repeat Mode → Toggle looping
  ↓
Video Ends → Show Modal
```

---

## Edge Cases

### 1. No Subtitle Match
- Keep previous subtitle visible
- Don't show null/empty state

### 2. Subtitle Gap
- If time is between subtitles, show last subtitle
- Resume tracking when next subtitle starts

### 3. Rapid Navigation
- Ensure seek operations complete before next operation
- Prevent race conditions in subtitle tracking

### 4. Practice Mode + Navigation
- When navigating in practice mode, new subtitle should be hidden
- User must press to reveal new subtitle

### 5. Network Errors
- Show error state
- Allow retry
- Don't break existing UI if data was previously loaded

---

## Implementation Notes

### Subtitle Tracking Hook
- Custom hook: `useSubtitleTracking`
- Parameters:
  - `contents`: Array of subtitles
  - `playerRef`: Reference to player instance
  - `currentSubtitle`: Currently displayed subtitle
  - `repeatMode`: Whether repeat mode is active
  - `onSubtitleFound`: Callback when subtitle changes

- Returns:
  - `startTimeTracking()`: Start the tracking loop
  - `stopTimeTracking()`: Stop the tracking loop

### Player Interface
The player must implement this interface:
```typescript
interface PlayerRef {
  play(): void;
  pause(): void;
  seekTo(seconds: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  setPlaybackRate(rate: number): void;
}
```

---

## Testing Scenarios

### 1. Basic Playback
- Video plays and subtitles update correctly
- Subtitles match video timing

### 2. Navigation
- Previous/Next buttons work correctly
- Player seeks to correct time
- Subtitle updates immediately

### 3. Practice Mode
- Toggle works correctly
- Content hides/shows as expected
- Press to reveal works

### 4. Repeat Mode
- Subtitle loops when active
- Works with practice mode
- Disabled when practice mode active

### 5. Video End
- Modal appears when video ends
- Navigation to home works

### 6. Share (Mobile)
- Web Share API works on mobile browsers
- Native share dialog appears correctly
- Clipboard fallback works if Web Share API unavailable
- Error handling works correctly
- Touch feedback on share button

---

## Mobile Web Layout

### Page Structure (Mobile)
- **Single Column Layout**: All content stacked vertically
- **Video Player**: Full width, aspect ratio maintained
- **Video Controls**: Below video player, touch-optimized
- **Title & Synopsis**: Below video player, full width
- **Share Button**: Below synopsis, touch-friendly size
- **Subtitle Card**: Full width, below video header section
- **Spacing**: Appropriate mobile spacing between sections

### Touch Interactions
- All interactive elements must have minimum 44x44px touch targets
- Provide visual feedback on touch (scale, highlight, etc.)
- Prevent accidental touches (adequate spacing between buttons)
- Support swipe gestures if applicable (e.g., swipe to next subtitle)

### Performance (Mobile)
- Optimize for mobile network conditions
- Lazy load non-critical content
- Minimize re-renders
- Use efficient animation (transform, opacity)
- Consider battery impact of continuous tracking

---

## Summary

This page provides an **mobile-optimized** interactive video learning experience with:
- Real-time subtitle tracking synchronized with video playback
- Touch-optimized practice mode for active learning (hide/show subtitles)
- Touch-friendly navigation controls for subtitle-by-subtitle learning
- Mobile-friendly playback speed control
- Repeat mode for focused practice
- Native mobile share functionality (Web Share API)
- Completion modal optimized for mobile screens

All features are designed specifically for mobile web browsers with touch interactions, ensuring a smooth learning experience on smartphones and tablets.

