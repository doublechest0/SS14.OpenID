require("dotenv").config();
const express = require("express");
const app = express();
const { auth, requiresAuth } = require("express-openid-connect");

const PORT = process.env.PORT || 3000;

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientSecret: process.env.CLIENT_SECRET,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idTokenSigningAlg: `ES256`,
    authorizationParams: {
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
      response_type: 'code',
      scope: 'openid profile email'
    },
  })
);

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/profile", requiresAuth(), async (req, res) => {
  res.json(await req.oidc.fetchUserInfo());
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
