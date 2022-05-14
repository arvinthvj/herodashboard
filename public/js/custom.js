  $(document).ready(function() {
    function setHeight() {
      windowHeight = $(window).innerHeight();
      $('.home_hero').css('min-height', windowHeight);
    };
    $(".navbar-toggler").click(function(){
        $(".-closed").toggleClass("-open");
        $("body").toggleClass("body_overflow");
    });
});

  
  
 /* $(window).scroll(function() {
  if ($(this).scrollTop() > 1){  
    $('header').addClass("sticky");
  }
  else {
    $('header').removeClass("sticky");
  }
});*/

// animation js here
  jQuery(function($) {
      $('.element').responsiveEqualHeightGrid();

      var wow = new WOW(
          {
              boxClass:     'wow',      // default
              animateClass: 'animated', // default
              offset:       0,          // default
              mobile:       true,       // default
              live:         true        // default
          }
      )
      wow.init();
  });


  $(".action_link").click( function(){
      if (!$(this).hasClass('active')) {
          $('.action_link ').removeClass('active');
          $(this).addClass('active');
      }
  });


  documnet.ready(function () {
      // Upload js
      jQuery('#OpenImgUpload').click(function() {
          $('#imgupload').trigger('click');
      });
      jQuery("input[type=file]").on("change", function() {
          jQuery("[for=file]").html(this.files[0].name);
          jQuery("#preview").attr("src", URL.createObjectURL(this.files[0]));
      });
      // Upload js
      jQuery('#OpenImgUpload1').click(function() {
          $('#imgupload1').trigger('click');
      });
      jQuery("input[type=file]").on("change", function() {
          jQuery("[for=file]").html(this.files[0].name);
          jQuery("#preview1").attr("src", URL.createObjectURL(this.files[0]));
      });
  });

  jQuery(function($) {
      $('[data-toggle="popover"]').popover()
  });
  /*$(document).ready(function(){

      // Select and loop the container element of the elements you want to equalise
      $('.row_H_D').each(function(){

          // Cache the highest
          var highestBox = 0;

          // Select and loop the elements you want to equalise
          $('.card_heightEqual', this).each(function(){

              // If this box is higher than the cached highest then store it
              if($(this).height() > highestBox) {
                  highestBox = $(this).height();
              }

          });

          // Set the height of all those children to whichever was highest
          $('.card_heightEqual',this).height(highestBox);

      });*/