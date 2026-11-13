# 交接說明：虹彩六號 戰術桌遊（網頁版）

- v294：名片新兵頭像改用新兵圖。`avN294(k)` 把舊的新兵圖示鍵（`recruit_a_*`→`cop:0` 女、`recruit_d_*`→`cop:1` 男）轉成培養幹員頭像，`ME` 載入時、`avSrc289`／`artSrc289`／`profArt` 都先過它（好友舊資料也一樣）；預設頭像改 `cop:0`。頭像清單拿掉 `recruit_` 圖示，最前面是兩名新兵和他們轉職過的職業（`copWU`）。`copAv` 的 `av` 一律用 `img/av/cop_<f|m>[_職業].webp`，新增 hs／sh 四張頭像（從 `img/cop/*_hs/_sh.webp` 裁頭部）。回歸：`tests/card-recruit-avatar-v294.cjs`。
- v293：獎盃計分改成依表現。`trCalc(win,mine)` 回傳項目清單：勝利 +5、每名存活己方幹員 +1（`ecoGame` 的 `mine`）、完成任務 +2（`G._df` 我方阻止拆彈，或我方進攻且 `G._why` 是「炸彈已被拆除」／「人質已安全撤離」）；落敗 −3、`G._hk`（我方害死人質）再 −1；`G._ffn`（我方誤殺隊友數）每名 −1，勝敗都算。總數最低 0。`G._trd.L` 給結算 `#rkres` 的 `.trL` 逐項列出。配對機器人獎盃改在你上下 15 內。回歸：`tests/trophies-v290.cjs`。
- v292：名片 `.pcSt` 第二格從勝率改成獎盃（`c.r`=`trN()`），拿掉右上 `.pcRank`。熟練度 `mxLvT(lv)`：Lv5（`MXT.length`）顯示 LvMax（名片常用幹員、商店、選角、升級提示）。解鎖：擁有（`owned(b)`）就有圖示頭像；Lv2 解鎖照片 `pic:` 與半身像 `art:`；Lv3 稱號（`ttl289`／`ecoTag`／設定列表）；LvMax 由 `skHas(k)` 讓培養幹員免費擁有該幹員技能（原本只有 `ECO.sk` 購買，`skBuy`／商店／`copSkOn` 都改用 `skHas`）。`MXREW` 更新。稱號可用 `TTLX[base]` 覆寫預設「名字 專家」，使用者會在 `/mnt/project-files/titles/幹員稱號.xlsx` 填好後回傳。
- v291：名片立繪不切頭：`.pc289 .pcArt` 高度改成 `calc(100% - 4cqw)`、`max-width:62%`，整個人放在名片內（原本 112% 會超出上緣）。
- v290：排名戰的段位（`TIERS`／`tierOf`／`rankBadge`／`ME.rating`、`players/<id>.rating`，`rankResult` 早已停用）拿掉，改成獎盃數。`ECO.tr` 是目前獎盃、`ECO.trMax` 最高紀錄，跟聲望一樣存本機並同步雲端。線上對戰（配對佇列，含 30 秒後的配對機器人，`ecoGame` 裡的 `quick`）勝 +30（`TR_WIN`）、敗 −20（`TR_LOSS`），最低 0；對戰電腦、自訂房間、組隊不影響。`trGame(win)` 每場只算一次（`G._trd`），結算 `#rkres` 用 `trResHTML` 顯示。大廳「線上對戰」副標顯示 `PVP · 獎盃 N`；`myProf().tr` 讓 VS 卡顯示雙方獎盃（`.mfTr`），配對機器人 `botProf` 的獎盃在你上下 60 內；`profPush` 寫 `prof/<code>.tr` 給名片／好友。回歸：`tests/trophies-v290.cjs`。
- v289：玩家設定改成「我的名片」。`renderSettings` 重寫：上方 `cardHTML289(myCard289(),FRP.code)` 名片（`.pc289`，容器查詢 cqw 縮放；`th` 金／`blue`／`orange`／`black`，黑曜需 `achCount()>=30`，存在 `ME.cth`），右上是獎盃數（使用者不要段位，目前顯示 `ME.rating`；排名改獎盃制另開討論串處理），立繪 `artSrc289` 跟頭像幹員（`img/face`，培養幹員用 `copAv().art`）。名片背景、稱號、頭像三排 `.hs289` 左右滑（頭像兩列 `grid-auto-flow:column`），排版高度不變；稱號同名只列一次（男女 Recruit）。改名按「✎ 改名」才出現輸入框（`PS289.edit`）。音量：`SFX.setVol/setMVol`（localStorage `r6vol289`／`r6mvol289`，拉到 0 等於關）。`profPush` 多送 `c:myCard289()` 到 `prof/<code>`；輸入好友代碼先顯示對方名片（`FRP.found`）再按「送出好友申請」；好友名單點人 `frPeekHTML` 有 `d.c` 時顯示名片；對戰結束點對手名字 `.anPN[data-oc]` 開 `openCard289`。舊版玩家沒有 `c` 用 `oldCard289`。回歸：`tests/player-card-v289.cjs`。
- v288：作戰檔案／訓練（含排行榜）頁的錢包對齊大廳尺寸。手機：v276 那段 `≤760px` 的 `.pcard`／`.pinfo`／`.ptag` 縮小規則從 `#title[data-s="title"]` 擴成 `#title:is([data-s="title"],[data-s="lib"],[data-s="train"],[data-s="board"])`（原本這三頁錢包是 136×54，大廳 124×50）。電腦：右上 `#menuIdentity251` 改用大廳 `.pcard` 同樣的 vw 比例（寬 20vw、頭像 3.2vw、名字／聲望 `clamp(15px,1.25vw,27px)`、padding `.8vh 1.1vw`），1440 寬時 288×70 對大廳 290×68。
- v287：首頁贊助清單先拿掉綠界（台灣玩家）連結，綠界還在審核中。`SPONSOR` 上方註解留有原本的項目，審核通過後放回陣列即可。
- v286：Jackal（Eyenox 追蹤標記）與 Dokkaebi（邏輯炸彈）標記到防守方時，鏡頭特寫被標記的幹員約 1.7 秒再飛回原視角。技能裡 `await fxEv({k:'mark286',uid,side})`，`fxPlay` 轉給 `markCine286`（借用 `R3.cineSave`／`shotCamEnd`，正面偏 15° 看人，手機距離 3.4、電腦 2.6，`cineClear` 淡出擋住的牆，`R3.cineShow` 讓戰爭迷霧裡的目標畫出來；特寫中 `update3D` 不畫該幹員的紅色定位圖釘），連線對手也透過 `fxSync` 看到。教學、`CINE.on=false`、超過 15 秒的舊事件不觸發。Jackal 隔牆射擊已標記目標走原本射擊特寫。回歸：`tests/mark-closeup-v286.cjs`（無法連 jsdelivr 時設 `R6_THREE_DIR` 指向 three@0.147.0 套件）。

- v285：重裝 PWA（刪桌面圖示）後重新登入，培養幹員 `ECO.cop` 和學長姐 `ECO.alum` 消失。原因：新裝置開機就因每日任務 `ecoSave()` 把空白 ECO 的 `ts` 設成現在，`gaMerge` 以為本機較新而保留空白，接著 `gaPush(true)` 把雲端蓋掉。現在第一次綁定（`r6bg.glink` 不符）一律以雲端為底；`cop` 每格用 `copPick285`：`gen` 大的勝，同 `gen` 取進度（k+sv+e）多的，同進度才看哪邊較新；`alum` 兩邊聯集（`alumMerge285`，鍵 ts_i）。登入後 `gaAlumRescue285` 從排行榜 `board/<uid>_fallen_*`（這些列不會被刪）補回學長姐（殺手名稱與評級沒有記在排行榜，顯示「陣亡」與 N）。回歸：`tests/reinstall-keeps-operators-v285.cjs`。Firestore `users/<uid>` 是整份覆寫，沒有歷史版本；雲端被蓋掉的現役幹員無法從伺服器救回，除非其他裝置（同帳號）還留著舊的本機存檔，該裝置下次開啟會依上面規則把它推回雲端。

- v283：手機小隊欄 `#lobSq` 切換選單會閃：`lobHTML` 每次產生空的 `#lobSq`（`:empty` 隱藏），之前要等 `setInterval(ptUI,800)` 才填。現在 `lobRender` 結尾直接呼叫 `ptUI()`，同一幀就畫好。

- v282：編輯器「所有頁面的元件」加「培養頁預覽」：選幹員一／二與職業，透過 `pv.ci/pv.cw` 讓遊戲的 `renderCop` 用 `cpPv281(c)` 顯示成該職業（只換顯示的複本，不存檔）。`renderCop` 會設 `html[data-cpw="f_sn"]`（性別_職業，新兵是 recruit）；規則多了 `w` 欄，CSS 前綴 `html[data-cpw=w]`，文字／圖片只在相同 cpw 時套用。在培養頁選元件時預設勾「只改這個職業」。點選時若點到的容器下面有圖片，會優先選那張圖（`deepPick`，因為立繪常是 pointer-events:none）。

- v281：編輯器改名「遊戲畫面編輯器」，多一個「所有頁面的元件」分頁：預覽可切「操作遊戲（換頁）」或「選取元件」，點任何元件可拖曳位置、滾輪縮放、字級、隱藏（手機 `m`／電腦 `d` 分開），文字與圖片兩邊共用（`dev:'*'`）。規則存 `data/ui.json` `{rules:[{sel,dev,x,y,s,fs,hide,text,src,img,lb}]}`，跟 `lobby.json` 同一個 commit 發佈。遊戲端 `<script id="uicfg281">` 的 `uiApply281` 產生 `html body <sel>{translate;scale;font-size;visibility}`（用獨立的 translate/scale 屬性，不蓋掉原本 transform），文字／img src 由 MutationObserver 重套。選擇器由編輯器 `selOf` 從最近的唯一 id 往下組，會略過 on/sel/active 等狀態 class；改版時若改了 id 或 class，使用者的 ui.json 規則會失效。預覽中 `lobcfg280` 只有 `pv.home` 才把畫面拉回大廳、`pv.lock` 才停用點人物。另外 `img/cop/m_hs.webp`、`m_sh.webp` 已去背（白底與地面陰影轉成半透明）。

- v280：大廳編輯器 `lobby-editor.html`（不從遊戲連結，直接開網址）。左側上傳／調整手機與電腦背景（位置、放大、暖色光）和每位幹員的大廳圖、位置、大小（手機 px、電腦是圖框 %，兩邊分開存）；中間用 iframe 載入真正的 `index.html?lobbyEdit=1` 預覽，可直接拖曳／滾輪、參考線、疊影對齊。「發佈到遊戲」用使用者貼的 GitHub 金鑰（public_repo，只存在瀏覽器）以 git data API 直接 commit 到 main：`data/lobby.json` 與新圖 `img/ui/lobby/<sha1>.webp`，再輪詢網站直到更新。遊戲端 `<script id="lobcfg280">`：`LOBDEF280` 是預設（等於 v276 的手寫值，原本 `HSC/HY/HX` 已搬進來），啟動時讀 `data/lobby.json`，`lobHero280` 在 `lobRender` 套用；手機背景改由 `.lob.m::after`（z -1、可縮放）畫，原本的 `::before` 暗角疊上漸層。沒有 lobby.json 時畫面和 v279 逐像素相同。手動改大廳背景／幹員位置請改 `data/lobby.json`（或用編輯器），不要再寫死在 CSS。

- v275：手機大廳背景換成使用者給的夕陽軍事基地屋頂 `img/ui/lobby-phone-v275.jpg`（舊的 v266 倉庫圖已刪）。
- v279：手機排行榜（≤760px）前三名改用 `img.bFull279` 全身立繪（`lbArt`，隱藏 `.bPodium>.bPortrait.opBust250`，仍保留 3 個 `.bPortrait` 給測試）；名次列用 `.bHalf279` 半身放大（92px 寬、圖高 200px 從頭部往下裁）。桌機不變。`m_hs`／`m_sh` 原圖沒有透明背景。
- v278：小隊收合鈕 `.lobSq .lb` 寬 100%、去掉 focus outline（iOS 點完出現的白邊）；手機 `.pcard` clip-path 改成只切右下角 9px（同 `--cham` 的右下角），不再右側斜邊。
- v277：portrait.html 用 `@media (orientation:landscape)` 直接套旋轉（JS 只寫 CSS 變數 `--pw/--ph/--lw/--lh/--la/--ls`），橫放第一格就已轉好不閃；`enterCost` 對 `winOpen` 窗戶格不收基本 1 步，只收翻越 +1（穿窗共 2 點：+1 翻越、+1 落地格），仍標 pass 不能停。
- v276：手機大廳幹員 `bottom:52px`、左移 22px、腳藏在 KD／模式按鈕後，加 sepia＋左上暖色 rim（配夕陽）；左上 `.pcard` 在 ≤760 限寬 `100vw-240px`、聲望字縮小；小隊欄標題可點收合（`.lobSq.mini`，localStorage `sqMini276`）。

- v273：手機大廳 `HX` 水平位移（`m_smg` 右移 40px），設 `--hx` 加到 `.lobHero` 的 translateX。

- v271：手機大廳蹲姿圖另外往上移：`HY`（`m_smg` 95px、`f_sn` 45px）設 `--hy` 加到 `.lobHero` 的 bottom。

- v270：手機大廳幹員全身置中下移，`.lobHero` bottom 140px（腳藏在戰績／按鈕後面），高度最多 76%；蹲姿圖用 `HSC` 縮小（`m_smg` .56、`f_sn` .66）。新增蹲姿立繪要加進 `HSC`。

- v268：使用者要求手機大廳拿掉地上圓圈（`.lobRing` 隱藏）、角色要全身，`lobby-operator-v249.png` 不是使用者的圖，手機改回 `copArt` 全身立繪。

- v267：手機大廳（使用者指定）：背景 `img/ui/lobby-phone-v266.jpg`（使用者給的倉庫圖）；圓圈下移到名字上方（`.lobRing` bottom 250px），幹員腳底對齊圓圈中心；女新兵改用 `lobby-operator-v249.png`（`.lh266`，往左移 57% 置中、底部淡出）。左側排行榜下方常駐直式小隊欄 `#lobSq`（`ptSq266`，沒組隊也顯示自己＋邀請空位，點＋開好友頁；組隊後顯示隊友與離開）；手機不再用浮動 `#sqd`。手機模式說明改「單人或組隊」，拿掉「自動配對」。桌機不變。

- v265：桌機 PvE 共用裝備箱使用使用者原圖切出的透明箱體與五件進攻裝備（`img/ui/pve-v257/gear-v265/`），防守道具沿用原圖。按加號時透過既有 SFX 匯流排播放 `snd/fx/gear-foam.mp3`，與入箱輕震對齊；從裝備頁按下一步（含確認頁返回編輯）播放 `snd/fx/gear-case.mp3`。

- v264：桌機 PvE 裝備箱內未攜帶的道具直接隱藏，保留空凹槽。加裝時用 Web Animations 讓道具落入、箱體在落點輕震；系統偏好減少動態效果時直接更新畫面。

- v263：桌機 PvE 地圖用實際牆、門窗和領事館弧牆產生透明線稿；3D 從既有場景用低角度透視相機取景。選角單擊看資料、左鍵雙擊入隊，沿用解鎖與同基礎幹員互斥；血量／步數來自 `mkUnit` 或 `copStat`，技能與角色圖分欄。裝備箱底圖由 imagegen 生成，實際道具圖按 `cfg.inv` 即時亮起或轉灰。兩陣營與四張地圖回歸用 `tests/pve-v257.cjs`。

