import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

import { registerValidation, loginValidation, postCreateValidation } from './validation.js';
import { PostController, UserController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

const db = process.env.MONGODB_URI;

mongoose
	.connect(db)
	.then(() => console.log('DB is OK'))
	.catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//login
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
//registration
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
//get user info
app.get('/auth/me', checkAuth, UserController.getMe);

//
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update,
);

//
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.listen(process.env.PORT || 4444, (err) => {
	if (err) {
		console.log(err);
	}

	console.log('Server is ok');
});
