//Contant values
const CANVAS_ID = "canvas";
var SCREEN_HEIGHT = 0;
var SCREEN_WIDTH = 0;
const CAM_ZOOM = 2;
const CAM_FOLLOW_SPEED = 0.015;
const PLAYER_MOVE_SPEED = 1;
      
//Defines the path of all sprites
const SPRITES = ["TofuLeft.png", "TofuRight.png", 
                 "GunRight.png", "GunLeft.png", 
                 "Bullet.png", "Tree.png",
                 "Crosshair.png"]

const SPR_TOFU_LEFT = 0;
const SPR_TOFU_RIGHT = 1;
const SPR_GUN_RIGHT = 2;
const SPR_GUN_LEFT = 3;
const SPR_BULLET = 4;
const SPR_TREE = 5;
const SPR_CROSSHAIR = 6;

//Player directions
var spr_player_left;
var spr_player_right;
var spr_gun_left;
var spr_gun_right;
var spr_bullet;

//Globals
var prenderer;
var pstage;

//All gameobjects
var gun = new gameobject(); //The shooting objects
var player = new gameobject(); //Create the player - controlled by 
var playerdir; //Holds the direction of the player is randians

//Static objects
//var tree = new gameobject(); //For movement
var crosshair = new gameobject(); //Sticks to mouse cursor;

//Create the camera
var cam = new camera(vector2.zero, CAM_ZOOM);

//Testing
var bullets = [];

//Setup th canvas
function init()
{        
    //Create a renderer and stage
    prenderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT);
    pstage = new PIXI.Container();
    
    //Add canvas to page
    document.body.appendChild(prenderer.view);
    
    //Set renderer properties
    prenderer.view.style.position = "absolute";
    prenderer.view.style.display = "block";
    
    prenderer.autoResize = true;
    prenderer.resize(window.innerWidth, window.innerHeight);
    
    //Initial to fullscreen
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    
    //Setup
    spriteload();
}

//Calls all frame by frame functions
function updateCall()
{
    earlyCall(); //Remove all renders
    inputCall(); //Get user input
    logicCall(); //Game logic
    drawCall(); //Draw all gameObjects
    lateCall(); //Timing
    
    //Restart
    requestAnimationFrame(updateCall);
}

function spriteload()
{
    //Crosshair
    crosshair.renderer.init(pstage, new sprite(SPRITES[SPR_CROSSHAIR]), 9);
    
    //Init sprites    
    spr_gun_right = new sprite(SPRITES[SPR_GUN_RIGHT]);
    spr_gun_left = new sprite(SPRITES[SPR_GUN_LEFT]);
    spr_player_right = new sprite(SPRITES[SPR_TOFU_RIGHT]);
    spr_player_left = new sprite(SPRITES[SPR_TOFU_LEFT]);
    spr_bullet = new sprite(SPRITES[SPR_BULLET]);
    
    //Bootstrap
    sprite.loadsprites(SPRITES, setup);
}

//Start
function setup()
{
    //Set background colour
    //prenderer.backgroundColor = new colour(200, 200, 200).toPIXIString();
      prenderer.backgroundColor = 0xDDDDDD;
    
    //Set camera position
    cam.position = new vector2(-SCREEN_WIDTH / (2 * cam.zoom), SCREEN_HEIGHT / (2 * cam.zoom));
    
    //Gun renders above, player
    player.renderer.depth = 2;
    gun.renderer.depth = 3;
    
    player.addChild(gun);
    
    //Set transform
    gun.transform.position = new vector2(0, 0);
    gun.transform.center = new vector2(-0.2, 0.25);
    
    //The gun is a child of the player
    player.renderer.init(pstage, spr_player_right);
    gun.renderer.init(pstage, spr_gun_right);
    
    //Done
    updateCall();
}

function earlyCall() { }

function inputCall() 
{
    //Find the direction of a movement
    input.updateAxis();
}

//When to change sprite
var spritechangeleft = 0, spritechangeright = 0;
var gunchangeleft = 0, gunchangeright = 0;

