import scrapy

class AcademicCalendarSpider(scrapy.Spider):
    name = "academic-calendar"
    start_urls = [
        "https://vancouver.calendar.ubc.ca/faculties-colleges-and-schools"
    ]

    def parse(self, response):
        contents = response.xpath("//h3[normalize-space()='Contents']")
        faculty_list = contents.xpath("following-sibling::ol[1]")
        
        for a in faculty_list.xpath("./li/a")[1:3]:
            faculty_name = a.xpath("normalize-space()").get()
            faculty_path = a.xpath("@href").get()
            faculty_id = faculty_name.replace(" ", "-").lower()
            
            yield { 'id': faculty_id, 'name': faculty_name }
            
            if faculty_path is not None:
                yield scrapy.Request(faculty_path, callback=self.parse_units)

    def parse_units(self, response):
        contents = response.xpath("//h3[normalize-space()='Contents']")
        academicUnitList = contents.xpath("following-sibling::ol[1]")

        for a in academicUnitList.xpath("./li/a"):
            unit_name = a.xpath("normalize-space()").get()
            unit_path = a.xpath("@href").get()
            unit_id = unit_name.replace(" ", "-").lower()

            # TODO: Missing the faculty
            yield { 'id': unit_id, 'name': unit_name }

            if unit_path is not None:
                yield scrapy.Request(unit_path, callback=self.parse_academics)

    def parse_academics(self, response):
        if "academic-staff" not in response.url:
            yield scrapy.Request(f'{response.url}/academic-staff', callback=self.parse_academics)
            return

        title_selector = response.css("div.field").xpath("./h4")
        titles = [i.xpath("normalize-space()").get() for i in title_selector]

        for i in response.css("div.field").xpath("./p")[1:]:
            for j in i.xpath("./strong"):
                academic_name = j.xpath("normalize-space()").get()

        

        