// get each catalog data from MySQL database via get_cata_products.php. 
// Use catalog name to select catalog data.
var dbProd = {};
$.each(['MansInventory', 'SneakersInventory', 'KidsInventory', 'JacketsInventory', 
        'HatsInventory', 'WomenInventory'], function(i, c){
    $.ajax({
        url: 'get_cata_products.php?c=' + c,
        dataType: 'json',
        async: false
    }).done(function(ret){
        dbProd[c] = ret.rows; 
    });
});
//console.log(dbProd);
MansInventory = dbProd.MansInventory;     
SneakersInventory = dbProd.SneakersInventory;
KidsInventory = dbProd.KidsInventory;
JacketsInventory = dbProd.JacketsInventory;
WomenInventory = dbProd.WomenInventory;
HatsInventory = dbProd.HatsInventory;

//landing page, show product catalogues
var ptcatas = ["hats", "jackets","sneakers", "women", "men", "kids"]; //array of 6 catalogue
$('.prod-container').html('');
//loop through catalogue array to show 6 catalogue image links in .prod-container div
$.each(ptcatas, function(i, ptcata){
    var ptcata_div =  '<div class="product-cata"> <a href="./searchresult.html?cat='
    ptcata_div += ptcata;
    ptcata_div += '"> <img src="./Images/';
    ptcata_div += ptcata;
    ptcata_div += '-cata.jpg" title="All ';
    ptcata_div += ptcata + '"></a></div>';
    $('.prod-container').append(ptcata_div);
})

//landing page, search bar
//get all product data from database via get_all_products.php
allProds = [];
$.ajax({
    url: 'get_all_products.php',
    dataType: 'json',
    async: false
}).done(function(ret){
    allProds = ret.rows;
});
//console.log(allProds);

// search brand in allProds with input in search bar field.
$('#searchForm').on('submit', function(){
    var brandname=$('input[type="search"]').val(); // get the value of search bar field of landing page
    if(brandname !='') {
        var items = allProds.filter(checkBrand);
        current_items = items; // search result array
        fill_ptcata_content(current_items); //call function to display search result dynamically.
    }
    return false;
});

//function to display array of items in .prod-container div of landing page
function fill_ptcata_content(items) {
    $('.prod-container').html('');
    $.each(items, function(i, item){
        var prod_div = '<div class="product-cata" data-pid="' + item.pid + '">'
        prod_div += '<img src="./Images/' + item['pid']
        + '.jpg"> <br/> <br/> <p class = "pTitle">';
        prod_div += item['name'];
        prod_div += '</p > <span class = "pDetail">';
        prod_div += 'Price: \$ </span> <span class = "sPrice" id="pp1" >';
        prod_div += item['price'];
        prod_div += '</span> <br/> <span class= "pDetail"> RATING: </span>';
        prod_div += '<span class= "sRate" id="rr1">';
        prod_div += item['rating'];
        prod_div +='</span> </div>';
        $('.prod-container').append(prod_div);
    })
}

//get submit value from landing page, when user click any catalogue image link.
var $_GET = {};
document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

//initial sort variable
var current_sort = '';
//initial current items array
var current_items = get_all_items();

//scope - a specific catalogue if user click a catalogue image
function get_all_items(scope) {
    var ret = [];
    if (scope == 'all')
        ret = MansInventory.concat(SneakersInventory, HatsInventory, KidsInventory, WomenInventory, JacketsInventory);
    else 
    switch ($_GET['cat']) {
        case 'men':
            ret = MansInventory;
            break;
        case 'sneakers':
            ret = SneakersInventory;
            break;
        case 'hats':
            ret = HatsInventory;
            break;
        case 'jackets':
            ret = JacketsInventory;
            break;
        case 'women':
            ret = WomenInventory;
            break;
        case 'kids':
            ret = KidsInventory;
            break;
    }
    if (ret.length == 0)  //for open searchresult.html test only
        ret = MansInventory;

    return ret;
}

//search bar in searchresult.html 
$('#searchForm').on('submit', function(){
    var cat_all_prods =  get_all_items('all'); // set cat_all_prods as all items in 6 catalogues
    var brandname=$('input[type="search"]').val(); //get brandname from search bar of searchresult.html page
    if (brandname!=''){
        var items = cat_all_prods.filter(checkBrand);
        current_items = items; //search result array
        fill_flex_content(current_items); //call function to display search result
    }
    return false;
});
//funcion to check if an item has some same brand name,return boolean value
function checkBrand(itemx){
    var brandname=$('input[type="search"]').val();
    return itemx.brand.trim().toLowerCase() == brandname.trim().toLowerCase();
}

//sort on current item set
fill_flex_content(current_items);
$('.mysort').on('click', function(){
    var sort_by = $(this).attr('sortby');
    sort_by_key(sort_by);
});

