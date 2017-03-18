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

    $('#loadingSpan').css('left', '-40px');
    $('#loadingSpan').html('<i class="fa fa-2x fa-spinner fa-spin"></i>');
    $('#loadingSpan').show();

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
          label: '<image height=\'50px\' src=\''+image+'\'/>'+item.volumeInfo.title + '<span> - ISBN: '+isbn13+'</span>',
          isbn: isbn13,
          value: item.volumeInfo.title
        }
      });
      $(input).autocomplete({
        source: availableTags,
        html:true,
        select: function(event, ui) {
          $('#loadingSpan').hide();
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
      $('#loadingSpan').css('left', '-110px');
      $('#loadingSpan').html(availableTags.length + ' books found');
    });
  }
}

function likeDislike(title, isbn, opt) {
  var rating = opt;
  $.post( "http://localhost:3000/book", {
    title,
    isbn,
    rating,
  },
  function( data ) {
    console.log(data);
  });
}

function comment(title, isbn, comment) {
  $.post( "http://localhost:3000/book", {
    title,
    isbn,
    comment,
  },
  function( data ) {
    console.log(data);
  });
}
