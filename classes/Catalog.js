/**
 * Created by Lordinel on 6/18/2016.
 */

// class Catalog

function Catalog() {
    var parent = this;
    
    this.dbPath = "db/catalog.xml";
    this.products = [];
    this.searchText = null;
    this.typeFilter = null;

    
    // make ajax connection to get products
    this.load = function() {
        $.ajax({
            type: "GET",
            url: parent.dbPath,
            cache: false,
            dataType: "xml",
            success: function(xml) {
                parent.loadProducts(xml);
            }
        });
    };
    
    
    // save products to array
    this.loadProducts = function(xml) {
        $(xml).find("PRODUCT").each(function(){
            switch ($(this).find("TYPE").text()) {
                case "Shows":
                    parent.products.push(new Shows(
                       $(this).find("NAME").text(),
                       $(this).find("PHOTO").text()
                    ));
                    break;
                case "Games":
                    parent.products.push(new Games(
                       $(this).find("NAME").text(),
                       $(this).find("PHOTO").text()
                    ));
                    break;
                case "Books":
                    parent.products.push(new Books(
                       $(this).find("NAME").text(),
                       $(this).find("PHOTO").text()
                    ));
                    break;
                case "Music":
                    parent.products.push(new Music(
                       $(this).find("NAME").text(),
                       $(this).find("PHOTO").text()
                    ));
                    break;
                default:
                    alert('Invalid product type found. Detected: '+$(this).find("TYPE").text());
            }
        });
        parent.view();
    };
   
    
    // display products
    this.view = function() {
        var content = "";
        for (var i = 0; i < parent.products.length; i++) {
            
            // check if user filtered products based on type or name (search)
            if ((parent.typeFilter == null || parent.typeFilter == parent.products[i].getProdType()) &&
                (parent.searchText == null || parent.products[i].getName().toLowerCase().indexOf(parent.searchText.toLowerCase())) != -1) {
                
                // display photo
                content += '<div class="content_block"><div>' +
                    '<img class="content_image" src="images/' + parent.products[i].getPhoto() + '" alt="' + parent.products[i].getPhoto() + '" />' +
                    '</div><div class="content_text"><div class="content_name">';
                
                // display name
                if (parent.searchText != null) {
                    
                    // highligth matching characters
                    var prodName = parent.products[i].getName();
                    var regEx = new RegExp(parent.searchText,'ig');
                    var prodNameFormatted = prodName.replace(regEx, function (match) {
                        return '<span class="search_match">' + match + '</span>';
                    });
                    content += prodNameFormatted;
                    
                } else {
                    content += parent.products[i].getName();
                }
                
                content += '</div><div class="content_type">' +
                    parent.products[i].getProdType() +
                    '</div></div></div>';
            }
        }
        
        // include add icon
        content += '<div id="add_product_icon" class="content_block"><div>' +
                '<img class="content_image" src="images/add_icon.png" alt="Add Icon" />' +
                '</div><div class="content_text"><div class="content_name"><br /></div><div class="content_type">Add product...</div></div></div>';
        
        // display results to content area
        $('#content').html(content);
        
        // hide dialog for adding product
        $('#add_product_dialog').hide();
        
        // bind event to add icon
        $('#add_product_icon').bind({
            click: function() {
                parent.toggleAddProductDialog('show');
            }
        });
    };
    
    
    // set search text
    this.setSearchText = function(search) {
        if (search == "") {
            parent.searchText = null;
        } else {
            parent.searchText = search;
        }
    };
    
    
    // set filter for product type
    this.setTypeFilter = function(filter) {
        if (filter == "All") {
            parent.typeFilter = null;
        } else {
            parent.typeFilter = filter;
        }
    };
    
    
    // switch between grid or list view
    this.toggleView = function(view) {
        if (view == "list") {
            $('button#grid_view').attr('class','');
            $('button#list_view').attr('class','selected_view');
            $('#content').attr('class','list_content');
        } else {
            $('button#grid_view').attr('class','selected_view');
            $('button#list_view').attr('class','');
            $('#content').attr('class','grid_content');
        }
    };
    
    
    // show or hide dialog to add product
    this.toggleAddProductDialog = function(switchDialog) {
        if (switchDialog == 'show') {
            $('#add_product_dialog').fadeIn(800);
            $('#new_product_name').focus();
            $('#dialog_overlay').css('height', $('body')[0].offsetHeight+15 + 'px');
            $('#dialog_overlay').show();
        } else {
            $('#add_product_dialog').fadeOut(800);
            $('#dialog_overlay').hide();
        }
    };
    
    
    // add new product to database (xml)
    this.add = function() {
        
        // sanitize input
        // replace < and > to _
        var sanitizedStr = $('#new_product_name').val();
        $('#new_product_name').val(sanitizedStr.replace(/[<>]/g,'_'));
        
        // get form data
        var formData = new FormData($('form[name=add_product_form]')[0]);
        
        // make ajax connection
        // send data to add_product.php for uploading photo and saving data to database (xml)
        $.ajax({
            type: "POST",
            url: "services/add_product.php",
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            dataType: 'json',
            success: function(status) {
                if (status['return_code'] == "error") {
                    alert('Error: Cannot save new product.');
                    return false;
                }
                
                alert('New product saved!');
                parent.toggleAddProductDialog('hide');
                
                // add input to products array
                switch($('#new_product_type').val()) {
                    case 'Shows':
                        parent.products.push(new Shows($('#new_product_name').val(),$('#new_product_photo').val()));
                        break;
                    case 'Books':
                        parent.products.push(new Books($('#new_product_name').val(),$('#new_product_photo').val()));
                        break;
                    case 'Games':
                        parent.products.push(new Games($('#new_product_name').val(),$('#new_product_photo').val()));
                        break;
                    case 'Music':
                        parent.products.push(new Music($('#new_product_name').val(),$('#new_product_photo').val()));
                        break;
                    default:
                        alert('Invalid product type found. Detected: '+$('#new_product_type').val());
                }
                
                // clear filters
                $('form[name=filter_form]')[0].reset();
                $('form[name=add_product_form]')[0].reset();
                parent.searchText = null;
                parent.typeFilter = null;
                
                // redisplay list of products
                parent.view();
            }
        });
    };
}
