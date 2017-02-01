/**
 * Created by Lordinel on 6/18/2016.
 */

// class Music
// inherits Product class

function Music(name, photo) {
    this.name = name;
    this.photo = photo;
    this.prodType = 'Music';
    
    this.getPhoto = function () {
        return 'music/' + this.photo;
    };
}

Music.prototype = new Product();
Music.prototype.constructor = Games;
