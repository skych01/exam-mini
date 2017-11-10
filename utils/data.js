module.exports = {
  configuration_info: configuration_info,
  roleInfo: roleInfo
}

function configuration_info() {
  var info = {
    protocol: 'http://',
    //domin_name: 'kingsun.cq7yun.com',
    //domin_name: 'weapp1.cq7yun.com/kingsun-points',
    domin_name: '16c88030h9.51mypc.cn',
   //domin_name: '192.168.2.114',
    // pathContext:'/wxd76fc8b1e5d3d2f7',
    pathContext: '',
    onLoginPath: '/login'
    //onLoginPath: '/third/miniAppService.jsp'
  }
  return info;
}

function roleInfo(){
    var info={
        employee:'ROLE_EMPLOYEE',
        admin:'ROLE_ADMIN'
    }
    return info;
}