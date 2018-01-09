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
        for (var i = 0; i < lista.elementi.length; i++) {
            lista.elementi[i] = {percorso: lista.elementi[i]};
        }
        return lista;
    },
    
    mostra_elemento: function(percorso) {
        window.location.href = percorso;
    }
    
};

$(document).ready(album.init());
