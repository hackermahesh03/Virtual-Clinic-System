import re
import os

def parse_report(input_file, out_dir):
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]

    abstract = []
    chapters = {}
    current_chapter = None
    current_chapter_title_next = False

    chapter_re = re.compile(r'^CHAPTER\s+(\d+)', re.IGNORECASE)
    section_re = re.compile(r'^(\d+)\.(\d+)\s+(.*)')
    subsection_re = re.compile(r'^(\d+)\.(\d+)\.(\d+)\s+(.*)')
    
    mode = 'WAIT'
    
    for line in lines:
        if line == 'ABSTRACT':
            mode = 'ABSTRACT'
            continue
            
        m_chap = chapter_re.match(line)
        if m_chap:
            current_chapter = m_chap.group(1)
            if current_chapter not in chapters:
                chapters[current_chapter] = []
            mode = 'CHAPTER'
            current_chapter_title_next = True
            continue
            
        if mode == 'ABSTRACT':
            abstract.append(line)
            continue
            
        if mode == 'CHAPTER':
            if current_chapter_title_next:
                chapters[current_chapter].append(f'\\chapter{{{line}}}')
                current_chapter_title_next = False
                continue
                
            # Check subsection first
            m_sub = subsection_re.match(line)
            if m_sub:
                title = m_sub.group(4)
                # Infer chapter if it somehow drifted
                chap_num = m_sub.group(1)
                if chap_num != current_chapter:
                    current_chapter = chap_num
                    if current_chapter not in chapters:
                        chapters[current_chapter] = []
                        chapters[current_chapter].append(f'\\chapter{{Chapter {current_chapter}}}')
                chapters[current_chapter].append(f'\\subsection{{{title}}}')
                continue
                
            # Check section
            m_sec = section_re.match(line)
            if m_sec:
                title = m_sec.group(3)
                chap_num = m_sec.group(1)
                if chap_num != current_chapter:
                    current_chapter = chap_num
                    if current_chapter not in chapters:
                        chapters[current_chapter] = []
                        chapters[current_chapter].append(f'\\chapter{{Chapter {current_chapter}}}')
                chapters[current_chapter].append(f'\\section{{{title}}}')
                continue
            
            # Normal text
            chapters[current_chapter].append(line)

    # Write Abstract
    if abstract:
        with open(os.path.join(out_dir, 'abstract.tex'), 'w', encoding='utf-8') as f:
            f.write(r'''\newpage
\addcontentsline{toc}{chapter}{\MakeUppercase{Abstract}}
\thispagestyle{empty}
\begin{spacing}{1.5}
\chapter*{Abstract}

''')
            f.write('\n\n'.join(abstract))
            f.write('\n\\end{spacing}\n')
            
    # Write Chapters
    for chap_num, content in chapters.items():
        chap_file = os.path.join(out_dir, 'chapters', f'chapter_{chap_num}.tex')
        with open(chap_file, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(content))
            f.write('\n')

if __name__ == '__main__':
    parse_report(r'c:\Doctor project changes - 2\report_text.txt', r'c:\Doctor project changes - 2\report_latex_template')
    print("Parsing complete.")
