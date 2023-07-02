var BASE_URL = 'https://api.backendless.com/24BDAC9E-D7B1-FDBC-FF79-5107215EE200/1F9D712F-6D7E-C91B-FFAC-30BB24F76000';
var FB_KEY = '6c8bd7c790c575e2d7697d8edfcb65ff';
var APP_ID = '24BDAC9E-D7B1-FDBC-FF79-5107215EE200';
var API_KEY = '1F9D712F-6D7E-C91B-FFAC-30BB24F76000';
Backendless.initApp( APP_ID, API_KEY )


$(function() {
  // const FB_KEY = '6c8bd7c790c575e2d7697d8edfcb65ff';
  // const APP_ID = '6EF173D0-C581-F6CB-FF56-B4445D793900';
  // const API_KEY = '0F6C02EC-8FBF-0F04-FFA8-6C771BC72100';
  // Backendless.initApp( APP_ID, API_KEY )

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '2054976824825051',
      xfbml      : true,
      version    : 'v3.0'
    });
    FB.AppEvents.logPageView();
    checkLoginOnLoad();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


});








var userId = null;
var userName = null;

function checkLoginOnLoad() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      // the user is logged in and has authenticated your
      // app, and response.authResponse supplies
      // the user's ID, a valid access token, a signed
      // request, and the time the access token 
      // and signed request each expire
      var uid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;


      var whereClause = "id = " + uid;
      var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
       
      // ***********************************************************
      // Non-Blocking API:
      // ***********************************************************
      Backendless.Data.of( "Users" ).find( queryBuilder )
       .then( function( found ) {
          console.log(found);

          userId = uid;
          userName = found[0].name;
          showLogin(uid, found[0].name);
        })
       .catch( function( fault ) {
          // an error has occurred, the error code can be retrieved with fault.statusCode
          console.error(fault);
        });

    } else if (response.status === 'not_authorized') {
      // the user must go through the login flow
      // to authorize your app or renew authorization
    } else {
      // the user isn't logged in to Facebook.
    }
   });
}




function showLogin(uid, name) {
  $('#signin').html(
    '<img style="border-radius: 50%" src="http://graph.facebook.com/' + uid + '/picture?type=large&width=42&height=42">' +
    '<span style="padding-left:5px;">' + name + '</span>'
  );
}



/*
  $('#signin').on('click', function (e) {
    e.preventDefault();


    FB.login(function(response) {
    if (response.authResponse) {
     console.log('Welcome!  Fetching your information.... ');
     FB.api('/me', function(response) {
       console.log('Good to see you, ' + response.name + '.');

       var user = new Backendless.User();
      user.name = response.name;
      user.password = response.id;
      user.id = response.id;
      Backendless.UserService.register( user );

      doFB();
     });
    } else {
     console.log('User cancelled login or did not fully authorize.');
    }
});


return;

    var facebookFieldsMapping = { 'name': 'name', 'picture': 'picture' };
    var permissions = [];
    var stayLoggedIn = true;
    var options;

    Backendless.UserService.loginWithFacebook( facebookFieldsMapping,
                                              permissions,
                                              stayLoggedIn,
                                              options ) 
   .then( function( result ) {
    console.info(result);
    })
   .catch( function( error ) {
    console.error(error);
    });

    // var container = document.getElementById('auth_container');
    // Backendless.UserService.loginWithFacebook(facebookFieldsMapping, permissions, callback, container)
      // .then( function( result ) {
      // })
      // .catch( function( error ) {
      // }); 
  });
*/





function login(callback) {
  if (userId) {
    callback();
  } else {

    FB.login(function(response) {
      if (response.authResponse) {
       console.log('Welcome!  Fetching your information.... ');
       FB.api('/me', function(response) {
         console.log('Good to see you, ' + response.name + '.');
        var user = new Backendless.User();
        user.name = response.name;
        user.password = response.id;
        user.email = 'me@dimmy.pro';
        user.id = response.id;
        Backendless.UserService.register( user );

        userId = user.id;
        userName = user.name;

        showLogin(user.id, user.name);

        callback();
       });
      } else {
       console.log('User cancelled login or did not fully authorize.');
      }
    });
  }
}



function select(day) {

  var dates = JSON.parse(localStorage.getItem('dates2'));
  if (!dates) dates = {};

  if (dates[day]) {
    delete dates[day];
    dayText = parseInt(day.substr(0,2), 10);
    $('.day' + day).removeClass('active').html(dayText).blur();
  } else {
    dates[day] = true;    
    $('.day' + day).addClass('active').html('<i class="fa fa-check mr0"></i>')
  }

  localStorage.setItem('dates2', JSON.stringify(dates));
}





