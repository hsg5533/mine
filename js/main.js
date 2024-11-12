let size = 10,
  bombFrequency = 0.2,
  tileSize = 60;
const board = document.querySelectorAll(".board")[0];
let tiles, boardSize;
const restartBtn = document.querySelectorAll(".btn")[0],
  endscreen = document.querySelectorAll(".endscreen")[0],
  boardSizeBtn = document.getElementById("boardSize"),
  tileSizeBtn = document.getElementById("tileSize"),
  difficultyBtns = document.querySelectorAll(".difficulty");
let bombs = [],
  numbers = [],
  numberColors = [
    "#3498db",
    "#2ecc71",
    "#e74c3c",
    "#9b59b6",
    "#f1c40f",
    "#1abc9c",
    "#34495e",
    "#7f8c8d",
  ],
  endscreenContent = {
    win: "<span>✔</span> you won!",
    loose: "💣 Booom! Game over.",
  },
  gameOver = !1;
const clear = () => {
    (gameOver = !1),
      (bombs = []),
      (numbers = []),
      (endscreen.innerHTML = ""),
      endscreen.classList.remove("show"),
      tiles.forEach((e) => {
        e.remove();
      }),
      setup();
  },
  setup = () => {
    for (let e = 0; e < Math.pow(size, 2); e++) {
      let t = document.createElement("div");
      t.classList.add("tile"), board.appendChild(t);
    }
    (boardSize = Math.sqrt(
      (tiles = document.querySelectorAll(".tile")).length
    )),
      (board.style.width = boardSize * tileSize + "px"),
      document.documentElement.style.setProperty("--tileSize", `${tileSize}px`),
      document.documentElement.style.setProperty(
        "--boardSize",
        `${boardSize * tileSize}px`
      );
    let l = 0,
      i = 0;
    tiles.forEach((e, t) => {
      e.setAttribute("data-tile", `${l},${i}`);
      Math.random() < bombFrequency &&
        (bombs.push(`${l},${i}`),
        l > 0 && numbers.push(`${l - 1},${i}`),
        l < boardSize - 1 && numbers.push(`${l + 1},${i}`),
        i > 0 && numbers.push(`${l},${i - 1}`),
        i < boardSize - 1 && numbers.push(`${l},${i + 1}`),
        l > 0 && i > 0 && numbers.push(`${l - 1},${i - 1}`),
        l < boardSize - 1 &&
          i < boardSize - 1 &&
          numbers.push(`${l + 1},${i + 1}`),
        i > 0 && l < boardSize - 1 && numbers.push(`${l + 1},${i - 1}`),
        l > 0 && i < boardSize - 1 && numbers.push(`${l - 1},${i + 1}`)),
        ++l >= boardSize && ((l = 0), i++),
        (e.oncontextmenu = function (t) {
          t.preventDefault(), flag(e);
        }),
        e.addEventListener("click", function (t) {
          clickTile(e);
        });
    }),
      numbers.forEach((e) => {
        let t = e.split(","),
          l = document.querySelectorAll(
            `[data-tile="${parseInt(t[0])},${parseInt(t[1])}"]`
          )[0],
          i = parseInt(l.getAttribute("data-num"));
        i || (i = 0), l.setAttribute("data-num", i + 1);
      });
  },
  flag = (e) => {
    gameOver ||
      e.classList.contains("tile--checked") ||
      (e.classList.contains("tile--flagged")
        ? ((e.innerHTML = ""), e.classList.remove("tile--flagged"))
        : ((e.innerHTML = "🚩"), e.classList.add("tile--flagged")));
  },
  clickTile = (e) => {
    if (
      gameOver ||
      e.classList.contains("tile--checked") ||
      e.classList.contains("tile--flagged")
    )
      return;
    let t = e.getAttribute("data-tile");
    if (bombs.includes(t)) endGame(e);
    else {
      let l = e.getAttribute("data-num");
      if (null != l) {
        e.classList.add("tile--checked"),
          (e.innerHTML = l),
          (e.style.color = numberColors[l - 1]),
          setTimeout(() => {
            checkVictory();
          }, 100);
        return;
      }
      checkTile(e, t);
    }
    e.classList.add("tile--checked");
  },
  checkTile = (e, t) => {
    let l = t.split(","),
      i = parseInt(l[0]),
      r = parseInt(l[1]);
    setTimeout(() => {
      if (i > 0) {
        let e = document.querySelectorAll(`[data-tile="${i - 1},${r}"`)[0];
        clickTile(e, `${i - 1},${r}`);
      }
      if (i < boardSize - 1) {
        let t = document.querySelectorAll(`[data-tile="${i + 1},${r}"`)[0];
        clickTile(t, `${i + 1},${r}`);
      }
      if (r > 0) {
        let l = document.querySelectorAll(`[data-tile="${i},${r - 1}"]`)[0];
        clickTile(l, `${i},${r - 1}`);
      }
      if (r < boardSize - 1) {
        let s = document.querySelectorAll(`[data-tile="${i},${r + 1}"]`)[0];
        clickTile(s, `${i},${r + 1}`);
      }
      i > 0 &&
        r > 0 &&
        clickTile(
          document.querySelectorAll(`[data-tile="${i - 1},${r - 1}"`)[0],
          `${i - 1},${r - 1}`
        ),
        i < boardSize - 1 &&
          r < boardSize - 1 &&
          clickTile(
            document.querySelectorAll(`[data-tile="${i + 1},${r + 1}"`)[0],
            `${i + 1},${r + 1}`
          ),
        r > 0 &&
          i < boardSize - 1 &&
          clickTile(
            document.querySelectorAll(`[data-tile="${i + 1},${r - 1}"]`)[0],
            `${i + 1},${r - 1}`
          ),
        i > 0 &&
          r < boardSize - 1 &&
          clickTile(
            document.querySelectorAll(`[data-tile="${i - 1},${r + 1}"`)[0],
            `${i - 1},${r + 1}`
          );
    }, 10);
  },
  endGame = (e) => {
    (endscreen.innerHTML = endscreenContent.loose),
      endscreen.classList.add("show"),
      (gameOver = !0),
      tiles.forEach((e) => {
        let t = e.getAttribute("data-tile");
        bombs.includes(t) &&
          (e.classList.remove("tile--flagged"),
          e.classList.add("tile--checked", "tile--bomb"),
          (e.innerHTML = "💣"));
      });
  },
  checkVictory = () => {
    let e = !0;
    tiles.forEach((t) => {
      let l = t.getAttribute("data-tile");
      t.classList.contains("tile--checked") || bombs.includes(l) || (e = !1);
    }),
      e &&
        ((endscreen.innerHTML = endscreenContent.win),
        endscreen.classList.add("show"),
        (gameOver = !0));
  };
setup(),
  restartBtn.addEventListener("click", function (e) {
    e.preventDefault(), clear();
  }),
  boardSizeBtn.addEventListener("change", function (e) {
    (size = this.value), clear();
  }),
  tileSizeBtn.addEventListener("change", function (e) {
    (tileSize = this.value), clear();
  }),
  difficultyBtns.forEach((e) => {
    e.addEventListener("click", function () {
      (bombFrequency = this.value), clear();
    });
  });
