
var quicksearch = (function ($) {
    var tSource = $('#searchresults-template').html();
    var template = Handlebars.compile(tSource);
    var search = function () {
        var value = $('#wishlistSearchInput').val();
        $.getJSON('/service/search?q=' + value, function (data) {
            console.log(data);
            var resultHtml = template(data);
            console.log(resultHtml);
            $('#wishlist-searchresult').html(resultHtml);
        });
    };
    return {
        search: search   
    }
})(jQuery);


$(document).ready(function () {
    $('#wishlistSearchBtn').click(function () {
        quicksearch.search();
    });
    $('#wishlistSearchInput').keypress(function (e) {
        if (e.which == 13) { //Enter key pressed
            $('#wishlistSearchBtn').click(); //Trigger search button click event
        }
    });
});
