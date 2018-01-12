var album = {
    
    init: function() {
        album.init_home();
        album.leggi_galleria();
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
    
    mostra_elemento: function(percorso) {
        window.location.href = percorso;
    }
    
};

$(document).ready(album.init());
