require('dotenv').config();
const {OAuth2Client} = require('google-auth-library');
const clientAndroid = new OAuth2Client(process.env.CLIENT_ID_ANDROID);
const clientIOS = new OAuth2Client(process.env.CLIENT_ID_IOS);


async function CheckAuth(req, res, next) {
    const {platform} = req.body;
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(400);
    const token = authorization.split(" ")[1];
    if(!token) return res.sendStatus(400);
    const client = platform === "ANDROID"?clientAndroid : clientIOS
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: [process.env.CLIENT_ID_ANDROID,process.env.CLIENT_ID_IOS],
    }).catch(err => {
        console.log("INVALID TOKEN : ", err);
        return null
    });
    if(!ticket) return res.sendStatus(403);
    const payload = ticket.getPayload();
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    req.payload = payload
    next();
}

exports.CheckAuth = CheckAuth;