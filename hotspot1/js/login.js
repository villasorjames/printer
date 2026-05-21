const modal = document.querySelectorAll('.modal');

function openModal(index) {
    if (index === 0) {
        initInsertCoin();
    } else if (index === 2) {
        fetchRatesFromServer();
        modalShow(modal[index]);
    } else if (index === 5) {
        modalShow(modal[index]);
        var trialLink = document.getElementById('trial-link');
        var timer = 10;
        setInterval(function () {
            timer--;
            document.getElementById('trial-timer').textContent = timer;
            if (timer <= 0) {
                trialLink.click();
            }
        }, 1000);
    } else {
        modalShow(modal[index]);
    }
}

function closeModal(index) {
    if (index === 0) {
        cancelTopUp();
    }
    modalHide(modal[index]);
}

var _xhrSettings = new XMLHttpRequest();
_xhrSettings.open('GET', '/setting.json', true);
_xhrSettings.onreadystatechange = function () {
    if (_xhrSettings.readyState === 4 && _xhrSettings.status === 200) {
        try {
            var data = JSON.parse(_xhrSettings.responseText);
            if (data.setting && data.setting.hotspot_name) {
                document.getElementById("hotspotName").textContent = data.setting.hotspot_name;
            }
        } catch (e) {}
    }
};
_xhrSettings.send();

if (potalError != '') {
    showNotification(potalError);
    closeNotification(3000);
}

var isPaused = localStorage.getItem('isPause');
var resumeVoucher = "";

function doResume() {
    if (resumeVoucher) {
        document.sendin.username.value = resumeVoucher;
    }
    doLogin();
    return false;
}

function fetchUserTextFile(skipAutoLogin) {
    var mac = userMac.replace(/:/g, '');
    var url = '/data/' + mac + '.txt?q=' + new Date().getTime();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var parts = xhr.responseText.split('#');
                var voucher = parts[0];
                var expiryVal = parts[1];
                var el = document.getElementById('expiry');
                if (el && expiryVal) el.textContent = formatExpiry(expiryVal);

                if (isPaused === null) {
                    resumeVoucher = voucher;
                    if (!skipAutoLogin) {
                        showNotification('Syncing mac address');
                        document.sendin.username.value = voucher;
                        setTimeout(function () {
                            doLogin();
                        }, 3000);
                    }
                } else {
                    sessionTimeConvert(localStorage.getItem('remainingTime'));
                    resumeVoucher = voucher;
                    var wrapper = document.getElementById('resumeWrapper');
                    if (wrapper) wrapper.style.display = 'block';
                    var extendBtn = document.getElementById('insert-coin-button');
                    if (extendBtn) {
                        extendBtn.setAttribute('user-type', 'extend');
                        var label = extendBtn.querySelector('span:last-child');
                        if (label) label.textContent = 'Extend';
                    }
                    setSessionState('paused');
                }
            } else {
                fetchValidity(0);
            }
        }
    };
    xhr.send();
}

if (potalError != 'invalid username or password') {
    fetchUserTextFile(false);
} else {
    fetchUserTextFile(true);
}

setTimeout(function () { fetchValidity(0); }, 2000);
