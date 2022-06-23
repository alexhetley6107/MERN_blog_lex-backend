import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation } from './validation.js';

import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';

const db =
	'mongodb+srv://admin_hetley:Vegirdezzzhetley1996@cluster0.am90r.mongodb.net/blog?retryWrites=true&w=majority';

mongoose
	.connect(db)
	.then(() => console.log('DB is OK'))
	.catch((err) => console.log('DB error', err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello Dear World');
});

//login
app.post('/auth/login', loginValidation, UserController.login);

//registration
app.post('/auth/register', registerValidation, UserController.register);

app.get('/auth/me', checkAuth, UserController.getMe);

app.listen(4444, (err) => {
	if (err) {
		console.log(err);
	}

	console.log('Server is ok');
});
