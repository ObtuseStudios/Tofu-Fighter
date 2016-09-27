//Global for the phaser game instance
var game = null;

//All gameobjects
var crosshair;
var player;
var spr_bullet;
var gun;

//Bullets
var nextshottimer = 0.0; //Times how long till the next shot can be taken
var timebetweenshots = 0.2; //per second reload time

//Groups
var user; //Holds gun and player

//Level group
var level;

//Before anything has started
function awake()
{
    //Set game size based on window size
    resize();

    //Allows for pixel art rendering
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;
    game.time.advancedTiming = true;

    //Load all sprites
    for (var property in settings.spr)
    {
        if (settings.spr.hasOwnProperty(property))
        {
            //Load
            game.load.image(settings.spr[property].name, settings.spr[property].path);
        }
    }
}

//Now that the game has loaded
function start()
{
    //Set stage properties
    game.camera.scale = new Phaser.Point(settings.camera_zoom, settings.camera_zoom);
    game.stage.backgroundColor = settings.background_colour;

    //Level - temp
    level = game.add.group();
    var staticcrate = level.create(300, 100, settings.spr.crate.name);

    for(var y = 0; y < 10; y++)
    {
        for(var x = 0; x < 10; x++)
        {
            var staticbox = level.create(150 + (x * 40), 200 + (y * 40), settings.spr.box.name);
        }
    }

    //Get objects
    var center = new Phaser.Point(game.world.centerX, game.world.centerY);

    user = game.add.group();
    player = user.create(center.x, center.y, settings.spr.player_right.name);
    gun = user.create(0, 0, settings.spr.gun_right.name);
    crosshair = game.add.sprite(center.x, center.y, settings.spr.crosshair.name);

    //Positining of ranchro
    gun.anchor = new Phaser.Point(-0.2, 0.3);
    player.anchor = new Phaser.Point(0.5, 0.5);
    crosshair.anchor = new Phaser.Point(0.5, 0.5);
    game.world.setBounds(0, 0, 2000, 2000);

    //Bullet should not be added to world
    spr_bullet = game.make.sprite(0, 0, settings.spr.bullet.name);

    //Camera propertie
    game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT, 0.1, 0.1);

    //Attach gun to player
    gun.position = player.position;

    //Enable the QuadTree
    game.physics.arcade.skipQuadTree = false;

    //Add physics
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(level, true);
}

//Save memory
//When to change sprite
var spritechangeleft = 0, spritechangeright = 0;
var depthchangeleft = 0, depthchangeright = 0;
var gunchangeleft = 0, gunchangeright = 0;

