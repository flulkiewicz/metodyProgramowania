import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import HttpError from '../models/http-error';
import Movie, { IMovie } from '../models/movie';
import User from '../models/user';

const funcGetMovieById = async (
    doPopulate: boolean,
    movieId: string,
    next: NextFunction
  ): Promise<IMovie | any> => {
    let movie: IMovie | null;
    try {
      if (doPopulate === true) {
        movie = await Movie.findById(movieId)
      } else {
        movie = await Movie.findById(movieId)
      }
    } catch (err) {
      const error = new HttpError('Unable to get movie', 500);
      return next(error);
    }
    if (!movie) {
      const error = new HttpError('No movie with given id was found.', 404);
      return next(error);
    }
    return movie;
  };

  export const getMovieById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const movieId = req.params.id;
    const doPopulate = true;
    const movie = await funcGetMovieById(doPopulate, movieId, next);
  
    res.json({
      movie: movie?.toObject({ getters: true }),
    });
  };

  export const postMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      const error = new HttpError('Validation failed. Check your input.', 422);
      return next(error);
    }
  
    const { name, description, genre } = req.body;
  
    const newMovie = new Movie({
      name,
      description,
      genre,
    });
  
    
  
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      await newMovie.save({ session });
  
      await session.commitTransaction();
    } catch (err) {
      const error = new HttpError('Unable to create movie. Check error message.', 500);
      return next(error);
    }
  
    res.status(201).json({ movie: newMovie });
  };
  
  