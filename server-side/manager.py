# -*- coding: utf-8 -*-

from os.path import realpath, dirname, join
from sqlite3 import connect


class Manager:
    
    
    # Inizializzazione database
    def __init__(self, g):
        self.g = g
        posizione = dirname(realpath(__file__))
        self.percorso = join(posizione, 'database.db')
        self.init_db()
    
    def init_db(self):
        database = connect(self.percorso)
        cursore = database.cursor()
        '''
        cursore.execute('')
        database.commit()
        '''
        cursore.close()
        database.close()
    
    
    # Gestione connessioni
    def apri_connessione(self):
        self.g.db = connect(self.percorso)
        self.g.db.text_factory = str
    
    def chiudi_connessione(self):
        db = getattr(self.g, 'db', None)
        if db is not None:
            db.close()
    
    
    # Metodi lettura
    def leggi_righe(self, query, parametri = ()):
        cursore = self.g.db.cursor()
        cursore.execute(query, parametri)
        risultato = cursore.fetchall()
        cursore.close()
        return risultato
    
    def leggi_riga(self, query, parametri = ()):
        cursore = self.g.db.cursor()
        cursore.execute(query, parametri)
        risultato = cursore.fetchone()
        cursore.close()
        return risultato
    
    def leggi_dato(self, query, parametri = ()):
        return self.leggi_riga(query, parametri)[0]
    
    def leggi_presenza(self, query, parametri = ()):
        return len(self.leggi_righe(query, parametri)) > 0
    
    
    # Metodo scrittura
    def scrivi(self, query, parametri = ()):
        cursore = self.g.db.cursor()
        cursore.execute(query, parametri)
        self.g.db.commit()
        cursore.close()
