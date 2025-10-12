## API Overview

MoviesDatabase is a titles and people data API that provides detailed, regularly updated information for movies, TV series, episodes, and people (actors, crew, cast). It supports lightweight and full responses via the `info` query parameter, search by title or keyword, list-based collections (top charts / box office / popularity), ratings, seasons and episodes lookups, and utilities to retrieve supported types and genres.

Key features in brief:
- Complete coverage of millions of titles (movies, series and episodes) and people
- Flexible `info` parameter to request compact or extended fields (e.g., `mini_info`, `base_info`, `extendedCast`, `awards`)
- Search endpoints for title, keyword and alternate names (akas)
- List endpoints for popular/top charts and upcoming titles
- Season/episode endpoints for series navigation and episode lookups

Support the developers: https://www.buymeacoffee.com/SAdrian13

## API Version

Version: 1.0 (as indicated in the provided API documentation)

## Available Endpoints

Below are the main endpoints provided by the API and a short description of each.

- GET /titles
	- Returns multiple titles filtered and sorted by query parameters. Use `list` to select built-in collections.
- POST /x/titles-by-ids
	- Returns multiple titles by an array of IMDB ids (use `idsList` in request body).
- GET /titles/{id}
	- Returns full details for one title (movies, series or episode). Accepts `info` query param to control returned fields.
- GET /titles/{id}/ratings
	- Returns rating object (averageRating, numVotes) for a title.
- GET /titles/series/{id}
	- Returns an array of episodes for a series (episode ids, season and episode numbers).
- GET /titles/seasons/{id}
	- Returns the number of seasons for a series.
- GET /titles/series/{id}/{season}
	- Returns episode ids/numbers for a specific season.
- GET /titles/episode/{id}
	- Returns episode details (supports `info`).
- GET /titles/x/upcoming
	- Returns upcoming titles.
- GET /titles/search/keyword/{keyword}
	- Searches titles by keyword.
- GET /titles/search/title/{title}
	- Searches titles by title text. Supports `exact=true` for exact matching.
- GET /titles/search/akas/{aka}
	- Searches by alternate titles (akas). Exact and case-sensitive.
- GET /actors
	- Lists actors (supports pagination: `limit`, `page`).
- GET /actors/{id}
	- Actor detail by IMDB id.
- GET /title/utils/titleType
	- Returns supported title types.
- GET /title/utils/genres
	- Returns supported genres.
- GET /title/utils/lists
	- Returns available built-in lists (for `list` query parameter).

## Request and Response Format

Requests
- Format: HTTPS requests with optional query parameters. For POST endpoints, use JSON bodies.
- Typical headers:
	- `Accept: application/json`
	- `X-RapidAPI-Key: <your-key>` (when using RapidAPI)
	- `X-RapidAPI-Host: moviesdatabase.p.rapidapi.com` (when using RapidAPI)

Example GET request (search by title):

```
GET https://moviesdatabase.p.rapidapi.com/titles/search/title/The%20Godfather?exact=true&limit=10&info=mini_info
Headers:
	X-RapidAPI-Key: <API_KEY>
	X-RapidAPI-Host: moviesdatabase.p.rapidapi.com
	Accept: application/json
```

Example POST request (titles by ids):

```
POST https://moviesdatabase.p.rapidapi.com/x/titles-by-ids
Headers:
	Content-Type: application/json
	X-RapidAPI-Key: <API_KEY>
	X-RapidAPI-Host: moviesdatabase.p.rapidapi.com

Body (JSON):
{
	"idsList": ["tt0111161", "tt0068646", "tt0071562"],
	"info": "mini_info"
}
```

Responses
- Every successful response contains a top-level `results` key with an array of objects relevant to the endpoint. Pagination-enabled endpoints also return `page`, `next` and `entries`.

Example rating response (GET /titles/{id}/ratings):

```
{
	"results": {
		"tconst": "tt0111161",
		"averageRating": 9.3,
		"numVotes": 2500000
	}
}
```

Example light episode object (part of results):

```
{
	"tconst": "tt0020666",
	"parentTconst": "tt15180956",
	"seasonNumber": 1,
	"episodeNumber": 2
}
```

Example actor object:

```
{
	"nconst": "nm0000001",
	"primaryName": "Fred Astaire",
	"birthYear": 1899,
	"deathYear": 1987,
	"primaryProfession": "soundtrack,actor,miscellaneous",
	"knownForTitles": "tt0050419,tt0053137"
}
```

## Authentication

When consuming the API via RapidAPI include these request headers:

- `X-RapidAPI-Key: <your-rapidapi-key>` — your RapidAPI subscription key.
- `X-RapidAPI-Host: moviesdatabase.p.rapidapi.com` — the host header required by RapidAPI.
- `Accept: application/json`

If you access the service via another gateway or direct provider, follow that provider's authentication instructions.

## Error Handling

The API will return standard HTTP error codes for failure cases. Typical patterns:

- 400 Bad Request — malformed parameters or invalid query values (e.g., mixing `year` with `startYear`/`endYear`).
- 401 Unauthorized — missing or invalid API key/header.
- 403 Forbidden — requests blocked by quota, or invalid subscription tier.
- 404 Not Found — requested id or resource doesn't exist.
- 429 Too Many Requests — rate limit exceeded (if provider enforces rate limits).
- 500/502/503 — server-side errors or temporary unavailability.

Handling recommendations:
- Validate parameters client-side (for example ensure `genre` is capitalized, `limit` ≤ 50).
- Retry transient server errors (5xx) with exponential backoff.
- On 429, respect `Retry-After` header (if provided) or apply exponential backoff before retrying.
- Log full request/response for debugging (avoid logging secrets).

## Usage Limits and Best Practices

- Rate limits: The provider may apply rate limits depending on your subscription (RapidAPI plans vary). If you receive 429 responses, throttle your requests and implement retry/backoff logic.
- Pagination: Use `limit` and `page` to iterate result sets and avoid requesting very large pages. Max `limit` is 50.
- Use `info` to minimize payload sizes — request `mini_info` or `base_info` for most list views, only request `extendedCast` or `awards` when needed.
- Cache stable data where appropriate (e.g., title metadata that rarely changes) and invalidate caches when you detect changes.
- For batch lookups (multiple ids) use `/x/titles-by-ids` to reduce round-trips.
- Use the `title/utils/*` endpoints to validate allowed `titleType`, `genre`, and `list` values.
- Treat `akas` searches as case-sensitive and use `exact=true` for deterministic matches when required.

If you'd like, I can now generate one of the following extras: an OpenAPI (Swagger) specification, a Postman collection, or a small client SDK (Node.js or Python) that wraps the most-used endpoints. Tell me which and I'll implement it next.
 