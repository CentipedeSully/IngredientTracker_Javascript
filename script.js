//Class defs
class Ingredient{
    #name = '';
    #chemMap = new Map();

    //chemMap is a Map of (chemicalName, quantity) pairs
    constructor(name, chemMap){
        let isStringValid = isStringValid(name);
        let isMapValid = isMapValid(chemMap);

        if ( isStringValid && isMapValid)
        {
            this.#name = name;
            this.#chemMap = chemMap;
        }
        else { 
            if ( !isStringValid && !isMapValid)
                console.log(`invalid name AND map detected in Ingredient Constructor (name,map): (${name}, ${chemMap})`);
            else if (!isStringValid)
                console.log(`invalid name detected in Ingredient Constructor: ${name}`);
            
            else console.log(`invalid map detected in Ingredient Constructor: ${chemMap}`);
         }

    }

    get name(){ return this.#name;}

    doesChemicalExist(chemName){
        return this.#chemMap.has(chemName);
    }

    addChemical(name,value){
        let isStringValid = isStringValid(name);
        let isNumberValid = isNumberValid(value);  
        if ( isStringValid && isNumberValid)
            this.#chemMap.set(name,value);
        else{
            if ( !isStringValid && !isNumberValid)
                console.log(`invalid name AND value while adding chemical (name,value): (${name}, ${value})`);
            else if (!isStringValid)
                console.log(`invalid name detected while adding Chemical: ${name}`);
            
            else console.log(`invalid value detected while adding Chemical: ${value}`);
        }

    }

    removeChemical(name){
        if (this.doesChemicalExist(name))
            this.#chemMap.remove(name);
    }

    getChemicalValuePair(name){
        if (this.doesChemicalExist(name)){
            return [name, this.#chemMap.get(name)];
        }
    }

    getChemicalPairsViaSubstring(substring){
        if (!isStringValid(substring)){
            console.log(`invalid substring detected while getting chemical pairs: ${substring}`);
            return;
        }

        let allChemicalNames = this.#chemMap.keys().sort();
        let matchingChemicalPairs = [];

        for (let i = 0; i < allChemicalNames.length; i++){
            if (allChemicalNames[i].includes(substring))
                matchingChemicalPairs.push([allChemicalNames[i], this.#chemMap.get(allChemicalNames[i])]);
        }

        return matchingChemicalPairs;
    }

    getChemicalPairsViaSubstringAndBounds(substring, minValue = 0, maxValue = 9){
        //Get the substring-matching pairs first
        let unboundMatches = this.getChemicalPairsViaSubstring(substring);

        //Build the new arry
        let matchingPairsWithinBounds = [];

        for (let i = 0; i < unboundMatches.length; i ++){
            //
            if (minValue <= unboundMatches[i][1] <= maxValue)
                matchingPairsWithinBounds.push(unboundMatches[i]);
        }

        return matchingPairsWithinBounds;
    }

    static isStringValid(name){
        return name !== null && typeof name === 'string' && name !== undefined;
    }

    static isNumberValid(value){
        return value !== null && typeof value === "number"  && value !== undefined;
    }

    static isMapValid(mapParameter){
        return mapParameter !== null && mapParameter instanceof Map  && mapParameter !== undefined;
    }

    static sortChemicalsByAscendingValue(nameValuePairArray){
        let sortedPairs = [];
        let iterationCount = nameValuePairArray.length;

        for (let i=0; i < iterationCount; i++){

            for (let j=0; j + i < iterationCount; j++){
                if (nameValuePairArray[])
            }
        }
    }
}



//Internal state-tracking Declarations
let ingredientCollection = [];
let queryContext = "search";
let sortStyle = "alphabetical";
let chemicalEntriesCount = 0;
let ingredientsOnDisplay = 0;



//Input references
let ingredientInputName = document.getElementById("ingredient-name-input");



//Button References
let importBtn = document.getElementById("import-btn");
let exportBtn = document.getElementById("export-btn");



let searchContextBtn = document.getElementById("search-context-btn");
searchContextBtn.addEventListener("click",enterSearchContext);

let addContextBtn = document.getElementById("add-context-btn");
addContextBtn.addEventListener("click", enterAddContext);

let removeContextBtn = document.getElementById("remove-context-btn");
removeContextBtn.addEventListener("click", enterRemoveContext);



let addChemEntryBtn = document.getElementById("add-chem-entry-btn");
addChemEntryBtn.addEventListener("click",createChemEntryElement);

let removeChemEntryBtn = document.getElementById("remove-chem-entry-btn");
removeChemEntryBtn.addEventListener("click", removeLastChemEntry);



let submitQueryBtn = document.getElementById("submit-query-btn");
let clearQueryBtn = document.getElementById("clear-query-btn");

let sortDisplayBtn = document.getElementById("sort-display-btn");
let clearDisplayBtn = document.getElementById("clear-display-btn");



let clearOutputLogBtn = document.getElementById("clear-output-log-btn");



//Display References
let totalDatabasePopulationDisplay = document.getElementById("total-database-population-display");
let currentTablePopulationDisplay = document.getElementById("current-table-population-display");
let displayTableBody = document.getElementById("display-table-body");
let logOutputDisplay = document.getElementById("log-output");



// Helper Functions
//Query-context related
function enterSearchContext(){
    if (queryContext !== "search"){
        queryContext= "search";
        addChemBoundsInputs();
        removeChemValueInputs();
    }
}

function enterAddContext(){
    if (queryContext !== "add"){
        queryContext= "add";
        removeChemBoundsInputs();
        addChemValueInputs();
    }
}

function enterRemoveContext(){
    if (queryContext !== "remove"){
        queryContext= "remove";
        removeChemBoundsInputs();
        removeChemValueInputs();
    }
}

//Chemical-field related
function buildChemNameInputHTML(chemEntryNumber){
    return `<div class="input-group pb-1 chem-name-container">
        <label class="input-group-text " for="chem${chemEntryNumber}-name">Chem${chemEntryNumber}:</label>
        <input id="chem${chemEntryNumber}-name" class="form-control" type="text" placeholder="---">
    </div>`;
}

function buildChemBoundsInputHTML(chemEntryNumber){
    return `<div class="input-group pb-1 min-bound-container">
            <label class="input-group-text" for="chem${chemEntryNumber}-min-bound">Min:</label>
            <input id="chem${chemEntryNumber}-min-bound" class="form-control chem-bound" type="number" placeholder="---" min="1" size="3">
        </div>
        <div class="input-group max-bound-container">
            <label class="input-group-text " for="chem${chemEntryNumber}-max-bound">Max:</label>
            <input id="chem${chemEntryNumber}-max-bound" class="form-control chem-bound" type="number" placeholder="---" min="1" size="3">
        </div>`;
}

function buildChemValueInputHTML(chemEntryNumber){
    return `<label class="input-group-text " for="chem${chemEntryNumber}-value">Qty:</label>
        <input id="chem${chemEntryNumber}-value" class="form-control chem-value" type="number" placeholder="---" min="1">`;
}

function buildChemEntryHTML(newChemEntryNumber){
    if (queryContext === "search"){
        return `${buildChemNameInputHTML(newChemEntryNumber)}
        <div class="pb-3 chem-bounds-container">
            ${buildChemBoundsInputHTML(newChemEntryNumber)}
        </div>`;
    }
    else if (queryContext === "add"){
        return `${buildChemNameInputHTML(newChemEntryNumber)}
        <div class="pb-3 chem-value-container">
            ${buildChemValueInputHTML(newChemEntryNumber)}
        </div>`;
        
    }
    else if (queryContext === "remove"){
        return `${buildChemNameInputHTML(newChemEntryNumber)}`;
    }
}

function createChemEntryElement(){
    let chemEntryContainer = document.getElementById("chemical-entry-container");
    let newChemEntry = document.createElement("div");
    newChemEntry.setAttribute("id",`chem${chemicalEntriesCount + 1}-entry`);
    newChemEntry.setAttribute("class","chem-entry");
    chemEntryContainer.append(newChemEntry);
    newChemEntry.innerHTML= buildChemEntryHTML(chemicalEntriesCount + 1); // Offset chem entry# by 1
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
        chemicalEntriesCount--;
    }
}

function removeLastChemEntry(){
    if (chemicalEntriesCount > 0)
        removeEntry(chemicalEntriesCount);
}

function removeChemBoundsInputs(){
    //Get every chemical entry, and then remove every html occurence of a Bound Container
    let chemEntryContainers = document.getElementsByClassName("chem-entry");
    for (let i=0; i < chemEntryContainers.length; i++){
        let boundContainers = chemEntryContainers[i].getElementsByClassName("chem-bounds-container");
        for (let j = boundContainers.length -1; j >=0 ;j--){
            boundContainers[j].remove();
        }
    }
}

function addChemBoundsInputs(){
    let entryElements = document.getElementsByClassName("chem-entry");
    for (let i=0; i < entryElements.length;i++){
        let newDivElement = document.createElement("div");
        newDivElement.setAttribute("class","pb-3 chem-bounds-container")
        newDivElement.innerHTML= buildChemBoundsInputHTML(i+1); //offset chem entry# by +1
        entryElements[i].append(newDivElement);
    }
    
}

function removeChemValueInputs(){
    let chemEntryContainers = document.getElementsByClassName("chem-entry");
    for (let i=0; i < chemEntryContainers.length; i++){
        let valueContainers = chemEntryContainers[i].getElementsByClassName("chem-value-container");
        for (let j = valueContainers.length -1; j >=0 ;j--){
            valueContainers[j].remove();
        }
    }

}

function addChemValueInputs(){
    let entryElements = document.getElementsByClassName("chem-entry");
    for (let i=0; i < entryElements.length;i++){
        let newDivElement = document.createElement("div");
        newDivElement.setAttribute("class","input-group pb-3 chem-value-container")
        newDivElement.innerHTML= buildChemValueInputHTML(i+1); //offset chem entry# by +1
        entryElements[i].append(newDivElement);
    }
}



