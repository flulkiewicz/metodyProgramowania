import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import HttpError from '../models/http-error';
import MovieList, { IMovieList } from '../models/movieList';
import User from '../models/user';

export const getMovieListById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const movieListId = req.params.id;
    
    let movieList;

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

    res.json({
      movieList: movieList?.toObject({ getters: true }),
    });
  };

//TODO: Dodać do usera
export const postMovieList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      const error = new HttpError('Validation failed. Check your input.', 422);
      return next(error);
    }
  
    const { name, description } = req.body;
  
    const newMovieList = new MovieList({
      name,
      description,
    });
    
  
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      await newMovieList.save({ session });
  
      await session.commitTransaction();
    } catch (err) {
      const error = new HttpError('Unable to create list. Check error message.', 500);
      return next(error);
    }
  
    res.status(201).json({ movie: newMovieList });
  };


export const updateMovieList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new HttpError('Validation error', 422);
        return next(error);
      }
  
      const movieListId: string = req.params.id;
      const { name, description } = req.body;
  
      const doPopulate: boolean = false;
      let movieList;

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
  
      movieList.name = name;
      movieList.description = description;
  
      try {
        await movieList.save();
      } catch (err) {
        const error = new HttpError('Unable to save movie', 500);
        return next(error);
      }
  
      res.status(200).json({ movieList: movieList.toObject({ getters: true }) });
    } catch (err) {
      const error = new HttpError('An error occurred.', 500);
      return next(error);
    }
  };