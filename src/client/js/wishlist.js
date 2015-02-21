$(document).ready(function() {
    $('#wishlistSearch').click(function () {
        var value = $('#wishlistSearchInput').val();
        $.getJSON('/service/search?q=' + value, function (data) {
            console.log(data);
        });
    });
});