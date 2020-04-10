var apikey = "AIzaSyA-ptJXKROPRzqjk18OppnYO0ZhieV-diw";

// START SEARCH
$(function() {
  //   var searchField = $("#query");

  //   $("#search-form").submit(function(e) {
  //     e.preventDefault();
  //   });

  //   $('#query').on('keyup change',function(e){
  //     if( !$(this).val() ) {
  //       $("#results").html("");
  //       $("#buttons").html("");
  //      }
  //     else {
  //       search();
  //     }
  //   });

  //setup before functions
  var typingTimer;
  var doneTypingInterval = 1000;
  var doneRandNoInterval = 100;
  var searchField = $("#query");
  var quotes = new Array(
    "Oh yeah...",
    "Just tike that!",
    "Type it up real nice.",
    "Faster!",
    "You shouldn't have read this."
  );
  var randno;
  var randnoTimer;

  //on keyup, start the countdown
  searchField.on("keyup", function() {
    if (!searchField.val()) {
      $("#results").html("");
      $("#buttons").html("");
      $("#mainActionIndicator").show();
      $(".actionMainSubText").html("Stop reading this. Search something.");
    } else {
      clearTimeout(typingTimer);
      clearTimeout(randnoTimer);

      randnoTimer = setTimeout(doneRandNo, doneRandNoInterval);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
  });

  //on keydown, clear the countdown
  searchField.on("keydown", function() {
    clearTimeout(typingTimer);
    clearTimeout(randnoTimer);
  });

  //user is "finished typing," do something
  function doneTyping() {
    $("#mainActionIndicator").hide();
    search();
  }

  function doneRandNo() {
    randno = quotes[Math.floor(Math.random() * quotes.length)];
    $(".actionMainSubText").html(randno);
  }
});

function clearAll() {
  $("#results").html("");
  $("#buttons").html("");
  $("#query").val("");
  $("#query").focus();
  $("#mainActionIndicator").show();
  $(".actionMainSubText").html("Stop reading this. Search something.");
}

// SEARCH FUNCTION
function search() {
  // clear
  $("#results").html("");
  $("#buttons").html("");

  // get form input
  q = $("#query").val(); // this probably shouldn't be created as a global

  // run get request on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      part: "snippet, id",
      q: q,
      type: "video",
      maxResults: 20,
      videoCategoryId: 10,
      key: apikey
    },
    function(data) {
      var nextPageToken = data.nextPageToken;
      var prevPageToken = data.prevPageToken;

      $.each(data.items, function(i, item) {
        // Get Output
        var output = getOutput(item);

        // display results
        $("#results").append(output);
      });

      var buttons = getButtons(prevPageToken, nextPageToken);

      // Display buttons
      $("#buttons").append(buttons);
    }
  );
}

// NEXT PAGE FUNCTION
function nextPage() {
  var token = $("#load-more-btn").data("token");
  var q = $("#load-more-btn").data("query");

  // clear
  $("#buttons").html("");

  // get form input
  q = $("#query").val(); // this probably shouldn't be created as a global

  // run get request on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      part: "snippet, id",
      q: q,
      pageToken: token,
      type: "video",
      maxResults: 10,
      videoCategoryId: 10,
      key: apikey
    },
    function(data) {
      var nextPageToken = data.nextPageToken;
      var prevPageToken = data.prevPageToken;

      $.each(data.items, function(i, item) {
        // Get Output
        var output = getOutput(item);

        // display results
        $("#results").append(output);
      });

      var buttons = getButtons(prevPageToken, nextPageToken);

      // Display buttons
      $("#buttons").append(buttons);
    }
  );
}

// PREVIOUS PAGE FUNCTION
function prevPage() {
  var token = $("#prev-button").data("token");
  var q = $("#prev-button").data("query");

  // clear
  $("#results").html("");
  $("#buttons").html("");

  // get form input
  q = $("#query").val(); // this probably shouldn't be created as a global

  // run get request on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      part: "snippet, id",
      q: q,
      pageToken: token,
      type: "video",
      maxResults: 6,
      videoCategoryId: 10,
      key: apikey
    },
    function(data) {
      var nextPageToken = data.nextPageToken;
      var prevPageToken = data.prevPageToken;

      $.each(data.items, function(i, item) {
        // Get Output
        var output = getOutput(item);

        // display results
        $("#results").append(output);
      });

      var buttons = getButtons(prevPageToken, nextPageToken);

      getLoadMore(prevPageToken, nextPageToken);

      // Display buttons
      $("#buttons").append(buttons);
    }
  );
}