var current_asc = {'price': true, 'rating': false, 'name': true}; //initial sort status
//sort subroutine function, sort by 'price', 'rating', 'name'
function sort_by_key(sort_by){
    var items = current_items;
    switch (sort_by) {
        case 'price':
            var items = current_asc.price ? current_items.sort(compare_price) : current_items.sort(compare_price_desc);
            current_asc.price = !current_asc.price; //record current sort status for toggling asc or desc
            break;
        case 'rating':
            var items = current_asc.rating ? current_items.sort(compare_rating) : current_items.sort(compare_rating_desc);
            current_asc.rating = !current_asc.rating; //record current sort status for toggling asc or desc
            break;
        case 'name':
            var items = current_items.sort(compare_name);
            break;
    }
    current_sort = sort_by;
    console.log(current_sort);
    fill_flex_content(items); // call function to display sort result
}
//asc sort by 'price'
function compare_price( a, b ) {
    return compare(a, b, 'price');
}
//desc sort by 'price'
function compare_price_desc( a, b ) {
    return compare(b, a, 'price');
}
//asc sort by'name'
function compare_name( a, b ) {
    return compare(a, b, 'name');
}
//asc sort by 'rating'
function compare_rating( a, b ) {
  return compare(a, b, 'rating');
}
//desc sort by 'rating'
function compare_rating_desc( a, b ) {
  return compare(b, a, 'rating');
}
//subroutine of sort
function compare( a, b, fieldname ) {
  var x, y;
  if (fieldname == 'name') {
    x = a[fieldname];
    y = b[fieldname];
  } else {
    x = parseFloat(a[fieldname]);
    y = parseFloat(b[fieldname]);
  }
  
  if ( x < y ){
    return -1;
  }
  if ( x > y){
    return 1;
  }
  return 0;
}

// filter item by price range, this function return a boolean value
function filter_price (prod) {
    var min = $('#price_min').val().trim();
    var max = $('#price_max').val().trim();
    return (min == '' || min <= prod.price) && (max == '' || max >= prod.price);
}
// filter items array and display in the page
$('.filter_price').on('change', function(){
    var cat_all_prods = get_all_items();
    var items = cat_all_prods.filter(filter_price);
    current_items = items; //filter result array.
    sort_by_key(current_sort); 
});

