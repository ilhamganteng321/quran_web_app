import { NextResponse } from "next/server";
import { getDatabase } from "../../../../../../lib/database";

export async function GET(req, { params }) {
  const { no_surat, no_ayat } = params;
  
  try {
    const db = getDatabase();
    const ayat = db.prepare('SELECT * FROM m_surat_t WHERE no_surat = ? AND no_ayat = ?').get(params.no_surat, params.no_ayat);
    const footer = db.prepare('SELECT * FROM d_footer_t WHERE no_surat = ? AND no_ayat = ?').all(params.no_surat, params.no_ayat);
    const pilihan = db.prepare('SELECT * FROM d_pilihan_t WHERE no_surat = ? AND no_ayat = ?').all(params.no_surat, params.no_ayat);
    
    return new NextResponse(
        JSON.stringify({ ayat, footer, pilihan }),
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