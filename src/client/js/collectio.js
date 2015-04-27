var collectio = (function ($) {
    'use strict';

    var collectionView = (function () {
        var tSource = $('#collection-entry-template').html();
        var template = Handlebars.compile(tSource);
        
        var state = {
            sort: {
                field: 'name',
                order: 'asc'
            },
            platform: 'all'
        };
        var toggleCategoryPanel = function () {
            var panel = $('#category-slide-panel');
            panel.slideToggle('slow');
            return false;
        };

        var renderEntry = function (entry) {
            var entryHtml = template(entry);
            console.log('Entry HTML', entryHtml);
            $('#top-button-bar').after(entryHtml);
        };

        //public API
        return {
            'state': state,
            'toggleCategoryPanel': toggleCategoryPanel,
            'renderEntry': renderEntry
        };
    }());


    return {
        'collectionView': collectionView
    };
}(jQuery));




var quicksearch = (function ($) {
    'use strict';
    var tSource = $('#searchresults-template').html();
    var template = Handlebars.compile(tSource);
    var search = function () {
        var ret = new Promise(function (resolve, reject) {
            var value = $('#quickSearchInput').val();
            $.getJSON('/gb/search?q=' + value, function (data) {
                console.log(data);
                var resultHtml = data.results.length === 0 ? 'No results...' : template(data);
                console.log(resultHtml);
                $('#searchresult').html(resultHtml);
                resolve();
            });
        });
        return ret;
    };
    return {
        search: search
    };
})(jQuery);

var collection = (function () {
    'use strict';

    var add = function (id, name, deck, thumbUrl) {
        var entry = {
            'id': id,
            'name': name,
            'deck': deck,
            'thumb': thumbUrl
        };
        addGame(entry);
    };
    var addGame = function (game) {
        var now = new Date();
        var store = {
            'id': game.id,
            'gamedetails': game,
            'added': now,
            'updated': now
        };
        collectioStorage.add(store);
    };

    return {
        add: add,
        addGame: addGame,
    };
}(jQuery));



//init
$(document).ready(function () {
    'use strict';
    $('#category-slide-panel-opener').on('click', function () {
        collectio.collectionView.toggleCategoryPanel();
    });
    $('#quickSearchBtn').click(function () {
        quicksearch.search();
    });
    $('#quickSearchInput').keypress(function (e) {
        if (e.which === 13) { //Enter key pressed
            $('#quickSearchBtn').click(); //Trigger search button click event
        }
    });
    collectioStorage.getAll().then(function (games) {
        games.map(function (game) {
            collectio.collectionView.renderEntry(game);
        });
    });
});