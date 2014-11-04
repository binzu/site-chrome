$(document).ready(function() {
  var regex = new RegExp("(?:(?:^|.*; *)ibmcloudnav *= *([^;]*).*$)|^.*$");
  var ibmcloudnavcookie = document.cookie.replace(regex, "$1");
  var ele_str = "a[href^=\""+ibmcloudnavcookie+"\"]";
  var li = $(ele_str).parent();
  var nestedMobileLink = $(li).parent().parent();
  var mobileLink = $(nestedMobileLink).parent().parent();
  $(mobileLink).addClass('active');
  $(nestedMobileLink).addClass('active');

  if($(window).width() <640){
    $('.mobile-link.local').addClass('active');
  }

  $('.mobile-nav-toggle').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('mobile-nav-open');
  });
  $('.mobile-link > a').on('click', function(e) {
    e.preventDefault();

    $('.mobile-link').removeClass('active');
    $(this).parent().addClass('active');
  });
  $('.nested-mobile-link > a').on('click', function(e) {
    e.preventDefault();

    var $this = $(this).parent();

    if($this.hasClass('active')) {
      $this.toggleClass('active');
    }
    else {
      $('.nested-mobile-link').removeClass('active');
      $this.addClass('active');
    }
  });

  $('.nested-mobile-link > ul > li > a').on('click', function(e){
    cname = "ibmcloudnav";
    value = $(e.target).attr('href');
    document.cookie=cname+"="+value+";"+"max-age="+(24*60*60);
  });
});
