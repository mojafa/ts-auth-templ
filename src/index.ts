require('dotenv').config()
import express from 'express'
import config from 'config'
import connectToDb from './utils/dbConnection'
import log from "./utils/logger";

import router from './routes'
import deserializeUser from './middleware/deserializeUser';

const app = express()

//order of middleware matters so put the body one above the router middleware
app.use(express.json())

app.use(deserializeUser);

app.use(router)



const port = config.get('port')

app.listen(port, () => {
    log.info(`App started at http://localhost:${port}`),
        connectToDb()
}); 