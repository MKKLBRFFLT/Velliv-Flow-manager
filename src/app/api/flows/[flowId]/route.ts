import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

interface RouteContext {
  params: { flowId: string }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { flowId } = params;
    const updatedFlow = await request.json();

    const client = await clientPromise;
    const db = client.db("flowmaster");

    const result = await db.collection("flows").updateOne(
      { id: flowId },
      { $set: updatedFlow }
    );

    return NextResponse.json({
      message: "Flow updated successfully.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PUT /api/flows/[flowId] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
