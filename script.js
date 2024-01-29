//Initial Declarations
let ingredientCollection = Map.set(); //Key === ingredient name, value === chemical map
let context = "search";
let sortStyle = "alphabetical";

//Button References
let importBtn = Document.getElementById("import-btn");
let exportBtn = Document.getElementById("export-btn");

let searchContextBtn = Document.getElementById("search-context-btn");
let addContextBtn = Document.getElementById("add-context-btn");
let removeContextBtn = Document.getElementById("remove-context-btn");
let ingredientInputName = Document.getElementById("input-ingredient-name");









// Helper Functions
function Ingredient(name, chemicalMap){
    this.name = name;
    this.chemicalMap=chemicalMap;
}

function buildChemHTMLInputField(indexNumber)
{
    return `<div id="chem${indexNumber}-name-input-group" class="input-group pb-1">
    <label id="chem${indexNumber}-label" class="input-group-text " for="chem${indexNumber}-input">Chem:</label>
    <input id="chem${indexNumber}-input" class="form-control" type="text" placeholder="---">
    </div>
    <div id="chem${indexNumber}-quantity-input-group" class="input-group pb-3">
    <span class="input-group-text">min</span>
    <input id="chem${indexNumber}-min-input" class="form-control" type="number" placeholder="1">
    <span class="input-group-text">max</span>
    <input id="chem${indexNumber}-max-input" class="form-control" type="number" placeholder="999">
    </div>`
}


// Event/Action Functions