//Main update function
function update()
{
    //Find delta time
    var delta = game.time.elapsed / 1000;

    //Attach the crosshair to the mouse
    var mousepoint = new Phaser.Point(game.input.activePointer.worldX, game.input.activePointer.worldY);
    crosshair.position = mousepoint;

    //Find mouse position as a world point
    var normalizedmouse = new Phaser.Point(mousepoint.x - player.position.x,
                                           mousepoint.y - player.position.y)

    //Find the quadrant of the screen inhabited by the mouse
    //Relative to the player
    //if x is -1 then mouse is bottom half of the screen
    //if x is +1 then mouse is top half of the screen
    //if y is -1 then mouse is left side of the screen
    //if y is +1 then mouse is right side of the screen
    var mousequadrant = new Phaser.Point(0, 0);

    if(normalizedmouse.x > 0) mousequadrant.x = +1;
    if(normalizedmouse.x < 0) mousequadrant.x = -1;
    if(normalizedmouse.y > 0) mousequadrant.y = +1;
    if(normalizedmouse.y < 0) mousequadrant.y = -1;

    //Set the player sprite based on mouse position
    if(mousequadrant.x == +1 && spritechangeright == 0)
    { player.loadTexture(settings.spr.player_right.name); spritechangeright += 1; spritechangeleft = 0; }
    if(mousequadrant.x == -1 && spritechangeleft == 0)
    { player.loadTexture(settings.spr.player_left.name); spritechangeleft += 1; spritechangeright = 0; }

    //Flip the gun sprite based on the direction that the mouse is on the screen
    //This prevents the gun from being upside down
    if(mousequadrant.x == +1 && gunchangeright == 0)
    { gun.loadTexture(settings.spr.gun_right.name); gunchangeright += 1; gunchangeleft = 0; }
    if(mousequadrant.x == -1 && gunchangeleft == 0)
    { gun.loadTexture(settings.spr.gun_left.name); gunchangeleft += 1; gunchangeright = 0; }

    //Set gun render depth based on mouse position
    if(mousequadrant.y == +1 && depthchangeright == 0)
    { user.moveUp(gun); depthchangeright += 1; depthchangeleft = 0; }
    if(mousequadrant.y == -1 && depthchangeleft == 0)
    { user.moveDown(gun); depthchangeleft += 1; depthchangeright = 0; }

    if(mousequadrant.y == -1 && depthchangeleft == 0)
    { user.swap(player, gun); depthchangeright += 1; depthchangeleft = 0; }
    if(mousequadrant.y == +1 && depthchangeright == 0)
    { user.swap(player, gun); depthchangeleft += 1; depthchangeright = 0; }

    //Rotate gun to look at mouse
    gun.rotation = mathf.atan2(normalizedmouse.y, normalizedmouse.x);

    //Get the input as an axis
    var inputhor = 0;
    var inputvert = 0;

    //Calculate input direction
    if(game.input.keyboard.isDown(settings.keyboard_left))  { inputhor -= 1; }
    if(game.input.keyboard.isDown(settings.keyboard_right)) { inputhor += 1; }

    if(game.input.keyboard.isDown(settings.keyboard_up))    { inputvert += 1; }
    if(game.input.keyboard.isDown(settings.keyboard_down))  { inputvert -= 1; }

    //When diagonal limit movement
    var movemod = 1.0;
    if(mathf.abs(inputhor) + mathf.abs(inputvert) == 2) movemod = 0.7;

    //Move player
    player.body.velocity.x = +inputhor * delta * movemod * settings.player_move_speed;
    player.body.velocity.y = -inputvert * delta * movemod * settings.player_move_speed;

    //Apply collision check with the player and the world group
    game.physics.arcade.collide(player, level);
    game.physics.arcade.collide(level, level);

    //Shooting
    if((game.input.keyboard.isDown(settings.keyboard_shoot) ||
       game.input.activePointer.isDown)

       && nextshottimer >= timebetweenshots)
    {
        //Create a new bullet
        var b = new bullet(player, gun, spr_bullet.key);
        nextshottimer = 0;
    }

    //Update all bullets
    bullet.updateall(delta);
    nextshottimer += delta;
}

//Setup phaser
function init()
{
    //Create the phaser game instance
    game = new Phaser.Game(settings.screen_width, settings.screen_height, //Screen size
        Phaser.AUTO, "",     //Create a webgl of canvas context

        //Setup the callbacks
        {
          preload: awake,  //Set callback on preloader
          create: start,   //Once game has been created callback
          update: update,  //Main loop callback
          render: render   //Debug drawing
        },

        false, false); //No antialiasing
}

//Debugging
function render()
{
    //Show debugging statistics
    if(settings.debug_mode == true)
    {
        game.debug.body(player);
        game.debug.text(game.time.fps || '?', 2, 30, "rgb(0, 0, 0)");
        game.debug.quadTree(game.physics.arcade.quadTree);
        for(var i = 0; i < level.children.length; i++) game.debug.body(level.getChildAt(i));
    }
}

//Resize the window
function resize()
{
    //Only if game hsa been created
    if(game.scale == null) return;

    //Fix phaser game instance
    game.scale.setGameSize(settings.screen_width, settings.screen_height);

    //game.scale.minWidth = settings.screen_width;
    //game.scale.minHeight = settings.screen_height;

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    //Done
    debug.log("Scaled to: " + window.innerWidth + " x " + window.innerHeight);
}

//Subscribe to events
window.addEventListener("load", init);
window.addEventListener("resize", resize);
