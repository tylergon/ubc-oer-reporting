# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from dataclasses import dataclass


# @dataclass
# class SpideyItem:
#     # define the fields for your item here like:
#     # name: str | None = None
#     pass

@dataclass
class Faculty:
    id: str | None = None
    name: str | None = None
    pass

@dataclass
class AcademicUnit:
    id: str | None = None
    name: str | None = None
    faculty_id: str | None = None
    pass

@dataclass
class AcademicStaff:
    name: str | None = None
    rank: str | None = None
    faculty_id: str | None = None
    unit_id: str | None = None
    pass
