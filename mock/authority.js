import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    userNo: `test00${i}`,
    nickName: `Tom${i}`,
    realName: `小明${i}`,
    updator: `updator${i}`,
    updateTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    creator: `creator${i}`,
    createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    delFlag: 1,
    password: i,
  });
}


function getUser(req, res, u) {
  let url = u;
  if ( !url || Object.prototype.toString.call( url ) !== '[object String]' ) {
    url = req.url;
  } 
  
  const params = parse( url, true ).query;
  
  let dataSource = tableListDataSource;

  // 排序
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

  if (params.userNo) {
    dataSource = dataSource.filter(data => data.userNo.indexOf(params.userNo) > -1);
  }

  if (params.nickName) {
    dataSource = dataSource.filter(data => data.nickName.indexOf(params.nickName) > -1);
  }

  let pageSize = 10;
  if (params.pageSize){
    pageSize = params.pageSize * 1;
  }

  const  result = {
    code : 200,
    msg : '查询成功',
    data : {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    }
  };

  return res.json(result);
}

function postUser(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url;   // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method } = body;

  let method1 = method || req.method;
  switch (method1) {
    case 'DELETE':
      const { ids } = body;
      tableListDataSource = tableListDataSource.filter(item => ids.indexOf(item.userNo) === -1);
      break;
    case 'POST':
      const { id, userNo, nickName, realName, password } = body;
      // 更新
      if (id){
        tableListDataSource = tableListDataSource.map(item => {
          if (item.key === key) {
            Object.assign(item, { userNo, nickName, realName, password });
            return item;
          }
          return item;
        });
      }else {
        const i = Math.ceil(Math.random() * 10000);
        tableListDataSource.unshift({
          key: i,
          id: i,
          userNo:  userNo,
          nickName: nickName,
          realName: realName,
          updator: `updator${i}`,
          updateTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
          creator: `creator${i}`,
          createTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
          delFlag: 1,
          password: password,
        });
      }
      break;
    default:
      break;
  }

  const result = {
    code : 200,
    msg : '操作成功',
    data : {
      list: tableListDataSource,
      pagination: {
        total: tableListDataSource.length,
      },
    }
  };

  return res.json(result);
}


export default {
  'GET /authority/user/queryUser' : getUser,
  'DELETE /authority/user/removeUser' : postUser,
  'POST /authority/user/submitUser': postUser,
}
