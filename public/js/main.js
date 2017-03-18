$(function() {
  // Your custom JavaScript goes here
});


function userTyped() {
  var minlength = 3;
  var clickedIsbn;
  value = $(input).val();

  if (value.length >= minlength ) {
    if (searchRequest != null)
        searchRequest.abort();
    searchTerm = $(input).val();
    $.get( "http://localhost:3000/search?q="+$(input).val(), function( data ) {
      var items = data.items;
      if (searchTerm != data.term)
        return;

      availableTags = items.map(function(item){
        var isbn13;
        var image;
        try {
          isbn13 = item.volumeInfo.industryIdentifiers[0].identifier;
          image = item.volumeInfo.imageLinks.smallThumbnail;
        } catch (e) {
          isbn13 = 0;
          image = ''
        }
        return {
          label: '<image height=\'50px\' src=\''+image+'\'/>'+item.volumeInfo.title + '<span> - '+isbn13+'</span>',
          isbn: isbn13,
          value: item.volumeInfo.title
        }
      });
      $(input).autocomplete({
        source: availableTags,
        html:true,
        select: function(event, ui) {
          document.location.href = "http://localhost:3000/book?isbn="+ui.item.isbn;
        }
      });

      $('.suggestedItem').on('click', function() {
        shouldSearch = false;
      });

      $(input).on('focus', function() {
        $(input).autocomplete('search');
      })
      $(input).autocomplete('search');
    });
  }
}
