import { NextResponse } from "next/server"

export async function Post(req) {
    return NextResponse.json({ body: await req.json() })
}