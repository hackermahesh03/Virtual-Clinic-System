import os
import re

def flatten_latex(main_file, output_file, base_dir):
    with open(main_file, 'r', encoding='utf-8') as f:
        main_content = f.read()

    def replace_input(match):
        include_path = match.group(1)
        # Ensure it has .tex extension
        if not include_path.endswith('.tex'):
            include_path += '.tex'
            
        full_path = os.path.join(base_dir, include_path)
        if os.path.exists(full_path):
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return f"% --- Start of {include_path} ---\n{content}\n% --- End of {include_path} ---"
        else:
            return match.group(0) # If not found, leave as is

    # Regex to find \input{filename}
    flattened = re.sub(r'\\input\{([^}]+)\}', replace_input, main_content)
    # Run a second pass in case there are nested inputs (like if preamble had inputs)
    flattened = re.sub(r'\\input\{([^}]+)\}', replace_input, flattened)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(flattened)

if __name__ == '__main__':
    base_dir = r'c:\Doctor project changes - 2\report_latex_template'
    main_file = os.path.join(base_dir, 'BTechProjectTemplate.tex')
    output_file = r'C:\Users\DEll\Downloads\BTech_Report_Merged.tex'
    flatten_latex(main_file, output_file, base_dir)
    print("Flattening complete. Saved to BTech_Report_Merged.tex")
