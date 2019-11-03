// Shorten document.getElementById
function _(el){
    return document.getElementById(el);
}

_("addWords").addEventListener('click', function toggleClick(e){
    if(_("txtArea").style.display == 'block'){
        _("txtArea").style.display = 'none';
        _("submitBtn").style.display = 'none';
        _("infoText").style.display = 'none';
        _("statusText").style.display = 'none';
        _("addWords").innerText = 'Add words';
    }else{
        _("txtArea").style.display = 'block'
        _("submitBtn").style.display = 'block';
        _("infoText").style.display = 'block';
        _("statusText").style.display = 'block';
        _("addWords").innerText = 'Hide';
    }
});

// Gather all references to HTML elements
const txt = _("text");
const wtt = _("wordToTrans");
const cor = _("correct");
const sho = _("show");
const sol = _("solution");
const mis = _("missed");
const cot = _("corrTable");
const mit = _("missTable");
const sen = _("sentence");

// Make the text field focused when opened up
txt.focus();

// Set up the essential vars for later usage
let words = [], correct = [], missed = [], sent = "", givenWord = "", lang = 0;

// Check for localStorage empty, if true replace it with an empty array 
if(localStorage.getItem("missed") == "") localStorage.setItem("missed", JSON.stringify(missed));
if(localStorage.getItem("correct") == "") localStorage.setItem("correct", JSON.stringify(correct));
let isMode = localStorage.getItem("mode");
let localCorrect = localStorage.getItem("correct");
let localMissed = localStorage.getItem("missed");

// Decide which storage to fetch
let pairWord = "", mw = "", randoms = [];
if(isMode == "custom") fetchArray(null);
else fetchArray("mwords.txt");

// Fetch the Google Translate/Images svg pictures
let googleImage = googleTrans = "";
fetch("https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg").then(res => res.text()).then(x => googleTrans = x);
fetch("https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg").then(res => res.text()).then(x => googleImage = x);

// Fetch the example sentence database for later use to display sentences only in English
sen.innerHTML = '<img src="/images/lq_load.gif">';
fetch("sentence.txt")
	.then(resp => resp.text())
	.then(r => sent = r)
	.then(() => {
		if(lang == 0){
			showSent();
		}else{
		    sen.innerHTML = '';
		}
	});

// Check for every keyup on the text field
txt.addEventListener("keyup", () => {
    // Check to see if the value equals to the correct solution
	if(txt.value.toLowerCase().replace(/\s/g, "") == givenWord.replace(/\s/g, "")){
		txt.value = "";
		
		// Push it to the correct array if does not exists yet
		if(!correct.includes(givenWord)){
			correct.push(givenWord);
		}
		
		// Append it to the "correct" localStorage (appendLS is a custom function for appending a new element to an existing localStorage)
		appendLS("correct", givenWord);

        if(lang == 0) showSent();
		givenWord = newWord();
		sen.innerHTML = "";
		if(sol.innerHTML != "") sol.innerHTML = "";
		
	// Check to see if markmode it started and do the setup
	}else if(txt.value.toLowerCase() == "clearall"){
	    txt.value = "";
	    localStorage.clear();
	}else if(txt.value.toLowerCase() == "__custommode__"){
	    txt.value = "";
	    fetchArray(null);
	}else if(txt.value.toLowerCase() == "__defaultmode__"){
	    txt.value = "";
	    fetchArray("words.txt");
	}
});

/*function modeProperties(file, key, value){
    txt.value = "";
	fetchArray(file);
	localStorage.setItem(key, value);
}*/

// Event listener for button click on showing the solution
sho.addEventListener("click", showSol);

// Shortcut on non-mobile: when Esc is pressed the solution is revealed
window.addEventListener("keyup", event => {
   if(event.key == "Escape") showSol(); 
});

// Custom function for displaying the correct word (solution)
function showSol(){
    // Display the Google svg icons and make sure the links are set up correctly
    googleImage = '<svg' + googleImage.split('<svg')[1];
    googleTrans = '<svg' + googleTrans.split('<svg')[1];
	sol.innerHTML = pairWord + "-" + givenWord + "<br><br>" + googleImage + googleTrans;

	let encGW = encodeURIComponent(givenWord);
	document.querySelectorAll("svg")[0].addEventListener("click", () => {
		window.location.href = "https://www.google.hu/search?q=" + encGW + "&tbm=isch";
	});
	
	// Getting the language of the currect word to navigate to the right link in Google Translate
	let [lng, lngRev] = getLang();
	document.querySelectorAll("svg")[1].addEventListener("click", () => {
		window.location.href = "https://translate.google.com/#" + lng + "/" + lngRev + "/" + encGW;
	});
    
    // Push it to the missed array if does not exist
	if(!missed.includes(givenWord)){
		missed.push(givenWord);
	}
	
	// Append missed word to the "missed" localStorage
	appendLS("missed", givenWord);

    // Continue and set up the required things
    givenWord = newWord();
    if(lang == 0) showSent();
	cot.innerHTML = mit.innerHTML = "";
	mis.className = cor.className = "show";
	sho.className = "show current";
	if(lang != 0) sen.innerHTML = "";
}

// Listen for displaying the missed words and do the setup
mis.addEventListener("click", () => {
	cot.innerHTML = sol.innerHTML = ""; 
	showBtn(mit, mis, JSON.parse(localStorage.getItem("missed")));
	cor.setAttribute("data-show", "false");
	sho.className = cor.className = "show";
	mis.className = "show current";
});

// Listen for displaying the correct words and do the setup
cor.addEventListener("click", () => {
	mit.innerHTML = sol.innerHTML = "";
	showBtn(cot, cor, JSON.parse(localStorage.getItem("correct")));
	mis.setAttribute("data-show", "false");
	mis.className = sho.className = "show";
	cor.className = "show current";
});

