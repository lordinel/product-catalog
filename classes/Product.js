/**
 * Created by Lordinel on 6/18/2016.
 */

// class Product

function Product(name, photo) {
    this.name = name;
    this.photo = photo;
    this.prodType = "Product";
    
    this.getName = function () {
        return this.name;
    };
    
    this.getPhoto = function () {
        return this.photo;
    };
    
    this.getProdType = function () {
        return this.prodType;
    };
}

