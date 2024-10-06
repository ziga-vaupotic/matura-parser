import classes
from py_pdf_parser.loaders import load_file
import json


def parse_result_abcd(matura, folder):
    document = load_file(matura.datoteka)

    f = open("out.txt", "a")


    indexes = [x for x in range(28, 36)] + [x for x in range(19, 28)] + [x for x in range(10, 19)] + [x for x in range(1, 10)]

    results = []

    for e in document.elements.filter_by_page(3):
        try:
            if(e.text().find("") > 0) :
                print(e.text())
                if(e.text()[0].isupper() and not e.text()[0].isnumeric()): 
                    results.append(e.text()[0])
            t = e.text()
            f.write(t)
            print(t)
        except:
            print("l", end="")

    if(len(results) == 0):
        for e in document.elements.filter_by_page(2):
            try:
                if(e.text().find("") > 0) :
                    print(e.text())
                    if(e.text()[0].isupper() and not e.text()[0].isnumeric()): 
                        results.append(e.text()[0])
                t = e.text()
                f.write(t)
                print(t)
            except:
                print("l", end="")

    print(results)
    res_map = dict()

    for i in range(0, 35):
        res_map[indexes[i]] = results[i]

    print(matura.id_predmeta)

    with open(folder + "res.json", "w") as file:
        json.dump({'name': matura.ime, 'poiskus': matura.poiskus, 'id_predmeta': matura.id_predmeta.name, 'leto': matura.leto, 'rok': matura.rok, 'pola': matura.pola,'res': res_map}, file)
    

    

