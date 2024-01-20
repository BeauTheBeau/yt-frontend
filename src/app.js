const express = require('express');
const { setupMiddleware } = require('./utils/middleware');
const { handle404, handleError } = require('./utils/errorHandlers');
const { initDirectories } = require('./utils/directoryManager');
const { connectToDb } = require('./utils/db');
const { createHelpers } = require('./utils/hbsHelpers');
const indexRouter = require('./routes');
const app = express();

const swaggerUi = require('swagger-ui-express');

// Initialize
connectToDb();
initDirectories();
createHelpers();
setupMiddleware(app);

// Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'BeauTube',
            version: '1.0.0',
        },
        authorization: {
            type: 'apiKey',
            in: 'header',
            name: 'x-auth-token',
        },
        tags: [
            {
                name: 'Videos',
                description: 'Video management',
            },
            {
                name: 'Users',
                description: 'User management',
            },
            {
                name: 'Frontend',
                description: 'Frontend routes, such as the home page',
            }
        ],
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },            {
                url: 'https://yt.beauthebeau.pro',
                description: 'Production server',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJsdoc(swaggerOptions);


// Routes
app.use('/', indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handling Errors
app.use(handle404);
app.use(handleError);

module.exports = app;