- v261：桌機左鍵拖曳平移，Alt／Cmd＋左鍵拖曳旋轉，單點仍是棋格操作且 Alt／Cmd 不觸發射擊；一般滾輪由 OrbitControls 縮放，Shift＋滾輪只選己方幹員。Ctrl＋左鍵破壞、Shift 移動等既有功能保留。部署共用鏡頭拖曳，手機觸控不變。
  - 空白鍵短按完成動作、長按 2 秒讓結束階段按鈕跑滿；中途放開、失焦、切換階段或被視窗中斷取消。擲骰／攻擊忙碌時鎖住該次按壓直到放開，不會在動畫結束後開始計時。跳過共用擲骰按鈕，不改骰值或結算。回歸：`tests/desktop-workspace-v247.cjs`。

- v257：部署畫面標題旁加「自動部署」`#autoDep257` → `autoDeploy257()`。防守方直接沿用電腦的 `autoDefSetup(true)`（幹員進目標房間、補強周圍牆、鐵絲網／盾牌／防彈攝影機、Mute/Kapkan/Bandit/Valkyrie 等道具），只用剩下的次數；調整場景改用 `G.rearr` 剩餘次數，不再固定 5 次。擺完清掉 AI 專用的 `anchor/roam`。進攻方隨機選一個出生點 `placeAttackers`。合作模式（雙人各管一半幹員）不顯示。擺完仍可手動調整；連線靠既有 `netSer` 整份狀態同步。使用者明確要求手機對局動作鈕維持原樣，不要放大。
  - `tests/auto-deploy-v257.cjs`：手機（portrait 容器內）與 1100×700，防守目標房間／道具數／重按不重複扣次數／調整場景上限、進攻出生點、開始對戰、合作隱藏。`R6_THREE_DIR` 可指向本機 three@0.147.0 套件；`R6_VIEW=phone|desktop` 只跑一種。

- v262：使用者要求手機改回只有直式介面，撤回 v258。`portrait.js` 還原成 v256 的反向旋轉容器（橫放仍直式），manifest 改回 `portrait-primary`，`tests/portrait-v256.cjs` 復原、`landscape-v258.cjs` 刪除。不要再讓手機橫放走桌機版，除非使用者再要求。

- v260：主畫面圖示換成 `i3-*.png`（6 站在低角度棋盤上、牆高低不平、金色格線，three.js 算圖後與原 logo 合成）。改檔名是為了讓手機不吃舊圖示快取；之後再換圖示也要換檔名。

- v258：手機橫放改用電腦版設計（使用者指定）。`portrait.js` 橫放時不再反向旋轉，改把 iframe 設成高 640px 的桌機視窗（`DESK_H`，寬依比例，約 1385px）再等比縮小塞滿螢幕，遊戲內所有 `max-width:760px`／`lobMob()` 判斷自然走桌機版；直放維持 1:1 手機版。同一個 iframe 只改尺寸，不重新載入。`DESK_H` 低於約 600 會掉到舊版對戰面板，別調小。manifest `orientation` 改 `any`，不再鎖直式。
  - `tests/landscape-v258.cjs` 取代 `portrait-v256.cjs`（已刪）：直放 390 寬手機版、橫放桌機大廳／選單可點、開局、轉回直放狀態保留。auto-deploy-v257 的手機段只用直放，不受影響。

- v256：手機入口用 `portrait.js` 辨識手機，進入同源 `portrait.html`；只建一次直式 iframe 載入原遊戲。外層按左右轉向反向旋轉及重算安全區尺寸，不改遊戲的座標、版面判定或連線／對局狀態；桌機直接開 `index.html`。PWA manifest 設 `portrait-primary`，瀏覽器不給原生鎖仍可用直式容器。
  - Google 彈窗照舊；需要 redirect 才透過同源頂層與一次性 session 標記完成後回直式容器。移除失效的舊轉向提示。 `tests/portrait-v256.cjs` 驗證兩側轉向、不中斷、觸控按鈕與 3D 點格、窄螢幕直接橫放開啟、登入備援（模擬 SDK）及桌機不進容器。

- v259：單人桌機對戰電腦七步使用 `pve257.js/css` 戰術簡報（≥1000×620）；保留 `WZ`、`cfg`、`INV_CAP` 與真正的 `newGame`。左上返回有獨立頂欄，裝備是獨立第 5 步；確認頁修改完成回確認。地圖從既有 WebGL 場景截一幀＋原平面圖，不改棋盤；選角沿用角色圖、既有解鎖與兩名培養幹員互斥。手機直式、教學及組隊流程不換版；保留 v258 轉向與 v257 自動部署。
  - 桌機 Esc 共用按鈕的動作，先處理最上層視窗，再返回；對戰中沒視窗不擷取 Esc，改名／輸入法取消沿用原行為。六張內建 imagegen 環境／卡圖與提示記錄在 `img/ui/pve-v257/`。流程與尺寸回歸：`tests/pve-v257.cjs`。

- v255：只調亮桌機培養頁 `#cpOk`；沿用霧金材質、加亮金色覆層，不再對 disabled 套 brightness(.72)。不可按仍 disabled、較低飽和無外光；可按增加暖金邊光／hover。手機、重新訓練按鈕與存檔規則不變。

- v254：培養桌機姓名與職業拆開。`.cpName254` 單獨承接姓名名牌背景；`.cpId>.cpTag` 是獨立、隨 `c.w` 更新的職業條，與戰績分開留白。大姓名可點／Enter／Space 啟動既有改名 handler。右上學長姐與兩名幹員按鈕用 flex 水平垂直置中。手機 `.cpName254{display:contents}` 不影響原排列；未改職業／改名存檔規則。`tests/cultivation-v254.cjs` 檢查三尺寸間距、文字置中、改名、實際轉職標籤與手機 wrapper。

- v253：使用者只指定先修培養主頁第 5（文字層級）、6（斜角／邊框一致性）項。`cultivation253` 僅 ≥1000×620；標題／姓名保留主視覺，能力標籤改 500 字重，數值與輔助資訊改 body 正體 400 字重、18–20px；數字等寬。分頁／戰績／點數取消框體 skew，文字不再隨框歪斜。
  - 面板、名牌、雷達、能力列、裝備格與按鈕共用左上／右下 45° 切角：一般 12px、大框 18/24px、小控制 6px。支援時用原生 `corner-shape:bevel` 讓 1px 邊線繞過斜角；其他瀏覽器用 polygon fallback。能力色條／裝備金邊保留，不換 v252 材質、人物或位置規劃。
  - `tests/cultivation-v253.cjs` 檢查字重／字級、正體控制、切角、原材質保留與手機啟停樣式逐項相同；搭配 v252 多尺寸、中英長名及原按鈕流程回歸。

- v252：使用者指出 v251 培養頁和核准圖差距（超寬空白、字太小、全身構圖、材質不足），本版只校準培養主頁，其他六頁／大廳／戰鬥／手機不換版。
  - `<style id="cultivation252">` 在 v251 後，≥1000×620 的 `.cpBox` 為 1600×1000 完整設計畫布；`copScale252()` 在 render/resize 設 `--cpScale252=min(vw/1600,vh/1000)`，整組等比縮放置中，不能再把外框拉滿、內容卻用 px 上限。六列固定在基準 (856,210,700,480)，上下無多餘空白；點數／確認緊接下方。六色列邊與 G/B/V 能力格都明確覆蓋舊規則，避免裝甲失色。
  - 新增三張真正材質圖 `img/ui/cultivation-v252/{graphite,gold,glass}.jpg`（內建 imagegen；來源與提示見該目錄 README）。面板、玻璃資訊、金色分頁與確認鍵各自使用，不能用純色／雜訊假裝已完成。
  - `.cpPortrait252` 用 picture：只有桌機女新兵 source 沿用既有 `lobby-operator-v249.png` 高解析圖（不重新生成角色）；fallback src 仍為 `copArt`，手機、男性與轉職圖不替換。圖片改近景，狙擊長槍另有尺寸。`cpStage` 在標題底板上方，標題字與操作在人物上方，避免橫條壓頭或頭髮遮字。
  - 姓名／戰績／雷達／裝備改按核准圖集中於人物周圍；六字中文名用 43px（一般 52px），英文能力標籤可兩行但不縮字；小桌機上方留給固定返回與玩家資訊。
  - `tests/cultivation-v252.cjs` 用隔離訪客驗證 1600/2546×1287/1400/1000/1920 全組比例與密度、三材質／六色、加減草稿不自動存、道具／技能／幹員切換、英文字與長姓名、男女多職業原圖與390手機。樣本不存雲端。既有 v251 七頁與 v250 導覽／排行榜回歸仍適用。

- v251：使用者確認七張示意圖全部實作。`<style id="menus251">` 在主樣式後，僅 ≥1000×620 套用培養、技能收藏、訓練、商店、作戰檔案、排行榜與任務視窗的攝影底圖、斜角金屬、細紋與金色邊光；大廳／戰鬥／手機保留原版。`img/ui/menus-v251/` 七張獨立環境是 imagegen 由核准圖抽出，不含 UI／人物／技能；原圖保留在 generated_images，來源及提示見同目錄 README。
  - 人物沿用 `copArt/opArtU/lbBust250`、技能沿用 `skillIcon`；技能收藏顯示實際選中技能的原立繪與最新說明，開啟只選第一項預覽，不自動裝備／購買。`.cpFull` 必須遮住下層 `.cpBox`，手機隱藏新增詳情立繪。
  - 商店桌機左 4 欄、右固定詳情（`SHOP.sel` 首項預覽），分類改變時檢查選項仍屬於該分類；原購買 handler／聲望完全沿用。桌機返回直接離開商店，手機原詳情視窗操作不變。
  - 圖鑑六欄垂直卷軸；規則卡用獨立生成的 `archive-plan.jpg` 紙張／藍圖環境（裝飾，不是遊戲地圖），成就用既有 first 徽章與實際進度，不造假。`menuIdentity251` 唯讀顯示真實玩家頭像／名字／聲望。排行榜真資料、最多 50／自己的排名常駐、大廳每 10 秒輪播皆保留。
  - `tests/menus-v251.cjs` 隔離訪客七頁截圖、分類／返回／TOP50／1600、1400、1000、390px；排行榜樣本僅存在測試瀏覽器，不寫帳號。

- v250：依使用者截圖修正選單。`lbBust250` 用兩層 SVG 視窗畫上半身、保留來源完整寬度與頭部；內層明確裁到腰部，避免外層 meet 留白區把下半身露出。狙擊圖保留長槍的完整高度。排行榜人物可突出框、第一名最前，文字層更高；大廳不再用 cover 裁頭。
  - `openTask250` 用 `tsDlg` 覆蓋任務視窗，不切 SCREEN；`bindTask(root)` 支援視窗內領獎與更新。`renderPlayer` 包裝沿用任務圖示與徽章；Escape／背景／X 可關閉。
  - ≥1000×620 培養頁為雙欄：左人物、評分與裝備，右配點、點數與確認。技能收藏為卡片＋右側詳情，手機原配置不變；桌機訓練分類圖／卡片限制尺寸，不再撐滿全螢幕。
  - `menuRoute250/menuSync250` 桌機所有選單頁共用固定左上 (28,22) 返回鍵，代理原 handler，不改存檔或回合流程；技能子頁、學長姐、商店詳情與訓練子分類會先退一層。手機保留原返回與底導覽，視窗保留關閉 X。
  - `tests/menus-v250.cjs` 隔離訪客涵蓋任務不換頁、寬版配點／技能、統一返回位置與巢狀頁、半身來源視窗、長槍、1600/1400/1000/390；排名虛構資料只存測試瀏覽器記憶體。搭配 v249 輪播與 v247 戰鬥回歸。

- v249：依使用者指出的 C 圖落差重製桌機大廳細節。`lcShade249` 是整體斜角側欄，左選單取消 490px 上限、固定佔 33% 寬；字級用 `--lcU:min(1vw,1.6vh)` 隨畫面比例縮放。按鈕有獨立配圖、薄邊框與遞進斜角，幹員名牌與紅藍戰績也按比例縮放，手機不變。
  - `img/ui/lobby-bank-v249.jpg`、`lobby-operator-v249.png` 以使用者確認 C 圖作參考生成／拆件（原始生成圖保留在 Codex generated_images）；銀行保持沿街斜看構圖，新兵女生大廳專用高解析透明立繪。不更動全域 `copArt`、職業圖或手機圖；桌機載入時預熱新素材。
  - `LOBBY249/lobbyBoard249/lobbyFlip249` 每 10 秒在現役／陣亡前三名間翻換；外框裁切、內容向上平移＋X 軸翻轉。`lbRows(tab)/lbMyRank(tab)` 保留真實資料，空榜不造假。開完整排行時帶入當前分類；離開大廳或背景分頁暫停，回來重新計 10 秒；reduced-motion 直接切換。
  - `tests/lobby-v249.cjs`：1600／2546×1287／1400／1000／800／390px，比例／斜邊／素材、10 秒邊界與真實計時器、動畫中間幀／外框裁切、分類導航／暫停／減少動態。虛構排名只存在隔離瀏覽器記憶體，測試截圖有 fixture 後綴。v248 測試改檢查下方連結區與排行榜的真實不重疊邊界。

- v248：電腦大廳依使用者確認 C 版改為沉浸式主選單。`lobbyDesktop248/lobbyIcon248` 沿用原入口 id 與 `lobRender` handler（含組隊 `ptLobby`），手機 `.lob.m` 完全不變。`cinema248` 的 CSS 只限寬 >760px 的大廳，其他頁面與 v247 戰鬥介面不變。
  - 左側三模式＋培養／商店／作戰檔案；右側沿用 `copArt` 立繪、可切幹員、真實擊殺／存活場次；底部 `lbRows` 前三名顯示立繪與所屬玩家、自己的排名。贊助與回報只顯示圖示，但保留 aria-label、tooltip 與原對話框。
  - 背景 `img/ui/lobby-bank-v248.jpg` 是生成的獨立銀行環境素材，不是整張示意圖；按鈕、頭盔、電腦、盾牌心電圖等用 inline SVG，避免把示意數字或假排名寫進遊戲。
  - `tests/lobby-v248.cjs` 隔離訪客檢查 1600/1400/1000/800/390px、真實戰績、圖示按鈕、切換幹員、贊助／回報與模式入口，無捲動／重疊／頁面錯誤。

- v247：使用者選定桌機 C 版。`desktop247` 在 ≥1000×620、一般 play 畫面啟用；手機、部署、新手教學、結算沿用舊版。`renderDesktop247` 左側小隊、右側行動／道具／情報，無底部操作列；未行動綠、已行動紅（`activated`），攻擊骰依實際 `pd/PROF.d` 分色 × 數量。
  - 保留 `renderActs` 的既有合法性與 handler，附 `data-act-label` 後移到新介面；道具照固定快捷鍵排序。情報用最新 `skText/CSK`，不改技能規則與 CSV。角色名用 `OPS.name`，不可 escape `nm()`（它含 `<b>` HTML）。
  - Alt／Cmd 暫時射擊、Ctrl 暫時破壞、Shift 暫時移動；Shift＋WASD 依鏡頭方向移動，保留路徑、翻越、監視等原判定。Q／E 左右 45°，R 奔跑，G/I/M 道具／情報／行動，T 技能，**Z 特殊按鈕（使用者已改掉 S）**，F 封門，Space 完成，Ctrl＋Space 結束階段，鍵盤上排 1–0/− 選道具。
  - `deskSelect247`（左卡／滾輪）只切選取與鏡頭，下一次真正行動才 `commit`，不因檢視花點數或結束原幹員；忙碌、放置朝向與監視選向時禁止切換。`camFree` 計入左右兩側遮罩。
  - `deskSpecial247` 代理原浮動按鈕；桌機隱藏原按鈕但保留 handler，手機仍顯示。原生特殊按鈕不可移除，否則代理無法操作。快捷鍵會避開輸入框及對話框；Ctrl＋左鍵在 Mac 不跳選單。
  - 測試 `tests/desktop-workspace-v247.cjs`：隔離訪客，桌機／矮視窗／手機，分頁、實際色骰、綠紅狀態、滾輪、Shift＋WASD、Q/E、R、Alt/Cmd/Ctrl、Z、Space 與 Ctrl＋Space。v245 瀏覽器回歸改點桌機代理蠱毒按鈕；規則 VM 的擷取終點停在 v247 UI 區之前。

