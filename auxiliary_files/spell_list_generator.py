
elements = '"elements":{'
values = '"values":{'
offset = -2

def page():
    global elements, values
    elements += f'''
        "spellListPage": {{
      "type": "Page",
      "elementId": "spellListPage",
      "valueId": "spellListPage_value",
      "parent": "characterSheet",
      "children": [
        "spellColumn1SpellListPage",
        "spellColumn2SpellListPage",
        "spellColumn3SpellListPage"
      ],
      "top": 910,
      "left": 5,
      "width": 630,
      "height": 900,
      "backgroundColor": "white"
        }},
    '''
    values += f'''
        "spellListPage_value": {{
      "valueId": "spellListPage_value",
      "value": "",
      "parentElements": [
        "spellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    '''


def column(num, kids):
    global elements, values
    children = ''
    for i in kids:
        children += f'"level{i}SpellListPage",\n'
    children = children[0:-2]

    elements += f'''
    "spellColumn{num}SpellListPage": {{
      "type": "Blank",
      "elementId": "spellColumn{num}SpellListPage",
      "valueId": "spellColumn{num}SpellListPage_value",
      "parent": "spellListPage",
      "children": [
        "spellColumn{num}SvgSpellListPage",
        {children}
      ],
      "top": 115,
      "left": {5 + (num-1) * 207},
      "width": 206,
      "height": 781
    }},
    "spellColumn{num}SvgSpellListPage": {{
      "type": "Svg",
      "elementId": "spellColumn{num}SvgSpellListPage",
      "valueId": "spellColumn{num}SvgSpellListPage_value",
      "parent": "spellColumn{num}SpellListPage",
      "children": [],
      "top": 40,
      "left": 0,
      "width": 206,
      "height": 700,
      "path": "spellListFrame.svg"
    }},
    '''
    values += f'''
        "spellColumn{num}SpellListPage_value": {{
      "valueId": "spellColumn{num}SpellListPage_value",
      "value": "",
      "parentElements": [
        "spellColumn{num}SpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    "spellColumn{num}SvgSpellListPage_value": {{
      "valueId": "spellColumn{num}SvgSpellListPage_value",
      "value": "transform: ScaleY(1.115);",
      "parentElements": [
        "spellColumn{num}SvgSpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    '''

def spellBar(top, level, numbers, colNum):
    global values, elements, offset
    children = ""
    for number in range(numbers):
        children += f'"level{level}Spell{number+1}SpellListPage"'
        if number != numbers-1:
            children += ",\n"

    elements += f'''
    "level{level}SpellListPage": {{
      "type": "Blank",
      "elementId": "level{level}SpellListPage",
      "valueId": "level{level}SpellListPage_value",
      "parent": "spellColumn{colNum}SpellListPage",
      "children": [
        "level{level}SvgSpellListPage",
        {children}
      ],
      "top": {top-offset},
      "left": 0,
      "width": 206,
      "height": 260
    }},
    "level{level}SvgSpellListPage": {{
      "type": "Svg",
      "elementId": "level{level}SvgSpellListPage",
      "valueId": "level{level}SvgSpellListPage_value",
      "parent": "level{level}SpellListPage",
      "children": [
        "level{level}TextSpellListPage",
        "level{level}MaxSpellListPage",
        "level{level}CurrentSpellListPage",
        "level{level}MinusOneSpellListPage",
        "level{level}FillSpellListPage"
      ],
      "top": 0,
      "left": 0,
      "width": 206,
      "height": 42,
      "path": "spellbar.svg"
    }},
    "level{level}TextSpellListPage": {{
      "type": "Text",
      "elementId": "level{level}TextSpellListPage",
      "valueId": "level{level}TextSpellListPage_value",
      "parent": "level{level}SvgSpellListPage",
      "children": [],
      "top": 8,
      "left": 10,
      "width": 10,
      "height": 26,
      "fontSize": 20,
      "font": "scalasans",
      "color": "black",
      "alignment": "center"
    }},
    "level{level}MaxSpellListPage": {{
      "type": "SingleLine",
      "elementId": "level{level}MaxSpellListPage",
      "valueId": "level{level}Max",
      "parent": "level{level}SvgSpellListPage",
      "children": [],
      "top": 9,
      "left": 29,
      "width": 43,
      "height": 24,
      "color": "#dde4ff",
      "maxFontSize": 16,
      "textAlign": "center"
    }},
    "level{level}CurrentSpellListPage": {{
      "type": "SingleLine",
      "elementId": "level{level}CurrentSpellListPage",
      "valueId": "level{level}Current",
      "parent": "level{level}SvgSpellListPage",
      "children": [],
      "top": 12,
      "left": 90,
      "width": 30,
      "height": 18,
      "color": "#dde4ff",
      "maxFontSize": 16,
      "textAlign": "center"
    }},
    "level{level}MinusOneSpellListPage": {{
      "type": "Button",
      "elementId": "level{level}MinusOneSpellListPage",
      "valueId": "level{level}MinusOneSpellListPage_value",
      "parent": "level{level}SvgSpellListPage",
      "children": [],
      "top": 12,
      "left": 121,
      "width": 20,
      "height": 18,
      "buttonText": "-1",
      "color": "black",
      "backgroundColor": "#c5c6c7",
      "alignment": "center",
      "font": "scalasans",
      "fontSize": 16
    }},
    "level{level}FillSpellListPage": {{
      "type": "Button",
      "elementId": "level{level}FillSpellListPage",
      "valueId": "level{level}FillSpellListPage_value",
      "parent": "level{level}SvgSpellListPage",
      "children": [],
      "top": 12,
      "left": 142,
      "width": 40,
      "height": 18,
      "buttonText": "FILL",
      "color": "black",
      "backgroundColor": "#c5c6c7",
      "alignment": "center",
      "font": "scalasans",
      "fontSize": 12
    }},'''
    values += f'''
    "level{level}SpellListPage_value": {{
      "valueId": "level{level}SpellListPage_value",
      "value": "",
      "parentElements": [
        "level{level}SpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    "level{level}SvgSpellListPage_value": {{
      "valueId": "level{level}SvgSpellListPage_value",
      "value": "",
      "parentElements": [
        "level{level}SvgSpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    "level{level}TextSpellListPage_value": {{
      "valueId": "level{level}TextSpellListPage_value",
      "value": "1",
      "parentElements": [
        "level{level}TextSpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    "level{level}Max": {{
      "valueId": "level{level}Max",
      "value": "",
      "parentElements": [
        "level{level}MaxSpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    "level{level}Current": {{
      "valueId": "level{level}Current",
      "value": "",
      "parentElements": [
        "level{level}CurrentSpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    "level{level}MinusOneSpellListPage_value": {{
      "valueId": "level{level}MinusOneSpellListPage_value",
      "value": "let field = \\"level{level}Current\\"\\nlet oldVal =this.readValue(field);\\nlet newVal = Number(oldVal) - 1;\\nthis.changeValue(field, newVal);",
      "parentElements": [
        "level{level}MinusOneSpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    "level{level}FillSpellListPage_value": {{
      "valueId": "level{level}FillSpellListPage_value",
      "value": "let field = \\"level{level}Current\\"\\nlet maxfield = 'level{level}Max'\\nlet maxVal =this.readValue(maxfield);\\nthis.changeValue(field, maxVal);",
      "parentElements": [
        "level{level}FillSpellListPage"
      ],
      "referencedBy": [],
      "references": []
    }},
    '''

