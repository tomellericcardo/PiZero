var camera = {
    
    init: function() {
        camera.init_home();
        setInterval(camera.aggiorna_immagine, 2000);
    },
    
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    aggiorna_immagine: function() {
        $.ajax({
            url: 'aggiorna_immagine',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function() {
                var nc = Date.now().toString();
                $('#pagina').html('<img src="/img/image.jpg?nc=' + nc + '" class="w3-image">');
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    }
    
};

$(document).ready(camera.init());
