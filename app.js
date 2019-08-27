const { Server } = require('@hapi/hapi');
const server = new Server({
    port: 3000,
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
            clientId: 'cool-project-of-awesomeness',
            bearerOnly: true // true for REST service
        }
    });

    server.auth.strategy('keycloak', 'keycloak');
    server.auth.default('keycloak');

    server.route([
        {
            method: 'GET',
            path: '/api/v1/base',
            handler: () => {
                return 'yo!';
            }
        },
        {
            method: 'GET',
            path: '/api/v1/common-facts',
            handler: () => {
                return [
                    'LOTR > GOT',
                    'LOL > DOTA',
                    'X-Men > Avengers',
                    'Han shot first',
                    'Nerds rule!',
                ];
            },
            options: {
                description: 'Get a list of some common, widely known and self-evident facts.',
                tags: ['api'],
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/api/v1/mage-spells',
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
            path: '/api/v1/warlock-spells',
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

