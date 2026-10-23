PRD: Grand Central (Project Terminal)
1. Concept Statement
Grand Central is a Laravel-powered "Railway Control Center" for your local filesystem. Every coding project is a Train, every directory is a Track, and your dashboard is the Departure Board. It turns the messy act of "vibe coding" into a managed schedule of departures and arrivals.

2. Visual Theme & "Vibe"
Aesthetics: Art Deco, brass accents, deep navy blues, and "Solari" (split-flap) display boards.

Terminology: * The Yard: Your main projects folder.

Departure Board: The main dashboard showing active projects.

The Roundhouse: Where projects go to be refactored or archived.

Conductor: The Laravel service that scans your files.

All Aboard: The button that launches VS Code.

3. Core Features (The Stations)
3.1 The Solari Board (Dashboard)

The landing page isn't just a list; it’s a split-flap style display that flips through your projects.

Status Indicators: Projects aren't "active"; they are On Time, Delayed, or In the Yard.

Platform Assignment: Group projects by language (e.g., Platform 1: Laravel, Platform 2: React).

3.2 The Conductor (Scanner Service)

A Laravel Artisan command (php artisan conductor:inspect) that walks the tracks of your hard drive.

Manifest Reading: It looks for a manifest.json (formerly vibe.json) in your project folders to update the board.

Cargo Detection: It identifies the "cargo" (tech stack) by looking for composer.json, package.json, or .env.

3.3 The "All Aboard" Deep Link

Every project card features a brass "Ticket" button.

Action: Clicking the ticket triggers the vscode:// protocol to open the project.

Log: The system records the "Departure Time," tracking when you last worked on that specific vibe.

3.4 The Station Master (Project Management)

Each project expands into a dedicated "Station Master" view.

*   **The Timetable (Timeline):** Set "Arrival" (deadlines) and "Waypoints" (milestones) for the project.
*   **The Manifest (Tasks):** Detailed task lists and todo items for the project.
*   **Crew Assignments:** Assign tasks to specific "crew members" (if applicable) or role-play different hats (e.g., "Frontend Engineer", "Designer").

3.5 The Central Tower (Master View)

A comparative tool that aggregates data from all trains.

*   **Master Schedule:** A combined timeline view of all active projects to visualize overlaps and bottlenecks.
*   **Global Manifest:** A master list of all tasks across all projects, sortable by priority or deadline.
*   **Traffic Control:** Visual tools to adjust priorities and move "trains" to different tracks (timelines) to avoid collisions.

4. Technical Infrastructure (Laravel + Filament)
4.1 The Database Schema (trains table)

Field	Name	Theme Purpose
id	Train ID	Unique identifier.
name	Line Name	The project folder name.
path	Track Path	Absolute local directory path.
status	Schedule	On Time (active), Siding (paused), Scrapped (abandoned).
last_departure	Last Sync	The last time the folder was touched/opened.
4.2 The Starter Kit Setup

Foundation: Laravel Breeze (for the station master's login).

Control Panel: Filament PHP. We will customize the Filament theme to use Serif fonts and gold/brass borders to mimic the Grand Central clock.

5. The "Vibe" Roadmap
Stop 1: The Foundation (Day 1)

Install Laravel + Filament.

Set up the trains table and the Conductor service to scan your ~/Code directory.

Stop 2: The Departure Board (Day 2)

Build the public-facing "Solari Board" using Livewire for real-time updates.

Implement the "All Aboard" VS Code link.

Stop 3: The Station Master & Central Tower (Day 3-4)

Implement individual project views with Timetables (timelines) and Manifests (tasks).
Build the Central Tower for aggregated views and resource management.

Stop 4: The Telegraph (Notifications)

Integration with local notifications. If a project (Train) hasn't "departed" in 2 weeks, the Conductor sends a nudge to see if the project is still viable.