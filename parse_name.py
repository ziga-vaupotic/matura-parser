import classes as bc

def parse(file_name):
    matura_name = file_name.split("/")[1].split(".")[0]

    ret_class = bc.Base()
    split = matura_name.split("-")

    ret_class.poiskus = (int(split[2]))
    ret_class.datoteka = file_name
    ret_class.ime = matura_name
    ret_class.pola = (int(split[3]))
    ret_class.leto = split[0][1] + split[0][2]
    ret_class.rok =  split[0][3]

    for i in bc.Predmet:
        if(i.value == split[1]):
            ret_class.id_predmeta = i

    print(ret_class.id_predmeta)

    return ret_class