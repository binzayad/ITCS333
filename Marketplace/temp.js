let doc=document;
async function sortedJason(){
    let jsondata;    
    const response = await fetch("https://6807d811942707d722dc9aea.mockapi.io/nn/items");
    jsondata = await response.json();
       if(doc.getElementById("sortByDate").selected){   jasondata.sort(byDate)}
       else if(doc.getElementById("sortByAlphabet").selected){   jasondata.sort(byAlphabet)}
       else if(doc.getElementById("sortByPrice").selected){  jasondata.sort(byPrice)}
       else{jasondata.sort(byAlphabet)}
       console.log(jsondata);
       return jsondata;
    
}