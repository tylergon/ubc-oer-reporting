# UBC OER Reporting

Open Educational Resource reporting platform providing a website for data collection and reporting, and a web scraper for collecting data regarding faculties and staff from the UBC Academic Calendar.

## Getting Started

The project uses [mise](https://mise.jdx.dev/) to manage dependencies. With mise installed, navigate to the base directory of the repository and install further requirements with the following:

```bash
mise trust          # Trusts the mise.toml file (read it first)
mise install        # High level configuration
mise run install    # Installs dependencies for sub-projects
```

Refer to the `mise.toml` file to see tool versioning. Use `mise doctor` to diagnose problems.

### Manual Configuration

- Secrets (e.g. connection string) should be configured in `web/.env`.
- A copy of `crawler/output` should be moved to `web/static/data`.
    - *This is managed by Docker for production*.

### Basic Commands

A further breakdown of commands can be found in the `mise.toml`.

- **`mise run install`** installs all dependencies (includes sub-projects)
- **`mise run web:dev`** starts the dev server
- **`mise run crawler:all`** runs the entire crawling pipeline
- **`mise run crawler:crawl`** runs just the crawling portion of the web scraper
- **`mise run crawler:filter`** runs just the filtering portion of the web scraper

## Deployment

`wip`

## Development

### Architecture

The repository is divided into related projects:

- **`crawler/`** scrapes faculty and staff data from the UBC Academic Calendar into cleaned/filtered JSON
- **`web/`** is a SvelteKit site allowing users to submit OER usage to create individual, departmental, and faculty level reporting

```
├── mise.toml           # project config + task runner
├── web/
│   ├── src/routes/     # pages and endpoints
│   ├── src/lib/server/ # database access and schema
│   └── schema.sql
└── crawler/
    ├── spidey/         # academic-calendar spider
    ├── config/         # supported ranks
    └── filter_outputs.py
```

### Web

`wip`

SvelteKit 2 (Svelte 5 and TypeScript) app styled using Tailwind v4. There is no login/user control, anyone who can access it can upload data.

- \[[LINK](https://svelte.dev/docs/kit/environment-variables)\] Environment variables in SvelteKit
- \[[LINK](https://svelte.dev/docs/kit/server-only-modules)\] Explanation of SvelteKit's `$lib/server` structure

**General Information**

- The database is initialized and shared from `$lib/server/db.ts`
- 
- The domain files `courses.ts`, `reports.ts`, and `users.ts` found in `$lib/server/` provide data structures, database logic, and additional logic pertainin to the 

**Data Upload.** Users input data through the `/submission` page -- `web/src/routes/submission`. Submitted data is processed in the corresponding `+page.server.ts` file where it is validated and written to the database. When entering a name, `minisearch` is used to index and fuzzy search through professor data found via the web scraper. The selected professor is used to auto-fill key information for the professor.

- 

**Reporting Dashboard.** The dashboard is located at `/reporting` -- `web/src/routes/reporting`. 

- `$lib/server/reports.ts` currently provides a collection of functions used to support the reporting dashboard. The 

---

- How does the data flow?
- How does one add new reporting features?
- Where is the database structure defined? 
- 2026W2 being used is important


### Crawler

!WIP

- Supported professors?
- What is being filtered

## Project Status

!WIP

### Complete

- [ ] Scraping of the academic calendar

### Remaining

- [ ] Aggregation page
- [ ] Docker
- [ ] Clean up the CSS of the input page
- [ ] Replace site copy & footer
- [ ] Better safety with users hitting submit multiple times
- [ ] Staging vs. accepted

### Nice-to-haves and longshots

- [ ] Stronger type safety in TypeScript (enforce domains)
- [ ] Build a web-scraper for courses

### Hand-off

- [ ] Clean up supported titles
- [ ] Clean up site copy