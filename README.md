# BestellApp - CyberSpace

Eine responsive Bestellapp für fiktive Cyberware-Produkte.
Das Projekt wurde mit HTML, CSS und JavaScript umgesetzt und dient als Lernprojekt für dynamisches Rendering, Warenkorb-Logik und responsive Benutzeroberflächen.

## Funktionen

- Dynamisch gerenderte Produkte in drei Kategorien
- Gemeinsamer Warenkorb für alle Produkte
- Produktmengen zwischen 1 und 5
- Entfernen von Produkten über den Papierkorb-Button
- Automatische Berechnung von Zwischensumme, Lieferkosten und Gesamtpreis
- Synchronisierter Desktop- und mobiler Warenkorb
- Responsive Bottom-Navigation mit Warenkorbzugriff
- Scrollbarer Produktbereich im mobilen Warenkorb
- Bestellbestätigung mit animiertem R2D2-GIF
- Responsive Darstellung für Desktop, Tablet und Smartphone

## Technologien

- HTML5
- CSS3
- Vanilla JavaScript

Es werden keine Frameworks, Build-Tools oder zusätzlichen Pakete benötigt.

## Projektstruktur

```text
bestellapp -teststruktur/
|-- assets/
|   |-- gifs-icon/
|   |-- icons/
|   `-- images/
|-- components/
|-- css/
|   |-- base.css
|   `-- molecules/
|       |-- assets.css
|       |-- buttons.css
|       |-- fonts.css
|       |-- footer.css
|       |-- impressum.css
|       |-- orderbar.css
|       `-- style.css
|-- js/
|   |-- db.js
|   |-- script.js
|   `-- templates.js
|-- index.html
`-- README.md
```

## Projekt starten

Da das Projekt keine Installation benötigt, kann `index.html` direkt im Browser geöffnet werden.
Empfohlen wird ein lokaler Entwicklungsserver, zum Beispiel die Erweiterung **Live Server** in Visual Studio Code.

Alternativ kann im Projektordner ein einfacher Server gestartet werden:

```bash
python -m http.server 8000
```

Danach ist die App unter `http://localhost:8000` erreichbar.

## Bedienung

1. Mit **Add to basket** wird ein Produkt in den Warenkorb gelegt.
2. Die Menge kann über Minus, Plus oder den Papierkorb angepasst werden.
3. Über **Kaufen** wird die Bestellung abgeschlossen.
4. Anschließend erscheint der Dialog **Order confirmed!** und der Warenkorb wird zurückgesetzt.

## Responsive Verhalten

- Große Bildschirme zeigen den Warenkorb neben den Produkten.
- Bis `1280px` wird der Warenkorb über die Bottom-Navigation geöffnet.
- Bis `912px` werden Produktbild und Produktinformationen untereinander dargestellt.
- Auf kleinen Smartphones passen sich Karten, Bilder und Navigation an die verfügbare Breite an.

## Repository

[BestellApp-Dev-Test auf GitHub](https://github.com/andrewojak1618-debug/BestellApp-Dev-Test)
