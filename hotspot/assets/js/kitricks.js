var voucher = getStorageValue("activeVoucher"),
    activeMac = getStorageValue("activeMac"),
    tempMac = getStorageValue("tempMac"),
    invalidUser = getStorageValue("invalidUser"),
    insertcoinbg = new Audio(),
    coinCount = new Audio(),
    totalCoinReceived = 0,
    extendTimeCriteria = 0,
    vcTopUp = false,
    voucherToConvert = "",
    macVoucher = "",
    vendorIpAddress = "",
    currency = "",
    apiStatus = "",
    ipAddress = "",
    mac = "",
    macNoColon = "",
    gcash_node_ip = "",
    gcash_portal_key = "",
    intervalID = null,
    timer = null,
    insertingCoin = false,
    loadingBtn = null,
    username_only = false,
    pause = false,
    trial = false,
    unlimited = false,
    randomtempMac = false,
    prefix = false,
    coinslotExit = false,
    pause_button = true,
    insert_coin_button = true,
    member_button = true,
    wifi_rates_button = true,
    member_logout_button = true,
    trial_logout_button = true,
    subscription = false,
    subscription_prefix = [],
    body = document.getElementById("body"),
    interfaceName = body.dataset.interface,
    icmodal = document.querySelector("[data-insert-coin]"),
    insertBtn = document.getElementById("insertBtn"),
    svmodal = document.querySelector("[data-select-vendo]"),
    pauseBtn = document.getElementById("pauseBtn"),
    dialog = document.querySelector("[data-dialog]"),
    trlmodal = document.querySelector("[data-trial]"),
    ssid = document.querySelector("[data-ssid]"),
    vendor = document.querySelector("[data-vendo]"),
    selectVendo = document.getElementById("selectVendo"),
    link = document.getElementById("link");

body.style.display = "none";
pauseBtn.style.pointerEvents = "none";

var ajaxsettings = new XMLHttpRequest();

function api() {
    var expEl = document.getElementById("exp"),
        statusEl = document.getElementById("status"),
        timerEl = document.getElementById("timer"),
        memberBtnEl = document.getElementById("memberBtn"),
        userIDEl = document.getElementById("userID"),
        xhr = new XMLHttpRequest();

    xhr.open("GET", "/api", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (4 == this.readyState) {
            if (200 == this.status) {
                var e = JSON.parse(this.responseText);
                mac = e.mac;
                macNoColon = replaceAll(mac, ":");
                ipAddress = e.ip;
                statusEl.textContent = e.status;
                apiStatus = e.status;
                if (voucher == null || voucher == "") voucher = macNoColon;

                if (insertingCoin) {
                    expEl.textContent = "Loading...";
                    setTimeout(function () { getValidity(1); }, 3000);
                } else {
                    getData(1);
                }

                if (e.status == "Disconnected") {
                    if ("yes" == e.trial) {
                        setTimeout(function () { openModal(trlmodal); }, 1000);
                    }
                    if (getCookie("timeLeft") !== null) {
                        timerEl.innerHTML = getCookie("timeLeft");
                        statusEl.textContent = "Time Paused";
                        pauseBtn.style.display = "block";
                    }
                    if (tempMac !== mac && tempMac !== null) randomtempMac = true;
                    pauseBtn.style.pointerEvents = "auto";
                    intervalManager(0);
                    if (member_button) memberBtnEl.style.display = "block";
                    body.style.display = "block";
                } else if ("Connected" == e.status) {
                    voucher = e.voucher;
                    if (e.loginBy !== "trial") setStorageValue("activeVoucher", voucher);
                    if (getCookie("timeLeft") !== null) eraseCookie("timeLeft");
                    removeStorageValue("invalidUser");
                    memberBtnEl.style.display = "none";
                    setStorageValue("activeMac", mac);
                    pause = false;
                    statusEl.textContent = "Connected";
                    if (activeMac == null || activeMac == null) setStorageValue("activeMac", mac);

                    if (pause_button) {
                        if (!prefix) {
                            pauseBtn.style.display = "block";
                            pauseBtn.style.pointerEvents = "auto";
                            pauseBtn.textContent = "Pause";
                        }
                    } else {
                        pauseBtn.style.display = "none";
                        pauseBtn.style.pointerEvents = "none";
                    }

                    if (subscription && (
                        0 === voucher.indexOf(subscription_prefix[0]) ||
                        0 === voucher.indexOf(subscription_prefix[1]) ||
                        0 === voucher.indexOf(subscription_prefix[2]) ||
                        (0 === voucher.indexOf(subscription_prefix[3]) && voucher.length < 12)
                    )) {
                        insertBtn.style.display = "none";
                        pauseBtn.style.display = "none";
                        prefix = true;
                        document.querySelector(".btn-group .input-group").style.display = "none";
                        timerEl.textContent = 'Subscription';
                    }

                    if (e.timeleft != null || prefix) {
                        if (e.loginBy == "trial" || voucher == "T-" + mac) {
                            intervalManager(true, animate, 1000);
                            trial = true;
                            insertBtn.style.display = "none";
                            document.querySelector(".btn-group .input-group").style.display = "none";
                            if (trial_logout_button) {
                                pauseBtn.style.display = "block";
                                pauseBtn.style.pointerEvents = "auto";
                                pauseBtn.textContent = "Logout";
                            } else {
                                pauseBtn.style.display = "none";
                            }
                        } else if (!prefix) {
                            intervalManager(true, animate, 1000);
                            timerEl.innerHTML = secondsToDhms(e.timeleft);
                        }
                    } else {
                        unlimited = true;
                        intervalManager(0);
                        timerEl.textContent = 'UNLIMITED';
                        insertBtn.style.display = "none";
                        if (member_logout_button) {
                            pauseBtn.style.display = "block";
                            pauseBtn.style.pointerEvents = "auto";
                            pauseBtn.textContent = "Logout";
                        } else {
                            pauseBtn.style.display = "none";
                        }
                        document.querySelector(".btn-group .input-group").style.display = "none";
                    }
                    body.style.display = "block";
                }

                if (voucher != macNoColon) {
                    if (voucher == "T-" + mac) {
                        userIDEl.innerHTML = "<td><p><b>User:</b></td><td><b>TRIAL</b></td>";
                    } else {
                        userIDEl.innerHTML = "<td><p><b>User:</b></td><td><span>" + voucher + "</span></td>";
                    }
                }
            } else {
                body.style.display = "block";
            }
        }
    };
}

