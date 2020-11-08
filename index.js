const express = require('express');
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token');

const app = express();
app.use(express.json());

app.get("/hello",(req,res)=>{
    res.send('Hello, welcome to CallMe uuu')
});

app.post('/token', (req, res) => {
    // Rtc Examples
    const appID = req.body.appId;
    const appCertificate = req.body.appCertificate;
    const channelName = req.body.channelName;
    const uid = req.body.uid;
    // const account = req.body.account;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600

    const currentTimestamp = Math.floor(Date.now() / 1000)

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    try {
        // Build token with uid
        const tokenA = RtcTokenBuilder.buildTokenWithUid(
            appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
        console.log("Token With Integer Number Uid: " + tokenA);

        // Build token with user account
        // const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
        // console.log("Token With UserAccount: " + tokenB);

        res.json(
            {
                "error": false,
                "token": tokenA
            });
    } catch (e) {
        res.send(`${appID}:${appCertificate}`);
    }

});



const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Listening to port:${PORT}`)
});