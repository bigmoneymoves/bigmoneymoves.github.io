var fetch_url = "https://updategithubdata.deraphel.repl.co/alerts";
var write_url = "https://updategithubdata.deraphel.repl.co/alerts-write/";
var delete_url = "https://updategithubdata.deraphel.repl.co/alerts-delete/";

function uppercase(id){
  var tickerInput = document.getElementById(id);
  text = tickerInput.value

  tickerInput.value = text.toUpperCase();
}

function showOption(id){
  var priceSelect = document.getElementById(id).value
  var priceRow = document.getElementById("priceRow")
  var changeRow = document.getElementById("changeRow")
  var priceInput = document.getElementById("priceInput")
  var changeInput = document.getElementById("changeInput")

  if (priceSelect == "perChange"){
    changeRow.style.display = "";
    changeInput.required = true;
    priceRow.style.display = "none";
    priceInput.required = false;
  }
  else{
    changeRow.style.display = "none";
    changeInput.required = false;
    priceRow.style.display = "";
    priceInput.required = true;
  }
}

async function add_alert(){
  var form = document.getElementById("alertForm")
  var ticker = document.getElementById("tickerInput").value.toUpperCase()
  var id = document.getElementById("discordInput").value
  var alertType = document.getElementById("alertTypeSelect").value
  var priceType = document.getElementById("priceTypeSelect").value

  if (priceType == "perChange"){
    var value = document.getElementById("changeInput").value
  }
  else{
    var value = document.getElementById("priceInput").value
  }

  data = [id, alertType, priceType, value]

  const resp = await fetch(write_url + ticker, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (resp.ok){
    alert(`The stock ${ticker} has been added to the list of alerts.`)
    form.reset()
    await update_alert_chart()
    return
  }
  else{
    if (resp.status == 403){
      alert(`The stock ${ticker} could not be added. An identical alert already exists.`)
      return
    }
    else{
      alert(`The stock ${ticker} could not be added. Please make sure that the ticker exists.`)
      return
    }
  }
}

async function update_alert_chart(){
  const alerts = await fetch_alerts()
  return
}

async function fetch_alerts(){
  const response = await fetch(fetch_url)
  return response.json()
}

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

document.getElementById("alertForm").addEventListener('submit', function (event) {
        event.preventDefault();
      })
