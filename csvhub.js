// find all files in the page
files = $("div#files.diff-view .file");
for (var f = 0; f < files.length; f++) {
  // check if this is a CSV file
  filename = files[f].querySelector("div[data-path]").getAttribute("data-path");
  if (filename.match(".*.csv")) {
    // Get all diff lines
    lines = files[f].querySelectorAll(".blob-code-marker");

    // Get data
    var old_data = [];
    var new_data = [];

    for (var l = 0; l < lines.length; l++) {
      // Parse data from line
      code_marker = lines[l].getAttribute("data-code-marker");
      line = lines[l].textContent.trim();
      if (line.length == 0) continue; // Skip empty line
      data = $.csv.toArray(line);

      // Line has been added
      if (code_marker == "+") {
        new_data.push(data);
      }

      // Line has been removed
      if (code_marker == "-") {
        old_data.push(data);
      }

      // Line has not changed
      if (code_marker == " ") {
        new_data.push(data);
        old_data.push(data);
      }
    }

    // Parse CSV
    var old_table = new daff.TableView(old_data);
    var new_table = new daff.TableView(new_data);

    var alignment = daff.compareTables(old_table, new_table).align();

    var data_diff = [];
    var table_diff = new daff.TableView(data_diff);

    var flags = new daff.CompareFlags();
    flags.show_unchanged = true;
    flags.show_unchanged_columns = true;
    flags.always_show_header = false;
    var highlighter = new daff.TableDiff(alignment, flags);
    highlighter.hilite(table_diff);

    var diff2html = new daff.DiffRender();
    diff2html.render(table_diff);
    diff_html = diff2html.html();

    files[f].querySelector("div.data").innerHTML =
      "<div class='csvhub-diff'>" + diff_html + "</div>";
  }
}
