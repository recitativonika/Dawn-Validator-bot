const axios = require('axios');
const https = require('https');
const accountsData = require('./accounts');
const proxies = require('./proxy');
const config = require('./config');

const apiEndpoints = {
    keepalive: "https://www.aeropres.in/chromeapi/dawn/v1/userreward/keepalive",
    getPoints: "https://www.aeropres.in/api/atom/v1/userreferral/getpoint"
};

const ignoreSslAgent = new https.Agent({  
    rejectUnauthorized: false
});

const randomDelay = (min, max) => {
    return new Promise(resolve => {
        const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(resolve, delayTime * 1000);
    });
};

const displayWelcome = () => {
    console.log(`
                \x1b[32m🌟 DAWN Validator Extension automatic claim 🌟\x1b[0m
                          \x1b[36mGithub: recitativonika\x1b[0m
                        \x1b[36mgithub.com/recitativonika\x1b[0m
    `);
};

const fetchPoints = async (headers) => {
    try {
        const response = await axios.get(apiEndpoints.getPoints, { headers, httpsAgent: ignoreSslAgent });
        if (response.status === 200 && response.data.status) {
            const { rewardPoint, referralPoint } = response.data.data;
            const totalPoints = (
                (rewardPoint.points || 0) +
                (rewardPoint.registerpoints || 0) +
                (rewardPoint.signinpoints || 0) +
                (rewardPoint.twitter_x_id_points || 0) +
                (rewardPoint.discordid_points || 0) +
                (rewardPoint.telegramid_points || 0) +
                (rewardPoint.bonus_points || 0) +
                (referralPoint.commission || 0)
            );
            return totalPoints;
        } else {
            console.error(`❌ Failed to retrieve the points: ${response.data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error(`⚠️ Error during fetching the points: ${error.message}`);
    }
    return 0;
};

const keepAliveRequest = async (headers, email) => {
    const payload = {
        username: email,
        extensionid: "fpdkjdnhkakefebpekbdhillbhonfjjp",
        numberoftabs: 0,
        _v: "1.0.9"
    };
    
    try {
        const response = await axios.post(apiEndpoints.keepalive, payload, { headers, httpsAgent: ignoreSslAgent });
        if (response.status === 200) {
            return true;
        } else {
            console.warn(`🚫 Keep-Alive Error for ${email}: ${response.status} - ${response.data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error(`⚠️ Error during keep-alive request for ${email}: ${error.message}`);
    }
    return false;
};

const countdown = async (seconds) => {
    for (let i = seconds; i > 0; i--) {
        process.stdout.write(`⏳ Next process in: ${i} seconds...\r`);
        await randomDelay(1, 1);
    }
    console.log("\n🔄 Restarting...\n");
};

const processAccount = async (account, proxy) => {
    const { email, token } = account;
    const headers = {
        "Accept": "*/*",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    };

    if (proxy) headers['Proxy'] = proxy;

    const points = await fetchPoints(headers);

    console.log(`🔍 Processing: \x1b[36m${email}\x1b[0m, Proxy: ${proxy ? '\x1b[33m' + proxy + '\x1b[0m' : '\x1b[33mNo Proxy\x1b[0m'}, Points: \x1b[32m${points}\x1b[0m`);

    const success = await keepAliveRequest(headers, email);
    if (success) {
        console.log(`✅ Keep-Alive Success for: \x1b[36m${email}\x1b[0m`);
    } else {
        console.warn(`⚠️ Error during keep-alive request for \x1b[36m${email}\x1b[0m: Request failed with status code 502`);
        console.warn(`❌ Keep-Alive Failed for: \x1b[36m${email}\x1b[0m`);
    }

    return points;
};

const processAccounts = async () => {
    displayWelcome();
    const totalProxies = proxies.length;

    while (true) {
        const accountPromises = accountsData.map((account, index) => {
            const proxy = config.useProxy ? proxies[index % totalProxies] : undefined;
            return processAccount(account, proxy);
        });

        const pointsArray = await Promise.all(accountPromises);
        const totalPoints = pointsArray.reduce((acc, points) => acc + points, 0);

        console.log(`📋 All accounts processed. Total points: \x1b[32m${totalPoints}\x1b[0m`);
        await countdown(config.restartDelay);
    }
};

processAccounts();
