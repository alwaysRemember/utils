/**
 * Created by yaer on 2018/7/6;
 * @Email 740905172@qq.com
 **/

/**
 * 获取系统
 * @returns {*}
 */
export function getSys() {
  let sys;
  let u = navigator.userAgent;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isiOS) {
    sys = "ios";
  } else {
    sys = "android";
  }
  console.log("当前手机是" + sys + "操作系统");
  return sys;
}

/**
 * 获取url的params
 * @param url url地址
 * @returns {Object}
 */
export function GetRequest(url) {
  let theRequest = {};
  let index = url.indexOf("?");
  if (index !== -1) {
    let str = url.substr(index+1);
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      const [key,val] = strs[i].split("=");
      theRequest[key] = val;
    }
  }
  return theRequest;
}

/**
 * 获取url的参数（用于key有特殊字符的情况，参数传递特殊字符怎么想的？？）
 * @param url 链接
 * @returns List<Map<String,String>>
 */
export function getParams(url) {
  let paramsArr = url.split('?')[1].split('&');
  let arr = [];
  paramsArr.forEach((item) => {
    let itemArr = item.split('=');
    arr.push({
          [decodeURI(itemArr[0])]: itemArr[1]
        }
    );
  })
  ;
  return arr;
}

/**
 * fixed定位解决遮盖元素问题
 * @param isAppendChild 是否需要在当前节点父级下 不判断是否最后一个元素跟当前元素相同 就直接创建节点
 * @param cloneDom fixed定位的dom节点
 * @param company css单位 px rem
 * @returns {*}
 */
export function fixedClone(isAppendChild, cloneDom, company = 'rem') {
  // 获取需要克隆节点的宽高
  let height = cloneDom.offsetHeight;
  let width = cloneDom.offsetWidth;

  // 生成dom并且获取html的fontSize
  let dom = document.createElement("div");
  let htmlFontSize = Number(window.document.documentElement.style.fontSize.split('px')[0]);


  //dom赋值
  if (company === 'rem') {
    dom.style.height = height / htmlFontSize + 'rem';
    dom.style.width = width / htmlFontSize + 'rem';
  } else {
    dom.style.height = height + 'px';
    dom.style.width = width + 'px';
  }

  // 插入dom 如果cloneDom的最后一个节点是cloneDom 那么就直接在最后插入dom 否则就在clone下一个节点前插入dom
  let parent = cloneDom.parentNode;
  if (parent.lastChild === cloneDom && isAppendChild) {
    parent.appendChild(dom);
  } else {
    parent.insertBefore(dom, cloneDom.nextSibling)
  }

}

/**
 * 时间转换
 * @param date  毫秒值的时间
 * @param format  转换格式
 * @returns {string}
 */
export function setDate(date, format) {
  let time = new Date(date);
  let val = '';
  switch (format) {
    case 'yy-mm':
      val = `${time.getFullYear()}年${time.getMonth() + 1}月`;
      break;
    case 'yy-mm-dd':
      val = `${time.getFullYear()}年${time.getMonth() + 1}月${zero(time.getDate())}日`;
      break;
    case 'yy-mm-dd-hh-ii':
      val = `${time.getFullYear()}-${time.getMonth() + 1}-${zero(time.getDate())}  ${zero(time.getHours())}:${zero(time.getMinutes())}`;
      break;
    case 'hh-ii':
      val = `${zero(time.getHours())}:${zero(time.getMinutes())}`;
      break;
    case 'hh-ii-ss':
      val = `${zero(time.getHours())}:${zero(time.getMinutes())}:${zero(time.getSeconds())}`;
      break;
  }
  return val
}

/**
 * 时间倒计时
 * @param mss 毫秒时间
 * @returns {string}
 */
export function formatDuring(mss) {
  let hours = zero(parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  let minutes = zero(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)));
  let seconds = ((zero((mss % (1000 * 60)) / 1000)) + '').split('.')[0];
  return `${hours}:${minutes}:${seconds}`
}

/**
 * 补0
 * @param num Number数字
 * @returns {*}
 */
function zero(num) {
  if (num < 10) {
    return '0' + num
  } else {
    return num
  }
}

/**
 *  唤起APP
 * @param jumpLink  唤起APP的链接
 * @param download  唤起不成功的下载链接
 * @returns {*}
 */
export function AppJump(jumpLink, download) {
  Indicator.open({
    text: '跳转中...',
    spinnerType: 'fading-circle'
  });
  //判断浏览器
  let u = navigator.userAgent;
  if (/MicroMessenger/gi.test(u)) {
    // 引导用户在浏览器中打开
    alert('请在浏览器中打开');
    return false;
  }
  let d = new Date();
  let t0 = d.getTime();
  openApp(jumpLink);
  let delay = setInterval(() => {
        let d = new Date();
        let t1 = d.getTime();
        if (t1 - t0 < 3000 && t1 - t0 > 2000) {
          // 这里跳转下载页
          Indicator.close();
          window.location.href = download;
        }
        if (t1 - t0 >= 3000) {
          clearInterval(delay);
        }
      },
      1000
      )
  ;

  function openApp(src) {
    // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
    // 否则打开a标签的href链接

    if (getSys() === "ios") {
      window.location.href = src;
    } else {
      let ifr = document.createElement('iframe');
      ifr.src = src;
      ifr.style.display = 'none';
      document.body.appendChild(ifr);
      window.setTimeout(() => {
            document.body.removeChild(ifr);
          },
          2000
      )
      ;
    }
  }
}

/**
 * 当路由变化的时候需要处理的事件
 * @param callback 路由变化执行的回调事件
 */
export function goBackConfirm(callback) {
  let href = window.location.href;
  location.hash = 'last';
  history.pushState({back: 1}, null, href);

  // 监听路由变化
  onhashchange = () =
>
  {
    if (location.hash.indexOf('#last') < 0) return;
    callback && callback()
  }
  ;
}

/**
 * 获取cookie
 * @returns {{}}
 */
export function getCookie() {
  let obj = {};
  let cookieArr = document.cookie.split(';');
  cookieArr.forEach((item) => {
    let itemArr = item.replace(/\s+/g, "").split('=');
    obj[itemArr[0]] = itemArr[1];
  })
  ;
  return obj;
}

/**
 * 把字符串改为金额的格式
 * @param num 金额 (Number)
 * @param decimal
 * @returns {string}xx,xxx,xxx,xxx.xx
 */
export function moneyFormat(num, decimal) {
  if (typeof num === "number") {
    num = String(num.toFixed(decimal || 2));
    let re = /(-?\d+)(\d{3})/;
    while (re.test(num)) num = num.replace(re, "$1,$2");
    return num;
  }
  return num;
}


/**
 * 时间转换
 * @param x new Date()对象
 * @param y 格式 yy-M-d h:m:s (可拆开写)
 * @returns {string | void} 时间字符串
 */
export function dateFormat(x, y) {
  let z = {
    y: x.getFullYear(),
    M: x.getMonth() + 1,
    d: x.getDate(),
    h: x.getHours(),
    m: x.getMinutes(),
    s: x.getSeconds()
  };
  return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
      }
  );
}

/**
 * 手机号格式化 3 4 4
 * @param phone {String}  手机号
 * @returns {string | void | *}
 */
export function formatPhone(phone) {
  if(typeof phone === 'number'){
    phone = phone.toString();
  }
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
}
