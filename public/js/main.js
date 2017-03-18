$(function() {
  // Your custom JavaScript goes here
});

function userTyped() {
  var minlength = 3;

  value = $(input).val();

  if (value.length >= minlength ) {
    if (searchRequest != null)
        searchRequest.abort();

    $.get( "http://localhost:3000/search?q="+$(input).val(), function( data ) {
      var items = data.items;
      availableTags = items.map(function(item){
        var isbn13 = item.volumeInfo.industryIdentifiers[0].identifier;
        var image = item.volumeInfo.imageLinks.smallThumbnail;
        return {
          label: '<image height=\'50px\' src=\''+image+'\'/>'+item.volumeInfo.title + '<span> - '+isbn13+'</span>',
          value: item.volumeInfo.title
        }
      });
      $(input).autocomplete({
        source: availableTags,
        html:true,
      });
      $(input).autocomplete("search");
      $('.suggestedItem').on('click', function() {
        shouldSearch = false;
      });
    });
  }
}
