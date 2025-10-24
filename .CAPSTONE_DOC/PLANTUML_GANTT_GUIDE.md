# PlantUML Gantt Chart Guide for Smile Suite

## 📊 Files Created

1. **gantt_chart.puml** - Detailed version with all tasks
2. **gantt_chart_simple.puml** - Simplified version (recommended)

## 🚀 How to Use PlantUML Code

### Option 1: Online PlantUML Editor (Easiest)

1. **Go to**: https://www.plantuml.com/plantuml/uml/
2. **Copy** the entire content from `gantt_chart_simple.puml`
3. **Paste** into the text editor on the left
4. **Click** "Submit" or wait for auto-refresh
5. **Download** the generated image (PNG, SVG, or PDF)

### Option 2: VS Code with PlantUML Extension

1. **Install Extension**:

    - Open VS Code
    - Go to Extensions (Ctrl+Shift+X)
    - Search for "PlantUML"
    - Install "PlantUML" by jebbs

2. **Install Java** (required):

    - Download from https://www.java.com/download/
    - Install and restart VS Code

3. **Install Graphviz** (required):

    - Download from https://graphviz.org/download/
    - Install and add to PATH

4. **Use the Extension**:
    - Open `gantt_chart_simple.puml` in VS Code
    - Press `Alt+D` to preview
    - Right-click → "Export Current Diagram" to save as PNG/SVG

### Option 3: PlantUML Desktop App

1. **Download**: https://plantuml.com/download
2. **Run**: `java -jar plantuml.jar gantt_chart_simple.puml`
3. **Output**: PNG file will be generated in the same folder

---

## 🎨 Customizing Your Gantt Chart

### Change Colors

In the `.puml` file, modify the color codes:

```plantuml
[Task Name] is colored in #4472C4  // Blue
[Task Name] is colored in #70AD47  // Green
[Task Name] is colored in red      // Red for milestones
```

**Color Codes:**

-   `#4472C4` - Blue (Phase 1)
-   `#70AD47` - Green (Phase 2)
-   `red` - Red (Milestones)
-   `#FFC000` - Orange
-   `#7030A0` - Purple

### Change Dates

Simply modify the date values:

```plantuml
[Task Name] starts 2024-08-01 and lasts 2 weeks
[Milestone] happens 2024-11-08
```

### Add New Tasks

Add between the phase sections:

```plantuml
[New Task Name] starts 2024-XX-XX and lasts X weeks
[New Task Name] is colored in #70AD47
```

### Change Title

Modify the first line:

```plantuml
title Your Custom Title Here
```

---

## 📋 Quick Reference

### Task Syntax

```plantuml
[Task Name] starts YYYY-MM-DD and lasts X days
[Task Name] starts YYYY-MM-DD and lasts X weeks
[Task Name] starts YYYY-MM-DD and ends YYYY-MM-DD
```

### Milestone Syntax

```plantuml
[Milestone Name] happens YYYY-MM-DD
[Milestone Name] is colored in red
```

### Section Headers

```plantuml
-- Section Name --
```

### Colors

```plantuml
[Task] is colored in #HEXCODE
[Task] is colored in colorname
```

---

## 🎯 Recommended Version to Use

**Use `gantt_chart_simple.puml`** because:

-   ✅ Cleaner and more readable
-   ✅ Groups related tasks together
-   ✅ Easier to present and explain
-   ✅ Faster to render
-   ✅ Better for printing

**Use `gantt_chart.puml`** if you need:

-   Detailed breakdown of every task
-   Exact day-by-day timeline
-   More granular project tracking

---

## 💡 Tips for Best Results

### 1. Adjust Scale for Readability

```plantuml
projectscale monthly  // Shows months
projectscale weekly   // Shows weeks (default)
projectscale daily    // Shows days (too detailed)
```

### 2. Print Scale

```plantuml
printscale weekly     // Good for 12-month projects
printscale monthly    // Good for multi-year projects
```

### 3. Export High Quality

When exporting:

-   **For documents**: Use PNG at 300 DPI
-   **For presentations**: Use SVG (scalable)
-   **For printing**: Use PDF

### 4. Make it Fit on One Page

If the chart is too wide:

-   Use `projectscale monthly`
-   Combine similar tasks
-   Use the simple version

---

## 🖼️ Example Output

After pasting the code, you'll get a professional Gantt chart showing:

```
┌─────────────────────────────────────────────────────────┐
│  Smile Suite: Cloud-Based Dental Clinic as a Service   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Phase 1: Capstone Proposal (Jan-Jul 2024)            │
│  ████████████████████████████████████                  │
│                                          ◆ Jun 15      │
│                                                         │
│  Phase 2: Development to Defense (Aug-Dec 2024)       │
│  ████████████████████████████████████                  │
│                                          ◆ Nov 8       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### "Cannot generate diagram"

-   Make sure Java is installed
-   Check that Graphviz is installed (for VS Code)
-   Try the online editor instead

### "Syntax error"

-   Check date format: YYYY-MM-DD
-   Check that all brackets match: [ ]
-   Make sure each line ends properly

### Chart is too wide

-   Change `projectscale weekly` to `projectscale monthly`
-   Use the simple version
-   Combine similar tasks

### Colors not showing

-   Use hex codes: `#4472C4` instead of color names
-   Make sure the color line comes after the task definition

---

## 📥 Quick Start Commands

### Copy Simple Version

```bash
# Copy the content of gantt_chart_simple.puml
# Paste into https://www.plantuml.com/plantuml/uml/
# Download as PNG
```

### Generate from Command Line

```bash
# If you have PlantUML installed
java -jar plantuml.jar gantt_chart_simple.puml

# Output: gantt_chart_simple.png
```

---

## ✅ Final Checklist

Before using your Gantt chart:

-   [ ] Dates are correct (Jan-Dec 2024)
-   [ ] Phase 1 is blue, Phase 2 is green
-   [ ] Milestones are marked in red
-   [ ] Final Defense is November 8, 2024
-   [ ] Chart fits on one page
-   [ ] Title is correct
-   [ ] Exported in high quality (PNG/SVG/PDF)

---

## 🎓 For Your Capstone Document

1. Generate the chart using PlantUML
2. Export as high-quality PNG (300 DPI)
3. Insert into your document
4. Add caption: "Figure X. Smile Suite Project Timeline and Gantt Chart"
5. Reference it in your methodology section

Good luck with your capstone! 🚀
