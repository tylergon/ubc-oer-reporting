BOT_NAME = "spidey"
SPIDER_MODULES = ["spidey.spiders"]
NEWSPIDER_MODULE = "spidey.spiders"
ADDONS = {}

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# Concurrency and throttling settings
CONCURRENT_REQUESTS_PER_DOMAIN = 1
DOWNLOAD_DELAY = 1

# Set settings whose default value is deprecated to a future-proof value
FEED_EXPORT_ENCODING = "utf-8"

# Configure outputs
FEEDS = {
    "output/faculties.csv": {
        "format": "csv",
        "item_classes": ["spidey.items.Faculty"],
        "overwrite": True,
    },
    "output/academic_units.csv": {
        "format": "csv",
        "item_classes": ["spidey.items.AcademicUnit"],
        "overwrite": True,
    },
    "output/academic_staff.csv": {
        "format": "csv",
        "item_classes": ["spidey.items.AcademicStaff"],
        "overwrite": True,
    },
}
