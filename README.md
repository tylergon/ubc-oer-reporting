# UBC OER Reporting

Open Educational Resource reporting platform providing a website for data collection and reporting, and a web scraper for collecting data regarding faculties and staff from the UBC Academic Calendar.

## Getting Started

The project uses [mise](https://mise.jdx.dev/) to manage dependencies. With mise installed, navigate to the base directory of the repository and install further requirements with the following:

```bash
mise trust          # Trusts the mise.toml file (read it first)
mise install        # High level configuration
mise run install    # Installs dependencies for sub-projects
```

Refer to the `mise.toml` file to see tool versioning.

## Architecture

The project is divided into two directories: `web` and `crawler`. 

### Website


Run from the `web` directory:

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (output to `build/`) |
| `npm run preview` | Preview the production build |
| `npm run 

### Crawler

#### Data Collection

Run the following commands from the `crawler` directory.

1. `scrapy crawl academic-calendar` - Identifies the initial list of faculties and academic staff. See `crawler/spidey/spiders/main.py`.
2. `uv run filter_outputs.py` - Cleans names to fix scraping artifacts and filters out unnecessary data.










## Architecture

## `crawler`

## Website

### Remaining

- [ ] Aggregation page
- [ ] Docker
- [ ] Clean up the CSS of the input page
- [ ] Replace site copy & footer

#### Longshots

- [ ] Better safety with users hitting submit multiple times
- [ ] Stronger type safety in TypeScript (enforce domains)

### Complete

- [ ] Scraping of the academic calendar
- [ ] 

## Notes

- Instead of a staging schema, all records are inserted with `accepted = false` and should be validated

Tasks for Paul

- [ ] Trim supported ranks found in `crawler/config`

## Data Collection