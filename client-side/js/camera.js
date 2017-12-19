var camera = {
    
    init: function() {
        camera.init_home();
    },
    
    init_home: function() {
        $('#home').on('click', function() {
            window.location.href = '/home';
        });
    }
    
};

$(document).ready(camera.init());
