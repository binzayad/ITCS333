fetch("https://6807d811942707d722dc9aea.mockapi.io/nn/items")
.then(r => r.json())
.then((data) => {
    let doc=document.getElementById("items");
    let output="";
    data.forEach( c => {
        output+=`<div class="col "> <div class="card "> 
              <img src="${c.img}"class="card-img-top img-responsive" alt="...">
              <div class="card-body ">
                <h5 class="card-title text-center">${c.name}</h5>
                <p class="card-text text start">${c.des}</p>
                <div class="card-footer text-center">
                    <small class="text-decoration-none text-success h3 text-right">${c.price}$</small>
                    <a href="seller/seller.html?id=${c.id}" class="btn btn-primary text-end ">more Details</a>
                </div>
              </div>
            </div>
          </div>`; 
    });
    doc.innerHTML=output;

    
}).catch((err) => {console.error(err);
    
});