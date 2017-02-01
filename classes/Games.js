/**
 * Created by Lordinel on 6/18/2016.
 */

// class Games
// inherits Product class

function Games(name, photo) {
    this.name = name;
    this.photo = photo;
    this.prodType = 'Games';
    
    this.getPhoto = function () {
        return 'games/' + this.photo;
    };
}

Games.prototype = new Product();
Games.prototype.constructor = Games;
