require('dotenv').config({ path: './process.env' });
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const { SERVER_SESSION_SECRET, PORT } = require('./config.js');


let app = express();
app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(session({
    name: 'session',
    keys: [SERVER_SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,  // 1 day
    secure: process.env.NODE_ENV === 'production',  // Ensure `true` on HTTPS
    httpOnly: true,
    sameSite: 'None',
    domain: '.onrender.com'  // Add this line for Render deployment
}));   
app.use(require('./routes/auth.js'));
app.use(require('./routes/shares.js'));
app.use(require('./routes/token.js'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { user: req.session.user, error: err });
})
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
