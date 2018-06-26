const a = require("google-auth-library");
const c = require("../constants");
const https = require("https");

const client = new a.OAuth2Client(c.IOS_CLIENT_ID);

async function verify(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: c.IOS_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  return {
    valid: true,
    email: payload.email,
    name: payload.given_name + " " + payload.family_name,
    imageUri: payload.photoUrl
  };
}

module.exports = {
  verify
};
