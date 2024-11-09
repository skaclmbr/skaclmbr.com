
var cvjson;
var cvitems;

//globals
//dict of classes to add based on type
var formatType = {
  "about":"text-dark bg-light",
  "skills":"text-light bg-secondary",
  "experience":"text-light bg-success",
  "projects":"text-light bg-warning",
}
var colorType = {
  "about":"-dark",
  "skills":"-secondary",
  "experience":"-success",
  "projects":"-warning",
}

var contactIcons = {
  "telephone":"<i class='fa-solid fa-mobile-screen-button'>",
  "twitter":"<i class='fab fa-twitter'>",
  "facebook":"<i class='fab fa-facebook-f'>",
  "email":"<i class='fas fa-envelope'>",
  "url":"<i class='fas fa-window-maximize'></i>",
  "github":"<i class='fab fa-github'>",
  "linkedin":"<i class='fab fa-linkedin-in'>",
  "instagram":"<i class='fab fa-instagram'>",
  "default":"<i class='far fa-address-book'></i>"
}

var typeIcons = {
  "about": "<i class='fas fa-address-card card-icon'></i>",
  "skills": "<i class='fas fa-tools card-icon'></i>",
  "experience": "<i class='fas fa-globe card-icon'></i>",
  // "experience": "<i class='far fa-building'></i>",
  "projects": "<i class='fas fa-code-branch card-icon'></i>",
  "education": "<i class='fas fa-graduation-cap card-icon'></i>"
  // "projects": "<i class='fas fa-project-diagram'></i>"
}

function clearPage(){

    //hide all cards, remove topic card, format correctly
    $(".card-feature").hide('fast');
    $(".card-row").hide(); //hide all the card contents
    $(".type-btn").removeClass("active");
    $("#topic-col .card").appendTo($("#feature-col"));
    $(`.item-col .card`).removeClass("card-topic");
    $(`.item-col .card`).addClass("card-feature");
}

// function showRelated(i){
//
//
//   $(`.${i}`).show('fast'); //show all related cards with the tag
//
// }


function changeTopic(t){
  // make new item the main topic, add features to the side
  // inputs:
  //    t = id of the cvItem
  clearPage();

  //when showing items related to a topic, hide about and eduction to save space

  //create clone of topic card, insert above as topic header
  $("#topic-col").empty()
  var highlightTopic = $(`#${t}`).clone();
  $(highlightTopic).attr("id",`${t}-highlight`);
  $(highlightTopic).attr("style",``);
  $(highlightTopic).removeClass("card-feature");
  $(highlightTopic).removeClass("shadow");
  $(highlightTopic).addClass("card-topic");
  $(highlightTopic).appendTo($("#topic-col"))
  $("#topic-col").show("fast");

  //hide default synopses where appropriate
  $(`.${t}-hide`).hide();

  //reveal related feature cards
  $(`.${t}`).show('slow'); //show all related cards with the tag


  //find all related column info, display relevant columns
  var typeList = [];
  $(".item-col").hide();
  $.each($(`.${t}`), function(item, obj){
    var currType = $(this).attr("typeid");
    console.log("related Items", currType, obj)
    if (!(currType in typeList)){
      typeList.push(currType);
      $(`#${currType}-col`).show('fast');
    }
  });
  //
  // showRelated(t);

}

