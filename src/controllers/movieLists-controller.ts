import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

import HttpError from '../models/http-error';
import Movie, { IMovie } from '../models/movie';
import User from '../models/user';

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
  
    const newMovie = new Movie({
      name,
      description,
      
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