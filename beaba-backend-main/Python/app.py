from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
from bd import insertUpload
import requests
import plotly.graph_objects as go
import os
import xlwt
from datetime import datetime, timedelta, date

app = Flask(__name__)
CORS(app)


@app.route('/upload', methods=['POST'])
def upload_file():

    arquivo = request.files['arquivo']

    nomeArquivo = request.form['nomeArquivo']

    extensaoArquivo = request.form['extensao']

    templateId = request.form['templateId']

    usuarioId = request.form['usuarioId']

    extensaoId = request.form['extensaoId']

    squadId = request.form['squadId']

    diretorio = request.form['diretorio']

    if diretorio == '1':
        diretorio = "Vendas"

    elif diretorio == '2':
        diretorio = "Estoque"

    elif diretorio == '3':
        diretorio = "Backups"

    print(diretorio)

    if extensaoArquivo == 'csv' or extensaoArquivo == 'xls' or extensaoArquivo == 'xlsx':

        arquivo.save(f'{diretorio}/{nomeArquivo}')

        insertUpload(nomeArquivo, usuarioId, templateId,
                     extensaoId, squadId, diretorio)

    else:
        return jsonify({'message': 'Extensão não suportada!'})

    return jsonify({'message': 'Arquivo recebido e processado com sucesso!'})


@app.route('/graficos/grafico1/<squadId>', methods=['GET'])
def grafico1(squadId):

    squad = squadId

    caminho_arquivo = 'grafico1.html'

    if os.path.exists(caminho_arquivo):
        os.remove(caminho_arquivo)

    url = f'http://localhost:3300/uploads/squad/{squad}'
    response = requests.get(url)
    dados = response.json()
    dados = dados['data']

    contagem_csv = 0
    contagem_xls = 0
    contagem_xlsx = 0

    for item in dados:
        extensao = item.get('extensaoId', None)
        if extensao == 1:
            contagem_csv += 1
        elif extensao == 2:
            contagem_xls += 1
        elif extensao == 3:
            contagem_xlsx += 1

    extensoes = ['csv', 'xls', 'xlsx']
    contagens = [contagem_csv, contagem_xls, contagem_xlsx]

    fig_bar = go.Figure(data=[go.Bar(x=extensoes, y=contagens)])
    fig_bar.update_layout(
        title='Arquivos por extensão',
        margin=dict(t=35, b=35, l=10, r=10),
    )
    fig_bar.write_html('grafico1.html')

    if not os.path.exists(caminho_arquivo):
        return "Arquivo não encontrado", 404

    with open(caminho_arquivo, 'rb') as arquivo:
        conteudo_html = arquivo.read()

    return conteudo_html, 200, {'Content-Type': 'text/html'}


@app.route('/graficos/grafico2/<squadId>', methods=['GET'])
def grafico2(squadId):
    squad = squadId

    caminho_arquivo = 'grafico2.html'

    if os.path.exists(caminho_arquivo):
        os.remove(caminho_arquivo)

    url = f'http://localhost:3300/uploads/squad/{squad}'
    response = requests.get(url)
    dados = response.json()
    dados = dados['data']

    data_atual = date.today()
    data_limite = data_atual - timedelta(days=7)

    dados_7_dias = []

    for item in dados:
        data_envio = datetime.strptime(
            item['data_envio'][:10], '%Y-%m-%d').date()
        if data_limite <= data_envio <= data_atual:
            dados_7_dias.append(data_envio)

    contagem_envios_por_dia = {}

    for data in dados_7_dias:
        if data in contagem_envios_por_dia:
            contagem_envios_por_dia[data] += 1
        else:
            contagem_envios_por_dia[data] = 1

    datas_ordenadas = sorted(contagem_envios_por_dia.keys())

    fig_line = go.Figure(data=[go.Scatter(x=[data.strftime('%Y-%m-%d') for data in datas_ordenadas], y=[
        contagem_envios_por_dia[data] for data in datas_ordenadas], mode='lines+markers')])
    fig_line.update_layout(
        title='Envios nos últimos 7 dias',
        xaxis_title='Data de Envio',
        yaxis_title='Número de Envios',
        margin=dict(t=25, b=25, l=10, r=10),
        xaxis=dict(type='category', categoryorder='category ascending')
    )

    fig_line.write_html('grafico2.html')

    if not os.path.exists(caminho_arquivo):
        return "Arquivo não encontrado", 404

    with open(caminho_arquivo, 'rb') as arquivo:
        conteudo_html = arquivo.read()

    return conteudo_html, 200, {'Content-Type': 'text/html'}


@app.route('/download/<templateId>/<extensaoId>', methods=['GET'])
def criarPlanilha(templateId, extensaoId):

    requestCamposTemplates = requests.get(
        f'http://localhost:3300/templatesCampos/{templateId}')

    CamposTemplatesResponse = requestCamposTemplates.json()

    requestCampos = requests.get(f'http://localhost:3300/campos')

    CamposResponse = requestCampos.json()

    Campos = []

    for item in CamposTemplatesResponse:
        for campo in CamposResponse:
            if item['campoId'] == campo['id']:
                Campos.append(campo['nome'])

    data = {campo: [] for campo in Campos}

    Dataframe = pd.DataFrame(data)

    filename = ""

    if extensaoId == '1':

        Dataframe.to_csv('planilha.csv', index=False, encoding='utf-8-sig')

        filename = "planilha.csv"

    elif extensaoId == '2':

        workbook = xlwt.Workbook(encoding='utf-8')

        sheet = workbook.add_sheet('Sheet 1')

        for i, coluna in enumerate(Campos):
            sheet.write(0, i, coluna)

        workbook.save('planilha.xls')

        filename = "planilha.xls"

    elif extensaoId == '3':

        Dataframe.to_excel('planilha.xlsx', index=False)

        filename = "planilha.xlsx"

    return send_file(filename, as_attachment=True)


@app.route('/upload/teste', methods=['POST'])
def teste():

    nome = request.json['nome']

    extensaoId = request.json['extensaoId']

    templateId = request.json['templateId']

    squadId = request.json['squadId']

    diretorio = request.json['diretorio']

    userId = request.json['usuarioId']

    dataEnvio = request.json['data_envio']

    insertUpload(nome, userId, templateId, extensaoId,
                 squadId, diretorio, dataEnvio)

    return jsonify({'message': 'Arquivo recebido e processado com sucesso!'})


@app.route('/arquivos/download/<diretorio>/<nomeArquivo>', methods=['GET'])
def download(diretorio, nomeArquivo):

    arquivo = os.path.join(diretorio, nomeArquivo)

    if not os.path.isfile(arquivo):
        return jsonify({'message': 'Arquivo não encontrado!'}), 404

    return send_file(arquivo, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
