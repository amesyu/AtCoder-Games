import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useRef, useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Game1() {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("O");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameStatus, setGameStatus] = useState("ゲーム開始");
  useEffect(() => {
    if (canvasRef.current) {
      const newCtx = canvasRef.current.getContext("2d");
      setCtx(newCtx);
      const initialBoard = [];
      for (let i = 0; i < 3; i++) {
        initialBoard[i] = [];
        for (let j = 0; j < 3; j++) {
          initialBoard[i][j] = "";
        }
      }
      setBoard(initialBoard);
    }
  }, []);
  useEffect(() => {
    if (ctx) {
      drawBoard();
    }
  }, [board, ctx]);
  const drawBoard = () => {
    if (!ctx || !canvasRef.current) return;
    const canvasWidth = 300;
    const canvasHeight = 300;
    canvasRef.current.width = canvasWidth;
    canvasRef.current.height = canvasHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const GRID_SIZE = 3;
    const CELL_SIZE = canvasWidth / GRID_SIZE;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = j * CELL_SIZE;
        const y = i * CELL_SIZE;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        if (board[i][j] === "O") {
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 3, 0, 2 * Math.PI);
          ctx.fill();
        } else if (board[i][j] === "X") {
          ctx.fillStyle = "blue";
          ctx.beginPath();
          ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  };
  const handleMouseClick = (event) => {
    if (!ctx || winner || isDraw) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const i = Math.floor(y / (canvas.height / 3));
    const j = Math.floor(x / (canvas.width / 3));
    if (board[i][j] === "") {
      const newBoard = [...board];
      newBoard[i][j] = currentPlayer;
      setBoard(newBoard);
      if (checkWinner(newBoard) == null && !isDraw) {
        aiTurn(newBoard);
      }
    }
  };
  const checkWinner = (currentBoard) => {
    const lines = [
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (currentBoard[a[0]][a[1]] && currentBoard[a[0]][a[1]] === currentBoard[b[0]][b[1]] && currentBoard[a[0]][a[1]] === currentBoard[c[0]][c[1]]) {
        setWinner(currentBoard[a[0]][a[1]]);
        setGameStatus(currentBoard[a[0]][a[1]] + "の勝ち！");
        return currentBoard[a[0]][a[1]];
      }
    }
    if (currentBoard.flat().every((cell) => cell !== "")) {
      setIsDraw(true);
      setGameStatus("引き分け！");
    }
  };
  const aiTurn = (currentBoard) => {
    const aiMove = getAiMove(currentBoard);
    if (aiMove) {
      const newBoard = [...currentBoard];
      newBoard[aiMove.i][aiMove.j] = "X";
      setBoard(newBoard);
      drawBoard();
      checkWinner(newBoard);
    }
  };
  const getAiMove = (currentBoard) => {
    const availableMoves = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === "") {
          availableMoves.push({ i, j });
        }
      }
    }
    if (availableMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }
    return null;
  };
  const handleReset = () => {
    const initialBoard = [];
    for (let i = 0; i < 3; i++) {
      initialBoard[i] = [];
      for (let j = 0; j < 3; j++) {
        initialBoard[i][j] = "";
      }
    }
    setBoard(initialBoard);
    setCurrentPlayer("O");
    setWinner(null);
    setIsDraw(false);
    setGameStatus("ゲーム開始");
  };
  return /* @__PURE__ */ jsxs("div", { className: "game-container", children: [
    /* @__PURE__ */ jsx("canvas", { ref: canvasRef, onClick: handleMouseClick }),
    /* @__PURE__ */ jsx("div", { className: "button-container", children: /* @__PURE__ */ jsx("button", { onClick: handleReset, children: "リセット" }) }),
    /* @__PURE__ */ jsx("p", { children: gameStatus })
  ] });
}
const boardSize = 19;
const cellSize = 30;
function Game2() {
  const [squares, setSquares] = useState(
    Array(boardSize * boardSize).fill(0).map(() => Math.random() > 0.5 ? 2 : 0)
  );
  const [status, setStatus] = useState("Game in Progress");
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  useEffect(() => {
    if (canvasRef.current) {
      setCtx(canvasRef.current.getContext("2d"));
    }
  }, []);
  useEffect(() => {
    if (ctx) {
      drawBoard();
    }
  }, [squares, ctx]);
  function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, boardSize * cellSize, boardSize * cellSize);
    squares.forEach((value, index) => {
      const x = index % boardSize * cellSize;
      const y = Math.floor(index / boardSize) * cellSize;
      ctx.fillStyle = value === 0 ? "white" : value === 1 ? "black" : "gray";
      ctx.fillRect(x, y, cellSize, cellSize);
      ctx.strokeRect(x, y, cellSize, cellSize);
    });
  }
  function handleClick(event) {
    var _a;
    if (!ctx || status !== "Game in Progress") return;
    const board = [...squares];
    const rect = (_a = canvasRef.current) == null ? void 0 : _a.getBoundingClientRect();
    if (!rect) return;
    let x = Math.floor((event.clientY - rect.top) / cellSize);
    let y = Math.floor((event.clientX - rect.left) / cellSize);
    let index = x * boardSize + y;
    if (board[index] !== 0) return;
    board[index] = 1;
    for (let x_ = x + 1; x_ < boardSize; x_++) {
      let p = x_ * boardSize + y;
      if (board[p] !== 1) board[p] = 1;
      else break;
    }
    for (let x_ = x - 1; x_ >= 0; x_--) {
      let p = x_ * boardSize + y;
      if (board[p] !== 1) board[p] = 1;
      else break;
    }
    for (let y_ = y + 1; y_ < boardSize; y_++) {
      let p = x * boardSize + y_;
      if (board[p] !== 1) board[p] = 1;
      else break;
    }
    for (let y_ = y - 1; y_ >= 0; y_--) {
      let p = x * boardSize + y_;
      if (board[p] !== 1) board[p] = 1;
      else break;
    }
    if (evalState(board)) {
      console.log("You Win!");
      setStatus("You Win!");
      setSquares(board);
      return;
    }
    index = calcCPU(board);
    x = Math.floor(index / boardSize);
    y = index % boardSize;
    if (board[index] !== 0) return;
    board[index] = 1;
    for (let x_ = x + 1; x_ < boardSize; x_++) {
      let p = x_ * boardSize + y;
      if (board[p] !== 1) board[p] = 1;
      else break;
    }
    for (let x_ = x - 1; x_ >= 0; x_--) {
      let p = x_ * boardSize + y;
      if (board[p] !== 1) board[p] = 1;
      else break;
    }
    for (let y_ = y + 1; y_ < boardSize; y_++) {
      let p = x * boardSize + y_;
      if (board[p] !== 1) board[p] = 1;
      else break;
    }
    for (let y_ = y - 1; y_ >= 0; y_--) {
      let p = x * boardSize + y_;
      if (board[p] !== 1) board[p] = 1;
      else break;
    }
    if (evalState(board)) {
      console.log("You Lose!");
      setStatus("You Lose!");
      setSquares(board);
      return;
    }
    setSquares(board);
  }
  function evalState(board) {
    return board.every((sq) => sq !== 0);
  }
  function calcCPU(board) {
    let buf = [];
    let dp = [];
    for (let lx = 0; lx <= boardSize; lx++) {
      dp[lx] = [];
      for (let rx = 0; rx <= boardSize; rx++) {
        dp[lx][rx] = [];
        for (let ly = 0; ly <= boardSize; ly++) {
          dp[lx][rx][ly] = [];
          for (let ry = 0; ry <= boardSize; ry++) {
            dp[lx][rx][ly][ry] = 0;
          }
        }
      }
    }
    function mex(sz) {
      let seen = new Array(sz).fill(false);
      for (let i = 0; i < sz; i++) if (buf[i] < sz) seen[buf[i]] = true;
      for (let i = 0; i < sz; i++) if (!seen[i]) return i;
      return sz;
    }
    for (let lx = boardSize - 1; lx >= 0; lx--)
      for (let rx = lx + 1; rx <= boardSize; rx++)
        for (let ly = boardSize - 1; ly >= 0; ly--)
          for (let ry = ly + 1; ry <= boardSize; ry++) {
            let sz = 0;
            for (let mx = lx; mx < rx; mx++)
              for (let my = ly; my < ry; my++)
                if (board[mx * boardSize + my] !== 2) {
                  let now = dp[lx][mx][ly][my] ^ dp[mx + 1][rx][ly][my] ^ dp[lx][mx][my + 1][ry] ^ dp[mx + 1][rx][my + 1][ry];
                  buf[sz++] = now;
                }
            dp[lx][rx][ly][ry] = mex(sz);
          }
    function calcGrundy(p) {
      let a = board.map((cell) => cell === 0 ? 1 : 0);
      a[p] = 0;
      const x = Math.floor(p / boardSize);
      const y = p % boardSize;
      for (let j = x + 1; j < boardSize && a[j * boardSize + y] === 1; j++)
        a[j * boardSize + y] = 0;
      for (let j = x - 1; j >= 0 && a[j * boardSize + y] === 1; j--)
        a[j * boardSize + y] = 0;
      for (let j = y + 1; j < boardSize && a[x * boardSize + j] === 1; j++)
        a[x * boardSize + j] = 0;
      for (let j = y - 1; j >= 0 && a[x * boardSize + j] === 1; j--)
        a[x * boardSize + j] = 0;
      let res = 0;
      for (let i = 0; i < boardSize; i++)
        for (let j = 0; j < boardSize; j++)
          if (a[i * boardSize + j] === 1) {
            let ii = i, jj = j;
            while (ii < boardSize && a[ii * boardSize + jj] === 1) ii++;
            ii--;
            while (jj < boardSize && a[ii * boardSize + jj] === 1) jj++;
            ii++;
            for (let iii = i; iii < ii; iii++)
              for (let jjj = j; jjj < jj; jjj++) a[iii * boardSize + jjj] = 0;
            res ^= dp[i][ii][j][jj];
          }
      return res;
    }
    for (let i = 0; i < boardSize * boardSize; i++) {
      if (board[i] === 0 && calcGrundy(i) === 0) return i;
    }
    console.log("Fail to Find Grundy == 0");
    for (let i = 0; i < boardSize * boardSize; i++) {
      if (board[i] === 0) return i;
    }
    return -1;
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { children: status }),
    /* @__PURE__ */ jsx("canvas", { ref: canvasRef, width: boardSize * cellSize, height: boardSize * cellSize, onClick: handleClick })
  ] });
}
const Header = ({ titleName, githubLink }) => {
  return /* @__PURE__ */ jsxs("header", { className: "header", children: [
    /* @__PURE__ */ jsx("div", { className: "header-left", children: /* @__PURE__ */ jsx("h1", { className: "header-title", children: titleName }) }),
    /* @__PURE__ */ jsx("div", { className: "header-right", children: /* @__PURE__ */ jsx("a", { href: githubLink, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsx("svg", { className: "header-github-icon", viewBox: "0 0 28 28", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z" }) }) }) })
  ] });
};
const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return /* @__PURE__ */ jsxs("div", { className: "tabs-container", children: [
    /* @__PURE__ */ jsx("div", { className: "tabs-buttons", children: tabs.map((tab) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActiveTab(tab),
        className: activeTab === tab ? "active" : "",
        children: tab.name
      },
      tab.name
    )) }),
    /* @__PURE__ */ jsx("div", { className: "tabs-content", children: activeTab.contents })
  ] });
};
function meta({}) {
  return [{
    title: "AtCoder-Games"
  }, {
    name: "description",
    content: "AtCoDeer"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx(Header, {
      titleName: "AtCoder Games",
      githubLink: "https://github.com/amesyu/AtCoder-Games"
    }), /* @__PURE__ */ jsx(Tabs, {
      tabs: [
        // { name: "Game", contents: <Welcome /> },
        // { name: "Game2", contents: <Welcome2 /> },
        {
          name: "Tic Tac Toe",
          contents: /* @__PURE__ */ jsx(Game1, {})
        },
        {
          name: "Grid Nim",
          contents: /* @__PURE__ */ jsx(Game2, {})
        }
      ]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-QGsOKR_y.js", "imports": ["/assets/chunk-IR6S3I6Y-BvsIcvZg.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-CENOakfM.js", "imports": ["/assets/chunk-IR6S3I6Y-BvsIcvZg.js", "/assets/with-props-DvPqDDfd.js"], "css": ["/assets/root-Hxs-jhEP.css"] }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/home-DW5AJeS8.js", "imports": ["/assets/with-props-DvPqDDfd.js", "/assets/chunk-IR6S3I6Y-BvsIcvZg.js"], "css": ["/assets/home-5Q0b6IK3.css"] } }, "url": "/assets/manifest-d895c7af.js", "version": "d895c7af" };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  publicPath,
  routes
};
