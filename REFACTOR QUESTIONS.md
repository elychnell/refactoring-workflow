[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ndnTQ3NH)

# Inlämningsuppgift 2 i Arbetsmetodik, 10 YHP

Reflektioner kring kodkvalitet och hållbarhet.
Du kan använda tre backticks följt av språket för att skapa ett kodblock för dina exempel, t.ex. såhär:

```typescript
const myButton: HTMLButtonElement = document.querySelector('#my-button');
```

## Fråga 1 - Identifiera teknisk skuld

Ge ett konkret exempel på ett kodblock från gruppuppgiften (antingen skrivet av dig eller en gruppmedlem)
som du i efterhand identifierade som svårläst eller komplicerat. Vad var det som gjorde koden problematisk?

## Svar Fråga 1:

Jag upplevde att koden som kördes för att göra transitions mellan
dom olika rummen var svår att greppa exakt hur den fungerade.

Detta är transition scriptet:

```typescript
//-----------------------------------------------------------
//------------------- CURRENT PAGE STATE --------------------
//-----------------------------------------------------------

// keeps in mid what sections is current
let currentPage: HTMLElement | null = null;

// Lock transition while ongoing
let isTransitioning = false;

/**
 * Saves the active/ current page
 */
function setCurrentPage(page: HTMLElement): void {
	currentPage = page;
}

// Returns currentpage
export function getCurrentPage(): HTMLElement | null {
	return currentPage;
}

//-----------------------------------------------------------
//------------------- FIND ACTIVE PAGE ----------------------
//-----------------------------------------------------------

// finds out what section currently has .isVisible
function getActivePage(): HTMLElement | null {
	if (currentPage) return currentPage;

	return document.querySelector<HTMLElement>('main > section.page.isVisible');
}

//-----------------------------------------------------------
//------------------- SHOW SECTION DIRECT -------------------
//-----------------------------------------------------------

//showSection directly
export function showSection(
	section: HTMLElement,
	visibleClass = 'isVisible',
): void {
	// make sure sections removes hidden
	section.classList.remove('hidden');

	// conects the page.isVisible opactiy scss
	requestAnimationFrame(() => {
		section.classList.add(visibleClass);
	});

	// makes section current
	setCurrentPage(section);
}

//-----------------------------------------------------------
//------------------- HIDE SECTION DIRECT -------------------
//-----------------------------------------------------------

// Hides section with fade out
export function hideSection(
	section: HTMLElement,
	durationMs = 600,
	visibleClass = 'isVisible',
): void {
	// removes opacity 0 and trigger opacity 1 scss
	section.classList.remove(visibleClass);

	// after animation add hidden
	window.setTimeout(() => {
		section.classList.add('hidden');
	}, durationMs);
}

//-----------------------------------------------------------
//------------------- GO TO SECTION -------------------------
//-----------------------------------------------------------

// makes the switch from currentpage to next page
export function goToSection(
	to: HTMLElement,
	durationMs = 1200,
	visibleClass = 'isVisible',
): void {
	if (isTransitioning) return;

	// find / get current page/section
	const from = getActivePage();

	// if no page is active / current - show right away
	if (!from) {
		showSection(to, visibleClass);
		return;
	}

	// make sure section is showed
	if (from === to) {
		showSection(to, visibleClass);
		return;
	}

	isTransitioning = true;
	// void playSfx("sfx_transition"); TODO

	// prepp next page by removing display none
	to.classList.remove('hidden');

	// trigger next page to transition
	to.classList.remove(visibleClass);

	// and then set the next page as currentPage
	setCurrentPage(to);

	// Staring fade-in
	requestAnimationFrame(() => {
		to.classList.add(visibleClass);

		// start fade out on previous page
		requestAnimationFrame(() => {
			from.classList.remove(visibleClass);
		});
	});

	// when trasition is done - add display:none to previous page
	window.setTimeout(() => {
		from.classList.add('hidden');
		isTransitioning = false;
	}, durationMs);
}

//-----------------------------------------------------------
//-------------- SPLASH HEADING FADE HELPERS ----------------
//-----------------------------------------------------------

// SPLASHPAGE FADE-IN
export function revealSplashHeading(delayMs = 200): void {
	const splashHeading = document.querySelector<HTMLElement>('.splashHeading');
	if (!splashHeading) return;

	window.setTimeout(() => {
		splashHeading.classList.add('isVisible');
	}, delayMs);
}

// FADE OUT SPLASH
export function hideSplashHeading(delayMs = 0): void {
	const splashHeading = document.querySelector<HTMLElement>('.splashHeading');
	if (!splashHeading) return;

	window.setTimeout(() => {
		splashHeading.classList.remove('isVisible');
	}, delayMs);
}
```

