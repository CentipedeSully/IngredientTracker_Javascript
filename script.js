//Initial Declarations
let ingredientCollection = Map.set(); //Key === ingredient name, value === chemical map
let queryContext = "search";
let sortStyle = "alphabetical";
let chemicalEntriesCount = 1;



//Button References
let importBtn = Document.getElementById("import-btn");
let exportBtn = Document.getElementById("export-btn");

let searchContextBtn = Document.getElementById("search-context-btn");
let addContextBtn = Document.getElementById("add-context-btn");
let removeContextBtn = Document.getElementById("remove-context-btn");
let ingredientInputName = Document.getElementById("ingredient-name-input");

let addChemEntryBtn = Document.getElementById("add-chem-entry-btn");
let removeChemEntryBtn = Document.getElementById("remove-chem-entry-btn");

let submitQueryBtn = Document.getElementById("submit-query-btn");
let clearQueryBtn = Document.getElementById("clear-query-btn");

let sortDisplayBtn = Document.getElementById("sort-display-btn");
let clearDisplayBtn = Document.getElementById("clear-display-btn");

let clearOutputLogBtn = Document.getElementById("clear-output-log-btn");



//Display References
let totalDatabasePopulationDisplay = Document.getElementById("total-database-population-display");
let currentTablePopulationDisplay = Document.getElementById("current-table-population-display");
let displayTableBody = Document.getElementById("display-table-body");
let logOutputDisplay = Document.getElementById("log-output");



//Class defs
class Ingredient{
    //chemMap is a Map of (chemicalName, quantity) pairs
    constructor(name, chemMap){
        this.name = name;
        this.chemMap = chemMap;
    }
}



// Helper Functions
function buildChemNameInputHTML(chemEntryNumber){
    return `<div class="input-group pb-1 chem-name-container">
        <label class="input-group-text " for="chem${chemEntryNumber}-name">Chem${chemEntryNumber}:</label>
        <input id="chem${chemEntryNumber}-name" class="form-control" type="text" placeholder="---">
    </div>`;
}

function buildChemBoundsInputHTML(chemEntryNumber){
    return `<div class="pb-3 chem-bounds-container">
        <div class="input-group pb-1 min-bound-container">
            <label class="input-group-text" for="chem${chemEntryNumber}-min-bound">Min:</label>
            <input id="chem${chemEntryNumber}-min-bound" class="form-control chem-bound" type="number" placeholder="---" min="1" size="3">
        </div>
        <div class="input-group max-bound-container">
            <label class="input-group-text " for="chem${chemEntryNumber}-max-bound">Max:</label>
            <input id="chem${chemEntryNumber}-max-bound" class="form-control chem-bound" type="number" placeholder="---" min="1" size="3">
        </div>
    </div>`;
}

function buildChemValueInputHTML(chemEntryNumber){
    return `<div class="input-group pb-3 chem-value-container">
        <label class="input-group-text " for="chem${chemEntryNumber}-value">Qty:</label>
        <input id="chem${chemEntryNumber}-value" class="form-control chem-value" type="number" placeholder="---" min="1">
    </div>`;
}

function buildChemEntryHTML(newChemEntryNumber){
    if (queryContext === "search"){
        return `<div id="chem${newChemEntryNumber}-entry" class="chem-field">
            ${buildChemNameInputHTML(newChemEntryNumber)}
            ${buildChemBoundsInputHTML(newChemEntryNumber)}
        </div>`;
    }
    else {
        return `<div id="chem${newChemEntryNumber}-entry" class="chem-field">
            ${buildChemNameInputHTML(newChemEntryNumber)}
            ${buildChemValueInputHTML(newChemEntryNumber)}
        </div>`;
    }
}

function createChemEntryElement(){
    let chemEntryContainer = document.getElementById("chemical-entry-container");
    let newChemEntry = document.createElement("div");
    chemEntryContainer.append(newChemEntry);
    newChemEntry.innerHTML= buildChemEntryHTML(chemicalEntriesCount + 1); // Offset the entry# by 1
    chemicalEntriesCount++;
}

function doesChemEntryExist(chemEntryNumber){
    let foundElement = document.getElementById(`chem${chemEntryNumber}-entry`);
    return foundElement !== null;
}

function getChemEntryElement(chemEntryNumber){
    return document.getElementById(`chem${chemEntryNumber}-entry`);
}

function removeEntry(chemEntryNumber){
    if (doesChemEntryExist(chemEntryNumber)){
        getChemEntryElement(chemEntryNumber).remove();
    }
}

function removeChemBoundsInputs(){
    for (let i = 0; i < chemicalEntriesCount; i++){
        //chemical entries are displayed with an offset of +1 for readability
        document.getElementById(`chem${i + 1}-min-bound`).remove();
        document.getElementById(`chem${i + 1}-max-bound`).remove();
    }
}

// Event/Action Functions
function addChemEntryOnclick(){
    
}

