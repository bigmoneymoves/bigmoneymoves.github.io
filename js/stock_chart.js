var fetch_url = "https://bigmoneymoves.github.io/data/stocks.json";
var tickers_url = "https://bronze-cool-ceratonykus.glitch.me/tickers";
var tickers_write_url = "https://bronze-cool-ceratonykus.glitch.me/tickers/write";
var all_stock_data = {};
var table_headers = ["TICKER", "PREV CLOSE", "CUR PRICE", "CHANGE", "CHANGE %", "VOLUME"];
var tickers = [];

async function add_ticker(ticker){
  toAdd = ticker.toUpperCase();
  tickers = await getData(tickers_url);

  if (tickers.includes(toAdd)){
    alert("The specified ticker already exists in the database.")
    return
  }
  else {
    tickers.push(toAdd);
    const response = await fetch(tickers_write_url, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(tickers)
    })

    return
  }
}

async function remove_ticker(ticker){
  toRemove = ticker.toUpperCase();
  tickers = await getData(tickers_url);

  if (tickers.includes(toRemove)){
    pos = tickers.indexOf(ticker);
    tickers.splice(pos, 1);
    console.log(tickers);

    const response = await fetch(tickers_write_url, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(tickers)
    })
  }
  else {
    alert("The specified ticker does not exist in the database. Please check your spelling.");
    return;
  }
  return
}

async function fetch_stocks(){
  all_stock_data = await getData(fetch_url);
  tickers = await getData(tickers_url);
  update_chart();

  return
}

async function getData(url){
  const response = await fetch(url);
  return response.json();
}

function update_chart(){
  table = document.getElementById("stockTable");
  for (var i = 0; i < tickers.length; i++) {
    var ticker = tickers[i]
    var ticker_data = all_stock_data[ticker]

    if (ticker_data === undefined){
      continue;
    }

    var row = table.insertRow()
    // ["TICKER", "PREV CLOSE", "CUR PRICE", "CHANGE", "CHANGE %", "VOLUME"]
    var cell0 = row.insertCell(-1)
    var cell1 = row.insertCell(-1)
    var cell2 = row.insertCell(-1)
    var cell3 = row.insertCell(-1)
    var cell4 = row.insertCell(-1)
    var cell5 = row.insertCell(-1)

    cell0.innerHTML = ticker
    cell1.innerHTML = ticker_data[0]
    cell2.innerHTML = ticker_data[1]
    cell3.innerHTML = ticker_data[2]
    cell4.innerHTML = ticker_data[3]
    cell5.innerHTML = ticker_data[4]

    change = parseFloat(ticker_data[3])

    if (change > 0){
      cell3.classList.add("text-success")
      cell4.classList.add("text-success")
    }
    else if (change < 0){
      cell3.classList.add("text-danger")
      cell4.classList.add("text-danger")
    }
    else {
      cell3.classList.add("text-warning")
      cell4.classList.add("text-warning")
    }
  }
  return
}

function search_chart(key){
  var searchTerm = document.getElementById(key).value.toUpperCase();
  var table = document.getElementById("stockTable");
  var rows = table.rows;
  for (var i = 1; i < rows.length; i++) {
    td = rows[i].getElementsByTagName("td")[0]; // get first column of row
    if (!td.innerHTML.startsWith(searchTerm)){
      rows[i].style.display = "none"
    }
    else {
      rows[i].style.display = ""
    }
  }
}

fetch_stocks();