function logicCall()
{    
    //Set crosshair position
    var mousepoint = camera.screenToWorldPos(cam, input.mousepos);
    crosshair.transform.position = mousepoint;
    
    //Find mouse position as a world point
    var normalizedmouse = new vector2(mousepoint.x - player.transform.position.x, 
                                      mousepoint.y - player.transform.position.y)
    
    //Find the quadrant of the screen inhabited by the mouse
    //Relative to the player
    //if x is -1 then mouse is bottom half of the screen
    //if x is +1 then mouse is top half of the screen
    //if y is -1 then mouse is left side of the screen
    //if y is +1 then mouse is right side of the screen
    var mousequadrant = new vector2(0, 0);
    
    if(normalizedmouse.x > 0) mousequadrant.x = +1;
    if(normalizedmouse.x < 0) mousequadrant.x = -1;
    if(normalizedmouse.y > 0) mousequadrant.y = +1;
    if(normalizedmouse.y < 0) mousequadrant.y = -1;
    
    //Set the player sprite based on mouse position
    if(mousequadrant.x == +1 && spritechangeright == 0) 
    { player.renderer.init(pstage, spr_player_right); spritechangeright += 1; spritechangeleft = 0; }
    if(mousequadrant.x == -1 && spritechangeleft == 0) 
    { player.renderer.init(pstage, spr_player_left); spritechangeleft += 1; spritechangeright = 0; }
    
    //Flip the gun sprite based on the direction that the mouse is on the screen
    //This prevents the gun from being upside down
    if(mousequadrant.x == +1 && gunchangeright == 0) 
    { gun.renderer.init(pstage, spr_gun_right); gunchangeright += 1; gunchangeleft = 0; }
    if(mousequadrant.x == -1 && gunchangeleft == 0) 
    { gun.renderer.init(pstage, spr_gun_left); gunchangeleft += 1; gunchangeright = 0; }
    
    //Set gun render depth based on mouse position
    if(mousequadrant.y == -1) gun.renderer.depth = 1;
    if(mousequadrant.y == +1) gun.renderer.depth = 3;
    
    //Make that position relative to the guns center, and normalize
    //Find the direction to point the gun based on mouse position 
    gun.transform.rotation = vector2.lookat(normalizedmouse);
    
    //Check for muti input
    var movemod = 1.0;
    if(mathf.abs(input.inputhor) + mathf.abs(input.inputvert) == 2) movemod = 0.7;
    
    
    //Move based on axis
    player.transform.position.x += input.inputhor * PLAYER_MOVE_SPEED;
    player.transform.position.y -= input.inputvert * PLAYER_MOVE_SPEED;
    
    //Shooting
    if(input.isdown(keycode.space))
    {
        //Covnert gun rotation to direction normalized vector
        var dir = vector2.normalize(new vector2(
            mathf.cos(gun.transform.rotation * mathf.DEG_TO_RAD), 
            mathf.sin(gun.transform.rotation * mathf.DEG_TO_RAD)));
           
        //Create randomization
        dir = new vector2(dir.x + random.range(0, 0.1), dir.y + random.range(0, 0.1));

        //Create the bullet
        var temp = new bullet(spr_bullet, pstage, gun.localtransform.position, new vector2(-3, 2), dir);
        bullets.push(temp);
        console.log(bullets);
    }
    
    //Update bullet class
    for(var i = 0; i < bullets.length; i++) { bullets[i].update(); }
    
    //Set camera pos
    var playercenter = new vector2(0, 0);
    
    playercenter.x = player.transform.position.x + (-SCREEN_WIDTH / (2 * cam.zoom));
    playercenter.y = -player.transform.position.y + (SCREEN_HEIGHT / (2 * cam.zoom));
    
    cam.position.x = mathf.lerp(cam.position.x, playercenter.x, CAM_FOLLOW_SPEED);
    cam.position.y = mathf.lerp(cam.position.y, playercenter.y, CAM_FOLLOW_SPEED);
}

function drawCall() 
{    
    //Draw
    renderer.draw(prenderer, pstage, cam); 
}

function lateCall() {  }

//Subscribe to events
window.addEventListener("load", init);

/*Click for click and create a bullet object
    if(input.isdown(keycode.space)) 
    {
        //Covnert gun rotation to direction normalized vector
        var dir = vector2.normalize(new vector2(
            mathf.cos(gun.transform.rotation * mathf.DEG_TO_RAD), 
            mathf.sin(gun.transform.rotation * mathf.DEG_TO_RAD)));
           
        //Create randomization
        dir = new vector2(dir.x + random.range(0, 0.1), dir.y + random.range(0, 0.1));

        //Create the bullet
        var temp = new bullet(spr_bullet, pstage, gun.localtransform.position, new vector2(-3, 2), dir);
    }
    
    //Update bullet class
    for(var i = 0; i < allbullets.length; i++) { allbullets[i].transform.position.x += 1;}//bullet.all[i].update(); }
*/