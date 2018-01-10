var camera = {
    
    init: function() {
        camera.init_home();
        camera.init_foto();
        camera.init_video();
        camera.init_gif();
        camera.init_slow();
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
                    $('#gif_icon').html('toys');
                    $('#gif_icon').removeClass('w3-spin');
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
            $('#gif_icon').html('refresh');
            $('#gif_icon').addClass('w3-spin');
            var count = 1;
            var timer = setInterval(function() {
                if (count <= 10) {
                    $('#gif p').html('Scatto<br>' + count);
                    count++;
                }
                else {
                    clearInterval(timer);
                    $('#gif p').html('<br>Creo');
                }
            }, 1000);
        });
    },
    
    init_slow: function() {
        $('#slow').on('click', function() {
            $.ajax({
                url: 'slowmotion_video',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    camera.id = Date.now().toString();
                    camera.tipo = 'SLOW';
                    var video = '<video class="elemento_anteprima" controls><source src="/img/temp/SLOW.mp4?nc=' + camera.id + '" type="video/mp4"></video>';
                    $('#anteprima').html(video);
                    $('#operazioni').css('display', 'none');
                    $('#salvataggio').css('display', 'block');
                    $('#slow_icon').html('directions_run');
                    $('#slow_icon').removeClass('w3-spin');
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
            $('#slow_icon').html('refresh');
            $('#slow_icon').addClass('w3-spin');
            $('#slow p').html('<br>REC');
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
            $.ajax({
                url: 'scarta',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
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
    }
    
};

$(document).ready(camera.init());
