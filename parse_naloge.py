import classes
from py_pdf_parser.loaders import load_file
from pypdf import PdfWriter, PdfReader
from pdfCropMargins import crop
from pdfCropMargins import crop
import shutil
import os 


import fitz
import json

def parse_task(matura, folder):
    
    #page = reader.pages[4]

    doc = fitz.open(matura.datoteka)


    #RIC STANDARD I THINK
    for pgae_number in range(4, 12):
        reader = PdfReader(matura.datoteka)
        writer = PdfWriter()

        sl_json = json.loads(doc[pgae_number].get_text("json") ) # make the word list
        #sl = doc[4].get_text()
        writer.add_page(reader.pages[pgae_number])

        coordinates = []
        pages = []
        for e in sl_json["blocks"]:
            if("lines" in e.keys()):
                for k in e["lines"]:
                    for u in k["spans"]:
                        text = str(u["text"])
                        if(len(text) > 2 and ((text[0].isnumeric()) and (text[1] == '.' or text[2] == '.'))):
                            coordinates.append(u["origin"][1])
                            pages.append(text[0] +text[1]  if text[2] == '.' else text[0])


        with open(folder + "page_bu.pdf", "wb") as out:
            writer.write(out)

        coordinates.append(sl_json["height"] - 90) #specify last height
        print(coordinates)
        print(pages)
        for i in range(0, len(coordinates) - 1):
            crop(["-a4", "20", str(abs(coordinates[i + 1] - sl_json["height"])), "20", str(coordinates[i] - 40), "-o", folder + (str(pages[i]) + ".pdf"), folder + "page_bu.pdf"])
        #print(sl)

        f = open("out.json", "w")
        json.dump(sl_json, f)