function getValidity(o) {
    var expEl = document.getElementById("exp");
    if (5 < o) {
        expEl.textContent = "Not Available";
    } else {
        var mac_str = (activeMac == null || activeMac == null) ? macNoColon : replaceAll(activeMac, ":");
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/" + mac_str + ".txt", true);
        xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.send();
        xhr.onreadystatechange = function () {
            if (4 == this.readyState) {
                if (200 == this.status) {
                    var parts = this.responseText.split("#");
                    if (50 < this.responseText.length) {
                        expEl.textContent = "Loading...";
                        setTimeout(function () { getValidity(o + 1); }, 1000);
                    } else {
                        expEl.textContent = formatExpiry(parts[1]);
                    }
                } else {
                    expEl.textContent = "Not Available";
                }
            }
        };
    }
}

function getData(o) {
    var expEl = document.getElementById("exp");
    if (5 < o) {
        fallbackData();
    } else {
        var mac_str = (activeMac == null || activeMac == null) ? macNoColon : replaceAll(activeMac, ":");
        showBtnProgress(pauseBtn);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/data/" + mac_str + ".txt", true);
        xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.send();
        xhr.onreadystatechange = function () {
            if (4 == this.readyState) {
                if (200 == this.status) {
                    var text = this.responseText,
                        parts = text.split("#");
                    macVoucher = parts[0];
                    if (50 < text.length) {
                        expEl.textContent = "Loading...";
                        setTimeout(function () { getData(o + 1); }, 1000);
                        return;
                    }
                    expEl.textContent = formatExpiry(parts[1]);
                    if ("Disconnected" == apiStatus) {
                        pauseBtn.style.pointerEvents = "auto";
                        pause = true;
                        if (voucher == null) {
                            if (!(macVoucher == "null" && "" == macVoucher)) voucher = macVoucher;
                            pauseBtn.textContent = "Connect";
                        } else {
                            pauseBtn.textContent = "Resume";
                        }
                        if (invalidUser == null) getTimeleft();
                    } else if (!unlimited) {
                        pauseBtn.textContent = "Pause";
                    }
                    hideBtnProgress();
                } else {
                    fallbackData();
                    hideBtnProgress();
                }
            }
        };
    }
}

function fallbackData() {
    var expEl = document.getElementById("exp"),
        statusEl = document.getElementById("status");
    if (apiStatus !== "Connected") {
        if (invalidUser == null) getTimeleft();
        pauseBtn.style.pointerEvents = "auto";
        pause = true;
        if (statusEl.textContent == "Disconnected") {
            pauseBtn.textContent = "Connect";
        } else {
            pauseBtn.textContent = "Resume";
        }
    } else {
        expEl.textContent = "Not Available";
    }
}

function getTimeleft() {
    if (randomtempMac) {
        setTimeout(function () { doConnect(false, false, voucher); }, 300);
    } else if (getCookie("timeLeft") == null) {
        setTimeout(function () { doConnect(false, true, voucher); }, 300);
    }
}

