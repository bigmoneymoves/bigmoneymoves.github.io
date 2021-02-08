var fetch_url = "https://bmmfetch2.deraphel.repl.co/top-gainers"
var data = {}

async function pageLoad(){
  data = await fetch_top_gainers()
  populate_table()
  return
}

async function fetch_top_gainers(){
  const response = await fetch(fetch_url)
  return response.json()
}

function populate_table(){
  var tableBody = document.getElementById("tableBody")
  var tickers = data['rows']

  for (let i = 0; i < tickers.length; i++) {
    var ticker = tickers[i]
    let row = tableBody.insertRow(-1)

    for (let i = 0; i < ticker.length; i++) {
      var cell = row.insertCell(-1)
      cell.innerHTML = ticker[i]
    }

  }

  return
}
