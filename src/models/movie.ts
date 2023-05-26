import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  name: string;
  description: string;
  genre: string;
  users: mongoose.Types.ObjectId[];
  lists: mongoose.Types.ObjectId[];
}

const movieSchema: Schema<IMovie> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  users: [{ type: mongoose.Types.ObjectId, required: false, ref: 'User' }],
  lists: [{ type: mongoose.Types.ObjectId, required: false, ref: 'MovieList' }]
});

const Movie = mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;