import os
import datetime
import requests
import pandas as pd
import zipfile
from sqlalchemy import create_engine

# helpers

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "bd", "dados.db")


# baixa o arquivo ZIP do SCR do ano anterior diretamente do Banco Central.
# o ano é calculado dinamicamente para não precisar atualizar o código manualmente.
# o download é feito em chunks de 8KB para não sobrecarregar a memória.
# alteração: adicionado BASE_DIR para garantir que o ZIP seja salvo
# sempre na mesma pasta do script, independente de onde ele for executado.

def baixar_zip():
    ano_anterior = datetime.datetime.now().year - 1
    url = f"https://www.bcb.gov.br/pda/desig/scrdata_{ano_anterior}.zip"
    filename = os.path.join(BASE_DIR, f"scrdata_{ano_anterior}.zip")

    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

    return filename

# lê todos os CSVs dentro do zip do BCB, filtrando apenas as colunas necessárias.
# converte data_base para datetime e as colunas numéricas de string com vírgula para float.
# concatena todos os meses em um único DataFrame e libera a lista intermediária da memória.
# remove registros com porte indisponível e substitui numero_de_operacoes = -1 por NaN.
# alteração: leitura e limpeza unificadas em uma única função para facilitar a leitura.

def carregar_dados(filename):
    colunas = [
        "data_base", "uf", "numero_de_operacoes",
        "carteira_ativa", "carteira_inadimplencia",
        "ativo_problematico", "porte", "cliente",
    ]

    colunas_numericas = [
        "carteira_ativa",
        "carteira_inadimplencia",
        "ativo_problematico",
    ]

    dfs = []

    with zipfile.ZipFile(filename) as zf:
        for nome in zf.namelist():
            with zf.open(nome) as file:
                df = pd.read_csv(file, sep=";", usecols=colunas)
                dfs.append(
                    df.assign(
                        data_base=pd.to_datetime(df["data_base"]),
                        **{
                            col: pd.to_numeric(
                                df[col].astype(str).str.replace(",", ".", regex=False),
                                errors="coerce",
                            )
                            for col in colunas_numericas
                        }
                    )
                )

    dt = pd.concat(dfs, ignore_index=True)
    del dfs

    dt = dt[dt["porte"] != "Indisponível"].reset_index(drop=True)
    dt["numero_de_operacoes"] = dt["numero_de_operacoes"].replace(-1, pd.NA)

    return dt

# remove o arquivo ZIP após a extração dos dados,
# pois ele não é mais necessário e ocupa espaço em disco.

def apagar_zip(filename):
    os.remove(filename)

# cria a conexão com o banco de dados SQLite.
# o DB_PATH sobe um nível a partir do script e entra na pasta bd.
# o create_engine não abre a conexão imediatamente — ela só é aberta
# quando realmente necessário, como no momento do .to_sql().

def conectar_banco():
    engine = create_engine(f"sqlite:///{DB_PATH}")
    return engine

# insere o DataFrame no banco de dados na tabela dados_bcb.
# if_exists="replace" recria a tabela a cada execução, mantendo os dados atualizados.
# index=False evita que o índice do DataFrame vire uma coluna desnecessária no banco.

def inserir_dados(dt,engine):
    dt.to_sql("dados_bcb", engine, if_exists="replace", index=False)
    

# execucao das funcoes

filename = baixar_zip()
dt = carregar_dados(filename)
engine = conectar_banco()
inserir_dados(dt, engine)
apagar_zip(filename)