# 交接說明：虹彩六號 戰術桌遊（網頁版）

給接手的 AI 程式助理（Codex 等）。先讀完這份再動手。

## 專案是什麼

- 《Rainbow Six Siege – The Board Game》的網頁版，可對戰電腦、新手教學、自訂房間連線、排名戰、成就、商店。
- 線上版：https://r6-boardgame.github.io/ （GitHub Pages，`main` 分支根目錄直接發佈，推上去就上線）。
- 目前版本 v87（見 `git log`）。

## 檔案結構

| 路徑 | 內容 |
|---|---|
| `index.html` | **整個遊戲都在這一個檔案**（約 8.4 MB、7600 行）。HTML、CSS、JS、規則書、幹員資料、部分圖片（data URI）全部內嵌。 |
| `img/aim/`, `img/face/`, `img/map/`, `img/ui/` | 幹員瞄準圖、頭像、地圖封面、UI 圖（webp），`index.html` 以相對路徑引用。 |
| `fb/` | Firebase 相容層 JS（`app.js`、`auth.js`、`firestore.js`），被 `index.html` 引用。 |
| `i2-*.png`, `app2.webmanifest` | 圖示與 PWA 設定。 |
| `.nojekyll` | 讓 GitHub Pages 不跑 Jekyll。 |

外部依賴：three.js r147（`cdn.jsdelivr.net/npm/three@0.147.0`，含 OrbitControls、GLTFLoader、後製 shader），連線用 MQTT（`broker.emqx.io`，備援 `broker.hivemq.com`）。

## index.html 地圖（行號會隨修改變動，請用搜尋）

- 第 1 行、第 11 行：內嵌的 MQTT 函式庫與「claude.ai 執行環境 shim」（把原本 claude.ai Artifact 的 `claude.use("db"/"room"/"user")` 轉接到 MQTT 與 localStorage）。**不要刪**。
- 有 16 行超長（單行 2 萬到 260 萬字元），是 base64 圖片、規則書、幹員資料。**不要整檔讀進來或用會整行輸出的指令**；用 `grep -n` 找函式名，再用 `sed -n 'A,Bp' | cut -c1-300` 看片段。
- 約 1864 行 `<script type="text/plain" id="rulesmd">`：規則書 Markdown。
- 約 3424 行 `<script id="opdata">`：幹員資料。
- 約 3431 行之後：主程式。重要函式（用 `grep -n "function 名稱"` 找）：

| 區塊 | 函式 / 常數 |
|---|---|
| 地圖與幹員資料 | `MAPS`, `OPC` |
| 視線、掩護 | `los`, `sees`, `protection`, `lineCells`, `isWallC` |
| 電腦 AI | `ai`, `aiAttacker`, `aiDefender`, `aiGoal`, `aiBreach`, `aiDrone`, `aiDecoy` |
| 回合流程 | `newGame`, `endPhase`, `setMode`, `curTargets` |
| 射擊與擲骰 | `shootUnit`, `shotIntro`, `rollDice3D`, `shotFX`, `shotCam` |
| 道具 | `useGadget`, `throwGadget`, `fragShow`, `droneReach`, `droneStep`, `destroyCell` |
| 畫面 UI | `render`, `renderPanel`, `renderOpsBar`（上方兩隊頭像列）, `obClock` |
| 3D | `update3D`, `unit3D`, `tgtGlow`（可攻擊敵人的底座紅光）, `R3`（three.js 狀態） |
| 開局設定流程 | `renderWiz`, `WZSTEPS`, `mapThumb`（選地圖時的小格局圖） |
| 新手教學 | `TUT` |
| 成就 | `ACH`（名稱是一句短的嗆人台詞，沒有副標） |
| 排名、商店 | `rankMatch`, `SHOP`, `renderShop` |
| 多語系 | `I18N`（繁中為主，英文、日文對照） |

## 怎麼修改與發佈

1. 直接改 `index.html`（從現在起它就是唯一原始碼）。
2. 本機測試：`python3 -m http.server` 後開 `http://localhost:8000/`。至少測兩種尺寸：**手機直式 390×844** 與 **桌機 1400×900**。
3. 自動化測試建議用 Playwright：開頁 → `#t-pve` 進入對戰電腦 → 可在 `page.evaluate` 裡直接呼叫全域函式（例如 `WZ.step=2;renderWiz()` 跳到選地圖），截圖確認並收集 `pageerror`，必須沒有錯誤。
4. `git commit` 後 `git push origin main` 就會上線。commit 訊息格式沿用 `vNN: 一句英文說明`（下一版是 v88）。

### 舊流程說明（只是背景，不需要照做）

