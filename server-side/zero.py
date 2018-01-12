# -*- coding: utf-8 -*-

from database import DataBase
from picamera import PiCamera
from camera import GIF, TimeLapse
from threading import Lock
from psutil import cpu_percent, virtual_memory, disk_usage
from subprocess import call, Popen, PIPE


class Zero:
    
    # Inizializzazione della classe
    def __init__(self, g):
        self.database = DataBase(g)
        self.camera = PiCamera()
        self.lock = Lock()
        self.init_stato()
        self.timelapse = TimeLapse(self.lock, self.completo, self.occupato, self.percorso, self.camera)
        self.gif = GIF(self.lock, self.completo, self.occupato, self.percorso, self.camera)
    
    # Inizializzazione delle variabili di stato
    def init_stato(self):
        self.percorso = '/home/pi/PiZero/client-side/img/'
        self.completo = False
        self.occupato = False
        self.estensioni = {  \
            'FOTO' : '.jpg', \
            'VIDEO': '.mp4', \
            'GIF'  : '.gif', \
            'LAPSE': '.mp4', \
            'SLOW' : '.mp4'  \
        }
    
    # Scatto della foto
    def scatta_foto(self):
        self.lock.acquire()
        nome_file = self.percorso + 'temp/FOTO.jpg'
        self.camera.capture(nome_file)
        self.completo = 'FOTO'
        self.lock.release()
    
    # Registrazione del video
    def registra_video(self):
        self.lock.acquire()
        self.occupato = 'VIDEO'
        nome_file = self.percorso + 'temp/VIDEO.h264'
        self.camera.start_recording(nome_file)
    
    # Interruzione del video
    def interrompi_video(self):
        self.camera.stop_recording()
        file_h264 = self.percorso + 'temp/VIDEO.h264 '
        file_mp4 = self.percorso + 'temp/VIDEO.mp4'
        comando = 'MP4Box -add ' + file_h264 + file_mp4
        call(comando, shell = True)
        self.occupato = False
        self.completo = 'VIDEO'
        self.lock.release()
    
    # Registrazione slow motion
    def registra_slowmotion(self):
        self.lock.acquire()
        self.occupato = 'SLOW'
        self.camera.framerate = 90
        self.camera.start_recording(self.percorso + 'temp/SLOW.h264')
    
    # Interruzione slow motion
    def interrompi_slowmotion(self):
        self.camera.stop_recording()
        h264 = self.percorso + 'temp/SLOW.h264 '
        mp4 = self.percorso + 'temp/SLOW.mp4'
        comando = 'MP4Box -add ' + h264 + mp4
        call(comando, shell = True)
        self.camera.framerate = 30
        self.occupato = False
        self.completo = 'SLOW'
        self.lock.release()
    
    # Salvataggio dell'elemento
    def salva_elemento(self, tipo, id_elemento):
        self.lock.acquire()
        sorgente = self.percorso + 'temp/' + tipo + self.estensioni[tipo]
        cartella = '/img/album/' + tipo + '_' + id_elemento + self.estensioni[tipo]
        destinazione = '/home/pi/PiZero/client-side' + cartella
        comando = 'cp ' + sorgente + ' ' + destinazione
        call(comando, shell = True)
        self.manager.scrivi('''
            INSERT INTO galleria
            VALUES (?, ?, ?)
        ''', (id_elemento, tipo, cartella))
        comando = 'rm ' + self.percorso + 'temp/*'
        call(comando, shell = True)
        self.completo = False
        self.lock.release()
    
    # Scarto dell'elemento
    def scarta_elemento(self):
        self.lock.acquire()
        comando = 'rm ' + self.percorso + 'temp/*'
        call(comando, shell = True)
        self.completo = False
        self.lock.release()
    
    # Lettura della galleria
    def leggi_galleria(self):
        return self.manager.leggi_righe('''
            SELECT percorso, tipo
            FROM galleria
            ORDER BY id DESC
        ''')
    
    # Lettura statistiche dashboard
    def leggi_statistiche(self):
        risposta = {}
        
        # Temperatura e CPU
        risposta['temp'] = self.leggi_temperatura()
        risposta['cpu'] = str(cpu_percent()) + '%'
        
        # RAM
        ram = virtual_memory()
        risposta['ram_perc'] = str(ram.percent) + '%'
        risposta['ram_free'] = str(round((ram.available / 1024.0 / 1024.0), 1)) + ' MB'
        risposta['ram_tot'] = str(round((ram.total / 1024.0 / 1024.0), 1)) + ' MB'
        
        # SD
        sd = disk_usage('/')
        risposta['sd_perc'] = str(sd.percent) + '%'
        risposta['sd_free'] = str(round(((sd.total - sd.used) / 1024.0 / 1024.0 / 1024.0), 1)) + ' GB'
        risposta['sd_tot'] = str(round((sd.total / 1024.0 / 1024.0 / 1024.0), 1)) + ' GB'
        
        return risposta
    
    # Lettura della temperatura
    def leggi_temperatura(self):
        process = Popen(['vcgencmd', 'measure_temp'], stdout = PIPE)
        output, _error = process.communicate()
        return output[output.index('=') + 1:output.rindex("'")]
    
    # Riavvio dispositivo
    def riavvia(self):
        call('reboot now', shell = True)
    
    # Arresto dispositivo
    def spegni(self):
        call('shutdown now', shell = True)
