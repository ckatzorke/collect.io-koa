var collectio = (function ($) {
    'use strict';

    var collectionView = (function () {
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

        //public API
        return {
            'state': state,
            'toggleCategoryPanel': toggleCategoryPanel
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

var collection = (function ($) {
    'use strict';
    var tSource = $('#collection-entry-template').html();
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
        var now = new Date();
        var store = {
            'id': game.id,
            'gamedetails': game,
            'added': now,
            'updated': now
        };
        collectioStorage.add(store);
        console.log('adding', store);
        renderEntry(store);
    };
    var renderEntry = function (entry) {
        var entryHtml = template(entry);
        console.log('Entry HTML', entryHtml);
        $('#top-button-bar').after(entryHtml);
    };
    return {
        add: add,
        addGame: addGame,
        renderEntry: renderEntry
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
            collection.renderEntry(game);
        });
    });
});