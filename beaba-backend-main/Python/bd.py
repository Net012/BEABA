from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

user = "postgres"
password = "postgres"
host = "localhost"
database = "beaba"
port = "5432"

connection_string = f'postgresql://{user}:{password}@{host}:{port}/{database}'

engine = create_engine(connection_string)

Session = sessionmaker(bind=engine)
session = Session()

def insertUpload(nome, userId, templateId, extensaoId, squadId, diretorio):
    dataEnvio = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with Session() as session:
        query = text('INSERT INTO uploads ("nome", "data_envio", "usuarioId", "templateId", "extensaoId", "squadId", "diretorio") VALUES (:nome, :data_envio, :usuarioId, :templateId, :extensaoId, :squadId, :diretorio)')
        
        session.execute(query, {
            'nome': nome,
            'data_envio': dataEnvio,
            'usuarioId': userId,
            'templateId': templateId,
            'extensaoId': extensaoId,
            'squadId': squadId,
            'diretorio': diretorio
        })

        session.commit()