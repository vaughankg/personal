var critterBox = {};
;critterBox.step_functions = (function(){
  var step_functions = {
    'levy_flight': function(old_pos, min, max)
{
  var s = levy_flight(1.5, 4);
  s = limit_step(s, scale_point(max, -1), max);
  s = reflected_step(old_pos, s, min, max);
  return s;
},
'brownian_motion': function(old_pos, min, max)
{
  var s = brownian_motion(50);
  s = limit_step(s, scale_point(max, -1), max);
  s = reflected_step(old_pos, s, min, max);
  return s;
}
}

return step_functions;

// Private functions

function scale_point(point, scale){
  return [point[0]*scale, point[1]*scale];
}

function levy_flight(alpha, beta){
  alpha = alpha || 1.5;
  beta = beta || 1;
  theta = Math.random()*2*Math.PI; // uniform random angle
  f = beta * Math.pow(Math.random(), (-1/alpha)); // fat tailed random length
  x = f*Math.cos(theta);
  y = f*Math.sin(theta);
  return [x, y];
}

function brownian_motion(alpha){
  alpha = alpha || 1.5;
  theta = Math.random()*2*Math.PI; // uniform random angle
  f = Math.random()*alpha; // uniformed random length
  x = f*Math.cos(theta);
  y = f*Math.sin(theta);
  return [x, y];
}

function limit_step(step, min, max){
  return [ Math.max(min[0], Math.min(max[0], step[0])),
         Math.max(min[1], Math.min(max[1], step[1])) ];
}

function reflected_step(current, step, min, max){
  // TODO, reflect off any object. Maybe pass in a list of objects and bounce of the nearest one.
  return [ reflect_step_dimention(current[0], step[0], min[0], max[0]),
         reflect_step_dimention(current[1], step[1], min[1], max[1]) ];
}

function reflect_step_dimention(current, step, min, max){
  if (step > 0){
    var gap = max - current;
    return (step > gap) ? (2*gap - step) : step;
  }
  else{
    var gap = min - current;
    return (step < gap) ? (2*gap - step) : step;
  }
}


})();

;critterBox.sketchyBrush = function( context, options )
{
    options = options || {};
    this.init( context, options );
}

critterBox.sketchyBrush.prototype =
{
    name: "Sketchy",
    context: null,
    prevX: null, prevY: null,
    points: null, count: null,

    init: function( context, options )
    {
        this.context = context;
        this.context.globalCompositeOperation = 'source-over';

        this.color = options.color || [250,250,250];
        this.brush_size = options.brush_size || 1;
        this.brush_pressure = options.brush_pressure || 1;
        this.max_points = 1000;

        this.points = new Array();
        this.count = 0;
    },

    destroy: function()
    {
    },

    strokeStart: function( X, Y )
    {
        this.prevX = X;
        this.prevY = Y;
    },

    stroke: function( X, Y )
    {
        var i, dx, dy, d;

        this.points.push( [ X, Y ] );
        if (this.points.length > this.max_points){
          this.points.shift();
          this.count--;
        }

        this.context.lineWidth = this.brush_size;
        this.context.strokeStyle = "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + 0.05 * this.brush_pressure + ")";

        this.context.beginPath();
        this.context.moveTo(this.prevX, this.prevY);
        this.context.lineTo(X, Y);
        this.context.stroke();

        for (i = 0; i < this.points.length; i++)
        {
            dx = this.points[i][0] - this.points[this.count][0];
            dy = this.points[i][1] - this.points[this.count][1];
            d = dx * dx + dy * dy;

            if (d < 4000 && Math.random() > (d / 2000))
            {
                this.context.beginPath();
                this.context.moveTo( this.points[this.count][0] + (dx * 0.3), this.points[this.count][1] + (dy * 0.3));
                this.context.lineTo( this.points[i][0] - (dx * 0.3), this.points[i][1] - (dy * 0.3));
                this.context.stroke();
            }
        }

        this.prevX = X;
        this.prevY = Y;

        this.count ++;
    },

    strokeEnd: function()
    {

    }
}

;critterBox.critter = function( context, options )
{
  options = options || {};
  this.init( context, options );
}

critterBox.critter.prototype =
{
  init: function( context, options )
  {
    this.canvas = context.canvas;
    this.step_function = critterBox.step_functions[(options.step_function || 'levy_flight')]
    this.prevPos = options.start_pos || [0, 0];

    this.brush = new critterBox.sketchyBrush(context, options);
  },

  takeStep: function()
  {
    var step = this.step_function.call(
        this,
        this.prevPos,
        [0, 0],
        [this.canvas.width, this.canvas.height]
    );
    var newPos = [ this.prevPos[0] + step[0], this.prevPos[1] + step[1] ]
    this.brush.strokeStart(this.prevPos[0], this.prevPos[1]);
    this.brush.stroke(newPos[0], newPos[1]);
    this.prevPos = newPos;
  }
}

;critterBox.box = function( context, critterOptions )
{
  this.init( context, critterOptions );
}

critterBox.box.prototype =
{
  init: function( context, critterOptions )
  {
    this.critters = critterOptions.map(function(options){
      return new critterBox.critter(context, options);
    });

  },

  animate: function()
  {
    var previous_timestamp = null;
    // FIXME
    var me = this;

    animloop(0);

    function animloop(timestamp){
      if (previous_timestamp === null) previous_timestamp = timestamp;
      window.requestAnimationFrame(animloop);
      if (timestamp - previous_timestamp > 0){
        me.render();
        previous_timestamp = timestamp;
      }
    }
  },

  render: function()
  {
    for(i=0;i<this.critters.length;i++){
      this.critters[i].takeStep();
    }
  }

}

