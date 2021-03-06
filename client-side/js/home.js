var home = {
    
    init: function() {
        home.init_camera();
        home.init_album();
        home.init_dashboard();
        home.init_impostazioni();
        home.init_riavvia();
        home.init_spegni();
    },
    
    // Bottone camera
    init_camera: function() {
        $('#camera').on('click', function() {
            window.location.href = '/camera';
        });
    },
    
    
    // Bottone album
    init_album: function() {
        $('#album').on('click', function() {
            window.location.href = '/album';
        });
    },
    
    
    // Bottone dashboard
    init_dashboard: function() {
        $('#dashboard').on('click', function() {
            window.location.href = '/dashboard';
        });
    },
    
    
    // Bottone impostazioni
    init_impostazioni: function() {
        $('#impostazioni').on('click', function() {
            window.location.href = '/impostazioni';
        });
    },
    
    
    // Bottone riavvio
    init_riavvia: function() {
        
        // Apertura modal
        $('#riavvia').on('click', function() {
            $('#modal_riavvia').css('display', 'block');
        });
        
        // Conferma riavvio
        $('#conferma_riavvia').on('click', function() {
            $.ajax({
                url: 'riavvia',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            });
            window.location.href = '/bye';
        });
        
        // Chiusura modal
        $('#chiudi_riavvia, #sfondo_riavvia').on('click', function() {
            $('#modal_riavvia').css('display', 'none');
        });
        
    },
    
    
    // Bottone spegnimento
    init_spegni: function() {
        
        // Apertura modal
        $('#spegni').on('click', function() {
            $('#modal_spegni').css('display', 'block');
        });
        
        // Conferma arresto
        $('#conferma_spegni').on('click', function() {
            $.ajax({
                url: 'spegni',
                method: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            });
            window.location.href = '/bye';
        });
        
        // Chiusura modal
        $('#chiudi_spegni, #sfondo_spegni').on('click', function() {
            $('#modal_spegni').css('display', 'none');
        });
        
    }
    
};

$(document).ready(home.init());
