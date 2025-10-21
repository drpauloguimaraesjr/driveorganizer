# Design Guidelines: Document Search & Q&A Application

## Design Approach
**System-Based Approach**: Drawing from Material Design and Linear's clean productivity aesthetics, optimized for information-dense search interfaces with emphasis on readability, efficiency, and professional polish.

**Key Design Principles**:
- Information clarity over decoration
- Efficient visual hierarchy for scanning results
- Professional, trustworthy aesthetic for research/document tools
- Responsive layout prioritizing desktop workflows

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- Background Base: 222 15% 8%
- Surface Elevated: 222 15% 12%
- Surface Hover: 222 15% 16%
- Primary Action: 212 100% 48%
- Primary Hover: 212 100% 42%
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 70%
- Border Subtle: 222 15% 20%
- Success/Accent: 142 76% 36%

**Light Mode**:
- Background Base: 0 0% 100%
- Surface Elevated: 0 0% 98%
- Surface Hover: 220 14% 96%
- Primary Action: 212 100% 48%
- Text Primary: 222 47% 11%
- Text Secondary: 222 13% 45%
- Border Subtle: 220 13% 91%

### B. Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - UI, body text, results
- Monospace: 'JetBrains Mono' - code snippets, technical data

**Type Scale**:
- Display: 32px/40px, semibold - page headers
- Heading: 24px/32px, semibold - section titles
- Subheading: 18px/28px, medium - result titles
- Body: 15px/24px, regular - main content, descriptions
- Small: 13px/20px, regular - metadata, timestamps
- Caption: 12px/18px, medium - labels, tags

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (2, 4): Between related elements, icon-text gaps
- Component spacing (6, 8): Card padding, input padding
- Section spacing (12, 16): Between major sections, container padding

**Grid System**:
- Main container: max-w-6xl centered
- Search interface: Single column, full-width
- Results grid: Single column for scannable list view
- Filters sidebar: 280px fixed width on desktop, collapsible on mobile

---

## D. Component Library

### Navigation Header
- Fixed top bar with subtle shadow/border
- Logo/brand left-aligned
- Global search integration (if applicable) center-aligned
- User profile/settings right-aligned
- Height: 64px, horizontal padding: 24px

### Search Interface
- Prominent search input: Large (h-14), rounded corners (rounded-lg)
- Search icon left-positioned, clear button right-positioned
- Placeholder text guiding query format
- Focus state: Primary color border, subtle shadow
- Position: Top of main content area with generous top margin

### Filter Panel
- Collapsible sidebar on desktop (280px wide)
- Dropdown/accordion on mobile
- Filter groups: "Ano" (Year), "Área/Tema" (Topic)
- Each filter as radio buttons or checkboxes with clear labels
- Active filters displayed as removable tags above results
- "Clear All" option prominently placed

### Result Cards
- Full-width cards with subtle border, rounded-lg
- Card structure:
  - Result title (18px semibold) at top
  - Metadata row: year tag, topic tag, relevance score (small text)
  - Excerpt preview in bullet format (15px regular)
  - "View Full Document" link/button at bottom
- Hover state: Elevated shadow, border color shift
- Spacing between cards: 16px vertical gap

### Loading States
- Skeleton screens matching result card layout
- Subtle pulse animation on skeleton elements
- 3-4 skeleton cards visible during loading

### Empty States
- Centered illustration placeholder (optional simple icon)
- Clear message: "No results found" or "Start by entering a search query"
- Helpful suggestions below message
- Maintain vertical spacing consistency

### Tags/Badges
- Rounded-full pills for year and topic filters
- Small text (12px), medium weight
- Background: Surface elevated with border
- Removable tags include × icon on hover

### Buttons
- Primary: Solid background (Primary Action color), white text, rounded-md
- Secondary: Outline border, text matches border color, transparent background
- Ghost: Text-only, no border, subtle hover background
- Sizes: Default (h-10 px-6), Small (h-8 px-4)
- All buttons with smooth hover transitions (150ms)

### Form Inputs
- Height: 44px default, consistent with search bar
- Border: Subtle border color, rounded-md
- Focus: Primary color border, no ring
- Dark mode: Proper dark background, light text
- Labels: 13px medium weight, 8px margin-bottom

---

## E. Animations

**Minimal, Purposeful Motion**:
- Card hover: Transform scale(1.01) + shadow transition (200ms)
- Button hovers: Background color fade (150ms)
- Filter expand/collapse: Smooth height transition (300ms ease-in-out)
- Results fade-in: Opacity 0→1 stagger effect (100ms delay between cards)
- No decorative or scroll-triggered animations

---

## Special Considerations

**Information Density**: Results should be scannable - use consistent vertical rhythm, clear visual separation between cards, and hierarchical typography to guide eye through content.

**Responsive Behavior**:
- Desktop (1024px+): Sidebar filters, multi-line metadata
- Tablet (768-1023px): Collapsible filters, condensed metadata
- Mobile (<768px): Stack all elements, hamburger filter menu

**Accessibility**: Maintain 4.5:1 contrast ratios, keyboard navigation for all interactive elements, clear focus indicators, semantic HTML structure for screen readers.