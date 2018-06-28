export const convertTime = (time, way = "msToDay") => {
  let res = time / 86400000;
  return Math.round(res);
};

const getUpdatedTheme = str => {
  str.replace("Last", "").replace("updated", "");
  str.trim();
  return Date.parse(str);
};

export const purePager = (config, loadFn, apiInst, manage) => {
  let currentPage = config.startPage || 1;
  const endPage = config.endPage || 100;
  const timeOut = config.timeOut || 1000;
  const { sendResData } = manage;
  const { url } = config;

  const pagerFn = (_loadFn, _instance) => {
    const { stop } = manage;

    if (!stop && currentPage <= endPage) {
      _loadFn(`${url}${currentPage}`, _instance).then(
        data => {
          //console.log('data ==============',data );
          const { length } = data;
          let end = false;
          if (currentPage === endPage) end = true;
          if (!length) end = true;

          const resData = {
            end,
            currentPage,
            currentUrl: `${url}${currentPage}`,
            data,
            config
          };

          sendResData(resData);
          if (!end) {
            setTimeout(function() {
              currentPage++;
              pagerFn(_loadFn, _instance);
            }, timeOut);
          }
        },
        error => console.log(`Rejected pager: ${error}`)
      );
    }
  };

  pagerFn(loadFn, apiInst);
};

export const srpAllDataFromThemeList = (pageUrl, apiInst) => {
  return new Promise(function(resolve, reject) {
    apiInst
      .get(pageUrl)
      .then(res => {
        const { status, data } = res;
        const outputData = [];
        let articleEls = $(data)
          .find("#selected-filters")
          .next()
          .find("article");

        if (articleEls.length) {
          const result = {};
          articleEls.each((i, item) => {
            const titleBlkEl = $(item)
              .children("section:nth-child(2)")
              .find("div:nth-child(1)");
            const salesBlkEl = $(item)
              .children("section:nth-child(4)")
              .find("span");
            //title
            const titleEl = titleBlkEl.find("h3 > a");
            const title = titleEl.text();
            //url
            const url = titleEl.attr("href");
            //tags
            const tags = titleBlkEl.find("span").text();
            // author name
            const authorEl = $(item)
              .children("section:nth-child(2)")
              .find("i")
              .next();
            const authorName = authorEl.text();
            // authorUrl
            const authorUrl = authorEl.attr("href");
            //sales updatedTheme
            let salesIndex = 999;
            let updatedIndex = 999;
            salesBlkEl.each((i, item) => {
              const innerSpanText1 = $(item)
                .find("span")
                .text();
              const innerSpanText2 = $(item).text();
              if (innerSpanText1.indexOf("Sales") != -1) salesIndex = i;
              if (innerSpanText2.indexOf("updated") != -1) updatedIndex = i;
            });

            let sales = 0;
            if (salesIndex != 999) {
              const salesStr = $(salesBlkEl[salesIndex])
                .find("span")
                .text();
              sales = +salesStr.match(/\d/g).join("");
            }

            let updatedTheme;
            if (updatedIndex != 999) {
              const updatedStr = $(salesBlkEl[updatedIndex]).text();
              updatedTheme = getUpdatedTheme(updatedStr);
            }

            const values = {
              title,
              url,
              tags,
              authorName,
              authorUrl,
              sales,
              updatedTheme
            };
            outputData.push(values);
          });

          resolve(outputData);
        } else {
          console.log("els Arr empty");
          resolve([]);
        }
      })
      .catch(error => {
        reject(error);
        console.log("rejecting-error", error);
      });
  });
};

export const srpAllFromThemePage = (url, instance) => {
  return new Promise(function(resolve, reject) {
    instance
      .get(url)
      .then(function(res) {
        const { status, data } = res;

        // title
        const titleEl = $(data).find(".item-header__title > h1")[0];
        const title = $(titleEl)
          .text()
          .trim();

        //authorName
        const authorNameEl = $(data).find(
          ".sidebar-l .media__body > h2 > a"
        )[0];
        const authorName = $(authorNameEl)
          .text()
          .trim();

        // authorUrl
        let authorUrl = $(authorNameEl)
          .attr("href")
          .trim();
        authorUrl = "https://themeforest.net" + authorUrl;

        //sales
        const salesEl = $(data).find(
          ".sidebar-l .sidebar-stats__number .-icon-cart"
        )[0];
        const sales = +$(salesEl)
          .parent()
          .parent()
          .text()
          .trim();

        // next
        let createdIndex;
        let updatedIndex;
        let tagsIndex;
        const attributesTable = $(data).find(
          ".sidebar-l .box .meta-attributes__attr-name"
        );

        attributesTable.each((i, item) => {
          const text = $(item)
            .text()
            .trim();
          if (text.indexOf("Update") != -1) updatedIndex = i;
          if (text.indexOf("Created") != -1) createdIndex = i;
          if (text.indexOf("Tags") != -1) tagsIndex = i;
        });

        //createdTheme
        const createdThemeEl = $(attributesTable[createdIndex])
          .next()
          .find("span");
        let createdTheme = $(createdThemeEl[0])
          .text()
          .trim();
        createdTheme = Date.parse(createdTheme);

        //updatedTheme
        const updatedThemeEl = $(attributesTable[updatedIndex])
          .next()
          .find("time");
        let updatedTheme = $(updatedThemeEl[0])
          .text()
          .trim();
        updatedTheme = Date.parse(updatedTheme);

        //tags
        let tags = [];
        const tagsEls = $(attributesTable[tagsIndex])
          .next()
          .find("span a");
        tagsEls.each((i, item) => {
          tags.push(
            $(item)
              .text()
              .trim()
          );
        });

        const result = {
          url,
          title,
          authorName,
          authorUrl,
          sales,
          createdTheme,
          updatedTheme,
          tags
        };

        resolve(result);
      })
      .catch(function(error) {
        reject(error);
        console.log("rejecting-error", error);
      });
  });
};

