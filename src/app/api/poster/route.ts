import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const posterSchema = z.object({
  analysis: z.any(),
  template: z.enum(["minimal", "bold-neon", "investor-memo", "meme", "dark-glass"]),
  includeReceipts: z.boolean().default(true),
  showWatermark: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = posterSchema.parse(body);

    // For MVP, poster generation is client-side
    // This endpoint can be used for server-side rendering later
    return NextResponse.json({
      success: true,
      message: "Poster generation handled client-side",
      config: validated,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate poster" },
      { status: 500 }
    );
  }
}
