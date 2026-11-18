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
2. Waarom het rapportageportaal?
3. De drie onderdelen
4. Het financiële overzicht
5. KPI’s per onderneming
6. Kwalitatieve toelichting
7. Wat ziet Amerborgh?
8. Informatie aanleveren
9. Wie levert wat aan?
10. Gebruikers en toegang

De portaalvoorbeelden gebruiken de oorspronkelijke React-onderdelen en CSS van het portaal. De presentatie toont schermfragmenten, geen volledig portaal. **Hotel A, Hotel B, Hotel C en alle cijfers en antwoorden zijn fictief.** Er is geen verbinding met productie of AI. Formulierwijzigingen bestaan alleen in het geheugen van de geopende demo. Het importvoorbeeld gebruikt een ingebouwd werkblad met de echte herkenningscode.

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

Het bouwscript leest de oorspronkelijke onderdelen rechtstreeks. Alleen tijdens de presentatiebuild maakt het interne onderdelen exporteerbaar en vervangt het de API door de lokale demo-adapter. Het portaal zelf wordt niet gewijzigd. De afgewerkte bestanden worden meegeleverd, dus GitHub Pages heeft geen aparte bouwstap nodig.

## GitHub Pages

Kies in **Settings → Pages**: **Deploy from a branch**, branch **main**, map **/(root)**. `.nojekyll` laat de vooraf gemaakte bestanden rechtstreeks aanbieden.

De repository en Pages-presentatie zijn openbaar. Voeg geen echte cijfers, sleutels, exports of interne documenten toe.
