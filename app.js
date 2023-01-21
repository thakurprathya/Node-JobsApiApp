require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser = require('./middleware/authentication');
// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
// Swagger UI for frontend
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
//for getting info about any library, library docs is a good place to start

// security middlewares
// app.set('trust proxy', 1);  //if application is behind proxy then use it, like heroku deployment
app.use(express.json());  //if we donot use it we won't have data in req.body
app.use(
    rateLimiter({ 
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);// this library is used to limit the amount of requests user can make
app.use(helmet());  //most popular security package sets various https headers to prevent attacks
app.use(cors());  //it ensures that api accessable from diff domains (without using it only can access api in project domain only like public directory), corss basically makes api public
app.use(xss());  //xss-clean library sanitizes the user input in req.body, req.query, req.params, protects us from cross-site attacks

// routes
app.use('/api/v1/auth', authRouter);  //base url for authentication routes
app.use('/api/v1/jobs', authenticateUser, jobsRouter);  //base url for jobs routes after authentication
app.get('/', (req, res) => { res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>'); });
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// user defined middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//setting up port for server
const port = process.env.PORT || 3000;

//connecting to DataBase
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`) );
    } catch (error) {
        console.log(error);
    }
};
start();
//9.17