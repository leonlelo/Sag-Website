# Sanity Studio – S.A.G.

## Kjøre Studio (localhost:3333)

```bash
cd test
npm install
npm run dev
```

Åpne **http://localhost:3333** i nettleseren.

## Første gangs oppsett

1. Kjør `npm run dev` i `test/`-mappen.
2. Gå til http://localhost:3333.
3. Logg inn på Sanity (opprett bruker hvis nødvendig).
4. Klikk **Sideinnstillinger** i sidemenyen.
5. Fyll inn åpningstider, kontaktinfo og evt. forside-tekst.
6. Klikk **Publish** (Publiser).

Etter publisering henter nettsiden (index.html) innholdet fra Sanity automatisk. Endringer du gjør i Studio vises på nettsiden når du oppdaterer siden.

## Hva kan redigeres

- **Forside:** Hovedtittel og beskrivelse
- **Åpningstider:** Tittel, undertittel og liste over dager med åpning/stenging
- **Kontakt:** Tittel, undertittel, telefon, e-post, Instagram, adresse og kartlenke

Meny (pizzaer/salater) står fortsatt i HTML og er ikke koblet til Sanity.
