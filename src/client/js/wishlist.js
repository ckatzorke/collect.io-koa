var quicksearch = (function ($) {
    'use strict';
    var tSource = $('#searchresults-template').html();
    var template = Handlebars.compile(tSource);
    var search = function () {
        var value = $('#wishlistSearchInput').val();
        $.getJSON('/service/search?q=' + value, function (data) {
            console.log(data);
            var resultHtml = data.results.length === 0 ? 'No results...' : template(data);
            console.log(resultHtml);
            $('#wishlist-searchresult').html(resultHtml);
        });
    };
    return {
        search: search
    };
})(jQuery);

var wishlist = (function ($) {
    'use strict';
    var tSource = $('#wishlist-entry-template').html();
    var template = Handlebars.compile(tSource);
    var add = function (id, name, thumbUrl) {
        var entry = {
            'id': id,
            'name': name,
            'thumb': thumbUrl
        };
        console.log('adding', entry);
        $('#add2Wish').modal('hide');
        var entryHtml = template(entry);
        console.log('Entry HTML', entryHtml);
        $('#addWishlistEntry').after(entryHtml);
    };
    return {
        add: add
    };
})(jQuery);



$(document).ready(function () {
    'use strict';
    $('#wishlistSearchBtn').click(function () {
        quicksearch.search();
    });
    $('#wishlistSearchInput').keypress(function (e) {
        if (e.which === 13) { //Enter key pressed
            $('#wishlistSearchBtn').click(); //Trigger search button click event
        }
    });
});