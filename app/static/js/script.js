// activate typeahead in the search form
var titles = ["one", "two", "three"]

$('.typeahead')
.typeahead(
{
  hint: true,
  highlight: true,
  minLength: 1
},
{
name: 'titles'
})
.on("typeahead:selected", function (item) {
        title = item;
        $('#searchform').submit();
        return title;
        alert("title");
    });