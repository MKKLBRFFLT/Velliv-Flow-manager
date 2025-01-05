// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/db"; // your connection file

export async function GET() {
  try {
    // 1. Connect to MongoDB
    const client = await clientPromise;

    // 2. Access the sample_mflix database
    const db = client.db("sample_mflix");

    // 3. Query the movies collection
    //    We'll just grab one document for demonstration, or you could do a small limit
    const oneMovie = await db.collection("movies").findOne({});

    // 4. Return the result as JSON
    return NextResponse.json({
      message: "Retrieved a movie from sample_mflix.movies",
      movie: oneMovie,
    });
  } catch (error) {
    console.error("test-db GET error:", error);
    return NextResponse.json(
      { message: "Error fetching data from MongoDB", error: error.message },
      { status: 500 }
    );
  }
}
