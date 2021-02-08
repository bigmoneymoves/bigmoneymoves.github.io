var fetch_url = "https://updategithubdata.deraphel.repl.co/stocks";
var write_url = "https://updategithubdata.deraphel.repl.co/stocks-write/";
var delete_url = "https://updategithubdata.deraphel.repl.co/stocks-delete/";
var all_stock_data = {};
var tickers = [];
var table = document.getElementById("tableBody");

async function add_ticker(id){
  var ticker = document.getElementById(id).value;
  var toAdd = ticker.toUpperCase();

  const response = await fetch(write_url + toAdd)

  if (response.ok){
    document.getElementById(id).value = ""
    alert("The ticker " + toAdd + " was added to the database successfully!")
  }
  else{
    if (response.text() == "duplicate"){
      alert("The ticker " + toAdd + " already exists in the database.")
    }
    else {
      alert("The ticker " + toAdd + " is invalid. Please check your spelling.")
    }
  }

  return
}

async function remove_ticker(id){
  var ticker = document.getElementById(id).value;
  var toRemove = ticker.toUpperCase();

  if (toRemove == ""){
    alert("You have not entered a valid ticker. Please check your spelling.")
  }

  const response = await fetch(delete_url + toRemove)
  const status = response.text()

  if (response.ok){
    document.getElementById(id).value = ""
    alert("The ticker " + toRemove + " was removed from the database successfully!")

    var elem = document.getElementById(toRemove);

    if (elem != null){
      elem.parentNode.removeChild(elem);
    }
    else{
      return
    }
  }
  else{
    alert("The ticker " + toRemove + " does not exist in the database.")
  }
}

async function fetch_stocks(){
  all_stock_data = await getData(fetch_url);
  tickers = all_stock_data["tickers"];
  update_chart();

  return
}

async function getData(url){
  const response = await fetch(url);
  return response.json();
}

function update_chart(){
  for (var i = 0; i < tickers.length; i++) {
    var ticker = tickers[i]
    var ticker_data = all_stock_data["stocks"][ticker]
    var rowExist = document.getElementById(ticker)

    if (rowExist == null){
      var row = table.insertRow(-1)
      row.id = ticker
      // ["TICKER", "PREV CLOSE", "CUR PRICE", "CHANGE", "CHANGE %", "VOLUME"]
      var cell0 = row.insertCell(-1)
      var cell1 = row.insertCell(-1)
      var cell2 = row.insertCell(-1)
      var cell3 = row.insertCell(-1)
      var cell4 = row.insertCell(-1)
      var cell5 = row.insertCell(-1)
      cell0.innerHTML = `<a class="text-light" style="text-decoration: none;" href="https://finance.yahoo.com/quote/${ticker}">${ticker}</a>`

      cell1.innerHTML = ticker_data[0]
      cell2.innerHTML = ticker_data[1]
      cell3.innerHTML = ticker_data[2]
      cell4.innerHTML = ticker_data[3]
      cell5.innerHTML = ticker_data[4]
    }
    else{
      var cells = rowExist.cells

      cells[1].innerHTML = ticker_data[0]
      cells[2].innerHTML = ticker_data[1]
      cells[3].innerHTML = ticker_data[2]
      cells[4].innerHTML = ticker_data[3]
      cells[5].innerHTML = ticker_data[4]
    }

    change = parseFloat(ticker_data[2])
    var cells = document.getElementById(ticker).cells

    if (change > 0){
      cells[3].innerHTML = '+' + ticker_data[2]
      cells[4].innerHTML = '+' + ticker_data[3]
      cells[3].classList.add("text-success")
      cells[4].classList.add("text-success")
      cells[3].classList.remove("text-warning", "text-danger")
      cells[4].classList.remove("text-warning", "text-danger")
    }
    else if (change < 0){
      cells[3].classList.add("text-danger")
      cells[4].classList.add("text-danger")
      cells[3].classList.remove("text-success", "text-warning")
      cells[4].classList.remove("text-success", "text-warning")
    }
    else {
      cells[3].classList.add("text-warning")
      cells[4].classList.add("text-warning")
      cells[3].classList.remove("text-success", "text-danger")
      cells[4].classList.remove("text-success", "text-danger")
    }
  }
  return
}

function search_chart(key){
  var searchTerm = document.getElementById(key).value.toUpperCase();
  var rows = table.rows;
  for (var i = 1; i < rows.length; i++) {
    td = rows[i].getElementsByTagName("td")[0]; // get first column of row
    if (!td.innerText.startsWith(searchTerm)){
      rows[i].style.display = "none"
    }
    else {
      rows[i].style.display = ""
    }
  }
}

function sortTableNum(n) {
  var switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 0; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      if (n == 5){
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        x_num = parseVolume(x.innerHTML)
        y_num = parseVolume(y.innerHTML)
      }
      else if (n == 4){
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        x_num = parsePercentage(x.innerHTML)
        y_num = parsePercentage(y.innerHTML)
      }

      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x_num > y_num) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x_num < y_num) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortTable(n) {
  var switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 0; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function parseVolume(vol){
  var lastChar = vol.slice(-1)
  var num = parseFloat(vol.slice(0, -1))

  if (lastChar == 'k'){
    num *= (10 ** 3)
  }
  else if (lastChar == 'M'){
    num *= (10 ** 6)
  }
  else if (lastChar == 'B'){
    num *= (10 ** 9)
  }

  return num
}

function parsePercentage(percent){
  var num = percent.replace("%", "");
  return parseFloat(num);
}

setInterval(fetch_stocks, 1000)
