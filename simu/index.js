import express from 'express'
import oidcProvider from 'oidc-provider'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const redirectURI = ''

const configuration = {
  clients: [{
    client_id: 'oidcCLIENT',
    client_secret: 'client_super_secret',
    grant_types: ['authorization_code'],
    // set here where u want to receive callback
    redirect_uris: [redirectURI],
    response_types: ['code']
  }],
  pkce: {
    required: () => false
  }
}

const oidc = new oidcProvider('http://localhost:3000', configuration)
app.use('/oidc', oidc.callback())

app.listen(3000, function () {
  console.log('OID is listening on port 3000!')
})