Utöver detta script så behövde vi även följande kod i varje enskilt rum:

```typescript
window.setTimeout(() => {
	hideGameHeader();
	showMsg("Time's up — next chamber awaits", 1200 * 2);

	if (shouldReturnToGameOver()) {
		clearReplayMode();
		goToNextRoom('#gameOverRoom', gameOverRoomFunc);
		return;
	}

	goToNextRoom('#room4Metal', room4metalFunc);
}, 1200);
```

Jag tror att problemet mest var att koden ifråga var skriven med hjälp av AI vilket ledde till att inte ens den personen som
introducerade koden var helt klar över hur den fungerade eller snarare varför det inte riktigt fungerade som det var tänkt alla gånger.

När koden introducerades i projektet så var den inte så väl kommenterad som den är nu,
Vilket gjorde koden svårläst. Men med kommentarerna och diskussion inom gruppen så blev
det klarare vad koden gjorde och vad vi alla behövde göra i våra individuella rum.

Det känns som att koden i sig är kanske inte superkomplex eller skriven på fel sätt men det är ett bra exempel på hur användningen av AI kan orsaka problem.
Inte för att koden nödvändigtvis var dålig men för att förståelsen kring koden var det och att det då blir ett hinder när koden sen måste felsökas eller adapteras.

En läxa gällande AI som iallafall jag kommer att ta med mig i min karriär.

## Fråga 2 - Refaktorering i praktiken

Beskriv en specifik ändring du har gjort i kod för att förenkla den. Det kan vara från inlämningsuppgift 1 i denna kurs, eller från gruppuppgiften i föregående kurs.

Hur såg koden ut före respektive efter, och på vilket sätt blev den mer lättförståelig?

## Svar Fråga 2:

Nu blir det nog lite svårt att visa exakt hur koden såg innan ut eftersom den nu är ändrad.
Men koden i inlämningsuppgift 1 i createHtml filen var skriven så att alla funktioner vad skrivna inom själva createHtml funktionen.

Det är ju inte fel syntax att göra så men det gör koden något svårläst speciellt i en typescript context.
Sedan fanns det även en iterations variabel (i) som egentligen inte behövdes eftersom koden använde .forEach:

```typescript
const podCastList = await getPodcasts()
podCastList.programs.forEach(podCast) {...}
```

Vi behöver inte hålla reda på vilken iteration vi befinner oss på om vi ändå bara ska applicera samma kod på alla saker i listan.
Loopen hade också en podCast variabel som aldrig användes i koden. Till en början valde jag att endast ta bort den.

Men den kom till användning när jag ville flytta ut alla funktionerna från createHtml funktionen.
Eftersom jag då behövde skicka med parametrar till de flesta av funktionerna.

Jag adderade också JSDoc kommentarer för alla funktioner för att öka tydligheten i filen.
Vilket nu var lättare eftersom funktionerna nu var separata från createHtml funktionen istället för att definieras inom den.

Slutresultatet blev då:

