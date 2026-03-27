# Pré-requisitos
- Node.js (versão 18 ou superior)
- Python (versão 3.10 ou superior)
# Manual de instalação
## Data-anlysis
#### Acesse a pasta no terminal:
```
cd data-analysis
```
#### Crie um ambiente virtual python:
```
python -m venv venv
```
#### Ative o ambiente virtual:
Windows:
```
venv/Scripts/activate
```
Linux / Mac:
```
source venv/bin/activate
```
#### Instale dependências Python:
```
pip install -r requirements.txt
```
#### Crie o banco de dados:
```
python etl/fetch.py
```
## Backend
#### Volte a pasta do projeto:
```
cd ..
```
#### Acesse a pasta no terminal:
```
cd backend
```
#### Instale dependências:
```
npm install
```
#### Execute o servidor:
```
npm run dev
```
## Frontend
#### Volte a pasta do projeto:
```
cd ..
```
#### Acesse a pasta no terminal:
```
cd frontend
```
#### Instale dependências:
```
npm install
```
#### Execute o servidor:
```
npm run dev
```