// BUILD RESULTS OUTPUT
function getOutput(item) {
  var videoID = item.id.videoId;
  var title = item.snippet.title;
  var description = item.snippet.description;
  var thumb = item.snippet.thumbnails.high.url;
  var channelTitle = item.snippet.channelTitle;
  var videoDate = item.snippet.publishedAt;

  // Build output string
  var output =
    '<div class="result-item" id="' +
    videoID +
    '" onclick="youTubePlayerChangeVideoId(this.id);" title="' +
    title +
    '">' +
    '<div class="result-item-cover"><div class="play-trigger" title="Play ' +
    title +
    '"><div class="play-trigger-wrapper"><i class="material-icons">play_circle_filled</i></div></div>' +
    '<img src="' +
    thumb +
    '" alt="' +
    title +
    '"></div>' +
    '<div class="result-item-info"><div class="result-item-title">' +
    title +
    "</div>" +
    '<div class="result-item-small" title="by ' +
    channelTitle +
    '">by <span>' +
    channelTitle +
    "</span></div></div>" +
    '<!--<div class="iconholder"><i class="material-icons">add_circle</i></div>-->' +
    "</div>";

  return output;
}

// BUILD BUTTONS
function getButtons(prevPageToken, nextPageToken) {
  if (!prevPageToken) {
    var btnoutput =
      '<button id="load-more-btn" class="load-button" data-token="' +
      nextPageToken +
      '" data-query="' +
      q +
      '"' +
      'onclick = "nextPage();"><i class="material-icons">unfold_more</i> <span>Unfold More</span></button>';
  } else {
    var btnoutput =
      '<button style="display: none;" id="prev-button" class="load-button" data-token="' +
      prevPageToken +
      '" data-query="' +
      q +
      '"' +
      'onclick = "prevPage();">Prev Page</button>' +
      '<button id="load-more-btn" class="load-button" data-token="' +
      nextPageToken +
      '" data-query="' +
      q +
      '"' +
      'onclick = "nextPage();"><i class="material-icons">unfold_more</i> <span>Unfold More</span></button> <button id="clearloaded" class="load-button" onclick = "clearAll();"><i class="material-icons">clear</i> <span>Clear All</span></button>';
  }
  return btnoutput;
}

/* -------------------------------------------------------------------------------- */

/* START IFRAME API */

var youTubePlayer;

// IFRAME API FUNCTION
function onYouTubeIframeAPIReady() {
  "use strict";

  // get id of the input field which has the video ID
  var inputVideoId;

  // assign video ID value to a variable
  var videoId;

  var suggestedQuality;
  var width = 350;
  var height = 197;

  // custom player volume
  var youTubePlayerVolumeItemId = "YouTube-player-volume";
  var youTubePlayerVolumeMuteItemId = "player_volume_down";

  function onError(event) {
    youTubePlayer.personalPlayer.errors.push(event.data);
  }

  function onReady(event) {
    var player = event.target;

    player.loadVideoById({
      suggestedQuality: suggestedQuality,
      videoId: videoId
    });

    // play video after loading
    player.playVideo();

    // extended video infos
    // youTubePlayerDisplayFixedInfos();
  }

  // CHECK STATE CHANGE
  function onStateChange(event) {
    var volume = Math.round(event.target.getVolume());
    var volumeItem = document.getElementById(youTubePlayerVolumeItemId);

    if (volumeItem && Math.round(volumeItem.value) != volume) {
      volumeItem.value = volume;
    }

    switch (event.data) {
      //ended
      case 0:
        $("#player-play-pause")
          .find("i")
          .html("replay");
        $(".player-title").html(youTubePlayer.getVideoData().title);
        $(".player-title").attr("title", youTubePlayer.getVideoData().title);
        break;
      //playing
      case 1:
        $("#player-play-pause")
          .find("i")
          .html("pause");
        $(".player-title").html(youTubePlayer.getVideoData().title);
        $(".player-title").attr("title", youTubePlayer.getVideoData().title);
        break;
      //paused
      case 2:
        $("#player-play-pause")
          .find("i")
          .html("play_arrow");
        $(".player-title").html(youTubePlayer.getVideoData().title);
        $(".player-title").attr("title", youTubePlayer.getVideoData().title);
        break;
      //cued
      case 5:
        $("#player-play-pause")
          .find("i")
          .html("play_arrow");
        $(".player-title").html(youTubePlayer.getVideoData().title);
        $(".player-title").attr("title", youTubePlayer.getVideoData().title);
        break;
    }
  }

  // PLAYER OBJECT
  youTubePlayer = new YT.Player("YouTube-player", {
    videoId: videoId,
    height: height,
    width: width,
    playerVars: {
      autohide: 0,
      cc_load_policy: 0,
      controls: 0,
      disablekb: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      start: 3
    },
    events: {
      onError: onError,
      onReady: onReady,
      onStateChange: onStateChange
    }
  });

  // Add private data to the YouTube object
  youTubePlayer.personalPlayer = {
    currentTimeSliding: false,
    errors: []
  };
}

