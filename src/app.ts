import Hapi from '@hapi/hapi';
import HapiPino from 'hapi-pino';
import _ from 'lodash';

const init = async () => {
  // server-config
  const server = Hapi.server({
    host: 'localhost',
    port: 3000,
  });

  // server-register
  await server.register({
    plugin: HapiPino,
    options: {
      logEvents: ['response', 'request', 'request-error'],
      logPayload: true,
      logRequestComplete: true,
      logQueryParams: true,
      ignorePaths: ['/health-check'],
      formatters: {
        log(object: any) {
          const body = _.get(object, 'req.response.source');
          return {
            ...object,
            body,
          };
        },
      },
    },
  });

  await server.start();

  server.route({
    method: 'GET',
    path: '/health-check',
    handler: () => {
      return 'App succesfully running';
    },
  });

  console.log('server running sucessfully', server.info.uri);
};

init();
