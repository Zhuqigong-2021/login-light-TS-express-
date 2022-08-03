import { NextFunction, Router, Request, Response } from 'express';

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.login) {
    next();
    return;
  }
  res.status(403);
  res.send('Not Permitted');
}

const router = Router();
router.get('/login', (req: Request, res: Response) => {
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

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;
  if (email && password && email === 'phil@gmail.com' && password === '1234') {
    //mark this person as login
    req.session = { login: true };
    //redirect them to the root route
    res.redirect('/');
    res.send(email.toUpperCase());
  } else {
    res.send(`
    <h1> Sorry !</h1>
    <p> You are not logged in</p>
    <button><a href="/login">log in</a></button>
    `);
  }
});

router.get('/', (req: Request, res: Response) => {
  if (req.session && req.session.login) {
    res.send(`
    <h1> Welcome !</h1>
    <p> You logged in succesfully</p>
    <button><a href="/logout">log out</a></button>
    `);
  } else {
    res.send(`
    <h1> Sorry !</h1>
    <p> You are not logged in</p>
    <button><a href="/login">log in</a></button>
    `);
  }
});
router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/');
});
router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send('Welcome to protected route,logged in user');
});
export { router };