之前由 Claude 維護時，原始碼是一份給 claude.ai Artifact 用的版本，再用 build 腳本把 claude.ai 相關文字換掉、加上 MQTT shim 產生 `index.html`；另外同步發佈到 claude.ai Artifact。這套流程的暫存檔不在這個 repo 裡。**改由 Codex 接手後，直接改 `index.html` 即可**，claude.ai Artifact 版不會跟著更新。

## 使用者的偏好（很重要）

- 使用者用**繁體中文**溝通，主要在**手機**上看。
- 畫面不能捲動，只有「成就」頁和「商店」可以捲。
- 手機直式和桌機都要能玩、版面精緻。手機只做直式（橫式提示已移除，網頁無法鎖定旋轉）。
- 小修改改完直接發佈；大的 UI 改動，使用者會說「先出預覽圖 / 先給我示意」，那就先給截圖，等確認再發佈。
- 不要動到使用者沒提到的其他 UI。

## 最近完成（v59–v71）

- 手榴彈：飛行動畫後，每個受害者輪流擲黃骰（攻擊方在左下、被攻擊方在右上）。
- 穿過門的射擊：門的路障算掩護，射完門被破壞。
- 可移動格改綠色；無人機（含 Twitch 電擊無人機）先放在鄰格，顯示 5 步可走範圍，可點目的地或一步一步走。
- Gridlock 的 Trax 丟出後整格長滿尖刺。
- 上方頭像列：最左邊直式 3 顆行動點菱形 → 己方 5 名幹員 → 中間時間（不限時顯示 ∞）→ 敵方 5 名。沒見過的敵人顯示「?」，見過一次就揭露；震暈、死亡顯示在頭像上。
- 成就名稱改成好笑的一句話（`retreat` 保留「我媽叫我吃飯」）。
- 移除手機橫放提示。
- 選地圖：拿掉「再點一次確定」標籤與地圖說明，選中的地圖名字下方顯示小格局圖（v70）。
- 可攻擊的敵人不再整格變紅，改成底座紅環加往上到腰部的紅光（v71）。
- 銀行地圖照真實一樓藍圖重做（v72）：28×19 格，A 檔案室、B 櫃員室；彎的櫃台是可翻越的掩護（`arc` prop）；家具型別見 `BANKP`、`bankProp`、`drawBankProp`；銀行專用地板 `bankTEX`（bmarble、bcarpet…）與米白牆 `bankWallMats`；地圖欄位 `tl:1` 表示 props 座標是左上角，`matRects` 可指定局部地板材質。

- v73：聲望改為對電腦勝 500／敗 300、對玩家勝 700／敗 500、投降 0；任務加給（裝或拆拆彈器 +50、人質護送成功 +100、害死人質 −50）寫在結算聲望旁（`ecoGame`、`G._bonus`）。
  - 銀行：高家具（`TALLK`：shelf、pillar）不能通過；桌類（`STANDH`：desk、table、counter、arc、cubicle…）可以站上去，幹員模型會抬高。樓梯改成單格 `stair` 圖示（上綠／下橘），拿掉活門。除了轉角、T 字、十字的牆以外都改成可破壞（`bank/gen.py` 規則）。
  - 屋外、靠近出生點的監視器（`outCam`）攻擊方一開始就看得到；攻擊方第一次啟動結束後，還在鏡頭視野內、已經移動過的攻擊方會被標記（`outCamSees`）。
  - 防守部署「調整場景」時，可調整的攝影機與路障顯示往上延伸的綠色光柱（`tgtGlow` 第 5 個參數是高度倍數）。
  - 預設視角改成斜 45° 的近景（`followCam`），點上方頭像會把鏡頭移到該幹員。

- v74：掩護改成相加（`protection` 回傳要扣的命中數）：每穿過一面牆洞、軟牆或路障 −2，目標緊貼障礙物或牆邊 −1，可部署盾牌 −2 但只擋正面半圓（盾牌有 `dir`，放下後玩家點旁邊格子選方向，模式 `shdir`；電腦預設朝最近的出生點，`shDef`）。持盾幹員固定 −2。
  - 無人機可以穿過窗戶（含路障）和所有障礙物（`droneOK`）。
  - 隔牆射擊（`thruWall`）：目標不現身但被標記，開槍者也被標記；`wmark` 讓這種標記不會觸發 `revealCheck` 現身。

- v76：掩護射擊（`riposte`）對同一個敵人只開一槍，記錄在 `u.owHit`，重新進入掩護射擊或新的一輪時清空。

