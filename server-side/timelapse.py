# -*- coding: utf-8 -*-

from threading import Thread


class TimeLapse(Thread):
    
    def __init__(self, percorso):
        Thread.__init__(self)
        self.percorso = percorso
    
    def run(self, camera, lock):
        lock.acquire()
        for i in range(0, 120):
            i = self.formatta_indice(str(i))
            nome_file = self.percorso + 'temp/LAPSE' + i + '.jpg'
            camera.capture(nome_file)
            sleep(30)
        foto = self.percorso + 'temp/LAPSE%03d.jpg '
        lapse = self.percorso + 'temp/LAPSE.mp4'
        comando = 'avconv -r 10 -i ' + foto + ' -b:v 1000k ' + lapse
        call(comando, shell = True)
        lock.release()
    
    def formatta_indice(self, i):
        while len(i) < 3:
            i = '0' + i
        return i
