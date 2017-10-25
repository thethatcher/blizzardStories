// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='articleCard' id='" + data[i]._id + "'></div>");
    $("#" + data[i]._id).append('<h2>' + data[i].game + '</h2>');
    $("#" + data[i]._id).append('<h3><a href="' + data[i].link + '" target="blank">' + data[i].title + '</a></h3>');
    $("#" + data[i]._id).append('<p>' + data[i].description + '</p>');
  }
});

// Whenever someone clicks a p tag
$(document).on("click", ".articleCard", function() {
  // Empty the notes from the note section
  $("#notes").empty();

  // Save the id from the articleCard tag
  var thisId = $(this).attr("id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data.note);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }

      for (var i = 0; i < data.note.length; i++) {
        data.note[i]
        $('#notes').append('<div class="noteCard" id="' + data.note[i]._id + '"></div>');
        $('#' + data.note[i]._id).append('<h3>' + data.note[i].title + '</h3>');
        $('#' + data.note[i]._id).append('<p>' + data.note[i].body + '</p>');
      }
    });
});
// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });
  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});