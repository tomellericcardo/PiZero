var camera = {
    
    init: function() {
        camera.occupata = false;
        camera.video = false;
        camera.slow = false;
        camera.init_home();
        camera.init_impostazioni();
        camera.controlla_stato();
        camera.init_foto();
        camera.init_video();
        camera.init_gif();
        camera.init_lapse();
        camera.init_slow();
        camera.init_salva();
        camera.init_scarta();
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
    
    controlla_stato: function() {
        $.ajax({
            url: 'elemento_completo',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(risposta) {
                if (risposta.tipo) {
                    camera.tipo = risposta.tipo;
                    camera.richiedi_salvataggio();
                } else {
                    $('#operazioni').css('display', 'block');
                    $('#salvataggio').css('display', 'none');
                    camera.camera_occupata();
                }
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    },
    
    richiedi_salvataggio: function() {
        camera.id = Date.now().toString();
        var anteprima;
        if (camera.tipo == 'FOTO') anteprima = '<img src="/img/temp/FOTO.jpg?nc=' + camera.id + '" class="w3-image elemento_anteprima">';
        else if (camera.tipo == 'GIF') anteprima = '<img src="/img/temp/GIF.gif?nc=' + camera.id + '" class="w3-image elemento_anteprima">';
        else anteprima = '<video class="elemento_anteprima" controls><source src="/img/temp/' + camera.tipo + '.mp4?nc=' + camera.id + '" type="video/mp4"></video>';
        $('#anteprima').html(anteprima);
        $('#operazioni').css('display', 'none');
        $('#salvataggio').css('display', 'block');
    },
    
    camera_occupata: function() {
        $.ajax({
            url: 'camera_occupata',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(risposta) {
                if (risposta.tipo) {
                    camera.occupata = true;
                    if (risposta.tipo == 'VIDEO') {
                        camera.video = true;
                        $('#video i').html('pause');
                        $('#video p').html('REC');
                        $('#video p').addClass('blink');
                    } else if (risposta.tipo == 'SLOW') {
                        camera.slow = true;
                        $('#slow i').html('pause');
                        $('#slow p').html('<br>REC');
                        $('#slow p').addClass('blink');
                    }
                    else if (risposta.tipo == 'GIF') camera.stato_gif();
                    else if (risposta.tipo == 'LAPSE') camera.stato_timelapse();
                }
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    },
    
    stato_gif: function() {
        $('#gif i').addClass('w3-spin');
        var timer = setInterval(function() {
            $.ajax({
                url: 'stato_gif',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(risposta) {
                    if (risposta.stato < 10) {
                        $('#gif p').html('Scatto<br>' + risposta.stato);
                    } else {
                        clearInterval(timer);
                        camera.gif_completata();
                    }
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        }, 1000);
    },
    
    gif_completata: function() {
        $('#gif p').html('<br>Creo');
        var timer = setInterval(function() {
            $.ajax({
                url: 'elemento_completo',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(risposta) {
                    if (risposta.tipo == 'GIF') {
                        clearInterval(timer);
                        camera.id = Date.now().toString();
                        camera.tipo = 'GIF';
                        $('#anteprima').html('<img src="/img/temp/GIF.gif?nc=' + camera.id + '" class="w3-image elemento_anteprima">');
                        $('#operazioni').css('display', 'none');
                        $('#salvataggio').css('display', 'block');
                        $('#gif i').removeClass('w3-spin');
                        $('#gif p').html('<br>GIF');
                    }
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        }, 3000);
    },
    
    stato_timelapse: function() {
        $('#lapse i').addClass('blink');
        var timer = setInterval(function() {
            $.ajax({
                url: 'stato_timelapse',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(risposta) {
                    if (risposta.stato < 120) {
                        $('#lapse p').html('Scatto<br>' + risposta.stato);
                    } else {
                        clearInterval(timer);
                        camera.timelapse_completato();
                    }
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        }, 10000);
    },
    
    timelapse_completato: function() {
        $('#lapse p').html('<br>Creo');
        var timer = setInterval(function() {
            $.ajax({
                url: 'elemento_completo',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(risposta) {
                    if (risposta.tipo == 'LAPSE') {
                        clearInterval(timer);
                        camera.id = Date.now().toString();
                        camera.tipo = 'LAPSE';
                        var video = '<video class="elemento_anteprima" controls><source src="/img/temp/LAPSE.mp4?nc=' + camera.id + '" type="video/mp4"></video>';
                        $('#anteprima').html(video);
                        $('#operazioni').css('display', 'none');
                        $('#salvataggio').css('display', 'block');
                        $('#lapse i').removeClass('blink');
                        $('#lapse p').html('Time<br>Lapse');
                    }
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        }, 10000);
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
                        camera.stato_gif();
                    },
                    error: function() {
                        errore.messaggio('Errore del server!');
                    }
                });
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
                        camera.stato_timelapse();
                    },
                    error: function() {
                        errore.messaggio('Errore del server!');
                    }
                });
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
    
    // Salvataggio dell'elemento
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
    
    // Scarto dell'elemento
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
    }
    
};

$(document).ready(camera.init());
