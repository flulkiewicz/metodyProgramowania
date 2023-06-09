import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'

import Movie, { IMovie } from '../models/movie'
import HttpError from '../models/http-error'
import MovieList, { IMovieList } from '../models/movieList'
import User from '../models/user'

const funcGetMovieById = async (movieId: string, next: NextFunction): Promise<IMovie | any> => {
	let movie: IMovie | null
	try {
		movie = await Movie.findById(movieId)
	} catch (err) {
		const error = new HttpError('Unable to get movie, this shouldnt', 500)
		return next(error)
	}
	if (!movie) {
		const error = new HttpError('No movie with given id was found.', 404)
		return next(error)
	}
	return movie
}

const funcGetMovieListById = async (movieListId: string, next: NextFunction): Promise<IMovieList | any> => {
	let movieList: IMovieList | null
	try {
		movieList = await MovieList.findById(movieListId)
	} catch (err) {
		const error = new HttpError('Unable to get movie', 500)
		return next(error)
	}
	if (!movieList) {
		const error = new HttpError('No movie list with given id was found.', 404)
		return next(error)
	}
	return movieList
}

export const getMovieLists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

	let movieList

	try {
		movieList = await MovieList.find().populate('movies')
	} catch (err) {
		const error = new HttpError('Unable to get list', 500)
		return next(error)
	}
	if (!movieList) {
		const error = new HttpError('No list with given id was found.', 404)
		return next(error)
	}

	res.json({
		movieList: movieList.map(m => m.toObject({ getters: true })),
	})
}


export const getMovieListById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const movieListId = req.params.id

	let movieList = await funcGetMovieListById(movieListId, next)

	res.json({
		movieList: movieList?.toObject({ getters: true }),
	})
}

//TODO: Dodać do usera
export const postMovieList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const validationErrors = validationResult(req)

	if (!validationErrors.isEmpty()) {
		const error = new HttpError('Validation failed. Check your input.', 422)
		return next(error)
	}

	const { name, description } = req.body

	const newMovieList = new MovieList({
		name,
		description,
	})

	try {
		const session = await mongoose.startSession()
		session.startTransaction()

		await newMovieList.save({ session })

		await session.commitTransaction()
	} catch (err) {
		const error = new HttpError('Unable to create list. Check error message.', 500)
		return next(error)
	}

	res.status(201).json({ movie: newMovieList })
}

export const updateMovieList = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const error = new HttpError('Validation error', 422)
			return next(error)
		}

		const movieListId: string = req.params.id
		const { name, description } = req.body

		let movieList

		try {
			movieList = await MovieList.findById(movieListId).populate('movies')
		} catch (err) {
			const error = new HttpError('Unable to get list', 500)
			return next(error)
		}
		if (!movieList) {
			const error = new HttpError('No list with given id was found.', 404)
			return next(error)
		}

		movieList.name = name
		movieList.description = description

		try {
			await movieList.save()
		} catch (err) {
			const error = new HttpError('Unable to save movie', 500)
			return next(error)
		}

		res.status(200).json({ movieList: movieList.toObject({ getters: true }) })
	} catch (err) {
		const error = new HttpError('An error occurred.', 500)
		return next(error)
	}
}


export const deleteMovieList = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const movieListId = req.params.id
		const doPopulate = true
		const movieList = await funcGetMovieListById(movieListId, next)

		const sess = await mongoose.startSession()
		sess.startTransaction()

		const movies = movieList.movies

		for (const movieId of movies) {
			const movie = await funcGetMovieById(movieId, next);
			movie?.lists.pull(movieList);
			await movie.save({ session: sess });
		  }

		await movieList.deleteOne({ session: sess })

		await sess.commitTransaction()
	} catch (err: any) {
		const error = new HttpError(err, 500)
		return next(error)
	}

	res.status(200).json({ message: `Movie list successfully deleted.` })
}
