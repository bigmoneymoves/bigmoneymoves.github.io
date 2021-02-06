var fetch_url = "https://updategithubdata.deraphel.repl.co/alerts";
var write_url = "https://updategithubdata.deraphel.repl.co/alerts-write/";
var delete_url = "https://updategithubdata.deraphel.repl.co/alerts-delete/";

var form = document.getElementById("alertForm")
var price = document.getElementById("priceSelect")
var alertType = document.getElementById("alertTypeSelect")
var priceType = document.getElementById("priceTypeSelect")
var priceRow = document.getElementById("priceRow")
var changeRow = document.getElementById("changeRow")
var priceInput = document.getElementById("priceInput")
var changeInput = document.getElementById("changeInput")
var discordInput = document.getElementById("discordInput")
var tickerInput = document.getElementById("tickerInput")

var alertTable = document.getElementById("alertsTable")

var modal = new bootstrap.Modal(document.getElementById('alertModal'))
var modalBody = document.getElementById("modalBody")

function uppercase(id){
  var input = document.getElementById(id);
  text = input.value
  input.value = text.toUpperCase();
}

function showOption(id){
  var ptype = priceType.value;

  if (ptype == "perChange"){
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

  var ticker = tickerInput.value.toUpperCase()
  var id = discordInput.value
  var atype = alertType.value
  var ptype = priceType.value

  if (ptype == "perChange"){
    var value = changeInput.value
  }
  else{
    var value = priceInput.value
  }

  data = [id, atype, ptype, value]

  const resp = await fetch(write_url + ticker, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  modal.toggle()

  if (resp.ok){
    modalBody.innerHTML = `The stock <b>${ticker}</b> has been added to the list of alerts.`
    form.reset()
    await update_alert_chart()
    return
  }
  else{
    if (resp.status == 403){
    modalBody.innerHTML = `The stock ${ticker} could not be added. An identical alert already exists.`
      return
    }
    else{
    modalBody.innerHTML = `The stock ${ticker} could not be added. Please make sure that the ticker exists.`
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

function save_data(){
  var alertTableData = alertTable.innerHTML;
  localStorage.bmmAlertsTable = alertTableData;
  return
}

function load_prev_data(){
  var loadData = localStorage.bmmAlertsTable;
  alertTable.innerHTML = loadData;
}

document.getElementById("alertForm").addEventListener('submit', function (event) {
        event.preventDefault();
})