//get related info from an item by pid, and display a specific item user clicked.
//show product detail information
var current_pid = '';
$(document).on('click', '.flex-item .product-cata', function(){
    current_pid = $(this).data('pid');
    var cat_all_prods = get_all_items('all'); // 'all' for search result click
    var items = cat_all_prods.filter( get_pid );
    var itm = items[0];
    // group product detail page html + item content variables
    var pdt_div = '<div class="container"><div class="left-aside"><div class="picture1">';
    pdt_div += '<img src="./Images/' + itm.pid + '.jpg' +'">';
    pdt_div += '<div id="myresult" class="img-zoom-result"></div></div><div>';
    pdt_div += '<label for="description">Description</label>';
    pdt_div += '<textarea is="prod-desc" name="prod-desc" rows ="8" cols="40">';
    pdt_div += itm.description + '</textarea> </div></div> <div class="center-content">';
    pdt_div += '<p class="thick">' + itm.name + '</p>';
    pdt_div += '<div> <span class="fa fa-star checked"></span><span class="fa fa-star checked"></span>';
    pdt_div += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span>';
    pdt_div += '<span class="fa fa-star"></span> <span class="heading">334 customer ratings</span>';
    pdt_div += '<p>'+itm.rating+' average based on 334 reviews.</p><span style="color:gray" class="easy">Price:</span>';
    pdt_div += '<span class="hard">CDN$ '+itm.price+' </span> <span class="logo">& </span>';
    pdt_div += '<span style="color:#008B8B" class="returns">FREE Returns</span><hr style="border:0px solid #f1f1f1">';
    pdt_div += '</div><div class="picture3"><img src="https://images-na.ssl-images-amazon.com/images/G/15/A2I-Convert/mobile/IconFarm/icon-secure-transaction._CB404390779_.png">';
    pdt_div += '<img src="https://images-na.ssl-images-amazon.com/images/G/15/A2I-Convert/mobile/IconFarm/icon-amazon-delivered._CB406594996_.png">';
    pdt_div += '</div> <span style="color:#008B8B" class="returns">Secure transaction+ </span>';
    pdt_div += '<span style="color:#008B8B" class="returns"> FWY Delivered</span><br><br>';
    pdt_div += '<label for="Size">Size: </label> <select id="Size" name="Size"><option>Select</option>';
    pdt_div += '<option value="S">Small</option><option value="M">Medium</option><option value="L">Large</option>';
    pdt_div += '</select><label for="Color"></label>Color: </label><select id="Color" name="Color">';
    pdt_div += '<option value="G">Green</option><option value="W">White</option><option value="Y">Yellow</option>';
    pdt_div += '</select><br> <b>Product Details</b><ul> <li> Brand: ' + itm.brand + '</li>';
    pdt_div += '<li> Main material: ' + itm.material +'</li> <li> Size: Small(22- 23 Inches)<br>';
    pdt_div += 'Medium(23.1- 24 Inches)<br> Large (24.1- 25 Inches) <br></li> <li> Item ID: '+ itm.itemid +'</li>';
    pdt_div += '<li> Style: ' + itm.style + '</li></ul><br></div>	<div class="right-side">';
    pdt_div += '<span style="color:green" class="stock">In Stock</span><fieldset> <span class="quantity"> Quantity:</span>';
    pdt_div += '<select id="quantity" name="quantity"> <option>1</option> <option value="2">2</option>';
    pdt_div += '<option value="3">3</option> <option value="4">4</option> <option value="5">5</option>';
    pdt_div += '<option value="6">6</option> <option value="7">7</option> <option value="8">8</option>';
    pdt_div += '<option value="9">9</option><option value="10">10</option><option value="11">11</option>';
    pdt_div += '<option value="12">12</option><option value="13">13</option><option value="14">14</option>';
    pdt_div += '</select><br><br><input class="btn_cart"  style="background-color:#008B8B" type="button" name="submit" value="Add to Cart" ></button><br><br>';
    pdt_div += '<input class="btn_buynow" style="background-color:orange" type="button" value="Buy Now"><br>';
    pdt_div += '<span class="returns">Sold by</span><span style="color:#008B8B" class="returns">FWYShop</span><br><br>';
    pdt_div += '<input type="button"  value="Add to Wish List"><br> </fieldset> </div> </div>';
 
    $('.flex-item').html(pdt_div); // show content in .flex-item div in searchresult.html page
});
//get pid of an item user clicked
function get_pid(item) {
    return item.pid == current_pid;
}
//functon to display an array of items in .flex-item div
function fill_flex_content(items) {
    $('.flex-item').html('');
    $.each(items, function(i, item){
        var prod_div = '<div class="product-cata" data-pid="' + item.pid + '">'
        prod_div += '<img src="./Images/' + item['pid']
        + '.jpg"> <br/> <br/> <p class = "pTitle">';
        prod_div += item['name'];
        prod_div += '</p > <span class = "pDetail">';
        prod_div += 'Price: \$ </span> <span class = "sPrice" id="pp1" >';
        prod_div += item['price'];
        prod_div += '</span> <br/> <span class= "pDetail"> RATING: </span>';
        prod_div += '<span class= "sRate" id="rr1">';
        prod_div += item['rating'];
        prod_div +='</span> </div>';
        $('.flex-item').append(prod_div);
    })
}
//prepare cart variable
var cart;
$(document).ready(function(){
    cart = cartApp.load();
    cartApp.display(cart); //display cart items
    $(document).on('click', '.btn_clr', function(){
        cartApp.clear();
    }); //clear cart 
    $(document).on('click', '.btn_cart', function(){ //add-to-cart
        var items = get_all_items('all').filter( get_pid ); //filter current array get item pid to add to cart
        var item = items[0]; //item t be added to cart
        
        if (cart.hasOwnProperty(current_pid)) { // check if the pid of item alreay in cart
            cart[current_pid].quantity += parseInt($('#quantity').val()); //if yes, just add number of quantity
        } else { // add item in cart object
            var itemx = {};
            itemx.quantity = parseInt($('#quantity').val());
            itemx.price = item.price;
            itemx.itemid = item.itemid;
            itemx.name = item.name;
            cart[current_pid] = itemx;
        }
        cartApp.write(cart); //call function to add item to localStorage variable   
        cartApp.display(cart); //display current cart objects
    });
})

//variable for cart objects
var cartApp = {};
cartApp.write = function(cart){
    localStorage.mycart = JSON.stringify(cart); //convert cart object to JSON String, saved in localStorage
}
cartApp.load = function() {
    if (localStorage.hasOwnProperty('mycart'))
        cart = JSON.parse(localStorage.mycart);
    else {
        cart = {};
        cartApp.write(cart);
    }
    
    return cart;
}
//function to clear cart
cartApp.clear = function() {
    cart = {};  // var in memroy
    cartApp.write(cart); // local storage
    $('.shoping-list').html(''); // UI html
}

//function to display current cart in .shoping-list div 
cartApp.display = function(cart) {
    if (cart.length == 0)
        return;
    var total = 0;
    var cartHTML = '<ol>';
    $.each(cart, function(pid, itemx){
        var subtotal = itemx.quantity * itemx.price;
        total += subtotal;
        subtotal = subtotal.toFixed(2);
        cartHTML += '<li>Item: ' + itemx.name + '<br/>';
        cartHTML += 'Price: ' + itemx.price + '<br/>';
        cartHTML += 'Quantity: ' + itemx.quantity + '<br/>';
        cartHTML += 'Subtotal: $' + subtotal + '</li>';
    });
    total = total.toFixed(2);
    cartHTML += '</ol>';
    cartHTML += '<br/><strong>Total: $' + total + '</strong>';

    cartHTML += '<br/><input class="btn_clr" style="background-color:white" type="button" value="Clear Cart"><br>'
    $('.shoping-list').html(cartHTML);
}

