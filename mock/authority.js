import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    userNo: `test00${i}`,
    nickName: `Tom${i}`,
    realName: `小明${i}`,
    updator: `updator${i}`,
    updateTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    creator: `creator${i}`,
    createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    delFlag: 1,
  });
}


function queryUser(req, res, u) {
  let url = u;
  if ( !url || Object.prototype.toString.call( url ) !== '[object String]' ) {
    url = req.url;
  } 
  
  const params = parse( url, true ).query;
  
  let dataSource = tableListDataSource;
  
  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend'){
        return next[s[0]] - prev[s[0]];
      }

      return prev[s[0]] - next[s[0]];
    });
  }

  // if (params.status) {
  //   const status = params.status.split(',');
  //   let filterDataSource = [];
  //   status.forEach(s => {
  //     filterDataSource = filterDataSource.concat(
  //       dataSource.filter( data => parseInt(data.status) )
  //     );
  //   })
  // }

  let pageSize = 10;
  if (params.pageSize){
    pageSize = params.pageSize * 1;
  }

  const  result = {
    code : 200,
    msg : '查询成功',
    data : {
      list: dataSource,
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
      },
    };

  return res.json(result);
}

export default {
  'GET /authority/user/queryUser' : queryUser,
}
