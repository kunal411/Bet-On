const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const schedule = require('node-schedule');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
// const pssportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const { param } = require('./routes');
const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');
const customFlashMWare = require('./config/flash-middleware');

const cors = require('cors');
require('dotenv').config();

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(express.static('./assets'));
//make the uploads path available to the browser


app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'BETON-DOMINO',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customFlashMWare.setFlash);


const dbCo = require('./controllers/matchDB-controller');
const LivematchdetController = require('./controllers/match-LiveDetailsDB-controller');
const LiveMatchScore = require('./controllers/match-livescoreDB-controller');
const TeamScoreUpdate = require('./controllers/user_team_score_update_controller');

async function addMatch(){
    await dbCo.addMatchtoDb();
}
async function addLiveMatch(){
    await LivematchdetController.addMatchLiveDettoDb();
}
async function addLiveScore(){
    await LiveMatchScore.addMatchLiveScoreDettoDb();
}

async function addUpdatedTeamScore(){
    await TeamScoreUpdate.scoreUpdate();
}

// addMatch();
// addLiveMatch();
// addLiveScore();
// addUpdatedTeamScore();

// use express router
app.use('/', require('./routes'));


app.listen(process.env.PORT || port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});