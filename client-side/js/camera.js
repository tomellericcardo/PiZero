var camera = {
    
    init: function() {
        camera.occupata = false;
        camera.video = false;
        camera.slow = false;
        camera.init_home();
        camera.init_impostazioni();
        camera.init_foto();
        camera.init_video();
        camera.init_gif();
        camera.init_lapse();
        camera.init_slow();
        camera.init_salva();
        camera.init_scarta();
        camera.init_uscita();
    },
    
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    init_impostazioni: function() {
        $('#impostazioni').on('click', function() {
            window.location.href = '/impostazioni';
        });
    },
    
    init_foto: function() {
        $('#foto').on('click', function() {
            if (camera.occupata)
                errore.messaggio('Camera gi&agrave; occupata!');
            else {
                camera.occupata = true;
                $.ajax({
                    url: 'scatta_foto',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function() {
                        camera.id = Date.now().toString();
                        camera.tipo = 'FOTO';
                        var anteprima = '<img src="/img/temp/FOTO.jpg?nc=' + camera.id + '" class="w3-image elemento_anteprima">';
                        $('#anteprima').html(anteprima);
                        $('#operazioni').css('display', 'none');
                        $('#salvataggio').css('display', 'block');
                    },
                    error: function() {
                        errore.messaggio('Errore del server!');
                    }
                });
            }
        });
    },
    
    init_video: function() {
        $('#video').on('click', function() {
            if (!camera.occupata) {
                camera.occupata = true;
                camera.video = true;
                $.ajax({
                    url: 'registra_video',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function() {
                        $('#video i').html('pause');
                        $('#video p').html('REC');
                        $('#video p').addClass('blink');
                    },
                    error: function() {
                        errore.messaggio('Errore del server!');
                    }
                });
            } else {
                if (camera.video) {
                    camera.video = false;
                    $.ajax({
                        url: 'interrompi_video',
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
                            $('#video i').html('videocam');
                            $('#video p').html('Video');
                            $('#video p').removeClass('blink');
                        },
                        error: function() {
                            errore.messaggio('Errore del server!');
                        }
                    });
                } else
                    errore.messaggio('Camera gi&agrave; occupata!');
            }
        });
    },
    
    init_gif: function() {
        $('#gif').on('click', function() {
            if (camera.occupata)
                errore.messaggio('Camera gi&agrave; occupata!');
            else {
                camera.occupata = true;
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
                        $('#gif i').removeClass('w3-spin');
                        $('#gif p').html('<br>GIF');
                    },
                    error: function() {
                        errore.messaggio('Errore del server!');
                    }
                });
                $('#gif i').addClass('w3-spin');
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
            }
        });
    },
    
    init_lapse: function() {
        $('#lapse').on('click', function() {
            if (camera.occupata)
                errore.messaggio('Camera gi&agrave; occupata!');
            else {
                camera.occupata = true;
                $.ajax({
                    url: 'timelapse_video',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function() {
                        $('#lapse i').addClass('blink');
                        var count = 1;
                        var timer = setInterval(function() {
                            if (count <= 120) {
                                $('#lapse p').html('Scatto<br>' + count);
                                count++;
                            }
                            else {
                                clearInterval(timer);
                                $('#lapse p').html('<br>Creo');
                                camera.lapse_completato();
                            }
                        }, 30000);
                    },
                    error: function() {
                        errore.messaggio('Errore del server!');
                    }
                });
            }
        });
    },
    
    lapse_completato: function() {
        $.ajax({
            url: 'timelapse_completato',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(risposta) {
                if (risposta.completato) {
                    camera.id = Date.now().toString();
                    camera.tipo = 'LAPSE';
                    var video = '<video class="elemento_anteprima" controls><source src="/img/temp/LAPSE.mp4?nc=' + camera.id + '" type="video/mp4"></video>';
                    $('#anteprima').html(video);
                    $('#operazioni').css('display', 'none');
                    $('#salvataggio').css('display', 'block');
                    $('#lapse p').html('Time<br>Lapse');
                    $('#lapse i').removeClass('blink');
                }
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    },
    
    init_slow: function() {
        $('#slow').on('click', function() {
            if (!camera.occupata) {
                camera.occupata = true;
                camera.slow = true;
                $.ajax({
                    url: 'registra_slowmotion',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function() {
                        $('#slow i').html('pause');
                        $('#slow p').html('<br>REC');
                        $('#slow p').addClass('blink');
                    },
                    error: function() {
                        errore.messaggio('Errore del server!');
                    }
                });
            } else {
                if (camera.slow) {
                    camera.slow = false;
                    $.ajax({
                        url: 'interrompi_slowmotion',
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
                            $('#slow i').html('directions_run');
                            $('#slow p').html('Slow<br>Motion');
                            $('#slow p').removeClass('blink');
                        },
                        error: function() {
                            errore.messaggio('Errore del server!');
                        }
                    });
                } else
                    errore.messaggio('Camera gi&agrave; occupata!');
            }
        });
    },
    
    init_salva: function() {
        $('#salva').on('click', function() {
            $.ajax({
                url: 'salva_elemento',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({tipo: camera.tipo, id: camera.id}),
                success: function() {
                    camera.occupata = false;
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
                url: 'scarta_elemento',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function() {
                    camera.occupata = false;
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
    
    init_uscita: function() {
        window.onbeforeunload = function() {
            if (camera.occupata) {
                return 'La fotocamera &egrave; in uso, attendi...';
            }
        };
    }
    
};

$(document).ready(camera.init());
