const { src, dest } = require("gulp");
var replace = require("gulp-replace");
var dayjs = require("dayjs");
var rename = require("gulp-rename");
var exec = require("gulp-exec");

const [, , , _textflag, text, _userflag, user] = process.argv;

if (!text) {
  throw new Error("Expected cli parameter for tweet text.");
}

const userConfig = {
  taj: {
    name: "Taj",
    username: "taj1944",
    profile:
      "https://pbs.twimg.com/profile_images/467925053003141121/YHJh_prH_bigger.jpeg",
  },
  wyatt: {
    name: "Wyatt Arndt",
    username: "TheStanchion",
    profile:
      "https://pbs.twimg.com/profile_images/1393355825779904513/P9Yf9thi_bigger.jpg",
  },
  dhaliwal: {
    name: "Rick Dhaliwal",
    username: "DhaliwalSports",
    profile:
      "https://pbs.twimg.com/profile_images/1434613472533393419/Oo07rZop_200x200.jpg",
  },
  aquilini: {
    name: "Francesco Aquilini",
    username: "fr_aquilini",
    profile:
      "https://pbs.twimg.com/profile_images/824422612428156928/vAGj5vjs_200x200.jpg",
  },
  drance: {
    name: "Thomas Drance",
    username: "thomasdrance",
    profile:
      "https://pbs.twimg.com/profile_images/1450924119038562312/vn1wsmWf_200x200.jpg",
  },
  jpat: {
    name: "Jeff Paterson",
    username: "patersonjeff",
    profile:
      "https://pbs.twimg.com/profile_images/1342626630078906368/4V7-wbFn_200x200.jpg",
  },
  sat: {
    name: "Satiar Shah",
    username: "SatiarShah",
    profile:
      "https://pbs.twimg.com/profile_images/1089338815607562246/cjAH4g_q_200x200.jpg",
  },
  bulis: {
    name: "Daniel Wagner",
    username: "passittobulis",
    profile:
      "https://pbs.twimg.com/profile_images/1219683243978412032/210zOrqY_200x200.jpg",
  },
};

function generateTask(cb) {
  const day = dayjs();
  const selectedUser = userConfig[user];

  if (!selectedUser) {
    throw new Error('Unknown user "' + user + '"');
  }

  const timestamp =
    day.format("h:mm A") + " &middot; " + day.format("DD/MM/YYYY");

  const filename = user + "-" + day.valueOf();

  return src("template/index.html")
    .pipe(replace(/\|INPUT\-TEXT\|/g, text))
    .pipe(replace(/\|INPUT\-DATE\|/g, timestamp))
    .pipe(replace(/\|INPUT\-IMG\|/g, selectedUser.profile))
    .pipe(replace(/\|INPUT\-NAME\|/g, selectedUser.name))
    .pipe(replace(/\|INPUT\-USERNAME\|/g, selectedUser.username))
    .pipe(
      rename({
        basename: filename,
      })
    )
    .pipe(dest("output/html/"))
    .pipe(
      exec(
        "wkhtmltoimage --crop-w 550 --quality 99 " +
          " ./output/html/" +
          filename +
          ".html ./output/" +
          filename +
          ".png"
      )
    );
}

exports.generate = generateTask;

function defaultTask(cb) {}

exports.default = defaultTask;
