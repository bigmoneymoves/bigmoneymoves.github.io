var fetch_base_url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/"
var tickers_url = "https://bigmoneymoves.github.io/tickers.txt"

function stock_fetch(){
  fetch(tickers_url)
    .then(response => response.json())
    .then(data => tickers = data);
  console.log(tickers);
}

stock_fetch();

//setInterval(stock_fetch, 1000);
