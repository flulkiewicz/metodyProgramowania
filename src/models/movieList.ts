import mongoose, { Schema, Document } from 'mongoose';

export interface IMoveList extends Document {
  name: string;
  description: string;
  genre: string;
  user: mongoose.Types.ObjectId;
  movies: mongoose.Types.ObjectId[]
  
}

const movieSchema: Schema<IMoveList> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
  movies: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Movie' }]
});

const Movie = mongoose.model<IMoveList>('Movie', movieSchema);

export default Movie;