- v246：依使用者 14 張參考圖更新模型；`referenceGadget246/refMount246` 重製 Wamai、Nomad、Argus、Kaid、Lesion、Melusi，`echoModel` 改半透明四風扇機身；Dokkaebi 駭入按鈕使用 `img/ui/dokkaebi-hack-v246.jpg` 原圖。
  - `autoMount246` 選接觸的實牆，保留原格與房間效果，沒有接觸牆時維持落地。Kaid 可直接貼在選取的鐵牆表面。`PLACE.castle` 一次處理成對門窗、只耗一次技能，保留窗台。
  - Aruni 保留進入目標房間觸發的既有被動規則，`gateOpenings246/aruniGates246` 於對應門窗畫依尺寸縮放的雷射門，無剩餘次數不顯示；攻方僅視線內看得到。
  - `timedBreach246` 發送同步 `breach246` 特效，等待 `breachFX246` 完成才破牆。Hibana 六顆五瓣紅彈 2×3 貼牆燃燒；Thermite 布包交叉綁帶與外緣一圈火花。沿用破牆／相鄰傷害，不新增點光源。
  - `tests/browser-gadgets-v246.cjs`：隔離訪客實際 WebGL 模型、四風扇、雙格門消耗、門窗雷射與燃燒前後牆體狀態、手機駭入圖示；搭配 v245 規則及瀏覽器回歸測試。技能文字同步 CSV／英文。

- v245：依使用者確認的 CSV 差異及補充更新技能。主 script 尾段 `v245: confirmed operator rules` 集中技能控制、動畫、包裝與 `SKILL245` 說明（同步 `data/skills.csv`）。沿用 v244 立繪，保留新版 Twitch、Mira、Iana、Goyo、Amaru。
  - `twUser/remoteDrone` 共用 Twitch、Echo、Mozzie 操作；Echo 5 步／180°／6 格，只己方可見且只能音波震暈，Mozzie 在進攻方部署普通／電擊無人機時立即獲得一次充能（掃描不重複給）。
  - `airjabCheck` 鄰格觸發並推離最多 5 格；`UG.gridlock` 四鄰格隨機連通擴張最多 10 格，新尖刺只影響所在格。`skillMoved` 同時處理 Caveira 三步解除與 Melusi 剩餘步數減半。
  - Lesion 初始／攜帶上限 2、每輪 +1。`guPoison/guBy/guTick` 保留跟隨標記、來源與每輪一次傷害；`guTrigger/guRemove` 處理特寫和橘色拔除。`startPhase` 等待毒傷結算後才開始下一階段。
  - Maverick 每次 1 行動、不限次；`mavHole` 支援鐵牆真洞，`destroyCell` 第三參數 `quiet` 不播音效。Capitão 共用 3 次，煙霧同煙霧彈、火焰 8 階段；Smoke 毒氣 4 階段。
  - `catchThrow` 現在是 async，呼叫必須 await。ADS 紅光攔截，Mag-NET 緩慢吸入，每台兩次。
  - `machineBurst` 視線內指定敵人；4 面職業圖／2 空白，圖示 +1 傷後繼續。培養 MG 每段最多 3 顆，`copDice` 另加免費黃骰，不算限制。
  - 測試：`tests/operator-skills-v245.cjs`、`tests/twitch-drone.cjs`；`tests/browser-skills-v245.cjs` 用隔離訪客瀏覽器驗證實際操作和 390×844／1400×900 畫面（R6_PLAYWRIGHT 指向已安裝的套件）。既有 `shield-classes.cjs` 的 4 !== 3 是先前已存在的失敗。

- v243：階段結束 `owqActor` 依本輪操作對象選電車／本體，電車選向只更新電車 fd；輸入、2D／3D 箭頭均以電車座標為準。電車被毀不回頭要求 Twitch 選向。`twModel` 等比例縮為 .5。

- v242：Twitch 改持續存在的電擊無人機（`tw*` 函式區塊），左側紫色無字按鈕部署／切換。`twRound/twActor` 在首次移動、轉向或動作鎖定本體／電車到本輪結束；部署選電車。單位仍由本體持有啟動與行動點；電車獨立 5 步、180°／10 格視野、6 格攻擊，直接扣 1 HP（`damage` 的 direct 參數保留擊殺記帳）。每場 2 台、同時 1 台；不用舊 disposable `moving` 無人機流程。Twitch 死亡後電車持續提供視野，不能操作，但仍可被敵人摧毀。對電車的射擊／監視／範圍傷害走 `twReceive`，1 顆特殊骰 3 MISS／3 準星，命中摧毀。移入火、毒氣、電流仍是環境危害。`tests/twitch-drone.cjs` 覆蓋規則，`tests/twitch.html` 是不連雲端的模型／按鈕／骰面測試。

- v241：黑鏡不提供獨立視野、不自動標記。`los` 的最後一個 `sight` 參數只供視覺判定，搭配 `mirSightPass` 允許內側往外看；射擊仍走原本不可穿鏡的路徑。`inSight` 預設維持射擊判定，視覺呼叫要傳第三參數 true。`tests/mira-vision.cjs` 驗證單向視線與雙向擋彈。

- v240：Mira 黑鏡保留軟牆／鐵牆宿主，`mirAsk` 以兩側箭頭選內側；`mirCanOpen` 驗證內側、本人視線與距離。`mirror3D` 分內外框、玻璃及紅色氣瓶，`mirrorDropPose` 驅動掉落，`SFX.mirror` 合成氣閥與碎玻璃音。`destroyCell` 清除鏡與洞口旗標；測試 `tests/mira.cjs`、視覺測試 `tests/mira.html`。

給接手的 AI 程式助理（Codex 等）。先讀完這份再動手。

## 專案是什麼

- 《Rainbow Six Siege – The Board Game》的網頁版，可對戰電腦、新手教學、自訂房間連線、排名戰、成就、商店。
- 線上版：https://r6-boardgame.github.io/ （GitHub Pages，`main` 分支根目錄直接發佈，推上去就上線）。
- 目前版本 v130（見 `git log`）。
- 使用者要求：PR 做完、測完就直接合併上線，不用再問。

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
| 多語系 | `I18N`、`I18X`、`I18T`、`trKey`、`tt`（見下方「多語系」） |

## 怎麼修改與發佈

- 版本公告：`index.html` 的 `NEWS` 陣列（新的在最前面），每天一筆 `{d:'YYYY-MM-DD',v:'版本範圍',i:[條目]}`，同一天的更新加進當天那筆。玩家沒讀過最新一筆時，大廳大聲公按鈕會出現紅點（`newsBadge`，localStorage `newsSeen`）。

1. 直接改 `index.html`（從現在起它就是唯一原始碼）。
2. 本機測試：`python3 -m http.server` 後開 `http://localhost:8000/`。至少測兩種尺寸：**手機直式 390×844** 與 **桌機 1400×900**。
3. 自動化測試建議用 Playwright：開頁 → `#t-pve` 進入對戰電腦 → 可在 `page.evaluate` 裡直接呼叫全域函式（例如 `WZ.step=2;renderWiz()` 跳到選地圖），截圖確認並收集 `pageerror`，必須沒有錯誤。
4. `git commit` 後 `git push origin main` 就會上線。commit 訊息格式沿用 `vNN: 一句英文說明`（下一版是 v131）。

### 舊流程說明（只是背景，不需要照做）

之前由 Claude 維護時，原始碼是一份給 claude.ai Artifact 用的版本，再用 build 腳本把 claude.ai 相關文字換掉、加上 MQTT shim 產生 `index.html`；另外同步發佈到 claude.ai Artifact。這套流程的暫存檔不在這個 repo 裡。**改由 Codex 接手後，直接改 `index.html` 即可**，claude.ai Artifact 版不會跟著更新。

## 使用者的偏好（很重要）

- 使用者用**繁體中文**溝通，主要在**手機**上看。
- 畫面不能捲動，只有「成就」頁和「商店」可以捲。
- 手機直式和桌機都要能玩、版面精緻。手機只有直式介面，橫放仍維持直式（v262，使用者指定；v258 的橫放電腦版已撤回）。
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
- v88：防彈攝影機改成貼牆：點格子後貼到同房間最近的實牆（門窗不行），碰到多面牆時讓玩家點發光的牆選；看前方 180 度（依視線），牆被破壞攝影機一起掉。Mira 黑鏡重做：關著時外面經過的進攻方會被標記、外面看不進來、雙方都不能隔著打；裡側相鄰防守方花 1 行動「打開黑鏡」，洞口變透明、雙方依視線互看互打。程式在 scratchpad v22/m88/。

- v89：視線改成扇形（規格見 project files `vision-design/vision-spec.md`）。每名幹員只看面前 120°（`inFan`），一般 10 格、狙擊手 Glaz/Kali 14 格（`VR`、`SNIPE`），背後看不到；距離改直線（`edist`，骰子分段仍是 1–3/4–6/7+）。看得到才點得到（`shootables0`），共享視野看得到但扇形外的敵人點不到、不提示。共享視野 `sharedCells(side)`：無人機、室內攝影機整個房間；牆上防彈攝影機、黑鏡、屋外監視器看半平面。`seenBy`、`visCells`、`revealCheck`（無人機房間內的隱藏防守方會現身）都吃它。面向是 `u.fd`（可以是任意向量），模型朝 `fd`；移動自動轉，按「轉向」（模式 `face`，8 個箭頭）免費轉。電腦：`aiTurn` 轉向己方已知的敵人，`bestFace` 沒敵人時看門窗、軟牆、破口最多的方向；開局防守方都用 `bestFace`。畫面：`visFx3D` 用兩張畫布貼在地板上：`fogP` 柔和迷霧（取代原本一格一格的 `fogIM`），`fanP` 只畫選取中的己方幹員扇形，紅色深淺依卡片三段骰子的期望值平滑漸層，射線碰到的牆畫黃色光。教學（`G.tut2`）射擊不看扇形。
- v90：Amaru 擲骰卡住修好：骰子材質快取 `DICE` 的鍵和骰子畫面 `DICE.r` 撞名，紅色閃電骰（`r`）會拿到畫面物件而出錯；材質鍵改成 `'m'+L`，`rollDice3D` 出錯時直接收掉骰盤繼續。「結束階段」按鈕右上角在還有幹員可動時顯示小標「還有幹員可以動作」（`.moreAct`）。穿軟牆射擊：第一槍牆被打出破洞（`c.hole`，3D 牆上畫黑洞），之後穿過這面牆只扣 1；再打一槍牆崩掉（`destroyCell` 後 `c.shotOut`），可以通過且不算掩護。
- v91：自訂幹員第一版（規格見 Claude Doc「自訂幹員規格」）。首頁「自訂幹員」開 `#cop` 頁（`openCop`/`renderCop`）：兩名幹員（幹員一女 `img/cop/f.webp`、幹員二男 `img/cop/m.webp`），存在 `ECO.cop[0/1]`（`nm/e/k/sv/d/arm/run/vis/g/sk`）。點數 = 10 + 擊殺（上限 34），骰子三段各 1 顆免費黃骰、每段 ≤5、合計 ≤10，點骰子升級 Y→O→R；裝甲 1～3 級（血 4/5/6、步數 6/5/4、奔跑上限 5/3/2，超過自動退回）；視野 120°+5°/點（最多 4 點）。「＋」新增的格子閃爍，「確認」才存；每列「−」退回該列上一步（`CP.st`）。五邊形與 N/R/SR/SSR/UR 用 `copScore`。重新訓練 500 聲望。攜帶道具 2 格（通用道具，攻守都能用：同一方的加進全隊數量 `copGear`，另一方的放在幹員身上 `u.gi`，用 `giBorrow` 暫借共用計數；闊刀、防彈攝影機、盾牌的 side 改成跟放的人）；技能格開技能收藏頁（技能攻守都能用），技能 8000 聲望（`ECO.sk`，商店多「技能」分頁 `SHOP.side==='S'`）。遊戲內：新進人員卡片＝自訂幹員（rifle 卡＝幹員一、shotgun 卡＝幹員二，選角頁「卡片版本」改成「幹員一／幹員二」，`copCard`），只在對戰電腦套用（`copPrep(true)`；線上 `copPrep(false)` 還原卡片數值）。每名幹員可有自己的視野角 `u.fh` 與技能 `u.sk`（`gTargets`/`useGadget` 外包一層暫時把 `u.op` 換成技能幹員）。結算 `copEnd`：擊殺加點；陣亡就重置成「炮灰」（技能與道具保留），中途離開不算陣亡。轉職武器還沒做。
- v92：自訂幹員轉職。`WPN`（mg 機槍／sh 盾牌／sg 散彈／rf 步槍／sn 狙擊／smg 衝鋒）各有隱藏條件 `trig`，按「確認」後新達成的那個（`WORD` 順序，機槍優先）跳轉職框（`CP.sheet={t:'w'}`：圖、專屬圖示、說明、異動、退回點數），轉職用 `wApply` 套上限（`bMax`/`bNoR`/`runCap`，多的骰子從弱的退）。存在 `c.w`，重新訓練與陣亡清掉。男生轉職圖 `img/cop/m_<w>.webp`（盾牌和女生沿用原圖，`copArt`）。效果：機槍三段各多 1 顆免費黃骰（`copDice`，每段上限 7）；盾牌受傷 −2、不能跑；散彈 dz 2、隔牆射擊直接打掉軟牆；步槍 180° + 穩定射擊（`askPickDie`，射擊後點一顆骰子重擲）；狙擊 `u.vr=14`（`VR` 先看 `u.vr`）；衝鋒槍第二槍（`canDo` 放行、`u._s2`、`u._half` 時 `shotPool` 擲一半）。職業限定技能 `SKCLS`/`skFit`（可買，不符時圖示壓「職業不符」、不能裝）。Glaz 翻轉瞄具開放（限狙擊手）：`UG.glaz` 切換 `u.pd`（中遠骰互換）與視野 180°/10 格，再按切回。女生轉職圖 `img/cop/f_<w>.webp`。職業技能 `CSK`（每回合 1 次，行動欄按鈕，`useCsk`）：機槍「架槍」（1 行動，`u.mgOw`：不能再移動、不結束行動，整個視野都算掩護射擊，`riposte` 跳過半平面判定）、步槍「精準射擊」（免費，`u.aim` 下一槍掩護 0）、狙擊「熱感瞄準」（1 行動，`heat` 模式選方向，`heatScan` 把扇形內敵人記成無名標記 `G.heat`／`heatPins`，到回合結束）、衝鋒「衝刺」（1 行動，移動點補滿，`u.noShoot`）；盾牌「盾牌猛擊」（1 行動，`bash` 模式選方向，`shieldBash`：衝兩格、打第三格，撞破軟牆路障、撞爆掩護 `wreckCover`，撞人 2 傷，背後是牆再 1 傷暈眩，背後有人 1 傷暈眩）、散彈「榴彈發射」（1 行動，`gl` 模式用投擲範圍，`grenadeLaunch`：3×3 兩傷敵我都算，鐵牆與轉角柱 `pillarC` 以外全毀）。被炸毀的家具記在 `G.propGone`（`propOn` 決定 2D/3D 畫不畫）。Buck 限步槍。技能收藏頁改成一頁捲動，卡片和商店顯示次數與行動點（`skUse`）。道具模型照參考圖重做：Frost 捕獸夾、Mute 干擾器、Maestro 邪眼（`evilEye3D`）、Jäger 主動防禦系統改成佈防時裝在牆上的道具 `ads`（`ads3D`，每台攔 2 次，`catchThrow` 看道具 3 格內）；邪眼和 ADS 放置跟防彈攝影機一樣選牆（`wallGadget`、`G.bpEye` 走 `bpface`，`g.wall`）。
- v93：商店技能詳情框重排（`skDet`：`.shDBox.shKD` 改成直排卡片，標籤列 `.shKDm` 顯示次數、行動點、職業限制，說明按〔被動〕〔行動〕分段）。
- v94：軟牆彈孔改成真的洞：`holeWall` 用細柱子圍出不規則開口（`rng(hash)` 決定形狀），邊緣碎片、地上碎屑；2D 也畫出破口。`los`／`wallSolid` 把 `c.hole` 的軟牆當成可看穿（跟打開的黑鏡一樣），所以隔著彈孔看得到、打得到（仍算輕型掩護 1）。
- v95：Alibi 改成 Prisma 投影分身（佈防／行動，2 次）：`GT.alibi` 3 格內空格，放下後進 `pdir` 模式選 8 方向（`G.pdir` 存 `pid`，`pdirG()`）。投影是 `type:'prisma'` 道具，`projU(g)` 做出跟本體一樣的假幹員給 `shootables`／`shootUnit`（`t.proj`：中彈就 `prismaBreak`，不扣血）。進攻方看得到就擋路（`reach`），穿過、C4、破片／衝擊（`GSTR.prisma`）、集束、闊刀、榴彈、EMP、盾牌猛擊都會打散。3D 用 `unit3D(projU(g))`＋複製材質，自己半透明（`figAlpha`）、敵人看實心；消失用 `prismaVanish` 原姿勢閃爍淡出不倒下。拿掉舊的開場多 2 個誘餌。
- v96：鏡頭少轉：用道具／技能不再切特寫（破片手榴彈 `fragShow` 只出卡片不動鏡頭），進射擊模式不再 `aimCam` 轉向目標，閒置 25 秒自動旋轉拿掉。射擊特寫預設第一人稱（`CINE.mode='fp'`）：開槍者模型隱藏（`R3.cineSelf`），視線上擋住目標的牆與家具用 `cineClear` 淡出，但隔牆射擊穿過的軟牆／路障保留（`keep`）。
- v97：轉職後的角色圖（`.cpArt.cw`）改成整張塞進舞台（`object-fit:contain`、底部對齊、遮罩從 82% 才淡出），不再放大裁掉下半身；步槍兵女版看得到臀部以下。 女步槍兵換成全身新圖。轉職條件加難（`nOR` 橘以上骰數、`nR` 紅骰數）：步槍＝中距 5 骰至少 3 橘＋視野 4；衝鋒＝奔跑 5＋近中各 3 骰以上各 1 橘；狙擊＝遠距 5 骰至少 2 紅；散彈＝近距 5 骰至少 2 紅；機槍＝裝甲 3＋三段各 3 骰以上各 1 橘；盾牌＝裝甲 3＋近中各 4 骰以上各 1 橘。

