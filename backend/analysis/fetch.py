import pandas as pd
import datetime
import requests

current_date = str(datetime.datetime.now()).split("-")[0]
current_date = str(int(current_date)-1)

url = f"https://www.bcb.gov.br/pda/desig/scrdata_{current_date}.zip"
filename = f"./data-analysis/scrdata_{current_date}.zip"

def baixar_arquivo(link):
  with requests.get(url, stream=True) as r:
    r.raise_for_status() # Se der erro fecha automaticamente
    with open(filename, "wb") as f:
      for chunk in r.iter_content(chunk_size=8192):
        f.write(chunk)

baixar_arquivo(url)