import pandas as pd

staff = pd.read_csv('good-output/academic_staff.csv')
units = pd.read_csv('good-output/academic_units.csv')
faculties = pd.read_csv('good-output/faculties.csv')

relevant_units = staff['unit_id'].unique()
relevant_faculties = staff['faculty_id'].unique()

print(relevant_faculties)

print()
print(relevant_units)