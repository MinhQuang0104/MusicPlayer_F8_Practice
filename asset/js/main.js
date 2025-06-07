const MUSIC_CONFIG = "Music_Player_App"

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const playlist = $(".playlist");
const progress = $(".progress");
const heading = $("h2");
const cd = $(".cd");
const cd_thumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const songList = $$(".song");
const volume = $(".volume");
// const volumeTrack = $(".volume::-webkit-slider-runnable-track");
const volume_icons = $(".volume_icons");
const btn_mute = $(".btn_mute");

const app = {
    currentIndex: 0,
    isPlay: false,
    isRandom: false,
    isRepeat: false,
    isMute: false,
    volumeValue: 0,
    musicPosition: 0,
    config: JSON.parse(localStorage.getItem(MUSIC_CONFIG)) || {},

    arrayRandomSong: [],

    songs: [
        {
            title: "Dù Cho Tận Thế",
            author: "Erik",
            img: "./asset/img/img1.jpg",
            song: "./asset/song/song1.mp3",
        },
        {
            title: "Từng Ngày Yêu Em",
            author: "buitruonglinh",
            img: "./asset/img/img2.jpg",
            song: "./asset/song/song2.mp3",
        },
        {
            title: "Lần Đầu Tiên",
            author: "Emcee L(Da LAB),Muộii",
            img: "./asset/img/img3.jpg",
            song: "./asset/song/song3.mp3",
        },
        {
            title: "Lễ Đường",
            author: "Kai Dinh",
            img: "./asset/img/img4.jpg",
            song: "./asset/song/song4.mp3",
        },
        {
            title: "Buộc Vào Cơn Gió",
            author: "Vy Vy",
            img: "./asset/img/img5.jpg",
            song: "./asset/song/song5.mp3",
        },
        {
            title: "Nếu Ngày Ấy",
            author: "SOOBIN",
            img: "./asset/img/img6.jpg",
            song: "./asset/song/song6.mp3",
        },
        {
            title: "Tháng Năm",
            author: "SOOBIN",
            img: "./asset/img/img7.jpg",
            song: "./asset/song/song7.mp3",
        },
        {
            title: "Anh Chưa Từng Hết Yêu",
            author: "buitruonglinh",
            img: "./asset/img/img8.jpg",
            song: "./asset/song/song8.mp3",
        },
        {
            title: "Ngày Đầu Tiên",
            author: "Đức Phúc",
            img: "./asset/img/img9.jpg",
            song: "./asset/song/song9.mp3",
        }

    ],

    addArrayRandom(index) {
        this.arrayRandomSong.push(index);
        if (this.arrayRandomSong.length == this.songs.length) {
            // xóa tất cả phần tử trong mảng 
            this.arrayRandomSong.splice(0);
        }
    },

    definedProperties() {
        const _this = this;
        Object.defineProperty(_this, "currentSong", {
            configurable: true,
            // enumerable: true,
            get() {
                return _this.songs[_this.currentIndex];
            }
        })
    },

    handleEvents() {
        const _this = this;
        // CD Rotate
        const cdAinmate = cd.animate({
            transform: "rotate(360deg)"
        }, {
            duration: 10000,
            iterations: Infinity
        });
        cdAinmate.pause();

        // Xử lý thanh cuộn 
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const currentScroll = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - Math.floor(currentScroll);
            cd.style.width = newWidth < 0 ? 0 : newWidth + "px";
        }

        // Xử lý play button, play, pause 
        playBtn.onclick = function () {
            if (_this.isPlay) {
                audio.pause();
            } else {
                // Thêm phần xử lý phát bài hát khi có thêm chức năng lưu vị trí phát bài hát trước đó
                if(_this.musicPosition == 0)
                    audio.play();
                else {
                    audio.currentTime = _this.musicPosition * audio.duration / 100;
                    audio.play();
                }
            }
        }
        audio.onplay = function () {
            _this.isPlay = true;
            player.classList.toggle("playing", _this.isPlay);
            cdAinmate.play();
        }
        audio.onpause = function () {
            _this.isPlay = false;
            player.classList.toggle("playing", _this.isPlay);
            cdAinmate.pause();
        }

        // Seek
        function setSeek() {
            const progressPercent = audio.currentTime * 100 / audio.duration;
            // console.log(Math.floor(progressPercent));
            if (progressPercent) {
                progress.value = Math.floor(progressPercent);
            }
            _this.musicPosition = Number(progress.value);
            console.log("Music position: " + _this.musicPosition)
            _this.setConfig();
        }
        audio.ontimeupdate = setSeek;

        // Xử lý khi tua, việc set ontimpeupdate = function rỗng nhắm giải quyết vấn đề lỗi khi tua bài hát  
        progress.oninput = function () {
            audio.ontimeupdate = function () { };
        }
        progress.onchange = function () {
            audio.ontimeupdate = setSeek;
            const updateTime = progress.value * audio.duration / 100;
            audio.currentTime = updateTime;
            // test cập nhật giá trị cho biến musicPosition nhằm lưu tiến tình bài hát vào local storage 
            
        }

        // Next button 
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.RandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
        }

        // Prev button 
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.RandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
        }

        // Random button 
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
            _this.setConfig();
        }

        // Repeat button 
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
            _this.setConfig();
        }

        // Ended song 
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Play song when click 
        playlist.onclick = function (e) {
            const currentSong = e.target.closest(".song:not(.active)")
            if (currentSong || e.target.closest(".option")) {
                if (e.target.closest(".option")) {
                    // Xử lý khi click vào option
                }
                else if (currentSong) {
                    // Xử lý chuyển bài 
                    _this.currentIndex = Number(currentSong.dataset.id);
                    _this.loadCurrentSong();
                    audio.play();
                }
            }
        }

        // Volume change
        volume.oninput = function () {
            // chuyeenr dooidr 0.2 = 20%, value /100 
            console.log(volume.value);
            const volumeValue = volume.value;
            audio.volume = volumeValue / 100;
            volume.style.background = `linear-gradient(to right, #000 ${volumeValue}%, var(--track-background) ${volumeValue}%)`;
            // goi ham de set lai class Volume lv de thay doi icon theo tung khoang am luong 
            console.log("volume in oninput: " + volumeValue);
            _this.setVolumeLevel(Number(volumeValue));
        }

        // Khi người dùng thay đổi âm lượng xong thì bắt sk này lại và lấy giá trị để lưu xuống local storage 
        volume.onchange = function () {
            _this.volumeValue = volume.value;
            _this.setConfig();
        }
        
        // Mute / Non Mute
        btn_mute.onclick = function () {
            _this.isMute = !_this.isMute;
            if (_this.isMute) {
                audio.volume = 0;
                volume.value = 0;
                volume.style.background = `linear-gradient(to right, #000 ${0}%, var(--track-background) ${0}%)`;
                _this.setVolumeLevel(0);
            }
            else {
                audio.volume = _this.volumeValue / 100;
                volume.value = _this.volumeValue;
                volume.style.background = `linear-gradient(to right, #000 ${_this.volumeValue}%, var(--track-background) ${_this.volumeValue}%)`;
                _this.setVolumeLevel(_this.volumeValue);
            }
            _this.setConfig();
        }
    },

    handleMute() {
        // nêu không isMute = false thì set volume dựa vào câu hình đã lấy từ local storage
        if (!this.isMute) {
            this.loadVolume();
            this.setVolumeLevel(this.volumeValue);
        } else {
            audio.volume = 0;
            volume.value = 0;
            volume.style.background = `linear-gradient(to right, #000 ${0}%, var(--track-background) ${0}%)`;
            this.setVolumeLevel(0);
        }
    },

    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentIndex = Number(this.config.currentIndex);
        this.volumeValue = Number(this.config.volumeValue);
        this.isMute = this.config.isMute;
        this.musicPosition = Number(this.config.musicPosition);
    },

    loadVolume() {
        audio.volume = this.volumeValue / 100;
        volume.value = this.volumeValue;
        volume.style.background = `linear-gradient(to right, #000 ${this.volumeValue}%, var(--track-background) ${this.volumeValue}%)`;
    },

    loadCurrentSong() {
        heading.textContent = this.currentSong.title;
        cd_thumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.song;

        // gỡ song active ở trước (nếu có) và active cho song hiện tại (current song)           
        $(".song.active").classList.remove("active");
        const newAcitveSong = $(`[data-id="${this.currentIndex}"]`)
        newAcitveSong.classList.add("active");

        // scroll into view 
        if (newAcitveSong.dataset.id <= 2) {
            newAcitveSong.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        } else {
            newAcitveSong.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            })
        }

        // gọi setConfig để lưu lại curent index mỗi khi chuyển bài 
        this.setConfig();
    },

    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    RandomSong() {
        var newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex || this.arrayRandomSong.includes(newIndex))
        this.currentIndex = newIndex;
        this.addArrayRandom(newIndex);
        this.loadCurrentSong();

    },

    renderSong() {
        const html = this.songs.map((curr, index) => {
            return `
            <div class="song ${index == this.currentIndex ? "active" : ""}" data-id="${index}">
          <div class="thumb" style="background-image: url('${curr.img}')">
          </div>
          <div class="body">
            <h3 class="title">${curr.title}</h3>
            <p class="author">${curr.author}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
            `;
        }).join("");
        playlist.innerHTML = html;
    },

    start() {
        this.loadConfig();
        this.definedProperties();
        this.renderSong();
        this.loadCurrentSong();
        this.handleEvents();
        this.handleMute();
        
        // Kích hoạt active với các button: random, repeat
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
        // set position cho thanh progress khi load trang
        progress.value = this.musicPosition;
    },

    setConfig() {
        // console.log("in setConfig Function")
        this.config["isRandom"] = this.isRandom;
        this.config["isRepeat"] = this.isRepeat;
        this.config["currentIndex"] = this.currentIndex;
        this.config["volumeValue"] = this.volumeValue;
        this.config["isMute"] = this.isMute;
        this.config["musicPosition"] = this.musicPosition;
        localStorage.setItem(MUSIC_CONFIG, JSON.stringify(this.config));
    },

    // Hàm xử lý với icon thanh âm lượng 
    setVolumeLevel(value) {
        var _this = this
        if(value != 0) 
            _this.isMute = false
        var lv;

        //gỡ class lv volume trước khi set lại (nếu tồn tại)
        volume_icons.classList.remove("lv0")
        volume_icons.classList.remove("lv1")
        volume_icons.classList.remove("lv2")
        volume_icons.classList.remove("lv3")

        // Kiểm tra 4 khoảng của value và set lv để chuẩn bị chèn class vào DOM  
        if (value == 0) 
            lv = 'lv0'
        if (value > 0 && value <= 20) 
            lv = 'lv1'
        if (value > 20 && value <= 80) 
            lv = 'lv2'
        if (value > 80 && value <= 100) 
            lv = 'lv3'
        console.log("value in set volume: " + value);
        volume_icons.classList.add(lv);
    }
};

app.start();