export const sortOutAddressList = (
  dataConfig,
  loadFn,
  instance,
  manageConfig,
  dispatch
) => {
  const { addressList, timeOut, byIdKey, addData } = dataConfig;
  let i = 0;
  if (!addressList.length) return true;

  const interval = setInterval(function() {
    const url = addressList[i];

    loadFn(url, instance).then(
      res => {
        if (res) {
          const data = { ...res, ...addData };
          const key = data[byIdKey];
          const resData = {
            currentUrl: url,
            data,
            byId: {
              [key]: data
            },
            dataConfig,
            manageConfig
          };
          manageConfig.sendData(resData, dispatch);
          i++;
          if (i === addressList.length || manageConfig.stop) {
            manageConfig.createEndAction(dataConfig, dispatch);
            clearInterval(interval);
          }
        }
      },
      error => {
        clearInterval(interval);
        console.log(`Rejected: ${error}`);
      }
    );
  }, timeOut);
};

export const createNewItemOnServer = (
  list,
  createApiInstance,
  config,
  dispatch
) => {
  const { entity } = config;
  config.saveOnServer.creating(dispatch);

  list.forEach((item, i) => {
    createApiInstance.post(entity, item).then(
      res => {
        config.saveOnServer.created(res, i, dispatch);
      },
      error => {
        console.log(`Rejected: ${error}`);
        config.saveOnServer.failure(error, i, dispatch);
      }
    );
  });
};

export const reduceByUpdateFild = source => {
  let res = [...source];
  res.forEach((item, i) => {
    if (i > 0) {
      const currentFild = item.updatedTheme;
      const prevFild = res[i - 1].updatedTheme;
      if (currentFild > prevFild) res[i].updatedTheme = prevFild;
    }
  });
  return res;
};

export const addRankByFild = (source, fildName) => {
  const convertTime = time => {
    let res = time / 86400000;
    return Math.round(res);
  };
  const now = Date.now();

  const res = source.map(item => {
    const { sales } = item;

    const days = convertTime(now - item[fildName]);
    const rank = Math.floor(sales * 365 / days);
    return { ...item, rank };
  });

  return res;
};

export const filterByRankBySales = (source, minRank = 1, minSales = 0) => {
  const res = source.filter(({ sales, rank }) => {
    return sales >= minSales && rank >= minRank;
  });
  return res;
};

export const getUrlArr = sourse => {
  const res = sourse.map(item => {
    return item.url;
  });
  return res;
};

export const addRankFild = source => {
  const convertTime = time => {
    let res = time / 86400000;
    return Math.round(res);
  };
  const now = Date.now();

  const res = source.map(item => {
    const { createdTheme, sales } = item;
    const days = convertTime(now - createdTheme);
    const rank = Math.floor(sales * 365 / days);
    return { ...item, rank };
  });

  return res;
};

export const getThemeIdsForProfile = (id, api) => {
  return new Promise((resolve, reject) => {
    api(`themes/queries/qProfiles_id/${id}`).then(
      res => {
        resolve(res);
      },
      err => {
        reject(err);
      }
    );
  });
};

export const addThemeIdsListForProfile = (id, api, list) => {
  return new Promise((resolve, reject) => {
    api
      .put(`queryProfile/${id}`, {
        results: list
      })
      .then(
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      );
  });
};

export const saveThemeStageYtoResZ = (
  dispatch,
  dataArr,
  stage,
  byid = false
) => {
  const stageName = ["One", "Two", "Three"];
  let data = dataArr;
  let suffix = "Result";
  if (byid) {
    data = transformArrToById(dataArr, "title");
    suffix = "ResById";
  }
  const key = `stage${stageName[stage - 1]}${suffix}`;

  dispatch({
    type: SAVE_THEMES_STAGE_Y_TO_RES_Z,
    payload: {
      [key]: data
    }
  });
};
