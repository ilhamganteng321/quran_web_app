import { NextResponse } from "next/server";
import { getDatabase } from "../../../../../lib/database";

export async function GET(request, { params }) {
  const { no_surat } = params; // ✅ ambil dari params, bukan req.params

  try {
    const db = getDatabase();

    const surat = db
      .prepare("SELECT * FROM m_surat_t WHERE no_surat = ? ORDER BY no_ayat")
      .all(no_surat);

    const infoSurat = db
      .prepare("SELECT * FROM m_quran_t WHERE no_surat = ?")
      .get(no_surat);

    return NextResponse.json(
      { infoSurat, ayat: surat },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