def singleline(top, level, number):
    global elements, values, offset
    top = 43 + top
    elements += f'''
    "level{level}Spell{number}SpellListPage": {{
      "type": "SingleLine",
      "elementId": "level{level}Spell{number}SpellListPage",
      "valueId": "level{level}Spell{number}",
      "parent": "level{level}SpellListPage",
      "children": [
        "level{level}Spell{number}LineSvgSpellListPage",
        "level{level}Spell{number}PreparedAmountSpellListPage",
        "level{level}Spell{number}CastSpellListPage",
        "level{level}Spell{number}PopUpSpellListPage",
        "level{level}Spell{number}PreparedSpellListPage"
      ],
      "top": {offset+top},
      "left": 15,
      "width": 120,
      "height": 10,
      "color": "#dde4ff",
      "maxFontSize": 9,
      "textAlign": "left"
    }},
    "level{level}Spell{number}LineSvgSpellListPage": {{
      "type": "Svg",
      "elementId": "level{level}Spell{number}LineSvgSpellListPage",
      "valueId": "level{level}Spell{number}LineSvgSpellListPage_value",
      "parent": "level{level}Spell{number}SpellListPage",
      "children": [],
      "top": 5,
      "left": 82,
      "width": 20,
      "height": 20,
      "path": "HorizontalLine.svg"
    }},
    "level{level}Spell{number}PreparedAmountSpellListPage": {{
      "type": "SingleLine",
      "elementId": "level{level}Spell{number}PreparedAmountSpellListPage",
      "valueId": "level{level}Spell{number}PreparedAmount",
      "parent": "level{level}Spell{number}SpellListPage",
      "children": [],
      "top": 0,
      "left": 121,
      "width": 20,
      "height": 10,
      "color": "#dde4ff",
      "maxFontSize": 9,
      "textAlign": "center"
    }},
    "level{level}Spell{number}CastSpellListPage": {{
      "type": "Button",
      "elementId": "level{level}Spell{number}CastSpellListPage",
      "valueId": "level{level}Spell{number}CastSpellListPage_value",
      "parent": "level{level}Spell{number}SpellListPage",
      "children": [],
      "top": 0,
      "left": 142,
      "width": 20,
      "height": 10,
      "buttonText": "-1",
      "color": "black",
      "backgroundColor": "#c5c6c7",
      "alignment": "center",
      "font": "scalasans",
      "fontSize": 12
    }},
    "level{level}Spell{number}PopUpSpellListPage": {{
      "type": "Button",
      "elementId": "level{level}Spell{number}PopUpSpellListPage",
      "valueId": "level{level}Spell{number}PopUpSpellListPage_value",
      "parent": "level{level}Spell{number}SpellListPage",
      "children": [],
      "top": 0,
      "left": 163,
      "width": 20,
      "height": 10,
      "buttonText": "POP",
      "color": "black",
      "backgroundColor": "#c5c6c7",
      "alignment": "center",
      "font": "scalasans",
      "fontSize": 9
    }},
    "level{level}Spell{number}PreparedSpellListPage": {{
      "type": "Checkmark",
      "elementId": "level{level}Spell{number}PreparedSpellListPage",
      "valueId": "level{level}Spell{number}Prepared",
      "parent": "level{level}Spell{number}SpellListPage",
      "children": [],
      "top": 1,
      "left": -10,
      "width": 9,
      "height": 9,
      "style": "circle",
      "color": "#dde4ff",
      "markColor": "gray",
      "stateOff": "0",
      "stateOn": "1"
    }},
        '''
    values +=f'''
        "level{level}SpellListPage_value": {{
        "valueId": "level{level}SpellListPage_value",
        "value": "",
        "parentElements": [
            "level{level}SpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}SvgSpellListPage_value": {{
        "valueId": "level{level}SvgSpellListPage_value",
        "value": "",
        "parentElements": [
            "level{level}SvgSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}TextSpellListPage_value": {{
        "valueId": "level{level}TextSpellListPage_value",
        "value": "{level}",
        "parentElements": [
            "level{level}TextSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}Max": {{
        "valueId": "level{level}Max",
        "value": "",
        "parentElements": [
            "level{level}MaxSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}Current": {{
        "valueId": "level{level}Current",
        "value": "",
        "parentElements": [
            "level{level}CurrentSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}MinusOneSpellListPage_value": {{
        "valueId": "level{level}MinusOneSpellListPage_value",
        "value": "let field = \\"level{level}Current\\"\\nlet oldVal =this.readValue(field);\\nlet newVal = Number(oldVal) - 1;\\nthis.changeValue(field, newVal);",
        "parentElements": [
            "level{level}MinusOneSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}FillSpellListPage_value": {{
        "valueId": "level{level}FillSpellListPage_value",
        "value": "let field = \\"level{level}Current\\"\\nlet maxfield = 'level{level}Max'\\nlet maxVal =this.readValue(maxfield);\\nthis.changeValue(field, maxVal);",
        "parentElements": [
            "level{level}FillSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}Spell{number}": {{
        "valueId": "level{level}Spell{number}",
        "value": "",
        "parentElements": [
            "level{level}Spell{number}SpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}Spell{number}LineSvgSpellListPage_value": {{
        "valueId": "level{level}Spell{number}LineSvgSpellListPage_value",
        "value": "transform: Scale(9.4,0.5)",
        "parentElements": [
            "level{level}Spell{number}LineSvgSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}Spell{number}PreparedAmount": {{
        "valueId": "level{level}Spell{number}PreparedAmount",
        "value": "",
        "parentElements": [
            "level{level}Spell{number}PreparedAmountSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}Spell{number}CastSpellListPage_value": {{
        "valueId": "level{level}Spell{number}CastSpellListPage_value",
        "value": "let field = \\"level{level}Spell{number}PreparedAmount\\";\\nlet oldVal =this.readValue(field);\\nlet newVal = Number(oldVal) - 1;\\nthis.changeValue(field, newVal);",
        "parentElements": [
            "level{level}Spell{number}CastSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}Spell{number}PopUpSpellListPage_value": {{
        "valueId": "level{level}Spell{number}PopUpSpellListPage_value",
        "value": "let field = \\"level{level}Spell{number}\\";\\nlet spell = this.readValue(field).toLowerCase();\\nthis.openWindow([\\"spells3_5\\",spell])",
        "parentElements": [
            "level{level}Spell{number}PopUpSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        "level{level}Spell{number}Prepared": {{
        "valueId": "level{level}Spell{number}Prepared",
        "value": "0",
        "parentElements": [
            "level{level}Spell{number}PreparedSpellListPage"
        ],
        "referencedBy": [],
        "references": []
        }},
        '''










structure = [[(0,13), (1,18), (2,17)], [(3,17), (4,16), (5,15)], [(6,13), (7,12), (8,11), (9,9)]]
page()
for i in range(len(structure)):
    children = []
    for p in structure[i]:
        children.append(p[0])
    column(i+1, children)
    lines = 0
    bars = 0
    for j in range(len(structure[i])):
        level = structure[i][j][0]
        spellBar(15 + (bars * 39) + (lines * 13), level, structure[i][j][1], i+1)
        bars+=1
        for k in range(structure[i][j][1]):
            number = k+1
            singleline((k * 13), level, number)
            lines +=1
            




output = "{\n" + elements.rstrip(',\n ') + "\n},\n" + values.rstrip(',\n ') + "\n}\n}"
import os
output_path = os.path.join(os.path.dirname(__file__), "output.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(output)