- v99：領事館照真實一樓藍圖重做（38×25 格，只有一樓）。旋轉樓梯區改成平面的半圓大廳（地圖欄位 `spiral:{cx,cy,r0,R}`），切成圓弧梯形格：每一格在規則上仍是一個方格（`spiralCells` 依半徑分環、依角度對應），只有畫法、棋子位置與點擊落點照圓弧走（`pcOf`、`cwx`/`cwz` 取格子中心、`w2c` 把點擊座標換回格子；`setInst` 會把高亮轉成圓弧方向）。弧形外牆 `spiralWall3D`（格子標 `c.curve` 不畫方塊牆），地板內嵌弧線 `drawSpiral`，大廳地板徽章 `drawMedal`，雕像花台 `statue`、平台鋼琴 `gpiano`。材質照實景俯視圖：`consulTEX`（clobby、cspiral、cblue、cmaroon、cbath、cbrown、cwood、cpiano、cslate），牆沿用 `bankWallMats`。炸彈點與人質每場隨機：地圖有 `sitePool`（房名清單）時，`parseMap(m,true)` 呼叫 `randSites`，從清單挑兩個共用一面牆的相鄰房間，各放 2×2 的 A／B 點，人質在 A 點；銀行也套用（教學仍用固定點）。領事館加入線上對戰地圖 `ONLINE_MAPS`。手機俯視放大鏡頭上限（`maxDistance` 140、相機 far 200）讓寬地圖裝得下。

- v100：咖啡館照真實一樓藍圖重做（37×29 格，只有一樓，地圖欄位 `tl:1`）：小麵包店、麵包店、紅樓梯／紅走廊、衣帽間、正門、大廳、吧台、用餐區、廚房（含 k3）、出餐區（含咖啡吧、洗碗區）、冷凍庫（地板活門）、準備室、VIP 室、VIP 走廊、車庫。黃色可破壞牆→軟牆，藍圖深灰的內窗（衣帽間、準備室、冷凍庫）→窗。材質照實景俯視圖：`kafeTEX`（kdot 米色黑點磚、kred 紅地毯、klobby 米色大磚深色格線、kwhite 廚房白磚、kgrey 出餐區淡灰磚、kdark 冷凍庫深褐磚、kprep、kcoat、kentry 正門地毯、kvip、kbar、kbeige、kwood、kgarage），牆沿用 `bankWallMats`。`assignMats` 會讓同一個連通區域裡後面的標籤蓋掉前面的材質，所以大廳那一大片的標籤都用 klobby，局部改用 `matRects`。新家具：`kcounter` 不鏽鋼工作台、`rtable` 圓咖啡桌配兩張紅椅、`xmas` 聖誕樹。炸彈點與人質用 `sitePool` 每場隨機（小麵包店、麵包店、廚房、準備室、出餐區、冷凍庫、衣帽間、正門、VIP 室裡共用一面牆的兩間）。咖啡館加入 `ONLINE_MAPS`。
- v101：俱樂部會所照真實一樓藍圖重做（42×32 格，只有一樓，樓梯只放模型）。新格子字元 `o`＝沒有門板的開口（`c.gap`）：可以走，但 `assignMats`／`randSites` 的房間填色不會穿過去，所以酒吧和舞台、走廊和酒吧這種大開口仍算不同房間。材質照實景照片：`clubTEX`（chstrip 紫色舞廳地毯、chpool 桃紅、chbar 深色石磚、chstage 黑木、chkitchen 紅磚瓦、chfridge 花紋鋼板、chgarage 油漬水泥…），牆用 `clubWallMats`（紅磚；可破壞牆下半是深色木護牆板）。新家具 `CLUBP`：`pole` 鋼管舞台（可站）、`dj` 台、`stage` 舞台平台（可站）、`cbars` 彩條投影幕、`bear` 熊、`bike` 機車、`stall` 廁所隔間、`meat` 冷凍庫掛肉、`neon` 霓虹招牌（第 6 欄 bar／pink／blue）、`stool` 吧台椅；3D 在 `clubProp`、2D 在 `drawClubProp`。炸彈點從 `sitePool` 隨機（撞球間太窄不列入）。加入 `ONLINE_MAPS`。
- v102：手機（觸控或短邊 < 700px）地板貼圖上限從 4096px 降到 2304px（`floorCanvas` 的 `cap`）：新的大地圖地板 4096px 又上傳兩次（顏色＋凹凸），iPhone 記憶體不夠，進遊戲地圖一片空白。`buildStatic0` 重建時也一起釋放 `bumpMap`／`roughnessMap`（之前每次牆被打掉重建都會漏掉這兩張）。
- v103：俱樂部會所調整：新格子字元 `d`＝預設打開的門（`c.kind='door'`、`wasBar`、`opened`，也當 `gap` 不讓房間填色穿過）；廁所兩扇門對開、補上西南角牆。吧台 U 形東端留開口可走進去，拿掉裡面的櫃子。脫衣舞廳換成有椅背、可站上去的 `csofa`（第 6 欄是椅背方向 n/s/w/e），鋼管舞台改八角形。炸彈點只在 脫衣舞廳、撞球間、酒吧、舞台、倉庫、車庫、休息室。修正 `buildProp` 裡 `B([單一材質])` 只畫到一面的問題（撞球台綠色檯面、舊沙發與長椅頂面之前沒畫出來）。
- v104：站上掩蔽物的高度改用 3D 實際檯面高度（`standMap` 從道具往下打射線存在 `R3.standY`，`standY(x,y)` 給模型 y；道具改放在 staticG 底下的一個子群組 `userData.props`，`cineClear` 會展開它）。選取中幹員的扇形也畫在可站掩蔽物的檯面上（`fanTop`），站在櫃檯上的新兵不會被檯面蓋住扇形。室內攝影機改成 360° 但只看得到同房間裡有視線的格子（`sharedCells`、`camRooms` 都加 `los`），牆角後面看不到。炸彈點的炸彈改成 3D 物件（`bomb3D`，`placeBombs` 在每個點中間挑一格沒有道具的格子設 `c.bomb`，那格是掩蔽物、不能站，`siteGoal` 會避開；撞擊/榴彈不會清掉它），原本的貼紙 standee 拿掉。走廊（標籤名有「走廊」）旁的門開局就是打開的（parseMap 洪水）。防守方幹員相鄰有沒封的門窗時，左下角出現「封門」按鈕（`barBtnUpd`、`barTargets`、`rebar`，花 1 行動，雙開門一起封）。每方結束階段跳「進攻方/防守方結束行動」（`endPhase`），新回合標題延後 1.25 秒。開場運鏡改從 46° 高角度、0.85 倍距離開始，鏡頭中心拖曳時限制在地圖範圍內。樓梯台階內縮避免跟側板 z-fighting。咖啡館炸彈點拿掉衣帽間、書架縮短讓出窗前；俱樂部吧台改成貼牆的細 L 形、開口朝樓梯，霓虹字和電視（`tv` 第 6 欄 `'n'` 螢幕朝北）都貼牆；領事館炸彈點只剩鋼琴室、黃色樓梯、廁所、前廳、櫃員室、簽證處，簽證樓梯縮成 1×2。
- v105：炸彈 3D 模型照炸彈卡圖重做（`bomb3D`：黃色鐵籠＋網面＋警示條、上面綠紅瓦斯罐、閥門、天線），高度 `BOMBH` 約等於幹員，佔自己一格（`placeBombs` 優先挑沒有道具的格子）。
- v106：炸彈不放在會擋路的格子：`placeBombs` 排除貼著門窗/開口（4 向）或拿掉後周圍可走地板會斷開的格子，整個點都不行就用點旁邊同房間的空格；隨機炸彈點的地圖還是放不下就重抽炸彈點（`placeBombsSafe`，最多 30 次）。雲端存檔：Firestore 不收巢狀陣列（自訂幹員骰子 `cop[].d` 是陣列的陣列），所以存檔一直失敗；`gaPack` 改把 ECO 存成字串 `ecoJ`（v:2），`gaMerge` 兩種都讀，存成功會清掉錯誤訊息，失敗 30 秒後重試。標題畫面「在線人數」（`.ttopr`）移到右上愛心/回饋按鈕下方。

- v111：線上對戰流程（排名配對、自訂房間、30 秒後的配對機器人都一樣）：配對成功 → VS 畫面（`mfVs`：左藍防守、右橘進攻，大頭貼角色大圖 `profArt`、遊戲內名稱 `ign()`＝ME.nick 或訪客名、連勝 ≥2 顯示數字＋火焰；大頭貼是自訂幹員時顯示名字、擊殺、存活場數）＋底部讀取條（預載地圖照片、格局圖、角色圖，並先用 `mkBoard` 建好地圖讓 3D 在蓋板下編譯）→ 場地拉霸 `mfSlot`（照片由右往左轉，停下 1.5 秒顯示炸彈／人質）→ 選角 `mfPick`（45 秒 `MFT`，上方場地名＋小格局圖，幹員／裝備兩分頁，最後 5 秒 `SFX.soft` 柔和提示音，時間到沒鎖定就全部隨機，雙方都鎖定就提前開始）。地圖從 `ONLINE_MAPS` 隨機、任務炸彈／人質隨機。PvP 的地圖任務由房主寫進 games 文件（`map`、`mis`），雙方鎖定各寫自己的 `picks/<code>_h`／`_g`（分開文件避免同時寫入互蓋）；房主在時間到後 8 秒仍沒收到對手就幫對手隨機。`addTeams` 加幹員、裝備、自動佈防。連勝 `ECO.streak`：線上（含配對機器人）勝 +1、敗歸零，對戰電腦不影響。大頭貼可選自訂幹員（`cop:0`、`cop:1`）與已解鎖職業（`cop:<i>:<w>`，轉職時記在 `ECO.wu`，陣亡也保留）。線上行動時間每名幹員 45 秒。監視改 8 方位（`dir8`）。可走格子加沿格子邊緣往上的短綠光（`R3.reachEdge`）。射擊特寫的卡片固定開槍者左下、目標右上，不再跟著 3D 位置跑。

- v112：選角頁上方顯示目前點到的幹員大圖、角色、專屬道具說明、三段命中骰、耐力／奔跑／破壞（`mfDet`），點一下看資料、再點一次（或按「加入小隊」）才加入；自訂幹員一、二分開列（`mfPool` 展開 recruit 的兩張卡，名稱 `mfName`，同一名幹員只能帶一張），沒有預設選角。線上進攻方（玩家）自己在部署階段放幹員（`addTeams` 第 5 參數）：PvP 房主是進攻方就本機部署、按開始才推送；客人是進攻方時房主先推送部署盤面、自己停在選角頁等到 play 狀態（`netApply` 的 MF 判斷）。線上計時改成每個階段 45 秒（`PHT`，`startPhase` 換邊就重填）。炸彈點對進攻方玩家先隱藏（`bombHid`：地板標示、虛線框、A/B 徽章、3D 炸彈、格子說明），進攻方幹員視野或無人機看到炸彈才跳「發現炸彈」並顯示（`bombDiscover`，掛在 `camDiscover`，記在 `G.bombSeen`）。拆彈器可裝在炸彈點整個房間（`siteAt`／`plantOK`）。監視只開一槍（`u.owShot`，機槍架槍除外）。可走格子改亮綠、畫在扇形上面（`reachIM` renderOrder 6、y .065），邊緣綠光加高。

