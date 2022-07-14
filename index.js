const express = require('express');
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token');

const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
    res.send('Hello, welcome to CallMe jjj')
});

app.post("/paystack_success", (req, res) => {
    console.log("Paystack Webhook event received");
    console.log(req.body);
    res.status(200).json(
        {
            "error": false,
            "data": req.body.data.metadata
        });
});

app.get("/paystack_callback", (req, res) => {
    console.log("Paystack Callback received");
    console.log(req.params);
    res.status(200).json(
        {
            "error": false,
            "data": req.params
        });
});


app.post('/token', (req, res) => {
    // Rtc Examples
    const appID = req.body.appId;
    const appCertificate = req.body.appCertificate;
    const channelName = req.body.channelName;
    const uid = req.body.uid;
    const userRole = req.body.role;
    // const account = req.body.account;
    // const account = "2882341273";
    const role = userRole === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const expirationTimeInSeconds = 3600

    const currentTimestamp = Math.floor(Date.now() / 1000)

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    try {
        // Build token with uid
        const tokenA = RtcTokenBuilder.buildTokenWithUid(
            appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
        // console.log("Token: " + tokenA);
        // console.log("Role:" + role);

        // // Build token with user account
        // const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
        // console.log("Token With UserAccount: " + tokenA);

        res.status(200).json(
            {
                "error": false,
                "token": tokenA
            });
    } catch (e) {
        res.status(501).json(
            {
                "error": true,
                "message": e.message,

            });
    }

});



const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Listening to port:${PORT}`)
});