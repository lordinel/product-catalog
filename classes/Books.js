/**
 * Created by Lordinel on 6/18/2016.
 */

// class Books
// inherits Product class

function Books(name, photo) {
    this.name = name;
    this.photo = photo;
    this.prodType = 'Books';
    
    this.getPhoto = function () {
        return 'books/' + this.photo;
    };
}

Books.prototype = new Product();
Books.prototype.constructor = Books;
