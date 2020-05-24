var qrcode = new QRCode("qrcode");

function makeCode (string) {
    console.log(string, 'str');
/*
    var elText = document.getElementById("compact-json");
    if ()
    if (!elText.value) {
        elText.focus();
        return;
    }
*/

    qrcode.makeCode(string);
}

/*
makeCode();

$("#text").on("blur", function () {
    makeCode();
}).
on("keydown", function (e) {
    if (e.keyCode == 13) {
        makeCode();
    }
});

*/