function paused(delay) {
    var statusEl = document.getElementById("status");
    pauseBtn.style.pointerEvents = "none";
    timeleft = document.getElementById("timer");
    showBtnProgress(pauseBtn);
    setTimeout(function () {
        pauseBtn.style.pointerEvents = "auto";
        if (pause) {
            doConnect(false, false, voucher);
        } else {
            intervalManager(0);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/logout", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("erase-cookie=true");
            xhr.onreadystatechange = function () {
                if (4 == this.readyState && 200 == this.status) {
                    if (unlimited) {
                        removeStorageValue("activeMac");
                        removeStorageValue("tempMac");
                        removeStorageValue("activeVoucher");
                        location.reload();
                    } else if (trial) {
                        location.reload();
                    } else {
                        statusEl.textContent = "Time Paused";
                        pauseBtn.textContent = "Resume";
                        hideBtnProgress();
                        setCookie("timeLeft", timeleft.innerHTML, 30);
                    }
                }
            };
            pause = true;
        }
    }, delay);
}

function doConnect(isLogout, setInvalid, voucherVal, password) {
    var memberModal = document.querySelector("[data-member]"),
        statusEl = document.getElementById("status");
    if (isLogout) {
        closeModal(memberModal);
        openModal(dialog);
        dialog.querySelector(".progress-bar").style.display = "none";
        dialog.querySelector(".header").textContent = "Checking User...";
    } else {
        password = username_only ? "" : voucherVal;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/login", true);
    xhr.onreadystatechange = function () {
        if (4 == this.readyState && 200 == this.status) {
            if ("" != this.responseText.split("<script>")[0]) {
                if (isLogout) {
                    dialog.querySelector(".header").textContent = "Invalid Username or Password!";
                    setTimeout(function () { closeModal(dialog); }, 1500);
                } else {
                    if (getCookie("timeLeft") !== null) eraseCookie("timeLeft");
                    removeStorageValue("activeMac");
                    removeStorageValue("tempMac");
                    removeStorageValue("activeVoucher");
                    document.getElementById("timer").innerHTML = secondsToDhms(0);
                    statusEl.textContent = "Disconnected";
                    if (setInvalid) {
                        setStorageValue("invalidUser", "true");
                    } else {
                        dialog.querySelector(".progress-bar").style.display = "none";
                        openModal(dialog);
                        dialog.querySelector(".header").textContent = "Invalid Voucher!";
                        setTimeout(function () {
                            pauseBtn.textContent = "Connect";
                            closeModal(dialog);
                        }, 1500);
                    }
                }
            } else {
                if (isLogout) {
                    dialog.querySelector(".header").textContent = "Connected Successfully!";
                    setTimeout(function () { location.reload(); }, 1500);
                } else if (setInvalid) {
                    paused(300);
                }
                api();
            }
        }
    };
    xhr.send("username=" + voucherVal + "&password=" + password);
}

function forceLogin() {
    var dlg = document.querySelector("[data-dialog]");
    dlg.querySelector(".progress-bar").style.width = "100%";
    dlg.querySelector(".header").innerHTML = "Done";
    setTimeout(function () { closeModal(dlg); api(); }, 250);
}

function insertBtnManual(el) {
    var data = el.dataset,
        ssidEl = document.querySelector("[data-ssid]"),
        vendorEl = document.querySelector("[data-vendo]");
    closeModal(svmodal);
    insertBtn.style.pointerEvents = "none";
    showBtnProgress(insertBtn);
    vendorIpAddress = data.vendoIp;
    ssidEl.innerHTML = data.ssid;
    vendorEl.innerHTML = data.vendoName;
    vcTopUp = false;
    insertCoin(0);
    setStorageValue("vendoIp", data.vendoIp);
    setStorageValue("ssid", data.ssid);
    setStorageValue("vendoName", data.vendoName);
}

function insertCoin(retryCount) {
    document.querySelector("[data-ic-close]").textContent = "Please Insert Coin";
    document.querySelector("#totalTime").textContent = "--:--";
    removeStorageValue("invalidUser");
    var savedVoucher = getStorageValue("activeVoucher");
    extendTimeCriteria = (savedVoucher == null) ? 0 : 1;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + vendorIpAddress + "/topUp", true);
    xhr.timeout = 5000;
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (4 == this.readyState && 200 == this.status) {
            var res = JSON.parse(this.responseText);
            if (res.status == "insertcoin") {
                if (vcTopUp) {
                    dialog.querySelector(".progress-bar").style.display = "block";
                    dialog.querySelector(".progress-bar").style.width = "10%";
                    dialog.querySelector(".header").textContent = "Voucher checking, Please wait!";
                    convertextVoucher();
                    openModal(dialog);
                } else {
                    audioPlay(true);
                    coinslotExit = false;
                    icmodal.querySelector(".header").textContent = "Please Insert Coin";
                    insertBtn.style.pointerEvents = "auto";
                    insertBtn.textContent = "Insert Coin";
                    hideBtnProgress();
                    icmodal.querySelector(".progress-bar").style.width = "100%";
                    document.querySelector("[data-sv-close]").textContent = "Cancel";
                    if (timer == null) {
                        timer = window.setInterval(function () { checkCoin(); }, 1000);
                    }
                    openModal(icmodal);
                }
                voucher = res.voucher;
                insertingCoin = true;
            } else {
                notifyCoinSlotError(res.errorCode);
                timer = null;
                clearInterval(timer);
            }
        }
    };
    xhr.onerror = xhr.ontimeout = function () {
        if (retryCount < 5) {
            insertBtn.style.pointerEvents = "none";
            openModal(dialog);
            dialog.querySelector(".progress-bar").style.display = "none";
            dialog.querySelector(".header").textContent = "Retrying, Please Wait!";
            setTimeout(function () { insertCoin(retryCount + 1); }, 1000);
        } else {
            dialog.querySelector(".header").textContent = vendor.textContent + " is offline!";
            setTimeout(function () { closeModal(dialog); }, 1500);
            insertBtn.textContent = "Insert Coin";
            insertBtn.style.pointerEvents = "auto";
            hideBtnProgress();
        }
    };
    xhr.send("voucher=" + voucher + "&mac=" + mac + "&ipAddress=" + ipAddress + "&extendTime=" + extendTimeCriteria);
    totalCoinReceived = 0;
    return false;
}

