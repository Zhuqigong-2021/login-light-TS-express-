"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
function requireAuth(req, res, next) {
    if (req.session && req.session.login) {
        next();
        return;
    }
    res.status(403);
    res.send('Not Permitted');
}
const router = (0, express_1.Router)();
exports.router = router;
router.get('/login', (req, res) => {
    res.send(`
  <form method="POST">
    <div>
      <label>Email</label>
      <input name="email" />
    </div>
    <div>
      <label>Password</label>
      <input name="password" type="password" />
    </div>
    <button> Submit </button>
  </form>
  `);
});
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password && email === 'phil@gmail.com' && password === '1234') {
        //mark this person as login
        req.session = { login: true };
        //redirect them to the root route
        res.redirect('/');
        res.send(email.toUpperCase());
    }
    else {
        res.send(`
    <h1> Sorry !</h1>
    <p> You are not logged in</p>
    <button><a href="/login">log in</a></button>
    `);
    }
});
router.get('/', (req, res) => {
    if (req.session && req.session.login) {
        res.send(`
    <h1> Welcome !</h1>
    <p> You logged in succesfully</p>
    <button><a href="/logout">log out</a></button>
    `);
    }
    else {
        res.send(`
    <h1> Sorry !</h1>
    <p> You are not logged in</p>
    <button><a href="/login">log in</a></button>
    `);
    }
});
router.get('/logout', (req, res) => {
    req.session = undefined;
    res.redirect('/');
});
router.get('/protected', requireAuth, (req, res) => {
    res.send('Welcome to protected route,logged in user');
});
