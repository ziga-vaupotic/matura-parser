# Matura parser

This reposatory includes a parser for Slovenia final exam (matura). The parser parses the tasks and results. Tasks are exported as PDF files and results are exported as a JSON database. The parser was tested on matruas from 2006-2024, however, it was made to be resilient against the updates of PDF creation process from RIC. I do not own any of the parsed material. I do not take any responsibility for the fair use of the parser.

# Usage
To use the parser one must place a matura by its inherent name (the name obtained from the RIC website) in a folder called matura/. The results must also be included, again using their inherent name. Additionally, one can change the names of the files, but must also change the name in main.py script. Now simply run the script main.py with the name as a first and only argument.


# Dependencies
- py_pdf_parser
- pypdf 
- pdfCropMargins

# Website

I have also included a simple Node.js training website that uses the results of the parser. It requires the following library

- socket.io 
