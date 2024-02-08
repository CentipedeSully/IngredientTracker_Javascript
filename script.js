//Class defs
class Ingredient{
    #name = '';
    #chemMap = new Map();

    //chemMap is a Map of (chemicalName, quantity) pairs
    constructor(name, chemMap){
        let isNameValid = isStringValid(name) && !isStringEmpty(name);
        let isChemMapValid = isMapValid(chemMap);

        if ( isNameValid && isChemMapValid)
        {
            this.#name = name.toLowerCase();
            let chemEntriesArry = [...chemMap.entries()]

            //further validate the Map. Only add valid chemical entries, and make the names lower case
            for (let i = 0; i < chemEntriesArry.length; i++){

                if (isStringValid(chemEntriesArry[i][0]) && isNumberValid(chemEntriesArry[i][1]))
                    this.#chemMap.set(chemEntriesArry[i][0].toLowerCase(),chemEntriesArry[i][1]);
            };

        }
        else { 
            if ( !isNameValid && !isChemMapValid)
                console.log(`invalid name AND map detected in Ingredient Constructor (name,map): (${name}, ${chemMap})`);
            else if (!isNameValid)
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
        let isNameValid = isStringValid(name) && !isStringEmpty(name);
        let isValueValid = isNumberValid(value);  
        if ( isNameValid && isValueValid)
            this.#chemMap.set(name,value);
        else{
            if ( !isNameValid && !isValueValid)
                console.log(`invalid name AND value detected while adding chemical (name,value): (${name}, ${value})`);
            else if (!isNameValid)
                console.log(`invalid name detected while adding Chemical: ${name}`);
            
            else console.log(`invalid value detected while adding Chemical: ${value}`);
        }

    }

    removeChemical(name){
        if (this.doesChemicalExist(name))
            this.#chemMap.delete(name);
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
            return [];
        }

        //Get the chemical names, sorted
        let allChemicalNames = [...this.#chemMap.keys()].sort();
        

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
            if ((minValue <= unboundMatches[i][1]) && ( unboundMatches[i][1] <= maxValue))
                matchingPairsWithinBounds.push(unboundMatches[i]);
        }

        //return the output arry
        return matchingPairsWithinBounds;
    }
}

class ChemicalEntryData{
    name = '';
    value = 0;
    minBound=0;
    maxBound=9;
}

//Internal state-tracking Declarations
let ingredientCollection = [];
let displayedIngredientCollection = [];
let ingredientsOnDisplayCount = 0;
let chemicalEntriesCount = 0;
let queryIngredientName ='';
let chemicalQueryData = [];
let queryContext = "search";
let sortStyle = "alphabetical";




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
submitQueryBtn.addEventListener("click", testAddingTableElements);
let clearQueryBtn = document.getElementById("clear-query-btn");
clearQueryBtn.addEventListener("click",clearQuery);

let sortDisplayBtn = document.getElementById("sort-display-btn");
let clearDisplayBtn = document.getElementById("clear-display-btn");
clearDisplayBtn.addEventListener("click",clearDisplay);



let clearOutputLogBtn = document.getElementById("clear-output-log-btn");



//Display References
let totalDatabasePopulationDisplay = document.getElementById("total-database-population-display");
let currentTablePopulationDisplay = document.getElementById("current-table-population-display");
let displayTableBody = document.getElementById("display-table-body");
let logOutputDisplay = document.getElementById("log-output");



// Helper Functions
//Validation related
function isStringValid(name){
    return name !== null && typeof name === 'string' && name !== undefined;
}

function isNumberValid(value){
    return value !== null && typeof value === "number"  && value !== undefined;
}

function isMapValid(mapParameter){
    return mapParameter !== null && mapParameter instanceof Map  && mapParameter !== undefined;
}

function isStringEmpty(name){
    return name ==="";
}



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



