# Amerborgh · Het rapportageportaal

Interactieve toelichting voor directie en ondernemingen, gemaakt met Quarto en reveal.js.

## Bekijken

[Open de presentatie](https://casmulder2003.github.io/amerborgh-portaal-presentatie/)

Open de presentatie via GitHub Pages of een lokale webserver. De interactieve schermen laden uit `assets/portal`, dus openen via `file://` is niet voldoende. Lokaal:

```sh
python -m http.server 8768 --bind 127.0.0.1
```

Open daarna `http://127.0.0.1:8768/`. Pijltjestoetsen bladeren door de dia’s. **F** opent volledig scherm, **Esc** het dia-overzicht en **S** de sprekersweergave. Langere portaalformulieren zijn binnen het scherm te scrollen.

## Inhoud

1. Het rapportageportaal
2. De drie onderdelen: financiële cijfers
3. De drie onderdelen: KPI’s
4. De drie onderdelen: kwalitatieve toelichtingen
5. Informatie aanleveren
6. Wie levert wat aan?
7. Gebruikers en toegang

Elk van de drie onderdelen combineert de kerninformatie met de bijbehorende portaalweergave op één slide. De portaalvoorbeelden gebruiken de oorspronkelijke React-onderdelen en CSS van het portaal. **Bedrijf A, Bedrijf B, Bedrijf C en alle cijfers en antwoorden zijn fictief.** Er is geen verbinding met productie of AI. Formulierwijzigingen bestaan alleen in het geheugen van de geopende demo. Het importvoorbeeld gebruikt een ingebouwd werkblad met de echte herkenningscode. Via Alle formulieren zijn de drie onderdelen en het financiële jaarbudget bereikbaar.

Ieder portaalvoorbeeld kan worden vergroot en weer teruggezet. KPI 1, 2 en 3 zijn neutrale weergaven, geen voorgestelde indicatoren. De directie kiest de eigen KPI’s. De budgetlijn bij KPI’s is een presentatievoorbeeld van de gewenste uitbreiding; dit implementeert nog geen KPI-budgetopslag in het echte portaal. De eerste drie voorlopige kwalitatieve vragen volgen het met Loes afgestemde document, aangevuld met een vierde, optionele vraag voor eigen onderwerpen. De antwoorden tonen alleen ‘…’.

## Bewerken en bouwen

- `index.qmd`: dia’s en sprekersnotities.
- `assets/demo.css` en `assets/demo.js`: presentatieopmaak en bediening.
- `presentation-src/`: demo-koppeling, fictieve gegevens en bouwscript.
- `presentation-src/portal-source.json`: bronversie van de portaalonderdelen.
- `assets/portal/`: gebundelde portaalvoorbeelden, inclusief importwerker.

Voor een nieuwe portaalbuild is een lokale checkout van `amerborgh-portaal` met geïnstalleerde frontendafhankelijkheden nodig:

```sh
PORTAL_SOURCE=/pad/naar/amerborgh-portaal/frontend node presentation-src/build.mjs
quarto render index.qmd
```

Het bouwscript leest de oorspronkelijke onderdelen rechtstreeks. Alleen tijdens de presentatiebuild maakt het interne onderdelen exporteerbaar, vervangt het de API door de lokale demo-adapter en voegt het de KPI-budgetvergelijking toe via een gecontroleerde bronaanpassing. Het portaal zelf wordt niet gewijzigd door deze build. De afgewerkte bestanden worden meegeleverd, dus GitHub Pages heeft geen aparte bouwstap nodig.

## GitHub Pages

Kies in **Settings → Pages**: **Deploy from a branch**, branch **main**, map **/(root)**. `.nojekyll` laat de vooraf gemaakte bestanden rechtstreeks aanbieden.

De repository en Pages-presentatie zijn openbaar. Voeg geen echte cijfers, sleutels, exports of interne documenten toe.
