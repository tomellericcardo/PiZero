var album = {
    
    init: function() {
        album.init_stato();
        album.init_home();
        album.init_chiudi();
        album.init_avanti();
        album.init_dietro();
        album.init_elimina();
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
                errore.messaggio('Errore del server!');
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
        if (lista.length > 8) lista.spazio = true;
        return lista;
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
    
    // Bottone dietro
    init_dietro: function() {
        $('#dietro').on('mousedown touchstart', function() {
            var i = album.galleria.id.indexOf(album.in_mostra);
            if (i == 0) $('#mostra').fadeOut();
            else {
                i = i - 1;
                var id = album.galleria.id[i];
                var tipo = album.galleria.tipo[i];
                var percorso = album.galleria.percorso[i];
                album.mostra_elemento(id, tipo, percorso, 'left');
            }
        });
    },
    
    // Bottone avanti
    init_avanti: function() {
        $('#avanti').on('mousedown touchstart', function() {
            var i = album.galleria.id.indexOf(album.in_mostra);
            i += 1;
            if (i == album.galleria.id.length) $('#mostra').fadeOut();
            else {
                var id = album.galleria.id[i];
                var tipo = album.galleria.tipo[i];
                var percorso = album.galleria.percorso[i];
                album.mostra_elemento(id, tipo, percorso, 'right');
            }
        });
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
                    errore.messaggio('Errore del server!');
                }
            });
        });
        
        // Chiusura modal
        $('#chiudi_elimina, #sfondo_elimina').on('click', function() {
            $('#modal_elimina').css('display', 'none');
        });
        
    }
    
};

$(document).ready(album.init());
