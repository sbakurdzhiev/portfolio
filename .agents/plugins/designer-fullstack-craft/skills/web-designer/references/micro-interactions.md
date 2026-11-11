# Tactile Micro-Interactions Guide

1. **Button Hover & Active**:
   - Translate subtle `-1px` on Y axis on hover.
   - Ring or glowing drop shadow (`0 0 15px rgba(0, 212, 255, 0.3)`).
   - Instant response on active/click (`scale(0.98)`).
2. **Audio Feedback (Web Audio API)**:
   - Synthesize short, pleasant sine/triangle wave clicks on keypresses (`0.02s` duration).
   - Chimes on successful deployment or form submission.
   - Always provide a visible mute/unmute control.
3. **Keyboard Accessibility**:
   - Numbered tabs (`1-6`) for fast switching.
   - Global shortcuts (e.g. backtick `` ` `` to toggle CLI shell).
