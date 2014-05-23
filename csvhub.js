// find all files in the page
files = $("div#files.diff-view .file");
for (var f = 0; f < files.length; f++) {

  // check if this is a CSV file
  filename = files[f].querySelector("div[data-path]").getAttribute('data-path');
  if (filename.match(".*\.csv")) {


    // Get all diff lines
    lines = files[f].querySelectorAll(".diff-line-pre");

    // Get data
    var old_data = []
    var new_data = []

    for (var l = 0; l < lines.length; l++) {

      // Parse data from line
      line = lines[l].textContent;
      data = $.csv.toArray(line.substr(1).trim());

      // Line has been added
      if (line.indexOf("+") == 0) {
        new_data.push(data);
      }

      // Line has been removed
      if (line.indexOf("-") == 0) {
        old_data.push(data);
      }

      // Line has not changed
      if (line.indexOf(" ") == 0) {
        new_data.push(data);
        old_data.push(data);
      }

      // Line is a placeholder for hidden content
      if (line.indexOf("@") == 0) {
        // Ignore first line if it's a hidden bit
        if (new_data.length > 0) {
          placeholder = Array(new_data[0].length);
          for (var p = 0; p < placeholder.length; p++) {
            placeholder[p] = '...';
          }
          new_data.push(placeholder);
          old_data.push(placeholder);
        }
      }
    }

    // Parse CSV
    var old_table = new coopy.CoopyTableView(old_data);
    var new_table = new coopy.CoopyTableView(new_data);

    var alignment = coopy.compareTables(old_table,new_table).align();

    var data_diff = [];
    var table_diff = new coopy.CoopyTableView(data_diff);

    var flags = new coopy.CompareFlags();
    flags.show_unchanged = true;
    flags.show_unchanged_columns = true;
    flags.always_show_header = false;
    var highlighter = new coopy.TableDiff(alignment,flags);
    highlighter.hilite(table_diff);

    var diff2html = new coopy.DiffRender();
    diff2html.render(table_diff);
    diff_html = diff2html.html()

    files[f].querySelector("div.data").innerHTML = "<div class='csvhub-diff'>"+diff_html+"</div>";

  }

}