//Table-related utilities
/*
function buildTableEntryHtml(entryIndex, ingredient){

    //Begin building the html string
    let tableEntryHtml = '';

    //cache the array of chemical entries
    let chemValuePairArry = ingredient.chemicalValuePairs;

    for (let i = 0; i < chemValuePairArry.length; i++){

        //Build the ingredient row if it's the first iteration
        if (i === 0){
            tableEntryHtml += `<tr class="ingredient-row chemical-row">
            <td class="index-cell">${entryIndex}</td>
            <td class="ingredient-cell">${ingredient.name}</td>
            <td class="chemical-cell">${chemValuePairArry[i][0]}</td>
            <td class="value-cell">${chemValuePairArry[i][1]}</td>
        </tr>`;
            
        }


        //Otherwise build a chemical row
        else {
            tableEntryHtml += `<tr class="chemical-row">
            <td class="index-cell">${entryIndex}</td>
            <td class="ingredient-cell"></td>
            <td class="chemical-cell">${chemValuePairArry[i][0]}</td>
            <td class="value-cell">${chemValuePairArry[i][1]}</td>
        </tr>`;
            
        }
    }

    //return the html string
    return tableEntryHtml;
}

function createTableElement(ingredient){
    //Make sure the ingredient is valid
    if (ingredient === null || ingredient === undefined)
        return;

    //Create new empty element
    let newTableEntry = document.createElement("div");

    //Update the element's attributes into a useable container
    newTableEntry.setAttribute("id",`table-entry${ingredientsOnDisplayCount + 1}`);
    newTableEntry.setAttribute("class","table-entry");

    //Add the element to the table
    displayTableBody.append(newTableEntry);

    //Build the element's inner HTML
    newTableEntry.innerHTML= buildTableEntryHtml(ingredientsOnDisplayCount + 1, ingredient);

    //update the internal display count
    ingredientsOnDisplayCount++;

    //Update the displayed count of table items
    currentTablePopulationDisplay.value = ingredientsOnDisplayCount;

    //add ingredient to the internally-cached display collection
    displayedIngredientCollection.push(ingredient);
}

function removeTableElement(entryIndex){
    
    //Make sure this entry exists
    let tableEntry = document.getElementById(`table-entry${entryIndex}`);
    if (tableEntry === null)
        return;

    //Identify this entry's ingredient: look at the "ingredient-cell"'s value
    let ingredientName = tableEntry.getElementsByClassName('ingredient-cell')[0].value;
    console.log(`Removing ingredient: ${ingredientName}`);

    //remove the entry from the table
    tableEntry.remove();

    //update the internal display count
    ingredientsOnDisplayCount--;

    //update the displayed count of table items
    currentTablePopulationDisplay.value = ingredientsOnDisplayCount;

    //Remove the entry from the inernally-cached "Ingredients on display" collection
    for (let i=0; i < displayedIngredientCollection.length; i++){
        if (ingredientName === displayedIngredientCollection[i].name){
            console.log(`table display arry before deletion @ index ${i}:\n ${displayedIngredientCollection}`);
            displayedIngredientCollection.splice(i,1);
            console.log(`after deletion @ index ${i}:\n ${displayedIngredientCollection}`);
            break;
        }
    }

}

function clearAllTableEntries(){
    //remove each table entry
    for (let i=0; i < ingredientsOnDisplayCount; i++){
        removeTableElement(i+1);
    }
}
*/

function createIngredientRowElement(entryIndex,ingredientName, chemValuePair){
    //create the new table element
    let newTableRow = document.createElement("tr");

    //Update the element's attributes into a valid ingredientRow
    newTableRow.setAttribute("class","ingredient-row table-row");

    //create the element's innerHtml
    let tableEntryHtml = `<td class="index-cell">${entryIndex}</td>
            <td class="ingredient-cell">${ingredientName}</td>
            <td class="chemical-cell">${chemValuePair[0]}</td>
            <td class="value-cell">${chemValuePair[1]}</td>`;

    //Setup the element's inner HTML
    newTableRow.innerHTML = tableEntryHtml;

    //Append the row onto the table
    displayTableBody.append(newTableRow);
}

