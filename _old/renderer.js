//Enum for all the different draw modes
var drawtypes = 
{
    rect : 0,
    sprite: 1,
}

//A sprite object contains image infomation
function sprite(path)
{
    this.path = path; //Image path
    this.pixidata = null; //Holds the actual pixi image
    this.loaded = false; //Holds load state
    
    //Will add to an array to be loaded
    sprite.objs.push(this);
}

sprite.loadedassets = false; //Global holding load state os sprites
sprite.objs = []; //A static array of all sprs
var spritecallback;

//Static function to load a sprite
sprite.loadsprites = function(paths, callback)
{    
    //Setup PIXI textures
    spritecallback = callback;
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    
    //Create an array of paths
    var parr = [];
    for(var i = 0; i < sprite.objs.length; i++) 
    {
        //Check that array does not already contina
        if(parr.includes(sprite.objs[i].path) == false) parr.push(sprite.objs[i].path);
    }
    
    //Load
    PIXI.loader
    .add(parr)
    .on("progress", sprite.loadProgressHandler)
    .load(sprite.parsesprite)
}

//Displkays loading progress
sprite.loadProgressHandler = function(l, r) { console.log(r.url + " " + mathf.round(l.progress) + "%"); }

//Called autmatically by the lad sprite function
sprite.parsesprite = function()
{    
    //Loop through
    for(var i = 0; i < sprite.objs.length; i++) 
    {
        //Grab from the texture cache
        var point = sprite.objs[i];
        point.pixidata = new PIXI.Sprite(PIXI.loader.resources[point.path].texture);
        point.loaded = true;
    }
    
    //Successfully loaded into teture cache
    console.log("Loaded all assets.");
    sprite.loadedassets = true;
    spritecallback();
}

//Every game object renderer contains this
function renderer()
{    
    //Holds sprite data
    this.sprite = null;
    
    //Holds position in renderer list
    this.queuedel = false;
    this.initted = false;
    
    //Holds the depth to render at
    this.depth = 0;
    
    //Loads a sprite
    this.init = function(stage, spr, d=this.depth) 
    { 
        //Remove previous
        if(this.sprite != null) stage.removeChild(this.sprite.pixidata);
        
        //Set
        this.sprite = spr;
        this.depth = d;
        this.initted = false;
        
        this.spriteinstance();
    }
    
    this.spriteinstance = function()
    {
        if(this.sprite.pixidata != null)
        {
            this.sprite.pixidata = new PIXI.Sprite(PIXI.loader.resources[this.sprite.path].texture);
            this.initted = true;

            console.log("Initted the sprite: " + this.sprite.path);
        }
        else { console.log("Not loaded."); }
    }
    
    //Has reset transform
    this.setlocal = false;
    
    //Draw the current instance
    this.intstancedraw = function(obj)
    {
        //Make sure parent position has been set
        if(obj.parent != null) 
        { 
            if(obj.parent.renderer.setlocal == false) obj.parent.renderer.intstancedraw(obj.parent); 
        }
        
        //Store
        var px = mathf.round(obj.transform.position.x);
        var py = mathf.round(obj.transform.position.y);
        var sx = obj.transform.scale.x;
        var sy = obj.transform.scale.y;
        var r = obj.transform.rotation * mathf.DEG_TO_RAD;
        
        //The anchor is a percentage across image, so the pecent per pixel needs to be found
        var ppercent = new vector2(obj.renderer.sprite.pixidata.width, obj.renderer.sprite.pixidata.height);
        
        var ax = mathf.round(obj.transform.center.x * ppercent.x) / ppercent.x;
        var ay = mathf.round(obj.transform.center.y * ppercent.y) / ppercent.y;
        
        //Modify attributes if there is a parent present
        if(obj.parent != null)
        {
            //For now center and render properties are NOT inerited
            px += obj.parent.localtransform.position.x;
            py += obj.parent.localtransform.position.y;
            r  += obj.parent.transform.rotation * mathf.DEG_TO_RAD;
            sx *= obj.parent.localtransform.scale.x;
            sy *= obj.parent.localtransform.scale.y;
            //ax += obj.parent.transform.center.x;
            //ay += obj.parent.transform.center.y;
        }
        
        obj.localtransform.position = new vector2(px, py);
        obj.localtransform.scale = new vector2(sx, sy);
        obj.localtransform.center = new vector2(ax, ay);
        obj.localtransform.rotation = r;
        
        //All positions are rounded for pixel art effect        
        this.sprite.pixidata.x = obj.localtransform.position.x;
        this.sprite.pixidata.y = obj.localtransform.position.y;
        
        this.sprite.pixidata.anchor.x = obj.localtransform.center.x;
        this.sprite.pixidata.anchor.y = obj.localtransform.center.y;
        
        this.sprite.pixidata.scale.x = obj.localtransform.scale.x;
        this.sprite.pixidata.scale.y = obj.localtransform.scale.y;
        
        this.sprite.pixidata.rotation = obj.localtransform.rotation;
        
        //Finally the position has been adjusted
        this.setlocal = true;
    }
    
    //Destroys a graphics instance
    this.destroy = function() { this.queuedel = true; }
}

//Contains a static array
renderer.allobjects = [];

//This function will draw a gamobject
//This is a static compont of renderer
renderer.draw = function(prend, pst, camera = undefined)
{    
    //Assets must be loaded
    if(!sprite.loadedassets) return;
    
    //Set camera properties
    pst.scale.x = camera.zoom;
    pst.scale.y = camera.zoom;
    
    pst.x = -camera.position.x * camera.zoom;
    pst.y = camera.position.y * camera.zoom;
    pst.rotation = camera.rotation;
    
    //Sort through the 10 drawing layers
    var drawstack = [];
    
    //Slow - temp
    for(var i = 0; i < renderer.allobjects.length; i++)
    {
        renderer.allobjects[i].renderer.setlocal = false; //Position has to be updated
        drawstack.push(renderer.allobjects[i]); //Add to stack
    }
    
    for(var layer = 0; layer < 10; layer++)
    {
        //Loop through
        for(var i = 0; i < drawstack.length; i++)
        {
            //Alias
            var or = drawstack[i];    
            
            //Check layer
            if(or.renderer.depth == layer) 
            {                
                //Check
                if(or.renderer.sprite == null) continue;
                if(or.renderer.sprite.loaded == true) 
                {                    
                    //Draw and add
                    if(or.renderer.setlocal == false) or.renderer.intstancedraw(or);
                    pst.addChild(or.renderer.sprite.pixidata);
                }
                
                //Remove
                drawstack.splice(i, 1);
                i -= 1;
                
                /*Check if object has been deleted
                if(or.renderer.queuedel == true)
                {
                    or.renderer = null;
                    delete or.renderer;

                    or = null;
                    delete or;

                    renderer.allobjects.splice(i, 1);
                }
                */
            }
        }
    }
    
    //Actually draw
    prend.render(pst);
}