# UBC OER Reporting

Open Educational Resource reporting platform providing a website for data collection and reporting, and a web scraper for collecting data regarding faculties and staff from the UBC Academic Calendar.

## Getting Started

The project uses [mise](https://mise.jdx.dev/) to manage dependencies. With mise installed, navigate to the base directory of the repository and install further requirements with the following:

```bash
mise trust          # Trusts the mise.toml file (read it first)
mise install        # High level configuration
mise run install    # Installs dependencies for sub-projects
```

Refer to the `mise.toml` file to see tool versioning. `mise doctor` can be used to diagnose problems.

## Commands

Breakdown of commands supported in the `mise.toml`.

### Setup

| Command | Description |
|---------|-------------|
| `mise run install` | Installs dependencies project-wide |
| `mise run web:install` | Installs dependencies for the web sub-project |
| `mise run crawler:install` | Installs dependencies for the web scraper sub-project |

The `install` command runs installation scripts for both sub-projects

### Website

| Command | Description |
|---------|-------------|
| `mise run web:dev` | Start the dev server |
| `mise run web:build` | Build the production app (outputs to `web/build/`) |
| `mise run web:check` | Type checks Svelte and TypeScript |
| `mise run web:format` | Formats the website's code |
| `mise run web:lint` | Checks the website's code formatting with fixing |

Prior to running the project:

1. Secrets should be configured in `web/.env`.
2. A copy of `crawler/output` should be moved to `web/static/data`.
    - *This is managed by Docker for production*.

### Crawler

| Command | Description |
|---------|-------------|
| `mise run crawler:all` | Runs the entire scraping pipeline |
| `mise run crawler:crawl` | Scrapes the academic calendar |
| `mise run crawler:filter` | Cleans scraped names and filters collected data |

Raw scraping results are output to the `crawler/scratch` directory, while cleaned + filtered results are output to `crawler/output`. 

## Architecture

The repository is divided into related projects:

- **`crawler/`** scrapes faculty and staff data from the UBC Academic Calendar into cleaned/filtered JSON
- **`web/`** is a SvelteKit site allowing users to submit OER usage to create individual, departmental, and faculty level reporting

```
├── mise.toml           # toolchain + task runner
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

!WIP

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