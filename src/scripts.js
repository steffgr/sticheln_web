var numberOfPlayers;
var numberOfCards;
var currentCard=1;
var up=true;

var lastGuesser = 0;
var lastStecher = 0;
var beginner = 0;
var madeGuesses = 0;
var madeStiche = 0;
let guesses =[];
let stiche = [];
let currentPoints = [];

function initialize(){
	document.getElementById("playerCountDiv").style.display = "none";
	document.getElementById("newGuessDiv").style.display = "none";
	document.getElementById("newSticheDiv").style.display = "none";
	document.getElementById("startRoundButton").style.visibility="hidden";
	document.getElementById("sticheButton").style.visibility="hidden";	
}

function newGame(){
	document.getElementById("playerCountDiv").style.display = "block";
	document.getElementById("currentScoreID").style.background = "white";
	document.getElementById("currentScoreID").innerHTML="";
	document.getElementById("newGameButton").style.visibility = "hidden";
}	

function initializeTable() {
	
	numberOfPlayers = document.getElementById("playerNumber").value;
	numberOfCards = document.getElementById("cardNumber").value;
	
	//Start with 0 points for all players and set the size of the array
	for (var i=0; i<numberOfPlayers;i++){
		currentPoints.push(0);
	}	
  
  	const scoreDiv = document.querySelector("div.score")
  	
	let tableHeaders = ["C"]
	
	for (var i = 0; i<numberOfPlayers; i++){
			tableHeaders.push("Player "+(i+1));
	}
	
	//Remote all children from the div which contains the table
	while(scoreDiv.firstChild) scoreDiv.removeChild(scoreDiv.firstChild)

	//Create the table
	let scoreTable = document.createElement("table")
	scoreTable.setAttribute("id", "scoreTableID");
	scoreTable.className="scoreTable"

	//Create the header group element
	let scoreTableHead = document.createElement("thead")
	scoreTableHead.className = "scoreTableHead"

	//Create the row for the headers
	let scoreTableHeaderRow = document.createElement("tr")
	scoreTableHeaderRow.className = "scoreTableHeaderRow"

	tableHeaders.forEach(header => {
		//Create a new tableHeader in this iteration
		let scoreHeader = document.createElement("th")
		scoreHeader.innerText = header
		//Add the Header to the HeaderRow
		scoreTableHeaderRow.append(scoreHeader)
	})

	//Add the HeaderRow to the TableHead
	scoreTableHead.append(scoreTableHeaderRow)
	//Add the Head to the Table
	scoreTable.append(scoreTableHead)

	//Create the TableBody
	let scoreTableBody = document.createElement("tbody")
	scoreTableBody.className = "scoreTableBody"
	//Add the Body to the Table
	scoreTable.append(scoreTableBody)

	scoreDiv.append(scoreTable)
	
	initialize();
	document.getElementById("startRoundButton").style.visibility="visible"
	
}

//Create the Body of the table
function addRow(input){
	const scoreTable = document.querySelector(".scoreTable");
	
	//Create the currentRow
	let scoreTableBodyRow = document.createElement("tr")
	scoreTableBodyRow.className="scoreTableBodyRow";
	
	//Create the first cell with the card number
	let cardNumber = document.createElement("td");
	cardNumber.innerText =currentCard;
	
	scoreTableBodyRow.append(cardNumber)
	
	input.forEach(value => {
		//Create a new cell in this iteration
		let newCell = document.createElement("td");
		//Write the guess into the cell
		newCell.innerText = value;
		//Append the cell to the TableBody
		scoreTableBodyRow.append(newCell);
	})
	
	/*
	for (var i=0; i<players; i++){
		let newCell = document.createElement("td");
		newCell.innerText = i
		scoreTableBodyRow.append(newCell)
	}
	*/
	scoreTable.append(scoreTableBodyRow)
}	



function startRound(){
	document.getElementById("startRoundButton").style.visibility="hidden";
	if (madeGuesses < numberOfPlayers){
		if (lastGuesser==numberOfPlayers){
			lastGuesser=0;
		}	
		lastGuesser++;	
		madeGuesses++;
		document.getElementById("newGuessDiv").style.display = "block";
		document.getElementById("playerLabel").innerHTML = "Player "+lastGuesser;
	}else{
		var showGuesses = [...guesses];
		for (var i=0; i<beginner; i++){
			showGuesses.unshift(showGuesses.pop());
		}
		addRow(showGuesses);
		document.getElementById("newGuessDiv").style.display = "none";
		document.getElementById("sticheButton").style.visibility="visible";
	}	
}	

function sendGuess(){
	guesses.push(document.getElementById("guessNumber").value);
	document.getElementById("guessNumber").value=0;
	startRound();
}	

function sendStiche(){
	document.getElementById("sticheButton").style.visibility="hidden";
	if (madeStiche < numberOfPlayers){
		if (lastStecher==numberOfPlayers){
			lastStecher = 0;
		}
		lastStecher++;
		madeStiche++;
		document.getElementById("newSticheDiv").style.display = "block";
		document.getElementById("playerLabelStiche").innerHTML = "Player "+lastStecher;
	}else{
		deleteLastRow("scoreTableID");
		let points = [];
	
		for (var i=0; i<stiche.length; i++){
			if (stiche[i]==guesses[i]){
				points.push(50+(stiche[i]*10));
			}else{
				points.push(-10);	
			}
		}
		
		for (var i=0; i<beginner; i++){
			points.unshift(points.pop());
		}
				
		addRow(points);
		calculateCurrentScore(points);
		if (currentCard<numberOfCards && up){
			currentCard++;
		}else{	
			up=false;
			currentCard--;
		}	
		
		if (beginner == numberOfPlayers){
			beginner = 1;
		}else{
			beginner++;
		}	
		
		//Empty the arrays and variables
		guesses = [];
		stiche = [];
		lastGuesser = beginner;
		lastStecher = beginner; 
		madeGuesses = 0;
		madeStiche = 0;
		
		if(!up && currentCard==0){
			document.getElementById("currentScoreID").style.background = "green";
			document.getElementById("newSticheDiv").style.display = "none";
			document.getElementById("newGameButton").style.visibility = "visible";
		}else{	
			document.getElementById("newSticheDiv").style.display = "none";
			document.getElementById("startRoundButton").style.visibility="visible";
		}	
	}	
}	

function sendSticheCount(){
	stiche.push(document.getElementById("sticheNumber").value);
	document.getElementById("sticheNumber").value=0;
	sendStiche();
}	

function deleteLastRow(tableID) {
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;

    table.deleteRow(rowCount -1);
}

function calculateCurrentScore(points){
	var scoreDiv = document.getElementById("currentScoreID");
	scoreDiv.innerHTML="";
	for (var i=0; i<numberOfPlayers; i++){
			currentPoints[i]+=points[i];
			scoreDiv.innerHTML = scoreDiv.innerHTML + "<br> <b>Player</b> "+(i+1)+": "+currentPoints[i];
	}	
}