// Logic for getting a new word pseudo-randomly
function newWord(){
    // Decide whether the displayed word is Hungarian or English
	lang = 0;
	let dec = Math.round(Math.random());
	if(dec >= 0.5){
		lang = 1;
	}

	// Then choose the right part of the "[engWord,hunWord]" splitted array pairs
	let pair = makeRand();
	let need = "";
	if(lang == 0){
		wtt.textContent = pairWord = pair.split("#")[0]; 
		need = pair.split("#")[1];
	}else{
		wtt.textContent = pairWord = pair.split("#")[1];
		need = pair.split("#")[0];
	}
	return need;
}

// Logic for getting the language in what the current word is displayed
function getLang(){
	if(lang == 1){
		return ["hu", "en"];
	}else{
		return ["en", "hu"];
	}
	return false;
}

// Logic for pseudo-randomly select a word with special attention to that two exact same words in the same lanuage cannot be after each other
function makeRand(){
	if(randoms.length == words.length) randoms = [];
	let randomElement = Math.floor(Math.random() * words.length);
	if(randomElement == randoms[randoms.length - 1]){
		if(randomElement == randoms.length - 1) randomElement--;
		else randomElement++;
	}
	randoms.push(randomElement);
	return words[randomElement];
}

// Function for showing the right content when a certain button is pressed
function showBtn(field, btn, array){
    if(!array){
        field.innerHTML = "";
        return;
    }
	let isOpen = btn.getAttribute("data-show");
	if(isOpen == "false"){
		field.innerHTML = "";
		if(array.length <= 0){
			btn.setAttribute("data-show", "true");
		}
		for(let c of array){
			let [lng, lngRev] = getLang();
			field.innerHTML += "<a href='https://translate.google.com/#" + lng + "/" + lngRev + "/" + c + "' target='_blank'>" + c + "</a><br>";
			btn.setAttribute("data-show", "true");
		}
	}else{
		field.innerHTML = "";
		btn.setAttribute("data-show", "false");
	}
}

// Custom logic for retrieving the content from the right source
function fetchArray(file){
    if(file !== null){
        fetch(""+file+"").then(resp => resp.text())
        	.then(text => words = text.replace(/,\s/g, ",").split(","))
        	.then(() => {
        		givenWord = newWord();
        });
        if(localStorage.getItem("mode") != "default"){
            localStorage.setItem("mode", "default");
        }
    }else{
        words = JSON.parse(localStorage.getItem('customWords'));
        givenWord = newWord();
        if(localStorage.getItem("mode") != "custom"){
            localStorage.setItem("mode", "custom");
        }
    }
}

// Logic for showing an example sentence with the right English word in it from the example sentence database with RexExp
function showSent(){
	let wordToFind = " " + wtt.innerText + " ";
	let is = sent.search(wordToFind), x = "", reg = new RegExp("("+wordToFind+")", "gi");
	if(is >= 0) x = sent.slice(is - 40, is + 40);
	x = x.replace(/%/g, "").replace(/(\w+)(\.|\?|"|!)(\w+)+/g, "$1$2 $3").replace(reg, "<b>$1</b>");
	if(x != "") x = "..." + x + "..."; else x = "Unfortunately, no example sentence can be found ...";
	console.log(wordToFind, x);
	sen.innerHTML = x;
}

let x = document.getElementsByTagName("a");
for(let e of Array.from(x)){
	window.href = e.href;
}

// Function for appending a new element to an existing localStorage
function appendLS(name, data){
    let z = flattenDeep(Array.of(JSON.parse(localStorage.getItem(name))));
	if(z.indexOf(data) === -1 && z[0] != null) z.push(data);
	else if(z.indexOf(data) === -1 && z.length === 1) z[0] = data
	localStorage.setItem(name, JSON.stringify(z));
}

// Flatten array
function flattenDeep(arr1) {
   return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

// Making sure that once we click outside of a certain box (e.g.: div of correct words) it vanishes
window.addEventListener("click", event => {
	if((event.srcElement.tagName == "DIV" || event.srcElement.tagName == "HTML")){
		cot.innerHTML = mit.innerHTML = sol.innerHTML = "";
		cor.style.backgroundColor = mis.style.backgroundColor = sho.style.backgroundColor = "#1387ff";
	}
});

// Add words to localStorage
_("submitBtn").addEventListener('click', function addWords(e){
    if(!/(?:\s*\w+\s*\-\s*\w+\s*(\,)?)*\s*\w+\s*\-\s*\w+\s*/.test(_("txtArea").value)){
        _("statusText").innerText = 'Invalid input given';
        _("statusText").setAttribute('class', 'error');
        return;
    }
    let localWords = (_("txtArea").value)
        .replace(/,\s+/g, ',').replace(/\s+\-\s+/, '-')
        .replace(/\-/g, '#').split(',');
    _("txtArea").value = "";
    _("statusText").innerText = 'Wordlist has been successfully added';
    _("statusText").setAttribute('class', 'success');
    if(localStorage.getItem('customWords') != null){
        let wordsSoFar = JSON.parse(localStorage.getItem('customWords'));
        localWords.push(...wordsSoFar);
    }
    localStorage.setItem('customWords', JSON.stringify(localWords));
    localStorage.setItem('mode', 'custom');
    console.log(localWords, words);
    words = localWords;
});

// Check for browser/device width to apply some specific CSS
let propWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
if(propWidth <= 768){
    document.getElementsByClassName("cmTable")[0].style.width = (propWidth - 5) + "px";
    document.getElementsByClassName("cmTable")[1].style.width = (propWidth - 5) + "px";
}