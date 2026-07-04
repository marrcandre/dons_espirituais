#!/usr/bin/env python3
"""
Script de importação dos dados históricos do Google Forms → Supabase.

Lê a planilha XLSX legada e insere as respostas
na tabela `responses` do Supabase com user_id = NULL.

Preserva:
- created_at (Carimbo de data/hora)
- email (Endereço de e-mail)
- gp (GP (nome apascentador))
- age (Idade)

Uso:
  pip install supabase openpyxl pandas
  python import_to_supabase.py

Variáveis de ambiente obrigatórias:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
"""

import os
import sys

import pandas as pd
from supabase import create_client

XLSX_PATH = os.path.join(
    os.path.dirname(__file__),
    "../legacy/OFICIAL DESCUBRA SEUS DONS ESPIRITUAIS (respostas).xlsx"
)

GIFT_NAMES = [
  "Profecia",
  "Pastoreio",
  "Ensino",
  "Sabedoria",
  "Conhecimento",
  "Exortação",
  "Discernimento de Espíritos",
  "Contribuição",
  "Socorro",
  "Misericórdia",
  "Evangelismo Transcultural",
  "Evangelista",
  "Hospitalidade",
  "Fé",
  "Liderança",
  "Administração",
  "Milagres",
  "Cura",
  "Línguas",
  "Interpretação de Línguas",
  "Simplicidade Voluntária",
  "Celibato",
  "Intercessão",
  "Libertação",
  "Serviço",
  "Apóstolo",
  "Liderança em Adoração",
]


def load_participants():
    """
    Cria um mapa:
    nome -> dados do participante
    """

    responses_df = pd.read_excel(
        XLSX_PATH,
        sheet_name='Respostas ao formulário 1',
        header=1
    )

    participants = {}

    for _, row in responses_df.iterrows():
        try:
            name = str(row['Nome e sobrenome']).strip()

            if not name or name.lower() == 'nan':
                continue

            timestamp = pd.to_datetime(
                row['Carimbo de data/hora'],
                errors='coerce'
            )

            email = row.get('Endereço de e-mail')
            gp = row.get('GP (nome apascentador)')
            age = row.get('Idade')

            participants[name] = {
                'created_at': timestamp,
                'email': None if pd.isna(email) else str(email).strip(),
                'gp': None if pd.isna(gp) else str(gp).strip(),
                'age': None if pd.isna(age) else int(age),
            }

        except Exception as e:
            print(f'⚠ Erro ao processar participante: {e}')

    return participants


def main():
    # Carrega .env da raiz se as variáveis não estiverem definidas
    if not os.environ.get('SUPABASE_URL') or not os.environ.get('SUPABASE_SERVICE_ROLE_KEY'):
        env_path = os.path.join(os.path.dirname(__file__), '../.env')
        if os.path.exists(env_path):
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith('#'):
                        continue
                    parts = line.split('=', 1)
                    if len(parts) == 2:
                        key = parts[0].strip()
                        value = parts[1].strip().strip('"').strip("'")
                        os.environ[key] = value

    supabase_url = os.environ.get('SUPABASE_URL')
    service_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

    if not supabase_url or not service_key:
        print(
            'Erro: defina SUPABASE_URL e '
            'SUPABASE_SERVICE_ROLE_KEY no arquivo .env na raiz do projeto.'
        )
        sys.exit(1)

    client = create_client(
        supabase_url,
        service_key
    )

    try:
        participants = load_participants()
        print(
            f'✓ Participantes carregados: '
            f'{len(participants)}'
        )
    except Exception as e:
        print(
            f'Erro ao carregar participantes: {e}'
        )
        sys.exit(1)

    try:
        df = pd.read_excel(
            XLSX_PATH,
            sheet_name='Tabulados'
        )
    except Exception as e:
        print(f'Erro ao ler XLSX: {e}')
        sys.exit(1)

    df = df.dropna(subset=[df.columns[0]])

    inserted = 0
    errors = 0
    skipped = 0

    for _, row in df.iterrows():

        name = str(row.iloc[0]).strip()

        if not name or name.lower() == 'nan':
            continue

        # Ignora linhas de resumo/cabeçalho
        if name in ('Media', 'Dons'):
            continue

        participant = participants.get(name)

        if participant is None:
            skipped += 1
            print(f'⚠ Não encontrado: {name}')
            continue

        timestamp = participant['created_at']

        if timestamp is None or pd.isna(timestamp):
            skipped += 1
            print(f'⚠ Sem timestamp: {name}')
            continue

        scores = {}

        for i, gift_name in enumerate(GIFT_NAMES):
            try:
                score = int(row.iloc[i + 1])
                scores[i] = max(
                    0,
                    min(15, score)
                )
            except (
                ValueError,
                TypeError,
                IndexError
            ):
                scores[i] = 0

        payload = {
            'user_id': None,
            'name': name,
            'email': participant['email'],
            'gp': participant['gp'],
            'age': participant['age'],
            'question_order': None,
            'answers': None,
            'scores': scores,
            'ai_analysis': None,
            'email_sent': False,
            'is_public': False,
            'created_at': timestamp.isoformat(),
        }

        try:
            result = (
                client
                .table('responses')
                .insert(payload)
                .execute()
            )

            if result.data:
                inserted += 1

                print(
                    f'✓ {name}'
                    f' | {participant["email"]}'
                    f' | {participant["gp"]}'
                    f' | {participant["age"]}'
                )
            else:
                errors += 1
                print(f'✗ {name} — {result}')

        except Exception as e:
            errors += 1
            print(f'✗ {name} — {e}')

    print('\n' + '=' * 60)
    print(f'Inseridos: {inserted}')
    print(f'Ignorados: {skipped}')
    print(f'Erros: {errors}')
    print('=' * 60)


if __name__ == '__main__':
    main()