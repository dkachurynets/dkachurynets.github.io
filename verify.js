const userDetail = {};
const search = location.search.substring(1);
const parsedString = parseQueryString(search);
function parseQueryString(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}
$("input[name=first-name]").val(parsedString.firstName);
$("input[name=last-name]").val(parsedString.lastName);
$("input[name=social-number]").val(parsedString.socialNumber);

userDetail.firstName = parsedString.firstName;
userDetail.lastName = parsedString.lastName;
userDetail.pseudo = parsedString.pseudo;
userDetail.socialNumber = parsedString.socialNumber;
userDetail.date = parsedString.date;
userDetail.probeId = parsedString.probeId;
userDetail.hash = parsedString.hashTC;
console.log(userDetail, 'userDetail');

$('#anchored-data-json').val(JSON.stringify(userDetail, undefined, 4));
$('#anchored-data-json-compact').val(JSON.stringify(userDetail));

$('.verify-btn').click(function () {
    event.preventDefault();
    $(".verify-loader").removeClass('hide');
    fetch('https://verify.demo.ubirch.com/api/upp/verify/anchor', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'text/plain',
        },
        body: userDetail.hash + '='
    })
        .then(response => response)
        .then(response => {
            $('.verify-message-success').removeClass('hide');
            $(".verify-loader").addClass('hide');
            console.log(response);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
