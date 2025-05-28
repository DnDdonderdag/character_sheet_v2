TO DO:

Decorators:
 - calc (DONE) (Maybe try to fix associativity one day)
 - autoSizeText (DONE)
 - sync (DONE)
Utilities:
 - save & load (WIP) (Warning for unsaved content, and layout customisation)
 - update (DONE)
 - Tooltip (DONE)
 - Layout Customisation

Generic constructors 
 - Form fields (DONE)
 - buttons (DONE)
    - checkmarks, square
    - Tickboxes, circular
 - Frame (DONE)
 - Page (DONE)

 Other features:
 - Tooltip lookup on hover voor spells etc.
 - Image uploadable, maybe store on server?
 - Include syncclass in tooltip (DONE)
 - Lookup (DONE)


Server side:
 - DM pagina met useful info over spelers



Lijstje ter verbetering
 - Paginas door gebruiker laten indelen (ook dupliceren)
 - File managmenent (save, save as, load) (warning voor niet compatible files)
 - Maak alles class subclass etc
 - overzicht maken van wat er geupdate moet worden en wanneer die moeten worden geroepen
 - Calculate
 - sync
 - Misschien een export to pdf functie?
 - Fix de textareas in ios
 - Page title character name


Ideas:
    voor layout customisation:
        layout deel van save, JSON met pages als keys, waar de value een string is met de JS code die
        deze pagina genereert, volgorde wordt behouden. Layout kan ook als los bestandje worden geupload
        om layout te initialiseren.
    Voor lookup:
        add lookup as a calculation feature


Bugs:
 - Tooltip, sometimes shows "syncMe" still, when it shouldnt
 - Calc not working properly, currently replaced with eval, fix eventually
 - Tooltip, when scrolling sideways not appearin in correct spot