- v113：使用者更正規則：拆彈器裝好後第三個防守階段結束時「炸彈已被拆除，進攻方獲勝」，不會爆炸。`bombBoom` 只跳提示並 `finish('A',...)`（`boomFx3D` 留著沒用到）。
- v114：「自訂幹員」改名「培養幹員」（頁面、首頁按鈕、商店文字）。結算頁有帶培養幹員就顯示「名字　點數 +N」或「名字　陣亡」，線上（含配對機器人）也算（`copEnd` 用 `copSlot(u.op)` 找）。陣亡的幹員重置成「新進人員」（`copNew`，舊存檔的「炮灰」也改名），並記進 `ECO.alum`（i、w、nm、rk、k、sv、by＝擊殺者幹員名，來自 `damage` 記的 `u.kby`）。培養幹員頁上方「學長姐」按鈕開 `#copAl` 名冊（`openAlum`），沒人陣亡時顯示「你是第一屆新兵」。
- v115：選角頁縮小：上方資訊卡改成一條（62×92 小圖、名字列右側小「加入／移出」鈕 `#mfAdd`、能力文字限 2 行、骰子與數值同列）；`.mfOps` 用 `--mfc` 欄數（6/7/8 依人數）＋ `grid-auto-rows:minmax(0,1fr)` 填滿剩餘高度，所有幹員一次看到不用下拉。
- v116：`scrollSnap(el)` 在重畫前記住所有捲動區位置、重畫後還原（設定頁頭貼清單 `.avgrid`、`renderOpSelect`、`renderWiz`、`mfDraw`），選了東西不再跳回頂部。頭貼改用 `img/av/` 的胸上裁切圖（192×192，由 `img/cop/`、`img/face/` 產生）：`copAv(k).av` 給培養幹員、`pic:<幹員>`（`opPic`）是已擁有幹員的照片頭貼，對戰 VS 畫面仍用全身/`opFace` 大圖。
- v119：手榴彈（破片、閃光、衝擊、煙霧、C4）地圖上的棋子會後仰再前傾丟出，手榴彈拋物線飛過去並在落點爆炸（`mapThrow`），之後才接戰鬥特寫的丟出動畫。被穿牆射擊的幹員旁邊有紅色箭頭指向攻擊來源（`u.hitFrom`、`hitArrow`，造型同選角度箭頭，回合結束清掉，只給被打的一方看）。穿牆射擊改用精確格線判定（`segCells`），線段碰到承重牆／加固牆就不能打。線上每階段改 90 秒（`PHT`）。對方用技能不再跳文字卡（`gHint` 只給自己）。畫面外有對方射擊、丟手榴彈／閃光彈、或自己幹員所在房間的牆被炸，螢幕該方向大範圍淡紅閃一下（`edgeAlert`）。這些事件放在 `G.fxq`（`fxEv`），線上靠狀態同步傳給對方，`netApply` 後 `fxSync` 播放。
- v125：放置型道具 3D 化與新規則。Ela Grzmot（`grz3D`）、Maestro 邪眼點格子後跳「地板／牆上」選擇框（`wfAsk`、`wfPlace`，`G.wfPend` 讓可裝的牆發光，點牆也算選）。Bandit 電瓶（`ced`，`ced3D`）只能放加固牆旁（`g.wall`，那面牆 `c.elec` 由 `syncElec` 依電瓶推算，兩面持續電弧 `zapField`）或鐵絲網上（`g.wire`）；進攻方走進電瓶格、牆另一面那格、通電鐵絲網扣 1 血並觸電動畫（`zapU`、`SFX.zap`），每次啟動一次。鐵絲網 3D 改成散亂線圈（`wire3D`），道具欄圖示 `WZI.wire`。闊劍地雷（`clay3D`）放相鄰格後選四方向（模式 `cdir`、`G.cdir`＝`g.cid`），範圍是正前方與左右斜前方各一格（`clayRays`，紅線碰牆就停，門窗可通過）；防守方走進、衝刺（Oryx、盾牌猛擊）都當場陣亡（`clayCheck`），進攻方不觸發；遠距破壞只會炸掉不傷人。
- v126：鐵絲網變細、闊劍紅線改實色。v127：Goyo 燃燒盾（`volcan`）不再算防彈，可遠距點選破壞（`camClicks` 也收它）；爆燃 `goyoBurn`：3×3 火 `life:4`（一回合四階段，`g.goyo`），裡面的人立刻 -1，之後走進去 -1（每次啟動一次），燒完時還在火圈內再 -1（`goyoOut`）；站在火裡的角色身上有靜態火焰（`burnFx`）。電牆、電鐵絲網改成藍色半透明靜態電弧（`zapStatic`，用 seed 固定形狀，沒有動畫），牆面有淡藍發光面板。
- v129：電流與身上火焰改成一般混色（不再加色變白）。
- v128：闊劍地雷爆炸範圍改九宮格（`clayBoom`：3×3 內所有人陣亡，含放置的進攻方、無人機、投影）；每個動作後 `afterAct` 會跑 `clayScan`：放下或轉向時紅線已碰到敵人、或擋住紅線的牆被打掉後敵人已在線上，都會立刻爆。道具傷害（闊劍、燃燒、火、毒氣、集束、C4）也會炸毀範圍內的無人機（`droneHit`）；無人機開過帶電格、火、毒氣會爆炸（`droneHazard`，電腦的無人機會繞開）。
- v130：Goyo 燃燒盾的紅色燃料罐移到盾的內側；點擊／遠距破壞只能從燃料罐那一面（volcSide），外側點了會提示；手榴彈、衝擊手榴彈、C4、集束炸彈、闊刀地雷、榴彈等爆炸物波及時任何一面都會引爆（volcBlast）。
- v131：鐵絲網可以和 Frost 捕獸夾疊在同一格（`stackOK`，佈防與對戰都可，捕獸夾也能放到鐵絲網那格），踩進去兩個都觸發。捕獸夾改成進攻方視線內看得到（拿掉 `gadgetVisibleTo` 的隱藏），看到後可遠距點選破壞（`camClicks` 加 mat）；`canHitG` 抽出單一道具的破壞判定，`doDestroy` 疊放時優先打能打到的捕獸夾。
- v132：捕獸夾改回對進攻方隱形。踩到時血量減半（剩 floor(hp/2)，扣 hp−floor(hp/2)），`u.matStuck` 定在原地（`reach` 只剩原地），不再結束啟動；行動欄「拆掉捕獸夾」花 1 行動（`unMat`，AI 啟動時會先拆）。3D：`matSnap` 夾住動畫、`matFx` 讓捕獸夾一直夾在腳上（`matBuild`）。
- v133：捕獸夾在地上改成半透明（g3x `mat` 用 `matpT` 等透明材質）。鐵絲網不再結束啟動：踩進去扣 1 血、這次啟動剩下的移動點 -1，剛好是最後一步（移動點已 0）就不扣；規則書那條也改了。
- v134（Claude）：Vigil 不會被發現、也不能被選為穿牆射擊目標；佈防時點軟牆會問要加固還是破壞（`wallAsk`）。
- v135～v143（使用者在 Codex 做的）：v135 Sledge／Thermite／Ash／IQ／Fuze／Zofia 能力改寫、同格地上道具最多疊 2 個（`stackOK`/`gadgetOffset`）、圖鑑分類與「公告」按鈕（`openNews`）；v136 培養骰每段上限 4 顆（`bMax`）；v137 破片手榴彈擲手榴彈骰（`GRENADE_DIE`）；v138 機動盾（減 1）／重盾（減 2）；v139 監視只對有移動的敵人觸發（`trackMovement`）；v140 煙霧擋視線（`smokeBlocks`）；v141 防守方打掉拆彈器即獲勝；v142～v143 職業主動技佔技能格（`classKey`/`hasClassSkill`），衝鋒兵被動「衝鋒陷陣」鎖骰（`lockRushDie`）。測試在 `tests/*.cjs`，用 `node tests/xxx.cjs` 跑。
- v144：踩到捕獸夾時 `matCine` 把鏡頭切到角色側面 45 度、看腳的特寫（借用 `R3.cineSave`/`shotCamEnd`），`matSnap(u,true)` 播慢版：張開 0.5 秒 → 夾上、白色衝擊圈、角色下沉前傾抖動，扣血後回到原鏡頭。爆破炸藥（`chargePlant3D`）改成依牆厚貼在牆面（軟 .15／加固 .21／硬 .2／路障 .04 + .012），高度不超過牆高的 55%。
- v145：窗戶路障（`c.t==='bar'&&c.kind==='window'`）在 `protection` 只給 1 點掩護（門路障、軟牆仍是 2）；隔窗射擊跟門一樣會把窗戶路障打掉（`shootUnit` 的 `dr` 也收窗戶）。測試 `tests/window-cover.cjs`。
- v146：銀行地圖：刪掉檔案室最上面擋住窗戶 (16,5) 的書架；櫃員室／行政辦公室交界原本是 2×3 的 `#` 牆塊（3D 會出現兩個小空心方塊），改成 col 13 一條直牆 rows 10–13，(14,11)(14,12) 併入行政辦公室，(13,10) 變牆。
- v147：衝鋒兵（男）換新立繪：`img/cop/m_smg.webp`（使用者給的蹲伏前衝圖，rembg isnet 去背、裁到主體、高 900）與頭貼 `img/av/cop_m_smg.webp`（頭盔胸上 192×192）。
- v151：v150 誤把裝甲第三格改成 3 步，已改回 6/5/4 步。使用者說的「速度」是速度條（奔跑上限）：裝甲一格可點 5 格、兩格鎖 1 格（上限 4）、三格再鎖 2 格（上限 2）。原本兩格是上限 3。改 `COPARM[].run`。
- v152：加裝甲時若速度超過新上限會自動退速度點，退回的點數算進裝甲 2 點的花費（`armFree`）。例：速度 5、裝甲 1、剩 1 點，可以加裝甲（速度退成 4）。
- 使用者偏好（v119 起）：改完**先上線再測試**，有問題再改，沒問題就不動。

## 尚未完成 / 等使用者回覆

- 使用者說「如果技能需要消耗兩個行動點，只剩一個行動點就不能開」：但目前程式和原版卡片裡**沒有任何技能要 2 行動點**，已問使用者是指哪個技能，尚未回覆。
- 曾提議但未回覆：Echo、Flores、Mozzie 的無人機也改成一步一步走；全面核對幹員卡能力。
- v75：銀行地板和牆改用 Poly Haven CC0 掃描材質（`R6_TEX` 的 `bkMarble`、`bkLime`、`bkVelvet`、`bkWool`、`bkWood`、`bkPlaster`，512px）。大廳／前廳大理石每塊取不同區域（`slabs`），檔案室改成橡木地板 `bwood`。`bankWallMats(soft)`：實心牆暖米色加石縫、可破壞牆淡色，都有深色木踢腳板（貼圖 repeat 0.5，一張涵蓋兩個牆高）。ambientCG 被雲端網路擋，Poly Haven 可以連。
- v117：線上對決加回部署階段。PvP 防守方不再自動佈防（`addTeams` 第 6 參數 `defDeploys`），`G.dep` 記輪到誰部署：防守方先擺幹員與道具，按「部署完成」（`depDone`，順便 `seedDecoys`）推給進攻方，進攻方再選出生點按開始行動。等待的一方：進攻方留在選角頁（`MF.gotState` 防止 30 秒斷線判定），防守方看「等待進攻方」；`netDirty` 在別人部署時不推送。配對機器人局玩家當防守方也自己部署。
- v118：選取幹員的扇形在分界弧線中間加上距離數字（3、6、最遠 10／狙擊 14），深色小圓牌，在 `visFx3D` 的 fanP 畫布裡；放在最靠近扇形正中、且視線真的到得了那條弧的射線上，被牆擋住就不畫。
- v130：扇形距離數字沿著半徑轉向，數字底部朝向幹員，站在幹員位置往外看是正的（不跟鏡頭轉）。
- v129：扇形距離數字改成白字加陰影、不要黑底；3、6 的分界弧線在數字兩側斷開留空隙，最遠的數字往內縮 0.45 格不壓在扇形邊緣。
- v121：線上選角頁，兩位培養幹員只能帶一位：選了一位，另一位的格子變灰並加鎖頭（`.mfOp.lk`），詳情按鈕顯示「已帶另一位」。單機精靈本來就只有一格新兵（用變體切換），不受影響。
- v193：好友代碼。`frCode(uid)` 由玩家 id 算出 6 碼代碼；`profPush`（跟著 `lbPush` 與開好友頁時執行）把名字與最強培養幹員（`frBest`，依 `copScore` 排）寫到公開文件 `prof/<代碼>`。好友頁上方顯示自己的代碼（可複製）與「輸入好友代碼」欄（`frAddCode`）；點好友名字開 `frPeekHTML`（最強幹員頭像、評級、`lobKD` 擊殺／存活、和你的勝敗）。大廳右上角多一個加好友圖示 `#t-fr` 直接開好友頁。
- v194：組隊（小隊）與 4v4 合作打電腦。MQTT 文件：`on/<好友代碼>` 在線心跳（`onPush` 每 25 秒）、`inv/<代碼>` 邀請（`invListen`/`invGot`/`invShow`，30 秒失效）、`pt/<pid>/h` 只由隊長寫、`pt/<pid>/g` 只由隊員寫（`ptSave`/`ptListen`/`ptGot`，`PT` 物件）。好友列 `frRowHTML` 顯示在線狀態與「邀請」；大廳右側直式小隊 `#sqd`（`ptUI`）；`ptLobby` 改寫大廳按鈕（隊長：對戰電腦→`WZ.coop` 精靈只走陣營/任務/地圖，之後 `cpHostGo`；隊員：線上對戰變「等待隊長」）。選角 `#cpk`（`cpOpen`/`cpRender`，各選 2 名，隊友選的框上名字、不能選，衝突時隊長優先，60 秒 `CPT`）。`cpLaunch` 由隊長用 `newGame`（`COOPNEW` 讓電腦只帶 4 人）建局，幹員 `u.own='h'|'g'`，`G.coop={h,g}`，再走既有 `games/<pid>` 整盤同步（`NET.coop`）。回合：`ORDER` 原本就是 A,D,A,D，`coopOwner()` 依 `phaseIdx<2` 決定隊長或隊員，電腦階段由隊長那台跑 `runAI`（合作時每階段 2 名）；`coopIWrite()` 決定誰推狀態，`canAct`／`myPh()`／`myUnspent()` 擋掉別人的幹員與階段。隊長負責部署全隊。對方斷線時 `coopStall` 在時間到 15 秒後接手。`netDes` 會刪 `_shc` 快取（JSON 後 Set 會壞）。


## 多語系（v123 起）

- 程式碼裡的文字一律寫繁中；切換語言時，`MutationObserver` 會把畫面上的中文文字節點與 `title`／`placeholder`／`aria-label` 換成對照表裡的英文（日文目前暫停，選單標示「日本語（翻訳中）」）。
- 對照表：`I18N`（手寫的舊表）、`I18X`（產生的整句表，`'中文':['English','日本語']`）、`I18T`（有變數的句型，`['{0} 摧毀了{1}','{0} destroyed {1}','…']`，`{0}` 等處會先各自翻譯再填回）。
- 找不到整句時，`trKey` 會依序試：句型 → 去掉頭尾標點 → 用 ` · `、`：`、`，`、`、`、空白拆開逐段翻。
- **新增或修改任何會顯示的中文時，要同時在 `I18X`（或 `I18T`）補英文**，否則英文版會露出中文。開發時可在主控台看 `I18MISS`（目前畫面找不到翻譯的中文）。
- 畫在 canvas 上的字與 `confirm()` 不會被自動換，要包 `tt('中文')`。
- 幹員卡片在英文模式下直接用卡片英文原文（`cardText`、`c.g.ab`）。
- 英文字變長時，不要縮小字級：放大格子（讓它換行或加寬），或改用較短的同義詞。
- 規則書全文有英文版：`<script type="text/plain" id="rulesmd_en">`（緊接在 `rulesmd` 後）。英文模式下 `rbBook` 會讀 `書的 src + "_en"`；改中文規則書時記得同步改英文版。

## v131：吧台場景（背景）

- 棋盤底下是黑色遊戲墊，放在亮漆木吧台上；背景是酒吧實景照片（跟著鏡頭傾斜的照片球 `R3.bar.sky`）。程式：`barInit`（init3D 結尾，載入素材、換燈光與環境貼圖）、`barBuild(m)`（buildStatic 結尾與 size3D 呼叫，依地圖尺寸與直／橫式重建）。
- 素材都在 `img/bar/`，全部來自 Poly Haven（CC0，可商用、免標註）：`cowboy_town_saloon` HDRI（已調暗紅色調、轉成 `bar_bg.jpg`／`bar_env.jpg`）、`lacquered_cherry_wood` 貼圖（`wood_*.jpg`）、`Lantern_01`、`wine_bottles_01` glTF 模型。
- `.grade` 改成暖色暗角。

## v155：人質局不顯示 A／B 點

- 人質局地圖上不再畫 A、B 炸彈點標記（地板色塊、外框、3D 徽章、格子名稱都走 `bombHid`，人質局一律回傳 true）。人質本身照舊由 `hostSeen` 決定：防守方一直看得到，進攻方要發現（`hostFound`）或護送後才看得到。

## v156：無人機移動中看不到房間，掃描按鈕移到左下

