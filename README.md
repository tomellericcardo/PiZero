# PiZero

PiZero è un'applicazione web per la gestione di una fotocamera wireless basata sul Raspberry Pi Zero.
Il suo scopo è scattare foto e video (ma anche GIF e video in Time-Lapse e Slow-Motion), salvare gli elementi in un album e modificare le impostazioni della fotocamera.


### Prerequisiti

* Raspberry Pi (modello qualsiasi)
* Micro SD (almeno 4GB consigliati)
* Sistema operativo Raspbian (testato solo con Stretch)
* Connessione ad una rete LAN (non è necessario Internet)
* Modulo fotocamera compatibile


### Dipendenze

* Python Pip
  * Flask
  * psutil
* Python PiCamera
* ImageMagick
* GPAC
* Libav


### Installazione

Aggiorna l'elenco locale di `apt-get`:
```
sudo apt-get update
```
Installa le dipendenze con `apt-get` e `pip`:
```
sudo apt-get install python-pip python-picamera imagemagick gpac libav-tools
sudo pip install flask psutil
```
Clona la directory in `/home/pi`:
```
cd /home/pi
sudo git clone http://www.github.com/tomellericcardo/PiZero.git
```
Crea le cartelle necessarie:
```
cd PiZero/
sudo mkdir client-side/img/temp client-side/img/album
```
Assicurati di aver abilitato il modulo fotocamera nella configurazione del Raspberry Pi:
```
sudo raspi-config
```
Avvia l'applicazione:
```
sudo python server-side/webserver.py
```


### Esecuzione all'avvio

Per eseguire l'applicazione all'avvio occorre modificare il file `/etc/rc.local`:
```
sudo nano /etc/rc.local
```
Aggiungi la seguente riga **prima** del comando `exit 0`:
```
sudo python /home/pi/PiZero/server-side/webserver.py &
```
Riavvia il Raspberry:
```
sudo reboot now
```


### Aggiornamento

Per aggiornare l'applicazione basta spostarsi nella cartella e fare il `pull` della repository :
```
cd /home/pi/PiZero/
sudo git pull
```
Riavvia il Raspberry:
```
sudo reboot now
```


### Note

Il server web si metterà in ascolto alla porta `80`, per cui per raggiungere l'applicazione web basterà aprire il browser di un dispositivo connesso alla stessa rete del Raspberry Pi ed inserire l'indirizzo IP.
