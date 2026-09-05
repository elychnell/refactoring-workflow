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

Jag tror att det största problemet var att koden hade utvecklats med hjälp av AI utan att alla inblandade hade en fullständig förståelse för hur den fungerade.

Transitionssystemet var inte nödvändigtvis dåligt skrivet, men det var svårt att förstå och felsöka. Det blev särskilt tydligt när systemet inte fungerade som förväntat och vi behövde anpassa det för de olika rummen.

När koden först introducerades i projektet var den dessutom mindre utförligt kommenterad än den är nu. Genom diskussioner i gruppen och genom att lägga till kommentarer som förklarade syftet med de olika funktionerna fick vi en mycket bättre förståelse för hur systemet fungerade och vad varje rum behövde göra.

Detta blev en viktig lärdom för mig när det gäller AI-assisterad utveckling. Problemet är inte nödvändigtvis att AI-genererad kod är dålig, utan att det kan bli problematiskt att använda kod utan att fullt ut förstå den när den senare behöver felsökas, ändras eller byggas ut.

Detta är något jag kommer att ta med mig in i mitt framtida yrkesliv: oavsett hur koden har skapats behöver jag förstå den kod som jag ansvarar för.

## Fråga 2 - Refaktorering i praktiken

Beskriv en specifik ändring du har gjort i kod för att förenkla den. Det kan vara från inlämningsuppgift 1 i denna kurs, eller från gruppuppgiften i föregående kurs.

Hur såg koden ut före respektive efter, och på vilket sätt blev den mer lättförståelig?

## Svar Fråga 2:

Det är svårt att visa exakt hur den ursprungliga koden såg ut eftersom den sedan dess har refaktorerats.
Men koden i inlämningsuppgift 1 i createHtml filen var skriven så att alla funktioner vad skrivna inom själva createHtml funktionen.

Det var inget fel i syntaxen, men det gjorde filen svårare att läsa och förstå, särskilt eftersom antalet funktioner växte.
Iterationsvariabeln var också onödig eftersom koden använde .forEach(). Eftersom samma operationer skulle utföras på varje podcast behövde vi inte hålla reda på vilken iteration vi befann oss på.

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

Det främsta skälet är underhållbarhet.

Kod som är lätt att förstå gör det enklare för teamet att felsöka problem, göra förändringar och anpassa applikationen när kraven förändras.
Det gör också att det blir lättare att sätta sig in i kod som någon annan har skrivit.

Förenklad kod behöver inte nödvändigtvis betyda färre rader kod. En kortare lösning kan ibland vara svårare att förstå än en något
längre men välstrukturerad lösning. Målet bör istället vara att minska onödig komplexitet och samtidigt behålla en tydlig och lättläst struktur.

Det är därför jag tycker att det kan bli kontraproduktivt att fokusera för mycket på mängden kod som produceras.
Att skriva mer kod betyder inte automatiskt att man skapar mer värde. Det viktiga är att koden löser problemet på ett tydligt och underhållbart sätt.

Som ett något överdrivet exempel kan man därför säga att man skjuter sig själv i foten om man främst mäter en utvecklares produktivitet efter hur många rader kod personen producerar.

## Fråga 4 - DRY (Don't Repeat Yourself)

Hittade ni logik i grupparbetsprojektet som upprepades på flera ställen? Om ja, hur gick ni tillväga för att bryta ut detta till återanvändbara komponenter eller hjälpfunktioner?

## Svar Fråga 4:

Ja. Trots att vi försökte planera för återanvändbar logik redan under planeringsfasen uppstod viss duplicering under utvecklingen.
Jag kommer inte på något bra exempel från mitt eget rum, och jag har inte full insyn i hur de andra rummen var uppbyggda.

Vi hade däremot bland annat en bugg i fusk-motorn som gjorde att rummen inte avslutades korrekt. Mer specifikt blev keybinds och ljudfiler aldrig ordentligt bortstädade,
vilket vi även upptäckte under demon. Jag tog på mig att lösa buggen. En enkel lösning hade varit att kopiera cleanup-koden från de olika rummen och köra den igen i fusk-motorn.

Jag tänkte däremot på DRY och insåg att de olika rummen redan hade specifika funktioner för detta.
Jag valde därför att exportera de befintliga funktionerna och importera dem i fusk-motorn istället för att duplicera logiken.

På så sätt kunde vi återanvända befintlig kod och samtidigt undvika att behöva underhålla samma logik på flera ställen.

