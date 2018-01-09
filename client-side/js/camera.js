var camera = {
    
    init: function() {
        camera.init_home();
        camera.init_foto();
        camera.init_salva();
        camera.init_scarta();
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
                    camera.id = Date.now().toString();
                    camera.tipo = 'FOTO';
                    $('#pagina').html('<img src="/img/FOTO.jpg?nc=' + camera.id + '" class="w3-image">');
                    $('#operazioni').css('display', 'none');
                    $('#salvataggio').css('display', 'block');
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
                data: JSON.stringify({tipo: camera.tipo, id: camera.id}),
                success: function() {
                    $('#operazioni').css('display', 'block');
                    $('#salvataggio').css('display', 'none');
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        });
    },
    
    init_scarta: function() {
        $('#scarta').on('click', function() {
            $('#operazioni').css('display', 'block');
            $('#salvataggio').css('display', 'none');
        });
    }
    
};

$(document).ready(camera.init());