/**
 * :return: true if the player is active, else false
 */
function youTubePlayerActive() {
  "use strict";

  return youTubePlayer && youTubePlayer.hasOwnProperty("getPlayerState");
}

/**
 * Seek the video to the currentTime.
 * (And mark that the HTML slider *don't* move.)
 *
 * :param currentTime: 0 <= number <= 100
 */
function youTubePlayerCurrentTimeChange(currentTime) {
  "use strict";

  youTubePlayer.personalPlayer.currentTimeSliding = false;
  if (youTubePlayerActive()) {
    youTubePlayer.seekTo(currentTime * youTubePlayer.getDuration() / 100, true);
  }
}

/**
 * Mark that the HTML slider move.
 */
function youTubePlayerCurrentTimeSlide() {
  "use strict";

  youTubePlayer.personalPlayer.currentTimeSliding = true;
}

/**
 * Get videoId from the #YouTube-video-id HTML item value,
 * load this video, pause it
 * and show new infos.
 */
/* GET THIS */
function youTubePlayerChangeVideoId(getClickedVideoID) {
  "use strict";

  var videoId = getClickedVideoID;

  youTubePlayer.cueVideoById({
    suggestedQuality: "tiny",
    videoId: videoId
  });
  youTubePlayer.playVideo();
  youTubePlayerDisplayFixedInfos();
}

$("#player-play-pause").click(function() {
  var getstate = youTubePlayer.getPlayerState();

  if (youTubePlayerActive() && getstate == 1) {
    youTubePlayerPause();
  } else if ((youTubePlayerActive() && getstate == 2) || getstate == 0) {
    youTubePlayerPlay();
  }
});

$("#playerMobileCTRL").click(function() {
  $(".player-info-controls").toggleClass("playerMobileCTRLpullup");
});

// document.body.onkeyup = function(e){
//     if(e.keyCode == 32){
//       var getstate = youTubePlayer.getPlayerState();

//       if(youTubePlayerActive() && getstate==1) {
//         youTubePlayerPause();
//       } else if(youTubePlayerActive() && getstate==2 || getstate==0) {
//         youTubePlayerPlay();
//       }
//     }
// }

$(document).on("keypress", function(e) {
  var tag = e.target.tagName.toLowerCase();
  if (
    e.which === 32 &&
    tag != "input" &&
    tag != "textarea" &&
    tag != "button"
  ) {
    event.preventDefault();
    var getstate = youTubePlayer.getPlayerState();

    if (youTubePlayerActive() && getstate == 1) {
      youTubePlayerPause();
    } else if ((youTubePlayerActive() && getstate == 2) || getstate == 0) {
      youTubePlayerPlay();
    }
  }
});

$("#player_volume_down").click(function() {
  if (youTubePlayer.isMuted()) {
    youTubePlayer.unMute();
    $(this).html("volume_down");
  } else {
    youTubePlayer.mute();
    $(this).html("volume_off");
  }
});
/**
 * Display
 *   some video informations to #YouTube-player-infos,
 *   errors to #YouTube-player-errors
 *   and set progress bar #YouTube-player-progress.
 */
