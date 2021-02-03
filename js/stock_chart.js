var fetch_url = "https://bigmoneymoves.github.io/data/stocks.json";
var tickers_url = "https://bigmoneymoves.github.io/data/tickers.txt";
var all_stock_data = {};
var table_headers = ["TICKER", "PREV CLOSE", "CUR PRICE", "CHANGE", "CHANGE %", "VOLUME"];
var tickers;

async function update_tickers(url){
  tickers = await getData(tickers_url)
}

async function add_ticker(ticker){
  return
}

async function remove_ticker(ticker){
  return
}

async function fetch_stocks(){
  all_stock_data = await getData(fetch_url);
  console.log(all_stock_data)
  update_chart();

  return
}

async function getData(url){
  const response = await fetch(url);
  return response.json();
}

function update_chart(){
  table = document.getElementById("stockTable");
  for (var i = 0; i < tickers.tickers.length; i++) {
    var ticker = tickers.tickers[i]
    var ticker_data = all_stock_data[ticker]

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

update_tickers()
fetch_stocks()
