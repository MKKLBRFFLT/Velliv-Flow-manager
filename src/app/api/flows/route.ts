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

  export async function GET() {
    try {
      const client = await clientPromise;
      const db = client.db("flowmaster");
      const flows = await db.collection("flows").find().toArray();
  
      return NextResponse.json({ flows });
    } catch (error) {
      console.error("[GET /api/flows] error:", error);
      return NextResponse.json({ error: error.toString() }, { status: 500 });
    }
  }

  