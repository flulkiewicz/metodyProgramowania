import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'

import HttpError from '../models/http-error'
import Movie, { IMovie } from '../models/movie'
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
		const error = new HttpError('No movie with given id was found.', 404)
		return next(error)
	}
	return movieList
}

export const getMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	let movies
	try {
		movies = await Movie.find()
	} catch (err) {
		const error = new HttpError('No movies was found.', 404)
		return next(error)
	}

	res.json({
		movies: movies.map(m => m.toObject({ getters: true })),
	})
}



export const getMovieById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const movieId = req.params.id
	const movie = await funcGetMovieById(movieId, next)

	res.json({
		movie: movie?.toObject({ getters: true }),
	})
}




export const addMovieToMovieList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { movieListId, movieId } = req.body

	let movie, movieList

	try {
		movie = await funcGetMovieById(movieId, next)
		movieList = await funcGetMovieListById(movieListId, next)
	} catch (err) {
		const error = new HttpError('Unable to find movie or movie list.', 404)
		return next(error)
	}

	try {
		const sess = await mongoose.startSession()
		sess.startTransaction()

		movieList.movies.push(movie)
		await movieList.save({ session: sess })

		await sess.commitTransaction()
	} catch (err) {
		const error = new HttpError('Unable to add movie to list. Check error message.', 500)
		return next(error)
	}

	res.status(201).json({ Message: 'Movie added to list.' })
}

//TODO, dodać dodawanie do list po ID
export const postMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const validationErrors = validationResult(req)

	if (!validationErrors.isEmpty()) {
		const error = new HttpError('Validation failed. Check your input.', 422)
		return next(error)
	}

	const { name, description, genre } = req.body

	const newMovie = new Movie({
		name,
		description,
		genre,
	})

	try {
		const session = await mongoose.startSession()
		session.startTransaction()

		await newMovie.save({ session })
		//TODO: dodać do listy
		await session.commitTransaction()
	} catch (err) {
		const error = new HttpError('Unable to create movie. Check error message.', 500)
		return next(error)
	}

	res.status(201).json({ movie: newMovie })
}

export const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			const error = new HttpError('Validation error', 422)
			return next(error)
		}

		const movieId: string = req.params.id
		const { name, description, genre } = req.body

		const doPopulate: boolean = false
		const movie = await funcGetMovieById(movieId, next)

		movie.name = name
		movie.description = description
		movie.genre = genre

		try {
			await movie.save()
		} catch (err) {
			const error = new HttpError('Unable to save movie', 500)
			return next(error)
		}

		res.status(200).json({ movie: movie.toObject({ getters: true }) })
	} catch (err) {
		const error = new HttpError('An error occurred.', 500)
		return next(error)
	}
}

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const movieId = req.params.id
		const doPopulate = true
		const movie = await funcGetMovieById(movieId, next)

		const sess = await mongoose.startSession()
		sess.startTransaction()
		//TODO Usunąć z listy po dodaniu dodawania do list
		await movie.deleteOne({ session: sess })

		await sess.commitTransaction()
	} catch (err) {
		const error = new HttpError(`Unable to delete movie.`, 500)
		return next(error)
	}

	res.status(200).json({ message: `Movie successfully deleted.` })
}