function checkCoin() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + vendorIpAddress + "/checkCoin", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("voucher=" + voucher);
    xhr.onreadystatechange = function () {
        if (4 == this.readyState && 200 == this.status) {
            var res = JSON.parse(this.responseText);
            totalCoinReceived = parseInt(res.totalCoin);

            if (vcTopUp) {
                if ("true" == res.status) {
                    setStorageValue("activeVoucher", voucher);
                    if (intervalID !== null) {
                        intervalManager(0);
                        var xhr2 = new XMLHttpRequest();
                        xhr2.open("POST", "/logout", true);
                        xhr2.send("erase-cookie=false");
                    }
                } else if ("coin.not.inserted" == res.errorCode) {
                    donepaying();
                } else if (res.errorCode == "coinslot.busy") {
                    clearInterval(timer);
                    if (0 == totalCoinReceived) insertCoinhidden(true, "/getRates?date=");
                    else donepaying();
                } else {
                    clearInterval(timer);
                }
            } else {
                var totalTimeEl = document.querySelector("#totalTime"),
                    iccloseBtn = document.querySelector("[data-ic-close]"),
                    totalCoinEl = document.querySelector("#totalTime");

                if ("true" == res.status) {
                    iccloseBtn.style.display = "none";
                    setStorageValue("activeVoucher", voucher);
                    if (intervalID !== null) {
                        intervalManager(0);
                        var xhr3 = new XMLHttpRequest();
                        xhr3.open("POST", "/logout", true);
                        xhr3.send("erase-cookie=false");
                    }
                    document.querySelector("#totalCoin").innerHTML = currency + " " + res.totalCoin;
                    if (0 == res.timeAdded) totalCoinEl.innerHTML = "--:--";
                    else totalCoinEl.innerHTML = credits(parseInt(res.timeAdded));
                    if (0 == res.validity) totalTimeEl.innerHTML = "--:--";
                    else totalTimeEl.textContent = credits(parseInt(60 * res.validity));
                    coindropPlay();
                } else if (res.errorCode == "coin.is.reading") {
                    icmodal.querySelector(".header").textContent = "Reading coin, please wait";
                    iccloseBtn.textContent = "Wait";
                    iccloseBtn.style.pointerEvents = "none";
                } else if (res.errorCode == "coin.not.inserted") {
                    totalCoinReceived = parseInt(res.totalCoin);
                    iccloseBtn.style.pointerEvents = "auto";
                    if (!coinslotExit) icmodal.querySelector(".header").textContent = "Please Insert Coin";
                    var remainSecs = parseInt(parseInt(res.remainTime) / 1000);
                    var validityVal = parseFloat(res.waitTime);
                    var pct = parseInt(((1000 * remainSecs) / validityVal) * 100);
                    if (0 < totalCoinReceived) iccloseBtn.textContent = "Done Paying";
                    if (0 == remainSecs) {
                        if (0 < totalCoinReceived) donepaying();
                        else insertCoinhidden(true, "Coin slot expired");
                    } else {
                        document.querySelector("#totalCoin").innerHTML = currency + " " + res.totalCoin;
                        if (0 == res.timeAdded) totalCoinEl.innerHTML = "--:--";
                        else totalCoinEl.innerHTML = credits(parseInt(res.timeAdded));
                        if (0 == res.validity) totalTimeEl.innerHTML = "--:--";
                        else totalTimeEl.textContent = credits(parseInt(60 * res.validity));
                        icmodal.querySelector(".progress-bar").style.width = pct + "%";
                    }
                } else if (res.errorCode == "coinslot.busy") {
                    audioPlay(false);
                    clearInterval(timer);
                    if (0 == totalCoinReceived) insertCoinhidden(true, "Coinslot was cancelled");
                    else donepaying();
                } else {
                    clearInterval(timer);
                }
            }
        }
    };
}

