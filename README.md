# SchemaForge - AI-Powered Database Schema Designer

SchemaForge is a free, open-source visual database design tool inspired by [DrawDB](https://www.drawdb.app/). It empowers developers to design, visualize, and generate SQL schemas with the help of modern AI.

## Features

*   **Visual Editor**: Drag-and-drop tables, intuitive relationship mapping, and auto-layout.
*   **AI-Powered Generation**: Describe your schema in plain English (e.g., "E-commerce system") and let Gemini AI build it for you.
*   **SQL Export & Import**:
    *   Export DDL scripts for PostgreSQL, MySQL, SQLite, and SQL Server.
    *   Import existing SQL scripts to generate diagrams automatically.
*   **Real-time Collaboration**: Sync projects to the cloud (Supabase) and see live cursors from teammates.
*   **Guest Mode**: Try the AI features without an API key (limited daily quota).
*   **Templates**: Pre-built schemas for SaaS, E-commerce, Blogs, etc.
*   **Secure**: Projects are stored locally in the browser or synced securely to your Supabase instance.

## Tech Stack

*   **Frontend**: React 18, Vite, TypeScript
*   **State Management**: Zustand
*   **Visualization**: React Flow
*   **Styling**: Tailwind CSS
*   **Backend / Realtime**: Supabase
*   **AI**: Google Gemini API (@google/genai)

## Getting Started (Local Development)

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/edmarcres18/schema_forge.git
    cd schema_forge
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory. You can copy `.env.example` if available.
    ```env
    # Optional: For Cloud Sync & Realtime Collaboration
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Optional: For funding Guest AI usage (if you are hosting for others)
    # If not provided, users must enter their own key in Settings.
    VITE_API_KEY=your_gemini_api_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Self-Hosting / Deployment

This project is a static Single Page Application (SPA) and can be deployed anywhere (Vercel, Netlify, GitHub Pages, Docker/Nginx).

### Build for Production
```bash
npm run build
```
The output will be in the `dist/` folder.

### Supabase Setup (Optional)
If you want to enable cloud saving and real-time collaboration:

1.  Create a project at [Supabase](https://supabase.com).
2.  Go to the SQL Editor and run the script found in `supabase.sql` (in the repo root or provided in the setup guide). This creates the `projects` and `daily_usage` tables and sets up Row Level Security (RLS) policies.
3.  Add your Supabase URL and Anon Key to your deployment environment variables.

### Deploying to Vercel
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables (`VITE_SUPABASE_URL`, etc.) in Vercel settings.
4.  Deploy.

## License
MIT License