```typescript
import { getPodcasts } from './api';

/**
 * @function createInnerArticle
 * @description Creates an article element with the class 'innerArticle' and appends it to the podcast container.
 * @returns {HTMLElement} The created article element.
 */

function createInnerArticle() {
	const podCastContainer = document.querySelector('.podlistPods');
	const innerArticle = document.createElement('article');
	innerArticle.setAttribute('class', 'innerArticle');
	podCastContainer?.appendChild(innerArticle);
	return innerArticle;
}

/**
 * @function createImg
 * @param {Object} podCast - The podcast object containing the social image URL of the podcast.
 * @param {HTMLElement} innerArticle - The article element to which the image will be appended.
 * @description Creates an image element with the podcast's social image URL and appends it to the inner article element.
 */

function createImg(
	podCast: { socialimage: string; name: string },
	innerArticle: HTMLElement,
) {
	const imgPlacement = document.createElement('IMG');
	imgPlacement.setAttribute('src', podCast.socialimage);
	imgPlacement.setAttribute('width', '100');
	imgPlacement.setAttribute('height', '100');
	imgPlacement.setAttribute('alt', 'Bild: ' + podCast.name);
	innerArticle.appendChild(imgPlacement);
}

/**
 * @function createTextDiv
 * @param {HTMLElement} innerArticle - The article element to which the text div will be appended.
 * @description Creates a div element with the class 'articleDiv' and appends it to the inner article element.
 * @returns {HTMLElement} The created div element.
 */

function createTextDiv(innerArticle: HTMLElement) {
	const textDiv = document.createElement('div');
	textDiv.setAttribute('class', 'articleDiv');
	innerArticle.appendChild(textDiv);
	return textDiv;
}

/**
 * @function createLink
 * @param {Object} podCast - The podcast object containing the URL of the podcast.
 * @param {HTMLElement} textDiv - The div element to which the link will be appended.
 * @description Creates an anchor element with the podcast URL and appends it to the text div element.
 */

function createLink(
	podCast: { programurl: string; name: string },
	textDiv: HTMLElement,
) {
	const linkPlacement = document.createElement('a');
	const linkText = document.createTextNode('Lyssna här');
	linkPlacement.setAttribute('href', podCast.programurl);
	linkPlacement.setAttribute('target', '_blank');
	linkPlacement.setAttribute('alt', 'Länk till ' + podCast.name);
	linkPlacement.appendChild(linkText);
	textDiv.appendChild(linkPlacement);
}

/**
 * @function createP
 * @param {Object} podCast - The podcast object containing the description of the podcast.
 * @param {HTMLElement} textDiv - The div element to which the paragraph will be appended.
 * @description Creates a paragraph element with the podcast's description and appends it to the text div element.
 */
function createP(podCast: { description: string }, textDiv: HTMLElement) {
	const descPlacement = document.createElement('p');
	const desc = document.createTextNode(podCast.description);
	descPlacement.appendChild(desc);
	textDiv.appendChild(descPlacement);
}

/**
 * @function createHeader
 * @param {Object} podCast - The podcast object containing the name of the podcast.
 * @param {HTMLElement} textDiv - The div element to which the header will be appended.
 * @description Creates a header element with the podcast's name and appends it to the text div element.
 */

function createHeader(podCast: { name: string }, textDiv: HTMLElement) {
	const headerPlacement = document.createElement('h2');
	const programName = document.createTextNode(podCast.name);
	headerPlacement.appendChild(programName);
	textDiv.appendChild(headerPlacement);
}

/**
 * @function createHtml
 * @description Creates HTML elements via the other functions for each podcast and appends them to the page.
 */

export async function createHtml() {
	const podCastList = await getPodcasts();
	podCastList.programs.forEach(
		(podCast: {
			socialimage: string;
			name: string;
			programurl: string;
			description: string;
		}) => {
			const innerArticle = createInnerArticle();
			createImg(podCast, innerArticle);
			const textDiv = createTextDiv(innerArticle);
			createLink(podCast, textDiv);
			createHeader(podCast, textDiv);
			createP(podCast, textDiv);
		},
	); //forEach END
} // createHtml END
```

Vilket jag tycker gör det mycket tydligare vad funktionerna gör samt vilka parametrar dom förväntar sig.

## Fråga 3 - Clean code

Motivera varför det är viktigt för ett team av Front End-utvecklare att sträva efter förenklad kod istället för att bara fokusera på att funktionaliteten "fungerar".

## Svar Fråga 3:

För att det ska bli lättare att underhålla koden. Det vill säga felsöka och adaptera den till ett förändrat use case.
Och för att man lättare ska kunna förstå varandras kod om flera jobbar inom samma projekt.

Mer (komplex) kod är också alltid en större belastning. Både vad det gäller hårdvaru resurser men också till exempel när det gäller överföring av filer etc.
Det märks inte mycket till en början med dagens hårdvara och internet hastigheter men ju större projekt desto större påverkan får det om man slarvar.

