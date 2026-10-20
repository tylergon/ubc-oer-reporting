# sv

## Tasks

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

Note, both commands should be run from the `crawler` directory.

1. `scrapy crawl academic-calendar` - Identifies the initial list of faculties and academic staff. See `crawler/spidey/spiders/main.py`.
2. `uv run filter_outputs.py` - Cleans names to fix scraping artifacts and filters out unnecessary data.
