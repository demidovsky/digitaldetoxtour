$(function() {
  const FB_KEY = '6c8bd7c790c575e2d7697d8edfcb65ff';

  const APP_ID = '6EF173D0-C581-F6CB-FF56-B4445D793900';
  const API_KEY = '0F6C02EC-8FBF-0F04-FFA8-6C771BC72100';

  Backendless.initApp( APP_ID, API_KEY )


  $.ajax({
    type: 'GET',
    url: 'https://api.backendless.com/6EF173D0-C581-F6CB-FF56-B4445D793900/72FAAD06-1D31-0606-FF72-337CCBF7A700/data/Votes',
    // data: { userId: userId, vote: dates },
    dataType:'json',
    contentType: 'application/json; charset=utf-8',
    success: function (votes) {
      console.log('VOTES', votes);

      for (var i=0; i<votes.length; i++) {
        var person = '<img title="' + votes[i].userName + '" alt="' + votes[i].userName + '" style="border-radius: 50%" src="http://graph.facebook.com/' + votes[i].userId + '/picture?type=large&width=32&height=32">'
        var dates = JSON.parse(votes[i].dates);
        for (var day in dates) {
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
});
