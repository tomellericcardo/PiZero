# -*- coding: utf-8 -*-

from manager import Manager
from subprocess import call, Popen, PIPE
from psutil import cpu_percent, virtual_memory, disk_usage


class Zero:
    
    def __init__(self, g):
        self.manager = Manager(g)
    
    # Riavvio
    def riavvia(self):
        call('sudo reboot now', shell = True)
    
    # Arresto
    def spegni(self):
        call('sudo shutdown now', shell = True)
    
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
        process = Popen(['vcgencmd', 'measure_temp'], stdout=PIPE)
        output, _error = process.communicate()
        return output[output.index('=') + 1:output.rindex("'")]
