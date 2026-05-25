import fitz
from fpdf import FPDF
import datetime

# --- 1. Generate Cover Letter ---
def create_cover_letter():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=11)
    
    date_str = datetime.datetime.now().strftime("%B %d, %Y")
    
    content = f"""{date_str}

To
The Editor-in-Chief,
Engineering Science and Technology, an International Journal (JESTCH)

Subject: Submission of original manuscript for publication

Dear Editor,

We are pleased to submit our manuscript titled "A Smart and Efficient Online Doctor Appointment Booking System for Streamlined Healthcare Access" for consideration for publication in Engineering Science and Technology, an International Journal.

In this work, we introduce an automated system for classifying chest X-rays using deep learning to identify COVID-19 and associated pulmonary disorders. We believe our findings on test-time augmentation, adaptive histogram equalization, and optimization bias correction significantly improve model robustness and diagnostic results, making it of great interest to the readers of your journal.

This manuscript describes original work and is not under consideration by any other journal. All authors have approved the manuscript and this submission.

Thank you for your consideration.

Sincerely,

Dr. Roopa Tirumalasetti
Supervisor, SRM University-AP
Mangalagiri, Andhra Pradesh, India
Email: roopa@srmap.edu.in
"""
    pdf.multi_cell(0, 7, content)
    pdf.output(r'C:\Users\DEll\Downloads\Cover_Letter.pdf')
    print("Created Cover_Letter.pdf")

# --- 2. Generate Title Page ---
def create_title_page():
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    
    # Title
    pdf.multi_cell(0, 10, "A Smart and Efficient Online Doctor Appointment Booking System for Streamlined Healthcare Access", align='C')
    pdf.ln(10)
    
    # Authors
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 8, "Authors:", ln=True)
    pdf.set_font("Arial", '', 12)
    
    authors = [
        "Dr. Roopa Tirumalasetti* (Supervisor)",
        "Mahesh Babu Nettem",
        "Pavan Reddy Narva",
        "Harsh Vardhan Andra",
        "Siva Karthik Valiveti"
    ]
    
    for author in authors:
        pdf.cell(0, 6, f"  - {author}", ln=True)
        
    pdf.ln(5)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 8, "Affiliation:", ln=True)
    pdf.set_font("Arial", '', 12)
    pdf.cell(0, 6, "  SRM University-AP, Mangalagiri, Andhra Pradesh, India.", ln=True)
    
    pdf.ln(5)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(0, 8, "Corresponding Author:", ln=True)
    pdf.set_font("Arial", '', 12)
    pdf.cell(0, 6, "  Dr. Roopa Tirumalasetti", ln=True)
    pdf.cell(0, 6, "  Email: roopa@srmap.edu.in", ln=True)
    
    pdf.ln(10)
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(0, 10, "Abstract", ln=True)
    pdf.set_font("Arial", '', 11)
    
    abstract_text = """In the present work, an automated system of classification of X-rays of the chest detected by deep learning as a way of identifying COVID-19 and associated pulmonary disorders is introduced. The model is tested on the publicly available COVID-19 Radiography Database on Kaggle, which consists of 42,300 labelled images in four classes: COVID-19, lung opacity, normal, and viral pneumonia. To increase prediction accuracy, a test-time augmentation policy is used whereby, nine different versions of each input image, such as brightness, contrast, flipping, and sharpening transformations are created and tested, and the results are averaged. Moreover, a custom contrast enhancement algorithm based on adaptive histogram equalization is implemented to enhance the appearance of subtle radiographic appearances like ground-glass opacities that are typically related to COVID-19. An optimization bias correction method in the form of a grid-search is also presented to handle the bias of the classes and systematic misclassification, leading to an optimal prediction correction vector. The overall classification accuracy of the proposed approach is 91.75 percent, with the class-wise accuracies of 92 percent of COVID-19, 93 percent of lung opacity, 92 percent of normal cases, and 90 percent of cases of viral pneumonia. These findings show that the incorporation of preprocessing improvements and inference-level optimization strategies can strongly improve model robustness and diagnostic results on large-scale radiographic data."""
    
    pdf.multi_cell(0, 6, abstract_text)
    
    pdf.output(r'C:\Users\DEll\Downloads\Title_Page.pdf')
    print("Created Title_Page.pdf")

# --- 3. Generate Manuscript (Anonymous) ---
def create_anonymous_manuscript():
    src_pdf = r'C:\Users\DEll\Downloads\PAPER2.pdf'
    dest_pdf = r'C:\Users\DEll\Downloads\Manuscript.pdf'
    
    doc = fitz.open(src_pdf)
    page = doc[0]
    
    # Redact Authors block (Y approx 210 to 260)
    rect1 = fitz.Rect(0, 210, page.rect.width, 260)
    page.add_redact_annot(rect1, fill=(1, 1, 1))
    
    # Redact Corresponding Author Email at bottom (Y approx 700 to 730)
    rect2 = fitz.Rect(0, 690, page.rect.width, 740)
    page.add_redact_annot(rect2, fill=(1, 1, 1))
    
    # Redact bottom left header "E-mail address(es)"
    page.apply_redactions()
    
    doc.save(dest_pdf, garbage=3, deflate=True)
    doc.close()
    print("Created Manuscript.pdf (Blinded)")

if __name__ == '__main__':
    create_cover_letter()
    create_title_page()
    create_anonymous_manuscript()