- 照規則書：無人機結束移動時才掃描所在房間。移動中（`g.moving`）的無人機在 `sharedCells` 只看得到自己那一格；`camDiscover`／`bombDiscover` 不再用移動中的無人機發現道具和炸彈，改在 `droneScanNow` 掃描當下呼叫一次 `camDiscover()`。
- 「掃描」改成左下浮動方塊按鈕 `#scanBtn`（`scanBtnUpd`），跟「封門」`#barBtn` 同大小同位置；面板上原本的「結束移動並掃描」換成不能按的「無人機移動中」提示。新手教學的按鈕步驟改找 `掃描`，`tuBtn` 與脈衝提示的選擇器也加上 `#scanBtn`。

## v157：新大廳

- 拿掉「虹彩六號 戰術桌遊」字樣與 logo（`.tlogo` 一律隱藏）。主頁（`SCREEN==='title'`）不再用 `#tmenu`，改由 `lobRender()` 畫在 `#tlob`（`.tbg` 後面）；`lobMob()`（寬 ≤ 760px）決定版型，視窗跨過門檻會重畫。
- 手機（`.lob.m`）：中間站著自訂幹員（`copArt`；構圖特別滿的圖用 `HSC` 縮小，例如蹲姿衝鋒兵 `m_smg` ×0.68，左右箭頭切換 `LOBI`，存在 `r6bg.lobi`；點人物開培養頁），下方擊殺／存活戰績牌 `lobKD`（紅色擊殺牌＋心電圖存活牌）；左側小卡：活動（灰階不能點）、訓練任務、排行榜；下方「對戰電腦」「線上對戰」；最底分頁列：大廳、訓練、幹員、商店、作戰檔案。
- 電腦（`.lob.d`）：左邊單一幹員＋名牌與戰績牌；右邊磚塊：線上對戰（大）、排行榜（前三名＋我的排名）、對戰電腦、訓練任務、培養幹員、商店、作戰檔案、活動（紫色，準備中，不能點）。
- 按鈕 id 沿用 `t-pve`、`t-rank`、`t-cop`、`t-shop`、`t-lib`（新手教學會找這些 id）。新畫面：`SCREEN='train'`（`trainHTML`，「新手教學」`t-tu2` 呼叫 `tuStart()` 重玩腳本教學）、`SCREEN='board'`（`boardHTML`，前 10 名＋我的排名）。
- 排行榜：每個玩家把兩名自訂幹員寫到共用資料 `board/<uid>_<slot>`（`{nm,k,sv,by,ts}`，`lbPush`，擊殺與存活都 0 時刪掉）；`lbLoad` 讀整個 `board` 集合（60 秒快取），自己的幹員用本機最新數值（`lbMine`）。排序：擊殺多的在前，同分比存活場數。

## v159：作戰檔案改成「圖鑑主打」

- `SCREEN==='lib'` 也由 `lobRender()` 畫在 `#tlob`（`libHTML`），`#tmenu` 隱藏。左邊大塊是幹員圖鑑：已擁有／總數、進度條、分頁（全部／進攻／防守／已擁有，`LIBF`）、頭像牆（`img/face/*.webp`，新進人員用 `img/av/cop_f|m.webp`；沒擁有的灰暗；點頭像開 `openOpSelect(...,true)` 並選中那名幹員；頭像牆可以在框內捲動）。右邊兩張小卡：規則（`#t-man` → `openManual`）、成就（`#t-ach`，進度環＋最近解鎖）。
- 手機底部分頁列改成共用的 `lobNav(目前分頁)`（`t-home`、`t-train2`、`t-cop`、`t-shop`、`t-lib`）；電腦版左上「‹」回大廳。

## v160：手機底部分頁列常駐

- 手機（`lobMob()`）在選單畫面（`body[data-scr="title"]`，含大廳、訓練、作戰檔案）一直顯示 `#gnav`（`gnavSync` 每 250ms 依 `gnavState()` 亮對應分頁，`gnavGo` 切換：幹員開 `openCop`、商店開 `openShop`，其餘關掉這兩頁再換 `SCREEN`）。`#gnav` z-index 125，蓋在 `#cop`(115)、`#shop`(120) 上；顯示時 `html.gnav` 讓 `#shop`、`#cop`、`#copAl`、`.manual` 的底邊抬高 `--gnH`、`#title` 底部留白，原本的按鈕不會被擋到。幹員圖鑑 `#opsel`（z 200）會蓋過分頁列。

## v161 訓練任務頁（方案 3：任務簡報＋關卡清單）
- `SCREEN==='train'` 現在跟作戰檔案一樣畫進 `#tlob`（`trnHTML()`），`#tmenu` 隱藏。舊的 `trainHTML()` 已不用。
- 關卡資料在 `TRN` 陣列（目前只有新手教學，`done` 看 `tuSeen()`），`TRNN=8` 是清單總格數，多的顯示「敬請期待」上鎖。
- 第二章、第三章、活動關卡分頁先 disabled。
- 星星評分（提議中，使用者還沒定案）：三個通用條件（過關、無人陣亡、N 回合內完成），每關只填回合上限。新手教學不算星。等第一個正式關卡做好再加星星顯示。

## v162 訓練任務關卡系統（職前訓練／固若金湯／破門攻堅）
- 規劃文件（使用者已同意方向）：三大類。職前訓練＝7 職業 × 入門／進階／挑戰，主角是「固定職業幹員」不是玩家的培養幹員；固若金湯＝炸彈防守 6 關，全過送 Castle 技能；破門攻堅＝炸彈進攻 6 關，全過送 Sledge 技能。
- 每關第一次過關：聲望 `LVRN=[200,300,500]`（依 tier）＋培養點數 `LVPT=[1,1,2]`，點數在過關橫幅讓玩家選給幹員一或二（沒選就給大廳展示中的那位）。進度存在 `ECO.lv[id]`（會跟雲端存檔走）。
- 關卡資料在 `LVL` 陣列，主角數值在 `LVHERO[cls]`。欄位：map、mission(hostage|bomb)、rounds、zone(出生區 index)、passive(防守方不行動，只會自動監視)、goal:'plant'(安裝就算過)、hero:'live'(主角倒下就失敗)、def(手動擺放的防守方 [op,x,y,fd])或 foes(交給 autoDefSetup)、allies。
- 主角用 `recruit_a_rifle` 暫時改 PROF/OPS（`lvHero`），離開時 `lvRestore()`。關卡對局 `G.lv` 存在時，最外層的 `finish` 包裝直接走 `lvFinish`，不會跑一般對戰的聲望、成就、培養幹員結算（也不會讓培養幹員陣亡重置）。包裝寫在主 script 最後面，新加的 finish 包裝要放在它之前。
- 目前只做了衝鋒兵 3 關（smg1–3），其他職業和兩個炸彈篇顯示「敬請期待」。新增職業時記得補 `LVHERO` 和 `CSK` 的職業技能。

## v163 底部分頁列順暢度
- 點分頁時先立刻把那顆標成選中，下一個畫面幀才真正切頁（`requestAnimationFrame` + `setTimeout`），手指放開就有反應。按鈕加了 `touch-action:manipulation`。
- 商店卡片改用 `opArtU(b)`（base64 立繪轉成快取的 blob URL，登入 3 秒後閒置時預先轉好），不再每次重畫都把幾 MB 的 base64 塞進 innerHTML。

## v164 選單頁效能
- 選單畫面（大廳、訓練、作戰檔案等，`body[data-scr=title]` 且 `#title` 顯示中）被 `.tbg` 完全蓋住，`tick3D` 現在直接跳過 3D 繪製（之前會在背後一直畫 5 個英雄模型，手機很耗效能）。
- 作戰檔案的頭像改用縮圖 `img/face_s/*.webp`（寬 160，約 12KB；原圖 `img/face/` 寬 360 保留給其他地方）。新增幹員頭像時記得兩個資料夾都放。

## v165
- 訓練任務簡報圖右上角的任務編號方框（MISSION-1、DEFENCE 等）已移除（吾主要求）。

## v166 訓練任務改版（吾主定案）
- 訓練頁先是三個大方塊：職前訓練、固若金湯、破門攻堅（`TRS.v`='cats'|'job'|'def'|'atk'，只記住目前分類）。
- 職前訓練：一頁 7 張職業卡＋新兵教學。每張卡是職業半身圖，切成三份按鈕（入門/進階/挑戰），按下跳出任務簡報小窗（`TRS.pk`＝關卡 id 或 'tu'），按「開始任務」才進關。不用分職業按鈕、不捲動。
- 職業卡用圖 `LVART`：狙擊用女圖、機槍用男圖（吾主指定）；衝鋒、重盾、散彈男，機動盾、步槍女。
- 固若金湯／破門攻堅：Castle、Sledge 大圖切 3×2 六格，關名在 `LVSET[k].ls`，目前都鎖著（敬請期待）。

## v167 六個職業的入門關
- 新增 hs1 堅守走廊、sh1 破障先鋒、sg1 開路先鋒、rf1 架槍守點、sn1 高處掩護、mg1 火力壓制；每個職業的入門關都能直接選（吾主：沒有哪個職業先）。主角能力值在 `LVHERO`。
- `lvStart` 期間 `Math.random` 換成以 `L.id`＋`L.seed` 為種子的亂數，所以炸彈點、人質、守衛位置每次都一樣；要換配置改 `seed`。銀行以外的地圖沒有固定炸彈點，會用 `randSites`（同樣吃種子）。
- `cluster:true` 把其他守衛擠到第一名守衛旁邊（散彈兵榴彈關用）。
- 可行性用尋路成本檢查過（主角每輪一次行動：移動＋奔跑），但都還沒真人試玩平衡。

## v168 讀取畫面
- 讀取畫面會等到 Google 登入狀態確定（`R6FB.settled()`），已登入的話再等雲端存檔讀完（`GA.busy`），最多多等 8 秒，所以淡出後直接是「歡迎」，不會先閃登入按鈕。這段等待算在讀取條的 90%→99%。
- 讀取條下方不寫「讀取中」，改輪播幹員趣味句（`LN`，中英日三語，依 `r6bg.profile` 的 lang），右邊顯示百分比。新增句子直接加進 `LN`。

## v169 遊戲內順暢度
- 讀取畫面期間 `window.__warm` 先把所有圖（幹員立繪 blob、作戰檔案頭像、職業立繪、地圖背景）載入並解碼，保留在 `__warm.keep`；接著在讀取畫面底下先建一次商店和培養幹員頁再藏起來。讀取畫面會等它完成（最多 15 秒），進度算在讀取條 90%→99%。新增常用圖片時，把網址加進 `__warm` 的清單。
- 重盾、機動盾職業立繪從 1–2.4 MB 的 PNG 改成 900 高的 webp（約 60–160 KB）。
- 底部分頁切換時（`gnavGo`）關閉商店或培養幹員頁不再先重畫大廳（`GNSW`），避免切一次頁畫兩次。
- 讀取文字每次都隨機挑一句，不會連續重複。

## v170 底部分頁卡死修正
- 手機底部分頁的按鈕原本用了和大廳導覽一樣的 id（t-lib、t-cop…），`renderTitle` 裡的 `go('t-lib',…)` 會把底部按鈕的點擊換成大廳版本，結果從商店點作戰檔案時商店不會關、畫面卡在商店。底部分頁按鈕現在只用 `data-gn`，不要再給它們 id。
- 用底部分頁切換時，商店／培養幹員頁直接關掉，不播淡出動畫（`GNSW`）。

## v171
- 職前訓練：新手教學卡改用女新兵半身（`COPART[0]`），衝鋒兵卡的圖縮小（`.trnCd[data-w=smg]`，蹲姿顯得比別人大）。

## v172 介面音效（真實錄音）
- `snd/*.mp3`：Kenney Interface Sounds（CC0），對照表在 `snd/CREDITS.txt`。SFX 一開始就抓檔，玩家第一次點擊（音訊解鎖）後解碼；沒解碼完會退回原本的合成音。
- 點任何按鈕會依按鈕種類自動選音：分頁類 `tab`、返回/關閉 `back`、主要按鈕 `ok`、訓練關卡格 `open`、其他 `tap`（規則在 SFX 底部的 pointerdown）。購買幹員/技能 `SFX.buy()`，培養幹員加減點 `SFX.click()`（`tick`）。音量在 `SMP`。
- 下一步：戰場音效（腳步、槍聲、破牆、道具）也換成錄音素材。

## v173
- 入門關（`L.t===0`）沒有戰爭迷霧：`noFog()` 讓玩家一直看得到守衛（煙霧仍會遮），迷霧遮罩不畫，守衛開場就現身、沒有誘餌。
- 作戰檔案圖鑑不列新兵（recruit_*），總數變 60。
- 手機底部分頁按鈕：蓋掉全域 `button:hover` 的白邊和左側白色內陰影，點的時候不再閃白線。

## v174
- 訓練關卡（lvStart）進場鏡頭：`lvIntroCam(hero)` 從主角正面低角度特寫（半徑 2.3、仰角 .16）開始，繞一圈多並拉高，目標點從主角滑到棋盤中心，最後停在 `setView('top')` 的俯視位置。
- 透過 `R3.intro` 的 `ta`（起始目標）與 `r0`（起始半徑）欄位擴充 introStep；`lock:1` 讓過場中其他 flyTo 不打斷，使用者拖曳仍可中斷。

## v175
- 玩家設定面板 `.psettings` z-index 70 → 130，蓋在底部選單 #gnav（125）之上，手機上最下面的設定不再被擋。
- 音效解鎖：iOS 的觸控 pointerdown/touchstart 不算使用者手勢，AudioContext 一直是 suspended。改成 touchend/pointerup/click 也會呼叫 init()，並在手勢內播一個 1 樣本的靜音 buffer；回到前景時重新 resume（處理 interrupted）。
- iPhone 靜音開關打開時 Web Audio 本來就不會出聲。

