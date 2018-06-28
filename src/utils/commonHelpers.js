import moment from "moment";
import React from "react";

export const transformArrToDataTable = source => {
  const res = {
    data: [],
    columns: []
  };
  Object.keys(source[0]).forEach(el => {
    res.columns.push({
      Header: el.toUpperCase(),
      accessor: el
    });
  });
  res.data = source;
  return res;
};

export const transformArrToById = (arr, key) => {
  let res = {};
  arr.forEach((item, transformKey) => {
    res[item.key] = { ...item, transformKey };
  });
  return res;
};

export const inputfilterCollFromServer = (list, type) => {
  let res = [...list];
  res = res.map(item => {
    if (type === "themes") {
      delete item.lastRevDate;
      delete item.revisions;
      delete item.__v;
      item.tags = item.tags.join(", ");
    }
    return item;
  });
  return res;
};

const addFormatedFild = (source, xFild, yName) => {
  const res = source.map(item => {
    const fild = item[xFild];
    const formatUpdated = moment(fild).format("DD MMM YYYY");
    return { ...item, [yName]: formatUpdated };
  });

  return res;
};

export const formatDate = val => {
  return moment(val).format("DD MMM YYYY");
};

export const customFiltredFilds = (source, filds) => {
  let res = [];
  source.forEach(item => {
    const newItem = {};
    filds.forEach(fild => {
      newItem[fild] = item[fild];
    });

    res.push(newItem);
  });

  return res;
};

export const customTransformArrToDataTable = source => {
  const res = {
    data: [],
    columns: []
  };
  Object.keys(source[0]).forEach(el => {
    let newCol = {
      Header: el.toUpperCase(),
      accessor: el
    };
    if (el === "url") {
      newCol.Cell = ({ value }) => {
        // console.log('row', row);
        return (
          <a href={value} style={{ color: "red" }}>
            {value}
          </a>
        );
      };
    }
    if (el === "sales" || el === "rank" || el === "createdTheme") {
      newCol.maxWidth = 100;
    }

    res.columns.push(newCol);
  });
  res.data = source;
  return res;
};
