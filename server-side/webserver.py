# -*- coding: utf-8 -*-

from flask import Flask, g, send_from_directory, request
from zero import Zero
from json import dumps


app = Flask(__name__)
zero = Zero(g)


# OPERAZIONI DI SESSIONE

@app.before_request
def apri_connessione():
    zero.manager.apri_connessione()

@app.teardown_request
def chiudi_connessione(exception):
    zero.manager.chiudi_connessione()


# INVIO DI FILE

# Home
@app.route('/')
def home():
    return send_from_directory('../client-side/html/', 'home.html')

# Pagina
@app.route('/<pagina>')
def pagina(pagina):
    nome_file = pagina + '.html'
    return send_from_directory('../client-side/html/', nome_file)

# File
@app.route('/<cartella>/<nome_file>')
def invia_file(cartella, nome_file):
    percorso = '../client-side/' + cartella + '/'
    return send_from_directory(percorso, nome_file)

# Elemento
@app.route('/img/album/<nome_file>')
def invia_elemento(nome_file):
    return send_from_directory('../client-side/img/album/', nome_file)


# CONTESTI

# Riavvio
@app.route('/riavvia', methods = ['POST'])
def riavvia():
    zero.riavvia()
    return dumps({'success': True})

# Arresto
@app.route('/spegni', methods = ['POST'])
def spegni():
    zero.spegni()
    return dumps({'success': True})

# Scatto della foto
@app.route('/scatta_foto', methods = ['POST'])
def scatta_foto():
    zero.scatta_foto()
    return dumps({'success': True})

# Registrazione del video
@app.route('/registra_video', methods = ['POST'])
def registra_video():
    zero.registra_video()
    return dumps({'success': True})

# Interruzione del video
@app.route('/stop_video', methods = ['POST'])
def stop_video():
    zero.stop_video()
    return dumps({'success': True})

# Salvataggio dell'elemento
@app.route('/salva', methods = ['POST'])
def salva():
    richiesta = request.get_json(force = True)
    tipo = richiesta['tipo']
    id_elemento = richiesta['id']
    zero.salva(tipo, id_elemento)
    return dumps({'success': True})

# Lettura della galleria
@app.route('/leggi_galleria', methods = ['POST'])
def leggi_galleria():
    return dumps({'elementi': zero.leggi_galleria()})

# Lettura statistiche dashboard
@app.route('/leggi_statistiche', methods = ['POST'])
def leggi_statistiche():
    return dumps(zero.leggi_statistiche())


# AVVIO SERVER

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 80, threaded = True)