function buildCards(){
  //creates all cards
  //clear out current elements
  // loop through cv - load all cards in the feature area, hide them.
  $.each(cvjson["cvItems"],function(i,v){
    //add as cards to the left column, hide those not displayed
    //build html for topic card, return jquery object

    var tData = v;
    var type = tData.type;
    // console.log("building feature card: ", t, tData);
    var relatedKeys = [];
    if (tData["related"]) {
      relatedKeys = Object.keys(tData["related"]);
    }
    var card = $(`<div id="${i}" class="card card-feature mx-4 my-3 ${type} ${relatedKeys.join(" ")} border-0 shadow pointer" typeid="${type}"></div>`);

    //HEADER
    //synopsis

    var header = $(`<div class="card-header align-middle fs-4"><span class="float-start pe-2">${typeIcons[tData["type"]]}</span><span class="header-title">${tData["name"]}</span><span class="float-end pointer focus-topic"><i class="fas fa-search"></i></div>`);

    //BODY - ROW contains text on left, image on right
    var cardRow = $(`<div class="row card-row no-gutters ps-2 d-none"></div>`);
    var cardBody = $(`<div class="card-body col-auto"></div>`);

    $(`<p class="card-text">${tData["description"]}</p>`).appendTo(cardBody);
    $(cardBody).appendTo(cardRow);

    //IMAGE (if present)
    if (tData["img"]) {
      var cardDiv = $(`<div class="col-4"></div>`);
      var cardImg = $(`<img class="img-fluid" src="/img/${tData.img.src}" alt="${tData.img.caption} ${tData.img.alt}"/>`);
      $(cardImg).appendTo(cardDiv);
      $(cardDiv).appendTo(cardRow);
    }

    //footer
    //loop through related items
    var footer = $(`<div class="card-footer"></div>`);

    var badges = $(`<div></div>`);
    //collector for all synopses statements
    var synopses_combined = $(`<div id="synopses" class="fs-6 fw-lighter fst-italic text-center col-md-12"></div>`);
    //assemble synopses
    var synopsis_default = $(`<div class="synopsis-default"></div>`);
    if (tData["synopsis"]) {
      $(synopsis_default).text(tData.synopsis);
    }

    //loop through related items, add badges, related-item-specific synopses statements
    $.each(tData["related"], function(i,r){
      console.log("related items", i, r);
      if (i in cvitems){

        $(`<span class="badge rounded-pill related-item pointer mx-1" linkid="${i}">${cvitems[i]["name"]}</span>`).appendTo(badges);
        if (r) {
          $(synopses_combined).append($(`<div class="synopsis ${i} d-none">${r}</div>`));
          $(synopsis_default).addClass(`${i}-hide`);
        }
        //add synopsis if exists

        // $(`<span class="badge rounded-pill related-item bg${colorType[tData["type"]]} pointer mx-1" linkid="${r}">${r}</span>`).appendTo(badges);
      } else {
        $(`<span class="badge rounded-pill related-item mx-1">${r}</span>`).appendTo(badges);
      }
    });


    //add expand caret last
    $(synopses_combined).append($(synopsis_default));
    $(synopses_combined).append($(`<span class="expand-card float-end"><i class="fas fa-caret-down"></i></span>`));

    $(badges).appendTo(footer);
    // $(`<h6 class="card-subtitle mb-2 text-muted">${tData["type"]}</h6>`).appendTo(cardBody);

    //add synopses to HEADER
    $(synopses_combined).appendTo(header);
    $(header).appendTo(card);
    $(cardRow).appendTo(card);
    $(footer).appendTo(card);

    $(card).appendTo(`#${type}-col`);
  });

}
function sortCards (){
    //TBD - function to sort cards accordingly
}

function toggleCardBodyDisplay(){
  //tbd - function to make body visible, rotate carat symbol
}

function resizeImage(i, d, s) {
  // resizes images to passed dimensions
  // i = image object
  // d = max dimension direction (width or height)
  // s = max dimension size (pixels)


      var ratio = 0;  // Used for aspect ratio
      var width = $(i).width();    // Current image width
      var height = $(i).height();  // Current image height
      var nh = 0;
      var nw = 0;
      console.log("resize image:", width, height,d, s,$(i));

      if (d == "width") {
        if (width > s){
          ratio = s / width;
          nh = ratio * height;
          nw = s;
          $(i).css("width",nw);
          $(i).css("height",nh);
        }
      } else if (d == "height") {
        if (height>s){
          ratio = s / height;
          nw = ratio * width;
          nh = s;

          $(i).css("width",nw);
          $(i).css("height",nh);
        }
      }
      console.log("calculations", nw, nh);
  }

  function imageOrientation(i){
    //pass image, return if square, portrait or landscape
    var w = $(i).width();
    var h = $(i).height();
    var r = "";

    if (w > h) {
        r = "landscape";
    } else if ( h > w){
        r = "portrait";
    } else {
        r = "square";
    }
    return r;
  }

  // function removeColumnClasses(o){
  //   $(o).removeClass("col-md-1 col-md-2 col-md-3 col-md-4 col-md-5 col-md-6 col-md-7 col-md-8 col-md-9 col-md-10 col-md-11 col-md-12");
  // }


