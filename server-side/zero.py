# -*- coding: utf-8 -*-

from manager import Manager
from picamera import PiCamera
from threading import Lock
from subprocess import call, Popen, PIPE
from time import sleep
from psutil import cpu_percent, virtual_memory, disk_usage


class Zero:
    
    def __init__(self, g):
        self.manager = Manager(g)
        self.camera = PiCamera()
        self.lock = Lock()
        self.estensioni = {'FOTO': '.jpg', 'VIDEO': '.mp4', 'GIF': '.gif', 'LAPSE': '.mp4', 'SLOW': '.mp4'}
        self.percorso = '/home/pi/PiZero/client-side/img/'
    
    # Riavvio
    def riavvia(self):
        self.lock.acquire()
        call('reboot now', shell = True)
        self.lock.release()
    
    # Arresto
    def spegni(self):
        self.lock.acquire()
        call('shutdown now', shell = True)
        self.lock.release()
    
    # Scatto della foto
    def scatta_foto(self):
        self.lock.acquire()
        self.camera.capture(self.percorso + 'temp/FOTO.jpg')
        self.lock.release()
    
    # Registrazione del video
    def registra_video(self):
        self.lock.acquire()
        self.camera.start_recording(self.percorso + 'temp/VIDEO.h264')
    
    # Interruzione del video
    def stop_video(self):
        self.camera.stop_recording()
        h264 = self.percorso + 'temp/VIDEO.h264 '
        mp4 = self.percorso + 'temp/VIDEO.mp4'
        comando = 'MP4Box -add ' + h264 + mp4
        call(comando, shell = True)
        self.lock.release()
    
    # Scatto della GIF
    def scatta_gif(self):
        self.lock.acquire()
        for i in range(0, 10):
            nome_file = self.percorso + 'temp/GIF' + str(i) + '.jpg'
            self.camera.capture(nome_file)
            sleep(1)
        foto = self.percorso + 'temp/GIF*.jpg '
        gif = self.percorso + 'temp/GIF.gif'
        comando = 'convert -delay 50 ' + foto + gif
        call(comando, shell = True)
        self.lock.release()
    
    # Registrazione in time lapse
    def timelapse_video(self):
        self.lock.acquire()
        for i in range(0, 100):
            nome_file = self.percorso + 'temp/LAPSE' + str(i) + '.jpg'
            self.camera.capture(nome_file)
            sleep(1)
        foto = self.percorso + 'temp/LAPSE%d.jpg '
        lapse = self.percorso + 'temp/LAPSE.mp4'
        comando = 'avconv -r 10 -i ' + foto + ' -b:v 1000k ' + lapse
        call(comando, shell = True)
        self.lock.release()
    
    # Registrazione in slow motion
    def slowmotion_video(self):
        self.lock.acquire()
        self.camera.close()
        h264 = self.percorso + 'temp/SLOW.h264 '
        mp4 = self.percorso + 'temp/SLOW.mp4'
        comando = 'raspivid -w 640 -h 480 -fps 90 -t 10000 -o ' + h264
        call(comando, shell = True)
        comando = 'MP4Box -add ' + h264 + mp4
        call(comando, shell = True)
        self.camera = PiCamera()
        self.lock.release()
    
    # Salvataggio dell'elemento
    def salva(self, tipo, id_elemento):
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
        self.lock.release()
    
    # Scarto dell'elemento
    def scarta(self):
        self.lock.acquire()
        comando = 'rm ' + self.percorso + 'temp/*'
        call(comando, shell = True)
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
