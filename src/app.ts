import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import HttpError from './models/http-error'
import { routes } from './routes'

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

	next()
})

app.use('/api', routes)

app.use((req, res, next) => {
	const error = new HttpError('This route is not available', 404)
	return next(error)
})

app.use((err: any, req: any, res: any, next: any) => {
	if (res.headersSent) {
		return next(err)
	}
	res.status(err.code || 500)
	res.json({ message: err.message || 'Unknown error occurred.' })
})

const mongo_connection_string : string = process.env.MONGO_URI!

mongoose
	.connect("mongodb+srv://wsb123:wsb123@atlascluster.rv2ka7q.mongodb.net/?retryWrites=true&w=majority")
	.then(() => {
		app.listen(5000)
	})
	.catch(err => {
		console.log('Connection error: ', err)
	})
