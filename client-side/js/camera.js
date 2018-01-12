var camera = {
    
    init: function() {
        camera.init_stato();
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
    
    // Inizializzazione variabili di stato
    init_stato: function() {
        camera.occupata = false;
        camera.video = false;
        camera.gif = false;
        camera.lapse = false;
        camera.slow = false;
        camera.stop = false;
        camera.indice = '';
    },
    
    // Bottone home
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    // Bottone impostazioni
    init_impostazioni: function() {
        $('#impostazioni').on('click', function() {
            window.location.href = '/impostazioni';
        });
    },
    
    // Controllo stato della camera
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
    
    // Richiesta di salvataggio
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
    
    // Controllo camera occupata
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
                    } else if (risposta.tipo == 'GIF') {
                        camera.gif = true;
                        camera.stato_gif();
                    } else if (risposta.tipo == 'LAPSE') {
                        camera.lapse = true;
                        camera.stato_timelapse();
                    }
                }
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    },
    
    // Avanzamento scatto della GIF
    stato_gif: function() {
        $('#gif i').addClass('w3-spin');
        var timer = setInterval(function() {
            $.ajax({
                url: 'stato_gif',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(risposta) {
                    if (risposta.stato > 0) {
                        $('#gif p').html('Scatto<br>' + risposta.stato);
                        var indice = (risposta.stato - 1).toString();
                        if (indice.length == 1) indice = '0' + indice;
                        indice = '0' + indice;
                        if (indice != camera.indice) {
                            camera.indice = indice;
                            var id = Date.now().toString();
                            $('#anteprima').html('<img src="/img/temp/GIF' + indice + '.jpg?nc=' + id + '" class="w3-image elemento_anteprima">');
                        }
                    } else {
                        camera.indice = '';
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
    
    // Controllo completamento GIF
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
    
    // Avanzamento ripresa time lapse
    stato_timelapse: function() {
        $('#lapse i').addClass('blink');
        var timer = setInterval(function() {
            $.ajax({
                url: 'stato_timelapse',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(risposta) {
                    if (risposta.stato > 0) {
                        $('#lapse p').html('Scatto<br>' + risposta.stato);
                        var indice = (risposta.stato - 1).toString();
                        if (indice.length == 1) indice = '0' + indice;
                        indice = '0' + indice;
                        if (indice != camera.indice) {
                            camera.indice = indice;
                            var id = Date.now().toString();
                            $('#anteprima').html('<img src="/img/temp/LAPSE' + indice + '.jpg?nc=' + id + '" class="w3-image elemento_anteprima">');
                        }
                    } else {
                        camera.indice = '';
                        clearInterval(timer);
                        camera.timelapse_completato();
                    }
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        }, 3000);
    },
    
    // Controllo completamento time lapse
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
        }, 3000);
    },
    
    // Bottone foto
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
    
    // Bottone video
    init_video: function() {
        $('#video').on('click', function() {
            if (!camera.occupata) {
                
                // Inizio registrazione
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
                    
                    // Fine registrazione
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
                } else errore.messaggio('Camera gi&agrave; occupata!');
                
            }
        });
    },
    
    // Bottone GIF
    init_gif: function() {
        $('#gif').on('click', function() {
            if (!camera.occupata) {
                
                // Inizio scatto
                camera.occupata = true;
                camera.gif = true;
                camera.stop = false;
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
                
            } else {
                
                // Fine scatto
                if (camera.gif) {
                    camera.gif = false;
                    camera.stop = true;
                    $.ajax({
                        url: 'interrompi_gif',
                        method: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        error: function() {
                            errore.messaggio('Errore del server!');
                        }
                    });
                } else errore.messaggio('Camera gi&agrave; occupata!');
                
            }
        });
    },
    
    // Bottone time lapse
    init_lapse: function() {
        $('#lapse').on('click', function() {
            if (!camera.occupata) {
                
                // Inizio ripresa
                camera.occupata = true;
                camera.lapse = true;
                camera.stop = false;
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
                
            } else {
                
                // Fine ripresa
                if (camera.lapse) {
                    camera.lapse = false;
                    camera.stop = true;
                    $.ajax({
                        url: 'interrompi_timelapse',
                        method: 'POST',
                        contentType: 'application/json',
                        dataType: 'json',
                        error: function() {
                            errore.messaggio('Errore del server!');
                        }
                    });
                } else errore.messaggio('Camera gi&agrave; occupata!');
                
            }
        });
    },
    
    // Bottone slowmotion
    init_slow: function() {
        $('#slow').on('click', function() {
            if (!camera.occupata) {
                
                // Inizio ripresa
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
                
                // Fine ripresa
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
                } else errore.messaggio('Camera gi&agrave; occupata!');
                
            }
        });
    },
    
    // Bottone salvataggio
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
    
    // Bottone scarto
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
