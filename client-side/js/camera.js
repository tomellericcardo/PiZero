var camera = {
    
    init: function() {
        camera.init_home();
        camera.init_foto();
        camera.init_video();
        camera.init_gif();
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
                    $('#anteprima').html('<img src="/img/temp/FOTO.jpg?nc=' + camera.id + '" class="w3-image elemento_anteprima">');
                    $('#operazioni').css('display', 'none');
                    $('#salvataggio').css('display', 'block');
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        });
    },
    
    init_video: function() {
        $('#video').bind('mousedown touchstart', function() {
            $.ajax({
                url: 'registra_video',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    $('#operazioni div').css('visibility', 'hidden');
                    $('#operazioni #video div').css('visibility', 'visible');
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        }).bind('mouseup touchend', function() {
            $.ajax({
                url: 'stop_video',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    camera.id = Date.now().toString();
                    camera.tipo = 'VIDEO';
                    var video = '<video class="elemento_anteprima" controls><source src="/img/temp/VIDEO.mp4?nc=' + camera.id + '" type="video/mp4"></video>';
                    $('#anteprima').html(video);
                    $('#operazioni').css('display', 'none');
                    $('#salvataggio').css('display', 'block');
                    $('#operazioni div').css('visibility', 'visible');
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        });
    },
    
    init_gif: function() {
        $('#gif').on('click', function() {
            $.ajax({
                url: 'scatta_gif',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    camera.id = Date.now().toString();
                    camera.tipo = 'GIF';
                    $('#anteprima').html('<img src="/img/temp/GIF.gif?nc=' + camera.id + '" class="w3-image elemento_anteprima">');
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
                    $('#anteprima').html('<img src="/img/default.jpg" class="w3-image elemento_anteprima">');
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
            $('#anteprima').html('<img src="/img/default.jpg" class="w3-image elemento_anteprima">');
            $('#operazioni').css('display', 'block');
            $('#salvataggio').css('display', 'none');
        });
    }
    
};

$(document).ready(camera.init());
