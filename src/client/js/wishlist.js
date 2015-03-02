Handlebars.registerHelper('replace', function (text, needle, replace) {
    'use strict';
    var haystack = Handlebars.Utils.escapeExpression(text);
    var n = new RegExp(needle, 'g');
    var result = haystack.replace(n, replace);
    return new Handlebars.SafeString(result);
});

var quicksearch = (function ($) {
    'use strict';
    var tSource = $('#searchresults-template').html();
    var template = Handlebars.compile(tSource);
    var search = function () {
        var ret = new Promise(function (resolve, reject) {
            var value = $('#wishlistSearchInput').val();
            $.getJSON('/gb/search?q=' + value, function (data) {
                console.log(data);
                var resultHtml = data.results.length === 0 ? 'No results...' : template(data);
                console.log(resultHtml);
                $('#wishlist-searchresult').html(resultHtml);
                resolve();
            });
        });
        return ret;
    };
    return {
        search: search
    };
})(jQuery);

var wishlist = (function ($) {
    'use strict';
    var tSource = $('#wishlist-entry-template').html();
    var template = Handlebars.compile(tSource);
    var add = function (id, name, deck, thumbUrl) {
        var entry = {
            'id': id,
            'name': name,
            'deck': deck,
            'thumb': thumbUrl
        };
        addGame(entry);
        $('#addModal').modal('hide');
    };
    var addGame = function (game) {
        collectioStorage.add(game);
        console.log('adding', game);
        var entryHtml = template(game);
        console.log('Entry HTML', entryHtml);
        $('#top-button-bar').after(entryHtml);
    };
    return {
        add: add,
        addGame: addGame
    };
}(jQuery));



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
    collectioStorage.getAll().then(function (games) {
        games.map(function (game) {
            wishlist.addGame(game);
        });
    });
});