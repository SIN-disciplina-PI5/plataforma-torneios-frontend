#!/bin/bash
set -e

echo "Instalando dependências..."
pip install -r requirements.txt

echo "Gerando embeddings..."
python -m services.gerar_embeddings

echo "Build concluído!"