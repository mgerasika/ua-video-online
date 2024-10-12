### !!!Temporary proxy-server not available because VPN problem in Ukraine!!!
Website scrapper that allow watch videos from [rezka](https://rezka.ag/) web site. Scrapped only videos with ukrainian and original translations. Just for home usage - not commercial. All streams periodically stored in own db. Also all movies have relation to imdb website.

# Stack

## Backend

- [expressjs](https://expressjs.com/) - nodejs be framework
- [cypress](https://docs.cypress.io/guides/overview/why-cypress) - tool for e2e, used for scrapping web pages and populate DB
- [cheerio](https://cheerio.js.org/) - parsing html without running browser
- [postgresql](https://www.postgresql.org/) - database
- [typeorm](https://typeorm.io/) - orm for database
- [rabbit-mq](https://www.rabbitmq.com/) - broker for messages
- [firebase](https://firebase.google.com/docs/functions) - host fe/be side in google firebase hosting/functions
- [swagger code generation](https://github.com/mgerasika/typescript-to-swagger) - automatically build swagger.spec from express code + automatically generate client proxy code.
- [omdbapi](http://www.omdbapi.com/) - service for getting information about movie by id (limited account)

## Frontend

- [nextjs](https://nextjs.org/) - customer web site (SEO)
- [twin.macro](https://github.com/ben-rogerson/twin.macro) - css

# Links

[customer web site](https://ua-video-online.web.app/)
![ua-video-online](https://github.com/user-attachments/assets/97e92a1e-a089-4682-a683-8df96590014f)
![image](https://github.com/mgerasika/ua-video-online/assets/10614750/1ebb5e0c-8478-4085-bc2e-49d9e1d1fe43)
![image](https://github.com/mgerasika/ua-video-online/assets/10614750/e35f9e39-69a6-4a6f-be34-22067a24e9e3)
