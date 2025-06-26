const { OAuth2Client } = require('google-auth-library');
const dotenv = require("dotenv");

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

async function googleAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    req.user = payload; 
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = googleAuthMiddleware;
