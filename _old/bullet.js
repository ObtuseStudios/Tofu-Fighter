//Create a bullet class
function bullet(sprite, stage, pos, cent, dir, speed = 1)
{
    //Holds the gameobject
    this.obj = new gameobject();
    
    //Constructor
    this.speed = speed;
    this.dir = dir;
    
    //All bullets have the same properties
    //Hard coded
    this.obj.renderer.init(stage, sprite);
    this.obj.transform.position = pos;
    this.obj.transform.center = cent;
    this.obj.renderer.depth = 4;
    
    //Destroy after time
    this.lifetime = 100;
    var life = 0;
    
    //Find rotation of bullet
    this.obj.transform.rotation = vector2.lookat(this.dir);
    
    //Will move forward by dir and speed
    this.update = function()
    {
        //Assuming dir is already normalized
        this.obj.transform.position.x += dir.x * speed;
        this.obj.transform.position.y += dir.y * speed;
        
        //Slow down
        //this.speed -= 0.1;//this.speed / (this.lifetime - this.life);
        
        //Check if the bullet should destroy
        life += 1;
        
        //Delete bullets
        if(life >= this.lifetime) 
        { 
            //this.obj.renderer.destroy();
            //bullet.all.splice(listID, 1);
            //this = null;
            //delete this;
        }
    }
}