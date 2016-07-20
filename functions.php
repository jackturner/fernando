<?php


add_theme_support('post-thumbnails'); 


function all_public_posts() {
  $args = array(
          	'post_type' => 'projects',
          	'numberposts' => -1,
          	'meta_key' => 'project_visibility',
          	'meta_value' => 'Show project on homepage',
          	'orderby' => 'menu_order',
          	'order' => 'ASC'
        	);
  return get_posts($args);
}


function photos_in_project($post_ID) {
  $args = array(
        	'post_type' => 'attachment',
        	'numberposts' => -1,
        	'post_status' => null,
        	'post_parent' => $post_ID,
        	'orderby' => 'menu_order',
        	'order' => 'ASC'
      	); 
  return get_posts($args);
}

function get_content($url) { 
  $ch = curl_init(); 
  curl_setopt ($ch, CURLOPT_URL, $url); 
  curl_setopt ($ch, CURLOPT_HEADER, 0); 
  ob_start(); 
  curl_exec ($ch); 
  curl_close ($ch); 
  $string = ob_get_contents(); 
  ob_end_clean(); 
  return $string; 
} 

// For each Vimeo URL entered it'll store the video's ID followed by a line break follow
// by the URL of it's thumbnail [retrieved via Vimeo's API] followed by 2 more line breaks
function update_video_thumbnail_urls($post_ID) {
  global $post;
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return $post_ID;
  $videos = explode("\n", get_post_meta($post_ID, 'vimeo_urls', true));
  $thumb_urls_str = '';  
  foreach ($videos as $video_url) {
    if (!empty($video_url)) {
      $oembed_endpoint = 'http://vimeo.com/api/oembed';
      $xml_url = $oembed_endpoint . '.xml?url=' . rawurlencode($video_url) . '&height=36';
      $oembed = simplexml_load_string(get_content($xml_url));
      $thumb_urls_str .= $oembed->video_id . "\n" . $oembed->thumbnail_url . "\n\n";
    }
  }
  update_post_meta($post_ID, 'vimeo_thumb_urls', trim($thumb_urls_str));
  return $post_ID;
}


// Thumbnails URLs get stored at the end of the post-saving process (hence priority 12)
add_action('save_post', 'update_video_thumbnail_urls', 12);


// Add the custom post types to the main WordPress RSS Feed
// http://www.wpbeginner.com/wp-tutorials/how-to-add-custom-post-types-to-your-main-wordpress-rss-feed/
function myfeed_request($qv) {
	if (isset($qv['feed']))
		$qv['post_type'] = get_post_types();
	return $qv;
}
add_filter('request', 'myfeed_request');


?>