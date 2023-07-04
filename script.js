// Link connections
const API = 'https://api.liteworlds.quest/?method='
const IPFS = 'https://ipfs.io/ipfs/'
//const LITEVERSE = 'https://cloudflare-ipfs.com/ipfs/' - changed 6/3/23
const ORDINAL = 'https://ordinalslite.com/content/'
const ORDINALJSON = 'https://litecoin.earlyordies.com/preview/'
const EXTENSION = 'https://chrome.google.com/webstore/detail/liteworlds/npdhoeodcojbmdioodndhnnodjacfhil'
const DISCORD = 'https://discord.gg/H3RDCkU35C'

// Global vars
var AuthKey = ''
var IP = ''
var user = new Object
var omni = new Object
var traderList = new Object
var qromni = new QRCode(document.getElementById("LWQ-MG-content-wallet-qr"), {text:"LiteWorlds", colorDark:"black", colorLight:"white"})
var userCollections = new Array
var traderCollections = new Array

var collectionTokens = []
var getOmniCollectionListCounter =0;
let feeAddress = 'ltc1qduhgah34d7wl8aq235mkstrx5kn770rwzr369u'
getIP()
getExtension()
function getExtension(){document.addEventListener('LWQ-AuthKey', function(data) {
    AuthKey = data.detail
    console.log(AuthKey)






    getUser()
})}

function getIP() {
    let url = API + 'public-hello'
    fetch(url).then((resp) => resp.json()).then(function(data){
        if (data.bool) {
            IP = data.ip
            console.log(data)
            console.log("IP: "+ data.ip)
        }
    })
}

