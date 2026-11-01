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
    - *This is done by Docker when deploying*.

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

SvelteKit 2 (Svelte 5 and TypeScript) app styled using Tailwind v4. There is no login/user control, anyone who can access it can upload data.

- \[[LINK](https://svelte.dev/docs/kit/environment-variables)\] Environment variables in SvelteKit
- \[[LINK](https://svelte.dev/docs/kit/server-only-modules)\] Explanation of SvelteKit's `$lib/server` structure

#### Data Management

The database is initialized on app start-up in `$lib/server/db.ts`. This manages the creation of all necessary tables.

Each domain (Courses, Users, and Resources) has a corresponding file found in `$lib/server/`. All logic pertaining to the domain should reside in these files. This includes:

1. Type definitions (database and application-level models) and validation. 
2. Database access (create, read, write, and queries).
3. Helper functions specific to the domain.

The below clode block outlines the upload process for data

```
1. src/routes/submission/+page.svelte     # User input and submission
2. src/routes/submission/+page.server.ts  # Parses request, validates and orchestration
3. src/lib/server/{domain}.ts             # Data transformation and insert
4. Postgres                               # Persistance
```

**Note**: The academic period is defined as `YYYYST` (e.g. `2026S1` or `2026S2`) to support aggregations done by the reporting dashboard, which splice the string to fetch the year or term.

#### Reporting Dashboard

The reporting dashboard uses SvelteKit's [data loading functionality](https://svelte.dev/docs/kit/load) to aggregate reports. When the user opens the page, they select a type of report.

```
1. src/routes/reporting/+page.svelte        # Basic UI
2. src/routes/reporting/components/IndividualReport.svelte
                                            # Individualized report UI
3. src/routes/reporting/+page.server.ts     # Orchestrates data fetch
4. src/lib/server/reporting.ts              # Database aggregation queries
``` 

The reporting page's server file `+page.server.ts` orchestrates report generation while `lib/server/reporting.ts` contains implementations for aggregating of report generating queries. For example, the workflow for adding a new report to the `IndividualReport` component includes:

1. `reporting.ts` -- Implementing the query. 
2. `+page.server.ts` -- Update `getIndividualReports` by: (1) updating the `Promise.all` statement to execute the newly implemented query and (2) updating the return statement.
3. `IndividualReport.svelte` -- Add the new report to the `$props` assignment and render results.

Faculty and department level reports have not yet been implemented, but the implementation workflow should remain the same, primarily differing in the aggregation performed in `reporting.ts`.

### Crawler

The web scraper crawls the [UBC Academic Calendar](https://vancouver.calendar.ubc.ca/faculties-colleges-and-schools) collecting data relating to Faculties, Academic Units, and Professors.

1. The crawler collects all links from the body of the **Faculties, Colleges, and Schools** document. Each link's text is used to construct a `Faculty` object, while the `href` is followed to continue crawling in `parse_units`.

2. The crawler appends `/academic-staff` to it's current URL and branches depending on the pages state:
 or a list of academic units

    a. If the page contains a list of academic staff (e.g. [The School of Public Policy and Global Affairs](https://vancouver.calendar.ubc.ca/faculties-colleges-and-schools/school-public-policy-and-global-affairs/academic-staff)), the crawler goes directly to **Step 3**.

    b. If the page contains a list of academic units (e.g. [The Faculty of Science](https://vancouver.calendar.ubc.ca/faculties-colleges-and-schools/faculty-science/academic-staff)), the crawler collects all links from the document's body. The link's text is used to construct a `AcademicUnit` object and the `href` is followed to collect `AcademicStaff` in **Step 3**

3. The Academic Staff page groups staff by rank. Each rank contains a `<h4>` heading followed by a `<p>` tag listing staff of that rank. The crawler iterates through these groups, extracting each professor as an `AcademicStaff` object.
    - *This methodology is sensitive to changes in the HTML structure of the Academic Staff page, and may require adjustment if UBC changes its web design*

Once the raw scraped data has been collected, the `filter_outputs.py` file is used to clean up the results, performing the following tasks:

- Filters out faculties and academic units where no faculty members were found (e.g. **Courses of Study and Degrees**).
- Filters down faculty members to ranks matching `supported_ranks.csv`.
- Clean names by standardizing special characters and removing unexpected characters.
- Removes commas from academic unit names.

See the [Basic Commands](#basic-commands) section for a guide on using the crawler.

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

### Additional Work

- [ ] Additional reporting components for departments and faculties.
- [ ] Create an interface for admins to triage and accept submissions.
    - Database records include an `accepted` field, set to false by default.
- [ ] Pare down supported titles found in `crawler/config`.
- [ ] Update site copy to match project goals and messaging.

### Known Bugs

- [ ] Some schools exist at the department and faculty level (SPPGA)

### Nice-to-haves and longshots

- [ ] Build a web-scraper for courses
- [ ] Stronger type safety in TypeScript
