<?php

  include_once "header.php";
?>

<div class="container-fluid">

  <div class="row pe-0" id="header-row">
    <div class="col-md-12 pe-0 float-end text-end">
      <img id="profile-image" class="float-start border-0 ms-2" style="display:none;width:10%;"/>
      <div id="name-contact" class="d-inline-block">
        <h1 id="resume-name" class=""></h1>
        <div id="contact-icons" class="float-end"></div>
        <p id="statement" class="m-4 fw-lighter"></p>
      </div> <!-- end name and contact info -->
    </div>
  </div>
  <!-- <div class="row px-4">
    <div id="statement" class="col-md-12 text-center fw-lighter">
      <p class="m-4 fw-lighter"></p>
    </div>
  </div>  -->
  <!-- end first row -->

  <div class="row px-4"> <!-- buttons for the cv elements -->
    <div class="type-btns text-center"></div>
  </div>
  <div class="row">
    <div id="topic-col" class="col-md-12 hide"></div>
  </div>
  <div id="cv-content" class="row mt-4 px-4">
    <!-- <div id="feature-col" class="col-md-12 pl-1"></div> -->
    <div id="about-col" class="item-col col-md hide"></div>
    <div id="experience-col" class="item-col col-md"></div>
    <div id="projects-col" class="item-col col-md"></div>
    <div id="skills-col" class="item-col col-md"></div>
    <div id="education-col" class="item-col col-md hide"></div>
  </div>
</div>

</body>
</html>
