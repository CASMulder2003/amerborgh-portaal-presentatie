# Amerborgh · Het rapportageportaal

Interactieve toelichting voor directie en ondernemingen, gemaakt met Quarto en reveal.js.

## Bekijken

Open `index.html` in een browser. De presentatie bevat alle benodigde bestanden en werkt ook zonder internet. Blader met de pijltjestoetsen, klik op de voorbeelden en gebruik **F** voor volledig scherm. **Esc** toont het dia-overzicht; **S** opent de sprekersweergave.

## Inhoud

Acht dia’s: introductie, de drie rapportageonderdelen, overzicht voor onderneming en Amerborgh, KPI’s, kwalitatieve toelichtingen, invulbare voorbeeldformulieren, een korte aanleverdemonstratie en het doel van de rapportage. De nadruk ligt op de informatie en het gebruik daarvan, niet op de bediening van alle functies.

**Alle bedrijven, cijfers en antwoorden zijn fictieve voorbeelden.** De schermen zijn vereenvoudigd. Er worden geen bestanden geüpload, gegevens opgeslagen of AI-aanroepen uitgevoerd. De presentatie heeft geen verbinding met het echte portaal. Automatische AFAS-/LucaNet-koppelingen worden als vervolgstap benoemd.

## Bewerken

- `index.qmd`: dia’s, tekst en sprekersnotities.
- `assets/demo.css`: vormgeving.
- `assets/demo.js`: fictieve gegevens en interactieve voorbeelden.
- `assets/demo.html`: koppeling met de interactieve voorbeelden.
- `assets/amerborgh-logo.svg`: het logo uit het portaal.

Installeer [Quarto](https://quarto.org/docs/get-started/), open deze map en voer uit:

```sh
quarto render index.qmd
```

Getest met Quarto 1.8.26. Het gegenereerde `index.html` wordt meegeleverd, zodat GitHub Pages geen build nodig heeft. Na wijzigingen moet `index.html` opnieuw worden gegenereerd en meegeplaatst.

## GitHub Pages

Kies in **Settings → Pages**: **Deploy from a branch**, branch **main**, map **/(root)**. `.nojekyll` zorgt ervoor dat de vooraf gemaakte HTML rechtstreeks wordt aangeboden.

Een Pages-publicatie is openbaar. Plaats daarom geen echte bedrijfsgegevens, inloggegevens, exports of interne documenten in deze repository.
