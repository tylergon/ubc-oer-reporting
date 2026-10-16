import pandas as pd
import unicodedata
import re

def clean_academic_name(name: str):
    if not isinstance(name, str):
        return ""
    name = unicodedata.normalize("NFC", name)
    name = re.sub(r"[^\w\s'\-]|[\d_]", "", name)
    name = re.sub(r"\b(\w)\s", r"\1. ", name)
    return re.sub(r"\s+", " ", name).strip()

def clean_unit_id(unit_id: str):
    if not isinstance(unit_id, str):
        return ""
    return unit_id.replace(",", "")

# Read input
staff = pd.read_csv('scratch/scraped_academic_staff.csv')
faculties = pd.read_csv('scratch/scraped_faculties.csv')
supported_ranks = pd.read_csv('config/supported_ranks.csv')

# Clean the name & unit IDs from unexpected characters
staff["name"] = [clean_academic_name(name) for name in staff["name"]]
staff["unit_id"] = [clean_unit_id(unit) for unit in staff["unit_id"]]

staff = staff[staff['rank'].isin(supported_ranks['rank'])]

# Filter out unused faculties
accepted = staff["faculty_id"].unique()
faculties = faculties[faculties['id'].isin(accepted)]

# Write out
staff.to_json("output/staff.json", index=True)
faculties.to_json("output/faculties.json", index=True)