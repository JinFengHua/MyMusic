// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs:[],
    title:[
      { 'name':'云音乐飙升榜',
        'id':'19723756',
      'img':'/images/biaosheng.png',
      'detail':'云音乐中每天热度上升最快的100收单曲。每天更新。',
        'color':'#5380B9'
      },
      {
        'name': '云音乐新歌榜',
        'id': '3779629',
        'img': '/images/xinge.png',
        'detail': '云音乐新歌榜：云音乐用户一周内收听所有新歌（一个月内最新发行）官方TOP排行榜。每天更新。',
        'color': '#449FA4'
      },
      {
        'name': '云音乐热歌榜',
        'id': '3778678',
        'img': '/images/rege.png',
        'detail': '云音乐热歌榜：云音乐用户一周内收听所有线上歌曲 官方TOP排行榜。每周四更新。',
        'color': '#9D5143'
      },
      {
        'name': '网易原创歌曲榜',
        'id': '2884035',
        'img': '/images/yuanchuang.png',
        'detail': '云音乐独立原创音乐人作品官方榜单，以推荐优秀原创作品为目的。每周四网易云音乐首发。',
        'color': '#AD4260'
      }
      ]
  },

// 获得榜单的歌曲列表
  getRankById:function(id){
    var songInfo=[];
    var that = this;
    wx:wx.request({
      url: 'https://music.163.com/api/playlist/detail?id='+id,
      success: function(res) {
        var songs = res.data.result.tracks;
        for(var i=0;i<songs.length;i++){
          var temp = '';
          var mv = 0;
          var sid = songs[i].id;
          var sname = songs[i].name;
          for (var j = 1; j < songs[i].artists.length;j++){
            temp = temp + '|' + songs[i].artists[j].name;
          }
          var artists = songs[i].artists[0].name + temp;
          mv = songs[i].mvid;
          var albumName = songs[i].album.name
          // songinfo中每一组包含歌曲id，歌名，作者名、mvid和专辑名
          songInfo.push([sid,sname,artists,mv,albumName])
        }
        that.setData({
          songs:songInfo
        })
      }
    })
  },

  // 判断榜单类型
  chooseType:function(id){
     for(var i=0;i<4;i++){
       if(id == this.data.title[i].id){
         return i;
       }
     }
  },

  // 跳转到播放音乐页面
  goToPlay: function (e) {
    var id = e.currentTarget.dataset.id;
    var ids = [];
    for (var i = 0; i < this.data.songs.length; i++) {
      ids.push(this.data.songs[i][0])
    }
    wx.navigateTo({
      url: '../playsong/playsong?id=' + id + '&ids=' + ids,
    })
  },

  // 跳转到播放mv页面
  goToMv: function (e) {
    var mvid = e.currentTarget.dataset.mvid;
    var ids = [];
    for (var i = 0; i < this.data.songs.length; i++) {
      ids.push(this.data.songs[i][0])
      if (mvid == this.data.songs[i][3]) {
        var songid = this.data.songs[i][0];
      }
    }
    wx.navigateTo({
      url: '../playmv/playmv?mvid=' + mvid + '&songid=' + songid+'&ids='+ids,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '榜单详情页'  //修改title
    })
    var id = options.id;
    var index = this.chooseType(id)
    this.getRankById(id);
    this.setData({
      index:index
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})