## v176
- 介面音效換成戰術感的機械聲（保險、卡榫、槍機、皮套、無線電雜訊），來源仍是 Kenney CC0（UI/RPG/Impact/Sci-Fi Audio），疊加合成低頻悶響，細節見 snd/CREDITS.txt。檔名沒變，fetch 加 `?v=176` 避開快取。
- Kenney 檔案可從 media.githubusercontent.com/media/series-ai/jam-ready-assets/HEAD/kenney-*/audio/Audio/*.ogg 取得（raw 是 LFS 指標）。

## v177
- 底部選單切換時（gnavGo 的 closeAll）一併移除成就/好友面板 #achp（z-index 90 在 #gnav 下方，原本切頁後成就面板還蓋在畫面上）。

## v178 Foley 音效與音樂（使用者桌面 Foley 資料夾）
- snd/fx：返回 back、點擊對戰 battle（#t-rank/#t-pve/#t-board/#t-lvgo/.trnGo）、部署人員 deploy1-3（setup 放幹員）、狙擊 sniper（w==='sn' 射擊）、盾牌 shield（w 為 sh/hs）、手榴彈 nade_pin/nade_hit、爆炸 boom1/2（SFX.boom 優先用錄音）、燃燒 fire（ignite/goyoBurn）、封門窗 barricade、軟牆 wall（destroyCell 依格子種類）、攝影機 camera（doDestroy 摧毀道具）。
- snd/mus：MUS 模組用單一 <audio>：大廳 lobby1-5 隨機輪播；SCREEN 為 queue/wait/find 時 queue；MF 選角與 setup 階段 prep；訓練關卡與教學 mission；一般對戰 play 階段仍用合成緊張配樂。音樂開關沿用 SFX.mOn。

## v179
- 線上對戰帶培養幹員：鎖定陣容時把自己的培養幹員數值打包成 snapshot（copSnap → pick.cop），host 合併雙方後在 addTeams 套用（COPNET → copApplySnap，存在 G.copNet 讓 guest 在 netApply 時也套用）；mkUnit 看到 PROF.copU 就直接套用單位欄位。排隊 30 秒後的電腦對手（rankBotGo）也一樣。
- 護送人質改成跟封門一樣的浮動按鈕 #escBtn（綠色），只有站在人質旁邊、還能做目標行動時才出現；側欄只在教學（G.tut2）保留。
- opArt 對 recruit 卡：訓練關卡顯示該職業的圖（lvArt），對手的培養幹員顯示對手職業圖，不再借用自己的培養幹員圖。

## v180
- 成就面板 #achp z-index 90 → 130，蓋在底部選單上，不再被切掉。
- 任務頁：返回鍵拿掉，改成右上角 X（.tkX，沿用 id t-back）；手機上面板固定在頂列（頭像、圖示、在線人數）下方、底部選單上方，列距縮小，iPhone 也一頁放得下。
- 手機大廳左側拿掉「訓練任務」（底部選單已有訓練）；活動方塊改用 img/ui/event.webp，圖上壓「準備中」。

## v181
- 培養幹員取名（#cpNm）：注音/拼音輸入法組字中（compositionstart～compositionend、isComposing、keyCode 229）不計字數也不截斷，選字完成後才套用 12 寬度上限（中文字算 2）；組字中按 Enter 不會送出。

## v182
- 教學最後一步「作戰檔案」的目標改成 `#gnav [data-gn=lib],#t-lib`（手機大廳已經沒有 #t-lib，原本整個畫面被遮住點不到）。
- 教學中（G.tut2）鏡頭不再旋轉：aimCam/followCam 固定朝北（與 setView('angle') 同方向）、仰角改 70° 比較接近俯視，只會平移；射擊特寫在教學裡關閉。

## v183
- 結束行動：行動點和移動點都用完時自動朝面向（u.fd）監視並結束（owFinish），不再強制選箭頭。教學遊戲階段（TU.ph==='game'）維持舊流程。
- 新浮動按鈕（左下，在封門/護送/掃描位置上方疊放，間隔 70px）：「完成」#doneBtn（目前啟動中的幹員，朝面向監視後結束）；「轉向」#turnBtn（自己任何一名在場幹員都可用，包含已行動完、沒行動點的；監視中的幹員轉向會一起改監視方向 owd）。
- 右側行動列拿掉「轉向」「監視」（教學遊戲階段仍保留）。

## v184
- 浮動「轉向」只給目前啟動中的幹員、或本回合已經行動過的幹員（u.activated）；還沒動的幹員不能免費轉向。

## v185
- 底部選單切換（gnavGo closeAll）會一併關掉玩法說明 #manual、規則書 #rbook、幹員圖鑑 #opsel，在規則頁點「大廳」可以回去。
- 成就面板 .bscroll 加 overflow-x:hidden、touch-action:pan-y，只能上下捲，不會左右晃。

## v186
- 作戰檔案幹員圖鑑：篩選「已擁有」改成「未擁有」（LIBF='not'）；未擁有的頭像灰階（brightness .35 → .7，看得清楚）；全部擁有時顯示「全部幹員都已擁有」。

## v187
- 新手教學選陣營/任務/地圖時（TU.ph==='pre'），防守方、炸彈任務、銀行以外的地圖都停用並變灰（.tuOff），只能照教學選。

## v188
- 底部選單（手機 #gnav、桌機 .lobNav）「幹員」改名「培養」。
- 新手教學結尾（TU_POST）拿掉作戰檔案/規則：改成點「培養」→ 介紹培養幹員 → 說明依培養方向可轉職成職業兵種（桌機在這步按下一步會關掉 #cop）→ 點「訓練」→「自主訓練」結束教學。

## v189
- 關螢幕或切換 App（visibilitychange hidden / pagehide / freeze）時，背景音樂立刻暫停（不淡出，背景計時器會被節流），AudioContext 也 suspend；回來時再恢復。

## v195 培養幹員不能靠退出逃避陣亡＋撤離
- 開打（`G.phase==='play'`，非教學、非訓練關卡）時，自己的培養幹員（`myCopU()`，合作時只看自己的）被鎖成出戰中：`ECO.copOut={i,gen,nm,gid,t0,t,safe?}`（跟雲端存檔走，每 90 秒更新 `t`）。`gid` 單機是 `G._gid`、線上是 `'n'+NET.code`（`copGid`）。每 2 秒 `copBeat` 把心跳寫進 localStorage `r6bg.copRc`（`t`、單機在自己回合時的 `netSer()` 快照 `snap`、線上的房間資訊 `net`、幹員倒下 `dead`）。`finish` → `copEnd` 會 `copUnlock()`。
- 按「離開」（`homeGo`）會提醒「離開的話，培養幹員也算陣亡」，確定就 `copDie`（進學長姐，`q` 記原因，名冊顯示「陣亡 · 中途離開」）。已撤離的幹員離開不會死（`copEnd([])` 算存活）。
- 關網頁／斷線：回到選單時 `copRecover` 檢查鎖：心跳 3 分鐘內（`COPRC_MS`）跳 `#copRc`「對戰中斷」倒數，可「回到對戰」（`copResume`：單機用快照還原並在電腦回合時接著 `runAI`；線上重新 `netInit`、讀 `games/<code>` 後 `netApply`＋`netSubscribe`），或放棄。逾時、快照沒有、或斷線前已倒下就陣亡（`copDieDlg`）。別台裝置上的鎖沒有本機心跳，雲端 `t` 超過 5 分鐘才判死。開新對戰時若還有舊鎖，舊的直接判死。
- 撤離（`#evacBtn`，紫色 #a56bff，位置同封門，若封門/護送/掃描在就往上疊一格）：只有自己的培養幹員；花 1 行動（`obj`）開始（`evacStart`：`u.evac`、借用 `u.defusing` 讓他不能動、不自動掩護），撐過敵方下一個階段，在 `endPhase` 裡 `evacPhaseEnd` 把他移出棋盤（`u.evacd`、`alive=false`、`x=-1`），`fxEv({k:'evac'})` 播 `evacBeam`（紫色光柱從地面往上越長越快、光條往上竄、角色變細變透明消失，`SFX.evac`）。`copEnd` 把 `evacd` 當存活。頭像列顯示 `.ob.evac`。測試 stub：`tests/borrowed-skill-progress.cjs`、`tests/defuser-victory.cjs`。

## v200 線上同步加速＋共用計時
- `netPush` 把 `netSer()` 用 `CompressionStream('gzip')`＋base64 壓成 `'z1:'…`（`netZip`，約 150KB→3KB），走 `NET.zq` 依序寫；收端 `netRecv` 先 `netUnzip` 再交給 `netOnGame`（`NET.rq` 依序、解完再比 `seq`）。沒有 `z1:` 前綴的照舊收。`copResume` 讀檔也要先 `netUnzip`。
- `games/<code>` 的 merge 寫入改用訂閱快取 `NET.doc` 合併後 `set`，不再先讀 retained（省 ≥250ms）。`netDirty` 延遲 350→150ms（交棒/結束 40ms）。
- 線上計時：`startPhase` 寫 `G.clkEnd=Date.now()+PHT`、`G.clkBy=NET.me`；每 200ms 以 `clkNow(G.clkBy)` 算剩餘，`NET.off`（對方時鐘−自己，取 `d.ts-Date.now()` 的最大值）校正。切頁/背景不再暫停、擲骰也不停。回到前景（dt>3s）先等 2.5s（`NET.hold`）讓新狀態進來。
- `netStall`：對方階段時間到又 8 秒沒動靜，等待方替他 `endPhase`（PvP）；合作仍走 `coopStall`（也改成 8 秒）。

## v201 新舊版相容
- `NETV=2`：只有雙方都宣告 ≥2 才壓縮（`NET.zip`）。合作看隊伍文件 `ptMe().nv`（`PT.mate.nv`，舊版會跳提醒），PvP 看 `games/` 的 `hostNv`/`guestNv`。改連線格式時要升 `NETV`，並保留舊格式的收發。
- 合作的 `games/<pid>` 會跨場重用：`NET.since=PT.t0`（隊長時鐘），`netRecv` 丟掉 `ts` 比它早的文件。

## v202 WebRTC 直連
- `netSubscribe` 會呼叫 `rtcStart(code)`：host 建 DataChannel、等 ICE 收完（最多 2.5s）把完整 SDP 寫到 `rtc/<code>/o`（`sid`），guest 訂閱後回答到 `rtc/<code>/a`。看到新的 `sid` guest 會整個重建。STUN 用 Google／Cloudflare，沒有 TURN。
- `netPush` 有 `NET.dc` 就先從直連送 `{code,seq,by,state,ts}`，同時照寫 `games/<code>`（備援、斷線回復用）；收端都走 `netRecv`，重複的靠 `seq` 擋掉。直連時 `netDirty` 延遲 40ms（交棒 10ms）。`netLeave` 會 `rtcClose()`。

## v203 爆炸卡頓
- 場景裡固定有一盞 `R3.fxL` 點光源（平常亮度 0）。爆炸特效用 `fxLight(色,距離,衰減,x,y,z)` 借用它，**不要再 `new PointLight` 加進場景**：光源數一變，three.js 會把地圖上所有材質重新編譯（約 28 個 shader），破牆／手榴彈時手機會卡一兩秒。
- `floorCanvas` 的地板花紋（`buildTex` + PBR 圖樣）以格子大小快取在 `FTEX`，之後每次破牆重建地圖從 ~180ms 降到 ~30ms；它也會還原 2D 用的 `TEX/TEXKEY`。

## v204 4v4 合作選角改版
- `cpRender` 改成 `#cpk.cq`：grid areas `top / L(兩人隊伍) C(幹員/裝備分頁) M(地圖) I(幹員資訊 wzOpDetail) / B`；≤860px 改成直排（`order`），底部按鈕固定。點幹員格只會切換資訊，按資訊卡的「加入我的小隊」才會選。地圖用 `mapPlan(k)`（平面圖＋房間名稱，不畫炸彈點）。
- 裝備：`PT.gear`／`PT.mateGear`（每人 2 個，存在 pt 文件的 `gear`）。開局時 `G.cinv={h,g}`，`G[k]` 是全隊合計。玩家這邊的裝備數量和消耗一律用 `gq(u,k)`／`gdec(u,k)`（電腦方的單位和非合作模式會回到 `G[k]`）。
- 炸彈點：隊長按下開始選角時，`preSites(map)` 先抽好房間存進 `PT.cfg.sites`；`cpLaunch` 用 `FORCESITES` 讓 `randSites` 選同一組。防守方在選角畫面看得到（`cpSites`），進攻方顯示「目標未知」。
- 部署輪流進行：`G.depBy` 依序是 'h'→'g'→'go'。`coopOwner()` 在部署階段回傳 `depBy`，`unplaced()` 只算輪到的人的幹員，`coopDepNext` 負責交棒；輪到 'go' 時由隊長執行 `startPlay`（`coopAfterApply`）。部署時不能選隊友的幹員。

## v206 技能說明表格
- 幹員道具／職業技能／職業特性的名稱與說明可以用表格改：`data/skills.csv`（欄位看表頭 `id`、`技能名稱`、`技能說明`；空白格＝用程式內建文字）。若 `SKILL_SHEET` 填了 Google 試算表「發布到網路」的 CSV 網址，就優先讀它，讀不到才讀 repo 的 CSV。
- 開頁時先套用 localStorage `r6skills` 的上一份表格，再非同步抓最新的（`skApply`）。寫入目標：`GDX[id][0]`／`OPS.gd`（已實作）、`OPC.zh.x`（未實作，會自動加【尚未實作】）、`OPS.pd`（Rook、Tachanka 被動）、`CSK[k].n/d`、`WPN[k].fx`（id 寫成 `trait_k`）。只改和內建不同的格子；表格移除某列時會還原內建。
- 改程式內的技能文字後，記得同步更新 `data/skills.csv`，不然表格會把它蓋回去。

## v207 成就表格
- 成就的圖示、名稱、條件文字也可以用表格改：`data/achievements.csv`（表頭 `id`、`分類`、`圖示`、`成就名稱`、`達成條件`；`分類` 只是給人看的），或填 `ACH_SHEET`（Google 試算表發布 CSV）。`achApply` 直接改 `ACHM[id]` 的 `ic/n/d`；達成門檻 `goal` 和判定不在表格裡。localStorage 鍵 `r6ach`。載入共用 `tblLoad(key,urls,apply)`。
- 英日文翻譯（`I18X`）是用中文原文當鍵，表格改過的中文在英日文介面會顯示中文。新增或改程式內成就文字時同步更新 CSV。

## v209 骰面子彈（commit 標成 v208，和訓練選單的 v208 #125 同時上線）
- 3D 射擊骰的點數圖示從準星改成子彈（`dieBullet`，在 `dieFace` 裡）：1 點＝一顆斜放 45°、2 點＝兩顆直立、3 點＝三顆直立；0 點仍是「—」。深色剪影加骰子顏色的接縫。手榴彈骰（`grenade`）維持手榴彈圖示。2D 結果列的小方塊仍顯示數字。

## v210 成就改版（使用者的成就表）
- 73 個成就的名稱、條件、分類照使用者的表更新（`ACH` 與 `data/achievements.csv` 同步）；分類：刁鑽＝`x:1`，長期目標＝有 `goal` 且沒 `x`。`main` 改長期目標（`goal:20,k:'mainN'`＝同一幹員最多出場數），`opsAll` 的門檻是 `OPSN`（所有非新進人員幹員的 base 數），`hunter` 改成解鎖 10 個其他成就後打開成就頁（`k:'achN'`），`hk3` 改計 `c.hkS`（無傷救出人質的勝場）。
- 新追蹤：`G._rl` 我方對敵射擊的擲骰總和與是否擊殺（`shootUnit`）、`G._fd` 我方傷到隊友、`G._gt` 我方用過的道具種類。用在 sharp、storm、zero、zen、spray、ff3、retreat、gad20、ff。
- 救出人質的判定看 `G.why` 是否「人質已安全撤離」；任務結算（tourist）看「人質已安全撤離／拆彈器／炸彈已被拆除」；thenwhat＝防守方以「拆彈器已被破壞」獲勝且進攻方仍有人活著。中途離開不再給 retreat。lose5 要在累計 5 敗後贏一場。
- 圖示：使用者要改成圖片（表裡寫 `<id>.png`），圖片還沒給，暫時仍用 emoji。

## v211 移除 Flores 與 Thunderbird
- 使用者要求把這兩名幹員拿掉：`OPCARDS`、`data/skills.csv`、技能說明、`GT`/`GA`/AI/3D 外觀、`SCRIPTED`/`NOBTN`/`SETUPOPS`、`GSH` 都刪了；`PAIDCORE` 改成空集合。`opsAll` 門檻 `OPSN` 自動少 2。
- 圖片檔（`img/*/flores.webp`、`thunderbird.webp`）和 `OPICONS`/`AIMM`/`FACEM`/`I18X` 裡的舊鍵保留，避免玩家舊頭像失效；不影響遊戲。
## v212 成就徽章圖片
- 73 張金屬徽章（使用者給的 `achievement-icons-metal-v1.zip`，1254px PNG）去邊、縮成 256px webp 放 `img/ach/<id>.webp`（共約 1.1 MB）。`ACHIMG` 列出有圖的 id；**沒有圖的成就會從 `ACH` 移除**（使用者指定）。新增成就時要一起放圖並加進 `ACHIMG`。
- `achIc(a,px)` 回傳圖片（沒圖才用 emoji）：任務結束頁「成就達成」、解鎖提示、成就頁詳情都用它；成就頁的徽章 `achBadge` 有圖時直接用圖（未解鎖沿用 `.bdS` 灰階）。
- `data/achievements.csv` 的「圖示」欄寫 `<id>.png` 只是對照用；`achApply` 遇到檔名會略過，不會把檔名當文字顯示。

## v213 移除閃電骰
- 使用者要求閃電骰完全移除：卡片骰組的 `*` 不再轉小寫（`ensureOp`），`PROF` 內建骰組全部轉大寫，`shotPool` 一律 `toUpperCase()`，有掩護時不再拿掉任何骰子（只扣掩護點數）。幹員卡 `hexDice` 不畫閃電、詳情頁拿掉閃電骰說明、新手教學 Ash 射擊說明（中英日）改掉閃電敘述。原版規則全文（`rulesmd`）沒動。

## v214 套用使用者的新技能表
- `data/skills.csv` 換成使用者的新表（多了血量、骰組、次數等欄，載入器只讀 id／技能名稱／技能說明）；說明欄的換行在 `skApply` 轉成 `<br>`。
- 數值：Finka 中距離骰改 [O,R,R]；Thermite 次數 3、Lion 2、Iana 2。
- Sledge 大錘不花行動點、可連續使用、不再附贈射擊（`useGadget` 對 sledge 不扣次數也不 `useAct`）。
- Fuze 集束炸彈每個目標 2 顆手榴彈骰；Doc 回 3 血、2 次；Oryx 撞牆後 +2 移動；Wamai Mag-NET 攔截一次就消失；Gridlock 尖刺只停止移動、不結束啟動。
- Finka 不再自動救人（`finkaSave` 直接回傳 false）；技能隨時可用，就算大家都滿血。
- Iana 拿掉被動（不再免標記、不再讓射她的人少一顆骰），改成 Gemini 分身：`GT.iana` 是 5 步內可走的格子，`ianaClone` 沿路走，120°／10 格視野看到的隱藏敵人會現身（不標記），碰到掩護射擊的敵人就被打掉（用掉那名敵人的掩護射擊）。

## v216 遊戲內規則頁換成使用者重寫的新手玩法
- `#manual` 的內容（分頁 `#mtabs` 與 `#sheetbody`）換成使用者提供的「新手玩法」全文，共 9 節加開頭的三件事，分頁改成 10 個（`m-start`、`m-win`、`m-turn`、`m-setup`、`m-play`、`m-fire`、`m-hit`、`m-mark`、`m-acts`、`m-ui`），大廳入口改寫「9 個章節」。
- 配圖都用遊戲裡現成的東西：回合列用 `.tracker` 的樣式重畫一份（`.rqTrk`），菱形用 `.rqDia`，行動按鈕與道具用 `data-ua`／`data-eq`（`openManual` 會填圖），骰面用 `[data-die]`，在 `openManual` 裡用 `dieFace()` 畫出六個面（`data-g` 是手榴彈骰）。
- 和使用者原文不同的地方（都是照遊戲實際規則修正）：監視是前方 120° 扇形，不是半圓；共享視野射擊仍需射手與目標之間沒有牆或煙霧擋住；每次啟動只能射擊一次；座標範圍依地圖而定；手榴彈骰列的是破片手榴彈的 1、1、1、2、2、2（Fuze 的集束炸彈骰是 0、1、1、2、2、3）。
- 英文、日文介面的規則頁還沒有新版翻譯，切換語言時這頁會顯示中文。

