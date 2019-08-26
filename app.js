const { Server } = require('@hapi/hapi');
const server = new Server({
    port: 3000
});
const runServer = async () => {
    await server.register({
        plugin: require('keycloak-hapi'),
        options: {
            serverUrl: 'http://localhost:8080/auth',
            realm: 'augustus',
            clientId: 'express-keycloak',
            bearerOnly: true // set it to true if you're writing a resource server (REST API).
        }
    });

    server.auth.strategy('keycloak', 'keycloak');
    server.auth.default('keycloak');

    server.route([
        {
            method: 'GET',
            path: '/base',
            handler: () => {
                return 'yo!';
            }
        },
        {
            method: 'GET',
            path: '/products',
            handler: () => {
                return ['drugs!'];
            }
        },
        {
            method: 'GET',
            path: '/things',
            handler: () => {
                return ['cats!'];
            },
            config: {
                auth: {
                    scope: ['mage']
                }
            }
        }]);

    server.start();
};

runServer();

