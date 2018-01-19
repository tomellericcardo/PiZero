var messaggio = {
    
    init: function() {
        messaggio.init_chiudi_successo();
        messaggio.init_chiudi_errore();
    },
    
    // Bottone chiusura successo
    init_chiudi_successo: function() {
        $('#chiudi_successo, #sfondo_successo').on('click', function() {
            $('#successo').css('display', 'none');
        });
    },
    
    // Bottone chiusura errore
    init_chiudi_errore: function() {
        $('#chiudi_errore, #sfondo_errore').on('click', function() {
            $('#errore').css('display', 'none');
        });
    },
    
    // Messaggio di successo
    successo: function(testo) {
        $('#messaggio_successo').html(testo);
        $('#successo').css('display', 'block');
    },
    
    // Messaggio di errore
    errore: function(testo) {
        $('#messaggio_errore').html(testo);
        $('#errore').css('display', 'block');
    }
    
};

$(document).ready(messaggio.init());