Kan man uppnå samma resultat med färre rader kod så är det alltid att föredra.
Det är därför man kan säga att man skjuter man sig själv i foten om man gör en "Elon"
och avskedar alla programmerare som inte producerat "tillräckligt" många rader kod.

## Fråga 4 - DRY (Don't Repeat Yourself)

Hittade ni logik i grupparbetsprojektet som upprepades på flera ställen? Om ja, hur gick ni tillväga för att bryta ut detta till återanvändbara komponenter eller hjälpfunktioner?

## Svar Fråga 4:

Ja trots att vi i alla fall hade ambitioner att planera sådana saker i förväg så blev det säkert lite repetering på ett par ställen.
Jag kommer inte på något exempel från mitt rum och jag har inte full insikt i de andras rum.

Men vi hade bland annat en bugg i fusk motorn som gjorde att rummen inte avslutades korrekt.
Eller snarare keybinds och ljudfiler blev aldrig bortstädade något som visade sig i demon vi hade också.

Jag tog på mig uppgiften att lösa den buggen och det hade varit en "enkel" lösning att bara kopiera koden från dom olika rum filerna och köra den igen i fusk motor filen.
Men jag tänkte faktiskt på DRY då och insåg att alla rummen hade redan en specifik funktion för detta så jag valde att exportera dom och importera dom i fusk motorn istället.

## Fråga 5 - Namngivningens betydelse

Reflektera över hur ni namngav variabler, funktioner och komponenter i projektet. Ge ett exempel på ett namn som ändrades under resans gång för att bättre kommunicera dess syfte.

## Svar Fråga 5:

Vi bestämde oss tidigt under planeringen för att vi kommer att använda camelCase och att vi ska försöka namnge alla våra funktioner på ett sätt som gör koden "självkommenterande"
Och det följde vi alla sedan under projektets gång. Det är möjligt att någon av dom andra ändrat ett namn någonstans men jag var aldrig inblandad i någon namnändring eftersom vi alla
följde dom rekommendationer som vi kommit överens om under planerings stadiet av projektet.

## Fråga 6 - När är det dags att refaktorera?

Hur avgjorde ni i gruppen när det var läge att förbättra befintlig kod kontra när det var viktigare att prioritera att bygga ny funktionalitet för att nå deadline?

## Svar Fråga 6:

Vi byggde ny funktionalitet och löste buggar ändra fram till deadline så vi han aldrig påbörja något större refaktorerings projekt för hela projektet.
Jag gjorde dock ändringar där jag kunde se att det såg tokigt ut under projektets gång. Men om vi hade haft mer tid så hade det varit en bra ide att
starta ett refaktorerings projekt när projektets funktionalitet var på plats men vi hade tid kvar till deadline.

Alternativt skulle man kunna inleda jobbet med en nästa version med att refaktorera koden.

## Fråga 7 - Kodgranskning (Code Review) som verktyg

På vilket sätt bidrog era gemensamma genomgångar av koden till att identifiera svaga punkter eller logiska luckor som behövde åtgärdas?

## Svar Fråga 7:

Ett par extra ögon på koden är alltid bra och vi hade flera tillfällen där vi diskuterade eller felsökte koden tillsammans
vilket ofta ledde till att vi kom på saker som behövde åtgärdas. Både i möten med hela gruppen men även i mindre grupper.

## Fråga 8 - Dokumentation genom kod

Clean Code handlar ofta om att koden ska vara "självdokumenterande". Anser du att er slutgiltiga kodbas går att förstå för en utomstående utvecklare utan omfattande kommentarer? Motivera ditt svar.

## Svar Fråga 8:

Ja eftersom vi satte oss ned och bestämde mycket i planerings stadiet som. Naming conventions,Hur vi skulle utforma kommentarer,
Att vi alla skulle använda Biome med samma config etc gjorde att koden blev ganska enhetlig och lättläst från start.

Med det sagt så tror jag de svaga länkarna blev introducerade när AI användes på ett för ingripande sätt.
Den koden blev visserligen lite mer städad när det tillkom kommentarer som klargjorde lite vad som var vad.

