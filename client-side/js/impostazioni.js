var impostazioni = {
    
    init: function() {
        impostazioni.init_home();
        impostazioni.init_modifica();
        impostazioni.init_predefinite();
        impostazioni.init_connetti();
        impostazioni.leggi_impostazioni();
    },
    
    // Bottone home
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    // Bottone applicazione modifiche
    init_modifica: function() {
        $('#modifica').on('click', function() {
            var sharpness = $('#sharpness').val();
            var contrast = $('#contrast').val();
            var brightness = $('#brightness').val();
            var saturation = $('#saturation').val();
            var iso = $('#iso').val();
            if (sharpness < -100 || sharpness > 100) messaggio.errore('Valore della nitidezza non valido!');
            else if (contrast < -100 || contrast > 100) messaggio.errore('Valore del contrasto non valido!');
            else if (brightness < 0 || brightness > 100) messaggio.errore('Valore della luminosit&agrave; non valido!');
            else if (saturation < -100 || saturation > 100) messaggio.errore('Valore della saturazione non valido!');
            else if (iso < 0 || iso > 1600) messaggio.errore('Valore ISO non valido!');
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
                    success: function() {
                        messaggio.successo('Impostazioni modificate!');
                    },
                    error: function() {
                        messaggio.errore('Errore del server!');
                    }
                });
            }
        });
    },
    
    // Bottone impostazioni predefinite
    init_predefinite: function() {
        $('#predefinite').on('click', function() {
            $.ajax({
                url: 'modifica_impostazioni',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    sharpness: 0,
                    contrast: 0,
                    brightness: 50,
                    saturation: 0,
                    iso: 0
                }),
                success: function() {
                    messaggio.successo('Impostazioni predefinite applicate!');
                },
                error: function() {
                    messaggio.errore('Errore del server!');
                }
            });
        });
    },
    
    // Bottone connessione
    init_connetti: function() {
        $('#connetti').on('click', function() {
            $.ajax({
                url: 'connetti',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                error: function() {
                    messaggio.errore('Errore del server!');
                }
            });
        });
        window.location.href = '/home';
    },
    
    // Lettura delle impostazioni
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
                messaggio.errore('Errore del server!');
            }
        });
    }
    
};

$(document).ready(impostazioni.init());
