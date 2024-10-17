// config.js
module.exports = {
    useProxy: false, // Set to true if you want to run with proxies
    minDelay: 3, // random delay for keepalive packet send
    maxDelay: 10, // random delay for keepalive packet send
    restartDelay: 160, // Delay in seconds before restarting the process
	accountDelay: 30, // Custom delay in seconds before processing the next account
};
