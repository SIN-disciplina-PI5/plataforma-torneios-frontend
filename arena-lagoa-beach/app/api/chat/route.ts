import { NextRequest, NextResponse } from "next/server";

const HF_API_URL = "https://gabssiin-lagoa-ai-2.hf.space/api/chat";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pergunta, session_id } = body;

    if (!pergunta?.trim()) {
      return NextResponse.json(
        { error: "Campo 'pergunta' é obrigatório." },
        { status: 400 }
      );
    }

    // JWT enviado pelo frontend — o mesmo usado para o login Node.js
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Não autenticado. Faça login para usar o chat." },
        { status: 401 }
      );
    }

    const hfResponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader, // repassa o JWT do usuário
      },
      body: JSON.stringify({
        pergunta: pergunta.trim(),
        session_id: session_id || "default",
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error(`[chat/route] HF ${hfResponse.status}:`, errorText);

      if (hfResponse.status === 401) {
        return NextResponse.json(
          { error: "Sessão expirada. Faça login novamente." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Erro ao consultar a IA. Tente novamente." },
        { status: hfResponse.status }
      );
    }

    const data = await hfResponse.json();

    return NextResponse.json({
      resposta: data.resposta ?? data.response ?? data.answer ?? String(data),
      session_id: session_id || "default",
    });
  } catch (err) {
    console.error("[chat/route] Erro interno:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}