function youTubePlayerDisplayInfos() {
  "use strict";

  if (this.nbCalls === undefined || this.nbCalls >= 3) {
    this.nbCalls = 0;
  } else {
    ++this.nbCalls;
  }

  var indicatorDisplay =
    '<span id="indicator-display" title="timing of informations refreshing">' +
    ["|", "/", String.fromCharCode(8212), "\\"][this.nbCalls] +
    "</span>";

  if (youTubePlayerActive()) {
    var state = youTubePlayer.getPlayerState();

    var current = youTubePlayer.getCurrentTime();
    var duration = youTubePlayer.getDuration();
    var currentPercent = current && duration ? current * 100 / duration : 0;

    var fraction = youTubePlayer.hasOwnProperty("getVideoLoadedFraction")
      ? youTubePlayer.getVideoLoadedFraction()
      : 0;

    var url = youTubePlayer.getVideoUrl();

    if (state != -1) {
      $("#playerSplash").hide();
      $("#YouTube-player").show();
    }

    if (state == -1 || state == 0) {
      if ($(".player-info-controls").hasClass("playerMobileCTRLpullup")) {
        $(".player-info-controls").removeClass("playerMobileCTRLpullup");
        setTimeout(function() {
          $(".right").addClass("pullplayerdown");
        }, 350);
      } else {
        $(".right").addClass("pullplayerdown");
      }
    } else {
      $(".right").removeClass("pullplayerdown");
    }

    if (!current) {
      current = 0;
    }
    if (!duration) {
      duration = 0;
    }

    var volume = youTubePlayer.getVolume();

    if (!youTubePlayer.personalPlayer.currentTimeSliding) {
      document.getElementById("YouTube-player-progress").value = currentPercent;
    }

    document.getElementById("player-current-time").innerHTML = secondsToHms(
      current.toFixed(2)
    );

    document.getElementById("player-total-duration").innerHTML = secondsToHms(
      duration.toFixed(2)
    );

    // document.getElementById("YouTube-player-errors").innerHTML =
    //   "<div>Errors: <strong>" +
    //   youTubePlayer.personalPlayer.errors +
    //   "</strong></div>";
  } else {
    document.getElementById(
      "YouTube-player-infos"
    ).innerHTML = indicatorDisplay;
  }
}

// function playTriggerPauseButton() {
//   if(youTubePlayerActive()) {
//     $("#player-play-pause").find('i').html("pause");
//   }
// }

/**
 * Pause.
 */
function youTubePlayerPause() {
  "use strict";

  if (youTubePlayerActive()) {
    youTubePlayer.pauseVideo();
  }
}

/**
 * Play.
 */
function youTubePlayerPlay() {
  "use strict";

  if (youTubePlayerActive()) {
    youTubePlayer.playVideo();
  }
}

/**
 * Return the state decription corresponding of the state value.
 * If this value is incorrect, then return unknow.
 *
 * See values:
 * https://developers.google.com/youtube/iframe_api_reference#Playback_status
 *
 * :param number: any
 * :param unknow: any
 *
 * :return: 'unstarted', 'ended', 'playing', 'paused', 'buffering', 'video cued' or unknow
 */
// GET THIS
function youTubePlayerStateValueToDescription(state, unknow) {
  "use strict";

  var STATES = {
    "-1": "unstarted", // YT.PlayerState.
    "0": "ended", // YT.PlayerState.ENDED
    "1": "playing", // YT.PlayerState.PLAYING
    "2": "paused", // YT.PlayerState.PAUSED
    "3": "buffering", // YT.PlayerState.BUFFERING
    "5": "video cued"
  }; // YT.PlayerState.CUED

  return state in STATES ? STATES[state] : unknow;
}

/**
 * Stop.
 */
// GET THIS
function youTubePlayerStop() {
  "use strict";

  if (youTubePlayerActive()) {
    youTubePlayer.stopVideo();
    youTubePlayer.clearVideo();
  }
}

/**
 * Change the volume.
 *
 * :param volume: 0 <= number <= 100
 */
function youTubePlayerVolumeChange(volume) {
  "use strict";

  if (youTubePlayerActive()) {
    youTubePlayer.setVolume(volume);
  }
}

function youTubePlayerMute() {
  "use strict";

  if (youTubePlayerActive()) {
    youTubePlayer.mute();
  }
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h === 0 ? "" : h > 0 && h < 10 ? "0" + h + ":" : h + ":";
  var mDisplay = m === 0 ? "00:" : m > 0 && m < 10 ? "0" + m + ":" : m + ":";
  var sDisplay = s === 0 ? "00" : s > 0 && s < 10 ? "0" + s : s;
  return hDisplay + mDisplay + sDisplay;
}

/**/

/**
 * Main
 */
// GET THIS
(function() {
  "use strict";

  function init() {
    // Load YouTube library
    var tag = document.createElement("script");

    tag.src = "https://www.youtube.com/iframe_api";

    var first_script_tag = document.getElementsByTagName("script")[0];

    first_script_tag.parentNode.insertBefore(tag, first_script_tag);

    // Set timer to display infos
    setInterval(youTubePlayerDisplayInfos, 1000);
  }

  if (window.addEventListener) {
    window.addEventListener("load", init);
  } else if (window.attachEvent) {
    window.attachEvent("onload", init);
  }
})();

