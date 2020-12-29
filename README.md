# KeparDI tulospalvelu

Tämä projekti on luotu [KeparDI](https://webpages.tuni.fi/kepardi)a, eli Tampereen yliopiston suunnistuskerhoa varten. Palvelua käytetään kilpailujen ajanottoon ja lisäksi palvelu laskee [KeparDI-cup](https://webpages.tuni.fi/kepardi/kepardi-cup/)in osakilpailuista cup-pisteet kilpailijoille.

## Demo

Tulospalvelu ei ole vielä käyttöönottovalmis, mutta aina viimeisimmästä versiosta on vapaasti kokeiltavissa oleva demo osoitteessa https://kepardi-tulospalvelu-demo.herokuapp.com/.

## Ajaminen omalla palvelimella

### Vaatimukset

* MongoDB tietokanta
* Node ja npm asennettuna (testattu versioilla Node: 12.9.0, npm: 6.14.10)

### Ajaminen

1. Kloonaa repositorio

```bash
git clone https://github.com/juhjuhg6/KeparDI_tulospalvelu.git
cd KeparDI_tulospalvelu
```

2. Asenna riippuvuudet

```bash
npm install
```

3. Aseta järjestelmämuuttuja `MONGODB_URI` MongoDB tietokantasi osoitteeksi

4. (valinnainen) Aseta järjestelmämuuttuja `PORT` haluamaksesi porttinumeroksi. Oletusarvona käytetään porttia 3001.

5. Tee clientista tuotantoversio

```bash
npm run build
```

6. Käynnistä palvelin

```bash
npm start
```

Kehitystä varten voit käyttä clientia kehityspalvelimella:

```bash
cd client
npm start
```