import express from 'express';
import dotenv from 'dotenv';
import db from './src/config/database.js';
import routes from './src/routes/index.routes.js';
import cors from 'cors';
import session from 'express-session';
import mysqlStore from 'connect-mysql';
const MysqlStore = mysqlStore(session)

// iitializations
const app = express();
app.set('PORT', process.env.PORT || 4000);
dotenv.config()

// Options of the session the user
const options = {
    config: {
        user: process.env.USER,
        password: '',
        database: process.env.DATABASE
    }
}

// Habilitar cors
const whiteList = ['http://localhost:4200'];
const corsOptions = {
    origin: (origin, callback) =>{
        const existe = whiteList.some(dominio => dominio === origin);
        if(existe){
            callback(null, true);
        }else{
            callback('Not allowed for cors');
        }
    },
    credentials: true
}

// Disable the X-Powered-By
app.disable("x-powered-by");

// start database
db.authenticate()
    .then(() => console.log('Connected to database'))
    .catch(err => console.log(err));

// Middlewares
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSIONEXPRESS,
    store: new MysqlStore(options),
    cookie: {
        encode: true,
        maxAge: 60 * 60 * 24 * 1000,
        httpOnly: false
    },
    resave: false,
    saveUninitialized: false,
}))

// routes
app.use('/api', routes);


// server listening
app.listen(app.get('PORT'), () => console.log(`Server listening in ${app.get('PORT')}`));

export default app;