## Fråga 5 - Namngivningens betydelse

Reflektera över hur ni namngav variabler, funktioner och komponenter i projektet. Ge ett exempel på ett namn som ändrades under resans gång för att bättre kommunicera dess syfte.

## Svar Fråga 5:

Vi bestämde oss tidigt under planeringsfasen för att använda camelCase och att försöka namnge variabler och funktioner på ett sätt som tydligt beskrev deras syfte.
Jag har inget bra exempel på ett specifikt namn som jag själv ändrade under projektets gång. Det beror främst på att vi etablerade våra naming conventions tidigt och sedan
i stort sett följde dem genom hela projektet. Det är möjligt att det gjordes enskilda namnändringar på andra ställen i projektet, men jag var inte direkt involverad i någon sådan ändring.

## Fråga 6 - När är det dags att refaktorera?

Hur avgjorde ni i gruppen när det var läge att förbättra befintlig kod kontra när det var viktigare att prioritera att bygga ny funktionalitet för att nå deadline?

## Svar Fråga 6:

Under projektet var vår huvudsakliga prioritet att implementera den funktionalitet som krävdes och lösa buggar innan deadline.
Vi hann därför aldrig påbörja något större refaktoreringsarbete för hela projektet.

Jag gjorde däremot mindre förändringar under projektets gång när jag stötte på kod som jag tyckte kunde förenklas eller struktureras bättre.
Om vi hade haft mer tid tror jag att en dedikerad refaktoreringsfas efter att den huvudsakliga funktionaliteten var på plats hade varit värdefull.
Ett annat alternativ hade varit att planera in refaktorering som en del av arbetet inför nästa version av projektet.

Projektet lärde mig att refaktorering bör ses som en del av utvecklingsprocessen och inte bara som något man gör om det råkar finnas tid över i slutet.

## Fråga 7 - Kodgranskning (Code Review) som verktyg

På vilket sätt bidrog era gemensamma genomgångar av koden till att identifiera svaga punkter eller logiska luckor som behövde åtgärdas?

## Svar Fråga 7:

Att få ett par extra ögon på koden är alltid värdefullt. Vi hade flera tillfällen där vi diskuterade eller felsökte kod tillsammans,
både under möten med hela gruppen och i mindre grupper. Det ledde ofta till att vi upptäckte saker som hade varit svårare att se när man arbetade ensam.
Genom att diskutera hur olika delar av koden fungerade kunde vi även upptäcka antaganden eller möjliga problem som inte hade varit uppenbara för den som skrev koden från början.

Kodgranskning blev därför inte bara ett sätt att hitta direkta fel, utan även ett sätt att få flera perspektiv på hur koden kunde förstås och förbättras.

## Fråga 8 - Dokumentation genom kod

Clean Code handlar ofta om att koden ska vara "självdokumenterande". Anser du att er slutgiltiga kodbas går att förstå för en utomstående utvecklare utan omfattande kommentarer? Motivera ditt svar.

## Svar Fråga 8:

Ja, överlag tycker jag att den slutgiltiga kodbasen är relativt lätt för en annan utvecklare att sätta sig in i.

Vi bestämde flera saker redan under planeringsfasen, bland annat naming conventions, hur vi skulle utforma kommentarer
och att alla skulle använda Biome med samma konfiguration. Det gjorde att koden blev mer enhetlig genom hela projektet.

Jag tycker däremot att vissa av de svagare delarna av kodbasen introducerades när AI användes på ett för ingripande sätt.
Den koden blev visserligen tydligare efter att vi lagt till kommentarer och diskuterat hur den fungerade inom gruppen.

Jag tycker att vi lyckades hålla oss till de riktlinjer vi bestämde i början, vilket gjorde kodbasen relativt enhetlig och lättläst.

Om jag fick göra om projektet skulle jag däremot använda JSDoc mer konsekvent för funktioner där parametrarna eller funktionens syfte inte är uppenbara. Det hade gjort koden lättare att förstå utan att den ursprungliga utvecklaren behövde vara tillgänglig för att förklara den.

## Fråga 9 - Lärdomar inför framtiden

Baserat på arbetet med gruppuppgiften, vilket är det främsta rådet du skulle ge dig själv angående kodstruktur och refaktorering inför nästa stora utvecklingsprojekt?

## Svar Fråga 9:

Min främsta lärdom är att gemensam planering är en viktig grund för alla projekt, och att detta blir ännu viktigare ju större projektet är.

