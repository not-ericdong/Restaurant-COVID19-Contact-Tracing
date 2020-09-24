/* creates the query strings */
function makeURL (){
   var urlName = document.getElementById("qrData");
   const url_path = new URL('https://not-ericdong.github.io/Restaurant-COVID19-Contact-Tracing/customer.html');
   url_path.searchParams.set("location", urlName.value);
   return url_path.toString()
    
}

function getURL (){
   var theUrl = new Url(window.location.href); //return the current url
   return theUrl
   // return theUrl.searchParams.get("location"); gets value of location parameter
}



/* QR code generator */
var qrcode = new QRCode("qrcode");

function makeQR () {
   var locText = makeURL();
   console.log(locText)
   if (!locText) {
      alert("Please enter a location");
      locText.focus();
      return;
   }
   qrcode.makeCode(locText);
}

//store url in a new db 
//read db if url in db then redirect url to base url
//but i still cant get the restraunt name
// window.location.href="file:///C:/Users/moond/PycharmProjects/Restaurant-COVID19-Contact-Tracing/customer.html"; 