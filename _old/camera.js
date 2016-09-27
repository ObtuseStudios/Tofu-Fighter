//Just contains a position transform
function camera(pos = vector2.zero, size = 10, rot = 0)
{
    //Set paramaters
    //Pixel art rounding
    this.position = mathf.round(pos);
    this.rotation = rot;
    this.zoom = size;
}

//Static method to convert screen units to word units
camera.screenToWorldPos = function(cam, vec)
{
    result = new vector2(0, 0);
    
    result.x = cam.position.x + (vec.x / cam.zoom)
    result.y = -cam.position.y + (vec.y / cam.zoom)
    
    //Done
    return result;
}