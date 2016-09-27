//Stores a coordinate
function vector2(x, y)
{
    //Constructor
    this.x = x;
    this.y = y;
    
    //Prevent JS from passing by ref
    this.clone = function() { return new vector2(this.x, this.y); }
}

//Math functions
vector2.lookat = function(vec) { return mathf.atan2(vec.y, vec.x) * mathf.RAD_TO_DEG; }
vector2.magnitude = function(vec) { return mathf.sqrt((vec.x * vec.x) + (vec.y * vec.y));}
vector2.normalize = function(vec) 
{
    var result = new vector2(0, 0);
    var mag = vector2.magnitude(vec);
    
    //Apply
    result.x = vec.x / mag;
    result.y = vec.y / mag;
    
    //Done
    return result;
}

//Set static variables
vector2.one = new vector2(1, 1);
vector2.zero = new vector2(0, 0);
vector2.minus = new vector2(-1, -1);

vector2.up = new vector2(0, 1);
vector2.down = new vector2(0, -1);
vector2.left = new vector2(-1, 0);
vector2.right = new vector2(1, 0);

//Stores a colour
function colour(r, g, b, a = 255)
{
    //Set values on construct
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    
    //For use by the canvas, data need to be converted to string
    this.toRGBString = function()
    {
        //Convert to CSS style string
        return "rgba(" + 
            (this.r % 256) + ", " + 
            (this.g % 256) + ", " + 
            (this.b % 256) + ", " + 
            (this.a % 256) + ")";
    }
    
    //For converting to pixi colour fomatting
    this.toPIXIString = function()
    {
        //Convert to hex
        var r_str = Math.abs(this.r).toString(16);
        var g_str = Math.abs(this.g).toString(16);
        var b_str = Math.abs(this.b).toString(16);
        
        if(r_str.length == 1) r_str = "0" + r_str;
        if(g_str.length == 1) g_str = "0" + g_str;
        if(b_str.length == 1) b_str = "0" + b_str;
        
        return parseInt(r_str + g_str + b_str, 16);
    }
}

//Create a few default colours
colour.red = new colour(255, 0, 0);
colour.green = new colour(0, 255, 0);
colour.blue = new colour(0, 0, 255);
colour.yellow = new colour(255, 255, 0);
colour.aqua = new colour(0, 255, 255);
colour.purple = new colour(255, 0, 255);