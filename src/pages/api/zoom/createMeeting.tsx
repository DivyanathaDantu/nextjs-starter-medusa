import { NextRequest, NextResponse } from "next/server";
import createMeting from "@modules/zoom-api/createZoomMeeting";

export default async function handler(req: NextRequest, res: NextResponse) {
    const filteredRes = await Promise.resolve(createMeting())
    console.log(`Final Result in API ${filteredRes}`)
    res.status(200).json(filteredRes);
  }