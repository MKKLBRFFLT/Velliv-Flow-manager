import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(req: Request) {
    try {
      const client = await clientPromise;
      const db = client.db("flowmaster");
  
      const newFlow = await req.json();
      const result = await db.collection("flows").insertOne(newFlow);
  
      return NextResponse.json({
        message: "Flow inserted successfully into 'flowmaster.flows'.",
        insertedId: result.insertedId,
      });
    } catch (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
  }