# SEGRO Sustainability Workbench

A high-fidelity, enterprise-grade agentic orchestration platform for managing ESG data workflows across European markets. Built with React, TypeScript, and Tailwind CSS, this application demonstrates a "live" orchestration system powered by HCL Universal Orchestrator using mocked data and simulated async processes.

## Overview

The SEGRO Sustainability Workbench is a single-page application (SPA) that provides real-time monitoring and management of meter data transposition workflows for the UL 360 platform. It features an intelligent agent-based system that automates data processing while maintaining human-in-the-loop oversight for critical decisions.

## Features

- **Live Orchestration Monitoring** - Real-time dashboard showing agentic workflow status across 8 European markets (UK, CZ, DE, ES, FR, IT, NL, PL)
- **UL 360 Upload Management** - Task-based workflow for downloading, uploading, and managing meter data files
- **Meter Registry Exception Handling** - Automated detection and resolution of missing meters with guided workflows
- **Data Validation** - Review and correct data quality issues with manual audit file uploads
- **Activity Log** - Comprehensive audit trail of all agent-generated and human actions with filtering
- **Files Archive** - Centralized repository of generated upload files, exception reports, and audit documents
- **AI-Powered Audit Requests** - Natural language interface for querying meter data and processing status
- **Data Quality Scoreboard** - Visual representation of data quality metrics by market

## Technology Stack

- **Framework**: Vite + React 18 (TypeScript)
- **Styling**: Tailwind CSS with custom SEGRO design tokens
- **State Management**: Zustand
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **Design System**: Custom components with SEGRO brand identity

### SEGRO Design Tokens

```css
Colors:
- segro-red: #C8191F (Primary)
- segro-red-dark: #9E0000 (Hover)
- segro-teal: #73AFB6 (Panels)
- segro-teal-accent: #00AAA5 (Success/Positive)
- segro-charcoal: #2B2B2B (Headers)
- segro-midgray: #4B4951 (Subtext)
- segro-lightgray: #EAEAEA (Borders)
- segro-offwhite: #F3F8FD (Background)

Typography: Plus Jakarta Sans, Montserrat
```

## Project Structure

```
segro-sustainability-workbench/
├── public/
│   └── segro-logo.png              # SEGRO brand logo
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Button.tsx             # Primary, secondary, outline variants
│   │   ├── Card.tsx               # Container with accent borders
│   │   ├── CircularProgress.tsx   # Quality score visualization
│   │   ├── MarketBadge.tsx        # Market identifier badges
│   │   └── StatusPill.tsx         # Status indicators
│   ├── mock/
│   │   └── data.ts                # Mock data for European markets
│   ├── pages/                     # Application pages
│   │   ├── Dashboard.tsx          # Main orchestration overview
│   │   ├── UL360Uploads.tsx       # Upload task workflows
│   │   ├── MeterExceptions.tsx    # Exception handling
│   │   ├── DataValidation.tsx     # Data quality management
│   │   ├── ActivityLog.tsx        # Audit trail
│   │   └── FilesArchive.tsx       # File management
│   ├── store/
│   │   └── useStore.ts            # Zustand state management
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   └── dateFormat.ts          # Date formatting utilities
│   ├── App.tsx                    # Main app component with routing
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd /home/node/txai-projects/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR).

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Environment Variables

The application uses the following environment variables (defined in `.env`):

```bash
# Required for deployment
VITE_BASE_PATH=/

# Application Settings
VITE_APP_NAME=SEGRO Sustainability Workbench
VITE_DEMO_MODE=true
```

## Application Workflows

### 1. Dashboard - Nerve Center
The dashboard provides a high-level view of the entire meter data transposition journey:
- **Workflow Stages**: Visual representation of Import, Upload, Exception, and Validation tasks
- **Data Quality Scoreboard**: Circular progress indicators showing quality scores for each market
- **Meter Data Cycle Details**: Status of current, pending, and stale data cycles
- **AI Audit Request**: Natural language interface for querying meter-specific audit details

### 2. UL 360 Uploads - Task-Based Workflow
Manage the upload process with a step-by-step workflow:
1. **Download File**: Download the generated meter data file
2. **Upload to UL 360**: Report successful or partial upload
3. **Error Report** (if partial): Upload corrected data for failed meters

### 3. Meter Registry Exceptions
Handle missing meters with a guided 4-step process:
1. **Identify Missing Meters**: Agent automatically detects discrepancies
2. **Download Exception File**: Generate file listing missing meters
3. **Import Registry**: Upload corrected registry from UL 360
4. **Reprocess Data**: Trigger agent to reprocess with updated registry

### 4. Data Validation Errors
Review and resolve data quality issues:
1. **Review Error Details**: Examine meters with data quality issues
2. **Add Fix Note**: Document the corrections made
3. **Upload Audit File**: Submit manual audit file with corrections

### 5. Activity Log
Comprehensive audit trail with filtering:
- Filter by Market (UK, CZ, DE, ES, FR, IT, NL, PL)
- Filter by Actor (Agent, Human)
- Real-time updates with relative timestamps

### 6. Files Archive
Centralized file management:
- Filter by Market and Type (Upload, Exception, Audit)
- Preview and download capabilities
- Metadata including cycle, generation date, and file size

## Mock Data & Simulation

The application uses realistic mock data representing:
- **8 European Markets**: UK, Czech Republic, Germany, Spain, France, Italy, Netherlands, Poland
- **Meter Data Cycles**: Monthly cycles with varying quality scores (0-98%)
- **Task States**: Pending, In Progress, Completed, Attention, Stale
- **Activity Logs**: Agent-generated and human-in-the-loop actions
- **Archive Files**: Upload files, exception reports, audit documents

Async processes are simulated using `setTimeout` to demonstrate:
- Agent processing delays (1.5-2 seconds)
- File generation workflows
- Status transitions
- Real-time updates

## Design Philosophy

### Enterprise Console Feel
- Clean, spacious layout with generous whitespace
- Subtle 2xl rounding on cards and panels
- Faint red concentric ring motif (5% opacity) in background
- Consistent SEGRO brand identity throughout

### Agentic Orchestration "Vibe"
- Live status indicators showing agent activity
- Clear distinction between Agent and Human actions
- Simulated processing delays to highlight automation
- Human-in-the-loop approval points

### Accessibility
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast meeting WCAG standards

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or start on a different port
npm run dev -- --port 3000
```

### Module Not Found Errors
Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
Clear TypeScript cache and rebuild:
```bash
rm -rf node_modules/.vite
npm run build
```

## Development Notes

### State Management
The application uses Zustand for global state management. All task updates and activity logs flow through the central store located in `src/store/useStore.ts`.

### Mock API Layer
Async functions in component files simulate API calls using `setTimeout`. Replace these with actual API calls when connecting to a backend.

### Adding New Markets
To add a new market:
1. Update the `Market` type in `src/types/index.ts`
2. Add market data to `src/mock/data.ts`
3. Define a color in `src/components/MarketBadge.tsx`

### Adding New Task Types
To add new task types:
1. Define the interface in `src/types/index.ts`
2. Create mock data in `src/mock/data.ts`
3. Add store actions in `src/store/useStore.ts`
4. Build the UI page in `src/pages/`
5. Add navigation in `src/App.tsx`

## Performance Considerations

- **Code Splitting**: React Router handles page-level code splitting
- **Optimized Images**: Logo is optimized PNG format
- **Minimal Bundle Size**: Only essential dependencies included
- **Tree Shaking**: Vite automatically removes unused code

## License

Proprietary - SEGRO plc & HCL Software

---

**Built by Leona** - Vibe coding Agent from HCL Software ✨
