import { MoviesProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", ["POST"]);
    return response.status(405).end(`Method ${request.method} Not Allowed in here`);
  }

  const { year, page, genre } = request.body ?? {};
  const date = new Date();

  if (!process.env.MOVIE_API_KEY) {
    console.error("Missing MOVIE_API_KEY env variable");
    return response.status(500).json({ error: "Server misconfiguration: MOVIE_API_KEY is missing" });
  }

  try {
    // Log presence of the key with a masked prefix to help debug env loading (will not reveal the secret)
    console.log(
      'MOVIE_API_KEY present:',
      !!process.env.MOVIE_API_KEY,
      'maskedPrefix:',
      process.env.MOVIE_API_KEY ? process.env.MOVIE_API_KEY.slice(0, 4).replace(/./g, '*') + '...' : null
    );
    const params = new URLSearchParams();
    params.set("year", String(year || date.getFullYear()));
    params.set("sort", "year.decr");
    params.set("limit", "12");
    params.set("page", String(page ?? 1));
    if (genre) params.set("genre", String(genre));

    const url = `https://moviesdatabase.p.rapidapi.com/titles?${params.toString()}`;

    const resp = await fetch(url, {
      headers: {
        "x-rapidapi-host": "moviesdatabase.p.rapidapi.com",
        "x-rapidapi-key": process.env.MOVIE_API_KEY,
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Failed to fetch movies", resp.status, text);
      return response.status(resp.status).json({ error: "Failed to fetch movies", details: text });
    }

    const moviesResponse = await resp.json();
    const movies: MoviesProps[] = moviesResponse.results ?? [];

    return response.status(200).json({ movies });
  } catch (err: unknown) {
    // Narrow unknown to extract a useful message without using `any`.
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error in /api/fetch-movies:", message);
    return response.status(500).json({ error: "Internal server error", details: message });
  }
}