Jag tycker att vi lyckades att hålla oss till det som vi bestämde i början och att det gjort koden ganska lättläst.
Jag skulle dock kommenterat med JSDoc istället för att göra koden ännu lite mer lättläst om jag hade fått gå tillbaka och göra om.

## Fråga 9 - Lärdomar inför framtiden

Baserat på arbetet med gruppuppgiften, vilket är det främsta rådet du skulle ge dig själv angående kodstruktur och refaktorering inför nästa stora utvecklingsprojekt?

## Svar Fråga 9:

Att planera tillsammans är en jätteviktigt grundpelare för alla projekt, Och det blir bara viktigare ju större projektet är.
Att ta sig lite tid och tänka över en funktion från ett kodstruktur och refaktorerings perspektiv så snart som den är "färdig"
Att lämna plats i planeringen för ett bredare refaktorerings projekt både mitt i och före deadline om möjligt.

## Fråga 10 - Arkitektur och state-hantering

I föregående kurs byggde ni ett system där flera rum hänger ihop och där ett rum måste klaras av innan nästa låses upp. Detta kräver att data skickas eller delas mellan olika delar av koden.

- Beskriv exakt hur ditt rum meddelar det övergripande systemet att spelaren har löst pusslet och att nästa rum ska låsas upp. Sker det via en global variabel, ett "Custom Event", en callback-funktion eller genom att manipulera URL:en/Local Storage? Motivera varför ni valde just den metoden.

- Om jag skulle vilja ändra ordningen på rummen (t.ex. att ditt rum kommer först istället för som nummer tre), vilka specifika rader eller funktioner i din kod skulle du behöva ändra för att det inte ska uppstå logiska fel?

- Om en spelare "fuskar" genom att skriva in rätt kod i en input-ruta, men hoppar över ett tidigare steg i ditt rum (t.ex. att de inte har hittat den dolda ledtråden först) – hur säkerställer din kod att pusslet faktiskt är löst i rätt ordning internt i ditt rum? Beskriv hur du hanterar detta "tillstånd" (state) utan att förlita dig på att bara dölja/visa HTML-element med CSS.

## Svar Fråga 10:

- Beskriv exakt hur ditt rum meddelar det övergripande systemet att spelaren har löst pusslet och att nästa rum ska låsas upp.
  Sker det via en global variabel, ett "Custom Event", en callback-funktion eller genom att manipulera URL:en/Local Storage? Motivera varför ni valde just den metoden.

Vi valde att använda local storage för att förmedla game state.
Jag misstänker att vi dels gjorde det eftersom vi alla hade jobbat med det tidigare.

Och eftersom vi inte behövde spara på mer än en maskin så bedömdes det som tillräckligt.
Detta gjordes via typen och funktionerna här:

```typescript
//ROOMS
export type TRoomResult = {
	status: TRoomStatus;
	artifact: TArtifactKind;
	mistakes?: number;
	score?: number;
	roomTimeSec?: number;
};

export function setRoomResult(roomId: TRoomId, result: TRoomResult): void {
	// active user's run state
	const state = getRoomResults();

	// create new updated room
	const next: TGameState = { ...state, [roomId]: result };

	saveRoomResults(next);
}

// Saves the full roomResults state for the active user
// and dispatches an event so the UI can update
function saveRoomResults(state: TGameState): void {
	localStorage.setItem(scopedKey(LS_KEY.roomResults), JSON.stringify(state));
	window.dispatchEvent(new Event('roomResults:changed'));
}
```

Som sedan sattes i rummen för både om man vunnit eller om man misslyckats.
Win exempel:

```typescript
setRoomResult('earth', {
	status: 'completed',
	artifact: 'true',
	mistakes: moves,
	score: 0, // TODO: define rule later
	roomTimeSec: 0, // Set by stopTimer function
});
```

- Om jag skulle vilja ändra ordningen på rummen (t.ex. att ditt rum kommer först istället för som nummer tre),
  vilka specifika rader eller funktioner i din kod skulle du behöva ändra för att det inte ska uppstå logiska fel?

I filen: src\rooms\welcome\welcomePage.ts

På rad 76:

```typescript
// When a new game is started, the timer should start and the first room should be built and shown
function handleStartGame(): void {
	resetRunKeepHighscores();
	startTimer(0);
	room1woodFunc();
}
```

Så behöver funktionen room1woodFunc behöver bytas ut mot room3earthFunc
Så här:

```typescript
// When a new game is started, the timer should start and the first room should be built and shown
function handleStartGame(): void {
	resetRunKeepHighscores();
	startTimer(0);
	room3earthFunc();
}
```

Och om vi säger att wood room ska vara det andra rummet
så behöver man även andra i filen: src\rooms\3earth\room3earth.ts

På rad 464:

Ändra:

```typescript
goToNextRoom('#room4Metal', room4metalFunc);
```

Till:

```typescript
goToNextRoom('#room1Wood', room1woodFunc);
```

Samt även söka upp goToNextRoom funktionen i de övriga rummen
för att försäkra att alla rummen kommer i rätt ordning.

- Om en spelare "fuskar" genom att skriva in rätt kod i en input-ruta, men hoppar över ett tidigare steg i ditt rum (t.ex. att de inte har hittat den dolda ledtråden först) – hur säkerställer din kod att pusslet faktiskt är löst i rätt ordning internt i ditt rum? Beskriv hur du hanterar detta "tillstånd" (state) utan att förlita dig på att bara dölja/visa HTML-element med CSS.

Jag hade inte någon dold ledtråd i mitt rum kan det vara så att denna fråga var ämnad för ett annat rum?
Men internt i mitt rum kontrolleras spelets state i checkSlateLock funktionen:

```typescript
function checkSlateLock(movedSlate: HTMLElement | null): void {
	const cord: string = movedSlate?.classList[2] as unknown as string;
	const slateText: string = movedSlate?.textContent as unknown as string;

	switch (cord) {
		case 'c00':
			checkTextContent(slateText, 1);
			break;
		case 'c01':
			checkTextContent(slateText, 2);
			break;
		case 'c02':
			checkTextContent(slateText, 3);
			break;
		case 'c03':
			checkTextContent(slateText, 4);
			break;
		case 'c10':
			checkTextContent(slateText, 5);
			break;
		case 'c11':
			checkTextContent(slateText, 6);
			break;
		case 'c12':
			checkTextContent(slateText, 7);
			break;
		case 'c13':
			checkTextContent(slateText, 8);
			break;
		case 'c20':
			checkTextContent(slateText, 9);
			break;
		case 'c21':
			checkTextContent(slateText, 10);
			break;
		case 'c22':
			checkTextContent(slateText, 11);
			break;
		case 'c23':
			checkTextContent(slateText, 12);
			break;
		case 'c30':
			checkTextContent(slateText, 13);
			break;
		case 'c31':
			checkTextContent(slateText, 14);
			break;
		case 'c32':
			checkTextContent(slateText, 15);
			break;
	} // Switch END

	if (correctSlatesArr.length === 15) {
		winner();
	} // IF win END
} // checkSlateLock END
```

Där matchas alla (nya) kordinater med de korrekta placeringarna

Som sedan lägger in de plattorna som sitter
på rätt plats correctSlatesArr i via funktionen checkTextContent:

```typescript
function checkTextContent(textContent: string, target: number): void {
	const slateIndex: number = correctSlatesArr.indexOf(target);

	if (textContent === target.toString()) {
		audioHandler('click');

		if (slateIndex === -1) {
			correctSlatesArr.push(target);
		}
	} else if (textContent !== target.toString()) {
		if (slateIndex !== -1) {
			correctSlatesArr.splice(slateIndex, 1);
		}
	}
} // checkTextContent END
```

Och även tar bort dom som inte längre sitter på rätt plats
Spelet är sedan vunnet när alla 15 sitter på rätt plats.

Denna funktion körs varje gång en platta flyttas.
Så det borde inte gå att "hoppa över ett drag" eller hamna i fel state i mitt rum.

Sedan är även vår fuskmotor utformad så att man enbart
kan fuska sig igenom ett helt rum i taget samt att det
alltid måste vara en "Win" eller en "loss" så den borde
också vara ett skydd mot denna typ av problem.