function createChemicalRowElement(entryIndex,chemValuePair){
    //create the new table element
    let newTableRow = document.createElement("tr");

    //Update the element's attributes into a valid ingredientRow
    newTableRow.setAttribute("class","chemical-row table-row");
  
    //create the element's innerHtml
    let tableEntryHtml = `<td class="index-cell">${entryIndex}</td>
            <td class="ingredient-cell"></td>
            <td class="chemical-cell">${chemValuePair[0]}</td>
            <td class="value-cell">${chemValuePair[1]}</td>`;

    //Setup the element's inner HTML
    newTableRow.innerHTML = tableEntryHtml;

    //Append the row onto the table
    displayTableBody.append(newTableRow);
}

function displayIngredient(ingredient){
    //Validate our ingredient
    if (ingredient === null || ingredient === undefined){
        return;
    }

    //Cache the chem value pairs
    let chemValuePairsArry = ingredient.chemicalValuePairs;

    //infer this ingredient's display index. Cached for clarity
    let entryIndex = ingredientsOnDisplayCount + 1; // Start counting at 1, for user readability


    //Build a row for each chemical entry
    for (let i =0; i < chemValuePairsArry.length; i++){

        //The first row of each ingredient is unique: an Ingredient row
        if (i === 0){
            createIngredientRowElement(entryIndex, ingredient.name, chemValuePairsArry[i]);
        } 

        //other rows are chemical rows. They're built different.
        else {
            createChemicalRowElement(entryIndex,chemValuePairsArry[i]);
        }
    }


    //Update display Utils
    ingredientsOnDisplayCount++;

    //Update the displayed count of table items
    currentTablePopulationDisplay.value = ingredientsOnDisplayCount;

    //Add ingredient to the interal display cache
    displayedIngredientCollection.push(ingredient);

}