Jag skulle också försöka göra refaktorering till en del av själva utvecklingsprocessen istället för att se det som något man bara gör om det finns tid över.
Att ta sig tid att fundera över strukturen i en funktion när den är färdig kan göra det lättare att undvika att teknisk skuld byggs upp.

Om planeringen tillåter det skulle jag även reservera tid under projektet för en bredare genomgång och refaktorering innan den slutliga deadlinen.

## Fråga 10 - Arkitektur och state-hantering

I föregående kurs byggde ni ett system där flera rum hänger ihop och där ett rum måste klaras av innan nästa låses upp. Detta kräver att data skickas eller delas mellan olika delar av koden.

- Beskriv exakt hur ditt rum meddelar det övergripande systemet att spelaren har löst pusslet och att nästa rum ska låsas upp. Sker det via en global variabel, ett "Custom Event", en callback-funktion eller genom att manipulera URL:en/Local Storage? Motivera varför ni valde just den metoden.

- Om jag skulle vilja ändra ordningen på rummen (t.ex. att ditt rum kommer först istället för som nummer tre), vilka specifika rader eller funktioner i din kod skulle du behöva ändra för att det inte ska uppstå logiska fel?

- Om en spelare "fuskar" genom att skriva in rätt kod i en input-ruta, men hoppar över ett tidigare steg i ditt rum (t.ex. att de inte har hittat den dolda ledtråden först) – hur säkerställer din kod att pusslet faktiskt är löst i rätt ordning internt i ditt rum? Beskriv hur du hanterar detta "tillstånd" (state) utan att förlita dig på att bara dölja/visa HTML-element med CSS.

## Svar Fråga 10:

- Beskriv exakt hur ditt rum meddelar det övergripande systemet att spelaren har löst pusslet och att nästa rum ska låsas upp.
  Sker det via en global variabel, ett "Custom Event", en callback-funktion eller genom att manipulera URL:en/Local Storage? Motivera varför ni valde just den metoden.

Vi valde att använda Local Storage för att förmedla game state.

En anledning var att vi redan hade erfarenhet av att arbeta med Local Storage.
Eftersom spelet bara behövde spara sitt state lokalt på spelarens maskin bedömde vi också att det var tillräckligt för projektets omfattning.

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

Om jag skulle vilja ändra ordningen på rummen skulle den första förändringen behöva göras i: src/rooms/welcome/welcomePage.ts, där handleStartGame() avgör vilket rum som startas först.

```typescript
// When a new game is started, the timer should start and the first room should be built and shown
function handleStartGame(): void {
	resetRunKeepHighscores();
	startTimer(0);
	room1woodFunc();
}
```

Om exempelvis Earth Room skulle flyttas till första plats skulle room1woodFunc() behöva ersättas med room3earthFunc().
Så här:

```typescript
// When a new game is started, the timer should start and the first room should be built and shown
function handleStartGame(): void {
	resetRunKeepHighscores();
	startTimer(0);
	room3earthFunc();
}
```

Jag skulle även behöva ändra de goToNextRoom()-anrop som styr övergången mellan rummen så att resten av ordningen blir konsekvent.
I exemplet skulle anropet i Earth Room behöva ändras från room4metalFunc till room1woodFunc om Wood Room skulle vara nästa rum.

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

Mitt rum använde inte någon dold ledtråd eller separat inputsekvens, så just det exemplet gäller inte direkt för mitt pussel.

Internt i mitt rum hanteras istället spelets state genom arrayen correctSlatesArr.

Funktionen checkSlateLock() kontrollerar vilken siffra varje platta ska ha baserat på dess aktuella koordinat. 

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

Om en platta ligger på rätt plats läggs dess korrekta värde till i correctSlatesArr.
Om en platta som tidigare låg rätt flyttas från sin korrekta plats tas den istället bort från arrayen.

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
Pusslet är löst när alla 15 plattor ligger på rätt plats:

```typescript
if (correctSlatesArr.length === 15) {
    winner();
}
```


Den här kontrollen körs varje gång en platta flyttas.
Spelet förlitar sig därför inte enbart på att visa eller
dölja HTML-element med CSS för att avgöra om pusslet är löst,
utan det faktiska pussel-state hanteras i JavaScript.

Vår fuskmotor är dessutom utformad så att man bara kan fuska sig igenom ett helt rum i taget.
Det måste fortfarande resultera i antingen en win eller en loss innan spelet går vidare till nästa rum.