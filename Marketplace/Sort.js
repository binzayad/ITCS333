let doc=document;
/*fetch("https://6807d811942707d722dc9aea.mockapi.io/nn/items")
.then(r => r.json())
.then((data) => {
    let doc1=doc.getElementById("items");
    let output="";
    data.forEach( c => {
        output+=`<div class="col "> <div class="card h-100 d-flex flex-column"> 
              <img src="${c.img}"class="card-img-top img-responsive" alt="...">
              <div class="card-body h-100 ">
                <h5 class="card-title text-center ">${c.name}</h5>
                <p class="card-text text start">${c.briefDescription}</p>
              </div>
              <div class="card-footer text-center mt-auto">
                    <small class="text-decoration-none text-success h3 text-right">${c.price}$</small>
                    <a href="seller/seller.html?id=${c.id}" class="btn btn-primary text-end ">more Details</a>
                </div>
            </div>
          </div>`; 
    });
    doc1.innerHTML=output;

    
}).catch((err) => {console.error(err);
    
});*/
 function loadItems(){
    let doc1=doc.getElementById("items");
    let output="";
    let jasondata= sortedJason();
    jasondata.forEach( c => {
      output+=`<div class="col "> <div class="card h-100 d-flex flex-column"> 
        <img src="${c.img}"class="card-img-top img-responsive" alt="...">
        <div class="card-body h-100 ">
          <h5 class="card-title text-center ">${c.name}</h5>
          <p class="card-text text start">${c.briefDescription}</p>
        </div>
        <div class="card-footer text-center mt-auto">
              <small class="text-decoration-none text-success h3 text-right">${c.price}$</small>
              <a href="seller/seller.html?id=${c.id}" class="btn btn-primary text-end ">more Details</a>
          </div>
      </div>
    </div>`; });
    doc1.innerHTML=output;


}
sortedJason().then((data) => {
    let doc1=doc.getElementById("items");
    let output="";
    let jasondata= sortedJason();
    jasondata.forEach( c => {
      output+=`<div class="col "> <div class="card h-100 d-flex flex-column"> 
        <img src="${c.img}"class="card-img-top img-responsive" alt="...">
        <div class="card-body h-100 ">
          <h5 class="card-title text-center ">${c.name}</h5>
          <p class="card-text text start">${c.briefDescription}</p>
        </div>
        <div class="card-footer text-center mt-auto">
              <small class="text-decoration-none text-success h3 text-right">${c.price}$</small>
              <a href="seller/seller.html?id=${c.id}" class="btn btn-primary text-end ">more Details</a>
          </div>
      </div>
    </div>`; });
    doc1.innerHTML=output;
});

async function sortedJason(){
    let jsondata;    
    const response = await fetch("https://6807d811942707d722dc9aea.mockapi.io/nn/items");
    jsondata = await response.json();
       if(doc.getElementById("sortByDate").selected){   jasondata.sort(byDate)}
       else if(doc.getElementById("sortByAlphabet").selected){   jasondata.sort(byAlphabet)}
       else if(doc.getElementById("sortByPrice").selected){  jasondata.sort(byPrice)}
       else{jasondata.sort(byAlphabet)}
       console.log(jsondata);
    
}

function byDate(a,b){
    if(Date.parse(a.data)< Date.parse(b.data)){
      return -1;
}else if(a.data.getTime() > b.data.getTime()){
      return 1;
    }else{
      return byAlphabet(a,b);
    }
}

function byAlphabet(a,b){
    return a.name.localeCompare(b.name);
}
function byPrice(a,b){
    return b.price - a.price;
    
}
