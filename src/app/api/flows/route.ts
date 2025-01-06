import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(req: NextRequest) {
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

export async function PUT(request: NextRequest, { params }: { params: { flowId: string } }) {
  try {
    const flowId = params.flowId;
    const updatedFlow = await request.json();

    const client = await clientPromise;
    const db = client.db("flowmaster");

    const result = await db
      .collection("flows")
      .updateOne({ id: flowId }, { $set: updatedFlow });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: `Flow ${flowId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Flow ${flowId} updated.`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PUT /api/flows/[flowId] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
