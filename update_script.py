import win32com.client
import shutil
import os

def replace_text(doc, find_str, replace_str):
    for story_range in doc.StoryRanges:
        story_range.Find.ClearFormatting()
        story_range.Find.Replacement.ClearFormatting()
        story_range.Find.Text = find_str
        story_range.Find.Replacement.Text = replace_str
        story_range.Find.Execute(Replace=2) # wdReplaceAll = 2
        
        while story_range.NextStoryRange:
            story_range = story_range.NextStoryRange
            story_range.Find.ClearFormatting()
            story_range.Find.Replacement.ClearFormatting()
            story_range.Find.Text = find_str
            story_range.Find.Replacement.Text = replace_str
            story_range.Find.Execute(Replace=2)

def update_paper():
    template_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_FORMAT.docx'
    paper_backup_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_backup.docx'
    updated_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_Updated.docx'
    
    shutil.copy(template_path, updated_path)
    
    word = win32com.client.DispatchEx('Word.Application')
    word.Visible = False
    word.DisplayAlerts = 0
    
    try:
        doc = word.Documents.Open(updated_path)
        
        title = "A Smart and Efficient Online Doctor Appointment Booking System for Streamlined Healthcare Access"
        replace_text(doc, '"Click & type the title of your paper, only capitalize first word and proper nouns"', title)
        replace_text(doc, 'Click & type the title of your paper, only capitalize first word and proper nouns', title)
        
        replace_text(doc, 'Given-name Surname 1', 'Roopa Tirumalasetti')
        replace_text(doc, 'Given-name Surname 2', 'Mahesh Babu Nettem')
        replace_text(doc, 'Given-name Surname 3', 'Pavan Reddy Narva, and Siva Karthik Valiveti')
        
        replace_text(doc, 'Affiliation 1, Address, City and Postal Code, Country', 'SRM University-AP, Andhra Pradesh, India')
        replace_text(doc, 'Affiliation 2, Address, City and Postal Code, Country', '')
        
        abstract = "In the present work, an automated system of classification of X-rays of the chest detected by deep learning as a way of identifying COVID-19 and associated pulmonary disorders is introduced. The model is tested on the publicly available COVID-19 Radiography Database on Kaggle, which consists of 42,300 labelled images in four classes: COVID-19, lung opacity, normal, and viral pneumonia. To increase prediction accuracy, a test-time augmentation policy is used whereby, nine different versions of each input image, such as brightness, contrast, flipping, and sharpening transformations are created and tested, and the results are averaged. Moreover, a custom contrast enhancement algorithm based on adaptive histogram equalization is implemented to enhance the appearance of subtle radiographic appearances like ground-glass opacities that are typically related to COVID-19. An optimization bias correction method in the form of a grid-search is also presented to handle the bias of the classes and systematic misclassification, leading to an optimal prediction correction vector. The overall classification accuracy of the proposed approach is 91.75 percent, with the class-wise accuracies of 92 percent of COVID-19, 93 percent of lung opacity, 92 percent of normal cases, and 90 percent of cases of viral pneumonia. These findings show that the incorporation of preprocessing improvements and inference-level optimization strategies can strongly improve model robustness and diagnostic results on large-scale radiographic data."
        
        # Replace abstract using selection to avoid 255 char limit
        word.Selection.HomeKey(Unit=6) # wdStory
        word.Selection.Find.ClearFormatting()
        word.Selection.Find.Text = 'Type your Abstract text here'
        if word.Selection.Find.Execute():
            word.Selection.Text = abstract
        
        # Append main content from paper_backup
        word.Selection.EndKey(Unit=6) # wdStory
        word.Selection.InsertBreak(Type=7) # wdPageBreak
        word.Selection.InsertFile(FileName=paper_backup_path)
        
        doc.Save()
        doc.Close()
        print("Success")
    except Exception as e:
        print("Error:", e)
    finally:
        word.Quit()

if __name__ == '__main__':
    update_paper()
