// Link connections
const API = 'https://api.liteworlds.quest/?method='
const IPFS = 'https://ipfs.io/ipfs/'
//const LITEVERSE = 'https://cloudflare-ipfs.com/ipfs/' - changed 6/3/23
const ORDINAL = 'https://ordinalslite.com/content/'
const ORDINALJSON = 'https://ordinalslite.com/preview/'
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
const feeAddress = 'ltc1qduhgah34d7wl8aq235mkstrx5kn770rwzr369u'

const featuredCollections = ["3859"]

//Initiation Functions - each function is chained starting from getExtension
getIP()
getExtension()


//makes eventlistener for a variable provided by the extension and then calls getUser()
function getExtension(){document.addEventListener('LWQ-AuthKey', function(data) {
  console.log("getExtension")
    AuthKey = data.detail
    console.log(AuthKey)
    getUser()
})}
//assumes extension is not being used and calls OmniTrader()
function getIP() {
  console.log("getIP")
    let url = API + 'public-hello'
    fetch(url).then((resp) => resp.json()).then(function(data){
        if (data.bool) {
            IP = data.ip
            console.log(data)
            console.log("IP: "+ data.ip)
            getOmniTrader()
        }
    })

}
//gets USER ACCOUNT with Login AUTHKEY - then calls getOmni()
function getUser() {
    let url = API + 'user-get&authkey=' + AuthKey
    fetch(url).then((resp) => resp.json()).then(function(data){
        if (data.bool) {
            user = data
            console.log(data)
              document.getElementById("username-display").innerHTML = "<h5>"+user.User+"</h5>"

        }
        else {


              //if not logged in display changes:
              document.getElementById("username-display").innerHTML = "<button class='btn btn-secondary' type='button' data-toggle='modal' data-target='#loginModal'>Login</button>"
              document.getElementById("nav-art-tab").disabled=true
              document.getElementById("nav-wallet-tab").disabled=true




        }
    })
      getOmni()
}
//populates wallet content with balances, and establishes omni variable, then calling getOmniCollectionList()
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
function getFeaturedArt(){


}
//gets list of owned collections, renders them in the Art Tab - sets up search function and display of individual tokens from collections
function getOmniCollectionList(){
//assumes OmniTrader got called already - counter in place so not to double populate content when switching tabs
        if(getOmniCollectionListCounter==1){
//adds owned collections to a local global array variable
            userCollectionList = omni.token.nft;
            userCollectionList.forEach(userCollection => {
            userCollections.push(userCollection)

        })


//RENDERS CARDS
        const artCardTemplate = document.querySelector("[data-art-template]")
        const artCardContainer = document.querySelector("[data-art-cards-container]")
        let collections = []

//RUNS SEARCH LISTENER
        const searchInput = document.querySelector("[data-search]")
        searchInput.addEventListener("input", (e) => {
          const value = e.target.value
          collections.forEach( property => {
//runs only if property exists - fixed selection issue
            if(typeof property.name!== "undefined"){
            console.log(property)
//on search input, hide any card that doesnt include the value of search input
             const isVisible = property.name.includes(value) || property.propertyid.toString().includes(value)
             property.element.classList.toggle("hide", !isVisible)
           }
          })
        } )
//maps collections to individual card and populates card fields with content
        collections = userCollections.reverse().map(collection => {
          if(collection.propertyid){

                const card = artCardTemplate.content.cloneNode(true).children[0]
                card.classList.add("rounded")
                const image = card.querySelector("[data-card-img]")
                const videoUser = document.createElement("video")
                const header = card.querySelector("[data-header]")
                header.classList.add("bg-light")
                const body = card.querySelector("[data-body]")

//On each individual card - if clicked- pulls and displays all token content from that collections
                card.onclick = function() {
//populates modal with collection content
                        document.getElementById('modalTitle').innerHTML = "Art Pieces from "+collection.name +"<br> <h6>Collection: "+collection.propertyid +"</h6>"
                        document.getElementById('modalBody').textContent = ''

//maps each token from the collection to a card and populates the fields
                        getUserCollectionTokens(collection.propertyid).reverse().map(token => {

                                    let url = API + 'omni-get-nft&property=' + collection.propertyid + "&token=" + token

                                    fetch(url).then((resp) => resp.json()).then(function(data){
//sets up variables for building the cards
                                      const setPriceButton = document.createElement("button")
                                      const listButton = document.createElement("button")
                                      const card = document.createElement('div')
                                      card.classList.add("rounded")

                                      const img = document.createElement('img')
                                      const video = document.createElement("video")
                                      const header = document.createElement('div')
                                      const body = document.createElement('div')
                                      const setPriceInput = document.createElement("input")
                                      setPriceInput.type = "number"
                                      setPriceInput.placeholder = "Set Price Here"
                                      setPriceInput.classList.add("mx-3")
                                      setPriceInput.classList.add("w-75")
                                      setPriceInput.classList.add("form-control")
                                      setPriceButton.classList.add("btn")
                                      setPriceButton.classList.add("btn-dark")
                                      setPriceButton.classList.add("m-3")
                                      setPriceButton.textContent = "Set New Price"
                                      listButton.classList.add("btn")
                                      listButton.classList.add("btn-dark")
                                      listButton.classList.add("m-3")
                                      listButton.textContent = "List"
                                      card.classList.add("card")
                                      img.classList.add("img")
                                      header.classList.add("header")
                                      body.classList.add("body")
                                      video.id = 'aud' + collection.propertyid + '#' + token
                                      video.controls = true
                                      video.style.display = 'none'
                                      video.style.marginTop = '37px'
                                      video.style.maxHeight = '250px'
                                      video.style.maxWidth = '200px'
                                      video.oncanplay = function(){
                                         document.getElementById('aud' + collection.propertyid + '#' + token).style.display = 'inline-block'
                                       }
                                      var ordinals = false
                                      tokenData = data
//filters grantdata and adds an attribute for the origin
                                      grantdata = detectSource(tokenData[0].grantdata)
                                      let holderdata = new Object

                                      header.innerHTML =  grantdata.name
                                      body.innerHTML = "Token Number: "+ tokenData[0].index + "<hr> <div class='display-6 mx-3'>Market Operations</div><hr>"

//puts the pieces together
                                      card.append(img)
                                      card.append(video)
                                      card.append(header)
                                      card.append(body)
                                      card.append(setPriceInput)
                                      card.append(setPriceButton)
                                      card.append(listButton)



//if there is price set in holder data- display price, id not, disable list button
                                              try {
                                                   holderdata = JSON.parse(tokenData[0].holderdata)
                                                       if (holderdata.destination == omni.address) {

                                                           tokenPrice = holderdata.desire
                                                           if (holderdata.destination == omni.address) {
                                                               body.innerHTML = "Token Number: "+ tokenData[0].index + "<br>Price: "+tokenPrice +" Ł<hr> <div class='display-6 mx-3'>Market Operations</div><hr>"
                                                           }
                                                           }
                                              } catch (error) {
                                                console.log("No Price")
                                                listButton.disabled = true
                                              }
//gets new setPriceInput value and changes the price
                                      setPriceButton.onclick = function(){
                                              let holderdata = new Object
                                               let property = collection.propertyid

                                               holderdata.desire = setPriceInput.value
                                               holderdata.destination = omni.address


                                               holderdata = JSON.stringify(holderdata)
                                               let url = API + 'omni-desire-trader&authkey=' + AuthKey + '&property=' + property + '&token=' + token + '&holderdata=' + holderdata
                                               url = encodeURI(url)

                                               fetch(url).then((resp) => resp.json()).then(function(data){

                                                   alert(data.answer + '\nSign this transaction and wait for 1 confirmation and come back to List it   ' + url)
                                               })
                                             }
//lists the token for the price on button click
                                        listButton.onclick = function(){
                                              let url = API + 'omni-list-trader&authkey=' + AuthKey + '&property=' + collection.propertyid + '&token=' + token +'&challenger='+ feeAddress
                                              fetch(url).then((resp) => resp.json()).then(function(data){
                                              alert(data.answer + 'After 1 confirmation your NFT will be available at the Trader Bot')
                                         })
                                        }

//sees if it is an ordinal reference and displays accordingly

                                         if(grantdata.origin == "LiteWorlds"){
                                           if(grantdata.structure=="epic"){
                                            console.log("is epic")
                                           img.src = ORDINAL + grantdata.content
                                           video.src = ORDINAL + grantdata.content

                                           ordinals=true
                                           if(ordinals){
                                             header.innerHTML =  grantdata.name +" <span style='font-size:10px'>| Ordinal Reference</span>"
                                           }
                                         }
                                         else if(grantdata.source=="ipfs"){
                                           console.log("is epic ipfs")
                                           img.src = IPFS + grantdata.content
                                           video.src = IPFS + grantdata.content

                                         }
                                         else if(grantdata.structure == "artefactual"|| grantdata.structure == "artefactual"){
                                           fetch(ORDINALJSON + grantdata.json).then((resp) => resp.text()).then(function(html){
                                                               let parser = new DOMParser()
                                                               let doc = parser.parseFromString(html, 'text/html')
                                                               console.log(doc)

                                                               let ordData = JSON.parse(doc.children[0].lastChild.children[0].innerHTML)
                                                               console.log(ordData.data
                                                               )
                                                               for (let a = 0; a < ordData.content.length; a++) {
                                                                   const element = ordData.content[a]
                                                                   if (ordData.type[a] == 'image') {

                                                                       img.src = ORDINAL + element
                                                                       header.innerHTML =  ordData.data.name + '<span style="font-size:10px"> | Ordinal Artifactual </span><hr>'

                                                                   }
                                                               }
                                                             })
                                         }
                                         else{
                                           img.src = IPFS + grantdata.image.split('ipfs://')[1]
                                           video.src = IPFS + grantdata.image.split('ipfs://')[1]
                                           console.log(img.src)

                                         }
                                         }
                                         else if (grantdata.origin == "Liteverse"){
                                           img.src = IPFS + grantdata.image.split('ipfs://')[1]
                                           video.src = IPFS + grantdata.image.split('ipfs://')[1]
                                         }
//if the image doesnt render- dont show it - good for audio content
                                        img.onerror = function(){this.style.display='none';}


                             document.getElementById('modalBody').append(card)
                         })

                        })
          }

//edits collection card
          header.innerHTML = "<hr>" + collection.name +"<hr> #"+collection.propertyid
          let url = API + 'omni-get-nft&property=' + collection.propertyid

          fetch(url).then((resp) => resp.json()).then(function(data){
            var ordinals= false
//gets first token image of collection
            grantdata= detectSource(data[0].grantdata)

            if(grantdata.origin == "LiteWorlds"){
              if(grantdata.content){

              image.src = ORDINAL + grantdata.content
              videoUser.src = ORDINAL + grantdata.content

              ordinals=true
              if(ordinals){
                header.innerHTML = "<hr>" + collection.name +"<hr> #"+collection.propertyid +  " <br><span style='font-size:10px'>| Ordinal Reference</span>"
                card.style.boxShadow= "0px 0px 10px yellow"
              }
            }
            else if(grantdata.source=="ipfs"){
              console.log("is epic ipfs")
              img.src = IPFS + grantdata.content
              video.src = IPFS + grantdata.content

            }
            else{
              image.src = IPFS + grantdata.image.split('ipfs://')[1]
              videoUser.src = IPFS + grantdata.image.split('ipfs://')[1]

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
//adds collection card to the display
          artCardContainer.append(card)
          return {
            name: collection.name, propertyid: collection.propertyid, element: card
          }
        }
        })

      }
      getOmniCollectionListCounter++
}

function getOmniTrader(){

  if(getOmniCollectionListCounter==0){
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
        trader_collections = traderCollections.reverse().map(trader_collection => {
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
              if(grantdata.source=="ordinal"){
              imageTrader.src = ORDINAL + grantdata.content
              videoTrader.src = ORDINAL + grantdata.content
              cardTrader.style.boxShadow= "0px 0px 10px yellow"
              bodyTrader.innerHTML= " <br><span style='font-size:10px'>| Ordinal Reference</span>"
            }
            else if(grantdata.source=="ipfs"){
              console.log("is epic ipfs")
              imageTrader.src = IPFS + grantdata.content
              videoTrader.src = IPFS + grantdata.content
                bodyTrader.innerHTML= ""

            }
            else{
              imageTrader.src = IPFS + grantdata.image.split('ipfs://')[1]
              videoTrader.src =  IPFS + grantdata.image.split('ipfs://')[1]
              console.log(imageTrader.src)
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
          imageTrader.style.maxHeight = "200px"
          artCardTraderContainer.append(cardTrader)
          cardTrader.classList.add("bg-light")

          headerTrader.classList.add("bg-light")

          cardTrader.onclick = function() {
            console.log("From Trader Click")
//DESIGN TRADER COLLECTION MODAL TO DISPLAY EACH INDIVIDUAL token


            document.getElementById('modalTitle').innerHTML = "Art Pieces from "+trader_collection.name +"<br> <h6>Collection: "+trader_collection.propertyid +"</h6>"
            document.getElementById('modalBody').textContent = ''
            getTraderCollectionTokens(trader_collection.propertyid).reverse().map(token => {
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


            if(!omni.address){
            button.style.display="none"

          }
            else{

                   button.textContent = "Buy"
                   console.log("HOLDER:"+ holderData.destination)
                   button.onclick = function(){
              let url = API + 'omni-take-trader&authkey=' + AuthKey + '&property=' + trader_collection.propertyid + '&token=' + token
              fetch(url).then((resp) => resp.json()).then(function(data){
                  alert(data.answer)
                  console.log(url)
                  console.log("Clicked Buy")

              })
          }
        }
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

                   card.classList.add("card")
                   img.classList.add("img")
                   header.classList.add("header")
                   body.classList.add("body")
                   header.innerHTML =  grantdata.name + '<hr>'
                   body.innerHTML = "Token Number: "+ tokenData[0].index  + '<br> <div class="display-5">' + JSON.parse(tokenData[0].holderdata).desire + " Ł</div><br>"
                                    + ' Seller: ' + JSON.parse(tokenData[0].holderdata).destination

                   grantdata = detectSource(tokenData[0].grantdata)
                   console.log("This is detectSource")
                               if(grantdata.origin == "LiteWorlds"){
                                 if(grantdata.structure == "epic"){
                                 img.src = ORDINAL + grantdata.content
                                 video.src = ORDINAL + grantdata.content
                                 header.innerHTML =  grantdata.name + '<span style="font-size:10px"> | Ordinal Reference </span><hr>'
                                 console.log("is epic")
                                 console.log()
                                  if(grantdata.source=="ipfs"){
                                    console.log("is epic ipfs")
                                    img.src = IPFS + grantdata.content
                                    video.src = IPFS + grantdata.content
                                    header.innerHTML =  grantdata.name
                                  }
                               }
                               else if(grantdata.structure == "artefactual"|| grantdata.structure == "artefactual"){
                                 fetch(ORDINALJSON + grantdata.json).then((resp) => resp.text()).then(function(html){
                                                     let parser = new DOMParser()
                                                     let doc = parser.parseFromString(html, 'text/html')
                                                     console.log(doc)

                                                     let ordData = JSON.parse(doc.children[0].lastChild.children[0].innerHTML)
                                                     console.log(ordData.data
                                                     )
                                                     for (let a = 0; a < ordData.content.length; a++) {
                                                         const element = ordData.content[a]
                                                         if (ordData.type[a] == 'image') {

                                                             img.src = ORDINAL + element
                                                             header.innerHTML =  ordData.data.name + '<span style="font-size:10px"> | Ordinal Artifactual </span><hr>'

                                                         }
                                                     }
                                                   })
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
async function login() {
    let user = document.getElementById('login-username').value
    let pass = await sha512(document.getElementById('login-password').value)

    let url = API + 'user-login&user=' + user + '&pass=' + pass
    fetch(url).then((resp) => resp.json()).then(function(data){
        AuthKey = data.AuthKey

        url = API + 'user-get&authkey=' + AuthKey
        let interval = setInterval(function(){
            fetch(url).then((resp) => resp.json()).then(function(data){
                if (data.bool) {
                    clearInterval(interval)
                    getUser()
                    document.getElementById("nav-art-tab").disabled=false
                    document.getElementById("nav-wallet-tab").disabled=false
                }
            })
        },5000)


        alert(data.answer)

    })
}
function showId(id){
  document.getElementById(id).style.display="block"
}
async function sha512(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder('utf-8').encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}
function hideId(id){

  document.getElementById(id).style.display="none"
}
