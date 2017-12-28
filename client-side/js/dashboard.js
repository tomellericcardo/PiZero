var dashboard = {
    
    init: function() {
        dashboard.init_home();
        dashboard.aggiorna_contatori();
        setInterval(dashboard.aggiorna_contatori, 1000);
    },
    
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    },
    
    aggiorna_contatori: function() {
        $.ajax({
            url: 'leggi_statistiche',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function(risposta) {
                
                // Temperatura
                $('#temp').html(risposta.temp);
                dashboard.colore_temperatura(parseFloat(risposta.temp));
                
                // CPU
                $('#cpu_perc').html(risposta.cpu);
                $('#cpu_bar').css('width', risposta.cpu);
                
                // RAM
                $('#ram_perc').html(risposta.ram_perc);
                $('#ram_bar').css('width', risposta.ram_perc);
                $('#ram_stat').html('<b>Disponibili ' + risposta.ram_free + '</b> su ' + risposta.ram_tot);
                
                // SD
                $('#sd_perc').html(risposta.sd_perc);
                $('#sd_bar').css('width', risposta.sd_perc);
                $('#sd_stat').html('<b>Disponibili ' + risposta.sd_free + '</b> su ' + risposta.sd_tot);
                
            },
            error: function() {
                errore.messaggio('Errore del server!');
            }
        });
    },
    
    colore_temperatura: function(temp) {
        if (temp <= 0) {
            $('#temp').css('color', '#2196f3');
        } else if (temp > 0 && temp <= 10) {
            $('#temp').css('color', '#009688');
        } else if (temp > 10 && temp <= 40) {
            $('#temp').css('color', '#4caf50');
        } else if (temp > 40 && temp <= 60) {
            $('#temp').css('color', '#ffc107');
        } else if (temp > 60 && temp <= 70) {
            $('#temp').css('color', '#ff5722');
        } else if (temp > 70) {
            $('#temp').css('color', '#f44336');
        }
    }
    
};

$(document).ready(dashboard.init());
