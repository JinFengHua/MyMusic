Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 播放状态
    action: {
      method: "play"
    },
    // 歌曲id
    id: "",
    // 所有歌曲id
    ids: [],
    // 当前歌曲状态
    state: "running",
    // 当前模式
    mode: "single",
    // 保存歌曲信息
    song: null,
    //定义一个歌词数组
    lyricArray: [],
    //竖向滚动条位置初始值为0
    marginTop: 0,
    //记录当前唱到的行号
    currentIndex: 0,
    //播放时间
    playTime: "00:00",
    //结束时间
    endTime: "00:00",
    //歌曲进度条最大值
    max: 100,
    //进度条读取移动的值
    move: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setNavigationBarTitle({
      title: '歌曲详情页' //修改title
    })
    var id = options.id;
    var idStr = options.ids;
    var ids = idStr.split(",");
    this.setData({
      id: id,
      ids: ids
    })
    this.getSongInfoById();
    this.getLyricById();
  },

  // 通过id获取歌曲详细内容
  getSongInfoById: function() {
    var id = this.data.id;
    var that = this;
    wx.request({
      url: 'https://music.163.com/api/song/detail/?id=' + id + '&ids=[' + id + ']',
      success: function(res) {
        var songinfo = res.data.songs[0];
        that.setData({
          song: songinfo
        })
      }
    })
  },

  // 通过id获得歌词
  getLyricById: function() {
    var that = this;
    var id = this.data.id;
    wx.request({
      url: 'https://music.163.com/api/song/lyric?id=' + id + '&lv=-1&kv=-1&tv=-1',
      success: function(res) {
        if (res.data.lrc.lyric) {
          var lyrics = res.data.lrc.lyric;
          var result = that.parseLyric(lyrics);
          that.setData({
            lyricArray: result
          })
        }
      }
    })
  },

  // 解析歌词,获得包含播放时间和歌词的数组
  parseLyric: function(lyrics) {
    var lyricResult = [];
    var lyricArray = lyrics.split("\n");
    if (lyricArray[lyricArray.length - 1] == "") {
      lyricArray.pop();
    }

    var pattern = /\[\d{2}:\d{2}\.\d{2,3}\]/;

    lyricArray.forEach(function(v, i, a) {
      var real_lyric = v.replace(pattern, "");
      var time = v.match(pattern);
      if (time != null) {
        var timeResult = time[0].slice(1, -1);
        var timeArray = timeResult.split(":");
        var finalTime = parseFloat(timeArray[0]) * 60 + parseFloat(timeArray[1]);
        lyricResult.push([finalTime, real_lyric]);
      }
    })
    return lyricResult;
  },

  // 播放进度改变时触发，实现歌词同步
  changeTime: function(e) {
    var currentTime = e.detail.currentTime;
    var duration = e.detail.duration;
    var playMinutes = Math.floor(currentTime / 60);
    var playSeconds = Math.floor(currentTime % 60);
    var endMinutes = Math.floor(duration / 60);
    var endSeconds = Math.floor(duration % 60);
    var max = duration;
    var move = currentTime;
    if (playMinutes < 10) {
      playMinutes = "0" + playMinutes;
    }
    if (endMinutes < 10) {
      endMinutes = "0" + endMinutes;
    }
    if (playSeconds < 10) {
      playSeconds = "0" + playSeconds;
    }
    if (endSeconds < 10) {
      endSeconds = "0" + endSeconds;
    }
    this.setData({
      playTime: playMinutes + ":" + playSeconds,
      endTime: endMinutes + ":" + endSeconds,
      max: max,
      move: move
    })

    var lyricArray = this.data.lyricArray;
    if (this.data.currentIndex >= 8) {
      this.setData({
        marginTop: (this.data.currentIndex - 8) * 22
      })
    } else {
      this.setData({
        marginTop: 0
      })
    }
    if (this.data.currentIndex == lyricArray.length - 2) {
      if (currentTime >= lyricArray[lyricArray.length - 1][0]) {
        this.setData({
          currentIndex: lyricArray.length - 1
        })
      }
    } else {
      for (var i = 0; i < lyricArray.length - 1; i++) {
        if (currentTime >= lyricArray[i][0] && currentTime < lyricArray[i + 1][0]) {
          this.setData({
            currentIndex: i
          })
        }
      }
    }
  },

  // 拖动进度条
  drag: function(e) {
    var value = e.detail.value;
    this.setData({
      move: value,
      action: {
        method: "setCurrentTime",
        data: value
      }
    })
  },

  // 控制音乐的暂停与播放
  playOrPause: function() {
    var musicState = this.data.state;
    if (musicState == 'running') {
      this.setData({
        action: {
          method: "pause"
        },
        state: "paused"
      })
    } else {
      this.setData({
        action: {
          method: "play"
        },
        state: "running"
      })
    }
  },

  // 切换上一曲
  prevSong: function() {
    var id = this.data.id;
    var index = 0;
    for (var i = 0; i < this.data.ids.length; i++) {
      if (id == this.data.ids[i]) {
        index = i;
        break;
      }
    }
    var prevIndex = index == 0 ? this.data.ids.length - 1 : index - 1;
    var prevId = this.data.ids[prevIndex];
    this.setData({
      id: prevId
    })

    this.setData({
      action: this.data.action,
      marginTop: 0,
      currentIndex: 0,
      lyricArray:[]
    })
    this.getSongInfoById();
    this.getLyricById();
  },

  // 切换下一曲
  nextSong: function() {
    var id = this.data.id;
    var index = 0;
    for (var i = 0; i < this.data.ids.length; i++) {
      if (id == this.data.ids[i]) {
        index = i;
        break;
      }
    }
    var nextIndex = index == this.data.ids.length - 1 ? 0 : index + 1;
    var nextId = this.data.ids[nextIndex];
    this.setData({
      id: nextId
    })

    this.setData({
      action: this.data.action,
      marginTop: 0,
      currentIndex: 0,
      lyricArray:[]
    })
    this.getSongInfoById();
    this.getLyricById();
  },

  // 切换播放模式
  changeMode: function() {
    var mode = this.data.mode;
    if (mode == "single") {
      this.setData({
        mode: "loop"
      })
    } else {
      this.setData({
        mode: "single"
      })
    }
  },

  // 当前歌曲播放完毕继续播放下一首
  changeMusic: function() {
    var mode = this.data.mode;
    if (mode == 'single') {
      this.setData({
        id: this.data.id
      })
    } else {
      this.nextSong();
    }
    this.setData({
      action: {
        method: "play"
      },
      marginTop: 0,
      currentIndex: 0
    })
  },

  // 跳转到评论页面
  showComment: function() {
    var commentId = this.data.song.commentThreadId;
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