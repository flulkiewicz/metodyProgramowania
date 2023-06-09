import fetch from 'isomorphic-fetch';

export const getMovieDescription = async (title: string): Promise<string> => {
	const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
		title
	)}&include_adult=false&language=en-US&page=1`

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN!}`
		},
	}
	
	fetch(url, options)
		.then(res => res.json())
		.catch(err => console.error('error:' + err))

	try {
		const response = await fetch(url, options)
		const json: any = await response.json()

		if (json.results && json.results.length > 0) {
			return json.results[0].overview as string
		} else {
			return ("Description placeholder - description not found for movie in db")
		}
	} catch (err) {
		console.error('error:', err)
		throw err
	}
}
