function vote(route) {
    if (
        route == 1 && localStorage.getItem('route1') ||
        route == 2 && localStorage.getItem('route2') ||
        route == 3 && localStorage.getItem('route3')
    ) return;
    $.ajax({
        type: 'POST',
        url: 'https://api.backendless.com/B8C6CF0E-7B1E-1AE0-FFA5-4311B726D000/23CF02E9-8889-5456-FF36-D0E097AB1C00/data/routes_table',
        data: JSON.stringify({ "route": route }),
        dataType:'json',
        contentType: 'application/json; charset=utf-8',
        success: function () {
            console.log('vote succeeded');
            localStorage.setItem('route' + route, true);
            $('.route-' + route).addClass('active').html('<i class="fa fa-check mr0"></i>');
        }
    });
}


function join() {
    if (localStorage.getItem('name')) return;
    var name = $('#join_name').val();
    var routes = [
        !!localStorage.getItem('route1'),
        !!localStorage.getItem('route2'),
        !!localStorage.getItem('route3')
    ].join(' ');

    $.ajax({
        type: 'POST',
        url: 'https://api.backendless.com/B8C6CF0E-7B1E-1AE0-FFA5-4311B726D000/23CF02E9-8889-5456-FF36-D0E097AB1C00/data/team_table',
        data: JSON.stringify({ "name": name, "routes": routes }),
        dataType:'json',
        contentType: 'application/json; charset=utf-8',
        success: function () {
            console.log('vote succeeded');
            localStorage.setItem('name', name);
            $('#join_button').addClass('active').html('<i class="fa fa-check mr0"></i>');
            $('#join_name').attr("disabled", "disabled").val(name);
        }
    });
}


(function ($, window, document, undefined) {
    'use strict';

    var route1 = localStorage.getItem('route1');
    var route2 = localStorage.getItem('route2');
    var route3 = localStorage.getItem('route3');
    if (route1) $('.route-1').addClass('active').html('<i class="fa fa-check mr0"></i>');
    if (route2) $('.route-2').addClass('active').html('<i class="fa fa-check mr0"></i>');
    if (route3) $('.route-3').addClass('active').html('<i class="fa fa-check mr0"></i>');
    

    $('#join_name').keypress(function(e) {
        if(e.which == 13) {
            join();
        }
    });

    var name = localStorage.getItem('name');
    if (name) {
        $('#join_button').addClass('active').html('<i class="fa fa-check mr0"></i>');
        $('#join_name').attr("disabled", "disabled").val(name);
    }


})(jQuery, window, document);

