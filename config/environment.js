const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const log_directory = path.join(__dirname, '../production_logs');
fs.existsSync(log_directory) || fs.mkdirSync(log_directory);

const accessLogStream = rfs.createStream('access.log', {
    interval : '1d',
    path : log_directory
});


const development = {
    name : 'development',
    asset_path : './public/assets',
    session_cookie_key : 'betonTime',
    google_client_iD: "1079664389518-m4uaid1nv7rhhvm1cp6ins5o2nivag6g.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callbackURL: "https://domino-beton.herokuapp.com/users/auth/google/callback",
    morgan : {
        mode: 'dev',
        options : {stream: accessLogStream}
    }
}

const production = {
    name : 'production',
    asset_path : './public/assets',
    session_cookie_key : 'KoWjD2zQdr2Vxh7cirYAVeUSy3gzAn6J',
    google_client_iD: "359903220192-qfi6cfmvl3ilq5fk1a210rnuebm1r6p1.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callbackURL: "http://localhost:8000/users/auth/google/callback",
    morgan : {
        mode: 'combined',
        options : {stream: accessLogStream}
    }
}

module.exports = eval(process.env.DOMINO_BETON_ENVIRONMENT) == undefined ? development : eval(process.env.DOMINO_BETON_ENVIRONMENT);