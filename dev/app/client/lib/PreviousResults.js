//We could add stuff to this constructor
//But now we will leave it as blank
var PreviousResults = function(){
  
}

// Save the 1st item within the localstorage
PreviousResults.prototype.addSearchTerms = function(search, result){
  localStorage.setItem(search , JSON.stringify(result));
}

//Loop through the localstroage to see if the search term exists 
PreviousResults.prototype.checkStorage = function(item){
  var i;
  for(var key in localStorage){
    if(item.indexOf(key) > -1){
      return localStorage[key];
    }
  }
  return undefined;
}


module.exports = PreviousResults;