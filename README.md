# KeparDI tulospalvelu

Tämä projekti on luotu [KeparDI](https://webpages.tuni.fi/kepardi)a, eli Tampereen yliopiston suunnistuskerhoa varten. Palvelua käytetään kilpailujen ajanottoon ja lisäksi palvelu laskee [KeparDI-cup](https://webpages.tuni.fi/kepardi/kepardi-cup/)in osakilpailuista cup-pisteet kilpailijoille.

## Rajapintadokumentaatio

Tietokannan rajapinnan dokumentaatio läytyy [täältä](https://github.com/juhjuhg6/KeparDI_tulospalvelu/blob/master/routes/api/Dokumentaatio.md).

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

3. Tee clientista tuotantoversio

```bash
npm run build
```

4. Aseta järjestelmämuuttujat:

* `NODE_ENV=production`
* `MONGODB_URI` MongoDB tietokantasi osoitteeksi
* `JWT_SECRET_KEY` vapaavalintaiseksi merkkijonoksi JSON Web Tokenien luontia varten
* `ADMIN_PASSWORD` vapaavalintaiseksi salasanaksi, jolla palveluun voi kirjautua
* `PORT` haluamaksesi porttinumeroksi, oletusarvona käytetään porttia 3001

5. Käynnistä palvelin

```bash
npm start
```

Kehitystä varten voit käyttä clientia kehityspalvelimella:

```bash
cd client
npm start
```
