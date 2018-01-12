# -*- coding: utf-8 -*-

from os.path import realpath, dirname, join
from sqlite3 import connect


class DataBase:
    
    
    # Inizializzazione della classe
    def __init__(self, g):
        self.g = g
        posizione = dirname(realpath(__file__))
        self.percorso = join(posizione, 'database.db')
        self.init_db()
    
    # Inizializzazione del database
    def init_db(self):
        database = connect(self.percorso)
        cursore = database.cursor()
        cursore.execute('''
            CREATE TABLE IF NOT EXISTS galleria (
                    id TEXT PRIMARY KEY,
                    tipo TEXT NOT NULL,
                    percorso TEXT NOT NULL
            )
        ''')
        database.commit()
        cursore.execute('''
            CREATE TABLE IF NOT EXISTS impostazioni (
                    chiave TEXT PRIMARY KEY,
                    valore TEXT NOT NULL
            )
        ''')
        database.commit()
        cursore.close()
        database.close()
    
    # Inizializzazione delle impostazioni
    def init_impostazioni(self):
        database = connect(self.percorso)
        cursore = database.cursor()
        cursore.execute('''
            INSERT INTO impostazioni (chiave, valore)
            VALUES (?, ?)
        ''', ('sharpness', 0))
        database.commit()
        cursore.execute('''
            INSERT INTO impostazioni (chiave, valore)
            VALUES (?, ?)
        ''', ('contrast', 0))
        database.commit()
        cursore.execute('''
            INSERT INTO impostazioni (chiave, valore)
            VALUES (?, ?)
        ''', ('brightness', 50))
        database.commit()
        cursore.execute('''
            INSERT INTO impostazioni (chiave, valore)
            VALUES (?, ?)
        ''', ('saturation', 0))
        database.commit()
        cursore.execute('''
            INSERT INTO impostazioni (chiave, valore)
            VALUES (?, ?)
        ''', ('iso', 0))
    
    # Apertura della connessione
    def apri_connessione(self):
        self.g.db = connect(self.percorso)
        self.g.db.text_factory = str
    
    # Chiusura della connessione
    def chiudi_connessione(self):
        db = getattr(self.g, 'db', None)
        if db is not None:
            db.close()
    
    # Lettura di piu' records
    def leggi_righe(self, query, parametri = ()):
        cursore = self.g.db.cursor()
        cursore.execute(query, parametri)
        risultato = cursore.fetchall()
        cursore.close()
        return risultato
    
    # Lettura di un solo record
    def leggi_riga(self, query, parametri = ()):
        cursore = self.g.db.cursor()
        cursore.execute(query, parametri)
        risultato = cursore.fetchone()
        cursore.close()
        return risultato
    
    # Lettura di un singolo valore
    def leggi_dato(self, query, parametri = ()):
        return self.leggi_riga(query, parametri)[0]
    
    # Presenza di un record
    def leggi_presenza(self, query, parametri = ()):
        return len(self.leggi_righe(query, parametri)) > 0
    
    # Metodo scrittura
    def scrivi(self, query, parametri = ()):
        cursore = self.g.db.cursor()
        cursore.execute(query, parametri)
        self.g.db.commit()
        cursore.close()
