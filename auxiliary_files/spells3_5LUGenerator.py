import json
from pathlib import Path

with open("auxiliary_files/Spells v6.01.txt", "r", encoding="utf-8") as f:
    text = f.read()

spell_list = text.split("\n\n")
full_dict={}
for spell in spell_list:
    try:
        name = spell[1:spell.index("[")-1].lower().replace(" ", "").replace(",", "").replace("’", "")
        full_dict[name] = {}
        source = spell[spell.index("[")+1: spell.index("]")]
        full_dict[name]["source"] = source
        spell = spell[spell.index("]")+2:]
        school = spell[0:spell.index("\n")]
        full_dict[name]["school"] = school
        spell_parameters = spell[spell.index("\n")+1:spell.index("\t")-1].split("\n")
        for parameter in spell_parameters:
            parameter_name = parameter[0:parameter.index(":")]
            parameter_description = parameter[parameter.index(":")+2:]
            full_dict[name][parameter_name] = parameter_description
        description = spell[spell.index("\t")+1:].replace("\t", "")
        full_dict[name]["description"] = description
    except Exception:
        pass

full_dict = {"spells3_5": full_dict}
output_path = Path(__file__).with_name("spells3_5-export.json")
with output_path.open("w", encoding="utf-8") as out_file:
    json.dump(full_dict, out_file, indent=2, ensure_ascii=False)