function donepaying() {
    if (0 < totalCoinReceived) {
        if (!vcTopUp) { audioPlay(false); closeModal(icmodal); }
        clearInterval(timer);
        timer = null;
        openModal(dialog);
        dialog.querySelector(".progress-bar").style.width = "50%";
        dialog.querySelector(".header").textContent = "Processing, Please wait!";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://" + vendorIpAddress + "/useVoucher", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("voucher=" + voucher);
        xhr.onreadystatechange = function () {
            if (4 == this.readyState && 200 == this.status) {
                if (JSON.parse(this.responseText).status == "insertcoin") {
                    dialog.querySelector(".progress-bar").style.width = "75%";
                    dialog.querySelector(".header").textContent = "Connecting, Please wait!";
                    setTimeout(function () { forceLogin(); }, 250);
                } else {
                    insertCoinhidden(false);
                }
            }
        };
        xhr.onerror = function () {
            dialog.querySelector(".progress-bar").style.width = "75%";
            dialog.querySelector(".header").textContent = "Force login, Please wait!";
            setTimeout(function () { forceLogin(); }, 3000);
        };
    } else {
        insertCoinhidden(false);
    }
}

function convertextVoucher() {
    var usernameEl = document.getElementById("username");
    voucherToConvert = usernameEl.value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + vendorIpAddress + "/convertVoucher", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("voucher=" + voucher + "&convertVoucher=" + voucherToConvert);
    xhr.onreadystatechange = function () {
        if (4 == this.readyState && 200 == this.status) {
            if (JSON.parse(this.responseText).status == "false") {
                insertCoinhidden(true, "Invalid Voucher");
            } else if (timer == null) {
                timer = window.setInterval(function () {
                    dialog.querySelector(".progress-bar").style.width = "30%";
                    dialog.querySelector(".header").textContent = "Converting, Please wait!";
                    checkCoin();
                }, 1000);
            }
            document.getElementById("username").value = "";
        }
    };
    xhr.onerror = function () {
        document.getElementById("username").value = "";
    };
}

function insertCoinhidden(showDialog, message) {
    closeModal(icmodal);
    clearInterval(timer);
    timer = null;
    insertingCoin = false;
    if (!vcTopUp) audioPlay(false);
    if (showDialog) {
        dialog.querySelector(".progress-bar").style.display = "none";
        openModal(dialog);
        coinslotExit = true;
        dialog.querySelector(".header").textContent = message;
        setTimeout(function () { closeModal(dialog); }, 2000);
    }
    if (0 == totalCoinReceived) cancelTopUp();
}

function cancelTopUp() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + vendorIpAddress + "/cancelTopUp", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("voucher=" + voucher + "&mac=" + mac);
}

function getWifiRate(retryCount) {
    var ratesBtn = document.getElementById("ratesBtn"),
        ratesBodyEl = document.getElementById("ratesBody");
    document.getElementById("ratesBody").style.display = "block";
    ratesBtn.style.pointerEvents = "none";
    ratesBodyEl.style.display = "none";
    var wrmodal = document.querySelector("[data-rates]");
    showBtnProgress(ratesBtn);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://" + vendorIpAddress + "/getRates?date=" + Date.now(), true);
    xhr.timeout = 5000;
    xhr.setRequestHeader("Content-type", "text/plain");
    xhr.send();
    xhr.onreadystatechange = function () {
        if (4 == this.readyState && 200 == this.status) {
            var raw = this.responseText;
            ratesBtn.style.pointerEvents = "auto";
            ratesBodyEl.style.display = "block";
            ratesBtn.textContent = "Wifi Rates";
            hideBtnProgress();
            wrmodal.querySelector(".header").textContent = "Wifi Rates";
            openModal(wrmodal);
            var rows = raw.split("|"), html = "";
            for (var i in rows) {
                var cols = rows[i].split("#"),
                    timeSecs = 60 * parseInt(cols[2]),
                    validitySecs = 60 * parseInt(cols[3]);
                function formatRate(e) {
                    var days = Math.floor(e / 86400),
                        hours = Math.floor((e % 86400) / 3600),
                        mins = Math.floor((e % 3600) / 60),
                        dStr = days > 0 ? days + (days === 1 ? "Day " : " Days ") : "",
                        hStr = hours > 0 ? hours + "" : "0",
                        mStr = mins > 0 ? mins + "" : "0";
                    if (days > 0 && hours == 0 && mins == 0) return dStr;
                    if (mins > 0 && hours == 0 && days == 0) return mStr + "min";
                    if (hours > 0 && mins == 0 && days == 0) return hStr + "hour";
                    return dStr + hStr + "h:" + mStr + "m";
                }
                var timeLabel = formatRate(timeSecs),
                    validLabel = formatRate(validitySecs);
                if (validLabel == "0h:0m" || validitySecs == 0) validLabel = "No Pause Time";
                else if (timeSecs == validitySecs) validLabel = "Unlimited";
                html += "<tr>";
                html += "<td>" + currency + " " + cols[1] + ".00</td>";
                html += "<td>" + timeLabel + "</td>";
                html += "<td>" + validLabel + "</td>";
                html += "</tr>";
                document.getElementById("rates").innerHTML = html;
            }
        }
    };
    xhr.onerror = xhr.ontimeout = function () {
        if (retryCount < 4) {
            openModal(wrmodal);
            wrmodal.querySelector(".header").textContent = "Retrying, Please wait!";
            setTimeout(function () { getWifiRate(retryCount + 1); }, 1000);
        } else {
            wrmodal.querySelector(".header").textContent = "Wifi rates is not available at this moment.";
            setTimeout(function () { closeModal(wrmodal); }, 2000);
            ratesBtn.style.pointerEvents = "auto";
            ratesBtn.textContent = "Wifi Rates";
            hideBtnProgress();
        }
    };
}

