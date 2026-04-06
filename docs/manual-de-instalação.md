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
python fetch.py
```
## Backend
#### Crie um novo terminal e acesse a pasta:
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
#### Crie um novo terminal e acesse a pasta:
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