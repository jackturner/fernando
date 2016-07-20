<?php get_header(); ?>

<header>
  <h1><?php bloginfo('name'); ?></h1>
  <h2><a href="#artist_statement">Artist Statement</a></h2>
  <h2><a href="#contact_information">Contact Information</a></h2>
  <h2><a href="#press_pub">Press and Publications</a></h2>
  <h2><a href="#twitter">twitter</a></h2>
</header>

<nav class="projects">
  <span class="black"></span>
  <span class="black"></span>

  <?php
    foreach(all_public_posts() as $post) : setup_postdata($post); ?>

    <?php $i = 0; while($i < 1) { ?>

      <a class="project" href="<?php the_permalink(); ?>" data-thumbnail-url="<?php
        if (function_exists('get_the_image')) {
          $thumbnail = get_the_image(array('format'=>'array'));
          echo $thumbnail[src];
        } ?>"><span class="project_caption"><?php the_title(); ?></span></a>
      
    <?php $i++; } ?>

  <?php endforeach; ?>
</nav>

<footer>
  <section id="twitter">
    <a class="twitter-timeline" data-dnt=true href="https://twitter.com/polyfluid" width="640" height="480" data-widget-id="296809440915623936">Tweets by @polyfluid</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
  </section>

  <section id="artist_statement">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <?php the_content(); ?>
      <em><?php bloginfo('name'); ?></em>
    <?php endwhile; endif; ?>
  </section>
  
  <section id="contact_information">
    <ul>
      <li><?php echo nl2br(get_post_meta($post->ID, 'address', true)); ?></li>
      <li><?php echo get_post_meta($post->ID, 'phone_number', true); ?></li>
      <li><a href="mailto:<?php echo get_post_meta($post->ID, 'email_address', true); ?>"><?php echo get_post_meta($post->ID, 'email_address', true); ?></a></li>
      <li><a href="http://twitter.com/<?php echo get_post_meta($post->ID, 'twitter_account', true); ?>">Twitter</a></li>
      <li><a href="<?php echo get_post_meta($post->ID, 'facebook_account', true); ?>">Facebook</a></li>
      <li><a href="http://fernandoorellana.com/wp-content/uploads/2010/08/CV-2015.pdf">CV</a></li>
      <li><a href="http://fernandoorellana.com/wp-content/uploads/2010/08/Biography_2014.pdf">BIO</a></li>
      <li><a href="http://digitalarts.union.edu/" target="_blank" >Courses</a></li>
    </ul>
  </section>

  <section id="press_pub">
    <h2>PUBLICATIONS</h2>
    <ul>
      <li><a href="http://www.lulu.com/product/paperback/new-artscience-affinities/18161322" target="_blank">New Art/Science Affinities</a></li>
      <li><a href="press/a_touch_of_code.pdf" target="_blank">A Touch of Code: Interactive installations and experiences</a></li>
      <li><a href="press/digital_by_design005.pdf" target="_blank">Digital by Design</a></li>
      <li><a href="press/emergentes_orange004.pdf" target="_blank" >Emergentes: Exhibition Catalog - Spain</a></li>
      <li><a href="press/emergentes_final.pdf" target="_blank" >Emergentes: Exhibition Catalog - Argentina</a></li>
      <li><a href="press/redivider003.pdf" target="_blank" >ReDvider</a></li>
  </ul>
  <h2>SELECTED PRESS</h2>
  <table width="100%" border="0">
    <tr>
      <td>
        <ul>
          <li><a href="press/ArtInAmerica_Brainwave_April08.pdf" target="_blank" >Art in America</a></li>
          <li><a href="press/ArtReview_Brainwave_May2008.pdf" target="_blank" >ArtReview</a></li>
          <li><a href="press/art-news-2009-06.pdf" target="_blank" >ARTnews</a></li>
          <li><a href="press/make_FO_2008.pdf" target="_blank" >Make: technology on your time</a></li>
          <li><a href="press/Un_Marco_Modular.pdf" target="_blank" >El Diario De Hoy</a></li>
          <li><a href="press/doc4.pdf" target="_blank" >CLARÍN</a></li>
          <li><a href="press/doc5.pdf" target="_blank" >PERFIL</a></li>
          <li><a href="press/Critica_2008_Argentina.pdf" target="_blank" >CRÍTICA</a></li>
          <li><a href="press/20090204114832480.pdf" target="_blank" >Focus Junior "La Pagina Verde"</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="press/TWM_aug_issue-FO.pdf" target="_blank" >Today's Machining World</a></li>
          <li><a href="press/fernando_orellana_metroland_2008.pdf" target="_blank" >Metroland</a></li>
          <li><a href="press/Realtime_Beap.pdf" target="_blank" >RealTime Arts</a></li>
          <li><a href="press/Remixer_Beap.pdf" target="_blank" >RealTime Arts - Interview</a></li>
          <li><a href="press/Synapsis_Exhibition_In-Formation.pdf" target="_blank" >Leonardo Electronic Almanac</a></li>
          <li><a href="press/Technically_Brilliant_Chicago_Reader.pdf" target="_blank" >The Chicago Reader</a></li>
          <li><a href="press/StoryLook_ThePitch.pdf" target="_blank" >The Pitch</a></li>
        </ul>
      </td>
    </tr>
  </table>
   
  <h2>Selected Blogoshpere</h2>
  <table width="100%" border="0">
    <tr>
      <td>
        <ul>
          <li><a href="http://b-t-r.co/MVMuss" target="_blank" >BreakThru Radio - Art Uncovered - Radio Interview</a></li>
          <li><a href="http://hyperallergic.com/52155/fernando-orellana-shadows/" target="_blank" >Hyperallergic</a></li>
          <li><a href="http://bombsite.com/issues/1000/articles/6283" target="_blank" >BOMBlog - Interview</a></li>
          <li><a href="http://www.wired.co.uk/news/archive/2011-03/01/extruder-car-art-fernando-orellana" target="_blank" >WIRED.CO.UK</a></li>
          <li><a href="http://tecniarts.com/fernando-orellana-tecnologia-suenos/" target="_blank" >Tecniarts</a></li>
          <li><a href="http://we-make-money-not-art.com/archives/2011/03/at-the-tone-please-leave-a-mes.php" target="_blank" >We Make Money Not Art: Interview - 2011</a></li>
          <li><a href="http://www.flypmedia.com/issues/10/#9/1" target="_blank" >FLYP Magazine</a></li>
          <li><a href="http://science.slashdot.org/story/08/02/18/1651251/Robot-Interprets-Plays-Back-Dreams" target="_blank" >SlashDot</a></li>
          <li><a href="http://www.eggshell-robotics.com/blog/71-sleep-waking-let-the-robot-replay-your-dreams" target="_blank" >EggShell Robotics</a></li>
        </ul>
      </td>
      <td>
        <ul>
          <li><a href="http://www.eggshell-robotics.com/blog/71-sleep-waking-let-the-robot-replay-your-dreams" target="_blank" >EggShell Robotics</a></li>
          <li><a href="http://www.columbiaspectator.com/2008/03/03/channeling-left-brain-exit-art-exhibit" target="_blank" >Columbia Spectator</a></li>
          <li><a href="http://www.livescience.com/4842-machine-interprets-dreams.html" target="_blank" >Live Science</a></li>     
          <li><a href="http://www.gizmowatch.com/entry/robot-to-live-dreams-in-the-real-world-of-illusions/" target="_blank" >Gizmo Watch</a></li>          
          <li><a href="http://www.engadget.com/2008/02/16/humanoid-acts-out-your-dreams-encourages-insomnia/" target="_blank" >Engadget</a></li>              
          <li><a href="http://we-make-money-not-art.com/archives/2008/05/interview-with-fernando-orella.php" target="_blank" >We Make Money Not Art: Interview - 2008</a></li>
          <li><a href="http://www.wired.com/science/discoveries/news/2004/12/66101" target="_blank" >WIRED</a></li>
          <li><a href="http://www.insideline.com/chevrolet/orlando-concept/play-doh-version-of-chevrolet-orlando-launched.html" target="_blank" >Inside Line</a></li>
        </ul>
      </td>
    </tr>
  </table>
</section>



</footer>

<?php get_footer(); ?>