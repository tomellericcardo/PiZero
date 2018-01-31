var album = {
    
    init: function() {
        album.init_stato();
        album.init_home();
        album.init_chiudi();
        album.init_navigazione();
        album.init_elimina();
        album.init_download();
        album.leggi_galleria();
    },
    
    // Inizializzazione variabili di stato
    init_stato: function() {
        album.in_mostra = '';
        album.galleria = {
            id: [],
            tipo: [],
            percorso: []
        };
    },
    
    // Bottone home
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    // Lettura della galleria
    leggi_galleria: function() {
        $.ajax({
            url: 'leggi_galleria',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(risposta) {
                risposta = album.formatta_risposta(risposta);
                $.get('/html/templates.html', function(contenuto) {
                    var template = $(contenuto).filter('#galleria').html();
                    $('#galleria').html(Mustache.render(template, risposta));
                });
            },
            error: function() {
                messaggio.errore('Errore del server!');
            }
        });
    },
    
    // Formattazione della risposta
    formatta_risposta: function(lista) {
        for (var i = 0; i < lista.elementi.length; i++) {
            album.galleria.id[i] = lista.elementi[i][0];
            album.galleria.tipo[i] = lista.elementi[i][1];
            album.galleria.percorso[i] = lista.elementi[i][2];
            lista.elementi[i] = {
                id: album.galleria.id[i],
                tipo: album.galleria.tipo[i],
                percorso: album.galleria.percorso[i]
            };
            if (album.galleria.tipo[i] == 'FOTO') lista.elementi[i].foto = true;
            else if (album.galleria.tipo[i] == 'VIDEO') lista.elementi[i].video = true;
            else if (album.galleria.tipo[i] == 'GIF') lista.elementi[i].gif = true;
            else if (album.galleria.tipo[i] == 'SLOW') lista.elementi[i].slow = true;
            else if (album.galleria.tipo[i] == 'LAPSE') lista.elementi[i].lapse = true;
        }
        album.lista = lista;
        if (lista.elementi.length > 0) $('#download').css('display', 'none');
        if (lista.elementi.length > 8) {
            album.init_pagine();
            var nuova_lista = {};
            nuova_lista.elementi = lista.elementi.slice(0, 8)
            return nuova_lista;
        }
        return lista;
    },
    
    // Navigazione delle pagine
    init_pagine: function() {
        album.pagina = 0;
        
        // Swipe
        $('#pagina').swipe({
            swipeRight: function() {
                album.pagina_dietro();
            },
            swipeLeft: function() {
                album.pagina_avanti();
            }
        });
        
        // Frecce
        $(document).keydown(function(e) {
            if ($('#mostra').css('display') == 'none') {
                if (e.keyCode == 37) album.pagina_dietro();
                else if (e.keyCode == 39) album.pagina_avanti();
            }
        });
    },
    
    // Pagina precedente
    pagina_dietro: function() {
        if (album.pagina > 0) {
            album.pagina = album.pagina - 1;
            var inizio = album.pagina * 8;
            var fine = inizio + 8;
            var lista = {};
            lista.elementi = album.lista.elementi.slice(inizio, fine);
            $.get('/html/templates.html', function(contenuto) {
                var template = $(contenuto).filter('#galleria').html();
                $('#galleria').html(Mustache.render(template, lista));
            });
        }
    },
    
    // Pagina successiva
    pagina_avanti: function() {
        if (album.lista.elementi.length > (album.pagina + 1) * 8) {
            album.pagina = album.pagina + 1;
            var inizio = album.pagina * 8;
            var fine = inizio + 8;
            var lista = {};
            lista.elementi = album.lista.elementi.slice(inizio, fine);
            $.get('/html/templates.html', function(contenuto) {
                var template = $(contenuto).filter('#galleria').html();
                $('#galleria').html(Mustache.render(template, lista));
            });
        }
    },
    
    // Visualizzazione dell'elemento
    mostra_elemento: function(id, tipo, percorso, animazione = 'opacity') {
        album.in_mostra = id;
        var codice;
        if (tipo == 'FOTO' || tipo == 'GIF') codice = '<img src="' + percorso + '" class="w3-animate-' + animazione + ' foto_galleria">';
        else codice = '<video class="w3-animate-' + animazione + ' foto_galleria" controls><source src="' + percorso + '" type="video/mp4"></video>';
        if ($('#mostra').css('display') == 'none') {
            $('#contenuto_mostra').html(codice);
            $('#mostra').css('display', 'block');
        } else {
            $('#contenuto_mostra .foto_galleria').fadeOut(function() {
                $('#contenuto_mostra').html(codice);
            });
        }
    },
    
    // Bottone chiusura
    init_chiudi: function() {
        $('#chiudi_mostra').on('click', function() {
            $('#mostra').fadeOut();
        });
    },
    
    // Navigazione degli elementi
    init_navigazione: function() {
        
        // Swipe
        $('#mostra').swipe({
            swipeRight: function() {
                album.dietro();
            },
            swipeLeft: function() {
                album.avanti();
            }
        });
        
        // Frecce
        $(document).keydown(function(e) {
            if ($('#mostra').css('display') != 'none') {
                if (e.keyCode == 37) album.dietro();
                else if (e.keyCode == 39) album.avanti();
            }
        });
        
    },
    
    // Mostra precedente
    dietro: function() {
        var i = album.galleria.id.indexOf(album.in_mostra);
        if (i == 0) $('#mostra').fadeOut();
        else {
            i = i - 1;
            var id = album.galleria.id[i];
            var tipo = album.galleria.tipo[i];
            var percorso = album.galleria.percorso[i];
            album.mostra_elemento(id, tipo, percorso, 'left');
        }
    },
    
    // Mostra successivo
    avanti: function() {
        var i = album.galleria.id.indexOf(album.in_mostra);
        i += 1;
        if (i == album.galleria.id.length) $('#mostra').fadeOut();
        else {
            var id = album.galleria.id[i];
            var tipo = album.galleria.tipo[i];
            var percorso = album.galleria.percorso[i];
            album.mostra_elemento(id, tipo, percorso, 'right');
        }
    },
    
    // Bottone eliminazione
    init_elimina: function() {
        
        // Apertura modal
        $('#elimina').on('click', function() {
            $('#mostra').css('display', 'none');
            $('#modal_elimina').css('display', 'block');
        });
        
        // Conferma aliminazione
        $('#conferma_elimina').on('click', function() {
            $.ajax({
                url: 'elimina',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({id: album.in_mostra}),
                success: function(risposta) {
                    window.location.href = '/album';
                },
                error: function() {
                    messaggio.errore('Errore del server!');
                }
            });
        });
        
        // Chiusura modal
        $('#chiudi_elimina, #sfondo_elimina').on('click', function() {
            $('#modal_elimina').css('display', 'none');
        });
        
    },
    
    // Bottone download
    init_download: function() {
        $('#download').on('click', function() {
            $('#download').html('<i class="material-icons w3-spin">refresh</i>');
            $.ajax({
                url: 'download',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({id: album.in_mostra}),
                success: function(risposta) {
                    $('#download').html('<i class="material-icons">file_download</i>');
                    $('#download_link').click();
                },
                error: function() {
                    messaggio.errore('Errore del server!');
                }
            });
        });
    }
    
};

$(document).ready(album.init());
