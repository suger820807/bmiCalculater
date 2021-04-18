
let data = JSON.parse(localStorage.getItem("bmiList")) || [];
console.log(typeof (data));

//抓取bmi清單元素
let bmiList = document.querySelector(".bmiList");
//抓取送出按鈕
let calculate = document.querySelector(".calculate");
//抓取顯示結果元素
let bmiCircle = document.querySelector(".bmiCircle");
//抓取刪除全部數據按鈕
let clearAllBtn = document.querySelector(".clearAll");
//抓取資料未填提示文字
let hint = document.querySelector(".hintText");

//生成清單
function createList() {

    let str = "";
    let temp = "";
    for (let i = data.length - 1; i >= 0; i--) {
        //排資料
        temp = `<li>
                    <div class="lightBox ${setColorClass(data[i].result)}Box"></div>
                    <span class="result bigText">${data[i].result}</span>
                    <span class="bmiTitle smallText">BMI</span>
                    <span class="bmiData bigText">${data[i].bmi}</span>
                    <span class="weightTitle smallText">weight</span>
                    <span class="weightData bigText">${data[i].weight}</span>
                    <span class="heightTitle smallText">height</span>
                    <span class="heightData bigText">${data[i].height}</span>
                    <span class="date smallText">${data[i].date}</span>
                    <a class="delete" data-index="${[i]}">X
                    <a>
                </li>`;
        str += temp;
    }
    //將清單資料放入
    bmiList.innerHTML = str;
    //控制全部刪除按鈕顯示
    if (data.length > 1) {
        clearAllBtn.style.display = "block";
    }
    else {
        clearAllBtn.style.display = "none";
    }
}
createList();

//將資料轉換成class
function setColorClass(result) {
    switch (result) {
        case "理想":
            return "ideal";
        case "過輕":
            return "underweight";
        case "過重":
            return "overweight";
        case "輕度肥胖":
            return "mildObesity";
        case "中度肥胖":
            return "moderateObesity";
        case "重度肥胖":
            return "severeObesity"
        default:
            return 0;
    }
}

//計算bmi
function calculateBMI() {
    //抓取身高數據
    let height = document.getElementById("height").value;
    //抓取體重數據
    let weight = document.getElementById("weight").value;

    if (height === "" || weight === "") {
        hint.textContent = "請輸入完整資料!"; 
        return;
    }

    hint.textContent = ""; 

    //計算bmi
    let bmi = weight / Math.pow((height * 0.01), 2);
    bmi = bmi.toFixed(2);

    let bmiStr;

    //判斷bmi結果
    if (bmi < 18.5) {
        bmiStr = "過輕";
    } else if (bmi >= 18.5 && bmi < 24) {
        bmiStr = "理想";
    } else if (bmi >= 24 && bmi < 27) {
        bmiStr = "過重";
    } else if (bmi >= 27 && bmi < 30) {
        bmiStr = "輕度肥胖";
    } else if (bmi >= 30 && bmi < 35) {
        bmiStr = "中度肥胖";
    } else {
        bmiStr = "重度肥胖";
    }
    //設定結果的class
    let bmiClass = setColorClass(bmiStr);

    //顯示計算結果的元素
    let str = ` <div class="${bmiClass}Border bigCircle">
                    <div class="${bmiClass} bmiResult">${bmi}</div>
                    <div class="${bmiClass} bmiResultTitle">BMI</div>
                </div>
                <div class="${bmiClass}BG smallCircle"></div>
                <div class="${bmiClass} bmiStr">${bmiStr}</div>
                <div class="save">保存</div>`;

    bmiCircle.innerHTML = str;

    //調整計算按鈕與結果的顯示屬性
    calculate.style.display = "none";
    bmiCircle.style.display = "block";

    //抓取reset按鈕元素並賦予功能
    let resetBtn = document.querySelector(".smallCircle");
    resetBtn.addEventListener("click", reset)
    //抓取保存資料按鈕並賦予功能
    let saveBtn = document.querySelector(".save");
    saveBtn.addEventListener("click", saveData);

}

//儲存資料
function saveData() {
    //抓取身高數據
    let height = document.getElementById("height").value;
    //抓取體重數據
    let weight = document.getElementById("weight").value;
    //抓取BMI值
    let bmi = document.querySelector(".bmiResult").textContent;
    //抓取BMI評語
    let bmiStr = document.querySelector(".bmiStr").textContent;
    //抓取日期
    let date = getDate();
    //組成data儲存
    let tempJson =
    {
        result: bmiStr,
        bmi: bmi,
        weight: weight,
        height: height,
        date: date
    }

    data.push(tempJson);
    localStorage.setItem("bmiList", JSON.stringify(data));
    createList();
    reset();
}

//抓取日期
function getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    //小於10前面補零
    month < 10 ? month = "0" + month : month;
    day < 10 ? day = "0" + day : day;
    let now = month + "-" + day + "-" + year;

    return now;
}
getDate();

//reset計算功能
function reset() {
    calculate.style.display = "block";
    bmiCircle.style.display = "none";
    document.getElementById("height").value = null;
    document.getElementById("weight").value = null;
}

//刪除功能
function deleteData(e) {
    if (e.target.nodeName != "A") return;
    data.splice(data[e.target.dataset.index], 1);
    localStorage.setItem("bmiList", JSON.stringify(data));
    createList();
}

function deleteAllData(e) {
    e.preventDefault();
    data = [];
    localStorage.setItem("bmiList", JSON.stringify(data));
    createList();
}

//為計算按鈕添加功能
calculate.addEventListener("click", calculateBMI)

bmiList.addEventListener("click", deleteData)

clearAllBtn.addEventListener("click", deleteAllData)