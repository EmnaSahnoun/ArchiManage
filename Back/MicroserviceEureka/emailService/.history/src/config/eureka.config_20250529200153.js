const Eureka = require('eureka-js-client').Eureka;

// Configure Eureka client
const client = new Eureka({
    instance: {
        app: 'EmailService',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 3000,
            '@enabled': 'true',
        },
        vipAddress: 'nodejs-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'e8.systeo.tn',
        preferIpAddress: false,
        servicePath: 'https://eureka.systeo.tn/eureka/'
    }
});
// Start Eureka client
client.start(error => {
    console.log('Eureka client started with error:', error);
});