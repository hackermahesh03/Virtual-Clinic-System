import win32com.client
import shutil
import sys

def format_paper():
    paper_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER.docx'
    template_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_FORMAT.docx'
    backup_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_backup.docx'
    formatted_path = r'C:\Users\DEll\OneDrive\Documents\PAPER\PAPER_FORMATTED.docx'
    
    try:
        shutil.copy(paper_path, backup_path)
    except Exception as e:
        print("Backup failed:", e)
        return

    try:
        word = win32com.client.DispatchEx('Word.Application')
        word.Visible = False
        word.DisplayAlerts = 0
        
        # Open the template
        doc = word.Documents.Open(template_path)
        
        # Go to the end of the document (wdStory = 6)
        word.Selection.EndKey(Unit=6)
        
        # Insert a page break (wdPageBreak = 7)
        word.Selection.InsertBreak(Type=7)
        
        # Insert the paper content
        word.Selection.InsertFile(FileName=paper_path)
        
        # Save as the new file
        doc.SaveAs(formatted_path)
        
        # Optional: overwrite the original PAPER.docx too
        doc.SaveAs(paper_path)
        
        doc.Close()
        print("Success")
    except Exception as e:
        print("COM Error:", e)
    finally:
        word.Quit()

if __name__ == '__main__':
    format_paper()
