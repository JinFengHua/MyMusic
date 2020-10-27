// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topComments:[],
    hotComments:[],
    comments:[],
    offset:0,
    total:''
  },

  getCommentsById:function(id,offset){
    var topComments = this.data.topComments;
    var hotComments = this.data.hotComments;
    var comments = this.data.comments;
    var that = this;
    var util = require('../../utils/util.js')
    var username = '';
    var avatar = '';
    var time = '';
    var content = '';
    var likedCount = '';
    wx.request({
      url: 'http://music.163.com/api/v1/resource/comments/'+id+'?limit=20&offset='+offset,
      success:function(res){
        if(offset==0){
          for(var i=0;i<res.data.topComments.length;i++){
            username = res.data.topComments[i].user.nickname;
            avatar = res.data.topComments[i].user.avatarUrl;
            time = util.js_date_time(res.data.topComments[i].time);
            content = res.data.topComments[i].content;
            likedCount = res.data.topComments[i].likedCount;
            topComments.push([username,avatar,time,content,likedCount]);
          }
          for (var i = 0; i < res.data.hotComments.length; i++) {
            username = res.data.hotComments[i].user.nickname;
            avatar = res.data.hotComments[i].user.avatarUrl;
            time = util.js_date_time(res.data.hotComments[i].time);
            content = res.data.hotComments[i].content;
            likedCount = res.data.hotComments[i].likedCount;
            hotComments.push([username, avatar, time, content, likedCount]);
          }
        }
        for (var i = 0; i < res.data.comments.length; i++) {
          username = res.data.comments[i].user.nickname;
          avatar = res.data.comments[i].user.avatarUrl;
          time = util.js_date_time(res.data.comments[i].time);
          content = res.data.comments[i].content;
          likedCount = res.data.comments[i].likedCount;
          comments.push([username, avatar, time, content, likedCount])
        }
        that.setData({
          topComments:topComments,
          hotComments:hotComments,
          comments:comments,
          offset:offset+20,
          total: res.data.total
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '评论详情页'  //修改title
    })
    var commentId = options.commentId;
    this.getCommentsById(commentId,this.data.offset);
    this.setData({
      commentId:commentId
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
   * 下拉搜索更多评论
   */
  onReachBottom: function () {
    var that = this;
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 2000,
      mask: true,
      success: function () {
        // 调用搜索评论的方法
        that.getCommentsById(that.data.commentId, that.data.offset);
      }
    })
    wx.hideToast();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})