var impostazioni = {
    
    init: function() {
        impostazioni.init_home();
        impostazioni.init_modifica();
        impostazioni.init_predefinite();
        impostazioni.leggi_impostazioni();
    },
    
    // Bottone home
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    init_modifica: function() {
        $('#modifica').on('click', function() {
            var sharpness = $('#sharpness').val();
            var contrast = $('#contrast').val();
            var brightness = $('#brightness').val();
            var saturation = $('#saturation').val();
            var iso = $('#iso').val();
            if (sharpness < -100 || sharpness > 100) errore.messaggio('Valore della nitidezza non valido!');
            else if (contrast < -100 || contrast > 100) errore.messaggio('Valore del contrasto non valido!');
            else if (brightness < 0 || brightness > 100) errore.messaggio('Valore della luminosit&agrave; non valido!');
            else if (saturation < -100 || saturation > 100) errore.messaggio('Valore della saturazione non valido!');
            else if (iso < 0 || iso > 1600) errore.messaggio('Valore ISO non valido!');
            else {
                $.ajax({
                    url: 'modifica_impostazioni',
                    method: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        sharpness: sharpness,
                        contrast: contrast,
                        brightness: brightness,
                        saturation: saturation,
                        iso: iso
                    }),
                    error: function() {
                        errore.messaggio('Errore del server!');
                    }
                });
            }
        });
    },
    
    init_predefinite: function() {
        $('#predefinite').on('click', function() {
            $.ajax({
                url: 'impostazioni_predefinite',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(risposta) {
                    album.leggi_impostazioni();
                },
                error: function() {
                    errore.messaggio('Errore del server!');
                }
            });
        });
    },
    
    leggi_impostazioni: function() {
        $.ajax({
            url: 'leggi_impostazioni',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(risposta) {
                $('#sharpness').val(risposta.sharpness);
                $('#contrast').val(risposta.contrast);
                $('#brightness').val(risposta.brightness);
                $('#saturation').val(risposta.saturation);
                $('#iso').val(risposta.iso);
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    }
    
};

$(document).ready(impostazioni.init());
