var camera = {
    
    init: function() {
        camera.init_home();
        camera.init_foto();
        camera.init_salva();
        camera.init_scarta();
        camera.auto = setInterval(camera.aggiorna, 1000);
    },
    
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    init_foto: function() {
        $('#foto').on('click', function() {
            clearInterval(camera.auto);
            $.ajax({
                url: 'scatta_foto',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    var nc = Date.now().toString();
                    $('#pagina').html('<img src="/img/foto.jpg?nc=' + nc + '" class="w3-image">');
                    $('#operazioni').css('display', 'none');
                    $('#salvataggio').css('display', 'block');
                    camera.tipo = 'foto';
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        });
    },
    
    init_salva: function() {
        $('#salva').on('click', function() {
            $.ajax({
                url: 'salva',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({tipo: camera.tipo}),
                success: function() {
                    var nc = Date.now().toString();
                    $('#pagina').html('<img src="/img/default.jpg" class="w3-image">');
                    $('#operazioni').css('display', 'block');
                    $('#salvataggio').css('display', 'none');
                    camera.auto = setInterval(camera.aggiorna, 1000);
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        });
    },
    
    init_scarta: function() {
        $('#scarta').on('click', function() {
            $('#pagina').html('<img src="/img/default.jpg" class="w3-image">');
            $('#operazioni').css('display', 'block');
            $('#salvataggio').css('display', 'none');
            camera.auto = setInterval(camera.aggiorna, 1000);
        });
    }
    
};

$(document).ready(camera.init());
