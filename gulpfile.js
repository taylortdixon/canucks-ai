const { src, dest, task } = require("gulp");
var replace = require("gulp-replace");
var dayjs = require("dayjs");
var rename = require("gulp-rename");
var exec = require("gulp-exec");

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
  imac: {
    name: "Iain MacIntyre",
    username: "imacSportsnet",
    profile:
      "https://pbs.twimg.com/profile_images/1303940174024290305/34JZzZuX_200x200.jpg",
  },
  pj: {
    name: "Patrick Johnston",
    username: "risingaction",
    profile:
      "https://pbs.twimg.com/profile_images/917129153496866817/HBiwQWvf_200x200.jpg",
  },
  harm: {
    name: "Harman Dayal",
    username: "harmandayal2",
    profile:
      "https://pbs.twimg.com/profile_images/1469617244954980356/HmDrZWF-_200x200.jpg",
  },
  murph: {
    name: "Dan Murphy",
    username: "sportsnetmurph",
    profile:
      "https://pbs.twimg.com/profile_images/1444468737243955201/kdMcmnrJ_200x200.jpg",
  },
  sekeres: {
    name: "Matt Sekeres",
    username: "mattsekeres",
    profile:
      "https://pbs.twimg.com/profile_images/1379181917472399362/eAMS9pz5_200x200.jpg",
  },
  price: {
    name: "Blake Price",
    username: "justBlakePrice",
    profile:
      "https://pbs.twimg.com/profile_images/1378771300697563137/vtte3X3a_200x200.jpg",
  },
};

function generateTask(user, text) {
  const day = dayjs();
  const selectedUser = userConfig[user.toLowerCase()];

  if (!selectedUser) {
    throw new Error('Unknown user "' + user + '"');
  }

  const timestamp =
    day.format("h:mm A") + " &middot; " + day.format("DD/MM/YYYY");

  const filename =
    user +
    "-" +
    text
      .match(/([a-z]+)/gi)
      .slice(0, 3)
      .join("-") +
    "-" +
    day.valueOf();

  const asciiText = text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

  return src("template/index.html")
    .pipe(replace(/\|INPUT\-TEXT\|/g, asciiText))
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
        "wkhtmltoimage --crop-w 575 --quality 99 " +
          " ./output/html/" +
          filename +
          ".html ./output/" +
          filename +
          ".png"
      )
    );
}

function defaultTask(cb) {
  require("fs").readFile("input.txt", "utf8", function (e, data) {
    data.split("\n").map(function (line) {
      const [user, ...text] = line.split(": ");
      generateTask(user, text.join(": "));
    });

    cb();
  });
}

exports.default = defaultTask;
