$(function(){

  $('.nav-button').on('click', function(){
    // clear the header
    //$('header').addClass('invisible');
    $('#intro').toggleClass('at-top');
    $content_box = $("#" + $(this).attr('id') + "-box");
    // hide other boxes
    $content_box.siblings('.content-box').addClass('hidden');
    // toggle the curret box
    $content_box.toggleClass('hidden');
  });

    var canvas = document.getElementById('background-canvas');
    var ctx = canvas.getContext('2d');

    //preserve aspect ratio of canvas but dont let it get too big;
    var w = $(window).width();
    var h = $(window).height();
    var ratio = w / h;
    if (ratio > 1){
      canvas.width = Math.min(1500, w);
      canvas.height = canvas.width / ratio;
    }
    else{
      canvas.height = Math.min(1500, h);
      canvas.width = canvas.height*ratio;
    }

    console.log(canvas.width);
    console.log(canvas.height);

    var mid_pos = [canvas.width/2, canvas.height/2];

    var critters = [
      // dark ones
      {start_pos: mid_pos, color: [0,0,0], step_function: 'brownian_motion', brush_size: 1, brush_pressure: 50},
      {start_pos: mid_pos, color: [0,0,0], step_function: 'brownian_motion', brush_size: 1, brush_pressure: 50},
      {start_pos: mid_pos, color: [0,0,0], step_function: 'levy_flight', brush_size: 3, brush_pressure: 3},
      {start_pos: mid_pos, color: [0,0,0], step_function: 'levy_flight', brush_size: 1, brush_pressure: 1},
      // light ones
      {start_pos: mid_pos, color: [100,100,100], step_function: 'levy_flight', brush_size: 5, brush_pressure: 5},
      {start_pos: mid_pos, color: [250,250,250], step_function: 'levy_flight', brush_size: 1, brush_pressure: 1},
      {start_pos: mid_pos, color: [250,250,250], step_function: 'levy_flight', brush_size: 1, brush_pressure: 10},
      {start_pos: mid_pos, color: [200,200,200], step_function: 'levy_flight', brush_size: 5, brush_pressure: 1},
      {start_pos: mid_pos, color: [150,150,150], step_function: 'levy_flight', brush_size: 5, brush_pressure: 5}
    ];

    var cr_anim = new critterBox.box(ctx, critters);
    cr_anim.animate();
});
