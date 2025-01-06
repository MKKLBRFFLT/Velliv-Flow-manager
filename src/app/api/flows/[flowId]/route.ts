import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: { flowId: string } }) {
  try {
    // Hent flowId fra params
    const flowId = params.flowId;

    // Læs og valider JSON-indhold fra requesten
    const updatedFlow = await request.json();

    // Fjern _id for at undgå MongoDB-konflikter
    if (updatedFlow._id) {
      delete updatedFlow._id;
    }

    const client = await clientPromise;
    const db = client.db("flowmaster");

    // Opdater flowet i databasen
    const result = await db
      .collection("flows")
      .updateOne({ id: flowId }, { $set: updatedFlow });

    // Tjek, om opdateringen blev udført
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: `Flow med ID ${flowId} blev ikke fundet.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Flow med ID ${flowId} blev opdateret.`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Fejl i PUT /api/flows/[flowId]:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
