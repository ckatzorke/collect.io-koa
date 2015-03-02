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


//init
$(document).ready(function () {
    'use strict';
    $('#category-slide-panel-opener').on('click', function () {
        collectio.collectionView.toggleCategoryPanel();
    });
});