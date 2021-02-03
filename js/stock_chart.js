var fetch_base_url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/"
var tickers_url = "https://bigmoneymoves.github.io/data/tickers.txt"

var all_stock_data = {"tickers": []}

async function fetch_stocks(){
  var ticker_json = await getData(tickers_url);
  tickers = ticker_json.tickers;

  for (var i = 0; i < tickers.length; i++) {
    await fetch_stock(tickers[i]);
  }

  return
}

async function fetch_stock(ticker){
  var full_url = fetch_base_url + ticker + "?modules=price";
  var ticker_json = await getData(full_url);
  all_stock_data.tickers.push(ticker_json);

  document.getElementById("stockChart").innerHTML = ticker_json;
  return
}

async function getData(url){
  const response = await fetch(url);
  return response.json();
}

fetch_stock("GME");

//setInterval(stock_fetch, 1000);
