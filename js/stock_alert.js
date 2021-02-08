var fetch_url = "https://updategithubdata.deraphel.repl.co/alerts/";
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

var discordWebHook = "https://discord.com/api/webhooks/807711942822985778/Rwut-Unhmw464KuOSPXgqJHKxeCsAttI7RGOGa4NAVsS6ZITsCQoNQKbkkNqNdCnQ913"

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
    var data = [id, atype, ptype, changeInput.value]
    var discordMsg = `<@${id}> The stock **${ticker}** has been added to the list of alerts. I will alert you when it goes ${atype} **${changeInput.value}%**`
  }
  else{
    var data = [id, atype, ptype, priceInput.value]
    var price = parseFloat(priceInput.value).toLocaleString('en-US', {style: 'currency', currency: 'USD'})
    var discordMsg = `<@${id}> The stock **${ticker}** has been added to the list of alerts. I will alert you when it goes ${atype} your price target of **${price}**`
  }

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

    await fetch(discordWebHook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'content': discordMsg})
    })
    return
  }
  else{
    if (resp.status == 403){
      modalBody.innerHTML = `The stock ${ticker} could not be added. An identical alert already exists.`
    }
    else if (resp.status == 402){
      modalBody.innerHTML = `The stock ${ticker} could not be added. You need to add it to the chart first.`
    }
    else {
    modalBody.innerHTML = `The stock ${ticker} could not be added. Please make sure that the ticker exists.`
    }

    return
  }
}

async function update_alert_chart(){
  alerts = await fetch_alerts()

  // {"alerts": {"GME": [[user, above/below, pricetype, price/change%]]}}
  // Table: User / Ticker / Alert Type / Price/Change%

  for (const [ticker, t_alerts] of Object.entries(alerts)){
    for (var i = 0; i < t_alerts.length; i++) {
      rowID = document.getElementById(t_alerts[i])
      if (rowID == null){
        var newRow = alertTable.insertRow(-1)
        newRow.id = t_alerts[i]
        var cell0 = newRow.insertCell(-1)
        var cell1 = newRow.insertCell(-1)
        var cell2 = newRow.insertCell(-1)

        var usr = t_alerts[i][0]
        var type = t_alerts[i][1]
        var ptype = t_alerts[i][2]
        var price = t_alerts[i][3]
        var sign;

        cell0.innerHTML = usr
        cell1.innerHTML = ticker

        if (type == "above"){
          var sign = '>'
        }
        else{
          var sign = '<'
        }

        if (ptype == "price"){
          cell2.innerHTML = sign + parseFloat(price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})
        }
        else{
          cell2.innerHTML = sign + price + "%"
        }
      }
    }
  }

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
