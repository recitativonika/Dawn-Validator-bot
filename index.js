const axios = require('axios');
const https = require('https');
const accountsData = require('./accounts'); // account data

const apiEndpoints = {
    keepalive: "https://www.aeropres.in/chromeapi/dawn/v1/userreward/keepalive",
    getPoints: "https://www.aeropres.in/api/atom/v1/userreferral/getpoint"
};

const ignoreSslAgent = new https.Agent({  
    rejectUnauthorized: false
});

// Random delay function to simulate uniqueness
const randomDelay = (min, max) => {
    return new Promise(resolve => {
        const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(resolve, delayTime * 1000); // Convert to milliseconds
    });
};

const displayWelcome = () => {
    console.log(`
🌟 DAWN Validator Extension automatic claim 🌟
    `);
};

const fetchPoints = async (headers) => {
    try {
        const response = await axios.get(apiEndpoints.getPoints, { headers, httpsAgent: ignoreSslAgent });
        if (response.status === 200 && response.data.status) {
            const { rewardPoint, referralPoint } = response.data.data;
            return (
                (rewardPoint.points || 0) +
                (rewardPoint.registerpoints || 0) +
                (rewardPoint.signinpoints || 0) +
                (rewardPoint.twitter_x_id_points || 0) +
                (rewardPoint.discordid_points || 0) +
                (rewardPoint.telegramid_points || 0) +
                (rewardPoint.bonus_points || 0) +
                (referralPoint.commission || 0)
            );
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
        _v: "1.0.8"
    };
    
    try {
        const response = await axios.post(apiEndpoints.keepalive, payload, { headers, httpsAgent: ignoreSslAgent });
        if (response.status === 200) {
            console.log(`✅ Success, ${email}: ${response.data.message}`);
            return true;
        } else {
            console.warn(`🚫 Error, ${email}: ${response.status} - ${response.data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error(`⚠️ Request error, ${email}: ${error.message}`);
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

const processAccounts = async () => {
    displayWelcome();
    while (true) {
        let totalPoints = 0;

        for (const { email, token } of accountsData) {
            const headers = {
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
            };

            console.log(`🔍 Processing: ${email}...`);
            const points = await fetchPoints(headers);
            totalPoints += points;

            const success = await keepAliveRequest(headers, email);
            if (!success) {
                console.log(`❌ Failed to send active package to ${email} accounnt.\n`);
            }
            await randomDelay(1, 3);
        }

        console.log(`📋 All accounts done processed. Total points : ${totalPoints}`);
        await countdown(160); // Countdown before the next cycle
    }
};

// Start the execution
processAccounts();
