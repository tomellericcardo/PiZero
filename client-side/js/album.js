var album = {
    
    init: function() {
        album.init_home();
        // album.init_avanti();
        // album.init_dietro();
        album.leggi_galleria();
    },
    
    init_stato: function() {
        album.galleria = {};
        album.in_mostra = '';
    },
    
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    leggi_galleria: function() {
        $.ajax({
            url: 'leggi_galleria',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(risposta) {
                album.galleria = album.formatta_risposta(risposta);
                $.get('/html/templates.html', function(contenuto) {
                    var template = $(contenuto).filter('#galleria').html();
                    $('#galleria').html(Mustache.render(template, album.galleria));
                });
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    },
    
    formatta_risposta: function(lista) {
        var tipo;
        for (var i = 0; i < lista.elementi.length; i++) {
            tipo = lista.elementi[i][1];
            lista.elementi[i] = {percorso: lista.elementi[i][0]};
            if (tipo == 'FOTO') lista.elementi[i].foto = true;
            else if (tipo == 'VIDEO') lista.elementi[i].video = true;
            else if (tipo == 'GIF') lista.elementi[i].gif = true;
            else if (tipo == 'SLOW') lista.elementi[i].slow = true;
            else if (tipo == 'LAPSE') lista.elementi[i].lapse = true;
        }
        if (lista.length > 8) lista.spazio = true;
        return lista;
    },
    
    mostra_elemento: function(id, tipo, percorso) {
        album.in_mostra = id;
        var codice;
        if (tipo == 'FOTO' || tipo == 'GIF') codice = '<img src="' + percorso + '" class="foto_galleria">';
        else codice = '<video class="foto_galleria" controls><source src="' + percorso + '" type="video/mp4"></video>';
        $('#contenuto_mostra').html(codice);
        $('#mostra').css('display', 'block');
    },
    
    init_chiudi: function() {
        $('#chiudi_mostra').on('click', function() {
            $('#mostra').css('display', 'none');
        });
    }
    
};

$(document).ready(album.init());
