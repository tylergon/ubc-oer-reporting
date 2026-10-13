import scrapy

from spidey.items import AcademicStaff, AcademicUnit, Faculty

class AcademicCalendarSpider(scrapy.Spider):
    name = "academic-calendar"
    start_urls = [
        "https://vancouver.calendar.ubc.ca/faculties-colleges-and-schools"
    ]

    def parse(self, response):
        faculty_list = response.xpath("//h3[normalize-space()='Contents']/following-sibling::ol[1]")
        
        for a in faculty_list.xpath("./li/a"):
            faculty_name = a.xpath("normalize-space()").get()
            faculty_path = a.xpath("@href").get()
            faculty_id = faculty_name.replace(" ", "-").replace(",",'').lower()

            yield Faculty(id=faculty_id, name=faculty_name)
            
            if faculty_path is not None and 'landscape' in faculty_id:
                yield scrapy.Request(
                    faculty_path,
                    callback=self.parse_units,
                    cb_kwargs={'faculty': faculty_id},
                )

    def parse_units(self, response, faculty):
        if "academic-staff" not in response.url:
            yield scrapy.Request(
                f'{response.url}/academic-staff',
                callback=self.parse_units,
                cb_kwargs={'faculty': faculty}
            )
            return
        
        academicUnitList = response.xpath("//h3[normalize-space()='Contents']/following-sibling::ol[1]")

        # TODO waht if no units?

        for a in academicUnitList.xpath("./li/a"):
            unit_name = a.xpath("normalize-space()").get()
            unit_path = a.xpath("@href").get()
            unit_id = unit_name.replace(" ", "-").lower()
            yield AcademicUnit(id=unit_id, name=unit_name, faculty_id=faculty)

            if unit_path is not None:
                yield scrapy.Request(
                    unit_path,
                    callback=self.parse_academics,
                    cb_kwargs={
                        'faculty': faculty,
                        'unit': unit_id,
                    }
                )

    def parse_academics(self, response, faculty, unit):
        # Get the element describing academic title
        title_selector = response.css("div.field").css("h4")
        group_selector = response.css("div.field").css("h4 + p")

        print('mde iat')

        for t, g in zip(title_selector, group_selector):
            title = t.xpath("normalize-space()").get()
            members = [s.xpath("normalize-space()").get() for s in g.css("strong")]

            for name in members:
                yield AcademicStaff(
                    name=name,
                    rank=title,
                    faculty_id=faculty,
                    unit_id=unit,
                )
