
from enum import Enum
 
class Predmet(Enum):
    FIZIKA = "411"
    BIOLOGIJA = "421"


class Base:
    datoteka = ""
    ime = ""
    leto = 0
    pola = 0
    rok = 0
    poiskus = 0
    id_predmeta = Predmet


    def build_a_matura(self, tip, leto, pola, rok, poiskus, id_predmeta):
        self.ime = "M" + str(leto) + str(rok)
        + "-" + str(id_predmeta) +"-" + str(poiskus) + "-" + str(pola)

        self.datoteka = "matura/" +  self.ime + ".pdf"
        self.leto = leto
        self.pola = pola
        self.rok = rok
        self.poiskus = poiskus