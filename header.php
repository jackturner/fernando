<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="description" content="Fernando Orellana works in range of media including paint, pixels, robotics and Play-Doh. This site documents a variety of his projects going back to 1998." />
  <title> <?php  if (!(is_404()) && is_single())
                    echo strtolower(wp_title('', 0)) . ' - ';
		              elseif (is_404())
		                echo 'not found - ';
                  echo strtolower(get_bloginfo('name')); ?> - New York based new media artist</title>

  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <link rel="shortcut icon" href="<?php bloginfo("template_url"); ?>/favicon.ico" />
  <link rel="apple-touch-icon" href="<?php bloginfo("template_url"); ?>/images/apple_touch_icon.png" />
  <link rel="alternate" type="application/rss+xml" href="<?php bloginfo("rss2_url"); ?>" />
  <link rel="stylesheet" href="<?php bloginfo("template_url"); ?>/css/global.css?07-26-2016" />
  <link rel="stylesheet" href="https://npmcdn.com/flickity@2.0/dist/flickity.css" media="screen">
  <noscript>
    <link rel="stylesheet" href="<?php bloginfo("template_url"); ?>/css/noscript.css" />
  </noscript>
  <!--[if lte IE 8]>
    <link rel="stylesheet" href="<?php bloginfo("template_url"); ?>/css/ie.css?09-21-2010" />
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->

</head>
<body class="<?php  if(is_home() || is_page()) {echo 'homepage';}
                    elseif(is_single()) {echo 'project';}  ?> 
             <?php echo is_mobile() ? 'mobile' : 'not_mobile'; ?>">