// $( ".modal-icon" ).click(function() {
//   $( ".modal-dialog" ).removeClass("modal-dialog-button");
//   $( ".modal-title, .modal-body" ).fadeIn(200);

//   $( ".modal-feedback, .modal-close" ).delay(130).fadeToggle(200);
// });

// $( ".modal-icon" ).click(function() {
//   $( ".modal-dialog" ).addClass("modal-dialog-button");
//   $( ".modal-title, .modal-body" ).fadeOut(200);
//   $( ".modal-feedback, .modal-close" ).delay(130).fadeToggle(200);
// });

$(".modal-icon, .modal-overlay").click(function() {
  $(".modal-dialog").toggleClass("modal-dialog-button");

  if ($(".modal-title").is(":visible") && $(".modal-body").is(":visible")) {
    $(".modal-title, .modal-body")
      .delay(100)
      .fadeOut(200);
    $("#feedbackSubmitNotifier").hide();
  } else {
    $(".modal-title, .modal-body")
      .delay(250)
      .fadeIn(200);
    $("#feedbackSubmitNotifier")
      .delay(600)
      .fadeIn();
  }

  $(".modal-feedback, .modal-close")
    .delay(115)
    .fadeToggle(200);
  $(".modal-overlay").fadeToggle(300);
});

$(".tab-title").on("click", function() {
  var otherTAB = $(this)
    .siblings(".tab-title")
    .removeClass("active-modal-tab");
  $(this)
    .not(otherTAB)
    .addClass("active-modal-tab");

  if ($(this).hasClass("active-modal-tab")) {
    var tabmodalattr = $(this).data("tab-for");
    $("#" + tabmodalattr).addClass("show-modal-tab-content");
    $("#" + tabmodalattr)
      .siblings(".tab-content")
      .removeClass("show-modal-tab-content");

    if (tabmodalattr == "modal-feedback") {
      $(".modal-title-wrap").html("Feedback or Report");
    } else {
      $(".modal-title-wrap").html("What is Project Retrowave?");
    }
  }
});

$(".modal-body").scroll(function() {
  var scroll = $(".modal-body").scrollTop();
  if (scroll > 0) {
    $(".modal-title").addClass("modal-title-shadow");
  } else {
    $(".modal-title").removeClass("modal-title-shadow");
  }
});

$("fieldset").click(function() {
  var whichfieldset = $(this).data("fieldset-for");
  $("#" + whichfieldset).focus();
});

$(".feedbackfield").on("keyup change input", function() {
  if ($(this).val() != "") {
    $(this)
      .siblings(".feedbackformlabel")
      .addClass("labelhasvalue");
    $(this)
      .siblings(".inputfieldbar")
      .addClass("labelhasvaluebar");
  } else {
    $(this)
      .siblings(".feedbackformlabel")
      .removeClass("labelhasvalue");
    $(this)
      .siblings(".inputfieldbar")
      .removeClass("labelhasvaluebar");
  }
});

/*form validation*/

// $('#feedback').submit(function() {
//   alert("submitted");

// });
/*end form validation*/
$(window).on("load", function() {
  var analyticsTag =
    "https://www.googletagmanager.com/gtag/js?id=UA-125059528-1";
  var analyticsCode =
    "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-125059528-1');";

  $(".termSwitch").on("click", function() {
    $(".termsDataWrapper").scrollTop(0);
    var otherTerm = $(this)
      .siblings(".termSwitch")
      .removeClass("activeTerm");
    $(this)
      .not(otherTerm)
      .addClass("activeTerm");

    if ($(this).hasClass("activeTerm")) {
      var termattrdata = $(this).data("term-for");
      $("#" + termattrdata).show();
      $("#" + termattrdata)
        .siblings(".termData")
        .hide();
    }
  });

  // if no cookie
  if ($.cookie("termsSplash") != "true") {
    $("#termsContainer").show();
    $("#acceptTerms").click(function() {
      $("head").append('<script async src="' + analyticsTag + '"></script>');
      $("head").append("<script>" + analyticsCode + "</script>");
      $.cookie("termsSplash", "true", { expires: 7 });
      $("#termsContainer").hide();
      $(".appcontainer .modal-wrapper").show();
    });
  } else {
    $("head").append('<script async src="' + analyticsTag + '"></script>');
    $("head").append("<script>" + analyticsCode + "</script>");
  }

  $("#unacceptTerms").click(function() {
    document.location.href =
      "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif";
  });
});