import mongoose, { Schema, Document } from 'mongoose';

export interface IMovieList extends Document {
  name: string;
  description: string;
  genre: string;
  user: mongoose.Types.ObjectId;
  movies: mongoose.Types.ObjectId[]
  
}

//TODO - po dodaniu endpointow dla usera zmienic required
const movieSchema: Schema<IMovieList> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
  movies: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Movie' }]
});

const MovieList = mongoose.model<IMovieList>('MovieList', movieSchema);

export default MovieList;