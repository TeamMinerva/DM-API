import os
import pandas as pd
import datetime
import requests
import zipfile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

current_date = str(int(str(datetime.datetime.now()).split("-")[0]) - 1)

url = f"https://www.bcb.gov.br/pda/desig/scrdata_{current_date}.zip"
filename = os.path.join(BASE_DIR, f"scrdata_{current_date}.zip")

def baixar_arquivo(link):
    os.makedirs(BASE_DIR, exist_ok=True)
    with requests.get(link, stream=True) as r:
        r.raise_for_status()
        with open(filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

baixar_arquivo(url)

dfs = []

with zipfile.ZipFile(filename) as zf:
    for nome in zf.namelist():
        with zf.open(nome) as file:
            df = pd.read_csv(file, sep=";")
            df_filtrado = df[["data_base", "uf", "numero_de_operacoes", "carteira_ativa", "carteira_inadimplencia", "ativo_problematico", "porte", "cliente"]]

            df_filtrado = df_filtrado.assign(
                data_base=pd.to_datetime(df_filtrado["data_base"]),
                carteira_ativa=pd.to_numeric(df_filtrado["carteira_ativa"].astype(str).str.replace(",", ".", regex=False), errors="coerce"),
                carteira_inadimplencia=pd.to_numeric(df_filtrado["carteira_inadimplencia"].astype(str).str.replace(",", ".", regex=False), errors="coerce"),
                ativo_problematico=pd.to_numeric(df_filtrado["ativo_problematico"].astype(str).str.replace(",", ".", regex=False), errors="coerce"),
            )
            dfs.append(df_filtrado)

df_final = pd.concat(dfs, ignore_index=True)
