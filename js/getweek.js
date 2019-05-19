
function getWeek (month, days) {
    var btnClass = ' btn btn-outline-';
    switch(month) {
      case '02':
      case '06':
          btnClass += 'primary'; break;
      case '03':
      case '07':
          btnClass += 'info'; break;
      case '04':
      case '08':
          btnClass += 'success'; break;
      default: btnClass += 'primary';
    }
    var html = ['<tr>'];
    for (var i=0; i<days.length; i++) {
        var day = days[i];
        if (day) {
            var dayAndMonth = day + '-' + month;
            var td = '<td><a href="#" \
                class="day' + dayAndMonth + btnClass + (i >= 5 ? ' weekend' : '') + '" \
                onclick="select(\'' + dayAndMonth + '\');return false">' + parseInt(day,10) + '</a></td>';
            html.push(td);
        } else {
            html.push('<td></td>');
        }
    }
    html.push('</tr>');
    return html.join('\n');
}