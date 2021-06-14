require('dotenv').config();
const {OAuth2Client} = require('google-auth-library');
const clientAndroid = new OAuth2Client(process.env.CLIENT_ID_ANDROID);
const clientIOS = new OAuth2Client(process.env.CLIENT_ID_IOS);


async function CheckAuth(req, res, next) {
    const { authorization, platform } = req.headers;
    if (!authorization || !platform) return res.sendStatus(400);
    // console.log(authorization);
    /*
        headers : {
            authorization : Bearer lakksdlkjalkaldjkaljsdkljadlsadjsaldasd
        }
    */
    const token = authorization.split(" ")[1];
    // console.log(token);
    if(!token) return res.sendStatus(400);
    const client = platform.toUppercase() === "ANDROID"?clientAndroid : clientIOS
    const user = await client.verifyIdToken({
        idToken: token,
        audience: [process.env.CLIENT_ID_ANDROID,process.env.CLIENT_ID_IOS],
    }).catch(err => {
        console.log("INVALID TOKEN : ", err);
        return null
    });
    if(!user) return res.sendStatus(403);
    const payload = user.getPayload();
    req.payload = payload
    next();
}

exports.CheckAuth = CheckAuth;