function clearDisplay(){
    //Get all of the rows
    let tableRowsArry = [...displayTableBody.getElementsByClassName("table-row")];

    //cache the number of rows
    let rowCount = tableRowsArry.length;
    while (rowCount > 0)
    {
        //Remove each element
        tableRowsArry.pop().remove();
        rowCount--;
    }

    //Update display Utils
    ingredientsOnDisplayCount=0;

    //Update the displayed count of table items
    currentTablePopulationDisplay.value = ingredientsOnDisplayCount;

    //Clear the internal ingredient display collection
    displayedIngredientCollection.length = 0;
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
    for (let i = 0; i < queryInputCollection.length; i++)
        queryInputCollection[i].value = "";
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

function readChemicalQueryData(chemEntryCollection){
    //Clear the old query
    chemicalQueryData.length = 0;

    for (let i=0; i < chemEntryCollection.length; i++){
        //Build a new chem query object
        let chemData = new ChemicalEntryData;

        //Validate and read the name, numbers, and values
        let chemName = document.getElementById(`chem${i + 1}-name`).value;
        if (isStringValid(chemName))
            chemData.name = chemName;

        if (document.getElementById(`chem${i + 1}-value`) !== null){
            let chemValue = document.getElementById(`chem${i + 1}-value`).value;
            chemData.value = chemValue;
        }
        
        if (document.getElementById(`chem${i + 1}-min-bound`) !== null){
            let chemMinBound = document.getElementById(`chem${i + 1}-min-bound`).value;
            chemData.minBound = chemMinBound;
        }
        
        if (document.getElementById(`chem${i + 1}-max-bound`) !== null){
            let chemMaxBound = document.getElementById(`chem${i + 1}-max-bound`).value;
            chemData.maxBound = chemMaxBound;
        }


        //Add the data to the query collection
        chemicalQueryData.push(chemData);
        
    }
}

function submitQueryForm(){
    //Read Query data: Get ingredient name and chem entry data
    let ingredientName = document.getElementById("ingredient-name-input").value;
    let chemEntryCollection = document.getElementsByClassName("chem-entry");
    console.log(`${chemEntryCollection.length} eentries collected`);

    //Validate ingredient name
    if (!isStringValid(ingredientName))
        ingredientName = '';

    //Add ingredient name to the query
    queryIngredientName = ingredientName;

    //Read chemical query data
    readChemicalQueryData(chemEntryCollection);

    logQueryData();

    if (queryContext === "search"){
        //display all ingredients that match

        //Log the action to the output area

    }
    else if (queryContext === "add"){
        //Add ingredient to data collection if an ingredient was provided

        //Log action to the output area
    }
    else if (queryContext === "remove"){
        //Remove ingredient if it exists

        //Log action to the output area
    }

}



//Debugging utilities
function logIngredient(ingredient){
    console.log(
        `Logging Ingredient: \n
        Name: ${ingredient.name}\n
        Chemicals: ${ingredient.chemicalValuePairs}\n
        End of Ingredient`);
}

function testStringValidation(){
    let undefinedString;
    let nullString = null;
    let emptyString = '';
    let validString = "I'm a valid string, I swear!";
    let nonstringDataType = 0;
    console.log(
        `Testing string validation...\n
        Is undefined variable valid: ${Ingredient.isStringValid(undefinedString)} (expected: False)\n
        Is null variable valid: ${Ingredient.isStringValid(nullString)} (expected: False)\n
        Is empty string valid: ${Ingredient.isStringValid(emptyString)} (expected: False)\n
        Is valid string valid: ${Ingredient.isStringValid(validString)} (expected: True)\n
        Is nonstring data type valid: ${Ingredient.isStringValid(nonstringDataType)} (expected: False)\n
        End of string validation test`);
}

function testMapValidation(){
    let undefinedMap;
    let nullMap = null;
    let emptyMap = new Map();
    let validMap = new Map().set(["Salt",9]);
    let nonMapDataType = 0;

    console.log(
        `Testing map validation...\n
        Is undefined variable valid: ${Ingredient.isMapValid(undefinedMap)} (expected: False)\n
        Is null variable valid: ${Ingredient.isMapValid(nullMap)} (expected: False)\n
        Is empty map valid: ${Ingredient.isMapValid(emptyMap)} (expected: True)\n
        Is valid map valid: ${Ingredient.isMapValid(validMap)} (expected: True)\n
        Is nonMap data type valid: ${Ingredient.isMapValid(nonMapDataType)} (expected: False)\n
        End of string validation test`);
}

function buildTestIngredient(){
    let name = "test ingredient";
    let chemMap = new Map();
    chemMap.set("salt",1);
    chemMap.set("water",2);
    chemMap.set("saltwater",3);
    chemMap.set("cee",20);
    
    chemMap.set(41, "invalid Number");
    chemMap.set("DEE");
    //console.log(`chemMap: ${[...chemMap.entries()]}\nsize: ${chemMap.size}`);
    //console.log(`chemMap entry 1: ${[...chemMap.entries()][0]}`);

    let ingredient = new Ingredient(name,chemMap);
    logIngredient(ingredient);
    return ingredient;
}

function testAddingDataToIngredient(){
    let ingredient= buildTestIngredient();

    let validChemName = "test Chem";
    let validValue = 4;

    let invalidChemName = "";
    let invalidValue = "four";

    console.log("Attempting to add Invalid Data to ingredient...");
    ingredient.addChemical(validChemName,invalidValue);
    ingredient.addChemical(invalidChemName,validValue);
    ingredient.addChemical();
    ingredient.addChemical(null,null);
    logIngredient(ingredient);
    
    console.log("adding valid data to ingredient...");
    ingredient.addChemical(validChemName,validValue);
    logIngredient(ingredient);

    console.log("updating preexisting value within ingredient...");
    ingredient.addChemical(validChemName, 100);
    logIngredient(ingredient);


}

function testRemovingDataFromIngredient(){
    let ingredient= buildTestIngredient();

    let validChemName = "cee";
    let validValue = 4;

    let invalidChemName = "";
    let invalidValue = "four";

    console.log("attempting to remove nonexistent items from ingredient...");
    ingredient.removeChemical(invalidChemName);
    ingredient.removeChemical(null);
    ingredient.removeChemical();
    logIngredient(ingredient);

    console.log("removing item 'cee' from ingredient...");
    ingredient.removeChemical("cee");
    logIngredient(ingredient);
}

function testIngredientChemSearching(){
    let ingredient = buildTestIngredient();

    let universalSubstring="";
    let substring = "salt";
    let nonexistentSubstring = "NonExistent Chem";
    let undefinedChem;
    let nullChem = null;

    console.log(`Searching for a chems with universal substring '${universalSubstring}' in ingredient:\nResults:\n
    ${ingredient.getChemicalPairsViaSubstring(universalSubstring)}\nEnd of search`);
    console.log(`Searching for a chems with substring '${substring}' in ingredient:\nResults:\n
    ${ingredient.getChemicalPairsViaSubstring(substring)}\nEnd of search`);
    console.log(`Searching for a chems with nonexistent substring '${nonexistentSubstring}' in ingredient:\nResults:\n
    ${ingredient.getChemicalPairsViaSubstring(nonexistentSubstring)}\nEnd of search`);
    console.log(`Searching for a chems with undefined substring '${undefinedChem}' in ingredient:\nResults:\n
    ${ingredient.getChemicalPairsViaSubstring(undefinedChem)}\nEnd of search`);
    console.log(`Searching for a chems with null substring '${nullChem}' in ingredient:\nResults:\n
    ${ingredient.getChemicalPairsViaSubstring(nullChem)}\nEnd of search`);


}

function testIngredientChemBoundSearching(){
    let ingredient = buildTestIngredient();

    let universalSubstring="";
    let substring = "salt";
    let nonexistentSubstring = "NonExistent Chem";
    let undefinedChem;
    let nullChem = null;

    let minBound = 2;
    let maxBound = 3;

    console.log(`Searching for a chems with universal substring '${universalSubstring}' in ingredient (Bounds:(${minBound},${maxBound})):\nResults:\n
    ${ingredient.getChemicalPairsViaSubstringAndBounds(universalSubstring,minBound,maxBound)}\nEnd of search`);
    console.log(`Searching for a chems with substring '${substring}' in ingredient (Bounds:(${minBound},${maxBound})):\nResults:\n
    ${ingredient.getChemicalPairsViaSubstringAndBounds(substring,minBound,maxBound)}\nEnd of search`);
    console.log(`Searching for a chems with nonexistent substring '${nonexistentSubstring}' in ingredient (Bounds:(${minBound},${maxBound})):\nResults:\n
    ${ingredient.getChemicalPairsViaSubstringAndBounds(nonexistentSubstring,minBound,maxBound)}\nEnd of search`);
    console.log(`Searching for a chems with undefined substring '${undefinedChem}' in ingredient (Bounds:(${minBound},${maxBound})):\nResults:\n
    ${ingredient.getChemicalPairsViaSubstringAndBounds(undefinedChem,minBound,maxBound)}\nEnd of search`);
    console.log(`Searching for a chems with null substring '${nullChem}' in ingredient (Bounds:(${minBound},${maxBound})):\nResults:\n
    ${ingredient.getChemicalPairsViaSubstringAndBounds(nullChem,minBound,maxBound)}\nEnd of search`);

    
}

function logQueryData(){
    let entryLogString = '';

    for (let i=0; i < chemicalQueryData.length; i++){
        //create the name component of this substring
        let chemDataString = `${i+1}) ChemName : ${chemicalQueryData[i].name}\n`;

        //create the value component
        chemDataString += `${i+1}) Value : ${chemicalQueryData[i].value}\n`;

        //create the min and max bound components
        chemDataString += `${i+1}) MinBound : ${chemicalQueryData[i].minBound}\n`;
        chemDataString += `${i+1}) MaxBound : ${chemicalQueryData[i].maxBound}\n`;

        //Apply this substring to the main logString
        entryLogString += chemDataString;
    }

    console.log(`
    Current Query:\n
    Ingredient: ${queryIngredientName}\n
    Chemical Entries: \n` 
    + `${entryLogString}`)
}


function testAddingTableElements(){
    let ingredient = buildTestIngredient();


    console.log('Adding test ingredient to table...');
    displayIngredient(ingredient);
}

function testRemovingTableElements(){
}