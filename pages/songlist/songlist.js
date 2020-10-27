// pages/songllist/songlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //定义变量存储搜索关键字
    kw: '',
    //定义歌曲数组存储搜索结果
    songs: [],
    //定义存储封面的数组
    albumPicUrls: [],
    //定义存放mv的数组
    mvs: [],
    //定义查询条数的变量
    limit: 5
  },

  // 获取输入框的搜索项
  getKeyWord: function(e) {
    var keyword = e.detail.value;
    this.setData({
      kw: keyword
    })
  },

  // 进行搜索
  doSearch: function() {
    var kw = this.data.kw;
    if(kw==''){
      wx.showToast({
        title: '请输入搜索关键字',
        image: '/images/error.png',
        duration: 2000,
        mask: true,
      })
      return;
    }
    var that = this;
    var searchIds = [];
    var songnames = [];
    var artists = [];
    // 存放作者们的名字
    var artistsName = [];
    wx.request({
      url: 'https://music.163.com/api/search/get?s=' + kw + '&type=1&limit=' + that.data.limit,
      success: function(res) {
        var resultSongs = res.data.result.songs;
        for (var i = 0; i < resultSongs.length; i++) {
          var temp_name = '';
          searchIds.push(resultSongs[i].id);
          songnames.push(resultSongs[i].name);
          artists.push(resultSongs[i].artists[0].id)
          if (resultSongs[i].artists.length > 1) {
            for (var j = 1; j < resultSongs[i].artists.length; j++) {
              temp_name = temp_name + ' | ' + resultSongs[i].artists[j].name
            }
          }
          temp_name = resultSongs[i].artists[0].name + temp_name
          artistsName.push(temp_name);
        }
        that.setData({
          albumPicUrls: [],
          mvs: [],
          artistsName:artistsName
        })
        that.getMusicImage(searchIds, 0, searchIds.length);
        that.setData({
          songs: resultSongs
        })
      }
    })
  },

  //  获得歌曲专辑封面
  getMusicImage: function (searchIds, i, length) {
    var albumPicUrls = this.data.albumPicUrls;
    var mvs = this.data.mvs;
    var that = this;
    wx.request({
      url: 'https://music.163.com/api/song/detail/?id=' + searchIds[i] + '&ids=[' + searchIds[i] + ']',
      success: function (res) {
        var albumPic = res.data.songs[0].album.picUrl;
        var name = res.data.songs[0].album.name;
        var mvid = res.data. songs[0].mvid
        albumPicUrls.push(albumPic);
        mvs.push([i,mvid]);
        that.setData({
          albumPicUrls: albumPicUrls,
          mvs:mvs
        })
        
        if (++i < length) {
          that.getMusicImage(searchIds, i, length);
        }
      }
    })
  },


// 跳转到播放音乐页面
  goToPlay:function(e){
    var id = e.currentTarget.dataset.id;
    var ids = [];
    for(var i=0;i<this.data.songs.length;i++){
      ids.push(this.data.songs[i].id)
    }
    wx.navigateTo({
      url: '../playsong/playsong?id=' + id +'&ids=' + ids,
    })
  },

  // 跳转到播放mv页面
  goToMv: function (e) {
    var mvid = e.currentTarget.dataset.mvid;
    var ids = [];
    for (var i = 0; i < this.data.songs.length; i++) {
      ids.push(this.data.songs[i].id)
      if (mvid == this.data.songs[i].mvid) {
        var songid = this.data.songs[i].id;
      }
    }
    wx.navigateTo({
      url: '../playmv/playmv?mvid=' + mvid + '&songid=' + songid + '&ids=' + ids,
    })
  },

  // 跳转到排行页面
  goToRank:function(e){
    var id = e.currentTarget.dataset.rank;
    wx.navigateTo({
      url: '../rank/rank?id='+id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '首页'  //修改title
    })
    wx.hideHomeButton();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    var kw = this.data.kw;
    if(kw){
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
        duration: 2000,
        mask: true,
        success:function(){
          // 调用搜索更多的方法
          that.searchMore();
        }
      })
      wx.hideToast();
    }
  },

// 查找更多
searchMore:function(){
  //定义空数组存储搜索出来的所有id
  var searchIds = [];
  //定义存放歌曲名称的数组
  var names = [];
  //定义存储歌手id的数组
  var artists = [];
  // 定义存储歌手名
  var artistsName = [];
  //获取查询条数
  var limit = this.data.limit;
  var that = this;
  limit = limit + 5;
  this.setData({
    limit: limit
  })
  wx.request({
    url: 'https://music.163.com/api/search/get?s=' + that.data.kw + '&type=1&limit=' + that.data.limit,
    success: function (res) {
      //搜索结果
      var resultSongs = res.data.result.songs;
      //遍历resultSongs
      for (var i = 0; i < resultSongs.length; i++) {
        var temp_name = '';
        //将搜索出的id添加到searchIds
        searchIds.push(resultSongs[i].id);
        //将搜索出的歌曲名称添加到names中
        names.push(resultSongs[i].name);
        //将搜索出的歌手id添加到artists中
        artists.push(resultSongs[i].artists[0].id);
        // 将搜索的歌手名添加到artistsName中
        if (resultSongs[i].artists.length > 1) {
          for (var j = 1; j < resultSongs[i].artists.length; j++) {
            temp_name = temp_name + ' | ' + resultSongs[i].artists[j].name
          }
        }
        temp_name = resultSongs[i].artists[0].name + temp_name
        artistsName.push(temp_name);
      }
      //清空封面数组
      that.setData({
        albumPicUrls: [],
        mvs: [],
        artistsName:artistsName
      })
      //调用查询封面的方法
      that.getMusicImage(searchIds, 0, searchIds.length);
      
      that.setData({
        songs: resultSongs
      })
    }
  })
},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})