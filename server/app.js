const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload')
const rateLimit = require('express-rate-limit')
const logger = require('morgan');
const SQLITE = require('./database/database')
const auth = require('./controllers/auth/authentification')

  

  const indexRouter = require('./routes/index')
  const usersRouter = require('./routes/users')
  const messagesRouter = require('./routes/messages')



  const { dirname } = require('path');
  const { Database } = require('sqlite3');

  const app = express();

  /**
 * Autorisation de connexion entre les clients et le serveur
 * contournement des erreurs CORS
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/**
 * Authentification et synchronisation de Sequelize
 */
try {
  SQLITE.sequelize.authenticate()
  .then(() => {
    SQLITE.sequelize.sync()
  })
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 2 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileupload())
app.use(limiter)
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Définition des routes de l'application
 */
app.use('/', indexRouter);
app.use('/api/auth', auth.adminExist, usersRouter)
app.use('/api/msg', messagesRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err })
});

module.exports = app;
