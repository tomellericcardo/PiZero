var album = {
    
    init: function() {
        album.init_stato();
        album.init_home();
        album.init_chiudi();
        album.init_avanti();
        album.init_dietro();
        album.leggi_galleria();
    },
    
    // Inizializzazione variabili di stato
    init_stato: function() {
        album.galleria = {
            id: [],
            tipo: [],
            percorso: []
        };
        album.in_mostra = '';
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
        var tipo;
        for (var i = 0; i < lista.elementi.length; i++) {
            album.galleria.id[i] = lista.elementi[i][0];
            album.galleria.tipo[i] = lista.elementi[i][1];
            album.galleria.percorso[i] = lista.elementi[i][2];
            lista.elementi[i] = {
                id: lista.elementi[i][0],
                tipo: lista.elementi[i][1],
                percorso: lista.elementi[i][2]
            };
            if (tipo == 'FOTO') lista.elementi[i].foto = true;
            else if (tipo == 'VIDEO') lista.elementi[i].video = true;
            else if (tipo == 'GIF') lista.elementi[i].gif = true;
            else if (tipo == 'SLOW') lista.elementi[i].slow = true;
            else if (tipo == 'LAPSE') lista.elementi[i].lapse = true;
        }
        if (lista.length > 8) lista.spazio = true;
        return lista;
    },
    
    // Visualizzazione dell'elemento
    mostra_elemento: function(id, tipo, percorso) {
        album.in_mostra = id;
        var codice;
        if (tipo == 'FOTO' || tipo == 'GIF') codice = '<img src="' + percorso + '" class="foto_galleria">';
        else codice = '<video class="foto_galleria" controls><source src="' + percorso + '" type="video/mp4"></video>';
        $('#contenuto_mostra').html(codice);
        $('#mostra').css('display', 'block');
    },
    
    // Bottone chiusura
    init_chiudi: function() {
        $('#chiudi_mostra').on('click', function() {
            $('#mostra').css('display', 'none');
        });
    },
    
    // Bottone dietro
    init_dietro: function() {
        $('#dietro').on('click', function() {
            var i = album.galleria.id.indexOf(album.in_mostra);
            if (i == 0) $('#mostra').css('display', 'none');
            else {
                i = i - 1;
                var id = album.galleria.id[i];
                var tipo = album.galleria.tipo[i];
                var percorso = album.galleria.percorso[i];
                album.mostra_elemento(id, tipo, percorso);
            }
        });
    },
    
    // Bottone avanti
    init_avanti: function() {
        $('#avanti').on('click', function() {
            var i = album.galleria.id.indexOf(alcum.in_mostra);
            i += 1;
            if (i == album.galleria.id.length) $('#mostra').css('display', 'none');
            else {
                var id = album.galleria.id[i];
                var tipo = album.galleria.tipo[i];
                var percorso = album.galleria.percorso[i];
                album.mostra_elemento(id, tipo, percorso);
            }
        });
    }
    
};

$(document).ready(album.init());
