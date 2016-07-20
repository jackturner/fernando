$(function() {

  var bod = $('body')
  var homepage_bod = bod.filter('.homepage')
  var project_bod = bod.filter('.project')
  var is_mobile = bod.hasClass('mobile')
  var header = $('header')
  var info_box = bod.children('section')
  var info_box_heading = info_box.children('h3')
  var gallery_nav = project_bod.children('nav.slides')
  var nav_heading = gallery_nav.children('h3')
  var gallery_links = gallery_nav.children('a')
  var homepage_nav = homepage_bod.children('nav.projects')
  var grid_cells = homepage_nav.children()
  var project_links = grid_cells.filter('a')
  var project_captions = homepage_nav.find('.project_caption')
  var link_indicator = $('<div class="indicator" />').appendTo(gallery_nav)
  var status = $('<div id="status" />').css('opacity', 0).text('Loading').appendTo(project_bod)
  var prev_arrow = $('<a id="prev_arrow" class="arrow" />').append('<span />').appendTo(project_bod)
  var next_arrow = $('<a id="next_arrow" class="arrow" />').append('<span />').appendTo(project_bod)

  var is_safari = $.browser.safari && !/chrome/.test(navigator.userAgent.toLowerCase())
  var is_mobile_safari = !!(is_safari && navigator.userAgent.match(/AppleWebKit.*?Mobile/))
  var supports_video_element = !!$('<video />').attr('canPlayType')
  var supports_canvas_element = !!$('<canvas />').attr('getContext')

  var resize_timer = null
  var gallery_links_timer = null
  var key_held_down = false

  var preload_photos = function(photo) {
    if(!photo) photo = gallery_links.first()
    if(!photo[0]) return
    var img_src = photo.attr('href')
    $('<img />').load(function() {
      if(photo.is('a:last-child')) return
      preload_photos(photo.next('a[rel=photo]'))
    }).attr('src', img_src)
  }

  var project_entrance_animation = function() {
    if(!project_bod[0] || is_mobile) return
    
    setTimeout(function() {
      go_to_slide(gallery_links.first())
    }, 300)

    info_box
      .css({left: -1 * info_box.outerWidth(), display: 'block'})
      .delay(1000)
      .animate({left: 0}, 500, 'easeInOutCubic')
      .delay(100)
      .animate({bottom: -1 * info_box.outerHeight()}, 500, 'easeInOutCubic', function() {
        info_box.addClass('closed')
      })

    header.css({marginLeft: -1 * header.outerWidth(), display: 'block'})
    if(!does_header_overlap()) {
      header
        .delay(300)
        .animate({marginLeft: 0}, 300, 'easeInOutCubic')
    }

    gallery_nav
      .css({right: -1 * gallery_nav.outerWidth(), display: 'block'})
      .delay(1000)
      .animate({right: 0}, 500, 'easeInOutCubic', show_nav)
  
    next_arrow
      .delay(1500)
      .animate({opacity: .65}, 500, 'easeInOutCubic')
    
    prev_arrow
      .delay(2000)
      .animate({opacity: .65}, 500, 'easeInOutCubic', preload_photos)
  }

  var homepage_entrance_animation = function() {
    if(!homepage_bod[0]) return

    if(bod.hasClass('mobile')) {
      project_links.each(function() {
        var this_project = $(this)
        var img_src = this_project.attr('data-thumbnail-url')
        this_project.css('background-image', 'url(' + img_src + ')')
      })
      return
    }

    resize_images()

    header
      .css({marginLeft: -1 * header.outerWidth(), display: 'block'})
      .delay(400)
      .animate({marginLeft: 0}, 300, 'easeInOutCubic')

    homepage_nav.children('.empty').css('opacity', 0).delay(400).fadeTo(800, 1)

    var num_images_loaded = 0
    project_links.each(function() {
      var this_project = $(this)
      var this_caption = this_project.children('.project_caption')
      var this_wrapper = $('<span class="wrapper" />').appendTo(this_project)
      var img_src = this_project.attr('data-thumbnail-url')
      $('<img />').load(function() {

        this_project
          .css('background-image', 'url(' + img_src + ')')
          .delay(Math.random() * 1000 + 400)
          .animate({opacity: .85}, 400, function() {
            this_caption.stop().animate({top: 4}, 200, 'easeInOutCubic', function() {

              num_images_loaded++
              if(num_images_loaded + 1 == project_captions.length)
                grid_cells.hover(grid_cell_hover)

            })          
          })

      }).attr('src', img_src)
    })
  }

  var resize_images = function() {
    // bail if on mobile
    if(bod.hasClass('mobile')) return

    var optimal_ratio = 4/3
    
    $('nav.projects a.empty').remove()
    project_links = homepage_nav.children()
    
    var container_width = $(window).width()
    var container_height = $(window).height()
    
    var container_ratio = container_width / container_height
    
    var num_black = $('nav.projects a.black').length    
    var num_slots = project_links.length
    var num_thumbnails = num_slots - num_black
    
    var num_empty, thumbnail_ratio, score

    var max_score = 0
    var num_x, num_y

    for(var x = 1; x < num_slots; x++) {
      for(var y = 1; y < num_slots; y++) {
        num_empty = (x * y) - num_slots
        if(num_empty < 0) continue
        if(num_empty > 3) continue

        thumbnail_ratio = container_ratio / (x / y)
        score = 1 / Math.max(0.000001, Math.pow(Math.log(optimal_ratio / thumbnail_ratio), 2))
        
        if(score > max_score) {
          max_score = score
          num_x = x
          num_y = y
        }
      }
    }
    
    var width = (100 / num_x) + '%'
    var height = (100 / num_y) + '%'
    
    homepage_nav.data({cols: num_x, rows: num_y})

    project_links.each(function(i, elem) {
      $(elem).css({'width': width, 'height': height})
    })
    
    num_empty = (num_x * num_y) - num_slots
    for(var i = 0; i < num_empty; i++) {
      $('<a />').addClass('empty').css({'width': width, 'height': height}).appendTo(homepage_nav)
    }
  }

  var go_prev = function() {
    var prev_link = gallery_links.filter('.active').prev('a')
    prev_link = (prev_link[0] ? prev_link[0] : gallery_links.last())
    go_to_slide(prev_link, 'slide_right')
  }

  var go_next = function() {
    var next_link = gallery_links.filter('.active').next('a')
    next_link = (next_link[0] ? next_link[0] : gallery_links.first())
    go_to_slide(next_link, 'slide_left')
  }

  var go_to_slide = function(photo_link, transition_mode) {
    $('blockquote').remove()
    
    show_nav()
    hide_info()

    var new_link = $(photo_link) 
    if(!new_link[0] || new_link.hasClass('active')) return    

    var old_link = gallery_links.filter('.active')

    old_link.removeClass('active')
    new_link.addClass('active')

    link_indicator.stop().animate({
      left: new_link.position().left + (new_link.width() / 2)
    }, 150, 'easeInOutCubic')

    if(!transition_mode)
      transition_mode = (old_link.index() > new_link.index() ? 'slide_right' : 'slide_left')

    var slide_type = new_link.attr('rel')
    if(slide_type == 'photo') show_photo(transition_mode)
    else show_video(transition_mode)
  }

  var go_to_project = function(clicked_project) {
    if(homepage_nav.hasClass('hiding')) {
      toggle_homepage_info()
      return
    }
    clicked_project = $(clicked_project)
    homepage_nav.addClass('animated').children('.empty').fadeTo(200, 0)
    clicked_project.children('.project_caption').fadeTo(200, 0)
    project_links.not(clicked_project).each(function() {
      $(this).delay((Math.random() * 400)).fadeTo(200, 0)
    })
    header.delay(200).animate({marginLeft: -1 * header.outerWidth()}, 200, 'easeInOutCubic')
    clicked_project.delay(400).fadeTo(200, 0)
    setTimeout(function() {
      window.location = clicked_project.attr('href')
    }, 600)
  }

  var go_to_homepage = function() {
    if(!project_bod[0]) return

    header.animate({marginLeft: -1 * header.outerWidth()}, 200, 'easeInOutCubic')

    if(!info_box.hasClass('closed') || info_box.is(':animated'))
      info_box.animate({left: -1 * info_box.outerWidth()}, 200, 'easeInOutCubic')
    else
      info_box.animate({left: -1 * info_box_heading.outerWidth()}, 200, 'easeInOutCubic')

    if(!gallery_nav.hasClass('closed') || gallery_nav.is(':animated'))
      gallery_nav.animate({right: -1 * gallery_nav.outerWidth()}, 200, 'easeInOutCubic')
    else
      gallery_nav.animate({right: -1 * nav_heading.outerWidth()}, 200, 'easeInOutCubic')

    var caption = $('blockquote')
    caption.animate({right: -1 * caption.outerWidth(true)}, 200, 'easeInOutCubic')

    $('.arrow, .slide').delay(200).fadeOut(200)

    setTimeout(function() {
      window.location = $('header h1 a').attr('href')
    }, 400)
  }

  var notify_of_resize = function() {
    if(is_mobile) return
    resize_images()
    if(resize_timer) clearTimeout(resize_timer)
    resize_timer = setTimeout(function() {
      show_photo('fade')
      avoid_header_overlap()
    }, 200)
  }

  var show_photo = function(transition_mode) {
    var active_link = gallery_links.filter('.active')

    if(active_link.is('[rel!=photo]')) return

    var next_img_src = active_link.attr('href')
    var h_crop_align = active_link.attr('data-h-align')
    var v_crop_align = active_link.attr('data-v-align')
    var resize_mode = active_link.attr('data-resizing')

    var loader = $('<img />').load(function() {

      var window_width = $(window).width()
      var window_height = $(window).height()
      if(resize_mode == 'no-resizing')
        var draw_mode = 'actual'
      else if(resize_mode == 'fill-browser')
        var draw_mode = 'fill'
      else if(resize_mode == 'fit-in-browser' || resize_mode == 'fit-and-no-upscaling')
        var draw_mode = 'fit'
      else {
        var window_ratio = window_width / window_height
        var image_ratio = this.width / this.height
        var ratio_diff = Math.abs(window_ratio - image_ratio)
        var draw_mode = (ratio_diff > .3 ? 'fit' : 'fill')
      }

      var draw_params = scaling_maths({
        src_width: this.width,
        src_height: this.height,
        dest_width: window_width,
        dest_height: window_height,
        method: draw_mode,
        hCropAlign: h_crop_align,
        vCropAlign: v_crop_align
      })
      
      if(supports_canvas_element)
        draw_with_canvas(this, transition_mode, draw_params, show_caption)
      else
        draw_with_img(this, transition_mode, draw_params, show_caption)
    }).attr('src', next_img_src)
    
    if(!$(loader).attr('complete')) status.stop().fadeTo(100, .25)
  }
  
  var show_caption = function() {
    if($('blockquote')[0]) return
    
    var active_link = gallery_links.filter('.active')
    if(!active_link.is('.photo')) return

    var caption = active_link.children('span').text()
    if(!caption) return

    $('<blockquote />')
      .text(caption)
      .css('opacity', 0)
      .append('<div class="bubble bubble_1" />')
      .append('<div class="bubble bubble_2" />')
      .append('<div class="bubble bubble_3" />')
      .append('<div class="bubble bubble_4" />')
      .appendTo(bod)
      .fadeTo(400, .85)
  }
  
  var show_video = function(transition_mode) {
    var vimeo_link = gallery_links.filter('.active').attr('href')
    var oembed_url = 'http://vimeo.com/api/oembed.json?autoplay=1&maxwidth=560&maxheight=420&callback=vimeo_response&url=' + vimeo_link
    
    status.stop().fadeTo(100, .25, function() {
      $('<script />')
        .attr({type: 'text/javascript', src: oembed_url})
        .appendTo('head')
    })
  }
  
  var vimeo_response = function(r) {
    var video = $('<div />')
                  .addClass('slide video')
                  .css({
                    marginLeft: -.5 * r.width,
                    marginTop: -.5 * r.height,
                    width: r.width,
                    height: r.height
                  })
                  .html(r.html)
                  .insertBefore(gallery_nav)
      
    if(status.is(':visible')) status.hide().css('opacity', .25)
    setTimeout(function() {
      cull_old_slides(video)
    }, 200)
  }
  window.vimeo_response = vimeo_response
  
  var draw_with_canvas = function (img, transition_mode, dest, callback) {
    callback = callback || $.noop
    var window_width = $(window).width()
    var window_height = $(window).height()

    var starting_offset = '50%'
    if(transition_mode == 'slide_left') starting_offset = '150%'
    else if(transition_mode == 'slide_right') starting_offset = '-50%'

    var canvas = $('<canvas />')
      .addClass(dest.draw_mode + ' slide photo')
      .attr({width: window_width, height: window_height})
      .insertBefore(gallery_nav)
      .css({
        marginTop: -.5 * window_height,
        marginLeft: -.5 * window_width,
        opacity: (transition_mode == 'fade' ? 0 : 1),
        left: starting_offset
      })
      .bind('webkitTransitionEnd', function(e) {
        canvas.css({
          left: '50%',
          webkitTransitionDuration: '0s',
          webkitTransform: 'none'
        })
        cull_old_slides(e.target)
        callback()
      })    

      canvas[0].getContext('2d').drawImage(img, 0, 0, img.width, img.height, dest.offset.x, dest.offset.y, dest.dim.width, dest.dim.height)

      if(status.is(':visible')) status.fadeTo(400, 0)

      if(transition_mode == 'fade') 
        canvas.animate({opacity: 1}, 400, function() {cull_old_slides(this); callback();})
      else {
        if(is_safari)
          canvas.css('webkitTransform', 'translate3d(' + (transition_mode == 'slide_left' ? -1 : 1) * window_width + 'px, 0, 0)')
        else
          canvas.animate({left: '50%'}, 400, function() {cull_old_slides(this); callback();})
      }
  }
  
  var draw_with_img = function(img, transition_mode, dest, callback) {
    callback = callback || $.noop
    var window_width = $(window).width()
    var window_height = $(window).height()

    var starting_offset = '50%'
    if(transition_mode == 'slide_left') starting_offset = '150%'
    else if(transition_mode == 'slide_right') starting_offset = '-50%'

    $(img)
      .addClass(dest.draw_mode + ' slide photo')
      .css({
        marginTop: dest.offset.y + (-.5 * window_height),
        marginLeft: dest.offset.x + (-.5 * window_width),
        width: dest.dim.width,
        height: dest.dim.height,
        opacity: (transition_mode == 'fade' ? 0 : 1),
        left: starting_offset
      })
      .insertBefore(gallery_nav)
      .stop()
      .clearQueue()
      .animate({opacity: 1, left: '50%'}, 500, function() {cull_old_slides(img); callback();})

    if(status.is(':visible')) status.fadeTo(400, 0)
  }
  
  var cull_old_slides = function(newest_slide) {
    newest_slide = $(newest_slide)
    var old_slides = newest_slide.prevAll('.slide').stop(true)
    if(newest_slide.is('.video') || newest_slide.is('.fit')) {
      var last_old_slide = old_slides.last()
      old_slides.not(last_old_slide).remove()
      last_old_slide.fadeOut(200, function() {
        last_old_slide.remove()
      })
      bod.addClass('invert')
    }
    else{
      old_slides.remove()
      bod.removeClass('invert')
    }
  }

  var does_header_overlap = function() {
    var overlap = gallery_nav.outerWidth() + header.outerWidth() - $(window).width()
    return overlap > 0 && !gallery_nav.hasClass('closed')
  }

  var avoid_header_overlap = function() {
    if(does_header_overlap())
      header
        .stop()
        .animate({marginLeft: -1 * header.outerWidth()}, 300, 'easeInOutCubic')

    else if(header.offset().left < 0)
      header
      .stop()
      .animate({marginLeft: 0}, 300, 'easeInOutCubic')
  }

  var toggle_info = function() {
    info_box.hasClass('closed') ? show_info() : hide_info() 
  }

  var show_info = function() {
    if(!info_box.hasClass('closed') || info_box.is(':animated')) return
    info_box.animate({bottom: 0}, 500, 'easeInOutCubic', function() {
      info_box.removeClass('closed')
    })
  }
  
  var hide_info = function() {
    if(info_box.hasClass('closed') || info_box.is(':animated')) return
    info_box.animate({bottom: -1 * info_box.outerHeight()}, 500, 'easeInOutCubic', function() {
      info_box.addClass('closed')
    })
  }

  var show_nav = function() {
    if(gallery_links_timer) clearTimeout(gallery_links_timer)
    gallery_links_timer = setTimeout(hide_nav, 1500)
    if(!gallery_nav.hasClass('closed') || gallery_nav.is(':animated')) return
    gallery_nav.removeClass('closed')
    avoid_header_overlap()
    gallery_nav.stop(true).animate({top: 0}, 300, 'easeInOutCubic')
    nav_heading.stop(true).animate({opacity: 0}, 100, 'easeInOutCubic')
  }
  
  var hide_nav = function() {
    gallery_nav.animate({top: -1 * gallery_nav.outerHeight() - link_indicator.outerHeight()}, 300, 'easeInOutCubic', function() {
      gallery_nav.addClass('closed')
      avoid_header_overlap()
    })
    nav_heading.animate({opacity: 1}, 300, 'easeInOutCubic')
  }

  var scaling_maths = function(options) {
    var active_link = gallery_links.filter('.active')
    var resize_mode = active_link.attr('data-resizing')
    
    if(options.method == 'actual') {
      var scale = 1
    }
    else {
      var ratioX = options.dest_width / options.src_width
      var ratioY = options.dest_height / options.src_height

      if(options.method == 'fit')
        var scale = ratioX < ratioY ? ratioX : ratioY
      else if(options.method == 'fill')
        var scale = ratioX > ratioY ? ratioX : ratioY
    }
    
    if(resize_mode == 'fit-and-no-upscaling') {
      var ratioX = Math.min(options.src_width, options.dest_width - 160) / options.src_width
      var ratioY = Math.min(options.src_height, options.dest_height - 160) / options.src_height
      var scale = ratioX < ratioY ? ratioX : ratioY
    }

    var new_width = options.src_width * scale
    var new_height = options.src_height * scale

    var offset_x = (options.dest_width - new_width) / 2
    var offset_y = (options.dest_height - new_height) / 2
   
    if(options.hCropAlign == 'left') offset_x = 0
    else if(options.hCropAlign == 'right') offset_x = options.dest_width - new_width

    if(options.vCropAlign == 'top') offset_y = 0
    else if(options.vCropAlign == 'bottom') offset_y = options.dest_height - new_height

    return {
      dim: {
        width: parseInt(new_width, 10),
        height: parseInt(new_height, 10)
      },
      offset: {
        x: parseInt(offset_x, 10),
        y: parseInt(offset_y, 10)
      },
      draw_mode: options.method
    }
  }

  var key_handler = function(event) {
    if(event.which != 37 && event.which != 39) return
    if(!key_held_down) event.which == 37 ? go_prev() : go_next()
    key_held_down = (event.type == 'keydown')
  }

  var grid_cell_hover = function(event) {
    if(homepage_nav.hasClass('hiding') || homepage_nav.hasClass('animated') || bod.hasClass('mobile')) return
    
    var this_project = $(this)
    
    var this_caption = this_project.children('.project_caption')
    var dimmed_projects = project_links.filter('.dimmed')

    // alert(this_project.attr('href'))

    if(event.type == 'mouseenter' && this_project.is('a') && this_project.attr('href') != undefined) {
      project_links.not(this_project).not(dimmed_projects).addClass('dimmed').stop().fadeTo(400, .5)
      this_project.removeClass('dimmed').stop().fadeTo(400, 1)

      project_captions.not(this_caption).stop().animate({top: -36}, 200, 'easeInOutCubic')
      this_caption.stop().animate({top: 4}, 200, 'easeInOutCubic')
    }

    else if(!event.relatedTarget || !$(event.relatedTarget).is('span') || $(event.relatedTarget).attr('href') == undefined) {
      project_links.removeClass('dimmed').stop().fadeTo(400, .85)
      project_captions.stop().animate({top: 4}, 200, 'easeInOutCubic')
    }
  }

  var toggle_homepage_info = function(info_link) {
    if(homepage_bod.hasClass('animated')) return
    homepage_bod.addClass('animated')

    var clicked_link = $(info_link)
    
    // If no info_link was clicked then see if there is already an active one in the DOM
    if(!clicked_link[0])
      clicked_link = homepage_bod.find('header .active')

    var info_section = $(clicked_link.attr('href'))
    
    // Hide the info section and show the homepage nav
    if(clicked_link.hasClass('active') && info_section.hasClass('active')) {
      clicked_link.removeClass('active')
      info_section.removeClass('active')
      info_section.fadeOut(200, function() {
        homepage_nav.children().each(function() {
          $(this).delay(Math.random() * 200).fadeTo(200, .85)
          setTimeout(function() {
            homepage_nav.removeClass('hiding')
            homepage_bod.removeClass('animated')
          }, 400)
        })
      })
    }

    // Hide the old info section...
    else {
      homepage_bod.find('footer .active').fadeOut(200)
      homepage_bod.find('header .active').removeClass('active')
      clicked_link.addClass('active')
      info_section.addClass('active')
      
      // Switch the new info section
      if(homepage_nav.hasClass('hiding')) {
        info_section.delay(200).fadeIn(400, function() {
          homepage_bod.removeClass('animated')
        })
      }
      
      // Hide the homepage nav and show the info section
      else {
        homepage_nav.addClass('hiding').children().each(function(i) {
          $(this).delay(Math.floor(i / homepage_nav.data('cols')) * 80).fadeTo(300, 0, function() {
            if($(this).is(':last-child'))
              info_section.fadeIn(300, function() {
                homepage_bod.removeClass('animated')
              })
          })
        })
      }
    }
  }

  $(document).ready(homepage_entrance_animation)
  $(window).bind({
    load: project_entrance_animation,
    unload: $.noop,
    resize: notify_of_resize
  })
  $(document).bind('keydown keyup', key_handler)

  // HOMEPAGE SPECIFIC EVENTS
  homepage_bod.find('header a').bind(is_mobile_safari ? 'touchstart' : 'click', function(event) {
    event.preventDefault()
    toggle_homepage_info(this)
  })
  homepage_bod.find('footer section').bind(is_mobile_safari ? 'touchstart' : 'click', function(event) {
    // if(bod.hasClass('mobile')) return
    toggle_homepage_info()
  })
  project_links.bind(is_mobile_safari ? 'touchstart' : 'click', function(event) {
    if(bod.hasClass('mobile')) return
    event.preventDefault()
    if($(this).attr('href') != undefined) go_to_project(this)
  })
  
  // GALLERY SPECIFIC EVENTS
  project_bod.find('header h1 a').bind(is_mobile_safari ? 'touchstart' : 'click', function(event) {
    event.preventDefault()
    go_to_homepage()
  })
  gallery_nav.mousemove(show_nav)
  project_bod.bind(is_mobile_safari ? 'touchstart' : 'click', hide_info)
  gallery_links.bind(is_mobile_safari ? 'touchstart' : 'click', function(event) {
    event.preventDefault()
    go_to_slide(this)
  })
  next_arrow.bind(is_mobile_safari ? 'touchstart' : 'click', go_next)
  prev_arrow.bind(is_mobile_safari ? 'touchstart' : 'click', go_prev)
  info_box.bind(is_mobile_safari ? 'touchstart' : 'click', toggle_info)

})