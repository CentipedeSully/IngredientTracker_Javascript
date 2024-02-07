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
            this.#name = name.toLowerCase();

            //further validate the Map. Only add valid chemical entries, and make the names lower case
            chemMap.array.forEach((value,key,map) => {
                if (isStringValid(key) && isNumberValid(value))
                    this.#chemMap.set(key.toLowerCase(),value);
            });

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

    get chemicalValuePairs(){return this.getChemicalPairsViaSubstring("");}

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
        //Validate the string
        if (!isStringValid(substring)){
            console.log(`invalid substring detected while getting chemical pairs: ${substring}`);
            return;
        }

        //Get the chemical names, sorted
        let allChemicalNames = this.#chemMap.keys().sort();
        

        //Build the output arry
        let matchingChemicalPairs = [];

        //Check each chem name. 
        //Add any matches (as a [name,value] pair) to the output arry
        for (let i = 0; i < allChemicalNames.length; i++){
            if (allChemicalNames[i].includes(substring))
                matchingChemicalPairs.push([allChemicalNames[i], this.#chemMap.get(allChemicalNames[i])]);
        }

        //return the output arry
        return matchingChemicalPairs;
    }

    getChemicalPairsViaSubstringAndBounds(substring, minValue = 0, maxValue = 9){
        //Get the sorted, substring-matching pairs
        let unboundMatches = this.getChemicalPairsViaSubstring(substring);

        //Build the output arry
        let matchingPairsWithinBounds = [];

        //Check each match. 
        //Add any pairs whose values fall within the bounds to the output arry
        for (let i = 0; i < unboundMatches.length; i ++){
            if (minValue <= unboundMatches[i][1] <= maxValue)
                matchingPairsWithinBounds.push(unboundMatches[i]);
        }

        //return the output arry
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
clearQueryBtn.addEventListener("click",clearQuery);

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
        <input id="chem${chemEntryNumber}-name" name="chem${chemEntryNumber}Name" class="form-control query-input" type="text" placeholder="---">
    </div>`;
}

function buildChemBoundsInputHTML(chemEntryNumber){
    return `<div class="input-group pb-1 min-bound-container">
            <label class="input-group-text" for="chem${chemEntryNumber}-min-bound">Min:</label>
            <input id="chem${chemEntryNumber}-min-bound" name="chem${chemEntryNumber}MinBound" class="form-control query-input chem-bound" type="number" placeholder="---" min="1" size="3">
        </div>
        <div class="input-group max-bound-container">
            <label class="input-group-text " for="chem${chemEntryNumber}-max-bound">Max:</label>
            <input id="chem${chemEntryNumber}-max-bound" name="chem${chemEntryNumber}MaxBound" class="form-control query-input chem-bound" type="number" placeholder="---" min="1" size="3">
        </div>`;
}

function buildChemValueInputHTML(chemEntryNumber){
    return `<label class="input-group-text " for="chem${chemEntryNumber}-value">Qty:</label>
        <input id="chem${chemEntryNumber}-value" name="chem${chemEntryNumber}Value" class="form-control query-input chem-value" type="number" placeholder="---" min="1">`;
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


//Sorting functions
function SortChemsByQuantityInAscendingOrder(nameValuePairArry){

    //sort by "insertion" algorithm
    /*
        1) Sort the first two elements.
        2) for each next element, if the next element is less than the last sorted, then
            swap thier positions. Continue to compare and swap by this new element until it's
            no longer less than it's Leftward neighbor (or until it has no Leftward neighbor).
            
            This works because all Leftward elements (from this new element) have already been
            sorted.
    */

    //cache interation count
    let iterationCount = nameValuePairArry.length;

    //Insertion implementation
    for (let currentIndex =0; currentIndex < iterationCount; currentIndex++){

        //Clarify our values, for readablility
        let sortedValue = nameValuePairArry[currentIndex][1]; // [name,value]
        let unsortedIndex = currentIndex + 1;

        //Make sure next unsorted index exists before attempting to inspect its value
        if (unsortedIndex < iterationCount){
            
            //Enter swap logic if currentSortedValue > unsortedValue && unsortedIndex is withinBounds
            while(sortedValue > nameValuePairArry[unsortedIndex][1] && unsortedIndex > 0){
                
                //clarify the new unsorted value
                let unsortedValue = nameValuePairArry[unsortedIndex][1];

                //move the unsorted Value to the currentSortedValue's position
                nameValuePairArry[unsortedIndex-1][1] = unsortedValue;

                //move the currentSortedValue to the old unsortedValue's position
                nameValuePairArry[unsortedIndex][1] = sortedValue;
                
                //update the unsorted index to match the new unsortedValue's position
                unsortedIndex--;

                //update the old sortedValue into the next-in-line value (if one exists)
                if (unsortedIndex > 0)
                    sortedValue = nameValuePairArry[unsortedIndex - 1][1];
                 
            }
        }
    }
}


//Submission & Clear functions
function clearQuery(){
    let queryInputCollection = document.getElementsByClassName("query-input");
    queryInputCollection.forEach((element) => { element.value =""; });
}

function clearLog(){
    
}

function logSearchAction(ingredientName, chemArray){

}

function logAddAction(ingredientName, chemArray){

}

function logRemoveAction(ingredientName, chemArray){

}

function buildLogHTML(){
    
}

function submitQueryForm(){
    //Read Query data: Get ingredient name and chem entry data
    let ingredientName = document.getElementsByName("ingredientName").value;
    let chemEntryCollection = document.getElementsByClassName("chem-entry");

    if (queryContext === "search"){
        //read each chem name and bound data

        //display all ingredients that match

        //Log the action to the output area

    }
    else if (queryContext === "add"){
        //read each chem name and value data

        //Add ingredient to data collection if an ingredient was provided

        //Log action to the output area
    }
    else if (queryContext === "remove"){
        //read each chem name

        //Remove ingredient if it exists

        //Log action to the output area
    }

}