ajaxsettings.open("GET", "settings.json", true);
ajaxsettings.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
ajaxsettings.setRequestHeader("Pragma", "no-cache");
ajaxsettings.send();
ajaxsettings.onreadystatechange = function () {
    if (4 == this.readyState && 200 == this.status) {
        var t = JSON.parse(this.responseText);
        pause_button = t.Settings.pause_button;
        insert_coin_button = t.Settings.insert_coin_button;
        member_button = t.Settings.member_button;
        wifi_rates_button = t.Settings.wifi_rates_button;
        member_logout_button = t.Settings.member_logout_button;
        trial_logout_button = t.Settings.trial_logout_button;
        if (!insert_coin_button) insertBtn.style.display = "none";
        if (!member_button) document.getElementById("memberBtn").style.display = "none";
        if (!wifi_rates_button) document.getElementById("ratesBtn").style.display = "none";
        currency = t.Settings.currency;
        username_only = t.Settings.username_only;
        link.href = t.Settings.footer_link;
        link.textContent = t.Settings.footer_text;
        if (t.Settings.gcash_payment) {
            gcash_node_ip = t.gcash_payment.gcash_node_ip;
            gcash_portal_key = t.gcash_payment.gcash_portal_key;
        } else {
            document.getElementById("gcashBtn").style.display = "none";
        }
        if (!t.Settings.voucher_input) {
            document.querySelector(".btn-group .input-group").style.display = "none";
        }
        if (t.Settings.subscription) {
            subscription = true;
            subscription_prefix = t.subscription_prefix;
        }

        if (0 == t.Settings.vendo_option) {
            ssid.innerHTML = t.VendoAddresses[0].ssid;
            vendor.textContent = t.VendoAddresses[0].vendoName;
            vendorIpAddress = t.VendoAddresses[0].vendoIp;
        } else if (1 == t.Settings.vendo_option) {
            autoSelect = false;
            if (getStorageValue("vendoIp") == null) {
                vendorIpAddress = t.VendoAddresses[0].vendoIp;
                ssid.innerHTML = t.VendoAddresses[0].ssid;
                vendor.innerHTML = t.VendoAddresses[0].vendoName;
                setStorageValue("vendoIp", t.VendoAddresses[0].vendoIp);
                setStorageValue("ssid", t.VendoAddresses[0].ssid);
                setStorageValue("vendoName", t.VendoAddresses[0].vendoName);
            } else {
                vendorIpAddress = getStorageValue("vendoIp");
                ssid.innerHTML = getStorageValue("ssid");
                vendor.innerHTML = getStorageValue("vendoName");
            }
            for (var n = 0; n < t.VendoAddresses.length; n++) {
                selectVendo.innerHTML = selectVendo.innerHTML +
                    '<button type="button" class="btn btn-primary" onclick="insertBtnManual(this)" data-vendo-ip="' +
                    t.VendoAddresses[n].vendoIp +
                    '" data-ssid="' + t.VendoAddresses[n].ssid +
                    '" data-vendo-name="' + t.VendoAddresses[n].vendoName +
                    '">' + t.VendoAddresses[n].vendoName + "</button>";
            }
        } else if (2 == t.Settings.vendo_option) {
            for (n = 0; n < t.VendoAddresses.length; n++) {
                if (t.VendoAddresses[n].interfaceName == interfaceName) {
                    ssid.innerHTML = t.VendoAddresses[n].ssid;
                    vendor.textContent = t.VendoAddresses[n].vendoName;
                    vendorIpAddress = t.VendoAddresses[n].vendoIp;
                }
            }
        }

        if (1 !== t.Settings.vendo_option) {
            autoSelect = true;
            removeStorageValue("vendoIp");
            removeStorageValue("ssid");
            removeStorageValue("vendoName");
        }
        api();
    }
};

