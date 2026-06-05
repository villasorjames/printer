/*
 * kitricks.js — deobfuscated / restored
 * ------------------------------------------------------------------
 * Original was packed with the obfuscator.io string-array technique
 * (rotating string table + _0x.... index decoder). The string table
 * has been decoded and inlined, control-flow restored, and globals
 * recovered to their original names.
 *
 * Note: function-LOCAL variables (e, t, n, o, a, i, r, s ...) were
 * stripped of their original names by the obfuscator and cannot be
 * recovered; the logic and all global identifiers are intact.
 * ------------------------------------------------------------------
 */

var voucher = getStorageValue("activeVoucher");
var activeMac = getStorageValue("activeMac");
var tempMac = getStorageValue("tempMac");
var invalidUser = getStorageValue("invalidUser");
var insertcoinbg = new Audio();
var coinCount = new Audio();
var dateNow = Date.now();
var totalCoinReceived = 0;
var extendTimeCriteria = 0;
var vcTopUp = false;
var voucherToConvert = "";
var macVoucher = "";
var vendorIpAddress = "";
var currency = "";
var apiStatus = "";
var ipAddress = "";
var mac = "";
var macNoColon = "";
var gcash_node_ip = "";
var portal_key = "";
var internet_status = "";
var intervalID = null;
var timer = null;
var insertingCoin = false;
var username_only = false;
var pause = false;
var trial = false;
var unlimited = false;
var randomtempMac = false;
var prefix = false;
var coinslotExit = false;
var cancelRetry = false;
var retryTimer = null;
var activeCoinXhr = null;
var pause_button = true;
var member_logout_button = true;
var trial_logout_button = true;
var insert_coin_button = true;
var wifi_rates_button = true;
var member_button = true;
var subscription = false;
var subscription_prefix = [];
var body = document.getElementById("body");
var interfaceName = body.dataset.interface;
var icmodal = document.querySelector("[data-insert-coin]");
var insertBtn = document.getElementById("insertBtn");
var svmodal = document.querySelector("[data-select-vendo]");
var pauseBtn = document.getElementById("pauseBtn");
var dialog = document.querySelector("[data-dialog]");
var trlmodal = document.querySelector("[data-trial]");
var ssid = document.querySelector("[data-ssid]");
var vendor = document.querySelector("[data-vendo]");
var selectVendo = document.getElementById("selectVendo");
var link = document.getElementById("link");
body.style.display = "none";
pauseBtn.style.pointerEvents = "none";
var ajaxsettings = new XMLHttpRequest();
function api() {
  var o = document.getElementById("exp");
  var a = document.getElementById("status");
  var i = document.getElementById("timer");
  var r = document.getElementById("memberBtn");
  var s = document.getElementById("userID");
  var e = new XMLHttpRequest();
  e.open("GET", cacheBust("/api"), true);
  e.send();
  e.onreadystatechange = function () {
    var e;
    if (this.readyState == 4) {
      if (this.status == 200) {
        e = JSON.parse(this.responseText);
        mac = e.mac;
        macNoColon = replaceAll(mac, ":");
        ipAddress = e.ip;
        a.textContent = e.status;
        apiStatus = e.status;
        if (voucher == null || voucher == "") {
          voucher = macNoColon;
        }
        if (insertingCoin) {
          o.textContent = "Loading...";
          setTimeout(function () {
            getValidity(1);
          }, 3000);
        } else {
          getData(1);
        }
        if (e.status == "Disconnected") {
          if (e.trial == "yes") {
            setTimeout(function () {
              openModal(trlmodal);
            }, 1000);
          }
          if (getCookie("timeLeft") !== null) {
            i.innerHTML = getCookie("timeLeft");
            a.textContent = "Time Paused";
            pauseBtn.style.display = "block";
          }
          if (tempMac !== mac && tempMac !== null) {
            randomtempMac = true;
          }
          pauseBtn.style.pointerEvents = "auto";
          intervalManager(0);
          setMemberLoginVisible(true);
          body.style.display = "block";
        } else if (e.status == "Connected") {
          voucher = e.voucher;
          if (e.loginBy !== "trial") {
            setStorageValue("activeVoucher", voucher);
          }
          if (getCookie("timeLeft") !== null) {
            eraseCookie("timeLeft");
          }
          removeStorageValue("invalidUser");
          setMemberLoginVisible(false);
          setStorageValue("tempMac", mac);
          pause = false;
          a.textContent = "Connected";
          if (activeMac == null || activeMac == null) {
            setStorageValue("activeMac", mac);
          }
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
          if (subscription && (voucher.indexOf(subscription_prefix[0]) === 0 || voucher.indexOf(subscription_prefix[1]) === 0 || voucher.indexOf(subscription_prefix[2]) === 0 || voucher.indexOf(subscription_prefix[3]) === 0 && voucher.length < 12)) {
            insertBtn.style.display = "none";
            pauseBtn.style.display = "none";
            prefix = true;
            document.querySelector(".btn-group .input-group").style.display = "none";
            i.innerHTML = "<div class=\"d-flex flex-fill align-content-stretch\"><div class=\"inner-wrapper\"><div>Subscription</div><div></div></div></div>";
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
              i.innerHTML = secondsToDhms(e.timeleft);
            }
          } else {
            unlimited = true;
            intervalManager(0);
            i.innerHTML = "<div class=\"d-flex flex-fill align-content-stretch\"><div class=\"inner-wrapper\"><div>UNLIMITED</div><div></div></div></div>";
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
            s.innerHTML = "<td><p><b>User:</b></td><td><b>TRIAL</b></td>";
          } else {
            s.innerHTML = "<td><p><b>User:</b></td><td><span>" + voucher + "</span></td>";
          }
        }
      } else {
        body.style.display = "block";
      }
    }
  };
}
function getInternetStatus(n, o, a, i) {
  var s = document.getElementById("ratesBtn");
  var c = document.querySelector("[data-message]");
  var e = new XMLHttpRequest();
  e.open("GET", cacheBust("internetstatus.txt"), true);
  e.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
  e.setRequestHeader("Pragma", "no-cache");
  e.onreadystatechange = function () {
    var e;
    if (this.readyState == 4 && this.status == 200) {
      if ((e = this.responseText) == "down") {
        openModal(c);
        c.querySelector(".header").textContent = a;
        document.querySelector("#message").textContent = i;
        if (!n) {
          internet_status = e;
          s.style.pointerEvents = "auto";
        }
        if (o && intervalID !== null) {
          paused(50);
        }
      }
    }
  };
  e.send();
}
function formatExpiry(s) {
  try {
    var p = (s || "").trim().split(" ");
    var d = p[0].split("-");
    var mo = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return mo[parseInt(d[1], 10) - 1] + " " + parseInt(d[2], 10) + (p[1] ? " " + p[1] : "");
  } catch (x) { return s; }
}
function getValidity(o) {
  var e;
  var t;
  var i = document.getElementById("exp");
  if (o > 5) {
    i.textContent = "Not Available";
  } else {
    (t = new XMLHttpRequest()).open("GET", cacheBust("/data/" + macNoColon + ".txt"), true);
    t.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
    t.setRequestHeader("Pragma", "no-cache");
    t.send();
    t.onreadystatechange = function () {
      var e;
      var t;
      if (this.readyState == 4) {
        if (this.status == 200) {
          t = (e = this.responseText).split("#");
          i.textContent = formatExpiry(t[1]);
          if (e.length > 50) {
            i.textContent = "Loading...";
            setTimeout(function () {
              getValidity(o + 1);
            }, 1000);
          }
        } else {
          i.textContent = "Not Available";
        }
      }
    };
  }
}
function getData(o) {
  var e;
  var t;
  var i = document.getElementById("exp");
  if (o > 5) {
    fallbackData();
  } else {
    e = activeMac == null || activeMac == null ? macNoColon : replaceAll(activeMac, ":");
    showButtonLoading(pauseBtn);
    (t = new XMLHttpRequest()).open("GET", cacheBust("/data/" + e + ".txt"), true);
    t.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
    t.setRequestHeader("Pragma", "no-cache");
    t.send();
    t.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var t = this.responseText;
          var n = t.split("#");
          macVoucher = n[0];
          i.textContent = n[1];
          if (t.length > 50) {
            i.textContent = "Loading...";
            setTimeout(function () {
              getData(o + 1);
            }, 1000);
            return;
          }
          if (apiStatus == "Disconnected") {
            pauseBtn.style.pointerEvents = "auto";
            pause = true;
            if (voucher == null) {
              if (macVoucher != "null" || macVoucher != "") {
                voucher = macVoucher;
              }
              pauseBtn.textContent = "Connect";
            } else {
              pauseBtn.textContent = "Resume";
            }
            if (invalidUser == null) {
              getTimeleft();
            }
          } else if (!unlimited) {
            pauseBtn.textContent = "Pause";
          }
        } else {
          fallbackData();
        }
      }
    };
  }
}
function fallbackData() {
  var t = document.getElementById("exp");
  var n = document.getElementById("status");
  if (apiStatus !== "Connected") {
    if (invalidUser == null) {
      getTimeleft();
    }
    pauseBtn.style.pointerEvents = "auto";
    pause = true;
    if (n.textContent == "Disconnected") {
      pauseBtn.textContent = "Connect";
    } else {
      pauseBtn.textContent = "Resume";
    }
  } else {
    t.textContent = "Not Available";
  }
}
function getTimeleft() {
  if (randomtempMac) {
    doConnect(false, false, voucher);
  } else if (getCookie("timeLeft") == null) {
    doConnect(false, true, voucher);
  }
}
function paused(e) {
  var o = document.getElementById("status");
  pauseBtn.style.pointerEvents = "none";
  timeleft = document.getElementById("timer");
  showButtonLoading(pauseBtn);
  setTimeout(function () {
    var e;
    pauseBtn.style.pointerEvents = "auto";
    if (pause) {
      doConnect(false, false, voucher);
    } else {
      intervalManager(0);
      (e = new XMLHttpRequest()).open("POST", "/logout", true);
      e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      e.send("erase-cookie=true");
      e.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if (unlimited) {
            removeStorageValue("activeMac");
            removeStorageValue("tempMac");
            removeStorageValue("activeVoucher");
            location.reload();
          } else if (trial) {
            location.reload();
          } else {
            o.textContent = "Time Paused";
            pauseBtn.textContent = "Resume";
            setCookie("timeLeft", timeleft.innerHTML, 30);
            setMemberLoginVisible(true);
          }
        }
      };
      pause = true;
    }
  }, e);
}
function doConnect(t, n, e, o) {
  var i = document.querySelector("[data-member]");
  var r = document.getElementById("status");
  if (t) {
    closeModal(i);
    openModal(dialog);
    dialog.querySelector(".progress-bar").style.display = "none";
    dialog.querySelector(".header").textContent = "Checking User...";
  } else {
    o = username_only ? "" : e;
  }
  i = new XMLHttpRequest();
  i.open("POST", "/login", true);
  i.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText.split("<script>")[0] != "") {
        if (t) {
          dialog.querySelector(".header").textContent = "Invalid Username or Password!";
          setTimeout(function () {
            closeModal(dialog);
          }, 1500);
        } else {
          if (getCookie("timeLeft") !== null) {
            eraseCookie("timeLeft");
          }
          removeStorageValue("activeMac");
          removeStorageValue("tempMac");
          removeStorageValue("activeVoucher");
          document.getElementById("timer").innerHTML = secondsToDhms(0);
          r.textContent = "Disconnected";
          if (n) {
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
        if (t) {
          dialog.querySelector(".header").textContent = "Connected Successfully!";
          setTimeout(function () {
            location.reload();
          }, 1500);
        } else if (n) {
          paused(50);
        }
        api();
      }
    }
  };
  i.send("username=" + e + "&password=" + o);
}
function forceLogin() {
  var t = document.querySelector("[data-dialog]");
  t.querySelector(".progress-bar").style.width = "100%";
  t.querySelector(".header").textContent = "Done";
  setTimeout(function () {
    closeModal(t);
    api();
  }, 50);
}
function insertBtnManual(e) {
  var n = e.dataset;
  var o = document.querySelector("[data-ssid]");
  var e = document.querySelector("[data-vendo]");
  closeModal(svmodal);
  insertBtn.style.pointerEvents = "none";
  showButtonLoading(insertBtn);
  vendorIpAddress = n.vendoIp;
  o.innerHTML = n.ssid;
  e.innerHTML = n.vendoName;
  vcTopUp = false;
  insertCoin(0);
  setStorageValue("vendoIp", n.vendoIp);
  setStorageValue("ssid", n.ssid);
  setStorageValue("vendoName", n.vendoName);
}
function insertCoin(n) {
  if (n == 0) {
    cancelRetry = false;
  }
  document.querySelector("#totalTime").textContent = "--:--";
  document.querySelector("#validity").textContent = "--:--";
  removeStorageValue("invalidUser");
  var t = getStorageValue("activeVoucher");
  extendTimeCriteria = t == null ? 0 : 1;
  t = new XMLHttpRequest();
  activeCoinXhr = t;
  t.open("POST", "http://" + vendorIpAddress + "/topUp", true);
  t.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  t.onreadystatechange = function () {
    var e;
    if (this.readyState == 4 && this.status == 200) {
      // A response arrived, so the "Retrying, Please Wait!" state is over.
      // Close that dialog and hide its Cancel button before proceeding.
      // (The vcTopUp branch below reopens it with its own message.)
      closeModal(dialog);
      hideDialogCancel();
      if ((e = JSON.parse(this.responseText)).status == "true") {
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
          icmodal.querySelector(".progress-bar").style.width = "100%";
          document.querySelector("[data-ic-close]").textContent = "Cancel";
          if (timer == null) {
            timer = window.setInterval(function () {
              checkCoin();
            }, 1000);
          }
          openModal(icmodal);
        }
        voucher = e.voucher;
        insertingCoin = true;
      } else {
        notifyCoinSlotError(e.errorCode);
        timer = null;
        clearInterval(timer);
      }
    }
  };
  t.onerror = function () {
    if (!cancelRetry && n < 5) {
      insertBtn.style.pointerEvents = "none";
      openModal(dialog);
      dialog.querySelector(".progress-bar").style.display = "none";
      dialog.querySelector(".header").textContent = "Retrying, Please Wait!";
      hideDialogCancel();
      retryTimer = setTimeout(function () {
        insertCoin(n + 1);
      }, 1000);
    } else {
      hideDialogCancel();
      if (cancelRetry) {
        closeModal(dialog);
      } else {
        dialog.querySelector(".header").textContent = vendor.textContent + " is offline!";
        setTimeout(function () {
          closeModal(dialog);
        }, 1500);
      }
      insertBtn.textContent = "Insert Coin";
      insertBtn.style.pointerEvents = "auto";
    }
  };
  t.send("voucher=" + voucher + "&mac=" + mac + "&ipAddress=" + ipAddress + "&extendTime=" + extendTimeCriteria);
  totalCoinReceived = 0;
  return false;
}
function checkCoin() {
  var e = new XMLHttpRequest();
  e.open("POST", "http://" + vendorIpAddress + "/checkCoin", true);
  e.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  e.send("voucher=" + voucher);
  e.onreadystatechange = function () {
    var e;
    var t;
    var n;
    var o;
    var a;
    var i;
    if (this.readyState == 4 && this.status == 200) {
      e = JSON.parse(this.responseText);
      totalCoinReceived = parseInt(e.totalCoin);
      if (vcTopUp) {
        if (e.status == "true") {
          setStorageValue("activeVoucher", voucher);
          if (intervalID !== null) {
            intervalManager(0);
            (a = new XMLHttpRequest()).open("POST", "/logout", true);
            a.send("erase-cookie=false");
          }
        } else if (e.errorCode == "coin.not.inserted") {
          donepaying();
        } else if (e.errorCode == "coinslot.busy") {
          clearInterval(timer);
          if (totalCoinReceived == 0) {
            insertCoinhidden(true, "Coinslot was cancelled");
          } else {
            donepaying();
          }
        } else {
          clearInterval(timer);
        }
      } else {
        t = document.querySelector("#validity");
        n = document.querySelector("[data-ic-close]");
        o = document.querySelector("#totalTime");
        if (e.status == "true") {
          n.style.pointerEvents = "none";
          setStorageValue("activeVoucher", voucher);
          if (intervalID !== null) {
            intervalManager(0);
            (i = new XMLHttpRequest()).open("POST", "/logout", true);
            i.send("erase-cookie=false");
          }
          document.querySelector("#totalCoin").innerHTML = currency + " " + e.totalCoin;
          if (e.timeAdded == 0) {
            o.textContent = "--:--";
          } else {
            o.textContent = credits(parseInt(e.timeAdded));
          }
          if (e.validity == 0) {
            t.textContent = "--:--";
          } else {
            t.textContent = credits(parseInt(e.validity * 60));
          }
          coindropPlay();
        } else if (e.errorCode == "coin.is.reading") {
          icmodal.querySelector(".header").textContent = "Reading coin, please wait";
          n.textContent = "Wait";
          n.style.pointerEvents = "none";
        } else if (e.errorCode == "coin.not.inserted") {
          totalCoinReceived = parseInt(e.totalCoin);
          n.style.pointerEvents = "auto";
          if (!coinslotExit) {
            icmodal.querySelector(".header").textContent = "Please Insert Coin";
          }
          a = parseInt(parseInt(e.remainTime) / 1000);
          i = parseFloat(e.waitTime);
          i = parseInt(a * 1000 / i * 100);
          if (totalCoinReceived > 0) {
            n.textContent = "Done Paying";
          }
          if (a == 0) {
            if (totalCoinReceived > 0) {
              donepaying();
            } else {
              insertCoinhidden(true, "Coin slot expired");
            }
          } else {
            document.querySelector("#totalCoin").innerHTML = currency + " " + e.totalCoin;
            if (e.timeAdded == 0) {
              o.textContent = "--:--";
            } else {
              o.textContent = credits(parseInt(e.timeAdded));
            }
            if (e.validity == 0) {
              t.textContent = "--:--";
            } else {
              t.textContent = credits(parseInt(e.validity * 60));
            }
            icmodal.querySelector(".progress-bar").style.width = i + "%";
          }
        } else if (e.errorCode == "coinslot.busy") {
          audioPlay(false);
          clearInterval(timer);
          if (totalCoinReceived == 0) {
            insertCoinhidden(true, "Coinslot was cancelled");
          } else {
            donepaying();
          }
        } else {
          clearInterval(timer);
        }
      }
    }
  };
}
function donepaying() {
  var e;
  if (totalCoinReceived > 0) {
    if (!vcTopUp) {
      audioPlay(false);
      closeModal(icmodal);
    }
    clearInterval(timer);
    timer = null;
    openModal(dialog);
    dialog.querySelector(".progress-bar").style.width = "50%";
    dialog.querySelector(".header").textContent = "Processing, Please wait!";
    (e = new XMLHttpRequest()).open("POST", "http://" + vendorIpAddress + "/useVoucher", true);
    e.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    e.send("voucher=" + voucher);
    e.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(this.responseText).status == "true") {
          dialog.querySelector(".progress-bar").style.width = "75%";
          dialog.querySelector(".header").textContent = "Connecting, Please wait!";
          forceLogin();
        } else {
          insertCoinhidden(false);
        }
      }
    };
    e.onerror = function () {
      dialog.querySelector(".progress-bar").style.width = "75%";
      dialog.querySelector(".header").textContent = "Force login, Please wait!";
      setTimeout(function () {
        forceLogin();
      }, 3000);
    };
  } else {
    insertCoinhidden(false);
  }
}
function convertextVoucher() {
  var e = document.getElementById("username").value;
  voucherToConvert = e;
  e = new XMLHttpRequest();
  e.open("POST", "http://" + vendorIpAddress + "/convertVoucher", true);
  e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  e.send("voucher=" + voucher + "&convertVoucher=" + voucherToConvert);
  e.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
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
  e.onerror = function () {
    document.getElementById("username").value = "";
  };
}
function insertCoinhidden(e, t) {
  closeModal(icmodal);
  clearInterval(timer);
  timer = null;
  insertingCoin = false;
  if (!vcTopUp) {
    audioPlay(false);
  }
  if (e) {
    dialog.querySelector(".progress-bar").style.display = "none";
    openModal(dialog);
    coinslotExit = true;
    dialog.querySelector(".header").textContent = t;
    setTimeout(function () {
      closeModal(dialog);
    }, 2000);
  }
  if (totalCoinReceived == 0) {
    cancelTopUp();
  }
}
function cancelTopUp() {
  var t = new XMLHttpRequest();
  t.open("POST", "http://" + vendorIpAddress + "/cancelTopUp", true);
  t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  t.send("voucher=" + voucher + "&mac=" + mac);
}
function getWifiRate(n) {
  var p = document.getElementById("ratesBtn");
  var m = document.getElementById("ratesBody");
  document.getElementById("ratesBody").style.display = "block";
  p.style.pointerEvents = "none";
  m.style.display = "none";
  wrmodal = document.querySelector("[data-rates]");
  showButtonLoading(p);
  var e = new XMLHttpRequest();
  e.open("GET", "http://" + vendorIpAddress + "/getRates?date=" + Date.now(), true);
  e.setRequestHeader("Content-type", "text/plain");
  e.send();
  e.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var e = this.responseText;
      p.style.pointerEvents = "auto";
      m.style.display = "block";
      p.textContent = "Wifi Rates";
      wrmodal.querySelector(".header").textContent = "Wifi Rates";
      var _wc = wrmodal.querySelector("[data-wr-close]");
      if (_wc) _wc.style.display = "";
      openModal(wrmodal);
      var t;
      var n = e.split("|");
      var o = "";
      for (t in n) {
        var a = n[t].split("#");
        if (a.length < 4 || isNaN(parseInt(a[1]))) {
          continue;
        }
        var i = parseInt(a[2]) * 60;
        var r = parseInt(a[3]) * 60;
        function c(e) {
          var n = Math.floor(e / 86400);
          var o = Math.floor(e % 86400 / 3600);
          var a = Math.floor(e % 3600 / 60);
          var i = n > 0 ? n + (n === 1 ? "Day " : "Days ") : "";
          var r = o > 0 ? o + "" : "0";
          var e = a > 0 ? a + "" : "0";
          if (n > 0 && o == 0 && a == 0) {
            return i;
          } else if (a > 0 && o == 0 && n == 0) {
            return e + "min";
          } else if (o > 0 && a == 0 && n == 0) {
            return r + "hour";
          } else {
            return i + r + "h:" + e + "m";
          }
        }
        var l = c(i);
        var u = c(r);
        if (u == "0h:0m" || r == 0) {
          u = "none";
        }
        o += "<tr><td>" + currency + " " + a[1] + ".00</td><td>" + l + "</td><td>" + u + "</td></tr>";
      }
      document.getElementById("rates").innerHTML = o;
    }
  };
  e.onerror = function () {
    var t = document.getElementById("ratesBtn");
    var _wc = wrmodal.querySelector("[data-wr-close]");
    if (n < 4) {
      if (_wc) _wc.style.display = "none";
      openModal(wrmodal);
      wrmodal.querySelector(".header").textContent = "Retrying, Please wait!";
      setTimeout(function () {
        getWifiRate(n + 1);
      }, 1000);
    } else {
      if (_wc) _wc.style.display = "";
      wrmodal.querySelector(".header").textContent = "Wifi rates is not availabe at this moment.";
      setTimeout(function () {
        closeModal(wrmodal);
      }, 2000);
      t.style.pointerEvents = "auto";
      t.textContent = "Wifi Rates";
    }
  };
}
ajaxsettings.open("GET", cacheBust("settings.json"), true);
ajaxsettings.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
ajaxsettings.setRequestHeader("Pragma", "no-cache");
ajaxsettings.send();
ajaxsettings.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var t = JSON.parse(this.responseText);
    pause_button = t.Settings.pause_button;
    member_logout_button = t.Settings.member_logout_button;
    trial_logout_button = t.Settings.trial_logout_button;
    insert_coin_button = t.Settings.insert_coin_button;
    wifi_rates_button = t.Settings.wifi_rates_button;
    member_button = t.Settings.member_button;
    if (insert_coin_button === false) {
      insertBtn.style.display = "none";
    }
    if (wifi_rates_button === false) {
      document.getElementById("ratesBtn").style.display = "none";
    }
    if (member_button === false) {
      document.getElementById("memberBtn").style.display = "none";
    }
    currency = t.Settings.currency;
    // The peso sign is U+20B1. Old Android / old browsers often lack this
    // glyph in their fonts, so it renders as an empty box no matter the
    // encoding or HTML entity used. Accept any way of writing U+20B1 in
    // settings.json (hex entity &#x20B1;, decimal entity &#8369;, or the
    // literal ₱) and draw it with CSS instead: a capital P with a double
    // strike, which renders on any device that can show the letter "P".
    var pesoForms = ["&#x20B1;", "&#x20b1;", "&#8369;", "&#8369", "\u20B1", "₱"];
    for (var pf = 0; pf < pesoForms.length; pf++) {
      if (currency === pesoForms[pf]) {
        currency = "<span class=\"peso\">P</span>";
        break;
      }
    }
    username_only = t.Settings.username_only;
    link.href = t.Settings.footer_link;
    link.textContent = t.Settings.footer_text;
    if (t.Settings.gcash_payment) {
      gcash_node_ip = t.gcash_payment.node_ip;
      portal_key = t.gcash_payment.portal_key;
      document.getElementById("gcashBtn").style.display = "block";
    } else {
      document.getElementById("gcashBtn").style.display = "none";
    }
    if (!t.Settings.voucher_input) {
      document.querySelector(".btn-group .input-group").style.display = "none";
    }
    if (t.Settings.internet_status) {
      getInternetStatus(t.no_internet_settings.insertcoin, t.no_internet_settings.auto_pause, t.no_internet_settings.internet_status_tittle, t.no_internet_settings.internet_status_text);
    }
    if (t.Settings.subscription) {
      subscription = true;
      subscription_prefix = t.subscription_prefix;
    }
    if (t.Settings.vendo_option == 0) {
      ssid.innerHTML = t.VendoAddresses[0].ssid;
      vendor.textContent = t.VendoAddresses[0].vendoName;
      vendorIpAddress = t.VendoAddresses[0].vendoIp;
    } else if (t.Settings.vendo_option == 1) {
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
        selectVendo.innerHTML = selectVendo.innerHTML + "<button type=\"button\" class=\"btn btn-primary\" onclick=\"insertBtnManual(this)\" data-vendo-ip=\"" + t.VendoAddresses[n].vendoIp + "\" data-ssid=\"" + t.VendoAddresses[n].ssid + "\" data-vendo-name=\"" + t.VendoAddresses[n].vendoName + "\">" + t.VendoAddresses[n].vendoName + "</button>";
      }
    } else if (t.Settings.vendo_option == 2) {
      for (n = 0; n < t.VendoAddresses.length; n++) {
        var o = interfaceName;
        if (t.VendoAddresses[n].interfaceName == o) {
          ssid.innerHTML = t.VendoAddresses[n].ssid;
          vendor.textContent = t.VendoAddresses[n].vendoName;
          vendorIpAddress = t.VendoAddresses[n].vendoIp;
        }
      }
    }
    if (t.Settings.vendo_option !== 1) {
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
    insertBtn.style.pointerEvents = "none";
    showButtonLoading(insertBtn);
    vcTopUp = false;
    insertCoin(0);
  } else if (internet_status == "down") {
    notifyCoinSlotError("no.internet.detected");
  } else {
    openModal(svmodal);
  }
};
document.querySelector("[data-ic-close]").onclick = function () {
  donepaying();
};
function showDialogCancel() {
  var b = dialog.querySelector("[data-dialog-close]");
  if (b != null) {
    b.style.display = "inline-block";
  }
}
function hideDialogCancel() {
  var b = dialog.querySelector("[data-dialog-close]");
  if (b != null) {
    b.style.display = "none";
  }
}
(function () {
  var b = dialog.querySelector("[data-dialog-close]");
  if (b != null) {
    b.onclick = function () {
      cancelRetry = true;
      if (retryTimer != null) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      if (activeCoinXhr != null) {
        try {
          activeCoinXhr.abort();
        } catch (e) {}
      }
      hideDialogCancel();
      closeModal(dialog);
      insertBtn.textContent = "Insert Coin";
      insertBtn.style.pointerEvents = "auto";
    };
  }
})();
document.querySelector("[data-sv-close]").onclick = function () {
  closeModal(svmodal);
};
document.querySelector("[data-wr-close]").onclick = function () {
  closeModal(document.querySelector("[data-rates]"));
};
document.querySelector("[data-ml-close]").onclick = function () {
  closeModal(document.querySelector("[data-member]"));
};
document.querySelector("[data-msg-close]").onclick = function () {
  closeModal(document.querySelector("[data-message]"));
};
pauseBtn.onclick = function () {
  paused(50);
};
document.getElementById("ratesBtn").onclick = function () {
  getWifiRate(0);
};
document.getElementById("gcashBtn").onclick = function () {
  display_ewalletvoucher_modal(portal_key, gcash_node_ip, "username", "submit");
};
document.getElementById("voucherBtn").onclick = function () {
  document.getElementById("username").value = "";
  openModal(document.querySelector("[data-voucher]"));
};
document.querySelector("[data-vc-close]").onclick = function () {
  closeModal(document.querySelector("[data-voucher]"));
};
document.getElementById("memberBtn").onclick = function () {
  var t = document.querySelector("[data-member]");
  document.getElementById("mlBody").style.display = "block";
  t.querySelector(".header").textContent = "Login to Connect";
  openModal(t);
};
document.querySelector("[data-login]").onclick = function () {
  doConnect(true, false, document.getElementById("Muser").value, document.getElementById("Mpass").value);
};
document.getElementById("submit").onclick = function () {
  var t = document.getElementById("username").value;
  if (internet_status == "down") {
    notifyCoinSlotError("no.internet.detected");
  } else if (t == "") {
    openModal(dialog);
    dialog.querySelector(".progress-bar").style.display = "none";
    dialog.querySelector(".header").textContent = "Invalid Voucher!";
    setTimeout(function () {
      closeModal(dialog);
    }, 2000);
  } else {
    closeModal(document.querySelector("[data-voucher]"));
    vcTopUp = true;
    insertCoin(0);
  }
};
document.querySelector("[data-claim]").onclick = function () {
  showButtonLoading(this);
  this.style.pointerEvents = "none";
  setTimeout(function () {
    var t = new XMLHttpRequest();
    t.open("POST", "/login", true);
    t.send("dst=&username=T-" + mac);
    location.reload();
  }, 1000);
};
document.querySelector("[data-trl-close]").onclick = function () {
  closeModal(trlmodal);
};
function animate() {
  var e = new XMLHttpRequest();
  e.open("GET", cacheBust("/api"), true);
  e.send();
  e.onreadystatechange = function () {
    var e;
    if (this.readyState === 4 && this.status === 200) {
      e = JSON.parse(this.responseText);
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
      if (e.status == "Disconnected") {
        intervalManager(0);
        setMemberLoginVisible(true);
      }
      if (e.timeleft == 0) {
        (e = new XMLHttpRequest()).open("POST", "/logout", true);
        e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        e.send("erase-cookie=true");
        e.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            location.reload();
          }
        };
        if (getCookie("timeLeft") !== null) {
          eraseCookie("timeLeft");
        }
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
  e.onerror = function () {
    notifyCoinSlotError("offline");
  };
}
function intervalManager(e, t, n) {
  if (e) {
    intervalID = setInterval(t, n);
    pauseBtn.textContent = "Pause";
  } else {
    clearInterval(intervalID);
    intervalID = null;
  }
}
function setMemberLoginVisible(show) {
  var b = document.getElementById("memberBtn");
  if (b == null) {
    return;
  }
  if (show && member_button !== false) {
    b.style.display = "block";
    b.style.pointerEvents = "auto";
  } else {
    b.style.display = "none";
  }
}
function showButtonLoading(btn) {
  if (btn == null) {
    return;
  }
  var label = btn.textContent.trim();
  btn.innerHTML = label + '<div class="hloader"><span></span></div>';
}
function cacheBust(url) {
  return url + (url.indexOf("?") === -1 ? "?" : "&") + "_=" + Date.now();
}
function audioPlay(e) {
  if (insertcoinbg.readyState === 4) {
    if (e) {
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
  if (coinCount.readyState === 4) {
    coinCount.play();
  } else {
    coinCount.src = "assets/sounds/coinreceived.mp3?date=" + Date.now();
    coinCount.load();
    coinCount.play();
  }
}
function credits(e) {
  e = Number(e);
  var n = Math.floor(e / 86400);
  var o = Math.floor(e % 86400 / 3600);
  var e = Math.floor(e % 3600 / 60);
  return (n > 0 ? n + (n == 1 ? " Day " : " Days ") : "") + "" + (o > 0 ? o + "" : "0") + "h:" + (e > 0 ? e + "" : "0") + "m";
}
function secondsToDhms(e) {
  e = Number(e);
  var n = Math.floor(e / 86400);
  var o = Math.floor(e % 86400 / 3600);
  var a = Math.floor(e % 3600 / 60);
  var i = Math.floor(e % 60);
  function seg(v, u) {
    return '<span class="t-num">' + v + '</span><span class="t-unit">' + u + '</span>';
  }
  return [seg(n,"d"), seg(o,"h"), seg(a,"m"), seg(i,"s")].join(" ");
}
function setStorageValue(e, t) {
  if (localStorage != null) {
    localStorage.setItem(e, t);
  }
}
function removeStorageValue(e) {
  if (localStorage != null) {
    localStorage.removeItem(e);
  }
}
function getStorageValue(e) {
  if (localStorage != null) {
    return localStorage.getItem(e);
  }
}
function clearStorageValue() {
  if (localStorage != null) {
    localStorage.clear();
  }
}
function setCookie(e, t, n) {
  var o;
  var i = "";
  if (n) {
    (o = new Date()).setTime(o.getTime() + n * 1000);
    i = "; expires=" + o.toUTCString();
  }
  document.cookie = e + "=" + (t || "") + i + "; path=/";
}
function getCookie(e) {
  var n = e + "=";
  for (var o = document.cookie.split(";"), a = 0; a < o.length; a++) {
    for (var i = o[a]; i.charAt(0) == " ";) {
      i = i.substring(1, i.length);
    }
    if (i.indexOf(n) == 0) {
      return i.substring(n.length, i.length);
    }
  }
  return null;
}
function eraseCookie(e) {
  document.cookie = e + "=; Max-Age=-99999999;";
}
function replaceAll(e, t) {
  for (var o = e; o.indexOf(t) > 0;) {
    o = o.replace(t, "");
  }
  return o;
}
function notifyCoinSlotError(e) {
  var n = document.querySelector("[data-message]");
  openModal(n);
  if (e == "coinslot.busy") {
    n.querySelector(".header").textContent = "Error!";
    document.querySelector("#message").textContent = "Coin slot is busy, Please try again later";
  }
  if (e == "coin.slot.banned") {
    n.querySelector(".header").textContent = "Warning!";
    document.querySelector("#message").textContent = "You have been banned from using coin slot, due to multiple request for insert coin, please try again later!";
  }
  if (e == "no.internet.detected") {
    n.querySelector(".header").textContent = "Error!";
    document.querySelector("#message").textContent = "No internet connection as of the moment, Please try again later";
  }
  if (e == "offline") {
    n.querySelector(".header").textContent = "Error!";
    document.querySelector("#message").textContent = "Error connecting to \"" + document.querySelector("[data-ssid]").textContent + "\", Please check your wifi connection";
  } else {
    setTimeout(function () {
      insertBtn.style.pointerEvents = "auto";
      insertBtn.textContent = "Insert Coin";
    }, 3000);
  }
}
function openModal(e) {
  if (e != null) {
    e.style.display = "-webkit-flex";
    e.style.display = "flex";
    body.classList.add("modal-active");
  }
}
function closeModal(e) {
  if (e != null) {
    e.style.display = "none";
    body.classList.remove("modal-active");
  }
}
