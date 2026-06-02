import os
import glob
from pypdf import PdfReader

PDF_FOLDER = "pdfs"
TXT_FOLDER = "base_conhecimento"

def extrair_textos_pdfs():
    os.makedirs(PDF_FOLDER, exist_ok=True)
    os.makedirs(TXT_FOLDER, exist_ok=True)

    pdf_paths = glob.glob(os.path.join(PDF_FOLDER, "*.pdf"))

    if not pdf_paths:
        print(f"Nenhum PDF encontrado em '{PDF_FOLDER}'")
        return False

    for pdf_path in pdf_paths:
        print(f"Lendo: {pdf_path}")
        reader = PdfReader(pdf_path)

        texto_completo = ""
        for page in reader.pages:
            texto_completo += page.extract_text() or ""

        nome_base = os.path.splitext(os.path.basename(pdf_path))[0]
        txt_path = os.path.join(TXT_FOLDER, f"{nome_base}.txt")

        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(texto_completo)

        print(f"Salvo: {txt_path}")

    print(f"{len(pdf_paths)} PDF(s) convertido(s) para TXT em '{TXT_FOLDER}'")
    return True

if __name__ == "__main__":
    extrair_textos_pdfs()