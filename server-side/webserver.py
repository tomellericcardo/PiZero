# -*- coding: utf-8 -*-

from flask import Flask, g, send_from_directory, request
from zero import Zero
from camera import GIF, TimeLapse
from json import dumps

# Variabili globali
app = Flask(__name__)
zero = Zero(g)
gif = GIF(zero)
timelapse = TimeLapse(zero)


# OPERAZIONI DI SESSIONE

@app.before_request
def apri_connessione():
    zero.database.apri_connessione()

@app.teardown_request
def chiudi_connessione(exception):
    zero.database.chiudi_connessione()


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

# Anteprima e Galleria
@app.route('/img/<cartella>/<nome_file>')
def invia_elemento(cartella, nome_file):
    return send_from_directory('../client-side/img/' + cartella + '/', nome_file)


# CONTESTI


# Controllo elemento completo
@app.route('/elemento_completo', methods = ['POST'])
def elemento_completo():
    return dumps({'tipo': zero.completo})

# Controllo camera occupata
@app.route('/camera_occupata', methods = ['POST'])
def camera_occupata():
    return dumps({'tipo': zero.occupato})

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
@app.route('/interrompi_video', methods = ['POST'])
def interrompi_video():
    zero.interrompi_video()
    return dumps({'success': True})

# Scatto della GIF
@app.route('/scatta_gif', methods = ['POST'])
def scatta_gif():
    gif.start()
    return dumps({'success': True})

# Lettura dello stato della GIF
@app.route('/stato_gif', methods = ['POST'])
def stato_gif():
    return dumps({'stato': gif.stato})

# Interruzione della GIF
@app.route('/interrompi_gif', methods = ['POST'])
def interrompi_gif():
    gif.stop = True
    return dumps({'success': True})

# Registrazione time lapse
@app.route('/timelapse_video', methods = ['POST'])
def timelapse_video():
    timelapse.start()
    return dumps({'success': True})

# Lettura dello stato del time lapse
@app.route('/stato_timelapse', methods = ['POST'])
def stato_timelapse():
    return dumps({'stato': timelapse.stato})

# Interruzione time lapse
@app.route('/interrompi_timelapse', methods = ['POST'])
def interrompi_timelapse():
    timelapse.stop = True
    return dumps({'success': True})

# Registrazione slow motion
@app.route('/registra_slowmotion', methods = ['POST'])
def registra_slowmotion():
    zero.registra_slowmotion()
    return dumps({'success': True})

# Interruzione slow motion
@app.route('/interrompi_slowmotion', methods = ['POST'])
def interrompi_slowmotion():
    zero.interrompi_slowmotion()
    return dumps({'success': True})

# Salvataggio dell'elemento
@app.route('/salva_elemento', methods = ['POST'])
def salva_elemento():
    richiesta = request.get_json(force = True)
    tipo = richiesta['tipo']
    id_elemento = richiesta['id']
    zero.salva_elemento(tipo, id_elemento)
    return dumps({'success': True})

# Scarto dell'elemento
@app.route('/scarta_elemento', methods = ['POST'])
def scarta_elemento():
    zero.scarta_elemento()
    return dumps({'success': True})

# Lettura della galleria
@app.route('/leggi_galleria', methods = ['POST'])
def leggi_galleria():
    return dumps({'elementi': zero.leggi_galleria()})

# Lettura statistiche dashboard
@app.route('/leggi_statistiche', methods = ['POST'])
def leggi_statistiche():
    return dumps(zero.leggi_statistiche())

# Riavvio dispositivo
@app.route('/riavvia', methods = ['POST'])
def riavvia():
    zero.riavvia()
    return dumps({'success': True})

# Arresto dispositivo
@app.route('/spegni', methods = ['POST'])
def spegni():
    zero.spegni()
    return dumps({'success': True})


# AVVIO SERVER

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 80, threaded = True)
