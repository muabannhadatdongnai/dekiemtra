// Nguồn vẽ 16 icon line-art (outline đen trắng), khớp thứ tự kho ICONS trong worksheetSchemas.js.
// Mỗi icon: viewBox 0 0 100 100, stroke đen (#1a1a1a), fill "none" trừ vài chi tiết nhỏ (mắt, hạt...)
// dùng fill để rõ hình khi in đen trắng cỡ nhỏ. stroke-width đồng bộ 5 cho mọi icon.

const S = 'stroke="#1a1a1a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"';
const DOT = 'fill="#1a1a1a"';

const ICON_DEFS = {
  "🍎": { // táo
    name: "táo",
    svg: `<path ${S} d="M50 38c-14-14-34-6-34 14 0 20 20 38 34 38s34-18 34-38c0-20-20-28-34-14z"/>
<path ${S} d="M50 38V20"/>
<path ${S} d="M50 22c6-8 16-8 18-2"/>`,
  },
  "⭐": { // sao
    name: "sao",
    svg: `<path ${S} d="M50 12l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z"/>`,
  },
  "🚗": { // ô tô
    name: "ô tô",
    svg: `<path ${S} d="M12 62l6-20c2-6 8-10 14-10h36c6 0 12 4 14 10l6 20"/>
<path ${S} d="M8 62h84v10H8z"/>
<circle cx="28" cy="76" r="9" ${S}/>
<circle cx="72" cy="76" r="9" ${S}/>
<path ${S} d="M22 42h56"/>`,
  },
  "🐥": { // gà con
    name: "gà con",
    svg: `<circle cx="50" cy="44" r="24" ${S}/>
<circle cx="42" cy="40" r="3" ${DOT}/>
<circle cx="58" cy="40" r="3" ${DOT}/>
<path ${S} d="M45 47l5 5 5-5"/>
<path ${S} d="M50 20c3-7 12-7 12-2-2 2-7 4-12 2z"/>
<path ${S} d="M38 68l-4 12M62 68l4 12"/>
<path ${S} d="M30 76h8M62 76h8"/>`,
  },
  "🌻": { // hoa hướng dương (cánh nhọn để khác "hoa đào" cánh tròn)
    name: "hoa hướng dương",
    svg: `<circle cx="50" cy="40" r="11" ${S}/>
<circle cx="46" cy="37" r="1.6" ${DOT}/><circle cx="50" cy="35" r="1.6" ${DOT}/><circle cx="54" cy="37" r="1.6" ${DOT}/>
<circle cx="44" cy="42" r="1.6" ${DOT}/><circle cx="50" cy="41" r="1.6" ${DOT}/><circle cx="56" cy="42" r="1.6" ${DOT}/>
<path ${S} d="M50 29L44 14 50 20 56 14z"/>
<path ${S} d="M50 51L44 66 50 60 56 66z"/>
<path ${S} d="M61 40L76 34 70 40 76 46z"/>
<path ${S} d="M39 40L24 34 30 40 24 46z"/>
<path ${S} d="M58 32l12-10-6 8 10-2"/>
<path ${S} d="M42 32L30 22l6 8-10-2"/>
<path ${S} d="M58 48l12 10-6-8 10 2"/>
<path ${S} d="M42 48L30 58l6-8-10-2"/>
<path ${S} d="M50 51v30"/>
<path ${S} d="M50 68c-6-2-10 2-10 8M50 76c8-2 12 4 10 8"/>`,
  },
  "🦋": { // bướm
    name: "bướm",
    svg: `<path ${S} d="M50 30c-6-16-34-16-34 4 0 14 20 20 34 8"/>
<path ${S} d="M50 30c6-16 34-16 34 4 0 14-20 20-34 8"/>
<path ${S} d="M50 46c-4 16-30 18-30 32 0 10 16 8 30-10"/>
<path ${S} d="M50 46c4 16 30 18 30 32 0 10-16 8-30-10"/>
<path ${S} d="M50 24v58"/>
<path ${S} d="M50 24c-2-8 2-14 6-16M50 24c2-8-2-14-6-16"/>`,
  },
  "🥕": { // cà rốt
    name: "cà rốt",
    svg: `<path ${S} d="M40 42l36 36c4 4 4 11-1 16-5 5-12 5-16 1L23 59c-6-6-5-15 1-21 6-6 10-2 16 4z"/>
<path ${S} d="M26 22c2 5 1 11-2 15M36 16c3 6 2 13-1 18M18 30c5 3 9 8 11 13"/>`,
  },
  "🐟": { // cá
    name: "cá",
    svg: `<path ${S} d="M14 50c14-18 44-18 58 0-14 18-44 18-58 0z"/>
<path ${S} d="M72 50l16-14v28z"/>
<circle cx="30" cy="46" r="3" ${DOT}/>
<path ${S} d="M30 50c6 4 14 4 20 0"/>`,
  },
  "🎈": { // bóng bay
    name: "bóng bay",
    svg: `<ellipse cx="50" cy="36" rx="22" ry="26" ${S}/>
<path ${S} d="M50 62l-4 8 4 4-4 8 4 6"/>
<path ${S} d="M44 60c2 4 10 4 12 0"/>`,
  },
  "🍭": { // kẹo mút
    name: "kẹo mút",
    svg: `<circle cx="50" cy="34" r="22" ${S}/>
<path ${S} d="M50 12a22 22 0 0 1 0 44 14 14 0 0 1 0-28 7 7 0 0 1 0 14"/>
<path ${S} d="M50 56v34"/>`,
  },
  "🚀": { // tên lửa
    name: "tên lửa",
    svg: `<path ${S} d="M50 10c14 10 16 34 12 50H38c-4-16-2-40 12-50z"/>
<circle cx="50" cy="32" r="7" ${S}/>
<path ${S} d="M38 46l-14 8v14l14-8M62 46l14 8v14l-14-8"/>
<path ${S} d="M42 60l-4 20 12-8M58 60l4 20-12-8"/>`,
  },
  "🐢": { // rùa
    name: "rùa",
    svg: `<circle cx="24" cy="52" r="9" ${S}/>
<circle cx="20" cy="49" r="1.8" ${DOT}/>
<ellipse cx="56" cy="52" rx="30" ry="24" ${S}/>
<path ${S} d="M56 28v48M32 52h48M40 34l32 36M72 34 40 70"/>
<path ${S} d="M38 30c-6-8-2-16 6-14M76 42c8-4 16 2 12 10M76 62c8 4 12 12 6 16M38 74c-6 8-16 6-16-2"/>`,
  },
  "🧸": { // gấu bông
    name: "gấu bông",
    svg: `<circle cx="34" cy="24" r="9" ${S}/>
<circle cx="66" cy="24" r="9" ${S}/>
<circle cx="50" cy="46" r="26" ${S}/>
<circle cx="41" cy="42" r="3" ${DOT}/>
<circle cx="59" cy="42" r="3" ${DOT}/>
<circle cx="50" cy="52" r="6" ${S}/>
<circle cx="24" cy="70" r="12" ${S}/>
<circle cx="76" cy="70" r="12" ${S}/>`,
  },
  "🍪": { // bánh quy
    name: "bánh quy",
    svg: `<circle cx="50" cy="50" r="30" ${S}/>
<circle cx="40" cy="38" r="3" ${DOT}/>
<circle cx="60" cy="40" r="3" ${DOT}/>
<circle cx="36" cy="58" r="3" ${DOT}/>
<circle cx="58" cy="62" r="3" ${DOT}/>
<circle cx="50" cy="48" r="3" ${DOT}/>`,
  },
  "🌸": { // hoa đào
    name: "hoa đào",
    svg: `<circle cx="50" cy="50" r="7" ${DOT}/>
<circle cx="50" cy="30" r="14" ${S}/>
<circle cx="68" cy="42" r="14" ${S}/>
<circle cx="61" cy="63" r="14" ${S}/>
<circle cx="39" cy="63" r="14" ${S}/>
<circle cx="32" cy="42" r="14" ${S}/>`,
  },
  "🐝": { // ong
    name: "ong",
    svg: `<ellipse cx="56" cy="56" rx="16" ry="22" transform="rotate(20 56 56)" ${S}/>
<path ${S} d="M42 46l26-6M45 56l26-6M48 66l26-6"/>
<circle cx="38" cy="34" r="9" ${S}/>
<circle cx="35" cy="32" r="2" ${DOT}/>
<circle cx="41" cy="32" r="2" ${DOT}/>
<path ${S} d="M34 25c-2-5-7-7-9-4M42 25c2-5 7-7 9-4"/>
<path ${S} d="M46 44c-14-14-30-8-24 6 4 10 16 8 24-6z"/>
<path ${S} d="M64 50c14-10 28 0 20 12-6 8-18 4-24-6z"/>`,
  },
};

module.exports = { ICON_DEFS };
