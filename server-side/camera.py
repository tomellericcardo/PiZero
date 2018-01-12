# -*- coding: utf-8 -*-

from threading import Thread
from time import sleep
from subprocess import call


class GIF(Thread):
    
    # Inizializzazione della classe
    def __init__(self, lock, completo, occupato, percorso, camera):
        Thread.__init__(self)
        self.lock = lock
        self.completo = completo
        self.occupato = occupato
        self.percorso = percorso
        self.camera = camera
        self.stato = 0
    
    # Scatto della gif
    def run(self):
        self.lock.acquire()
        self.stato = 0
        self.occupato = 'GIF'
        for i in range(0, 10):
            self.stato = i + 1
            nome_file = self.percorso + 'temp/GIF' + str(i) + '.jpg'
            self.camera.capture(nome_file)
            sleep(1)
        foto = self.percorso + 'temp/GIF*.jpg '
        gif = self.percorso + 'temp/GIF.gif'
        comando = 'convert -delay 50 ' + foto + gif
        call(comando, shell = True)
        self.occupato = False
        self.completo = 'GIF'
        self.lock.release()
        

class TimeLapse(Thread):
    
    # Inizializzazione della classe
    def __init__(self, lock, completo, occupato, percorso, camera):
        Thread.__init__(self)
        self.lock = lock
        self.completo = completo
        self.occupato = occupato
        self.percorso = percorso
        self.camera = camera
        self.stato = 0
    
    # Ripresa del time lapse
    def run(self):
        self.lock.acquire()
        self.stato = 0
        self.occupato = 'LAPSE'
        for i in range(0, 120):
            self.stato = i + 1
            i = self.formatta_indice(str(i))
            nome_file = self.percorso + 'temp/LAPSE' + i + '.jpg'
            self.camera.capture(nome_file)
            sleep(30)
        foto = self.percorso + 'temp/LAPSE%03d.jpg '
        lapse = self.percorso + 'temp/LAPSE.mp4'
        comando = 'avconv -r 10 -i ' + foto + ' -b:v 1000k ' + lapse
        call(comando, shell = True)
        self.occupato = False
        self.completo = 'LAPSE'
        self.lock.release()
    
    # Formattazione dell'indice
    def formatta_indice(self, i):
        while len(i) < 3:
            i = '0' + i
        return i
