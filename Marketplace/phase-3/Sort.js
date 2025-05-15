let doc=document;
async function sortedJason(){
    let jsondata;    
    const response = await fetch("https://6807d811942707d722dc9aea.mockapi.io/nn/items");
    jsondata = await response.json();
    
   return jsondata;
    
}
function showMessage(element, message, type) {
  element.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}
function populateItems(){
  const loading = doc.getElementById("loading-wrapper");
  const itemsContainer = doc.getElementById("items");



 // Show the loading indicator
 loading.style.display = "flex";
 loading.style.visibility = "visible";

sortedJason().then((data) => {
  if(doc.getElementById("sortByDate").selected==true){   data.sort(byDate)}
       else if(doc.getElementById("sortByPrice").selected==true){  data.sort(byPrice)}
       else if(doc.getElementById("sortByName").selected==true){   data.sort(byAlphabet)}
       else{data.sort(byAlphabet)}
    
    
    let output="";
    i=1;
    let maxItems=15;
    maxPage= Math.ceil(data.length/maxItems);
    urlParameters= new URLSearchParams(window.location.search);

    //validating the page number
    pageNumber=parseInt(urlParameters.get("page"));
    if(pageNumber==null || pageNumber==undefined || pageNumber<=0 || pageNumber>maxPage || isNaN(pageNumber)){
      pageNumber=1;
    }
 

    //start crating pagination
    pagination=doc.getElementById("pagination");

    pagination.innerHTML=`<li class="page-item `+(pageNumber==1?"disabled":"")+` "><a class="page-link" href="?page=${pageNumber-1}">Previous</a></li>`;
    
    let initialPage=1;
    let lastPage=maxPage;
    if (pageNumber-4>0){
      initialPage=pageNumber-2;
      pagination.innerHTML=`<li class="page-item `+(pageNumber==1?"disabled":"")+` "><a class="page-link" href="?page=${pageNumber-1}">Previous</a></li>`;
      pagination.innerHTML+=`<li class="page-item "><a class="page-link" href="?page=${1}">1</a></li>`;
      pagination.innerHTML+=`<li class="page-item disabled "><a class="page-link" href="?page=${1}">...</a></li>`;
    }else{
      pagination.innerHTML=`<li class="page-item `+(pageNumber==1?"disabled":"")+` "><a class="page-link" href="?page=${pageNumber-1}">Previous</a></li>`;

    }
    if (pageNumber+3<maxPage){
      lastPage=pageNumber+2;
    }

    for(let j=initialPage;j<=lastPage;j++){
      pagination.innerHTML+=`<li class="page-item `+(j==pageNumber?"active":"" )+`"><a class="page-link" href="?page=${j}">${j}</a></li>`;
    }
    if (pageNumber+3<maxPage){
      pagination.innerHTML+=`<li class="page-item disabled "><a class="page-link" href="?page=${1}">...</a></li>`;
      pagination.innerHTML+=`<li class="page-item "><a class="page-link" href="?page=${maxPage}">${maxPage}</a></li>`;
    }
    
    pagination.innerHTML+=`<li class="page-item `+(pageNumber==maxPage?"disabled":"")+`"><a class="page-link" href="?page=${pageNumber+1}">Next</a></li>`;
    

  //rendering the items
    data.forEach( c => {if(((maxItems*(pageNumber-1))<i && maxItems*pageNumber)>=i ){
      i++;
      output+=`<div class="col "> <div class="card h-100 d-flex flex-column"> 
        <img src="${c.img}"class="card-img-top img-responsive" alt="...">
        <div class="card-body ">
          <h5 class="card-title text-center ">${c.name}</h5>
          <p class="card-text text start">${c.briefDescription}</p>
        </div>
        <div class="card-footer text-center mt-auto">
              <small class="text-decoration-none text-success h3 text-right">${c.price}$</small>
              <a href="seller/seller.html?id=${c.id}" class="btn btn-primary text-end ">more Details</a>
          </div>
      </div>
    </div>`; }else{i++;}
    });
    // Hide the loading indicator and show the items
    itemsContainer.style.display = "flex";
    itemsContainer.innerHTML = output;
    loading.style.visibility = "hidden";

    
    
});
}
document.addEventListener("DOMContentLoaded", function () {
populateItems();
doc.getElementById("sort").addEventListener("change",function(){
  populateItems();}
 );
});

function byDate(a,b){
  return Date.parse(a.date)- Date.parse(b.date)

}

function byAlphabet(a,b){
    return a.name.localeCompare(b.name);
}
function byPrice(a,b){

    return a.price - b.price;
    
    
}


  
