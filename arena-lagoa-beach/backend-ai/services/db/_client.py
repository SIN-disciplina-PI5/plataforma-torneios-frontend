import httpx
from datetime import datetime

BASE_URL = "https://plataforma-torneios-backend.vercel.app"
TIMEOUT  = 10.0

# Prefixos das rotas — conforme app.js: app.use("/api", routes)
R = {
    "usuario":         "/api/users",
    "torneio":         "/api/torneio",
    "partida":         "/api/partidas",
    "partida_usuario": "/api/partida-usuarios",
    "inscricao":       "/api/inscricoes",
    "equipe":          "/api/equipe",
    "equipe_usuario":  "/api/equipe-usuarios",
}


async def get(endpoint: str, token: str) -> dict | list | None:
    """GET autenticado no backend Node. Retorna None em caso de erro."""
    headers = {"Authorization": f"Bearer {token}"}
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.get(f"{BASE_URL}{endpoint}", headers=headers)
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as e:
        print(f"[db] HTTP {e.response.status_code} em {endpoint}")
        return None
    except Exception as e:
        print(f"[db] Erro em {endpoint}: {e}")
        return None


def fmt_data(iso: str | None) -> str:
    if not iso:
        return "—"
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return dt.strftime("%d/%m/%Y %H:%M")
    except Exception:
        return iso


def fmt_fase(fase: str) -> str:
    return {
        "OITAVAS_DE_FINAL": "Oitavas de final",
        "QUARTAS_DE_FINAL": "Quartas de final",
        "SEMI_FINAL":       "Semifinal",
        "FINAL":            "Final",
    }.get(fase, fase)


def parse_dt(iso: str | None):
    if not iso:
        return None
    try:
        return datetime.fromisoformat(iso.replace("Z", "+00:00"))
    except Exception:
        return None