- v77：規則頁「本遊戲玩法」前段重寫成回合流程、部署階段、開始行動、掩護、獲勝條件，加 SVG 圖示（樣式 `.rq*`）。部署「調整場景」可以把軟牆封成鐵牆（`c.rfR`，再點一次撤回）。屋外監視器取消第一次啟動的緩衝，進攻方在鏡頭內一移動就被標註。
- v78：拆彈器裝好後第三個防守階段結束時引爆，整個房間炸毀（`bombBoom`、`boomFx3D`，爆炸期間 `R3.noLt` 讓碎牆特效不加點光源）。拆彈改成持續一回合（`u.defusing`、`G.defuser.by/dleft`，兩個防守階段結束才完成），拆的人不能行動或掩護；拆的人倒下就中斷，時間已到則立刻引爆。進攻方全滅但拆彈器還在時仍要拆完。射擊：同一直線上只能打最近的敵人（`sameRay`、`rayBlk`，監視反擊也一樣），斜角不限。
- v79：主畫面拿掉「自訂房間」按鈕（房間程式還在，只是沒有入口）；規則視窗拿掉「原版規則全文」分頁，作戰檔案的規則副標改成「本遊戲玩法」。
- v80：規則頁精簡：拿掉地圖圖例、幹員檔案（`#lgfull`、`#opgrid` 留在隱藏 div 裡）；射擊與視線只留距離、掩護、隔牆射擊；行動一覽改成上方三菱形說明加右側按鈕圖示清單（`.rqAct`，`openManual` 時用 `eqIc`/`uiImg` 補圖）。直接移動改為「被標註並顯現幹員」，炸彈局拿掉拆彈細節段落。
- v81：行動一覽在三菱形後加「下方幹員卡的行動點」說明（橘色菱形＋移動），按鈕清單拿掉「結束行動」。
- v82：行動一覽的「專屬道具」改成直接顯示 Ash 的幹員卡（`#rqOpCard`，`openManual` 時用 `mkUnit`＋`opCard` 產生，取 `.oc` 那段）。
- v83：對戰電腦選單的任務也改成點兩下確定（陣營、任務、地圖、計時、幹員加入／移出都一樣）。開局地圖封面 `mapIntro` 改在 `newGame` 建好 G 後同步加上，且不再從透明淡入，避免先閃到 3D 地圖。
- v84：進攻方踩到鐵絲網扣 1 血並結束啟動；破壞可重複使用（`canDo` 對 destroy 不看 used，只花行動點），鐵絲網仍要相鄰（`isBP`）。電腦防守方部署時隨機用 5 次調整場景（封鐵牆 `rfR`、移攝影機 `moved`、拆路障 `unbar`），寫在 `autoDefSetup`。
- v85：防守方部署階段把所有防守幹員的部署道具都列成按鈕（顯示幹員名與剩餘數），點了會自動切到那名幹員進入放置模式，不用先選幹員。
- v86：Kapkan 入口引爆裝置只能放門窗，改成只有防守方看得到的發光紅線（路障兩面都看得到）；進攻方經過就爆炸、擲 1～2 點傷害，進攻方看不到也點不到，但 Thatcher EMP 等技能可摧毀。
- v87：開場先有登入頁（Google／訪客）；首頁「新手教學」換成「自訂幹員」（即將推出）。第一次進來走腳本式教學：招呼語 → 引導選進攻、人質、銀行 → Ash 一打二電腦（固定步驟、聚光遮罩、可跳過）→ 回主頁引導到作戰檔案的規則。網址加 ?tutorial 可重看。教學程式在 scratchpad v22/tu/。

## 尚未完成 / 等使用者回覆

- 使用者說「如果技能需要消耗兩個行動點，只剩一個行動點就不能開」：但目前程式和原版卡片裡**沒有任何技能要 2 行動點**，已問使用者是指哪個技能，尚未回覆。
- 手機橫放：曾提議用 CSS 把整頁轉 90° 來假裝鎖直式（點擊、拖曳座標會有風險），使用者尚未回覆。
- 曾提議但未回覆：Echo、Flores、Mozzie 的無人機也改成一步一步走；全面核對幹員卡能力。
- v75：銀行地板和牆改用 Poly Haven CC0 掃描材質（`R6_TEX` 的 `bkMarble`、`bkLime`、`bkVelvet`、`bkWool`、`bkWood`、`bkPlaster`，512px）。大廳／前廳大理石每塊取不同區域（`slabs`），檔案室改成橡木地板 `bwood`。`bankWallMats(soft)`：實心牆暖米色加石縫、可破壞牆淡色，都有深色木踢腳板（貼圖 repeat 0.5，一張涵蓋兩個牆高）。ambientCG 被雲端網路擋，Poly Haven 可以連。