ajaxsettings.onerror = function () {
    body.style.display = "block";
    alert("Note: Changes takes effects only after uploading to mikrotik");
};

insertBtn.onclick = function () {
    if (autoSelect) {
        insertBtn.style.display = "none";
        showBtnProgress(insertBtn);
        vcTopUp = false;
        insertCoin(0);
    } else {
        openModal(svmodal);
    }
};

document.querySelector("[data-ic-close]").onclick = function () { donepaying(); };
document.querySelector("[data-sv-close]").onclick = function () { closeModal(svmodal); };
document.querySelector("[data-wr-close]").onclick = function () { closeModal(document.querySelector("[data-rates]")); };
document.querySelector("[data-ml-close]").onclick = function () { closeModal(document.querySelector("[data-member]")); };
document.querySelector("[data-msg-close]").onclick = function () { closeModal(document.querySelector("[data-message]")); };

pauseBtn.onclick = function () { paused(1000); };

document.getElementById("ratesBtn").onclick = function () { getWifiRate(0); };

document.getElementById("gcashBtn").onclick = function () {
    if (typeof display_ewalletvoucher_modal === "function") {
        display_ewalletvoucher_modal(gcash_portal_key, gcash_node_ip, 'username', 'submit');
    } else {
        var msgModal = document.querySelector("[data-message]");
        msgModal.querySelector(".header").textContent = "GCash Unavailable";
        document.querySelector("#message").textContent = "Payment widget failed to load. Check internet connection.";
        openModal(msgModal);
    }
};

document.getElementById("memberBtn").onclick = function () {
    document.getElementById("mlBody").style.display = "block";
    document.querySelector("[data-member]").querySelector(".header").textContent = "Login to Connect";
    openModal(document.querySelector("[data-member]"));
};

document.querySelector("[data-login]").onclick = function () {
    doConnect(true, false, document.getElementById("Muser").value, document.getElementById("Mpass").value);
};

document.getElementById("submit").onclick = function () {
    var val = document.getElementById("username").value;
    if ("" == val) {
        openModal(dialog);
        dialog.querySelector(".progress-bar").style.display = "none";
        dialog.querySelector(".header").textContent = "Invalid Voucher!";
        setTimeout(function () { closeModal(dialog); }, 2000);
    } else {
        vcTopUp = true;
        insertCoin(0);
    }
};

document.querySelector("[data-claim]").onclick = function () {
    this.innerHTML = '<div class="loader"></div>';
    this.style.display = "none";
    setTimeout(function () {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/login", true);
        xhr.send("dst=&username=T-" + mac);
        location.reload();
    }, 1000);
};

document.querySelector("[data-trl-close]").onclick = function () { closeModal(trlmodal); };

var animate = function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (4 === this.readyState && 200 === this.status) {
            var e = JSON.parse(this.responseText);
            if (getStorageValue("ip") == null) {
                setStorageValue("ip", e.ip);
            } else if (getStorageValue("ip") !== e.ip) {
                removeStorageValue("ip");
                location.reload();
            }
            mac = e.mac;
            macNoColon = replaceAll(mac, ":");
            ipAddress = e.ip;
            document.getElementById("timer").innerHTML = secondsToDhms(e.timeleft);
            document.getElementById("status").textContent = e.status;
            if ("Disconnected" == e.status) intervalManager(0);
            if (0 == e.timeleft) {
                var xhr2 = new XMLHttpRequest();
                xhr2.open("POST", "/logout", true);
                xhr2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr2.send("erase-cookie=true");
                xhr2.onreadystatechange = function () {
                    if (4 == this.readyState && 200 == this.status) location.reload();
                };
                if (getCookie("timeLeft") !== null) eraseCookie("timeLeft");
                removeStorageValue("activeMac");
                removeStorageValue("tempMac");
                removeStorageValue("activeVoucher");
            }
            if (pause_button) {
                if (!prefix && trial && trial_logout_button) {
                    pauseBtn.style.display = "block";
                    pauseBtn.style.pointerEvents = "auto";
                }
            } else {
                pauseBtn.style.display = "none";
                pauseBtn.style.pointerEvents = "none";
            }
        }
    };
    xhr.onerror = function () {
        notifyCoinSlotError("offline");
    };
};

function intervalManager(start, callback, interval) {
    if (start) {
        intervalID = setInterval(callback, interval);
        pauseBtn.textContent = "Pause";
    } else {
        clearInterval(intervalID);
        intervalID = null;
    }
}

function audioPlay(isLoop) {
    if (4 === insertcoinbg.readyState) {
        if (isLoop) {
            insertcoinbg.play();
        } else {
            insertcoinbg.pause();
            insertcoinbg.currentTime = 0;
        }
    } else {
        insertcoinbg.src = "assets/sounds/insertcoinbg.mp3?date=" + Date.now();
        insertcoinbg.load();
        insertcoinbg.loop = true;
        insertcoinbg.play();
    }
}

