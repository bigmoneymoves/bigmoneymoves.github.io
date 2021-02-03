var fetch_base_url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/"
var tickers_url = "https://bigmoneymoves.github.io/data/tickers.txt"

async function stock_fetch(){
  var tickers = await getData(tickers_url);
  console.log(tickers);
}

async function getData(url){
  const response = await fetch(url);
  return response.json();
}

stock_fetch();

//setInterval(stock_fetch, 1000);
