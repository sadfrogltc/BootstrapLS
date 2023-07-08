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
          card.classList.add("bg-dark")
          card.classList.add("rounded")
          const image = card.querySelector("[data-card-img]")
          image.classList.add("bg-dark")

          const videoUser = document.createElement("video")
          const header = card.querySelector("[data-header]")
          header.classList.add("bg-dark")
          header.classList.add("text-white")

          const body = card.querySelector("[data-body]")
          body.classList.add("bg-dark")
          body.classList.add("text-white")



          card.onclick = function() {
            console.log("From Inventory Click")
//DESIGN USER COLLECTION MODAL TO DISPLAY EACH INDIVIDUAL token


            document.getElementById('modalTitle').innerHTML = "Art Pieces from "+collection.name +"<br> <h6>Collection: "+collection.propertyid +"</h6>"
            document.getElementById('modalBody').textContent = ''
            getUserCollectionTokens(collection.propertyid).map(token => {
              let url = API + 'omni-get-nft&property=' + collection.propertyid + "&token=" + token
              console.log("This is url")
              console.log(url)
              fetch(url).then((resp) => resp.json()).then(function(data){
                const setPriceButton = document.createElement("button")
                const listButton = document.createElement("button")
                   tokenData = data
                   //

                        let holderdata = new Object
                        try {

                                 holderdata = JSON.parse(tokenData[0].holderdata)
                                     if (holderdata.destination == omni.address) {
                                         console.log("Price"+ holderdata.desire)
                                         tokenPrice = holderdata.desire
                                     }
                        } catch (error) {
                          console.log("No Price")
                          listButton.disabled = true
                        }

                   //
                   console.log("this is tokendata")
                   console.log(tokenData)
                   const card = document.createElement('div')
                   card.classList.add("rounded")

                   const img = document.createElement('img')
                   const video = document.createElement("video")
                   const header = document.createElement('div')
                   const body = document.createElement('div')
                   const setPriceInput = document.createElement("input")
//todo: conditional set price/change price based on holder data
//set price and change price (change holder data)
//conditional list based on holderdata





                   setPriceInput.type = "number"
                   setPriceInput.classList.add("mx-3")
                   setPriceInput.classList.add("w-75")
                   setPriceInput.classList.add("input")


                   setPriceButton.classList.add("btn")
                   setPriceButton.classList.add("btn-dark")
                   setPriceButton.classList.add("m-3")
                   setPriceButton.textContent = "Set New Price"
                   setPriceButton.onclick = function(){
                     let holderdata = new Object
                         let property = collection.propertyid

                         holderdata.desire = setPriceInput.value
                         holderdata.destination = omni.address


                         holderdata = JSON.stringify(holderdata)
                         let url = API + 'omni-desire-trader&authkey=' + AuthKey + '&property=' + property + '&token=' + token + '&holderdata=' + holderdata
                         url = encodeURI(url)
                         console.log(url)
                         fetch(url).then((resp) => resp.json()).then(function(data){

                             alert(data.answer + '\nSign this transaction and wait for 1 confirmation from the network to continue   ' + url)
                         })


          }
          listButton.classList.add("btn")
          listButton.classList.add("btn-dark")
          listButton.classList.add("m-3")
          listButton.textContent = "List"
          listButton.onclick = function(){
            let url = API + 'omni-list-trader&authkey=' + AuthKey + '&property=' + collection.propertyid + '&token=' + token +'&challenger='+ feeAddress
             fetch(url).then((resp) => resp.json()).then(function(data){
                 alert(data.answer + 'After 1 confirmation your NFT will be available at the Trader Bot')
             })
 }

                   card.classList.add("card")

                   img.classList.add("img")
                   header.classList.add("header")
                   body.classList.add("body")

                   grantdata = detectSource(tokenData[0].grantdata)
                   console.log("This is detectSource")
                               if(grantdata.origin == "LiteWorlds"){
                                 if(grantdata.content){
                                 img.src = ORDINAL + grantdata.content
                                 video.src = ORDINAL + grantdata.content
                                 console.log("is ordinal")
                               }
                               else{
                                 img.src = IPFS + grantdata.image.split('ipfs://')[1]
                                 video.src = IPFS + grantdata.image.split('ipfs://')[1]
                                 console.log(img.src)
                                 console.log("is not ordinal")
                               }
                               }
                               else if (grantdata.origin == "Liteverse"){
                                 img.src = IPFS + grantdata.image.split('ipfs://')[1]
                                 video.src = IPFS + grantdata.image.split('ipfs://')[1]
                               }
                               video.id = 'aud' + collection.propertyid + '#' + token
                         video.controls = true
                         video.style.display = 'none'
                         video.style.marginTop = '37px'
                         video.style.maxHeight = '250px'
                         video.style.maxWidth = '200px'
                         video.oncanplay = function(){
                             document.getElementById('aud' + collection.propertyid + '#' + token).style.display = 'inline-block'
                         }
                         img.onerror = function(){this.style.display='none';}
                               card.append(img)
                               card.append(video)
                               card.append(header)
                               card.append(body)
                               card.append(setPriceInput)
                               card.append(setPriceButton)
                               card.append(listButton)
                               header.innerHTML =  grantdata.name
                               body.innerHTML = "Token Number: "+ tokenData[0].index
                               if (holderdata.destination == omni.address) {
                                   body.innerHTML = "Token Number: "+ tokenData[0].index + "<br>Price: "+tokenPrice
                               }
                   document.getElementById('modalBody').append(card)
               })
              return {
                // name: token.name, propertyid: trader_collection.propertyid, element: cardTrader

              }
            })
            // document.getElementById('modalBody').innerHTML =

          }


          header.textContent = collection.name +" #"+collection.propertyid
          let url = API + 'omni-get-nft&property=' + collection.propertyid
          console.log("This is url")
          console.log(url)
          fetch(url).then((resp) => resp.json()).then(function(data){
            console.log(data)
            console.log("For first image")
            grantdata= detectSource(data[0].grantdata)
            console.log(grantdata)
            if(grantdata.origin == "LiteWorlds"){
              if(grantdata.content){
              image.src = ORDINAL + grantdata.content
              videoUser.src = ORDINAL + grantdata.content
              console.log("is ordinal")
            }
            else{
              image.src = IPFS + grantdata.image.split('ipfs://')[1]
              videoUser.src = IPFS + grantdata.image.split('ipfs://')[1]
              console.log(image.src)
              console.log("is not ordinal")
            }
            }
            else if (grantdata.origin == "Liteverse"){
              image.src = IPFS + grantdata.image.split('ipfs://')[1]
              videoUser.src = IPFS + grantdata.image.split('ipfs://')[1]
            }

          })
          videoUser.id = 'aud' + collection.propertyid
          videoUser.controls = true
          videoUser.style.display = 'none'
          videoUser.style.marginTop = '37px'
          videoUser.style.maxHeight = '250px'
          videoUser.style.maxWidth = '100px'
          videoUser.oncanplay = function(){
            document.getElementById('aud' + collection.propertyid).style.display = 'inline-block'
          }
          image.style.maxWidth = "150px"
          image.onerror = function(){this.style.display='none';}
          card.prepend(videoUser)
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
          const videoTrader = document.createElement("video")
          const headerTrader = cardTrader.querySelector("[data-trader-header]")
          const bodyTrader = cardTrader.querySelector("[data-trader-body]")
          const cardTraderButton = cardTrader.querySelector("[data-trader-card-button]")

          let url = API + 'omni-get-nft&property=' + trader_collection.propertyid
          console.log("This is url")
          console.log(url)
          fetch(url).then((resp) => resp.json()).then(function(data){
            console.log(data)
            console.log("For first image")
            grantdata= detectSource(data[0].grantdata)
            console.log(grantdata)
            if(grantdata.origin == "LiteWorlds"){
              if(grantdata.content){
              imageTrader.src = ORDINAL + grantdata.content
              videoTrader.src = ORDINAL + grantdata.content
              console.log("is ordinal")
            }
            else{
              imageTrader.src = IPFS + grantdata.image.split('ipfs://')[1]
              videoTrader.src =  IPFS + grantdata.image.split('ipfs://')[1]
              console.log(image.src)
              console.log("is not ordinal")
            }
            }
            else if (grantdata.origin == "Liteverse"){
              imageTrader.src = IPFS + grantdata.image.split('ipfs://')[1]
              videoTrader.src =  IPFS + grantdata.image.split('ipfs://')[1]

            }

          })
          videoTrader.id = 'aud' + trader_collection.propertyid + 1
    videoTrader.controls = true
    videoTrader.style.display = 'none'
    videoTrader.style.marginTop = '37px'
    videoTrader.style.maxHeight = '250px'
    videoTrader.style.maxWidth = '100px'
    videoTrader.oncanplay = function(){
        document.getElementById('aud' + trader_collection.propertyid +1).style.display = 'inline-block'
    }
          cardTrader.prepend(videoTrader)
          console.log("prepended")
          imageTrader.onerror = function(){this.style.display='none';}
          headerTrader.innerHTML = trader_collection.name +"<hr> <div style='font-size:10px'>#"+trader_collection.propertyid +"</div>"

          imageTrader.style.maxWidth = "250px"
          imageTrader.style.maxHeight = "100px"
          artCardTraderContainer.append(cardTrader)
          cardTrader.classList.add("bg-dark")
          headerTrader.classList.add("text-light")
          headerTrader.classList.add("bg-dark")
          bodyTrader.classList.add("text-light")
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
                   holderData = JSON.parse(tokenData[0].holderdata)
                   console.log("this is tokendata")
                   console.log(tokenData)
                   const card = document.createElement('div')
                   card.classList.add("m-3")
                   const img = document.createElement('img')
                   const video = document.createElement('video')

                   const header = document.createElement('div')
                   header.classList.add("m-3")
                   header.classList.add("mb-1")
                   const body = document.createElement('div')
                   body.classList.add("m-3")
                   const button = document.createElement('button')
                   button.classList.add("btn")
                   button.classList.add("btn-dark")
                   button.classList.add("m-3")
                   if(holderData.destination==omni.address){
                     button.textContent = "Cancel Listing"
                     button.onclick = function(){
                       let url = API + 'omni-cancel-trader&authkey=' + AuthKey + '&property=' + trader_collection.propertyid + '&token=' + token
                         fetch(url).then((resp) => resp.json()).then(function(data){
                             alert(data.answer)
                         })
                    console.log("Clicked Cancel")

                }
            }
            else{

                   button.textContent = "Buy"
                   button.onclick = function(){
              let url = API + 'omni-take-trader&authkey=' + AuthKey + '&property=' + trader_collection.propertyid + '&token=' + token
              fetch(url).then((resp) => resp.json()).then(function(data){
                  alert(data.answer)
                  console.log(url)
                  console.log("Clicked Buy")

              })
          }
        }

                   card.classList.add("card")
                   img.classList.add("img")
                   header.classList.add("header")
                   body.classList.add("body")

                   grantdata = detectSource(tokenData[0].grantdata)
                   console.log("This is detectSource")
                               if(grantdata.origin == "LiteWorlds"){
                                 if(grantdata.content){
                                 img.src = ORDINAL + grantdata.content
                                 video.src = ORDINAL + grantdata.content

                                 console.log("is ordinal")
                               }
                               else{
                                 img.src = IPFS + grantdata.image.split('ipfs://')[1]
                                 console.log(img.src)
                                 console.log("is not ordinal")
                                 video.src = IPFS + grantdata.image.split('ipfs://')[1]

                               }
                               }
                               else if (grantdata.origin == "Liteverse"){
                                 img.src = IPFS + grantdata.image.split('ipfs://')[1]
                                 video.src = IPFS + grantdata.image.split('ipfs://')[1]

                               }
                               video.id = 'aud' + trader_collection.propertyid + '#' + token
                               video.controls = true
                               video.style.display = 'none'
                               video.style.marginTop = '37px'
                               video.style.maxHeight = '250px'
                               video.style.maxWidth = '250px'
                               video.oncanplay = function(){
                                   document.getElementById('aud' + trader_collection.propertyid + '#' + token).style.display = 'inline-block'
                               }

                               card.append(img)
                               card.append(video)
                               img.onerror = function(){this.style.display='none';}
                               card.append(header)
                               card.append(body)
                               card.append(button)
                               header.innerHTML =  grantdata.name + '<hr>'
                               body.innerHTML = "Token Number: "+ tokenData[0].index  + '<br> <div class="display-5">' + JSON.parse(tokenData[0].holderdata).desire + " Ł</div><br>"
                                                + ' Seller: ' + JSON.parse(tokenData[0].holderdata).destination
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
function buyNFT(propertyid, tokenid){
  console.log("Running Buy")
  let url = API + 'omni-take-trader&authkey=' + AuthKey + '&property=' + propertyid + '&token=' + tokenid
  fetch(url).then((resp) => resp.json()).then(function(data){
      alert(data.answer)
  })
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