## v217 機槍兵的免費黃骰真的會擲
- 培養頁和轉職框一直寫機槍兵「三段各多 1 顆免費黃骰」，但 `copDice` 原本直接回傳 `c.d`，實際擲骰沒有這顆。現在 `copDice` 對 `w==='mg'` 每段多接一顆 `Y`：對戰（`copPrep` 的 `PROF.d`）、線上快照、訓練關主角（`lvHero`）、選角卡、平均值與評分都會算進去。
- 這顆骰不算在每段 4 顆、合計 10 顆的上限內（`copSpent`、`bMax`、`dTot` 仍只看 `c.d`）。機槍兵特性文字改成說明這件事。
## v218 共享視野可隔牆射擊、手榴彈骰統一
- `shootables0` 的共享視野分支（v192）改用 `los(...,true)`：隊友／無人機／攝影機看得到、在射程內的敵人，可以隔著軟牆、路障射擊（承重牆、加固牆仍擋），穿過的牆照樣用 `thruWall` 算掩護。
- `GRENADE_DIE` 改成 `[0,1,1,2,2,3]`，破片手榴彈和 Fuze 集束炸彈用同一種骰面。
- 規則頁拿掉座標說明；鐵牆圖示用遊戲裡的加固牆貼圖 `WALLIMG_SRC.reinf`（`openManual` 填入）。

## v219 規則頁微調
- 「讓我看看規則怎麼說」成就改成規則頁捲到最底才給（`#manual` 上的 scroll 監聽，`openManual.rd` 只綁一次），不再一打開就給。
- 規則頁：拿掉「新手玩法」標題和「以下介紹通用玩法…」那句，大標前的圖示全部拿掉；視野扇形圖示的弧線半徑改成 27，上半不再被切掉；回合段的說明文字改放在回合列下方（`.rqShow.col`）。

## v220 幹員資訊頁精簡、技能說明統一格式
- `data/skills.csv` 所有幹員與職業技能的說明改成三行：「次數：…／距離：…／效果：…」（職業特性不動），刪掉判定、結算等細節。
- 幹員資訊頁（`renderOpSelect` 的 `.osG`）：只顯示技能名稱和 `skGet(id).d`（不再有「遊戲版效果：」字樣），拿掉英文名稱、使用次數那行、白色的原版卡片文字和「顯示英文原文」按鈕；能力值拿掉破壞力和裝置次數；攜帶裝備不再寫卡片次數。

## v221 軟牆變薄、窗戶規則
- 軟牆 3D 厚度 .3 → .18，2D 也同比例變薄（`drawWallShadow`、軟牆 `armRects`）。顏色不變。
- `winOpen(c)`：窗戶格已經沒有路障（被破壞或部署時拆掉）。破壞窗戶路障後 `buildFrame` 會保留窗台（矮牆），部署時拆掉的窗戶也一樣。
- 射擊穿過開著的窗戶算 1 點掩護（`protection`）。
- 窗戶可以穿過但不能停：`reach` 把窗戶格標成 `pass`；`step` 進窗戶格時，剩餘移動點至少要比進入成本多 1，不然不進（AI 的路徑行走也加了同樣的條件，避免卡死迴圈）。Amaru 的鉤爪（v222 起）飛到窗戶後直接落到窗內相鄰的空格，不停在窗戶上；窗內沒有空格才留在窗戶格。
- 翻窗動作：幹員在窗戶格時，`f.vault` 讓模型抬高並側傾（`rotation.z`），玩家看得到的移動會在窗戶格多停 260ms。
- 規則頁補上「窗戶可以翻過去但不能停」和掩護表的「穿過窗戶 −1」。

## v223 Iana 分身會標記
- `ianaClone` 看到的敵人除了現身，也會被標記（`e.spotted=1`，`NOLOC` 的幹員例外），技能表說明同步改成「看到的敵人會現身並被標記」。

## v224 Capitão 火燒兩回合、資訊頁拿掉盒別
- `ignite(x,y,by,life=2)` 多了 `life` 參數；Capitão 的燃燒箭用 8（8 個階段＝2 回合），其他起火來源不變。說明改成「持續 2 回合」。
- 幹員資訊頁拿掉 `osBatch`（核心盒、第幾年這類盒別標籤）。

## v225 配對成功過場改成無人機 HUD
- 配對成功到選角前的過場改成跟排隊畫面 `#dq` 同一套無人機夜視 HUD（`.mflow.mh`，`mfHud` 建外框：夜視地圖底、掃描線、四角框、左上狀態字、右上 REC 計時）。`mfVs`：先紅色準星「發現對手」0.9 秒，再左右兩張檔案卡（`mfCard`：左邊自己 FRIENDLY、右邊對手 HOSTILE 有紅色鎖定準星與 LOCKED，框線顏色依陣營），中間 VS，下方 30 格綠色讀取條。角色圖原始只有 360px 寬，卡片最寬 330px 不放大避免糊。`mfSlot` 改成監視器切鏡頭：夜視畫面在各地圖間越切越慢，停在 `MF.mk` 時轉成彩色、金框 LOCKED，下方顯示地圖、任務、你是哪方，1.9 秒後進 `mfPick`（會拿掉 `.mh`）。地圖大圖 `mfMapImg`：銀行、俱樂部會所、領事館用新的 `img/map/<k>_hd.webp`（1920×1080，從原始 JPG 重壓），咖啡館沒有高解析原圖仍用 `kafe.webp`。

## v226 任務圖示不壓扁
- `.mfMi>img` 加 `object-fit:contain`：炸彈圖是 160×320 直式，原本被硬撐成正方形，人質圖也一樣。

## v227 人質改成 3D 模型
- 棋盤上的人質從紙板立牌（`standee('hostageFig')`）改成 3D 公仔 `makeHostageFig()`：跪姿、橄欖綠蒙眼布、銀色膠帶封嘴、黑長髮（後面一片 + 兩側垂到胸前）、髒污白色長袖短版上衣、深藍破洞內搭褲、白球鞋、雙手反綁在背後（麻繩）。衣服貼圖由 `hostTex('top'|'legs')` 用 canvas 畫。模型建一次放在 `R3.hostFig`，`hostage3D` 每次 `clone()`，轉向鏡頭；被帶著走時（`h.by`）縮成 .55 倍、不畫黃色六角框。
- 任務標籤、配對過場、選任務畫面用的 `GIMG.hostageFig`（`WZI.hostage`）換成這個 3D 模型的渲染圖（340×714，去掉底座）。舊的照片已移除。

## v228 視線內動靜強制特寫
- 牆或門（路障）被破壞時（`destroyCell` → `fxEv({k:'wall'})` → `fxPlay`），`evCamQ` 判斷：玩家這方看得到那一格（`visCells(G.player)` 含幹員扇形、攝影機、無人機；該格或旁邊的地板格亮著），而且是對手造成、或自己造成但在畫面外，就把鏡頭飛到那裡（`evCam`，60 毫秒內的多格合併成中心點），約 1 秒後飛回原視角。
- 特寫期間其他 `flyTo` 不會打斷，會記在 `R3.evc.pend`，結束時改飛去那裡；射擊／捕獸夾特寫開始時用 `evCamOff()` 取回原視角當 `cineSave`。教學（`G.tut2`）不觸發。`fxEv` 事件加上 `ts`，連線重連時超過 15 秒的舊事件不觸發。
- 注意：`edgeAlert` 檢查的 `SCREEN!=='game'` 永遠成立（`SCREEN` 不會是 'game'），螢幕邊緣紅光目前其實不會出現；遊戲畫面要用 `document.body.dataset.scr==='game'` 判斷。

## v229 回合開始鏡頭、射擊特寫看得到人
- `turnCam()`：輪到自己這方的新階段（`tick3D` 比對 `R3.turnKey`＝`round:phaseIdx`），等射擊／捕獸夾特寫、v228 動靜特寫、`.sintro` 都結束後（`R3.turnPend`），鏡頭飛到一名還能行動的幹員（`unspent`，合作模式只挑自己的；優先離看得到的敵人最近，已選的幹員優先），保持目前羅盤方向、仰角 52°，距離依畫面寬高與面板遮住的部分算到周圍半徑約 6.3 格都在畫面內（手機會拉得比較遠，霧也跟著推遠）。部署結束第一個階段仍由 `playCam` 處理，教學不觸發。
- 射擊特寫原本「看不到人」的原因：第一人稱（預設）本來就把開槍者模型藏起來；隔牆射擊時被打穿的軟牆／路障刻意保留不透明（`keep`），鏡頭只看到牆；戰爭迷霧看不到的單位在特寫時也不畫；`cineClear` 只淡出靜態牆與家具，部署盾牌等道具（`R3.dynG`）會擋住。
- 修正：拿掉 `keep`，打穿的牆也淡成半透明；`cineClear` 加上 `R3.dynG`；特寫期間 `R3.cineShow` 讓開槍者與目標一定畫出來；`R3.cineClr` 記住淡出參數，特寫中牆被打出洞重建靜態場景時再淡一次；`shotCamEnd` 結束時立刻 `update3D()`，開槍者不會等到下次重繪才出現。

## v230 電腦版射擊特寫目標卡不壓面板
- `shotIntro` 的目標角色卡（`.siT`）：右側面板在畫面右半時，卡片右緣對齊面板左邊 −8px（原本貼齊視窗右邊、壓在面板上）。手機（面板在下方）不變。

## v231 選玩法畫面的人質用回原圖
- `GIMG.hostageFig` 換回原本的人質照片（340×628），選任務、任務標籤、配對過場這些 2D 畫面都用原圖；只有進遊戲後棋盤上的人質是 3D 模型（`makeHostageFig`，不讀這張圖）。

## v233 職業技能圖
- 在 v232 基礎上，七職業 `WPN[w].ic` 改用使用者指定的原圖 `img/ui/class-skills-v233.jpg`，`CLASS_ART_BOX` 以 SVG 視窗分別顯示徽章、排除圖下文字；技能收藏、戰鬥技能按鈕與轉職視窗共用。技能數值與規則未改。
- 檢查：`node tests/class-icons.cjs`；`tests/class-icons.html` 提供原圖裁切與 40px 小尺寸預覽。

## v236 監視、轉向、屋外現形與進攻 AI
- `riposte` 不再要求 `_actMoved`；動作完成即可觸發。移動參數仍獨立，衝鋒兵鎖骰被動仍只對移動反應生效。補上玩家／AI 奔跑、AI 安裝拆彈器與拆捕獸夾的 `afterAct`。
- `flowBtnUpd` 讓未啟動的己方幹員也可以免費轉向，不必先移動。
- `defenderOutside` 讓屋外防守方可見並解除隱藏；煙霧仍優先遮蔽。`outsideCam` 在進攻方觀看敵方階段時跟隨屋外行動者，階段結束恢復 `enemyView` 保存的原視角；射擊特寫期間延後還原，避免互搶。
- `aiAttacker` 每次啟動固定威脅圖並沿已選路線推進；任務狀態改變才重新選路，不再追著隊長往返。進屋即略過入口集合點；隊友佔格改尋路繞行；有 1 行動也可奔跑。人質局找不到路不再誤轉向炸彈點。
- 回歸測試：`tests/combat-flow-v236.cjs`、`tests/movement-intel.cjs`、`tests/smoke-vision.cjs`、`tests/class-skill-slots.cjs`。

## v237 排行榜
- `boardHTML` 改成固定外框、兩分類按鈕、上下捲動前 50 名與常駐我的排名。前三名人物層與文字層分離，第一名人物最前、所有名次文字在人物之上。
- `board/<uid>_<slot>` 補 `i/w/dead:false`；陣亡名冊同步到 `board/<uid>_fallen_<ts>_<slot>`（`dead:true`）。所屬玩家用 `meName()`，不可把 `ECO.alum[].by`（擊殺者）當玩家。舊玩家要進新版才補圖片與陣亡記錄；舊資料沒有職業時用新兵圖。
- `lbRows()` 預設現役，保持大廳前三名行為。`lbMyRank(tab)` 在完整排行找自己的最高名次，不受 50 名上限影響。`tests/leaderboard.cjs` 為邏輯測試，`tests/leaderboard.html` 為不連雲端的虛構資料 UI 測試。

## v238 護盾翻越
- 部署護盾與 Goyo 燃燒盾可翻越：`vaultAt` 共用翻窗抬身側傾姿勢與 260ms 停留，進入耗 2 移動點並預留落地一步，不能選護盾格當終點。玩家與 AI 路徑都支援，無人機規則不變。
- Goyo 不再因敵人靠近自動引燃，破壞／爆炸引燃照舊。`tests/shield-vault.cjs` 覆蓋兩種盾、落地點數、AI 尋路及姿勢旗標。

## v239 射線掩護
- `protection` 改用 `segCells` 精確格線（排除端點與只擦角的格子），刪除鄰格牆壁的額外 1 點掩護。站在 `obst && stand` 的目標不享有家具掩護，穿牆、窗框、部署盾牌與角色盾牌效果不變。
- `tests/cover-ray.cjs` 驗證射線外鄰牆、站桌上、家具與牆疊加、窗框、盾牌朝向。規則頁同步更新。
