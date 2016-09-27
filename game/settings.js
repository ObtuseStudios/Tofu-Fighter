//Put in a 'namespace'
var settings = 
{    
    //Defines values for the game to work off
    screen_width : 40 * 16, //Set later
    screen_height : 40 * 9, //Set later
    background_colour : 'rgb(220, 220, 220)', //Init colour to grey
    
    //Other
    camera_zoom : 2,
    camera_follow_speed : 1,
    
    //Movement keys
    keyboard_up : Phaser.Keyboard.W,
    keyboard_down : Phaser.Keyboard.S,
    keyboard_left : Phaser.Keyboard.A,
    keyboard_right : Phaser.Keyboard.D,
    keyboard_shoot : Phaser.Keyboard.SPACEBAR,
    
    //Player
    player_move_speed : 80.0,
    
    //All sprites
    spr :
    {
        gun_left    : { path : "../assets/GunLeft.png",   name : "lgun"      },
        gun_right   : { path : "../assets/GunRight.png",  name : "rgun"      },
        player_left : { path : "../assets/TofuLeft.png",  name : "lplayer"   },
        player_right: { path : "../assets/TofuRight.png", name : "rplayer"   },
        crosshair   : { path : "../assets/Crosshair.png", name : "crosshair" },
        bullet      : { path : "../assets/Bullet.png",    name : "bullet"    }, 
        
        box         : { path : "../assets/Box.png",       name : "statbox"   },
        crate       : { path : "../assets/Crate.png",     name : "statcrate" }, 
    }
};
