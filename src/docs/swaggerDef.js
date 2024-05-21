const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'visionmark-ai-assisted-annotation-suite',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/adityanarayan2021/VisionMark-AI-Assisted-Annotation-Suite/issues',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
