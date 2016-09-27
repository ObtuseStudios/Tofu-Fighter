//Any weapon has these properties, regraless of type
function weapon(sprkey, barrellength)
{
    //All the properties contained in a weapon
    this.firerate;
    this.barrellength;
    this.roundvelocity;
    
    //Set
    this.firerate = 0.2; //Measured in seconds
}


//Define a class for storing a bullet object
function bullet(player, gun, sprkey)
{
    //Properties
    this.spr; //The phaser sprite object
    this.dir; //The direction vector that the bullet should travel
    this.life; //Time since the bullet was created
    this.speed; //Current speed the bullet is traveling
    
    //Constructor
    
    //Set
    this.speed = bullet.movespeed;
    
    //Create the sprite
    this.spr = game.add.sprite(player.x, player.y, sprkey)
    this.spr.anchor = new Phaser.Point(0.5, 0.5);
    
    //Randomize the angle of the bullet direction
    var angle = gun.rotation + (random.range(-bullet.inaccuray, bullet.inaccuray) * mathf.DEG_TO_RAD);
    
    //Calcaulate the direction vector
    this.dir = Phaser.Point.normalize(
        
        //Convert rotation into position
        new Phaser.Point(
            mathf.cos(angle), 
            mathf.sin(angle)));
    
    //Add the direction based on the gunlength
    this.spr.position.x += this.dir.x * bullet.gunlength;
    this.spr.position.y += this.dir.y * bullet.gunlength;
    
    //Add pointer to a  list of all bullets
    bullet.bullets.push(this)
    
    //Function to move spr by the direction via bullet speed
    this.update = function(deltatime, index)
    {
        //Move
        this.spr.position.x += this.dir.x * this.speed * deltatime;
        this.spr.position.y += this.dir.y * this.speed * deltatime;
        
        //linearly slow down bullets
        if(this.speed >= bullet.movespeed / 2) this.speed -= bullet.slowrate * deltatime;
        else
        {
            //The bullet should be destroyed
            this.spr.destroy();
            
            //Remove it fromt the list of bullets
            //Since there is no longer a way to refernce it -
            //The class instance will be removed by the garbage collector
            bullet.bullets.splice(index, 1);
            return true;
        }
        
        return false;
    }
}

//Statics
bullet.slowrate = 15; //How much to slow per second
bullet.inaccuray = 5; //The angle of randomness
bullet.movespeed = 150; //The speed a bullet moves (in fps)
bullet.lifetime = 1.0; //Every bullet only lives for 1 second
bullet.gunlength = 15.0; //The length of the gun - temporary
bullet.bullets = []; //An array of all bullet instances

//A static function to update all bullets
bullet.updateall = function(deltatime)
{
    //Loop through all then translate the position
    for(var i = 0; i < bullet.bullets.length; i++) 
    {
        //Upda the bullet, and if it has been deleted - move back one in the array
        if(bullet.bullets[i].update(deltatime, i)) i -= 1;
    }
}