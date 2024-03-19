import express from 'express';
import http from "http";
import { Issuer } from 'openid-client';

const app = express();

app.use(express.urlencoded({ extended: true }));

const httpServer = http.createServer(app)
httpServer.listen(8080, () => {
  console.log(`Http Server Running on port 8080`)
})

const redirectURI = ''

Issuer.discover('http://localhost:3000/oidc')
  .then(function (oidcIssuer) {
    var client = new oidcIssuer.Client({
      client_id: 'oidcCLIENT',
      client_secret: 'client_super_secret',
      redirect_uris: [redirectURI],
      response_types: ['code'],
    });

    app.get('/login', (req, res) => {
      const authorizationUrl = client.authorizationUrl({
        scope: 'openid'
      });
      res.redirect(authorizationUrl);
    });

    app.get('/login/callback', async (req, res) => {
      try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(redirectURI, params);
        // Aqui você pode processar o tokenSet conforme necessário
        console.log("Token Set:", tokenSet);
        res.send(tokenSet); // Exemplo: apenas retornando o tokenSet como resposta
      } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao processar o token.');
      }
    });

    app.get("/", (req, res) => {
      res.send("<a href='/login'>Log In with OAuth 2.0 Provider </a>")
    });
  });
