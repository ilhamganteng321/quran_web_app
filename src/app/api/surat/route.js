import { NextResponse } from "next/server";
import { getDatabase } from "../../../../lib/database";

export async function GET(req) {
  try {
    const db = getDatabase();
    const surat = db.prepare('SELECT * FROM m_quran_t GROUP BY no_surat ORDER BY no_surat').all();
    
    return new NextResponse(
        JSON.stringify(surat),
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