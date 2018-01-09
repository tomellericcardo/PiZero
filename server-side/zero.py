# -*- coding: utf-8 -*-

from manager import Manager
from picamera import PiCamera
from threading import Lock
from subprocess import call, Popen, PIPE
from psutil import cpu_percent, virtual_memory, disk_usage


class Zero:
    
    def __init__(self, g):
        self.manager = Manager(g)
        self.camera = PiCamera()
        self.lock = Lock()
        self.estensioni = {'FOTO': '.jpg', 'VIDEO': '.mp4'}
        self.percorso = '/home/pi/PiZero/client-side/img/'
    
    # Riavvio
    def riavvia(self):
        self.lock.acquire()
        call('sudo reboot now', shell = True)
        self.lock.release()
    
    # Arresto
    def spegni(self):
        self.lock.acquire()
        call('sudo shutdown now', shell = True)
        self.lock.release()
    
    # Scatto della foto
    def scatta_foto(self):
        self.lock.acquire()
        self.camera.capture(self.percorso + 'FOTO.jpg')
        self.lock.release()
    
    # Registrazione del video
    def registra_video(self):
        self.lock.acquire()
        comando = 'sudo rm ' + self.percorso + 'VIDEO.*'
        call(comando, shell = True)
        self.camera.start_recording(self.percorso + 'VIDEO.h264')
    
    # Interruzione del video
    def stop_video(self):
        self.camera.stop_recording()
        comando = 'MP4Box -add ' + self.percorso + 'VIDEO.h264 ' + self.percorso + 'VIDEO.mp4'
        call(comando, shell = True)
        self.lock.release()
    
    # Salvataggio dell'elemento
    def salva(self, tipo, id_elemento):
        self.lock.acquire()
        sorgente = self.percorso + tipo + self.estensioni[tipo]
        cartella = '/img/album/' + tipo + '_' + id_elemento + self.estensioni[tipo]
        destinazione = '/home/pi/PiZero/client-side' + cartella
        comando = 'sudo cp ' + sorgente + ' ' + destinazione
        call(comando, shell = True)
        self.manager.scrivi('''
            INSERT INTO galleria
            VALUES (?, ?, ?)
        ''', (id_elemento, tipo, cartella))
        self.lock.release()
    
    # Lettura della galleria
    def leggi_galleria(self):
        return self.manager.leggi_righe('''
            SELECT percorso
            FROM galleria
            ORDER BY id DESC
        ''')
    
    # Lettura statistiche dashboard
    def leggi_statistiche(self):
        self.lock.acquire()
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
        
        self.lock.release()
        return risposta
    
    # Lettura della temperatura
    def leggi_temperatura(self):
        process = Popen(['vcgencmd', 'measure_temp'], stdout=PIPE)
        output, _error = process.communicate()
        return output[output.index('=') + 1:output.rindex("'")]
