import { NextResponse } from "next/server";
import { getDatabase } from "../../../../lib/database";

export async function GET(req) {
  try {
    const db = getDatabase();
    const juz = db.prepare('SELECT * FROM m_juz_t ORDER BY no_juz').all();
    return new NextResponse(
        JSON.stringify(juz),
        {
            status: 200,
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
  } catch (error) {
    return new NextResponse(
        JSON.stringify({ error: error.message }),
        {
            status: 500,
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
  }
}