$(document).ready(function(){
  console.log("doc loaded");

  // $(".toggle-details").click(function(){
  //   console.log("toggle-details clicked")
  //   //expands info in feature card
  // });

  // cv json hosted on github gist
  $.getJSON("https://gist.github.com/skaclmbr/ee64fdad9579c052b4aef27592caa6cf").done(function(r){
  // $.getJSON("cv.json").done(function(r){
    console.log("json loaded");
    cvjson = r;
    cvitems = r["cvItems"];

    //add basic information
    $("#resume-name").text(cvjson["name"]);
    $("#statement > p").text(cvjson["statement"]);

    //build contact information
    $.each(cvjson["contactInfo"], function(i,v){
      if (i in contactIcons) {
        var ci = $(`<a class="btn contact-icon" href="${v}" target="_blank" data-toggle="tooltip" title="${i}">${contactIcons[i]}</a>`);
      } else {
        var ci = $(`<a class="btn contact-icon" href="${v}" target="_blank" data-toggle="tooltip" title="${i}">${contactIcons["default"]}</a>`);
      }
      $("#contact-icons").append(ci);

    });

    //build navbar - loop through typeIcons to create with values
    $.each(typeIcons,function(i,v){
      var typeItem = $(`<button id="btn-${i}" class="btn btn-sm type-btn me-2" typelink="${i}">${v}<br/>${i}</button>`);
      $(typeItem).appendTo($(".type-btns"));
    });

    //events for navbar
    $(".type-btn").click(function(){
      var t = $(this).attr("typelink");

      //change button appearance
      $(".type-btn").removeClass("active");
      $(this).addClass("active");

      //hide/show appropriate columns
      $("#topic-col").hide('fast');


      // $.each(typeIcons,function(i,v){
      //   if (t == i){
      //     // removeColumnClasses($(`#${i}-col`));
      //     // $(`#${i}-col`).addClass("col-md-12");
      //     $(`#${i}-col`).show("slow");
      //   } else {
      //     $(`#${i}-col`).hide("slow");
      //   }
      // });

      //hide/show appropriate cards
      //clear out current elements
      clearPage();
      $(".item-col").hide();//hide all item columns
      console.log("btn clicked: ", t, $(`#${t}-col`))
      $(`#${t}-col`).show('fast'); //show the clicked topic column
      $(`#${t}-col .card`).show('fast');
    });

    //create all the cv cards
    buildCards();

    //add click functions below
    $(".related-item").click(function(){
      //badge clicked - make items visible,
      if ($(this).attr("linkid")) {
        changeTopic($(this).attr("linkid"));
      }
    });

    // $(".card-header").click(function(){
    $(".header-title, .focus-topic").click(function(){
      var t = $(this).parent().parent().attr("id");
      changeTopic(t);

    });

    $(".expand-card").click(function(){
      var t = $(this).parent().parent().parent().attr("id");
      // var t = $(this).parent().parent();
      console.log("expand-card clicked", t);
      $(`#${t} .card-row`).show('fast');
    });

    //insert and possibly resize image
    if (cvjson["profile-image"]){
      $("#profile-image").attr("src",`/img/${cvjson["profile-image"]["src"]}`);
      $("#profile-image").attr("alt",`${cvjson["profile-image"]["caption"]} ${cvjson["profile-image"]["alt"]}`);
      resizeImage($("#profile-image"), "height", 160);
      $("#profile-image").show();
    }

    $("#btn-experience").trigger("click");
    $("#btn-experience").removeClass("active");
})
.fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
});//end intial data laod

  //scroll listener
  // $(document).scroll(function(){
  //   var topBreak = 8;
  //   var sp = $(document).scrollTop();
  //     console.log("scroll pos:", sp);
  //   if (sp >=topBreak){
  //     $("#resume-name").animate({
  //       fontSize: "0.8rem"
  //       }, 1000);
  //   } else if (sp<topBreak) {
  //     console.log("at the top");
  //     $("#resume-name").animate({
  //       fontSize: "2rem"
  //       }, 1000);
  //   }
  // });



}); //end doc load fucnctions
