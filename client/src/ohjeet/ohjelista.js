export const ohjelista = [
  {
    otsikko: 'Huomioitavaa',
    ohjeteksti: <>
      <p>
        Käyttäjä pysyy kirjautuneena 16 tuntia kirjautumisesta. Kun 16 tuntia on kulunut, tapahtuu
        uloskirjaaminen automaattisesti seuraavan kirjautumista vaativan toiminnon yhteydessä, jolloin
        toimintoa ei suoriteta loppuun. Estääkseen uloskirjautumisen kesken kilpailun ajanoton, voi
        ennen ajanoton aloittamista varmuuden vuoksi kirjautua ulos ja uudelleen sisään, jolloin
        uloskirjautuminen tapahtuu vasta seuraavan 16 tunnin jälkeen.
      </p>
      <p>
        Kilpailijat identifioidaan ainoastaan nimen perusteella. Käytännössä tämä täytyy huomioida
        tilanteissa, jossa kaksi samannimistä kilpailijaa osallistuu samaan kilpailuun tai mihin tahansa
        kilpailuihin samalla kaudella. Ratkaisuna täytyy erotella nimet toisistaan, esim. keskimmäisen
        nimen kirjaimella tai numeroin. Tähän toteutukseen on päädytty kahdesta syystä: 1) tulospalveluun
        ei haluttu vaatia kilpailijoiden kirjautumista, jolloin kilpailijoilla on mahdollisimman matala
        kynnys osallistua kilpailuihin ja 2) näin kilpailijoista ei tarvitse kerätä nimen lisäksi muita
        henkilötietoja, jolloin tietosuojan toteutumisen varmistamisesta ei tule rasitetta.
      </p>
      <p>
        Yksinkertaisuuden vuoksi, kilpailun lähtö- ja maaliintuloajat kirjautuvat aina kilpailupäivälle,
        eli käytännössä tämä täytyy huomioida, jos järjestää kahden eri vuorokauden puolella kilpailtavaa
        kilpailua.
      </p>
    </>
  },
  {
    otsikko: 'Kilpailun luominen ja muokkaaminen',
    ohjeteksti: <>
      <p>
        Kilpailu luodaan valikon yläreunasta <i>Lisää kilpailu</i> -painikkeesta.
      </p>
      <p>
        Kilpailun nimeä, päivämäärää ja ilmoittautumisen deadlinea voi muokata kilpailun
        sivulta <i>Muokkaa kilpailua</i> -painikkeesta.
      </p>
      <p>
        Kilpailulle vaaditaan nimi ja kilpailun päivämäärä. Kilpailuun voi lisätä halutessaan
        ilmoittautumisen deadlinen, jota ennen kilpailijat voivat ilmoittautua kilpailuun itse. Jos
        ilmoittautumisen deadlinen jättää tyhjäksi, kilpailijat eivät voi ilmoittautua itse.
        Cup-osakilpailu -valinta määrittää kuuluuko kyseinen kilpailu KeparDI-cupiin, eli lasketaanko
        siitä cup-pisteet.
      </p>
    </>
  },
  {
    otsikko: 'Sarjojen lisääminen ja muokkaaminen',
    ohjeteksti: <>
      <p>
        Sarjojen lisääminen ja muokkaaminen tapahtuu kilpailun
        sivulta <i>Muokkaa kilpailua</i> {'>'} <i>Muokkaa sarjoa</i>.
      </p>
      <p>
        Mikäli kilpailusta tai yksittäisestä sarjasta ei jaeta KeparDI-cup pisteitä,
        voi <i>Lasketaan pisteet</i> -valinnan jättää valitsematta.
      </p>
    </>
  },
  {
    otsikko: 'Kilpailijan lisääminen kilpailuun',
    ohjeteksti: <>
      <p>
        Kilpailija lisätään kilpailun sivulta <i>Lähtöajat</i> -välilehdeltä <i>Lisää kilpailija </i>
        -painikkeesta. Myös ilmoittautuminen tapahtuu vastaavasta kohdasta, jos käyttäjä ei ole
        kirjautunut ja ilmoittautumisaikaa on jäljellä.
      </p>
    </>
  },
  {
    otsikko: 'Lähtöaikojen asettaminen',
    ohjeteksti: <>
      <p>
        Lähtöajat voi asettaa kilpailun <i>Lähtöajat</i> -välilehdeltä.
      </p>
      <p>
        Lähtöajat voi arpoa sarjoittain <i>Arvo lätöajat</i> -painikkeesta asettamalla ensimmäisen
        lähtöajan ja lähtövälin.
      </p>
      <p>
        Yhteislähdön saa, kun jättää lähtövälin tyhjäksi tai asettaa sen nollaksi.
      </p>
      <p>
        Lähtöajat voi asettaa myös manuaalisesti kunkin kilpailijan kohdalta.
      </p>
    </>
  },
  {
    otsikko: 'Ajanotto',
    ohjeteksti: <>
      <p>
        Ajanotto tapahtuu kilpailun <i>Ajanotto</i> -välilehdellä.
      </p>
      <p>
        Painamalla <i>Maalissa</i> -painiketta kyseisen kilpailijan maaliintuloajaksi asetetaan ajanhetki,
        jolloin painiketta painettiin. Ajanotto kannattaa siis tehdä niin, että painaa kilpailijan
        kohdalta <i>Maalissa</i> -painiketta sillä hetkellä, kun kilpailija ylittää maaliviivan.
      </p>
      <p>
        <i>Muokkaa</i> -painikkeesta pääsee muokkaamaan kilpailijan maaliintuloaikaa. <i>Nyt</i> -painike
        asettaa maaliintuloajaksi sen hetken, jolloin painiketta painetaan. <i>Muu tulos</i> -kohtaan
        voi asettaa DNS/DNF/DSQ tulosken.
      </p>
      <p>
        Vaihtoehtoisesti maaliintulon voi kirjata myös <i>Lisää maaliintulo</i> -painikkeesta syöttämällä
        nimen ja tuloksen. Tätä voi myös käyttää, jos jostain syystä täytyy tallentaa maaliintulo
        kilpailijalle, joka ei ole lähtölistassa. Maaliintulon voi tallentaa tästä tarvittaessa myös ilman
        nimeä, jolloin nimen voi syöttää jälkikäteen kyseisen maaliintuloajan kohdalle.
      </p>
    </>
  },
  {
    otsikko: 'Tulokset',
    ohjeteksti: <>
      <p>
        Järjestelmä laskee tulokset ja pisteet automaattisesti lähtö- ja maaliintuloaikojen perusteella.
      </p>
      <p>
        Jos pisteet jostain syystä näyttää olevan tuloskissa väärin, niiden pitäisi korjaantua
        painamalla tulossivun <i>Päivitä pisteet</i> -painiketta, joka pakottaa pisteiden laskun
        uudelleen.
      </p>
    </>
  },
  {
    otsikko: 'Järjestäjien lisääminen ja poistaminen',
    ohjeteksti: <>
      <p>
        Järjestäjiä voi lisätä ja poistaa kilpailun
        sivulta <i>Muokkaa kilpailua</i> {'>'} <i>Muokkaa järjestäjiä</i>.
      </p>
      <p>
        Järjestelmä laskee pisteet järjestäjille automaattisesti.
      </p>
    </>
  },
  {
    otsikko: 'Manuaalisten pisteiden asettaminen',
    ohjeteksti: <>
      <p>
        Manuaaliset pisteet voi asettaa kilpailun
        sivulta <i>Muokkaa kilpailua</i> {'>'} <i>Muokkaa manuaalisia pisteitä</i>.
      </p>
      <p>
        Tätä voi käyttää kilpailuissa, joissa pistelasku ei perustu ainoastaan aikoihin tai jos
        yksittäisen kilpailijan pisteitä täytyy muuttaa.
      </p>
      <p>
        Jokaiselle kilpailijalle voi laittaa erikseen pisteet ja kilpailijat, joiden manuaaliset pisteet
        jätetään tyhjäksi, säilyttää aikojen perusteella lasketut pisteet. Eli jos vain yksittäisten
        kilpailijoiden pisteet täytyy muuttaa, se on mahdollista vaikuttamatta muiden pisteisiin.
      </p>
      <p>
        Syötetyt pisteet tulee muistaa tallentaa alareunan <i>Tallenna</i> -painikkeella.
      </p>
    </>
  },
]