import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error';
import User from '../models/user';

export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
	let user;
	try {
		user = await User.findOne({ id: userId });
	} catch (err) {
		const error = new HttpError('Unable to get user, try again later', 500);
		return next(error);
	}

    if (user == null) {
		const error = new HttpError('No user with given id was found.', 404)
		return next(error)
	}

	res.status(200).json({ user: user.toObject({ getters: true }) })
}; 



export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	let users;
	try {
		users = await User.find({}, 'username email');
	} catch (err) {
		const error = new HttpError('Unable to get users, try again later', 500);
		return next(error);
	}

	res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { username, email, password } = req.body;

	const validationErrors = validationResult(req);

    
	if (!validationErrors.isEmpty()) {
		const error = new HttpError('Validation failed. Check if your input is valid.', 422);
		return next(error);
	}
    

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Try again later.', 503);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError('Email taken.', 422);
		return next(error);
	}

	let hashedPassword;

	hashedPassword = await bcrypt.hash(password, 12);

	const newUser = new User({
		username: username,
		email: email,
		password: hashedPassword,
		constellations: [],
	});

	try {
		await newUser.save();
	} catch (err) {
		const error = new HttpError('Woop... cant create User, try again later.', 503);
		return next(error);
	}

	res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Try again later.', 503);
		return next(error);
	}

	if (!existingUser) {
		const error = new HttpError('Invalid credentials', 401);
		return next(error);
	}

	let isValidPassword = false;
	isValidPassword = await bcrypt.compare(password, existingUser.password);

	if (!isValidPassword) {
		const error = new HttpError('Invalid credentials', 401);
		return next(error);
	}

	let token;
	token = jwt.sign(
		{ userId: existingUser.id, email: existingUser.email },
		'jwt_constellation_app_token',
		{ expiresIn: '7d' }
	);

	res.status(200).json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
	});
};
