import re
from PyPDF2 import PdfReader

def extract_resume_data(file):
    reader = PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    data = {}

    # Extract CGPA
    cgpa_match = re.search(r'CGPA[:\s]+(\d+\.\d+)', text, re.IGNORECASE)
    if cgpa_match:
        data['cgpa'] = float(cgpa_match.group(1))

    # Extract Semester
    semester_match = re.search(r'Semester[:\s]+(\d+)', text, re.IGNORECASE)
    if semester_match:
        data['semester'] = int(semester_match.group(1))

    # Extract Faculty
    faculty_match = re.search(r'(CSIT|BCA|BIT|BIM)', text, re.IGNORECASE)
    if faculty_match:
        data['faculty'] = faculty_match.group(1).upper()

    # Extract Student ID
    student_id_match = re.search(r'Roll[:\s]+([A-Z0-9]+)', text, re.IGNORECASE)
    if student_id_match:
        data['student_id'] = student_id_match.group(1)

    return data