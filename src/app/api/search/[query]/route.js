import { NextResponse } from "next/server";
import { getDatabase } from "../../../../../lib/database";

export async function GET(req, { params }) {
  const { query } = params;
  
  try {
    const db = getDatabase();
    const results = db.prepare(`
      SELECT * FROM m_surat_t 
      WHERE arab LIKE ? OR tafsir LIKE ?
      ORDER BY no_surat, no_ayat
    `).all(`%${params.query}%`, `%${params.query}%`);
    
    return new NextResponse(
        JSON.stringify(results),
        {
            status: 200,
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
  } catch (error) {
    return new Response(
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