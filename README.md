# IslandCraft SMP Website

Eine moderne, responsive Website für den IslandCraft Minecraft SMP Server.

## Features

- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Loading Screen**: Animierter Ladebildschirm mit Fortschrittsbalken
- **Server Status**: Live-Anzeige der Online-Spieler und Server-Status
- **Event Countdown**: Automatische Countdown-Timer für Events
- **Team Section**: Übersicht über Teammitglieder und offene Positionen
- **Modal System**: Bewerbungsmodal für Teammitglieder
- **Cookie Banner**: DSGVO-konformes Cookie-Management
- **Smooth Animations**: Flüssige Übergänge und Scroll-Animationen
- **SEO Optimiert**: Suchmaschinenfreundliche Struktur

## Technische Details

- **HTML5**: Semantische Struktur
- **CSS3**: Moderne Styling mit CSS Variables und Flexbox/Grid
- **JavaScript**: Vanilla JS für Interaktivität
- **Font Awesome**: Icons für bessere UX
- **Google Fonts**: Inter und JetBrains Mono

## Setup

1. Alle Dateien in einen Webserver-Ordner kopieren
2. `island_logo.png` Logo-Datei hinzufügen (120x120px empfohlen)
3. Server-Status API konfigurieren (optional)
4. Website über HTTP/HTTPS aufrufen

## Anpassungen

### Server-IP ändern
In `script.js` die Server-IP in der `copyServerIP()` Funktion anpassen:
```javascript
function copyServerIP() {
    copyToClipboard('deine-server-ip.de');
}
```

### Discord-Links aktualisieren
Alle Discord-Links in `index.html` auf den aktuellen Discord-Server anpassen.

### Events hinzufügen/ändern
Event-Daten in der Events-Sektion der `index.html` anpassen:
```html
<div class="event-countdown" data-date="2025-01-12T18:00:00">
```

### Farben anpassen
CSS-Variablen in `styles.css` anpassen:
```css
:root {
    --accent-primary: #00d4ff;
    --accent-secondary: #00ffa3;
    /* ... weitere Farben */
}
```

## Browser-Unterstützung

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimierte Bilder verwenden (WebP empfohlen)
- CSS und JS minifizieren für Produktion
- CDN für Font Awesome und Google Fonts nutzen

## Lizenz

Dieses Projekt ist für IslandCraft SMP erstellt und kann frei angepasst werden.