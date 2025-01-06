import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

interface RouteContext {
  params: {
    flowId: string;
  };
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const flowId =  await params.flowId;
    const updatedFlow = await request.json();

    if (updatedFlow._id) {
      delete updatedFlow._id;
    }

    const client = await clientPromise;
    const db = client.db("flowmaster");

    // e.g. If your doc has { "id": "1736112661794" } 
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