function coindropPlay() {
    if (4 === coinCount.readyState) {
        coinCount.play();
    } else {
        coinCount.src = "assets/sounds/coinreceived.mp3?date=" + Date.now();
        coinCount.load();
        coinCount.play();
    }
}

function credits(e) {
    e = Number(e);
    var days = Math.floor(e / 86400),
        hours = Math.floor((e % 86400) / 3600),
        mins = Math.floor((e % 3600) / 60);
    return (days > 0 ? days + (days == 1 ? " Day " : " Days ") : "") +
        "" + (hours > 0 ? hours + "" : "0") + "h:" + (mins > 0 ? mins + "" : "0") + "m";
}

function pad2(n) { return n < 10 ? "0" + n : "" + n; }

function secondsToDhms(e) {
    e = Number(e);
    var d = Math.floor(e / 86400),
        h = Math.floor((e % 86400) / 3600),
        m = Math.floor((e % 3600) / 60),
        s = Math.floor(e % 60);
    var parts = [];
    if (d > 0) parts.push(d + "d");
    if (d > 0 || h > 0) parts.push(pad2(h) + "h");
    parts.push(pad2(m) + "m");
    parts.push(pad2(s) + "s");
    return parts.join(" : ");
}

function formatExpiry(val) {
    if (!val || val.trim() === "") return "Not Available";
    val = val.trim();
    var validityTime = null;
    if (val.length > 15) {
        validityTime = new Date(Date.parse(val));
    } else if (val.length > 8) {
        var dt = val.split(" ");
        var yr = new Date().getFullYear();
        validityTime = new Date(Date.parse(dt[0] + "/" + yr + " " + dt[1]));
    } else {
        var cur = new Date();
        validityTime = new Date(Date.parse((cur.getMonth() + 1) + "/" + cur.getDate() + "/" + cur.getFullYear() + " " + val));
    }
    if (!validityTime || isNaN(validityTime.getTime())) return val;
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[validityTime.getMonth()] + " " + validityTime.getDate() + " " +
           pad2(validityTime.getHours()) + ":" + pad2(validityTime.getMinutes());
}

function setStorageValue(key, val) {
    if (localStorage != null) localStorage.setItem(key, val);
}

function removeStorageValue(key) {
    if (localStorage != null) localStorage.removeItem(key);
}

function getStorageValue(key) {
    if (localStorage != null) return localStorage.getItem(key);
}

function setCookie(name, value, seconds) {
    var expires = "";
    if (seconds) {
        var d = new Date();
        d.setTime(d.getTime() + 1000 * seconds);
        expires = "; expires=" + d.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=",
        cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        while (" " == c.charAt(0)) c = c.substring(1, c.length);
        if (0 == c.indexOf(nameEQ)) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}

function replaceAll(str, search) {
    var result = str;
    while (0 < result.indexOf(search)) result = result.replace(search, "");
    return result;
}

function notifyCoinSlotError(errorCode) {
    var msgModal = document.querySelector("[data-message]");
    openModal(msgModal);
    if (errorCode == "coinslot.busy") {
        msgModal.querySelector(".header").textContent = "Error!";
        document.querySelector("#message").textContent = "Coin slot is busy, Please try again later";
    }
    if ("coin.slot.banned" == errorCode) {
        msgModal.querySelector(".header").textContent = "Warning!";
        document.querySelector("#message").textContent = "You have been banned from using coin slot, due to multiple request for insert coin, please try again later!";
    }
    if (errorCode == "no.internet.detected") {
        msgModal.querySelector(".header").textContent = "Error!";
        document.querySelector("#message").innerHTML = "No internet connection as of the moment, Please try again later";
    }
    if (errorCode == "offline") {
        msgModal.querySelector(".header").textContent = "Error!";
        document.querySelector("#message").innerHTML = 'Error connecting to "' + document.querySelector("[data-vendo]").textContent + '", Please check your wifi connection';
    } else {
        setTimeout(function () {
            insertBtn.style.pointerEvents = "auto";
            insertBtn.textContent = "Insert Coin";
            hideBtnProgress();
        }, 3000);
    }
}

function openModal(el) {
    if (el != null) {
        el.classList.add("show");
        body.classList.add("modal-active");
    }
}

function closeModal(el) {
    if (el != null) {
        el.classList.remove("show");
        body.classList.remove("modal-active");
    }
}

function showBtnProgress(btn) {
    loadingBtn = btn || null;
    if (loadingBtn) loadingBtn.classList.add("btn-loading");
}

function hideBtnProgress() {
    if (loadingBtn) {
        loadingBtn.classList.remove("btn-loading");
        loadingBtn = null;
    }
}
