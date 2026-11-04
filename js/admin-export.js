/* 管理後台：把一個班的作答資料填進定案格式的 Excel。
   只負責組內容，ExcelJS、範本、題庫都由呼叫的人傳進來（瀏覽器和 tests/ 共用）。
   規則和本機 匯出/產生匯出檔.py 相同，改這裡也要一起改那邊。 */
(function (root) {
  'use strict';
  const A = { D: 'D 老虎', I: 'I 孔雀', S: 'S 無尾熊', C: 'C 貓頭鷹' };
  const ADJ = new Set(['DI', 'IS', 'SC', 'CD']);
  const FIRST = 3;
  const QS = [];
  for (const p of 'DISC') for (let j = 1; j <= 16; j++) QS.push(p + String(j).padStart(2, '0'));
  QS.push('Q01', 'Q02', 'R01', 'R02', 'R03', 'R04');

  function colName(n) {
    let s = '';
    while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
    return s;
  }
  const QCOL = Object.fromEntries(QS.map((q, i) => [q, colName(i + 3)]));

  function typeLabel(kind, k) {
    if (!kind) return '';
    if (kind === 'chameleon') return '變色龍';
    if (kind === 'none') return '無法判定';
    if (!k) return '';
    if (kind === 'single') return A[k];
    return A[k[0]] + '＋' + A[k[1]];
  }
  function kindName(kind, k) {
    if (!kind) return '';
    return { single: '單一型', chameleon: '變色龍', none: '無法判定' }[kind] || (ADJ.has(k) ? '組合型' : '對角型');
  }
  // 和 Python round() 相同（.5 取偶數），秒數才會和本機版一致
  function roundSeconds(ms) {
    if (ms === null || ms === undefined) return null;
    const x = ms / 1000, f = Math.floor(x);
    if (x - f === 0.5) return f % 2 === 0 ? f : f + 1;
    return Math.round(x);
  }

  /* 從 index.html 取題目文字，題庫改了 Excel 表頭會跟著變 */
  function parseBank(html) {
    const txt = {}, pair = {};
    for (const m of html.matchAll(/\['([DISC]\d\d)',\d,'([^']+)'\]/g)) txt[m[1]] = m[2];
    for (const m of html.matchAll(/\{id:'(Q\d\d)',text:'([^']+)'/g)) txt[m[1]] = m[2];
    for (const m of html.matchAll(/\{id:'(R\d\d)',orig:'([A-Z]\d\d)',text:'([^']+)'/g)) { pair[m[1]] = m[2]; txt[m[1]] = m[3]; }
    if (Object.keys(txt).length !== 70) throw new Error('題庫題數不對');
    return { txt, pair };
  }

  function taipeiParts(d) {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d);
    const g = (t) => p.find((x) => x.type === t).value;
    return { date: `${g('year')}-${g('month')}-${g('day')}`, time: `${g('hour')}:${g('minute')}` };
  }

  function rowValues(r, idx, bank) {
    const row = FIRST + idx, ex = row - 1;
    const rg = (p) => `'每題答案'!${QCOL[p + '01']}${ex}:${QCOL[p + '16']}${ex}`;
    const sc = (col) => ({ formula: `ROUND((ROUND(${col}${row}*10,0)-10)*2.5,0)` });
    const main = r.kind === 'chameleon' ? '變色龍' : (r.kind === 'none' ? '無法判定' : A[r.primary]);
    const pairs = Object.keys(bank.pair).sort().map((R) => {
      const o = bank.pair[R], a = `'每題答案'!${QCOL[R]}${ex}`, b = `'每題答案'!${QCOL[o]}${ex}`;
      return `IF(AND(ISNUMBER(${a}),ISNUMBER(${b})),IF(ABS(${b}-(6-${a}))>=3,1,0),0)`;
    }).join('+');
    return [
      idx + 1, r.name, r.email, r.age || '未填', r.gender || '未填',
      kindName(r.kind, r.key), typeLabel(r.kind, r.key), main,
      r.d, r.i, r.s, r.c,
      { formula: `ROUND(((AVERAGE(${rg('D')})+AVERAGE(${rg('I')})+AVERAGE(${rg('S')})+AVERAGE(${rg('C')}))/4-1)*25,0)` },
      sc('I'), sc('J'), sc('K'), sc('L'),
      roundSeconds(r.ms), r.attn, { formula: pairs },
      { formula: `IF(R${row}<88,"是","否")` },
      { formula: `IF((S${row}>0)+(T${row}>0)+(U${row}="是")>=2,"不太可靠",IF((S${row}>0)+(T${row}>0)+(U${row}="是")=1,"需留意","可靠"))` },
      A[r.blind], A[r.blind2], r.rating, r.is_test ? '是' : '否', r.t, r.no,
      '', r.peer_invited ? '是' : '否', r.peer_replies, r.google ? '是' : '否',
    ];
  }

  function classNotes(data, now) {
    const rows = data.rows, n = rows.length;
    const people = new Set(rows.map((r) => r.sid || `no-${r.no}`)).size;
    const stamp = taipeiParts(now);
    const close = data.closes_at ? taipeiParts(new Date(data.closes_at)) : null;
    const tests = rows.filter((r) => r.is_test).length;
    const none = rows.filter((r) => r.kind === 'none').map((r) => r.no);
    const groups = new Map();
    for (const r of rows) if (r.sid) { if (!groups.has(r.sid)) groups.set(r.sid, []); groups.get(r.sid).push(r); }
    const dup = [...groups.values()].filter((g) => g.length > 1);
    return {
      資料來源: `Supabase 資料庫 responses 表，班級代碼 ${data.code}（${data.name}），${stamp.date} 匯出，共 ${n} 份作答（${people} 位學生）。名字、Email 來自學生表（students）。${close ? `這個班的開放時間到 ${close.date} ${close.time}，` : ''}匯出後如果還有人作答，不會出現在這份檔案裡。`,
      測試資料: tests
        ? `這份有 ${tests} 筆標記為測試資料，在「測試資料」欄是「是」。可能還有人用假名試做，分析時請自行決定是否排除。`
        : '這份沒有標記為測試資料的作答。可能還有人用假名試做，分析時請自行決定是否排除。',
      '類型「無法判定」': none.length ? `共 ${none.length} 筆，系統沒有判出類型：流水號 ${none.join('、')}。` : '這份沒有。',
      重複作答: dup.length
        ? `${dup.map((g) => `${g[0].name}（${g.map((x) => x.no).join('、')}）`).join('、')}作答超過一次，每次都保留，所以 ${n} 份作答是 ${people} 位學生。`
        : '這份沒有。',
    };
  }

  /* 把資料填進已載入範本的 workbook */
  function fillWorkbook(wb, data, bank, now) {
    now = now || new Date();
    const rows = data.rows, last = FIRST + Math.max(rows.length, 1) - 1;
    const ws = wb.getWorksheet('作答總表');
    rows.forEach((r, idx) => {
      const row = ws.getRow(FIRST + idx);
      rowValues(r, idx, bank).forEach((v, i) => { row.getCell(i + 1).value = v; });
    });

    const st = wb.getWorksheet('統計');
    st.eachRow((row) => row.eachCell((c) => {
      const f = c.value && c.value.formula;
      if (f) c.value = { formula: f.replace(/(\$[A-Z]+\$)3:(\$[A-Z]+\$)\d+/g, `$13:$2${last}`) };
    }));
    st.getCell('A1').value = `${data.name}班級統計`;
    st.getCell('A2').value = `班級代碼 ${data.code}；資料匯出時間 ${taipeiParts(now).date}（台灣時間）`;

    const ex = wb.getWorksheet('每題答案');
    QS.forEach((q, i) => {
      const t = bank.txt[q];
      ex.getRow(1).getCell(3 + i).value = q[0] === 'R' ? `${q}（與${bank.pair[q]}相反）\n${t}` : `${q}\n${t}`;
    });
    rows.forEach((r, idx) => {
      const row = ex.getRow(2 + idx);
      row.getCell(1).value = r.no;
      row.getCell(2).value = r.name;
      QS.forEach((q, i) => {
        const v = r.answers && r.answers[q];
        if (v !== undefined && v !== null) row.getCell(3 + i).value = Number(v);
      });
    });

    const notes = classNotes(data, now);
    wb.getWorksheet('說明').eachRow((row) => {
      const k = row.getCell(1).value;
      if (notes[k] !== undefined) row.getCell(2).value = notes[k];
    });
    wb.calcProperties = Object.assign({}, wb.calcProperties, { fullCalcOnLoad: true });
    return wb;
  }

  function fileName(code, now) {
    return `${code}_作答資料_${taipeiParts(now || new Date()).date}.xlsx`;
  }

  const api = { parseBank, fillWorkbook, fileName, taipeiParts, typeLabel, QS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DISC_ADMIN_EXPORT = api;
})(typeof window !== 'undefined' ? window : globalThis);
