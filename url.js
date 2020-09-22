/* random urls */
Math.floor(Math.random());
let root_path = 'file:///C:/Users/moond/PycharmProjects/Restaurant-COVID19-Contact-Tracing/'
let url1 = new URL('/index.html', root_path)





/* QR code generator */
var qrcode = new QRCode("qrcode");

function makeQR () {
   var locText = document.getElementById("qrData");
   if (!locText.value) {
      alert("Please enter a location");
      locText.focus();
      return;
   }
   qrcode.makeCode(locText.value);
}
