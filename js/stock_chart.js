var fetch_url = "https://bigmoneymoves.github.io/data/stocks.json"
var tickers_url = "https://bigmoneymoves.github.io/data/tickers.txt"
var all_stock_data = {}

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
  return
}

fetch_stocks()
