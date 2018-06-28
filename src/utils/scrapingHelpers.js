export const parseDateFromMemberSince = str => {
  const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let res = "";
  let month = "";
  let year = "";
  if (!str) return res;

  monthArr.forEach((item, i) => {
    if (str.indexOf(item) !== -1) month = i + 1;
  });
  const yearArr = str.match(/\d/g);
  if (yearArr && yearArr.length) year = yearArr.join("");

  if (year && month) {
    res = new Date(year, month - 1).valueOf();
  }
  return res;
};

export const srpAuthUrlFromThemeList = (url, instance) => {
  return new Promise(function(resolve, reject) {
    instance
      .get(url)
      .then(function(res) {
        const { status, data } = res;
        //console.log(data);

        let articleEls = $(data)
          .find("#selected-filters")
          .next()
          .find("article");

        if (articleEls.length) {
          const result = {};
          articleEls.each(function(i, item) {
            const resEl = $(this)
              .children("section:nth-child(2)")
              .find("i")
              .next();
            const authorName = resEl.text(); //для имени
            const authorUrl = resEl.attr("href");
            const value = { url: authorUrl, name: authorName };

            if (authorName && value) {
              result[authorName] = value;
              resolve(result);
            } else {
              reject("els Arr have not text");
            }
          });
        } else {
          console.log("els Arr empty");
        }
      })
      .catch(function(error) {
        reject(error);
        console.log("rejecting-error", error);
      });
  });
};

export const srpAllFromAuthorPage = (url, instance) => {
  return new Promise(function(resolve, reject) {
    instance
      .get(url)
      .then(function(res) {
        const { status, data } = res;

        let userInfoStats,
          name = "",
          memberSinceFullStr = "",
          themsItemsStr = "0",
          salesStr = "0";

        const userInfoHeader = $(data).find(".user-info-header");

        if (userInfoHeader && userInfoHeader[0]) {
          userInfoStats = $(userInfoHeader[0]).find(
            ".user-info-header__user-stats"
          );
          name =
            $(userInfoHeader[0])
              .find(".user-info-header__content > a > h2")
              .text() || "";
          memberSinceFullStr =
            $(userInfoHeader[0])
              .find(".user-info-header__content > p")
              .text() || "";

          salesStr = $(userInfoStats[0])
            .find(
              ".user-info-header__stats-article > .user-info-header__stats-content > strong"
            )
            .text();
        }

        const sitePortfolio = $(data).find(
          ".sidebar-l > .e-box > .site-portfolio"
        );

        if (sitePortfolio && sitePortfolio[0]) {
          themsItemsStr =
            $(sitePortfolio[0])
              .find(".site-portfolio__item-count > span")
              .text() || "0";
        }

        const memberSince = parseDateFromMemberSince(memberSinceFullStr);
        const sales = +salesStr.match(/\d/g).join("");
        const themsItems = parseInt(themsItemsStr);

        const result = {
          url,
          name,
          memberSince,
          sales,
          themsItems
        };
        resolve(result);
      })
      .catch(function(error) {
        reject(error);
        console.log("rejecting-error", error);
      });
  });
};

export const fullPager = (config, loadFn, instance, manage, dispatch) => {
  let currentPage = config.startPage;
  const pagerFn = (_config, _loadFn, _instance) => {
    const { endPage, url, timeOut } = _config;
    const { stop, sendAuthorsNames } = manage;

    if (!stop && currentPage <= endPage) {
      _loadFn(`${url}${currentPage}`, _instance).then(
        res => {
          const resData = {
            currentPage,
            currentUrl: `${url}${currentPage}`,
            byId: { ...res }
          };
          sendAuthorsNames(resData, dispatch);
          if (res) {
            setTimeout(function() {
              currentPage++;
              pagerFn(_config, _loadFn, _instance);
            }, timeOut);
          }
        },
        error => console.log(`Rejected: ${error}`)
      );
    }
  };

  pagerFn(config, loadFn, instance);
};

export const goToTheAddressList = (
  dataConfig,
  loadFn,
  instance,
  manage,
  dispatch
) => {
  const { addressList, timeOut } = dataConfig;
  const { sendFullAuthorsData } = manage;

  let i = 0;
  const interval = setInterval(function() {
    const url = addressList[i];

    loadFn(url, instance).then(
      res => {
        console.log("res==============", res);
        if (res) {
          const { name } = res;
          const resData = {
            currentUrl: url,
            byId: {
              [name]: res
            }
          };
          sendFullAuthorsData(resData, dispatch);

          i++;
          if (i === addressList.length || manage.stop) clearInterval(interval);
        }
      },
      error => {
        clearInterval(interval);
        console.log(`Rejected: ${error}`);
      }
    );
  }, timeOut);
};
