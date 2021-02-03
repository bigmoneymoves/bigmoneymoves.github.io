var fetch_base_url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/"
var tickers_url = "https://bigmoneymoves.github.io/data/tickers.txt"
var proxy_url = 'https://plain-hat-031d.deraphel.workers.dev/?uri'

var all_stock_data = {"tickers": []}

async function add_ticker(ticker){
  return
}

async function remove_ticker(ticker){
  return
}

async function check_ticker(ticker){
  var query_url = proxy_url + fetch_base_url + ticker + "?modules=price";
  var check_json = await checkData(query_url);

  return check_json.ok
}

async function fetch_stocks(){
  var ticker_json = await getData(tickers_url);
  tickers = ticker_json.tickers;

  for (var i = 0; i < tickers.length; i++) {
    await fetch_stock(tickers[i]);
  }

  update_chart();

  return
}

async function fetch_stock(ticker){
  //

  var full_url = proxy_url + fetch_base_url + ticker + "?modules=price";
  var ticker_json = await getData(full_url);
  var ticker_data = ticker_json.quoteSummary.result[0].price
  //all_stock_data.tickers.push({[ticker]: ticker_json.quoteSummary.result[0].price});

  if (typeof ticker_data.regularMarketOpen == "object") {
    openPrice = ticker_data.regularMarketOpen.fmt
    curPrice = ticker_data.regularMarketPrice.fmt
    priceChange = ticker_data.regularMarketChange.fmt
    priceChangePercent = ticker_data.regularMarketChangePercent.fmt
    volume = ticker_data.regularMarketVolume.fmt
  }

  else {
    openPrice = ticker_data.regularMarketOpen
    curPrice = ticker_data.regularMarketPrice
    priceChange = ticker_data.regularMarketChange
    priceChangePercent = ticker_data.regularMarketChangePercent
    volume = ticker_data.regularMarketVolume
  }

  relevant_data = [openPrice, curPrice, priceChange, priceChangePercent, volume]
  all_stock_data.tickers.push({[ticker]: relevant_data})

  console.log(`${openPrice}, ${curPrice}, ${priceChange}, ${priceChangePercent}, ${volume}`);
  console.log(all_stock_data)

  //document.getElementById("stockChart").innerHTML = testJSON;
  return
}

async function getData(url){
  const response = await fetch(url);
  return response.json();
}

async function checkData(ticker){
  try{
    const response = await fetch("");
    console.log(response.json());
    return true;
  }
  catch{
    console.log("NOPE");
    return false;
  }
}

//fetch_stock("GME");
checkData("GME")

//setInterval(stock_fetch, 1000);
