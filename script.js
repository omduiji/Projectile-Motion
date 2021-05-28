var Engine = Matter.Engine,
  Events = Matter.Events,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Constraint = Matter.Constraint,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Vector = Matter.Vector;
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.getElementById('renderport'),
  engine: engine,
  options: {
    width: 1200,
    height: 600,
    showVelocity: true,
    showCollisions: true,
    background: '#0f0f13',
  },
});
function start() {
  document.querySelector('#reset').disabled = true;
  let angle = document.querySelector('#angl').value;
  angle = (angle * Math.PI) / 180;

  let v = document.querySelector('#vel').value;
  vx = v * Math.cos(angle);
  vy = -v * Math.sin(angle);

  let coff = document.querySelector('#rst').value;
  let yPos =
    Number(document.querySelector('#yPos').value) <= 600
      ? Number(document.querySelector('#yPos').value)
      : 400;
  let ball = Bodies.circle(0, yPos, 30, {
    friction: 0,
    frictionAir: 0,
    restitution: coff,
    inverseInertia: 0,
  });
  let ground = Bodies.rectangle(400, 600, 2000, 60, {
    friction: 0,
    isStatic: true,
  });

  engine.world.gravity.y = 1;

  Matter.Body.setVelocity(ball, { x: vx, y: vy });

  // add all of the bodies to the world
  World.add(engine.world, [ground, ball]);

  //add trail

  let trail = [];

  Events.on(render, 'afterRender', function () {
    trail.unshift({
      position: Vector.clone(ball.position),
      speed: ball.speed,
    });

    Render.startViewTransform(render);
    render.context.globalAlpha = 0.7;

    for (let i = 0; i < trail.length; i += 1) {
      let point = trail[i].position,
        speed = trail[i].speed;

      let hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
      render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
      render.context.fillRect(point.x, point.y, 2, 2);
    }

    render.context.globalAlpha = 1;
    Render.endViewTransform(render);

    if (trail.length > 400) {
      trail.pop();
      document.querySelector('#reset').disabled = false;
    }
  });

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);
}
function reset() {
  document.querySelector('#angl').value = 15;
  document.querySelector('#vel').value = 6;
  document.querySelector('#yPos').value = null;
  document.querySelector('#rst').value = 1;
}
document.querySelector('#startBtn').addEventListener('click', start);
document.querySelector('#reset').addEventListener('click', reset);
