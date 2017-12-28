var camera = {
    
    init: function() {
        camera.init_home();
        camera.init_foto();
    },
    
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    init_foto: function() {
        $('#foto').on('click', function() {
            $.ajax({
                url: 'scatta_foto',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    var nc = Date.now().toString();
                    $('#pagina').html('<img src="/img/temp/foto.jpg?nc=' + nc + '" class="w3-image">');
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        });
    }
    
};

$(document).ready(camera.init());
