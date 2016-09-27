//Holds transformation attributes
function transform()
{
    //Made from many vectors
    this.center = new vector2(0.5, 0.5);
    this.position = new vector2(0.0, 0.0);
    this.scale = new vector2(1.0, 1.0);
    this.rotation = 0.0;
}

//Anchors defaults
transform.center = new vector2(0.5, 0.5);
transform.topleft = new vector2(0.0, 0.0);
transform.topright = new vector2(1.0, 0.0);
transform.bottomleft = new vector2(0.0, 1.0);
transform.bottomright = new vector2(1.0, 1.0);

//Any object in the game inherits from this class
function gameobject()
{
    this.localtransform = new transform(); //Contains data relvative to parents
    this.transform = new transform(); //Contains a positional data
    this.renderer = new renderer(); //Contains drawing information
    
    //A gamobject may have children
    var children = [];
    
    //Stores the parent object
    var parent = null;
    
    //Function to add to the list
    this.getChildCount = function() { return children.length; }
    this.getChild = function(index) { return children[index]; }
    this.addChild = function(go) { children.push(go); go.parent = this; }
    this.setChild = function(index, n) { children[index] = n; n.parent = this; }
    this.removeChild = function(index) { children[index].parent = null; children.splice(index); }
    
    //Add to static renderer
    renderer.allobjects.push(this);
    this.renderer.renderID = renderer.allobjects.length - 1;
}