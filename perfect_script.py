import win32com.client
import shutil
import os

def replace_text_in_story(range_obj, find_str, replace_str):
    range_obj.Find.ClearFormatting()
    range_obj.Find.Replacement.ClearFormatting()
    range_obj.Find.Execute(
        FindText=find_str,
        ReplaceWith=replace_str,
        Replace=2 # wdReplaceAll
    )

def make_perfect_paper():
    template_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_FORMAT.docx'
    paper_backup_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_backup.docx'
    temp_body_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\temp_body_perfect.docx'
    final_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_Final.docx'
    
    shutil.copy(paper_backup_path, temp_body_path)
    shutil.copy(template_path, final_path)
    
    word = win32com.client.DispatchEx('Word.Application')
    word.Visible = False
    word.DisplayAlerts = 0
    
    try:
        # 1. Clean the body file using win32com to preserve images
        doc_body = word.Documents.Open(temp_body_path)
        # Delete first 3 paragraphs (Title, Abstract, Index Terms)
        doc_body.Paragraphs(1).Range.Delete()
        doc_body.Paragraphs(1).Range.Delete()
        doc_body.Paragraphs(1).Range.Delete()
        doc_body.Save()
        doc_body.Close()
        
        # 2. Open the final document
        doc = word.Documents.Open(final_path)
        
        # Update Headers and Footers properly across all sections
        for sec in doc.Sections:
            for hdr in sec.Headers:
                if hdr.Exists:
                    replace_text_in_story(hdr.Range, '<Journal Name>', 'Engineering Science and Technology, an International Journal')
                    replace_text_in_story(hdr.Range, 'Author Name', 'Roopa Tirumalasetti, Mahesh Babu Nettem, Pavan Reddy Narva, Siva Karthik Valiveti')
            for ftr in sec.Footers:
                if ftr.Exists:
                    replace_text_in_story(ftr.Range, '<Journal Name>', 'Engineering Science and Technology, an International Journal')
                    replace_text_in_story(ftr.Range, 'Author Name', 'Roopa Tirumalasetti, Mahesh Babu Nettem, Pavan Reddy Narva, Siva Karthik Valiveti')
        
        # 3. Update placeholders on the first page
        title = "A Smart and Efficient Online Doctor Appointment Booking System for Streamlined Healthcare Access"
        replace_text_in_story(doc.Content, '"Click & type the title of your paper, only capitalize first word and proper nouns"', title)
        replace_text_in_story(doc.Content, 'Click & type the title of your paper, only capitalize first word and proper nouns', title)
        
        replace_text_in_story(doc.Content, 'Given-name Surname 1', 'Roopa Tirumalasetti')
        replace_text_in_story(doc.Content, 'Given-name Surname 2', 'Mahesh Babu Nettem')
        replace_text_in_story(doc.Content, 'Given-name Surname 3', 'Pavan Reddy Narva, and Siva Karthik Valiveti')
        
        replace_text_in_story(doc.Content, 'Affiliation 1, Address, City and Postal Code, Country', 'SRM University-AP, Andhra Pradesh, India')
        replace_text_in_story(doc.Content, 'Affiliation 2, Address, City and Postal Code, Country', '')
        
        replace_text_in_story(doc.Content, 'Keyword_1', 'COVID-19 detection')
        replace_text_in_story(doc.Content, 'Keyword_2', 'chest X-ray classification')
        replace_text_in_story(doc.Content, 'Keyword_3', 'test-time augmentation')
        replace_text_in_story(doc.Content, 'Keyword_4', 'contrast enhancement')
        replace_text_in_story(doc.Content, 'Keyword_5', 'bias correction')
        
        abstract = "In the present work, an automated system of classification of X-rays of the chest detected by deep learning as a way of identifying COVID-19 and associated pulmonary disorders is introduced. The model is tested on the publicly available COVID-19 Radiography Database on Kaggle, which consists of 42,300 labelled images in four classes: COVID-19, lung opacity, normal, and viral pneumonia. To increase prediction accuracy, a test-time augmentation policy is used whereby, nine different versions of each input image, such as brightness, contrast, flipping, and sharpening transformations are created and tested, and the results are averaged. Moreover, a custom contrast enhancement algorithm based on adaptive histogram equalization is implemented to enhance the appearance of subtle radiographic appearances like ground-glass opacities that are typically related to COVID-19. An optimization bias correction method in the form of a grid-search is also presented to handle the bias of the classes and systematic misclassification, leading to an optimal prediction correction vector. The overall classification accuracy of the proposed approach is 91.75 percent, with the class-wise accuracies of 92 percent of COVID-19, 93 percent of lung opacity, 92 percent of normal cases, and 90 percent of cases of viral pneumonia. These findings show that the incorporation of preprocessing improvements and inference-level optimization strategies can strongly improve model robustness and diagnostic results on large-scale radiographic data."
        word.Selection.HomeKey(Unit=6)
        word.Selection.Find.ClearFormatting()
        word.Selection.Find.Text = 'Type your Abstract text here'
        if word.Selection.Find.Execute():
            word.Selection.Text = abstract
            
        # 4. Delete the manual instructions from "Note" onwards
        start_del = -1
        for p in doc.Paragraphs:
            if "Please read these instructions carefully" in p.Range.Text:
                try:
                    start_del = p.Previous().Range.Start
                except:
                    start_del = p.Range.Start
                break
                
        if start_del != -1:
            del_range = doc.Range(Start=start_del, End=doc.Content.End)
            del_range.Delete()
            
        # 5. Append the clean body of the paper
        word.Selection.EndKey(Unit=6)
        word.Selection.TypeParagraph()
        word.Selection.InsertFile(FileName=temp_body_path)
        
        doc.Save()
        doc.Close()
        print("Success")
    except Exception as e:
        print("Error:", e)
    finally:
        word.Quit()
        try:
            os.remove(temp_body_path)
        except:
            pass

if __name__ == '__main__':
    make_perfect_paper()
