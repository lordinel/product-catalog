/**
 * Created by Lordinel on 6/18/2016.
 */

// class Shows
// inherits Product class

function Shows(name, photo) {
    this.name = name;
    this.photo = photo;
    this.prodType = 'Shows';
    
    this.getPhoto = function () {
        return 'shows/' + this.photo;
    };
}

Shows.prototype = new Product();
Shows.prototype.constructor = Shows;
