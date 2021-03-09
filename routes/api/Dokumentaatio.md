# API Dokumentaatio

## Sisällys

* [Skeemat](#skeemat)
    * [Kausi](#kausi)
    * [Kilpailu](#kilpailu)
    * [Kilpailija](#kilpailija)
* [Pyynnöt](#pyynnöt)
    * [Kaudet](#kaudet)
        * [Hae kausi](#hae-kausi-1)
        * [Luo uusi kausi](#luo-uusi-kausi)
        * [Muuta kauden nimeä*](#muuta-kauden-nimeä)
        * [Poista kausi*](#poista-kausi)
    * [Kilpailut](#kilpailut)
        * [Hae kilpailu](#hae-kilpailu)
        * [Luo uusi kilpailu*](#luo-uusi-kilpailu)
        * [Muokkaa kilpailua*](#muokkaa-kilpailua)
        * [Poista kilpailu*](#poista-kilpailu)
    * [Sarjat](#sarjat)
        * [Luo uusi sarja*](#luo-uusi-sarja)
        * [Muokkaa sarjaa*](#muokkaa-sarjaa)
        * [Arvo ja aseta lähtöajat sarjan kilpailijoille*](#arvo-ja-aseta-lähtöajat-sarjan-kilpailijoille)
        * [Poista sarja*](#poista-sarja)
    * [Kilpailijat](#kilpailijat)
        * [Lisää kilpailija sarjaan(*)](#lisää-kilpailija-sarjaan)
        * [Muokkaa kilpailijan kilpailudataa*](#muokkaa-kilpailijan-kilpailudataa)
        * [Poista kilpailija kilpailusta*](#poista-kilpailija-kilpailusta)
    * [Maaliintulot](#maaliintulot)
        * [Lisää maaliintulo*](#lisää-maaliintulo)
        * [Muokkaa maaliintuloa*](#muokkaa-maaliintuloa)
        * [Poista maaliintulo*](#poista-maaliintulo)
    * [Järjestäjät](#järjestäjät)
        * [Lisää järjestäjä kilpailuun*](#lisää-järjestäjä-kilpailuun)
        * [Poista järjestäjä kilpailusta*](#poista-järjestäjä-kilpailusta)
    * [Pisteet](#pisteet)
        * [Hae (ja päivitä) kauden kaikkien kilpailujen pisteet](#hae-ja-päivitä-kauden-kaikkien-kilpailujen-pisteet)
        * [Hae (ja päivitä) kilpailun pisteet](#hae-ja-päivitä-kilpailun-pisteet)
    * [Manuaaliset pisteet](#manuaaliset-pisteet)
        * [Aseta manuaaliset pisteet*](#aseta-manuaaliset-pisteet)
        * [Poista kilpailun manuaaliset pisteet*](#poista-kilpailun-manuaaliset-pisteet)

## Skeemat

### Kausi
```
{
    "_id": string,
    "nimi": string,
    "kilpailut": [
        {
            "_id": string,
            "nimi": string,
            "pvm": string (ISO 8601),
            "sarjat": [
                {
                    "_id": string,
                    "nimi": string,
                    "lasketaanPisteet": boolean,
                    "kilpailijat": [string (kilpailijan _id)]
                }
            ],
            "maaliintulot": [
                {
                    "_id": string,
                    "kilpailija": string (kilpailijan _id),
                    "maaliintuloaika": string (ISO 8601)
                }
            ],
            "jarjestajat": [string (kilpailijan _id)],
            "manuaalisetPisteet": {
                kilpailijaId: number (pisteet)
            }
        }
    ]
}
```

### Kilpailu
```
{
    "_id": string,
    "nimi": string,
    "pvm": string (ISO 8601),
    "sarjat": [
        {
            "_id": string,
            "nimi": string,
            "kilpailijat": [Kilpailija],
            "lasketaanPisteet": boolean,
        }
    ],
    "maaliintulot": [
        {
            "_id": string,
            "kilpailija": string (kilpailijan _id),
            "maaliintuloaika": string (ISO 8601),
            "muuTulos": string (DNS/DNF/DSQ)
            "nimi": string (käytetään vain, jos kilpailijaa ei määritetty)
        }
    ],
    "jarjestajat": [Kilpailija],
    "manuaalisetPisteet": {
        kilpailijaId: number (pisteet)
    },
    "kaikkiKilpailijat": [
        {
            "id": string (kilpailijan _id),
            "nimi": string
        }
    ]
}
```

### Kilpailija
```
{
    "_id": string,
    "nimi": string,
    "kilpailut": {
        kilpailuId: {
            "pisteet": number,
            "lahtoaika": string (ISO 8601),
            "maaliaika": string (ISO 8601),
            "muuTulos": string
        }
    }
}
```

## Pyynnöt

Huomautus 1: Jos tieto on pyynnössä merkitty kaarisulkeisiin, se on vapaaehtoinen.

Huomautus 2: Osoitteessa kaksoispisteellä alkavat osat ovat parametreja.

Huomautus 3: * asteriksilla merkityt kyselyt on suojattuja ja vaativat kirjautumisen

### Kaudet
---
#### Hae kausi
Pyyntö:
```
GET api/kaudet
```
Vastaus:
```
[Kausi]
```
---
#### Hae kausien nimet
Pyyntö:
```
GET api/kaudet/nimet
```
Vastaus:
```
[
    {
        "id": string,
        "nimi": string,
        "kilpailut": [
            {
                "id": string,
                "nimi": string,
                "pvm": string (ISO 8601)
            }
        ]
    }
]
```
---
#### Hae kausi
Pyyntö:
```
GET api/kaudet/:kausiId
```
Vastaus:
```
Kausi
```
---
#### Luo uusi kausi*
Pyyntö:
```
POST api/kaudet

Body:
{
    "nimi": string
}
```
Vastaus:
```
Kausi
```
---
#### Muuta kauden nimeä*
Pyyntö:
```
PUT api/kaudet/:kausiId

Body:
{
    "nimi": string
}
```
Vastaus:
```
Kausi
```
---
#### Poista kausi*
Pyyntö:
```
DELETE api/kaudet/:kausiId
```
Vastaus:
```
Kausi
```
---
### Kilpailut
---
#### Hae kilpailu
Pyyntö:
```
GET api/kilpailut/:kausiId/:kilpailuId
```
Vastaus:
```
Kilpailu
```
---
#### Luo uusi kilpailu*
Pyyntö:
```
POST api/kilpailut/:kausiId

Body:
{
    "nimi": string,
    "pvm": string (ISO 8601)
}
```
Vastaus:
```
Kilpailu
```
---
#### Muokkaa kilpailua*
Pyyntö:
```
PUT api/kilpailut/:kausiId/:kilpailuId

Body:
{
    ("nimi": string),
    ("pvm": string (ISO 8601))
}
```
Vastaus:
```
Kilpailu
```
---
#### Poista kilpailu*
Pyyntö:
```
DELETE api/kilpailut/:kausiId/:kilpailuId
```
Vastaus:
```
Kausi
```
---
### Sarjat
---
#### Luo uusi sarja*
Pyyntö:
```
POST api/sarjat/:kausiId/:kilpailuId

Body:
{
    "nimi": string,
    ("lasketaanPisteet": boolean, default: true)
}
```
Vastaus:
```
Kilpailu
```
---
#### Muokkaa sarjaa*
Pyyntö:
```
PUT api/sarjat/:kausiId/:kilpailuId/:sarjaId

Body:
{
    ("nimi": string),
    ("manuaalisetPisteet": [
        {
            "kilpailija": string (kilpailijan _id),
            "pisteet": number
        }
    ]),
    ("lasketaanPisteet": boolean)
}
```
Vastaus:
```
Kilpailu
```
---
#### Arvo ja aseta lähtöajat sarjan kilpailijoille*
Pyyntö:
```
PUT api/sarjat/lahtoajat/:kausiId/:kilpailuId/:sarjaId

Body:
{
    "ensimmäinenLähtöaika": string (ISO 8601),
    ("lähtöväli": number (millisekunti))
}
```
Vastaus:
```
Kilpailu
```
---
#### Poista sarja*
Pyyntö:
```
DELETE api/sarjat/:kausiId/:kilpailuId/:sarjaId
```
Vastaus:
```
Kilpailu
```
---
### Kilpailijat
---
#### Lisää kilpailija sarjaan(*)
Huomio: Ilmoittautumisen voi tehdä ilman kirjautumista, jos ilmoittautumisaikaa on jäljellä, mutta ilmoittautumisajan päättymisen jälkeen kilpailijan lisäämiseen vaaditaan kirjautuminen.

Pyyntö:
```
POST api/kilpailijat/:kausiId/:kilpailuId/:sarjaId

Body:
{
    "nimi": string
}
```
Vastaus:
```
Kilpailu
```
---
#### Muokkaa kilpailijan kilpailudataa*
Pyyntö:
```
PUT api/kilpailijat/:kausiId/:kilpailuId/:sarjaId/:kilpailijaId

Body:
{
    ("lahtoaika": string (ISO 8601)),
    ("maaliaika": string (ISO 8601)),
    ("muuTulos": string)
}
```
Vastaus:
```
Kilpailu
```
---
#### Poista kilpailija kilpailusta*
Pyyntö:
```
DELETE api/kilpailijat/:kausiId/:kilpailuId/:sarjaId/:kilpailijId
```
Vastaus:
```
Kilpailu
```
---
### Maaliintulot
---
#### Lisää maaliintulo*
Pyyntö:
```
POST api/maaliintulot/:kausiId/:kilpailuId

Body:
{
    ("kilpailija": string (kilpailijan _id)),
    ("maaliintuloaika": string (ISO 8601),
    ("muuTulos": string (DNS/DNF/DSQ)),
    ("nimi": string (käytetään vain, jos kilpailijaa ei määritetty))
}
```
Vastaus:
```
Kilpailu
```
---
#### Muokkaa maaliintuloa*
Pyyntö:
```
PUT api/maaliintulot/:kausiId/:kilpailuId/:maaliintuloId

Body:
{
    ("kilpailija": string (kilpailijan _id)),
    ("maaliintuloaika": string (ISO 8601)),
    ("muuTulos": string (DNS/DNF/DSQ)),
    ("nimi": string (käytetään vain, jos kilpailijaa ei määritetty))
}
```
Vastaus:
```
Kilpailu
```
---
#### Poista maaliintulo*
Pyyntö:
```
DELETE api/maaliintulot/:kausiId/:kilpailuId/:maaliintuloId
```
Vastaus:
```
Kilpailu
```
---
### Järjestäjät
---
#### Lisää järjestäjä kilpailuun*
Pyyntö:
```
POST api/jarjestajat/:kausiId/:kilpailuId

Body:
{
    "nimi": string
}
```
Vastaus:
```
Kilpailu
```
---
#### Poista järjestäjä kilpailusta*
Pyyntö:
```
DELETE api/jarjestajat/:kausiId/:kilpailuId/:jarjestajaId
```
Vastaus:
```
Kilpailu
```
---
### Pisteet
---
#### Hae (ja päivitä) kauden kaikkien kilpailujen pisteet
Pyyntö:
```
GET api/pisteet/:kausiId?pakotaPistelasku={boolean}
```
Vastaus:
```
[Kilpailija]
```
---
#### Hae (ja päivitä) kilpailun pisteet
Pyyntö:
```
GET api/pisteet/:kausiId/:kilpailuId?pakotaPistelasku={boolean}
```
Vastaus:
```
Kilpailu
```
---
### Manuaaliset Pisteet
---
#### Aseta manuaaliset pisteet*
Pyyntö:
```
POST api/manuaalisetpisteet/:kausiId/:kilpailuId

Body:
{
    manuaalisetPisteet: {
        kilpailijaId: number
    }
}
```
Vastaus:
```
Kilpailu
```
---
#### Poista kilpailun manuaaliset pisteet*
Pyyntö:
```
DELETE api/manuaalisetpisteet/:kausiId/:kilpailuId
```
Vastaus:
```
Kilpailu
```