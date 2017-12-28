var camera = {
    
    init: function() {
        camera.init_home();
        camera.init_foto();
        camera.init_salva();
        camera.init_scarta();
        camera.auto = setInterval(camera.aggiorna, 2000);
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
                url: 'aggiorna',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    camera.id = Date.now().toString();
                    $('#pagina').html('<img src="/img/foto.jpg?nc=' + camera.id + '" class="w3-image">');
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
                data: JSON.stringify({tipo: camera.tipo, id: camera.id}),
                success: function() {
                    camera.auto = setInterval(camera.aggiorna, 2000);
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
            camera.auto = setInterval(camera.aggiorna, 2000);
            $('#operazioni').css('display', 'block');
            $('#salvataggio').css('display', 'none');
        });
    },
    
    aggiorna: function() {
        $.ajax({
            url: 'aggiorna',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function() {
                $('#pagina').html('<img src="/img/foto.jpg?nc=' + Date.now().toString() + '" class="w3-image">');
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    },
    
};

$(document).ready(camera.init());