function getUser() {
    let url = API + 'user-get&authkey=' + AuthKey
    fetch(url).then((resp) => resp.json()).then(function(data){
        if (data.bool) {
            user = data
            console.log(data)
            if(AuthKey==""){
              //if not logged in display changes:
              document.getElementById("recieve-content").innerHTML = "<div class='display-4 m-3'>You are not logged in</div>"
              document.getElementById("send-content").innerHTML = "<div class='display-4 m-3'>Download the Extension</div><a href='https://chrome.google.com/webstore/detail/liteworlds/npdhoeodcojbmdioodndhnnodjacfhil' target='_blank'><button class='btn border border-light m-5 shadow text-light'><img src='graphics/LWLA.png' class='w-100 p-5' style='width:30px'><h3>Click Here</h3></button></a>"
              document.getElementById("username-display").innerHTML = "<h3>Guest</h3>"
            }
            else{
              document.getElementById("username-display").innerHTML = "<h5>"+user.User+"</h5>"

            }
            getOmni()
        } else {

        }

    })

}
function getOmni() {
    let url = API + 'omni-get&authkey=' + AuthKey
    fetch(url).then((resp) => resp.json()).then(function(data){
        omni = data
        console.log(omni)
        qromni.makeCode(omni.address)
        document.getElementById('wallet-balance').innerHTML = omni.balance + " Ł";
        document.getElementById('wallet-pending').innerHTML = omni.pending  + " Ł";
        document.getElementById('wallet-address').innerHTML = omni.address;
        getOmniCollectionList()

    })
}
function getOmniCollectionList(){

        if(getOmniCollectionListCounter==0){

        userCollectionList = omni.token.nft;
        userCollectionList.forEach(userCollection => {

          userCollections.push(userCollection)

        })
        //RENDERS CARDS
        const searchInput = document.querySelector("[data-search]")
        const artCardTemplate = document.querySelector("[data-art-template]")
        const artCardContainer = document.querySelector("[data-art-cards-container]")

        let collections = []

        searchInput.addEventListener("input", (e) => {
          const value = e.target.value
          collections.forEach( property => {
            if(typeof property.name!== "undefined"){
            console.log(property)
             const isVisible = property.name.includes(value) || property.propertyid.toString().includes(value)
             property.element.classList.toggle("hide", !isVisible)
           }
          })
        } )
        collections = userCollections.map(collection => {
          if(collection.propertyid){
            console.log(collection.propertyid)
          const card = artCardTemplate.content.cloneNode(true).children[0]
          const image = card.querySelector("[data-card-img]")
          const header = card.querySelector("[data-header]")
          const body = card.querySelector("[data-body]")
          const cardButton = card.querySelector("[data-card-button]")
          card.onclick = function() {
            getUserCollectionTokens(collection.propertyid)
            document.getElementById('modalBody').innerHTML = collectionTokens.join('</br>')
          }
          document.getElementById('modalTitle').innerHTML = "Art Pieces from "+collection.name +"<br> <h6>Collection: "+collection.propertyid +"</h6>"
          document.getElementById('modalBody').textContent = ''

          header.textContent = collection.name +" #"+collection.propertyid
          image.src='graphics\\LS.jpg'
          image.style.maxWidth = "150px"
          artCardContainer.append(card)
          return {
            name: collection.name, propertyid: collection.propertyid, element: card
          }
        }
        })

      }
      getOmniCollectionListCounter++
      getOmniTrader()
}
function getOmniTrader(){
  if(getOmniCollectionListCounter==1){
    let url = API + 'omni-get-trader'
    fetch(url).then((resp) => resp.json()).then(function(data){
        traderList = data
        console.log("Trader List:")
        console.log(traderList)
        traderList.forEach(traderCollection => {

          traderCollections.push(traderCollection)

        })
        //RENDERS COLLECTION CARDS
        const searchTraderInput = document.querySelector("[data-trader-search]")
        const artCardTraderTemplate = document.querySelector("[data-art-trader-template]")
        const artCardTraderContainer = document.querySelector("[data-art-cards-trader-container]")

        let trader_collections = []

        searchTraderInput.addEventListener("input", (e) => {
          const value = e.target.value
          trader_collections.forEach( property => {
            if(typeof property.propertyid !== "undefined"){
            console.log(property)
             const isVisible = property.name.includes(value) || property.propertyid.toString().includes(value)
             property.element.classList.toggle("hide", !isVisible)
           }
          })
        } )

//DESIGN COLLECTION CARDS
        trader_collections = traderCollections.map(trader_collection => {
          if(trader_collection.propertyid){
          const cardTrader = artCardTraderTemplate.content.cloneNode(true).children[0]

          const imageTrader = cardTrader.querySelector("[data-trader-card-img]")
          const headerTrader = cardTrader.querySelector("[data-trader-header]")
          const bodyTrader = cardTrader.querySelector("[data-trader-body]")
          const cardTraderButton = cardTrader.querySelector("[data-trader-card-button]")


          headerTrader.textContent = trader_collection.name +" #"+trader_collection.propertyid
          imageTrader.src='graphics\\LS.jpg'
          imageTrader.style.maxWidth = "150px"

          artCardTraderContainer.append(cardTrader)

          cardTrader.onclick = function() {
            console.log("From Trader Click")
//DESIGN TRADER COLLECTION MODAL TO DISPLAY EACH INDIVIDUAL token


            document.getElementById('modalTitle').innerHTML = "Art Pieces from "+trader_collection.name +"<br> <h6>Collection: "+trader_collection.propertyid +"</h6>"
            document.getElementById('modalBody').textContent = ''
            getTraderCollectionTokens(trader_collection.propertyid).map(token => {
              let url = API + 'omni-get-nft&property=' + trader_collection.propertyid + "&token=" + token
              console.log("This is url")
              console.log(url)
              fetch(url).then((resp) => resp.json()).then(function(data){

                   tokenData = data
                   console.log("this is tokendata")
                   console.log(tokenData)
                   const card = document.createElement('div')
                   const img = document.createElement('img')
                   const header = document.createElement('div')
                   const body = document.createElement('div')
                   card.classList.add("card")
                   img.classList.add("img")
                   header.classList.add("header")
                   body.classList.add("body")

                   grantdata = detectSource(tokenData[0].grantdata)
                   console.log("This is detectSource")
                               if(grantdata.origin == "LiteWorlds"){
                                 if(grantdata.content){
                                 img.src = ORDINAL + grantdata.content
                                 console.log("is ordinal")
                               }
                               else{
                                 img.src = IPFS + grantdata.image.split('ipfs://')[1]
                                 console.log(img.src)
                                 console.log("is not ordinal")
                               }
                               }
                               else if (grantdata.origin == "Liteverse"){
                                 img.src = IPFS + grantdata.image.split('ipfs://')[1]
                               }
                               card.append(img)
                               card.append(header)
                               card.append(body)
                               header.innerHTML =  grantdata.name
                               body.innerHTML = "Token Number: "+ tokenData[0].index  + '<br> Price: ' + JSON.parse(tokenData[0].holderdata).desire + "<br>"
                                                + ' sold by ' + JSON.parse(tokenData[0].holderdata).destination
                   document.getElementById('modalBody').append(card)
               })
              return {
                // name: token.name, propertyid: trader_collection.propertyid, element: cardTrader

              }
            })
            // document.getElementById('modalBody').innerHTML =

          }


//return map of collections for sale
          return {
            name: trader_collection.name, propertyid: trader_collection.propertyid, element: cardTrader
          }
        }
        })

    })
}
getOmniCollectionListCounter++

}
function getUserCollectionTokens(c){
  console.log("This is c")
  console.log(c)

  collectionTokens = []
  for(a=0;a<omni.token.nft.length-1;a++){

    if(omni.token.nft[a].propertyid.toString()==c){
      console.log("This is a")
      console.log(omni.token.nft[a])
      for(b=0;b<omni.token.nft[a].tokenindex.length;b++){
        console.log("This is b")
        console.log(omni.token.nft[a].tokenindex[b])
        collectionTokens.push(omni.token.nft[a].tokenindex[b])
        }
      }
    }
  console.log(collectionTokens)
  return collectionTokens
}
function getTraderCollectionTokens(c){
  console.log("This is c")
  console.log(c)
  console.log(traderList)
  collectionTokens = []
  for(a=0;a<traderList.length-1;a++){
    console.log(traderList[a])
    if(traderList[a].propertyid.toString()==c){
      console.log("This is a")
      console.log(traderList[a])
      for(b=0;b<traderList[a].list.length;b++){
        console.log("This is b")
        console.log(traderList[a].list[b])
        collectionTokens.push(traderList[a].list[b])
        }
      }
    }
  console.log(collectionTokens)
  return collectionTokens
}
function ltcfaucet() {
    let url = API + 'omni-send-faucet&authkey=' + AuthKey
    fetch(url).then((resp) => resp.json()).then(function(data){
        alert(data.answer)
        if (data.bool) {
            getUser()
        }
    })
}
function sendOmni() {
      let destination = document.getElementById('wallet-send-destination').value
      let amount = document.getElementById('wallet-send-amount').value
      let url = API + 'omni-send&authkey=' + AuthKey + '&destination=' + destination + '&amount=' + amount +'&challenger='+ feeAddress
      console.log("D "+destination + " A" + amount)
      if(destination!==''&&amount!==''){
      fetch(url).then((resp) => resp.json()).then(function(data){
        if(data.bool){
        console.log(data)

        setTimeout(function(){
                   alert(data.answer)
               }, 500)
      }
      else{
        alert("Something went Wrong Server Side")

      }
    }

    )}

    else{
      alert("Something went Wrong Litecoin Studio Side")
    }
}
function detectSource(grantdata){
  try{
  //DETECT LITEWORLDS
  grantdata = JSON.parse(grantdata)
  grantdata.origin = "LiteWorlds"
  console.log("LiteWorlds")
  console.log(grantdata)

}
catch {
  //DETECT LITEVERSE
  console.log("Liteverse")

  grantdata= grantdata.replaceAll("{'", '{"')
  grantdata = grantdata.replaceAll("'}", '"}')
  grantdata = grantdata.replaceAll("':'", '":"')
  grantdata = grantdata.replaceAll("','", '","')
  grantdata = JSON.parse(grantdata)
  grantdata.origin = "Liteverse"
  console.log(grantdata)
}


  return grantdata
}

function showId(id){
  document.getElementById(id).style.display="block"
}

function hideId(id){

  document.getElementById(id).style.display="none"
}
