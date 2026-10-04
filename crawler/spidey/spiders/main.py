import scrapy

class AcademicCalendarSpider(scrapy.Spider):
    name = "academic-calendar"
    start_urls = [
        "https://vancouver.calendar.ubc.ca/faculties-colleges-and-schools"
    ]

    def parse(self, response):
        contents = response.xpath("//h3[normalize-space()='Contents']")
        facultyList = contents.xpath("following-sibling::ol[1]")
        for a in facultyList.xpath("./li/a"):
            print(a.xpath("normalize-space()").get(), a.xpath("@href").get())
        