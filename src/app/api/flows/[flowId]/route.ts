import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: { flowId: string } }) {
  try {
    const { flowId } = params;
    const updatedFlow = await request.json();

    if (updatedFlow._id) {
      delete updatedFlow._id;
    }

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
      message: `Flow ${flowId} updated successfully.`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PUT /api/flows/[flowId] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

