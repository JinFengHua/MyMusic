// pages/playmv/playmv.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // mv的id
    mvid: '',
    // mv的地址
    mvAdd: [],
    // 所有清晰度MV
    mvDefinition: [],
    // mv的所有信息
    mvData: [],
    // 当前的视频清晰度
    current_Definition: '240'
  },

  // 根据mvid查询视频地址
  getMvById: function(id) {
    var that = this;
    var def = [];
    wx.request({
      url: 'http://music.163.com/api/mv/detail?id=' + id + '&type=mp4',
      success: function(res) {
        for (var key in res.data.data.brs) {
          def.push(key)
        }
        that.setData({
          mvData: res.data.data,
          mvAdd: res.data.data.brs,
          mvDefinition: def
        })
        that.setPlayCount(res.data.data.playCount)
      }
    })
  },

  // 获得相关歌曲信息
  getSongBySId: function(songid) {
    var that = this;
    wx.request({
      url: 'https://music.163.com/api/song/detail/?id=' + songid + '&ids=[' + songid + ']',
      success: function(res) {
        var sname = res.data.songs[0].name;
        var pic = res.data.songs[0].album.picUrl;
        var album = res.data.songs[0].album.name;
        var temp = '';
        for (var j = 1; j < res.data.songs[0].artists.length; j++) {
          temp = temp + '|' + res.data.songs[0].artists[j].name;
        }
        var artists = res.data.songs[0].artists[0].name + temp;
        that.setData({
          pic: pic,
          sname: sname,
          album: album,
          artists: artists
        })
      }
    })
  },

  // 选择画质
  bindPickerChange: function(e) {
    var index = this.data.mvDefinition[e.detail.value];
    this.setData({
      current_Definition: index
    })
  },

  // 美化观看人数
  setPlayCount: function(playCount) {
    if (playCount < 10000) {
      this.setData({
        viewNum: playCount
      })
    } else if (playCount > 100000000) {
      this.setData({
        viewNum: Math.floor(playCount / 100000000) + '亿'
      })
    } else {
      this.setData({
        viewNum: Math.floor(playCount / 10000) + '万'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: 'MV详情页'  //修改title
    })
    var id = options.mvid;
    var songid = options.songid;
    var ids = options.ids;
    this.setData({
      mvid: id,
      songid: songid,
      ids: ids
    })
    this.getMvById(id);
    this.getSongBySId(songid);
  },

  goToPlay: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    var ids = this.data.ids;
    wx.navigateTo({
      url: '../playsong/playsong?id=' + id + '&ids=' + ids,
    })
  },

  // 跳转到评论页面
  showComment: function () {
    var commentId = this.data.mvData.commentThreadId;
    wx.navigateTo({
      url: '../comment/comment?commentId=' + commentId,
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})