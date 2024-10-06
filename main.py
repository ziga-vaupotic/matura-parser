import parse_name as pn
import parse_result as pr
import parse_naloge as pnl
import os 
import sys

ime = sys.argv[1]

c1 = pn.parse("matura/" + ime + "3.pdf")
c2 = pn.parse("matura/" + ime + "1.pdf")

folder = "database/" + c1.id_predmeta.name + "/" + c1.ime + "/" 
print(folder)

try:
    os.makedirs(folder, exist_ok=True)
except:
    print("Folder already exists.")


pr.parse_result_abcd(c1, folder)
pnl.parse_task(c2, folder)
