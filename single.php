<?php get_header(); ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

<header>
  <h1><a href="<?php bloginfo('home'); ?>/"><?php bloginfo('name'); ?> <img src="<?php bloginfo("template_url"); ?>/images/home.png" /><?php if(!is_mobile()) { ?> <span>Return home</span><?php } ?></a></h1>
  <h2><?php the_title(); ?></h2>
</header>

<?php if(is_mobile()) { ?>

<div class="carousel" data-flickity='{"prevNextButtons": false}'>

  <?php foreach (photos_in_project($post->ID) as $photo) {
          if( get_post_meta($post->ID, 'featured_image_visbility', true) == 'Include in gallery' ||
              get_post_thumbnail_id($post->ID) != $photo->ID) {

            $full = wp_get_attachment_image_src($photo->ID, 'large');
            $original = wp_get_attachment_image_src($photo->ID, 'original');
             ?>
<a href="<?php echo $original[0]; ?>" class="carousel-cell">
  <img src="<?php echo $full[0]; ?>" />
  <?php if(!empty($photo->post_excerpt)) : ?><span class="caption"><?php echo $photo->post_excerpt; ?></span><?php endif; ?>
</a>

  <?php   }
        } ?>

<?php setup_postdata($post);
        $video_urls = split("\n", trim(get_post_meta($post->ID, 'vimeo_urls', true)));
        $thumbnails_pairs = split("\n\n", get_post_meta($post->ID, 'vimeo_thumb_urls', true));
        $thumbnails = array();
        foreach ($thumbnails_pairs as $pair)
          $thumbnails[(int)reset(split("\n", $pair))] = end(split("\n", $pair));
        if ($video_urls) {
          foreach ($video_urls as $video_url) {
            $video_id = (int)end(split("/", $video_url));
            $thumbnail = $thumbnails[$video_id];
            $thumbnails_parts = explode("_", $thumbnail);
            $big_thumb = $thumbnails_parts[0].".jpg";
            if (!empty($video_url) and !empty($thumbnail)) { ?>
            
              <a href="<?php echo $video_url; ?>?autoplay=1" class="carousel-cell">
                <img src="<?php echo $big_thumb; ?>" width="100%" />
                <span class="video">Play this video</span>
              </a>
  <?php     }
          }
        } ?>

</div>

<?php } else { ?>

<nav class="slides">
  <h3>Gallery</h3>

  <?php foreach (photos_in_project($post->ID) as $photo) {
      	  if( get_post_meta($post->ID, 'featured_image_visbility', true) == 'Include in gallery' ||
      	      get_post_thumbnail_id($post->ID) != $photo->ID) {
      	    setup_postdata($photo);

        	  $full = wp_get_attachment_image_src($photo->ID, 'large');
        	  $thumbnail = wp_get_attachment_image_src($photo->ID, 'medium');

            $resizing = sanitize_title(get_post_meta($post->ID, 'image_resizing', true));

        	  $metadata_fields_str = split("\n", wp_filter_nohtml_kses(get_the_content()));
        	  $metadata_as_attr_str = '';
            foreach ($metadata_fields_str as $metadata_str) {
              if(!empty($metadata_str)) {
                $metadata_arr = split(":", $metadata_str);
                $metadata_as_attr_str .= ' data-' . trim($metadata_arr[0]) . '="' . trim($metadata_arr[1]) . '"';
              }
            } ?>
            <a href="<?php echo $full[0]; ?>" rel="photo" class="photo" <?php echo $metadata_as_attr_str; ?> data-resizing="<?php echo $resizing; ?>">
              <img src="<?php echo $thumbnail[0]; ?>" />
              <?php if(!empty($photo->post_excerpt)) : ?><span><?php echo $photo->post_excerpt; ?></span><?php endif; ?>
            </a>
  <?php   }
      	} ?>

<?php setup_postdata($post);
        $video_urls = split("\n", trim(get_post_meta($post->ID, 'vimeo_urls', true)));
        $thumbnails_pairs = split("\n\n", get_post_meta($post->ID, 'vimeo_thumb_urls', true));
        $thumbnails = array();
        foreach ($thumbnails_pairs as $pair)
          $thumbnails[(int)reset(split("\n", $pair))] = end(split("\n", $pair));
        if ($video_urls) {
          foreach ($video_urls as $video_url) {
            $video_id = (int)end(split("/", $video_url));
            $thumbnail = $thumbnails[$video_id];
            $thumbnails_parts = explode("_", $thumbnail);
            $thumbnail = $thumbnails_parts[0]."_108x72.jpg";

            if (!empty($video_url) and !empty($thumbnail)) { ?>
            
        	    <a href="<?php echo $video_url; ?>" rel="video" class="video">
        	      <img src="<?php echo $thumbnail; ?>" />
        	      <span>Play this video</span>
        	    </a>
  <?php     }
          }
        } ?>
</nav>

<?php } ?>

<?php if (get_the_content() or !empty($year) or !empty($notes)) { ?>

  <section>
    <h3>About The Work</h3>
    <?php the_content();
          $year = get_post_meta($post->ID, 'year_created', true);
          $notes = get_post_meta($post->ID, 'production_notes', true);
          if (!empty($year) or !empty($notes)) { ?>
            <p class="production_notes">
              <?php if (!empty($year)) echo '<em>' . $year . '</em>';
                    if (!empty($year) and !empty($notes)) echo '<br />';
                    if (!empty($notes)) echo $notes; ?>
            </p>
          <?php } ?>
  </section>
<?php } ?>
<?php endwhile; endif; ?>
<?php get_footer(); ?>
