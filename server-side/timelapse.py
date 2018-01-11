# -*- coding: utf-8 -*-

from threading import Thread
from time import sleep
from subprocess import call


class TimeLapse(Thread):
    
    def __init__(self, lock, camera, percorso):
        Thread.__init__(self)
        self.lock = lock
        self.camera = camera
        self.percorso = percorso
    
    def run(self):
        self.lock.acquire()
        for i in range(0, 120):
            i = self.formatta_indice(str(i))
            nome_file = self.percorso + 'temp/LAPSE' + i + '.jpg'
            self.camera.capture(nome_file)
            sleep(30)
        foto = self.percorso + 'temp/LAPSE%03d.jpg '
        lapse = self.percorso + 'temp/LAPSE.mp4'
        comando = 'avconv -r 10 -i ' + foto + ' -b:v 1000k ' + lapse
        call(comando, shell = True)
        self.lock.release()
    
    def formatta_indice(self, i):
        while len(i) < 3:
            i = '0' + i
        return i
