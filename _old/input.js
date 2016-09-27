//Holds key codes
var keycode = 
{
    //Keycodes
    space: 32,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    w: 87,
    a: 65,
    s: 83,
    d: 68,
    
    //Mouse buttons
    mouseleft: 0,
    mousemiddle: 1,
    mouseright: 2
}

//Event handeling
var input = 
{
    //Holds mouse position
    mousepos: new vector2(0, 0),
    
    //Holds the state of the mouse click
    clicks: {},
    
    //Holds an array of bools
    held: {},
    
    //Holds an input direction
    inputvert: 0,
    inputhor: 0,
    
    //Getter
    isdown: function(keyCode) { return this.held[keyCode]; },
    isclick: function(mousecode) { return this.clicks[mousecode]; },
    
    //Event callback
    onMouseDown: function(event) { this.clicks[event.button] = true; },
    onKeydown: function(event) { this.held[event.keyCode] = true; },
    onMouseUp: function(event) { delete this.clicks[event.button]; },
    onKeyup: function(event) { delete this.held[event.keyCode]; },
    
    //Udate the input axis
    updateAxis: function()
    {
        //Reset
        this.inputhor = 0;
        this.inputvert = 0;

        //Calculate input direction    
        if(this.isdown(keycode.a) || this.isdown(keycode.left)) this.inputhor -= 1;
        if(this.isdown(keycode.d) || this.isdown(keycode.right)) this.inputhor += 1;

        if(this.isdown(keycode.w) || this.isdown(keycode.up)) this.inputvert += 1;
        if(this.isdown(keycode.s) || this.isdown(keycode.down)) this.inputvert -= 1;
    }
};

//Setup the callbacks
window.addEventListener('keyup', function(event) { input.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { input.onKeydown(event); }, false);

window.addEventListener('mouseup', function(event) { input.onMouseUp(event); }, false);
window.addEventListener('mousedown', function(event) { input.onMouseDown(event); }, false);

window.addEventListener('mousemove', function(event) { 
    input.mousepos.x = event.x; input.mousepos.y = event.y; }, false);