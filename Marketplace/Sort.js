let doc=document;
async function sortedJason(){
    let jsondata;    
    const response = await fetch("https://6807d811942707d722dc9aea.mockapi.io/nn/items");
    jsondata = await response.json();
    console.log("ss");
       return jsondata;
    
}
sortedJason().then((data) => {
  if(doc.getElementById("sortByDate").selected==true){   data.sort(byDate)}
       else if(doc.getElementById("sortByPrice").selected==true){ console.log("ss"); data.sort(byPrice)}
       else if(doc.getElementById("sortByName").selected==true){  data.sort(byAlphabet)}
       else{data.sort(byAlphabet)}
    let doc1=doc.getElementById("items");
    let output="";
    let maxItems=5;
    let pageNumber=1;
    let i=1;
    data.forEach( c => { if(maxItems*pageNumber<=i && maxItems*(pageNumber-1)>i){
      i++;
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
    </div>`; }});
    doc1.innerHTML=output;
});
function byDate(a,b){
    if(Date.parse(a.data)< Date.parse(b.data)){
      return -1;
}else if(Date.parse(a.data) > Date.parse(a.data)){
      return 1;
    }else{
      return byAlphabet(a,b);
    }
}

function byAlphabet(a,b){
    return a.name.localeCompare(b.name);
}
function byPrice(a,b){
  console.log("ss");
    return a.price - b.price;
    
    
}