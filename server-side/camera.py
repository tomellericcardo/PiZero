# -*- coding: utf-8 -*-

from threading import Thread
from time import sleep
from subprocess import call


class GIF(Thread):
    
    # Inizializzazione della classe
    def __init__(self, zero):
        Thread.__init__(self)
        self.zero = zero
        self.stop = False
        self.stato = 0
    
    # Scatto della gif
    def run(self):
        self.zero.lock.acquire()
        self.stop = False
        self.stato = 1
        self.zero.occupato = 'GIF'
        i = 0
        while i < 20 and not self.stop:
            self.stato = i + 1
            i = formatta_indice(str(i))
            nome_file = self.zero.percorso + 'temp/GIF' + str(i) + '.jpg'
            self.zero.camera.capture(nome_file)
            sleep(1)
            i += 1
        self.stato = 0
        foto = self.zero.percorso + 'temp/GIF%03d.jpg '
        gif = self.zero.percorso + 'temp/GIF.gif'
        comando = 'convert -delay 50 ' + foto + gif
        call(comando, shell = True)
        self.zero.occupato = False
        self.zero.completo = 'GIF'
        self.zero.lock.release()
        

class TimeLapse(Thread):
    
    # Inizializzazione della classe
    def __init__(self, zero):
        Thread.__init__(self)
        self.zero = zero
        self.stop = False
        self.stato = 0
    
    # Ripresa del time lapse
    def run(self):
        self.zero.lock.acquire()
        self.stop = False
        self.stato = 1
        self.zero.occupato = 'LAPSE'
        i = 0
        while i < 240 and not self.stop:
            self.stato = i + 1
            i = formatta_indice(str(i))
            nome_file = self.zero.percorso + 'temp/LAPSE' + i + '.jpg'
            self.zero.camera.capture(nome_file)
            sleep(30)
            i += 1
        self.stato = 0
        foto = self.zero.percorso + 'temp/LAPSE%03d.jpg '
        lapse = self.zero.percorso + 'temp/LAPSE.mp4'
        comando = 'avconv -r 10 -i ' + foto + ' -b:v 1000k ' + lapse
        call(comando, shell = True)
        self.zero.occupato = False
        self.zero.completo = 'LAPSE'
        self.zero.lock.release()
    
    
# Formattazione dell'indice
def formatta_indice(self, i):
    while len(i) < 3:
        i = '0' + i
    return i
