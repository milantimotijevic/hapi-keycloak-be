const { Server } = require('@hapi/hapi');
const server = new Server({
    port: 3001,
    routes: {
       cors: true
    }
});
const provision = async () => {
    await server.register({
        plugin: require('keycloak-hapi'),
        options: {
            serverUrl: 'http://localhost:8080/auth',
            realm: 'augustus',
            clientId: 'express-keycloak',
            bearerOnly: true // true for REST service
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
            path: '/private/mage-spells',
            handler: () => {
                return ['fireball', 'frostbolt', 'arcane missiles'];
            },
            config: {
                auth: {
                    scope: ['mage']
                }
            }
        },
        {
            method: 'GET',
            path: '/private/warlock-spells',
            handler: () => {
                return ['shadowbolt', 'corruption', 'drain life'];
            },
            config: {
                auth: {
                    scope: ['warlock']
                }
            }
        }]);

    server.start();
};

provision();

