const config = {
    useProxy: false, // Set to true if you want to use proxies, false otherwise
    restartDelay: 207, // Delay in seconds before restarting the process
	minDelay: 3, // random delay for keepalive packet send
    maxDelay: 10, // random delay for keepalive packet send
};

module.exports = config;
