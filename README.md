# KPC Webshop - Backend

Backend servis za web prodavnicu ili oglasnik, izgrađen na [NestJS](https://nestjs.com/) framework-u.

## Opis

Ovaj projekat predstavlja robusni backend API koji pruža osnovne funkcionalnosti potrebne za pokretanje platforme za online oglase. Uključuje registraciju i prijavu korisnika, upravljanje oglasima i siguran mehanizam za upload fajlova.

Aplikacija je strukturirana modularno, što omogućava laku nadogradnju i održavanje.

## Tehnologije

- **Framework**: [NestJS](https://nestjs.com/)
- **Jezik**: [TypeScript](https://www.typescriptlang.org/)
- **Baza podataka**: [MongoDB](https://www.mongodb.com/) sa [Mongoose](https://mongoosejs.com/) ODM-om
- **Autentifikacija**: [Passport.js](http://www.passportjs.org/) (`passport-jwt` strategija)
- **Validacija**: `class-validator` i `class-transformer`
- **File Upload**: `multer`
- **Konfiguracija**: `@nestjs/config` (`.env` fajlovi)

## Funkcionalnosti

-   **Autentifikacija**:
    -   Registracija novih korisnika sa hešovanjem lozinke (`bcryptjs`).
    -   Prijava korisnika i izdavanje JSON Web Tokena (JWT).
    -   Zaštićene rute (endpoints) koje zahtevaju validan JWT.
-   **Upravljanje oglasima**:
    -   Kreiranje, čitanje, ažuriranje i brisanje oglasa (CRUD).
    -   Svaki oglas je povezan sa korisnikom koji ga je kreirao.
    -   Mogućnost dohvatanja svih oglasa ili pojedinačnog oglasa po ID-u.
-   **Upload slika**:
    -   Upload slika prilikom kreiranja ili ažuriranja oglasa.
    -   Validacija veličine i tipa fajla.
    -   Slike se čuvaju na serveru i putanja se vezuje za oglas.

---

## Pokretanje projekta

### Preduslovi

-   [Node.js](https://nodejs.org/en/) (verzija >= 18)
-   [NPM](https://www.npmjs.com/) ili [Yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/) instanca (lokalna ili cloud)

### Instalacija

1.  **Klonirajte repozitorijum:**
    ```bash
    git clone https://github.com/mihailocv/kpc-webshop-backend.git
    cd kpc-webshop-backend
    ```

2.  **Instalirajte zavisnosti:**
    ```bash
    npm install
    ```

3.  **Podesite `environment` promenljive:**
    Kreirajte `.env` fajl u korenu projekta. Možete kopirati `.env.example` ako postoji, ili koristiti ovaj šablon:

    ```env
    # URI za konekciju na MongoDB bazu
    MONGODB_URI=mongodb://localhost:27017/kpc-webshop

    # JWT podešavanja
    JWT_SECRET=VASA_TAJNA_REC_ZA_JWT
    JWT_EXPIRES=3600s

    # Podešavanja servera
    PORT=3000
    ```

### Pokretanje aplikacije

-   **Development mod (sa auto-reloadom):**
    ```bash
    npm run start:dev
    ```

-   **Produkcioni mod:**
    ```bash
    npm run build
    npm run start:prod
    ```

Aplikacija će biti dostupna na `http://localhost:3000`.

### Testiranje

-   **Pokretanje svih testova:**
    ```bash
    npm run test
    ```

-   **Pokretanje End-to-End (E2E) testova:**
    ```bash
    npm run test:e2e
    ```

-   **Generisanje izveštaja o pokrivenosti koda testovima:**
    ```bash
    npm run test:cov
    ```

---

## API Endpoints

Ukratko, ovo su glavni endpoint-i dostupni u aplikaciji:

| Metoda | Ruta              | Opis                                    | Zaštićeno |
| :----- | :---------------- | :-------------------------------------- | :-------- |
| `POST` | `/auth/signup`    | Registracija novog korisnika.           | Ne        |
| `POST` | `/auth/login`     | Prijava korisnika i dobijanje tokena.   | Ne        |
| `GET`  | `/ads`            | Dohvatanje svih oglasa.                 | Ne        |
| `GET`  | `/ads/:id`        | Dohvatanje jednog oglasa po ID-u.       | Ne        |
| `POST` | `/ads`            | Kreiranje novog oglasa (sa slikom).     | Da        |
| `PATCH`| `/ads/:id`        | Ažuriranje postojećeg oglasa.           | Da        |
| `DELETE`| `/ads/:id`       | Brisanje oglasa.                        | Da        |

Za kreiranje i ažuriranje oglasa, podaci se šalju kao `multipart/form-data`.
