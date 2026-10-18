# sv

Notes
- Instead of a staging schema, all records are inserted with `accepted = false` and should be validated

Requirements from Paul

- [ ] Trim supported ranks found in `crawler/config`

## Docker

TODO: Write the Dockerfile
TODO: What is .dockerignore?

## Data Collection

Note, both commands should be run from the `crawler` directory.

1. `scrapy crawl academic-calendar` - Identifies the initial list of faculties and academic staff. See `crawler/spidey/spiders/main.py`.
2. `uv run filter_outputs.py` - Cleans names to fix scraping artifacts and filters out unnecessary data.