function sendDates() {
    var dates = JSON.parse(localStorage.getItem('dates2'));
    if (!dates) {
      alert('Сначала нужно выбрать даты');
      return;
    }
    console.log('Sending: ', dates);

    login(function() {

      var whereClause = "userId = " + userId;
      var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
      var objectId;
      // ***********************************************************
      // Non-Blocking API:
      // ***********************************************************
      Backendless.Data.of( "dates_table" ).find( queryBuilder )
       .then( function( found ) {
          console.log('found', found);

          if (found.length) objectId = found[0].objectId;

          console.log(JSON.stringify({ objectId: objectId, userId: userId, userName: userName, dates: dates }));

          $.ajax({
            type: 'PUT',
            url: BASE_URL + '/data/dates_table',
            data: JSON.stringify({ objectId: objectId, userId: userId, userName: userName, dates: JSON.stringify(dates) }),
            dataType:'json',
            contentType: 'application/json; charset=utf-8',
            success: function () {
                alert('Принято! Если понадобится, можно изменить выбор и отправить заново.')
            },
            error: function (response) {
                alert('Что-то не так, попробуйте ещё. ' + response.message)
            }
          });


        })
       .catch( function( fault ) {
          // an error has occurred, the error code can be retrieved with fault.statusCode
          console.error(fault);
        });


      
    });
}






function vote(route) {
    if (
        route == 1 && localStorage.getItem('route1') ||
        route == 2 && localStorage.getItem('route2') ||
        route == 3 && localStorage.getItem('route3')
    ) return;
    $.ajax({
        type: 'POST',
        url: BASE_URL + '/data/routes_table',
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
        url: BASE_URL + '/data/team_table',
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

    if (!$('#confirm').length) return;

    var route201 = localStorage.getItem('route201');
    var route202 = localStorage.getItem('route202');
    var route203 = localStorage.getItem('route203');
    console.log(route201, route202, route203);
    if (route201) $('.route-201').addClass('active').html('<i class="fa fa-check mr0"></i>');
    if (route202) $('.route-202').addClass('active').html('<i class="fa fa-check mr0"></i>');
    if (route203) $('.route-203').addClass('active').html('<i class="fa fa-check mr0"></i>');
    

    // $('#join_name').keypress(function(e) {
    //     if(e.which == 13) {
    //         join();
    //     }
    // });

    // var name = localStorage.getItem('name');
    // if (name) {
    //     $('#join_button').addClass('active').html('<i class="fa fa-check mr0"></i>');
    //     $('#join_name').attr("disabled", "disabled").val(name);
    // }

  $('#confirm').click(sendDates);

})(jQuery, window, document);







function showResults () {
  // const FB_KEY = '6c8bd7c790c575e2d7697d8edfcb65ff';
  // const APP_ID = '6EF173D0-C581-F6CB-FF56-B4445D793900';
  // const API_KEY = '0F6C02EC-8FBF-0F04-FFA8-6C771BC72100';
  // Backendless.initApp( APP_ID, API_KEY )


  $.ajax({
    type: 'GET',
    url: BASE_URL + '/data/dates_table',
    // data: { userId: userId, vote: dates },
    dataType:'json',
    contentType: 'application/json; charset=utf-8',
    success: function (votes) {
      console.log('VOTES', votes);

      for (var i=0; i<votes.length; i++) {
        var person = '<img title="' + votes[i].userName + '" alt="' + votes[i].userName + '" style="border-radius: 50%" src="http://graph.facebook.com/' + votes[i].userId + '/picture?type=large&width=32&height=32">'
        var dates = JSON.parse(votes[i].dates);
        for (var day in dates) {
          console.log(day);
          $('.day' + day).append(person);
        }

        $('#team').append('<li class="list-group-item">' + person + ' &nbsp; ' + votes[i].userName + '</li>');
      }

      $('[class^="day"]').each(function(item, index) {
        if ($(this).find('img').length > 6) {
          $(this).addClass('active');
        }
      }); 
    },
    error: function () {
      console.error('Cannot load votes');
    }
  });
}


function showSelection() {
  var dates = JSON.parse(localStorage.getItem('dates2'));
  console.log(dates);
  for (var i in dates) {
    $('.day' + i).addClass('active').html('<i class="fa fa-check mr0"></i>')
  }
}

  


$(function() {
  if ($('#team_calendar').length) showResults();
  else showSelection();
});
