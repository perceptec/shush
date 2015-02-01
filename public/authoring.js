$(document).ready(function() {
  var $form = $('form#input')
    , $progress = $('#progress')
    , $message = $('#note')
    , $url = $('#url')
    , $when = $('#when')
    , $readSelect = $("#expire-read")
    , $timeSelect = $("#expire-time")
    , $times = $("#expire-at");

  function toggleTimeSelect(evt) {
    $times.toggle($timeSelect.is(":checked"));
  }

  function sendMessage(err, buff) {
    if (!err) {
      var data = $form.serializeObject();
      data.secret = buff.toString('hex');

      $.post($form.attr('action'), data).done(showUrl);
    } else {
      alert("Could not Secrest this Secrest")
    }
  }

  function showUrl(data) {
    var timeText = data.time ? "in #{data.time}" : "when read";

    $url.val(data.url);
    $when.text(timeText)
      .parents().show();
    $form.hide();
  }

  function progressReporter(obj) {
    var what = obj.what
      , i = obj.i
      , total = obj.total;

    console.log(what);
  }

  function encrypt(msg) {
    triplesec.encrypt({
      data:          new triplesec.Buffer(msg),
      key:           new triplesec.Buffer('top-secret-pw'),
      progress_hook: progressReporter
    }, sendMessage);
  }

  $readSelect.on("click", toggleTimeSelect);
  $timeSelect.on("click", toggleTimeSelect);

  $form.on('submit', function(evt) {
    evt.preventDefault();
    var msg = $message.val()
    encrypt(msg);
  });

});
