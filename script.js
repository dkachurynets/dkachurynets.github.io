const textareaJSON = document.getElementById('textarea-json');
const compactJSON = document.getElementById('compact-json');
const responseJSON = document.getElementById('response-json');
const getDataBtn = document.getElementById('getDataBtn');
const tcHash = document.getElementById('tc-hash');
const simulatePending = document.getElementById('simulate-pending');
const siteUrl = "http://localhost:63342/UbirchPOC/verify.html?";
/*const siteUrl = "http://34.252.244.48:8080/verify.html?"*/

function displaySuccessSectionTestCenter(data, response) {
    textareaJSON.textContent = JSON.stringify(data, undefined, 4);
    compactJSON.value = JSON.stringify(data);
/*    responseJSON.textContent = JSON.stringify(response, undefined, 4);*/
    document.querySelector('.success-section').classList.remove("hide");
    document.querySelector('.register-wrap').classList.add("hide");
    tcHash.value = response.hash.toString();

    console.log('Success:', response);
    transferDataToVerifyPage(data);
}

function transferDataToVerifyPage(data) {
    const userDetailObjSorted = sortObject(data);
    const serializedObjCompact = JSON.stringify(userDetailObjSorted);
    const hash = generateHash(serializedObjCompact);

    data.hashTC = hash;
    console.log(data, 'data');
    const urlParameters = Object.entries(data).map(e => e.join('=')).join('&');
    const link = siteUrl + urlParameters;
    console.log(link, 'link');
    new QrCodeWithLogo({
        canvas: document.getElementById("canvas"),
        content: link,
        nodeQrCodeOptions: {
            color: 'red'
        },
        width: 380,
        download: true,
        image: document.getElementById("testqr"),
        logo: {
            src: "images/0.jpg"
        }
    }).toImage();

    makeCode(link);
    console.log(link, 'link');
    $('.verify-page-link').attr("href", link);
}

if (getDataBtn) {
    getDataBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const data = {
            firstName: document.querySelector('[name="first-name"]').value,
            lastName: document.querySelector('[name="last-name"]').value,
            pseudo: document.querySelector('[name="pseudo"]').value,
            socialNumber: document.querySelector('[name="social-number"]').value,
            date: document.querySelector('[name="date"]').value,
            probeId: document.querySelector('[name="probe-id"]').value,
        };
        fetch('http://34.252.244.48:8081/53cdb13b-4449-42be-b034-098bfb397519', {
            method: 'POST',
            headers: {
                'X-Auth-Token': '00c13ace-9b6a-4735-8688-1a34728bfe4f',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(response => {
                displaySuccessSectionTestCenter(data, response)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

if (simulatePending) {
    simulatePending.addEventListener('click', function () {
        $('.loader').removeClass('hide');
        const element = $(this);
        setTimeout(function () {
            $('#pending-row').hide();
            $('#positive-row').removeClass('hide');
            $('.loader').hide();
            const currentRow = element.closest('tr');
            const currentDate = getCurrentDate();
            $(currentRow.find('.result-date')).text(currentDate);
            $(currentRow.find('.ubirch-detail')).removeClass('hide');
        }, 1000);
    });
}

$(".verify-hash-link").click(function() {
    fetch('https://verify.prod.ubirch.com/api/upp/verify/anchor', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'accept': 'application/json',
        },
        body: 'CK8/zZNKPMzi13TnCVZbh5X+czPkBaoMayac963mrPI='
    })
        .then(response => response)
        .then(response => {

        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

$('.ubirch-detail').click(function () {
    const userDetailObj = {};
    const currentRow = $(this).closest('tr');
    const userName = $(currentRow.find('.user-name')).text();
    userDetailObj.firstName = userName.split(" ")[0];
    userDetailObj.lastName = userName.split(" ")[1];
    userDetailObj.pseudo = $(currentRow.find(".pseudo")).text();
    userDetailObj.socialNumber = $(currentRow.find('.social-number')).text();
    userDetailObj.registrationDate = $(currentRow.find('.registration-date')).text();
    userDetailObj.resultDate = $(currentRow.find('.result-date')).text();
    userDetailObj.probeId = $(currentRow.find('.probe-Id')).text();
    userDetailObj.result = $(currentRow.find('.result')).text().replace(/\s+/g, ' ').trim();
    userDetailObj.hastTc = 'fladjslfkjlj34ldfjsl';
    displayJSONData(userDetailObj);
    $('.report-detail').removeClass('hide');
    $('html, body').animate({
        scrollTop: $("#report").offset().top
    }, 500);

});


if($('.management-ubirch-detail')) {
    $('.management-ubirch-detail').click(function () {
       $('.management-report').removeClass('hide');
    });
}

if($('.management-btn')) {
    $('.management-btn').click(function () {
        $('.management-loader').removeClass('hide');
        setTimeout(function () {
            $('.management-loader').addClass('hide');
            $('.management-success-transfer').removeClass('hide');
        }, 1000);
    });
}



function displayJSONData(userDetailObj) {
    fetch('http://34.252.244.48:8081/53cdb13b-4449-42be-b034-098bfb397519', {
        method: 'POST',
        headers: {
            'X-Auth-Token': '00c13ace-9b6a-4735-8688-1a34728bfe4f',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetailObj),
    })
        .then(response => response.json())
        .then(response => {
            const userDetailObjSorted = sortObject(userDetailObj);
            const serializedObj = JSON.stringify(userDetailObjSorted, undefined, 4);
            const serializedObjCompact = JSON.stringify(userDetailObjSorted);


            $("#request-report-json").val(serializedObj);
            $("#request-report-json-compact").val(serializedObjCompact);;
            $("#laboratory-hash").val(response.hash);

            const hash = generateHash(serializedObjCompact);
            $("#client-hash").val(hash);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

$("#request-report-json").keyup(function () {
    const serializedObjCompact = JSON.stringify(JSON.parse($(this).val()));
    const hash = generateHash(serializedObjCompact);
    $("#client-hash").val(hash);
});

$(".verify-hash-link").click(function () {
    $(".verify-hash-message").removeClass("hide");
});


function sortObject(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((acc, key) => ({
            ...acc, [key]: obj[key]
        }), {});
}

function generateHash(string) {
    const convertedSHA256 = SHA256(string);
    return hexToBase64(convertedSHA256);
}
// current Date

function getCurrentDate() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}

// 2018-8-3 11:12:40


function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

$('.hash-chain')
    .popup({
        popup: '.special.popup',
        hoverable  : true,
        position   : 'top left',
        lastResort: 'right center'
    })
;
