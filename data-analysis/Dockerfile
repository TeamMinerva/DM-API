# Usa uma imagem leve do Python
FROM python:3.11-slim

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo de dependências e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o resto dos arquivos (incluindo o fetch.py)
COPY . .

# Comando que será executado ao iniciar o contêiner
CMD ["python", "fetch.py"]  