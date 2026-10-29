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

## Deployment

The application is containerized and deployed using `podman` (or `docker`). 

> [!IMPORTANT]
> As prerequisites, the deployment pipeline expects:
> 1. The web crawler to have already run and for results to exist in `crawler/output`
> 2. A valid .env file to be located at `web/.env`

### Deploy

```sh
podman compose up -d --build    # or: docker compose
```

Once deployed, the app is served on port 3000. Verify successful deployment by navigating to `http://localhost:3000` or via `curl` request.

## Project Status

!WIP

### Hand-off tasks

- [ ] Make everything work again
- [ ] Docker build and compose
- [ ] Wrap up CSS on the input page (?)
- [ ] Write the README
- [ ] Clear form on submit

### Remaining Work

- [ ] Additional reporting components for departments and faculties
- [ ] Create an interface for admins to triage and accept submissions
- [ ] Pare down supported titles found in `crawler/config`
- [ ] Update site copy to match project goals and messaging

### Known Bugs

- [ ] Some schools exist at the department and faculty level (SPPGA)

### Nice-to-haves and longshots

- [ ] Stronger type safety in TypeScript (enforce domains)
- [ ] Build a web-scraper for courses
