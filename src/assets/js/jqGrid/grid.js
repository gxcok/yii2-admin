/*
 * jqGrid  4.6.0 - jQuery Grid
 * Copyright (c) 2008, Tony Tomov, tony@trirand.com
 * Dual licensed under the MIT or GPL licenses
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 * Date:2014-02-20
 * Modules: grid.base.js; jquery.fmatter.js; grid.custom.js; grid.common.js; grid.formedit.js; grid.filter.js; grid.inlinedit.js; grid.celledit.js; jqModal.js; jqDnR.js; grid.subgrid.js; grid.grouping.js; grid.treegrid.js; grid.pivot.js; grid.import.js; JsonXml.js; grid.tbltogrid.js; grid.jqueryui.js;
 */
(function(b) {
    b.jgrid = b.jgrid || {};
    b.extend(b.jgrid, {
        version: "4.6.0",
        htmlDecode: function(b) {
            return b && ("&nbsp;" === b || "&#160;" === b || 1 === b.length && 160 === b.charCodeAt(0)) ? "" : b ? String(b).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&") : b
        },
        htmlEncode: function(b) {
            return b ? String(b).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : b
        },
        format: function(e) {
            var f = b.makeArray(arguments).slice(1);
            null == e && (e = "");
            return e.replace(/\{(\d+)\}/g,
                function(b, d) {
                    return f[d]
                })
        },
        msie: "Microsoft Internet Explorer" === navigator.appName,
        msiever: function() {
            var b = -1;
            null != /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent) && (b = parseFloat(RegExp.$1));
            return b
        },
        getCellIndex: function(e) {
            e = b(e);
            if (e.is("tr")) return -1;
            e = (e.is("td") || e.is("th") ? e : e.closest("td,th"))[0];
            return b.jgrid.msie ? b.inArray(e, e.parentNode.cells) : e.cellIndex
        },
        stripHtml: function(b) {
            b = String(b);
            var f = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            return b ? (b = b.replace(f, "")) && "&nbsp;" !== b && "&#160;" !==
            b ? b.replace(/\"/g, "'") : "" : b
        },
        stripPref: function(e, f) {
            var c = b.type(e);
            if ("string" === c || "number" === c) e = String(e), f = "" !== e ? String(f).replace(String(e), "") : f;
            return f
        },
        parse: function(e) {
            "while(1);" === e.substr(0, 9) && (e = e.substr(9));
            "/*" === e.substr(0, 2) && (e = e.substr(2, e.length - 4));
            e || (e = "{}");
            return !0 === b.jgrid.useJSON && "object" === typeof JSON && "function" === typeof JSON.parse ? JSON.parse(e) : eval("(" + e + ")")
        },
        parseDate: function(e, f, c, d) {
            var a = /^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,
                l = "string" ===
                typeof f ? f.match(a) : null,
                a = function(a, b) {
                    a = String(a);
                    for (b = parseInt(b, 10) || 2; a.length < b;) a = "0" + a;
                    return a
                },
                g = {
                    m: 1,
                    d: 1,
                    y: 1970,
                    h: 0,
                    i: 0,
                    s: 0,
                    u: 0
                },
                h = 0,
                k, n, h = function(a, b) {
                    0 === a ? 12 === b && (b = 0) : 12 !== b && (b += 12);
                    return b
                };
            void 0 === d && (d = b.jgrid.formatter.date);
            void 0 === d.parseRe && (d.parseRe = /[#%\\\/:_;.,\t\s-]/);
            d.masks.hasOwnProperty(e) && (e = d.masks[e]);
            if (f && null != f)
                if (isNaN(f - 0) || "u" !== String(e).toLowerCase())
                    if (f.constructor === Date) h = f;
                    else if (null !== l) {
                        if (h = new Date(parseInt(l[1], 10)), l[3]) {
                            var m = 60 * Number(l[5]) +
                                    Number(l[6]),
                                m = m * ("-" === l[4] ? 1 : -1),
                                m = m - h.getTimezoneOffset();
                            h.setTime(Number(Number(h) + 6E4 * m))
                        }
                    } else {
                        m = 0;
                        "ISO8601Long" === d.srcformat && "Z" === f.charAt(f.length - 1) && (m -= (new Date).getTimezoneOffset());
                        f = String(f).replace(/\T/g, "#").replace(/\t/, "%").split(d.parseRe);
                        e = e.replace(/\T/g, "#").replace(/\t/, "%").split(d.parseRe);
                        k = 0;
                        for (n = e.length; k < n; k++) "M" === e[k] && (l = b.inArray(f[k], d.monthNames), -1 !== l && 12 > l && (f[k] = l + 1, g.m = f[k])), "F" === e[k] && (l = b.inArray(f[k], d.monthNames, 12), -1 !== l && 11 < l && (f[k] = l + 1 - 12,
                            g.m = f[k])), "a" === e[k] && (l = b.inArray(f[k], d.AmPm), -1 !== l && 2 > l && f[k] === d.AmPm[l] && (f[k] = l, g.h = h(f[k], g.h))), "A" === e[k] && (l = b.inArray(f[k], d.AmPm), -1 !== l && 1 < l && f[k] === d.AmPm[l] && (f[k] = l - 2, g.h = h(f[k], g.h))), "g" === e[k] && (g.h = parseInt(f[k], 10)), void 0 !== f[k] && (g[e[k].toLowerCase()] = parseInt(f[k], 10));
                        g.f && (g.m = g.f);
                        if (0 === g.m && 0 === g.y && 0 === g.d) return "&#160;";
                        g.m = parseInt(g.m, 10) - 1;
                        h = g.y;
                        70 <= h && 99 >= h ? g.y = 1900 + g.y : 0 <= h && 69 >= h && (g.y = 2E3 + g.y);
                        h = new Date(g.y, g.m, g.d, g.h, g.i, g.s, g.u);
                        0 < m && h.setTime(Number(Number(h) +
                            6E4 * m))
                    } else h = new Date(1E3 * parseFloat(f));
            else h = new Date(g.y, g.m, g.d, g.h, g.i, g.s, g.u); if (void 0 === c) return h;
            d.masks.hasOwnProperty(c) ? c = d.masks[c] : c || (c = "Y-m-d");
            e = h.getHours();
            f = h.getMinutes();
            g = h.getDate();
            m = h.getMonth() + 1;
            l = h.getTimezoneOffset();
            k = h.getSeconds();
            n = h.getMilliseconds();
            var r = h.getDay(),
                p = h.getFullYear(),
                q = (r + 6) % 7 + 1,
                x = (new Date(p, m - 1, g) - new Date(p, 0, 1)) / 864E5,
                G = {
                    d: a(g),
                    D: d.dayNames[r],
                    j: g,
                    l: d.dayNames[r + 7],
                    N: q,
                    S: d.S(g),
                    w: r,
                    z: x,
                    W: 5 > q ? Math.floor((x + q - 1) / 7) + 1 : Math.floor((x + q - 1) / 7) ||
                        (4 > ((new Date(p - 1, 0, 1)).getDay() + 6) % 7 ? 53 : 52),
                    F: d.monthNames[m - 1 + 12],
                    m: a(m),
                    M: d.monthNames[m - 1],
                    n: m,
                    t: "?",
                    L: "?",
                    o: "?",
                    Y: p,
                    y: String(p).substring(2),
                    a: 12 > e ? d.AmPm[0] : d.AmPm[1],
                    A: 12 > e ? d.AmPm[2] : d.AmPm[3],
                    B: "?",
                    g: e % 12 || 12,
                    G: e,
                    h: a(e % 12 || 12),
                    H: a(e),
                    i: a(f),
                    s: a(k),
                    u: n,
                    e: "?",
                    I: "?",
                    O: (0 < l ? "-" : "+") + a(100 * Math.floor(Math.abs(l) / 60) + Math.abs(l) % 60, 4),
                    P: "?",
                    T: (String(h).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g) || [""]).pop().replace(/[^-+\dA-Z]/g, ""),
                    Z: "?",
                    c: "?",
                    r: "?",
                    U: Math.floor(h / 1E3)
                };
            return c.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g, function(a) {
                return G.hasOwnProperty(a) ? G[a] : a.substring(1)
            })
        },
        jqID: function(b) {
            return String(b).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g, "\\$&")
        },
        guid: 1,
        uidPref: "jqg",
        randId: function(e) {
            return (e || b.jgrid.uidPref) + b.jgrid.guid++
        },
        getAccessor: function(b, f) {
            var c, d, a = [],
                l;
            if ("function" === typeof f) return f(b);
            c = b[f];
            if (void 0 === c) try {
                if ("string" === typeof f &&
                    (a = f.split(".")), l = a.length)
                    for (c = b; c && l--;) d = a.shift(), c = c[d]
            } catch (g) {}
            return c
        },
        getXmlData: function(e, f, c) {
            var d = "string" === typeof f ? f.match(/^(.*)\[(\w+)\]$/) : null;
            if ("function" === typeof f) return f(e);
            if (d && d[2]) return d[1] ? b(d[1], e).attr(d[2]) : b(e).attr(d[2]);
            e = b(f, e);
            return c ? e : 0 < e.length ? b(e).text() : void 0
        },
        cellWidth: function() {
            var e = b("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;display:block;'></td></tr></table></div>"),
                f = e.appendTo("body").find("td").width();
            e.remove();
            return 0.1 < Math.abs(f - 5)
        },
        cell_width: !0,
        ajaxOptions: {},
        from: function(e) {
            return new function(e, c) {
                "string" === typeof e && (e = b.data(e));
                var d = this,
                    a = e,
                    l = !0,
                    g = !1,
                    h = c,
                    k = /[\$,%]/g,
                    n = null,
                    m = null,
                    r = 0,
                    p = !1,
                    q = "",
                    x = [],
                    G = !0;
                if ("object" === typeof e && e.push) 0 < e.length && (G = "object" !== typeof e[0] ? !1 : !0);
                else throw "data provides is not an array";
                this._hasData = function() {
                    return null === a ? !1 : 0 === a.length ? !1 : !0
                };
                this._getStr = function(a) {
                    var b = [];
                    g && b.push("jQuery.trim(");
                    b.push("String(" + a + ")");
                    g && b.push(")");
                    l || b.push(".toLowerCase()");
                    return b.join("")
                };
                this._strComp = function(a) {
                    return "string" === typeof a ? ".toString()" : ""
                };
                this._group = function(a, b) {
                    return {
                        field: a.toString(),
                        unique: b,
                        items: []
                    }
                };
                this._toStr = function(a) {
                    g && (a = b.trim(a));
                    a = a.toString().replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
                    return l ? a : a.toLowerCase()
                };
                this._funcLoop = function(d) {
                    var l = [];
                    b.each(a, function(a, b) {
                        l.push(d(b))
                    });
                    return l
                };
                this._append = function(a) {
                    var b;
                    h = null === h ? "" : h + ("" === q ? " && " :
                            q);
                    for (b = 0; b < r; b++) h += "(";
                    p && (h += "!");
                    h += "(" + a + ")";
                    p = !1;
                    q = "";
                    r = 0
                };
                this._setCommand = function(a, b) {
                    n = a;
                    m = b
                };
                this._resetNegate = function() {
                    p = !1
                };
                this._repeatCommand = function(a, b) {
                    return null === n ? d : null !== a && null !== b ? n(a, b) : null !== m && G ? n(m, a) : n(a)
                };
                this._equals = function(a, b) {
                    return 0 === d._compare(a, b, 1)
                };
                this._compare = function(a, b, d) {
                    var e = Object.prototype.toString;
                    void 0 === d && (d = 1);
                    void 0 === a && (a = null);
                    void 0 === b && (b = null);
                    if (null === a && null === b) return 0;
                    if (null === a && null !== b) return 1;
                    if (null !== a && null ===
                        b) return -1;
                    if ("[object Date]" === e.call(a) && "[object Date]" === e.call(b)) return a < b ? -d : a > b ? d : 0;
                    l || "number" === typeof a || "number" === typeof b || (a = String(a), b = String(b));
                    return a < b ? -d : a > b ? d : 0
                };
                this._performSort = function() {
                    0 !== x.length && (a = d._doSort(a, 0))
                };
                this._doSort = function(a, b) {
                    var l = x[b].by,
                        e = x[b].dir,
                        g = x[b].type,
                        c = x[b].datefmt,
                        f = x[b].sfunc;
                    if (b === x.length - 1) return d._getOrder(a, l, e, g, c, f);
                    b++;
                    l = d._getGroup(a, l, e, g, c);
                    e = [];
                    for (g = 0; g < l.length; g++)
                        for (f = d._doSort(l[g].items, b), c = 0; c < f.length; c++) e.push(f[c]);
                    return e
                };
                this._getOrder = function(a, e, g, c, f, h) {
                    var m = [],
                        n = [],
                        r = "a" === g ? 1 : -1,
                        p, x;
                    void 0 === c && (c = "text");
                    x = "float" === c || "number" === c || "currency" === c || "numeric" === c ? function(a) {
                        a = parseFloat(String(a).replace(k, ""));
                        return isNaN(a) ? 0 : a
                    } : "int" === c || "integer" === c ? function(a) {
                        return a ? parseFloat(String(a).replace(k, "")) : 0
                    } : "date" === c || "datetime" === c ? function(a) {
                        return b.jgrid.parseDate(f, a).getTime()
                    } : b.isFunction(c) ? c : function(a) {
                        a = a ? b.trim(String(a)) : "";
                        return l ? a : a.toLowerCase()
                    };
                    b.each(a, function(a,
                                       d) {
                        p = "" !== e ? b.jgrid.getAccessor(d, e) : d;
                        void 0 === p && (p = "");
                        p = x(p, d);
                        n.push({
                            vSort: p,
                            index: a
                        })
                    });
                    b.isFunction(h) ? n.sort(function(a, b) {
                        a = a.vSort;
                        b = b.vSort;
                        return h.call(this, a, b, r)
                    }) : n.sort(function(a, b) {
                        a = a.vSort;
                        b = b.vSort;
                        return d._compare(a, b, r)
                    });
                    c = 0;
                    for (var q = a.length; c < q;) g = n[c].index, m.push(a[g]), c++;
                    return m
                };
                this._getGroup = function(a, c, e, l, g) {
                    var f = [],
                        h = null,
                        k = null,
                        m;
                    b.each(d._getOrder(a, c, e, l, g), function(a, e) {
                        m = b.jgrid.getAccessor(e, c);
                        null == m && (m = "");
                        d._equals(k, m) || (k = m, null !== h && f.push(h),
                            h = d._group(c, m));
                        h.items.push(e)
                    });
                    null !== h && f.push(h);
                    return f
                };
                this.ignoreCase = function() {
                    l = !1;
                    return d
                };
                this.useCase = function() {
                    l = !0;
                    return d
                };
                this.trim = function() {
                    g = !0;
                    return d
                };
                this.noTrim = function() {
                    g = !1;
                    return d
                };
                this.execute = function() {
                    var c = h,
                        e = [];
                    if (null === c) return d;
                    b.each(a, function() {
                        eval(c) && e.push(this)
                    });
                    a = e;
                    return d
                };
                this.data = function() {
                    return a
                };
                this.select = function(c) {
                    d._performSort();
                    if (!d._hasData()) return [];
                    d.execute();
                    if (b.isFunction(c)) {
                        var e = [];
                        b.each(a, function(a, b) {
                            e.push(c(b))
                        });
                        return e
                    }
                    return a
                };
                this.hasMatch = function() {
                    if (!d._hasData()) return !1;
                    d.execute();
                    return 0 < a.length
                };
                this.andNot = function(a, b, c) {
                    p = !p;
                    return d.and(a, b, c)
                };
                this.orNot = function(a, b, c) {
                    p = !p;
                    return d.or(a, b, c)
                };
                this.not = function(a, b, c) {
                    return d.andNot(a, b, c)
                };
                this.and = function(a, b, c) {
                    q = " && ";
                    return void 0 === a ? d : d._repeatCommand(a, b, c)
                };
                this.or = function(a, b, c) {
                    q = " || ";
                    return void 0 === a ? d : d._repeatCommand(a, b, c)
                };
                this.orBegin = function() {
                    r++;
                    return d
                };
                this.orEnd = function() {
                    null !== h && (h += ")");
                    return d
                };
                this.isNot = function(a) {
                    p = !p;
                    return d.is(a)
                };
                this.is = function(a) {
                    d._append("this." + a);
                    d._resetNegate();
                    return d
                };
                this._compareValues = function(a, c, e, l, g) {
                    var f;
                    f = G ? "jQuery.jgrid.getAccessor(this,'" + c + "')" : "this";
                    void 0 === e && (e = null);
                    var h = e,
                        m = void 0 === g.stype ? "text" : g.stype;
                    if (null !== e) switch (m) {
                        case "int":
                        case "integer":
                            h = isNaN(Number(h)) || "" === h ? "0" : h;
                            f = "parseInt(" + f + ",10)";
                            h = "parseInt(" + h + ",10)";
                            break;
                        case "float":
                        case "number":
                        case "numeric":
                            h = String(h).replace(k, "");
                            h = isNaN(Number(h)) || "" === h ?
                                "0" : h;
                            f = "parseFloat(" + f + ")";
                            h = "parseFloat(" + h + ")";
                            break;
                        case "date":
                        case "datetime":
                            h = String(b.jgrid.parseDate(g.newfmt || "Y-m-d", h).getTime());
                            f = 'jQuery.jgrid.parseDate("' + g.srcfmt + '",' + f + ").getTime()";
                            break;
                        default:
                            f = d._getStr(f), h = d._getStr('"' + d._toStr(h) + '"')
                    }
                    d._append(f + " " + l + " " + h);
                    d._setCommand(a, c);
                    d._resetNegate();
                    return d
                };
                this.equals = function(a, b, c) {
                    return d._compareValues(d.equals, a, b, "==", c)
                };
                this.notEquals = function(a, b, c) {
                    return d._compareValues(d.equals, a, b, "!==", c)
                };
                this.isNull = function(a,
                                       b, c) {
                    return d._compareValues(d.equals, a, null, "===", c)
                };
                this.greater = function(a, b, c) {
                    return d._compareValues(d.greater, a, b, ">", c)
                };
                this.less = function(a, b, c) {
                    return d._compareValues(d.less, a, b, "<", c)
                };
                this.greaterOrEquals = function(a, b, c) {
                    return d._compareValues(d.greaterOrEquals, a, b, ">=", c)
                };
                this.lessOrEquals = function(a, b, c) {
                    return d._compareValues(d.lessOrEquals, a, b, "<=", c)
                };
                this.startsWith = function(a, c) {
                    var e = null == c ? a : c,
                        e = g ? b.trim(e.toString()).length : e.toString().length;
                    G ? d._append(d._getStr("jQuery.jgrid.getAccessor(this,'" +
                            a + "')") + ".substr(0," + e + ") == " + d._getStr('"' + d._toStr(c) + '"')) : (null != c && (e = g ? b.trim(c.toString()).length : c.toString().length), d._append(d._getStr("this") + ".substr(0," + e + ") == " + d._getStr('"' + d._toStr(a) + '"')));
                    d._setCommand(d.startsWith, a);
                    d._resetNegate();
                    return d
                };
                this.endsWith = function(a, c) {
                    var e = null == c ? a : c,
                        e = g ? b.trim(e.toString()).length : e.toString().length;
                    G ? d._append(d._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".substr(" + d._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".length-" +
                        e + "," + e + ') == "' + d._toStr(c) + '"') : d._append(d._getStr("this") + ".substr(" + d._getStr("this") + '.length-"' + d._toStr(a) + '".length,"' + d._toStr(a) + '".length) == "' + d._toStr(a) + '"');
                    d._setCommand(d.endsWith, a);
                    d._resetNegate();
                    return d
                };
                this.contains = function(a, b) {
                    G ? d._append(d._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + '.indexOf("' + d._toStr(b) + '",0) > -1') : d._append(d._getStr("this") + '.indexOf("' + d._toStr(a) + '",0) > -1');
                    d._setCommand(d.contains, a);
                    d._resetNegate();
                    return d
                };
                this.groupBy = function(b,
                                        c, e, l) {
                    return d._hasData() ? d._getGroup(a, b, c, e, l) : null
                };
                this.orderBy = function(a, c, e, l, g) {
                    c = null == c ? "a" : b.trim(c.toString().toLowerCase());
                    null == e && (e = "text");
                    null == l && (l = "Y-m-d");
                    null == g && (g = !1);
                    if ("desc" === c || "descending" === c) c = "d";
                    if ("asc" === c || "ascending" === c) c = "a";
                    x.push({
                        by: a,
                        dir: c,
                        type: e,
                        datefmt: l,
                        sfunc: g
                    });
                    return d
                };
                return d
            }(e, null)
        },
        getMethod: function(e) {
            return this.getAccessor(b.fn.jqGrid, e)
        },
        extend: function(e) {
            b.extend(b.fn.jqGrid, e);
            this.no_legacy_api || b.fn.extend(e)
        }
    });
    b.fn.jqGrid = function(e) {
        if ("string" ===
            typeof e) {
            var f = b.jgrid.getMethod(e);
            if (!f) throw "jqGrid - No such method: " + e;
            var c = b.makeArray(arguments).slice(1);
            return f.apply(this, c)
        }
        return this.each(function() {
            if (!this.grid) {
                var d = b.extend(!0, {
                        url: "",
                        height: 150,
                        page: 1,
                        rowNum: 20,
                        rowTotal: null,
                        records: 0,
                        pager: "",
                        pgbuttons: !0,
                        pginput: !0,
                        colModel: [],
                        rowList: [],
                        colNames: [],
                        sortorder: "asc",
                        sortname: "",
                        datatype: "xml",
                        mtype: "GET",
                        altRows: !1,
                        selarrrow: [],
                        savedRow: [],
                        shrinkToFit: !0,
                        xmlReader: {},
                        jsonReader: {},
                        subGrid: !1,
                        subGridModel: [],
                        reccount: 0,
                        lastpage: 0,
                        lastsort: 0,
                        selrow: null,
                        beforeSelectRow: null,
                        onSelectRow: null,
                        onSortCol: null,
                        ondblClickRow: null,
                        onRightClickRow: null,
                        onPaging: null,
                        onSelectAll: null,
                        onInitGrid: null,
                        loadComplete: null,
                        gridComplete: null,
                        loadError: null,
                        loadBeforeSend: null,
                        afterInsertRow: null,
                        beforeRequest: null,
                        beforeProcessing: null,
                        onHeaderClick: null,
                        viewrecords: !1,
                        loadonce: !1,
                        multiselect: !1,
                        multikey: !1,
                        editurl: null,
                        search: !1,
                        caption: "",
                        hidegrid: !0,
                        hiddengrid: !1,
                        postData: {},
                        userData: {},
                        treeGrid: !1,
                        treeGridModel: "nested",
                        treeReader: {},
                        treeANode: -1,
                        ExpandColumn: null,
                        tree_root_level: 0,
                        prmNames: {
                            page: "page",
                            rows: "rows",
                            sort: "sidx",
                            order: "sord",
                            search: "_search",
                            nd: "nd",
                            id: "id",
                            oper: "oper",
                            editoper: "edit",
                            addoper: "add",
                            deloper: "del",
                            subgridid: "id",
                            npage: null,
                            totalrows: "totalrows"
                        },
                        forceFit: !1,
                        gridstate: "visible",
                        cellEdit: !1,
                        cellsubmit: "remote",
                        nv: 0,
                        loadui: "enable",
                        toolbar: [!1, ""],
                        scroll: !1,
                        multiboxonly: !1,
                        deselectAfterSort: !0,
                        scrollrows: !1,
                        autowidth: !1,
                        scrollOffset: 18,
                        cellLayout: 5,
                        subGridWidth: 20,
                        multiselectWidth: 20,
                        gridview: !1,
                        rownumWidth: 25,
                        rownumbers: !1,
                        pagerpos: "center",
                        recordpos: "right",
                        footerrow: !1,
                        userDataOnFooter: !1,
                        hoverrows: !0,
                        altclass: "ui-priority-secondary",
                        viewsortcols: [!1, "vertical", !0],
                        resizeclass: "",
                        autoencode: !1,
                        remapColumns: [],
                        ajaxGridOptions: {},
                        direction: "ltr",
                        toppager: !1,
                        headertitles: !1,
                        scrollTimeout: 40,
                        data: [],
                        _index: {},
                        grouping: !1,
                        groupingView: {
                            groupField: [],
                            groupOrder: [],
                            groupText: [],
                            groupColumnShow: [],
                            groupSummary: [],
                            showSummaryOnHide: !1,
                            sortitems: [],
                            sortnames: [],
                            summary: [],
                            summaryval: [],
                            plusicon: "ui-icon-circlesmall-plus",
                            minusicon: "ui-icon-circlesmall-minus",
                            displayField: [],
                            groupSummaryPos: [],
                            formatDisplayField: [],
                            _locgr: !1
                        },
                        ignoreCase: !1,
                        cmTemplate: {},
                        idPrefix: "",
                        multiSort: !1
                    }, b.jgrid.defaults, e || {}),
                    a = this,
                    c = {
                        headers: [],
                        cols: [],
                        footers: [],
                        dragStart: function(c, e, g) {
                            var f = b(this.bDiv).offset().left;
                            this.resizing = {
                                idx: c,
                                startX: e.clientX,
                                sOL: e.clientX - f
                            };
                            this.hDiv.style.cursor = "col-resize";
                            this.curGbox = b("#rs_m" + b.jgrid.jqID(d.id), "#gbox_" + b.jgrid.jqID(d.id));
                            this.curGbox.css({
                                display: "block",
                                left: e.clientX - f,
                                top: g[1],
                                height: g[2]
                            });
                            b(a).triggerHandler("jqGridResizeStart", [e, c]);
                            b.isFunction(d.resizeStart) && d.resizeStart.call(a, e, c);
                            document.onselectstart = function() {
                                return !1
                            }
                        },
                        dragMove: function(a) {
                            if (this.resizing) {
                                var b = a.clientX - this.resizing.startX;
                                a = this.headers[this.resizing.idx];
                                var c = "ltr" === d.direction ? a.width + b : a.width - b,
                                    e;
                                33 < c && (this.curGbox.css({
                                    left: this.resizing.sOL + b
                                }), !0 === d.forceFit ? (e = this.headers[this.resizing.idx + d.nv], b = "ltr" === d.direction ? e.width - b : e.width + b, 33 < b && (a.newWidth = c, e.newWidth = b)) :
                                    (this.newWidth = "ltr" === d.direction ? d.tblwidth + b : d.tblwidth - b, a.newWidth = c))
                            }
                        },
                        dragEnd: function() {
                            this.hDiv.style.cursor = "default";
                            if (this.resizing) {
                                var c = this.resizing.idx,
                                    e = this.headers[c].newWidth || this.headers[c].width,
                                    e = parseInt(e, 10);
                                this.resizing = !1;
                                b("#rs_m" + b.jgrid.jqID(d.id)).css("display", "none");
                                d.colModel[c].width = e;
                                this.headers[c].width = e;
                                this.headers[c].el.style.width = e + "px";
                                this.cols[c].style.width = e + "px";
                                0 < this.footers.length && (this.footers[c].style.width = e + "px");
                                !0 === d.forceFit ? (e =
                                    this.headers[c + d.nv].newWidth || this.headers[c + d.nv].width, this.headers[c + d.nv].width = e, this.headers[c + d.nv].el.style.width = e + "px", this.cols[c + d.nv].style.width = e + "px", 0 < this.footers.length && (this.footers[c + d.nv].style.width = e + "px"), d.colModel[c + d.nv].width = e) : (d.tblwidth = this.newWidth || d.tblwidth, b("table:first", this.bDiv).css("width", d.tblwidth + "px"), b("table:first", this.hDiv).css("width", d.tblwidth + "px"), this.hDiv.scrollLeft = this.bDiv.scrollLeft, d.footerrow && (b("table:first", this.sDiv).css("width",
                                    d.tblwidth + "px"), this.sDiv.scrollLeft = this.bDiv.scrollLeft));
                                b(a).triggerHandler("jqGridResizeStop", [e, c]);
                                b.isFunction(d.resizeStop) && d.resizeStop.call(a, e, c)
                            }
                            this.curGbox = null;
                            document.onselectstart = function() {
                                return !0
                            }
                        },
                        populateVisible: function() {
                            c.timer && clearTimeout(c.timer);
                            c.timer = null;
                            var a = b(c.bDiv).height();
                            if (a) {
                                var e = b("table:first", c.bDiv),
                                    g, f;
                                if (e[0].rows.length) try {
                                    f = (g = e[0].rows[1]) ? b(g).outerHeight() || c.prevRowHeight : c.prevRowHeight
                                } catch (pa) {
                                    f = c.prevRowHeight
                                }
                                if (f) {
                                    c.prevRowHeight =
                                        f;
                                    var h = d.rowNum;
                                    g = c.scrollTop = c.bDiv.scrollTop;
                                    var k = Math.round(e.position().top) - g,
                                        m = k + e.height();
                                    f *= h;
                                    var E, n, C;
                                    m < a && 0 >= k && (void 0 === d.lastpage || parseInt((m + g + f - 1) / f, 10) <= d.lastpage) && (n = parseInt((a - m + f - 1) / f, 10), 0 <= m || 2 > n || !0 === d.scroll ? (E = Math.round((m + g) / f) + 1, k = -1) : k = 1);
                                    0 < k && (E = parseInt(g / f, 10) + 1, n = parseInt((g + a) / f, 10) + 2 - E, C = !0);
                                    !n || d.lastpage && (E > d.lastpage || 1 === d.lastpage || E === d.page && E === d.lastpage) || (c.hDiv.loading ? c.timer = setTimeout(c.populateVisible, d.scrollTimeout) : (d.page = E, C && (c.selectionPreserver(e[0]),
                                        c.emptyRows.call(e[0], !1, !1)), c.populate(n)))
                                }
                            }
                        },
                        scrollGrid: function(a) {
                            if (d.scroll) {
                                var b = c.bDiv.scrollTop;
                                void 0 === c.scrollTop && (c.scrollTop = 0);
                                b !== c.scrollTop && (c.scrollTop = b, c.timer && clearTimeout(c.timer), c.timer = setTimeout(c.populateVisible, d.scrollTimeout))
                            }
                            c.hDiv.scrollLeft = c.bDiv.scrollLeft;
                            d.footerrow && (c.sDiv.scrollLeft = c.bDiv.scrollLeft);
                            a && a.stopPropagation()
                        },
                        selectionPreserver: function(a) {
                            var c = a.p,
                                d = c.selrow,
                                e = c.selarrrow ? b.makeArray(c.selarrrow) : null,
                                f = a.grid.bDiv.scrollLeft,
                                g = function() {
                                    var h;
                                    c.selrow = null;
                                    c.selarrrow = [];
                                    if (c.multiselect && e && 0 < e.length)
                                        for (h = 0; h < e.length; h++) e[h] !== d && b(a).jqGrid("setSelection", e[h], !1, null);
                                    d && b(a).jqGrid("setSelection", d, !1, null);
                                    a.grid.bDiv.scrollLeft = f;
                                    b(a).unbind(".selectionPreserver", g)
                                };
                            b(a).bind("jqGridGridComplete.selectionPreserver", g)
                        }
                    };
                if ("TABLE" !== this.tagName.toUpperCase()) alert("Element is not a table");
                else if (void 0 !== document.documentMode && 5 >= document.documentMode) alert("Grid can not be used in this ('quirks') mode!");
                else {
                    b(this).empty().attr("tabindex",
                        "0");
                    this.p = d;
                    this.p.useProp = !!b.fn.prop;
                    var g, f;
                    if (0 === this.p.colNames.length)
                        for (g = 0; g < this.p.colModel.length; g++) this.p.colNames[g] = this.p.colModel[g].label || this.p.colModel[g].name;
                    if (this.p.colNames.length !== this.p.colModel.length) alert(b.jgrid.errors.model);
                    else {
                        var k = b("<div class='ui-jqgrid-view'></div>"),
                            n = b.jgrid.msie;
                        a.p.direction = b.trim(a.p.direction.toLowerCase()); - 1 === b.inArray(a.p.direction, ["ltr", "rtl"]) && (a.p.direction = "ltr");
                        f = a.p.direction;
                        b(k).insertBefore(this);
                        b(this).removeClass("scroll").appendTo(k);
                        var m = b("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
                        b(m).attr({
                            id: "gbox_" + this.id,
                            dir: f
                        }).insertBefore(k);
                        b(k).attr("id", "gview_" + this.id).appendTo(m);
                        b("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" + this.id + "'></div>").insertBefore(k);
                        b("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(k);
                        b(this).attr({
                            cellspacing: "0",
                            cellpadding: "0",
                            border: "0",
                            role: "grid",
                            "aria-multiselectable": !!this.p.multiselect,
                            "aria-labelledby": "gbox_" + this.id
                        });
                        var r = function(a, b) {
                                a = parseInt(a, 10);
                                return isNaN(a) ? b || 0 : a
                            },
                            p = function(d, e, f, g, pa, h) {
                                var k = a.p.colModel[d],
                                    m = k.align,
                                    E = 'style="',
                                    n = k.classes,
                                    C = k.name,
                                    A = [];
                                m && (E += "text-align:" + m + ";");
                                !0 === k.hidden && (E += "display:none;");
                                if (0 === e) E += "width: " + c.headers[d].width + "px;";
                                else if (k.cellattr && b.isFunction(k.cellattr) && (d = k.cellattr.call(a, pa, f, g, k, h)) && "string" === typeof d)
                                    if (d = d.replace(/style/i, "style").replace(/title/i, "title"), -1 < d.indexOf("title") && (k.title = !1), -1 <
                                        d.indexOf("class") && (n = void 0), A = d.replace("-style", "-sti").split(/style/), 2 === A.length) {
                                        A[1] = b.trim(A[1].replace("-sti", "-style").replace("=", ""));
                                        if (0 === A[1].indexOf("'") || 0 === A[1].indexOf('"')) A[1] = A[1].substring(1);
                                        E += A[1].replace(/'/gi, '"')
                                    } else E += '"';
                                A.length || (A[0] = "", E += '"');
                                E += (void 0 !== n ? ' class="' + n + '"' : "") + (k.title && f ? ' title="' + b.jgrid.stripHtml(f) + '"' : "");
                                E += ' aria-describedby="' + a.p.id + "_" + C + '"';
                                return E + A[0]
                            },
                            q = function(c) {
                                return null == c || "" === c ? "&#160;" : a.p.autoencode ? b.jgrid.htmlEncode(c) :
                                    String(c)
                            },
                            x = function(c, d, e, f, g) {
                                var h = a.p.colModel[e];
                                void 0 !== h.formatter ? (c = "" !== String(a.p.idPrefix) ? b.jgrid.stripPref(a.p.idPrefix, c) : c, c = {
                                    rowId: c,
                                    colModel: h,
                                    gid: a.p.id,
                                    pos: e
                                }, d = b.isFunction(h.formatter) ? h.formatter.call(a, d, c, f, g) : b.fmatter ? b.fn.fmatter.call(a, h.formatter, d, c, f, g) : q(d)) : d = q(d);
                                return d
                            },
                            G = function(a, b, c, d, e, f) {
                                b = x(a, b, c, e, "add");
                                return '<td role="gridcell" ' + p(c, d, b, e, a, f) + ">" + b + "</td>"
                            },
                            U = function(b, c, d, e) {
                                e = '<input role="checkbox" type="checkbox" id="jqg_' + a.p.id + "_" + b + '" class="cbox" name="jqg_' +
                                    a.p.id + "_" + b + '"' + (e ? 'checked="checked"' : "") + "/>";
                                return '<td role="gridcell" ' + p(c, d, "", null, b, !0) + ">" + e + "</td>"
                            },
                            M = function(a, b, c, d) {
                                c = (parseInt(c, 10) - 1) * parseInt(d, 10) + 1 + b;
                                return '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + p(a, b, c, null, b, !0) + ">" + c + "</td>"
                            },
                            ea = function(b) {
                                var c, d = [],
                                    e = 0,
                                    f;
                                for (f = 0; f < a.p.colModel.length; f++) c = a.p.colModel[f], "cb" !== c.name && "subgrid" !== c.name && "rn" !== c.name && (d[e] = "local" === b ? c.name : "xml" === b || "xmlstring" === b ? c.xmlmap || c.name : c.jsonmap || c.name, !1 !==
                                a.p.keyIndex && !0 === c.key && (a.p.keyName = d[e]), e++);
                                return d
                            },
                            W = function(c) {
                                var d = a.p.remapColumns;
                                d && d.length || (d = b.map(a.p.colModel, function(a, b) {
                                    return b
                                }));
                                c && (d = b.map(d, function(a) {
                                    return a < c ? null : a - c
                                }));
                                return d
                            },
                            X = function(a, c) {
                                var d;
                                this.p.deepempty ? b(this.rows).slice(1).remove() : (d = 0 < this.rows.length ? this.rows[0] : null, b(this.firstChild).empty().append(d));
                                a && this.p.scroll && (b(this.grid.bDiv.firstChild).css({
                                    height: "auto"
                                }), b(this.grid.bDiv.firstChild.firstChild).css({
                                    height: 0,
                                    display: "none"
                                }),
                                0 !== this.grid.bDiv.scrollTop && (this.grid.bDiv.scrollTop = 0));
                                !0 === c && this.p.treeGrid && (this.p.data = [], this.p._index = {})
                            },
                            O = function() {
                                var c = a.p.data.length,
                                    d, e, f;
                                d = !0 === a.p.rownumbers ? 1 : 0;
                                e = !0 === a.p.multiselect ? 1 : 0;
                                f = !0 === a.p.subGrid ? 1 : 0;
                                d = !1 === a.p.keyIndex || !0 === a.p.loadonce ? a.p.localReader.id : a.p.colModel[a.p.keyIndex + e + f + d].name;
                                for (e = 0; e < c; e++) f = b.jgrid.getAccessor(a.p.data[e], d), void 0 === f && (f = String(e + 1)), a.p._index[f] = e
                            },
                            $ = function(c, d, e, f, g, h) {
                                var l = "-1",
                                    k = "",
                                    m;
                                d = d ? "display:none;" : "";
                                e = "ui-widget-content jqgrow ui-row-" +
                                    a.p.direction + (e ? " " + e : "") + (h ? " ui-state-highlight" : "");
                                h = b(a).triggerHandler("jqGridRowAttr", [f, g, c]);
                                "object" !== typeof h && (h = b.isFunction(a.p.rowattr) ? a.p.rowattr.call(a, f, g, c) : {});
                                if (!b.isEmptyObject(h)) {
                                    h.hasOwnProperty("id") && (c = h.id, delete h.id);
                                    h.hasOwnProperty("tabindex") && (l = h.tabindex, delete h.tabindex);
                                    h.hasOwnProperty("style") && (d += h.style, delete h.style);
                                    h.hasOwnProperty("class") && (e += " " + h["class"], delete h["class"]);
                                    try {
                                        delete h.role
                                    } catch (n) {}
                                    for (m in h) h.hasOwnProperty(m) && (k += " " +
                                        m + "=" + h[m])
                                }
                                return '<tr role="row" id="' + c + '" tabindex="' + l + '" class="' + e + '"' + ("" === d ? "" : ' style="' + d + '"') + k + ">"
                            },
                            K = function(c, d, e, f, g) {
                                var h = new Date,
                                    l = "local" !== a.p.datatype && a.p.loadonce || "xmlstring" === a.p.datatype,
                                    k = a.p.xmlReader,
                                    m = "local" === a.p.datatype ? "local" : "xml";
                                l && (a.p.data = [], a.p._index = {}, a.p.localReader.id = "_id_");
                                a.p.reccount = 0;
                                if (b.isXMLDoc(c)) {
                                    -1 !== a.p.treeANode || a.p.scroll ? e = 1 < e ? e : 1 : (X.call(a, !1, !0), e = 1);
                                    var n = b(a),
                                        C, A, R = 0,
                                        p, u = !0 === a.p.multiselect ? 1 : 0,
                                        z = 0,
                                        x, q = !0 === a.p.rownumbers ?
                                            1 : 0,
                                        t, Z = [],
                                        aa, v = {},
                                        w, H, s = [],
                                        L = !0 === a.p.altRows ? a.p.altclass : "",
                                        ia;
                                    !0 === a.p.subGrid && (z = 1, x = b.jgrid.getMethod("addSubGridCell"));
                                    k.repeatitems || (Z = ea(m));
                                    t = !1 === a.p.keyIndex ? b.isFunction(k.id) ? k.id.call(a, c) : k.id : a.p.keyIndex;
                                    0 < Z.length && !isNaN(t) && (t = a.p.keyName);
                                    m = -1 === String(t).indexOf("[") ? Z.length ? function(a, c) {
                                        return b(t, a).text() || c
                                    } : function(a, c) {
                                        return b(k.cell, a).eq(t).text() || c
                                    } : function(a, b) {
                                        return a.getAttribute(t.replace(/[\[\]]/g, "")) || b
                                    };
                                    a.p.userData = {};
                                    a.p.page = r(b.jgrid.getXmlData(c,
                                        k.page), a.p.page);
                                    a.p.lastpage = r(b.jgrid.getXmlData(c, k.total), 1);
                                    a.p.records = r(b.jgrid.getXmlData(c, k.records));
                                    b.isFunction(k.userdata) ? a.p.userData = k.userdata.call(a, c) || {} : b.jgrid.getXmlData(c, k.userdata, !0).each(function() {
                                        a.p.userData[this.getAttribute("name")] = b(this).text()
                                    });
                                    c = b.jgrid.getXmlData(c, k.root, !0);
                                    (c = b.jgrid.getXmlData(c, k.row, !0)) || (c = []);
                                    var S = c.length,
                                        I = 0,
                                        y = [],
                                        D = parseInt(a.p.rowNum, 10),
                                        B = a.p.scroll ? b.jgrid.randId() : 1;
                                    0 < S && 0 >= a.p.page && (a.p.page = 1);
                                    if (c && S) {
                                        g && (D *= g + 1);
                                        g = b.isFunction(a.p.afterInsertRow);
                                        var F = !1,
                                            J;
                                        a.p.grouping && (F = !0 === a.p.groupingView.groupCollapse, J = b.jgrid.getMethod("groupingPrepare"));
                                        for (; I < S;) {
                                            w = c[I];
                                            H = m(w, B + I);
                                            H = a.p.idPrefix + H;
                                            C = 0 === e ? 0 : e + 1;
                                            ia = 1 === (C + I) % 2 ? L : "";
                                            var K = s.length;
                                            s.push("");
                                            q && s.push(M(0, I, a.p.page, a.p.rowNum));
                                            u && s.push(U(H, q, I, !1));
                                            z && s.push(x.call(n, u + q, I + e));
                                            if (k.repeatitems) {
                                                aa || (aa = W(u + z + q));
                                                var N = b.jgrid.getXmlData(w, k.cell, !0);
                                                b.each(aa, function(b) {
                                                    var c = N[this];
                                                    if (!c) return !1;
                                                    p = c.textContent || c.text;
                                                    v[a.p.colModel[b + u + z + q].name] = p;
                                                    s.push(G(H, p, b + u + z + q,
                                                        I + e, w, v))
                                                })
                                            } else
                                                for (C = 0; C < Z.length; C++) p = b.jgrid.getXmlData(w, Z[C]), v[a.p.colModel[C + u + z + q].name] = p, s.push(G(H, p, C + u + z + q, I + e, w, v));
                                            s[K] = $(H, F, ia, v, w, !1);
                                            s.push("</tr>");
                                            a.p.grouping && (y.push(s), a.p.groupingView._locgr || J.call(n, v, I), s = []);
                                            if (l || !0 === a.p.treeGrid) v._id_ = b.jgrid.stripPref(a.p.idPrefix, H), a.p.data.push(v), a.p._index[v._id_] = a.p.data.length - 1;
                                            !1 === a.p.gridview && (b("tbody:first", d).append(s.join("")), n.triggerHandler("jqGridAfterInsertRow", [H, v, w]), g && a.p.afterInsertRow.call(a, H, v, w),
                                                s = []);
                                            v = {};
                                            R++;
                                            I++;
                                            if (R === D) break
                                        }
                                    }!0 === a.p.gridview && (A = -1 < a.p.treeANode ? a.p.treeANode : 0, a.p.grouping ? (l || n.jqGrid("groupingRender", y, a.p.colModel.length, a.p.page, D), y = null) : !0 === a.p.treeGrid && 0 < A ? b(a.rows[A]).after(s.join("")) : b("tbody:first", d).append(s.join("")));
                                    if (!0 === a.p.subGrid) try {
                                        n.jqGrid("addSubGrid", u + q)
                                    } catch (Q) {}
                                    a.p.totaltime = new Date - h;
                                    0 < R && 0 === a.p.records && (a.p.records = S);
                                    s = null;
                                    if (!0 === a.p.treeGrid) try {
                                        n.jqGrid("setTreeNode", A + 1, R + A + 1)
                                    } catch (O) {}
                                    a.p.treeGrid || a.p.scroll || (a.grid.bDiv.scrollTop =
                                        0);
                                    a.p.reccount = R;
                                    a.p.treeANode = -1;
                                    a.p.userDataOnFooter && n.jqGrid("footerData", "set", a.p.userData, !0);
                                    l && (a.p.records = S, a.p.lastpage = Math.ceil(S / D));
                                    f || a.updatepager(!1, !0);
                                    if (l) {
                                        for (; R < S;) {
                                            w = c[R];
                                            H = m(w, R + B);
                                            H = a.p.idPrefix + H;
                                            if (k.repeatitems) {
                                                aa || (aa = W(u + z + q));
                                                var P = b.jgrid.getXmlData(w, k.cell, !0);
                                                b.each(aa, function(b) {
                                                    var c = P[this];
                                                    if (!c) return !1;
                                                    p = c.textContent || c.text;
                                                    v[a.p.colModel[b + u + z + q].name] = p
                                                })
                                            } else
                                                for (C = 0; C < Z.length; C++) p = b.jgrid.getXmlData(w, Z[C]), v[a.p.colModel[C + u + z + q].name] = p;
                                            v._id_ =
                                                b.jgrid.stripPref(a.p.idPrefix, H);
                                            a.p.grouping && J.call(n, v, R);
                                            a.p.data.push(v);
                                            a.p._index[v._id_] = a.p.data.length - 1;
                                            v = {};
                                            R++
                                        }
                                        a.p.grouping && (a.p.groupingView._locgr = !0, n.jqGrid("groupingRender", y, a.p.colModel.length, a.p.page, D), y = null)
                                    }
                                }
                            },
                            Y = function(c, d, e, f, g) {
                                var h = new Date;
                                if (c) {
                                    -1 !== a.p.treeANode || a.p.scroll ? e = 1 < e ? e : 1 : (X.call(a, !1, !0), e = 1);
                                    var k, l = "local" !== a.p.datatype && a.p.loadonce || "jsonstring" === a.p.datatype;
                                    l && (a.p.data = [], a.p._index = {}, a.p.localReader.id = "_id_");
                                    a.p.reccount = 0;
                                    "local" === a.p.datatype ?
                                        (d = a.p.localReader, k = "local") : (d = a.p.jsonReader, k = "json");
                                    var m = b(a),
                                        n = 0,
                                        C, A, p, q = [],
                                        u = a.p.multiselect ? 1 : 0,
                                        z = !0 === a.p.subGrid ? 1 : 0,
                                        x, t = !0 === a.p.rownumbers ? 1 : 0,
                                        D = W(u + z + t);
                                    k = ea(k);
                                    var y, B, v, w = {},
                                        H, s, L = [],
                                        ia = !0 === a.p.altRows ? a.p.altclass : "",
                                        S;
                                    a.p.page = r(b.jgrid.getAccessor(c, d.page), a.p.page);
                                    a.p.lastpage = r(b.jgrid.getAccessor(c, d.total), 1);
                                    a.p.records = r(b.jgrid.getAccessor(c, d.records));
                                    a.p.userData = b.jgrid.getAccessor(c, d.userdata) || {};
                                    z && (x = b.jgrid.getMethod("addSubGridCell"));
                                    v = !1 === a.p.keyIndex ? b.isFunction(d.id) ?
                                        d.id.call(a, c) : d.id : a.p.keyIndex;
                                    d.repeatitems || (q = k, 0 < q.length && !isNaN(v) && (v = a.p.keyName));
                                    B = b.jgrid.getAccessor(c, d.root);
                                    null == B && b.isArray(c) && (B = c);
                                    B || (B = []);
                                    c = B.length;
                                    A = 0;
                                    0 < c && 0 >= a.p.page && (a.p.page = 1);
                                    var I = parseInt(a.p.rowNum, 10),
                                        F = a.p.scroll ? b.jgrid.randId() : 1,
                                        J = !1,
                                        K;
                                    g && (I *= g + 1);
                                    "local" !== a.p.datatype || a.p.deselectAfterSort || (J = !0);
                                    var N = b.isFunction(a.p.afterInsertRow),
                                        P = [],
                                        Q = !1,
                                        O;
                                    a.p.grouping && (Q = !0 === a.p.groupingView.groupCollapse, O = b.jgrid.getMethod("groupingPrepare"));
                                    for (; A < c;) {
                                        g =
                                            B[A];
                                        s = b.jgrid.getAccessor(g, v);
                                        void 0 === s && ("number" === typeof v && null != a.p.colModel[v + u + z + t] && (s = b.jgrid.getAccessor(g, a.p.colModel[v + u + z + t].name)), void 0 === s && (s = F + A, 0 === q.length && d.cell && (C = b.jgrid.getAccessor(g, d.cell) || g, s = null != C && void 0 !== C[v] ? C[v] : s)));
                                        s = a.p.idPrefix + s;
                                        C = 1 === e ? 0 : e;
                                        S = 1 === (C + A) % 2 ? ia : "";
                                        J && (K = a.p.multiselect ? -1 !== b.inArray(s, a.p.selarrrow) : s === a.p.selrow);
                                        var T = L.length;
                                        L.push("");
                                        t && L.push(M(0, A, a.p.page, a.p.rowNum));
                                        u && L.push(U(s, t, A, K));
                                        z && L.push(x.call(m, u + t, A + e));
                                        y = k;
                                        d.repeatitems &&
                                        (d.cell && (g = b.jgrid.getAccessor(g, d.cell) || g), b.isArray(g) && (y = D));
                                        for (p = 0; p < y.length; p++) C = b.jgrid.getAccessor(g, y[p]), w[a.p.colModel[p + u + z + t].name] = C, L.push(G(s, C, p + u + z + t, A + e, g, w));
                                        L[T] = $(s, Q, S, w, g, K);
                                        L.push("</tr>");
                                        a.p.grouping && (P.push(L), a.p.groupingView._locgr || O.call(m, w, A), L = []);
                                        if (l || !0 === a.p.treeGrid) w._id_ = b.jgrid.stripPref(a.p.idPrefix, s), a.p.data.push(w), a.p._index[w._id_] = a.p.data.length - 1;
                                        !1 === a.p.gridview && (b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(L.join("")), m.triggerHandler("jqGridAfterInsertRow", [s, w, g]), N && a.p.afterInsertRow.call(a, s, w, g), L = []);
                                        w = {};
                                        n++;
                                        A++;
                                        if (n === I) break
                                    }!0 === a.p.gridview && (H = -1 < a.p.treeANode ? a.p.treeANode : 0, a.p.grouping ? l || (m.jqGrid("groupingRender", P, a.p.colModel.length, a.p.page, I), P = null) : !0 === a.p.treeGrid && 0 < H ? b(a.rows[H]).after(L.join("")) : b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(L.join("")));
                                    if (!0 === a.p.subGrid) try {
                                        m.jqGrid("addSubGrid", u + t)
                                    } catch (V) {}
                                    a.p.totaltime = new Date - h;
                                    0 < n && 0 === a.p.records && (a.p.records = c);
                                    if (!0 === a.p.treeGrid) try {
                                        m.jqGrid("setTreeNode",
                                            H + 1, n + H + 1)
                                    } catch (Y) {}
                                    a.p.treeGrid || a.p.scroll || (a.grid.bDiv.scrollTop = 0);
                                    a.p.reccount = n;
                                    a.p.treeANode = -1;
                                    a.p.userDataOnFooter && m.jqGrid("footerData", "set", a.p.userData, !0);
                                    l && (a.p.records = c, a.p.lastpage = Math.ceil(c / I));
                                    f || a.updatepager(!1, !0);
                                    if (l) {
                                        for (; n < c && B[n];) {
                                            g = B[n];
                                            s = b.jgrid.getAccessor(g, v);
                                            void 0 === s && ("number" === typeof v && null != a.p.colModel[v + u + z + t] && (s = b.jgrid.getAccessor(g, a.p.colModel[v + u + z + t].name)), void 0 === s && (s = F + n, 0 === q.length && d.cell && (e = b.jgrid.getAccessor(g, d.cell) || g, s = null !=
                                            e && void 0 !== e[v] ? e[v] : s)));
                                            if (g) {
                                                s = a.p.idPrefix + s;
                                                y = k;
                                                d.repeatitems && (d.cell && (g = b.jgrid.getAccessor(g, d.cell) || g), b.isArray(g) && (y = D));
                                                for (p = 0; p < y.length; p++) w[a.p.colModel[p + u + z + t].name] = b.jgrid.getAccessor(g, y[p]);
                                                w._id_ = b.jgrid.stripPref(a.p.idPrefix, s);
                                                a.p.grouping && O.call(m, w, n);
                                                a.p.data.push(w);
                                                a.p._index[w._id_] = a.p.data.length - 1;
                                                w = {}
                                            }
                                            n++
                                        }
                                        a.p.grouping && (a.p.groupingView._locgr = !0, m.jqGrid("groupingRender", P, a.p.colModel.length, a.p.page, I))
                                    }
                                }
                            },
                            oa = function() {
                                function c(a) {
                                    var b = 0,
                                        d, e, g, h, k;
                                    if (null != a.groups) {
                                        (e = a.groups.length && "OR" === a.groupOp.toString().toUpperCase()) && u.orBegin();
                                        for (d = 0; d < a.groups.length; d++) {
                                            0 < b && e && u.or();
                                            try {
                                                c(a.groups[d])
                                            } catch (l) {
                                                alert(l)
                                            }
                                            b++
                                        }
                                        e && u.orEnd()
                                    }
                                    if (null != a.rules) try {
                                        (g = a.rules.length && "OR" === a.groupOp.toString().toUpperCase()) && u.orBegin();
                                        for (d = 0; d < a.rules.length; d++) k = a.rules[d], h = a.groupOp.toString().toUpperCase(), q[k.op] && k.field && (0 < b && h && "OR" === h && (u = u.or()), u = q[k.op](u, h)(k.field, k.data, f[k.field])), b++;
                                        g && u.orEnd()
                                    } catch (m) {
                                        alert(m)
                                    }
                                }
                                var d =
                                        a.p.multiSort ? [] : "",
                                    e = [],
                                    g = !1,
                                    f = {},
                                    h = [],
                                    k = [],
                                    l, m, n;
                                if (b.isArray(a.p.data)) {
                                    var p = a.p.grouping ? a.p.groupingView : !1,
                                        A, r;
                                    b.each(a.p.colModel, function() {
                                        m = this.sorttype || "text";
                                        "date" === m || "datetime" === m ? (this.formatter && "string" === typeof this.formatter && "date" === this.formatter ? (l = this.formatoptions && this.formatoptions.srcformat ? this.formatoptions.srcformat : b.jgrid.formatter.date.srcformat, n = this.formatoptions && this.formatoptions.newformat ? this.formatoptions.newformat : b.jgrid.formatter.date.newformat) :
                                            l = n = this.datefmt || "Y-m-d", f[this.name] = {
                                            stype: m,
                                            srcfmt: l,
                                            newfmt: n,
                                            sfunc: this.sortfunc || null
                                        }) : f[this.name] = {
                                            stype: m,
                                            srcfmt: "",
                                            newfmt: "",
                                            sfunc: this.sortfunc || null
                                        };
                                        if (a.p.grouping)
                                            for (r = 0, A = p.groupField.length; r < A; r++)
                                                if (this.name === p.groupField[r]) {
                                                    var c = this.name;
                                                    this.index && (c = this.index);
                                                    h[r] = f[c];
                                                    k[r] = c
                                                }
                                        a.p.multiSort ? this.lso && (d.push(this.name), c = this.lso.split("-"), e.push(c[c.length - 1])) : g || this.index !== a.p.sortname && this.name !== a.p.sortname || (d = this.name, g = !0)
                                    });
                                    if (a.p.treeGrid) b(a).jqGrid("SortTree",
                                        d, a.p.sortorder, f[d].stype || "text", f[d].srcfmt || "");
                                    else {
                                        var q = {
                                                eq: function(a) {
                                                    return a.equals
                                                },
                                                ne: function(a) {
                                                    return a.notEquals
                                                },
                                                lt: function(a) {
                                                    return a.less
                                                },
                                                le: function(a) {
                                                    return a.lessOrEquals
                                                },
                                                gt: function(a) {
                                                    return a.greater
                                                },
                                                ge: function(a) {
                                                    return a.greaterOrEquals
                                                },
                                                cn: function(a) {
                                                    return a.contains
                                                },
                                                nc: function(a, b) {
                                                    return "OR" === b ? a.orNot().contains : a.andNot().contains
                                                },
                                                bw: function(a) {
                                                    return a.startsWith
                                                },
                                                bn: function(a, b) {
                                                    return "OR" === b ? a.orNot().startsWith : a.andNot().startsWith
                                                },
                                                en: function(a,
                                                             b) {
                                                    return "OR" === b ? a.orNot().endsWith : a.andNot().endsWith
                                                },
                                                ew: function(a) {
                                                    return a.endsWith
                                                },
                                                ni: function(a, b) {
                                                    return "OR" === b ? a.orNot().equals : a.andNot().equals
                                                },
                                                "in": function(a) {
                                                    return a.equals
                                                },
                                                nu: function(a) {
                                                    return a.isNull
                                                },
                                                nn: function(a, b) {
                                                    return "OR" === b ? a.orNot().isNull : a.andNot().isNull
                                                }
                                            },
                                            u = b.jgrid.from(a.p.data);
                                        a.p.ignoreCase && (u = u.ignoreCase());
                                        if (!0 === a.p.search) {
                                            var z = a.p.postData.filters;
                                            if (z) "string" === typeof z && (z = b.jgrid.parse(z)), c(z);
                                            else try {
                                                u = q[a.p.postData.searchOper](u)(a.p.postData.searchField,
                                                    a.p.postData.searchString, f[a.p.postData.searchField])
                                            } catch (t) {}
                                        }
                                        if (a.p.grouping)
                                            for (r = 0; r < A; r++) u.orderBy(k[r], p.groupOrder[r], h[r].stype, h[r].srcfmt);
                                        a.p.multiSort ? b.each(d, function(a) {
                                            u.orderBy(this, e[a], f[this].stype, f[this].srcfmt, f[this].sfunc)
                                        }) : d && a.p.sortorder && g && ("DESC" === a.p.sortorder.toUpperCase() ? u.orderBy(a.p.sortname, "d", f[d].stype, f[d].srcfmt, f[d].sfunc) : u.orderBy(a.p.sortname, "a", f[d].stype, f[d].srcfmt, f[d].sfunc));
                                        var z = u.select(),
                                            x = parseInt(a.p.rowNum, 10),
                                            y = z.length,
                                            B = parseInt(a.p.page,
                                                10),
                                            D = Math.ceil(y / x),
                                            v = {};
                                        if ((a.p.search || a.p.resetsearch) && a.p.grouping && a.p.groupingView._locgr) {
                                            a.p.groupingView.groups = [];
                                            var w, G = b.jgrid.getMethod("groupingPrepare"),
                                                s, F;
                                            if (a.p.footerrow && a.p.userDataOnFooter) {
                                                for (s in a.p.userData) a.p.userData.hasOwnProperty(s) && (a.p.userData[s] = 0);
                                                F = !0
                                            }
                                            for (w = 0; w < y; w++) {
                                                if (F)
                                                    for (s in a.p.userData) a.p.userData[s] += parseFloat(z[w][s] || 0);
                                                G.call(b(a), z[w], w, x)
                                            }
                                        }
                                        z = z.slice((B - 1) * x, B * x);
                                        f = u = null;
                                        v[a.p.localReader.total] = D;
                                        v[a.p.localReader.page] = B;
                                        v[a.p.localReader.records] =
                                            y;
                                        v[a.p.localReader.root] = z;
                                        v[a.p.localReader.userdata] = a.p.userData;
                                        z = null;
                                        return v
                                    }
                                }
                            },
                            P = function() {
                                a.grid.hDiv.loading = !0;
                                if (!a.p.hiddengrid) switch (a.p.loadui) {
                                    case "enable":
                                        b("#load_" + b.jgrid.jqID(a.p.id)).show();
                                        break;
                                    case "block":
                                        b("#lui_" + b.jgrid.jqID(a.p.id)).show(), b("#load_" + b.jgrid.jqID(a.p.id)).show()
                                }
                            },
                            T = function() {
                                a.grid.hDiv.loading = !1;
                                switch (a.p.loadui) {
                                    case "enable":
                                        b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                                        break;
                                    case "block":
                                        b("#lui_" + b.jgrid.jqID(a.p.id)).hide(), b("#load_" + b.jgrid.jqID(a.p.id)).hide()
                                }
                            },
                            Q = function(c) {
                                if (!a.grid.hDiv.loading) {
                                    var d = a.p.scroll && !1 === c,
                                        e = {},
                                        g, f = a.p.prmNames;
                                    0 >= a.p.page && (a.p.page = Math.min(1, a.p.lastpage));
                                    null !== f.search && (e[f.search] = a.p.search);
                                    null !== f.nd && (e[f.nd] = (new Date).getTime());
                                    null !== f.rows && (e[f.rows] = a.p.rowNum);
                                    null !== f.page && (e[f.page] = a.p.page);
                                    null !== f.sort && (e[f.sort] = a.p.sortname);
                                    null !== f.order && (e[f.order] = a.p.sortorder);
                                    null !== a.p.rowTotal && null !== f.totalrows && (e[f.totalrows] = a.p.rowTotal);
                                    var h = b.isFunction(a.p.loadComplete),
                                        k = h ? a.p.loadComplete :
                                            null,
                                        l = 0;
                                    c = c || 1;
                                    1 < c ? null !== f.npage ? (e[f.npage] = c, l = c - 1, c = 1) : k = function(b) {
                                        a.p.page++;
                                        a.grid.hDiv.loading = !1;
                                        h && a.p.loadComplete.call(a, b);
                                        Q(c - 1)
                                    } : null !== f.npage && delete a.p.postData[f.npage];
                                    if (a.p.grouping) {
                                        b(a).jqGrid("groupingSetup");
                                        var m = a.p.groupingView,
                                            n, p = "";
                                        for (n = 0; n < m.groupField.length; n++) {
                                            var r = m.groupField[n];
                                            b.each(a.p.colModel, function(a, b) {
                                                b.name === r && b.index && (r = b.index)
                                            });
                                            p += r + " " + m.groupOrder[n] + ", "
                                        }
                                        e[f.sort] = p + e[f.sort]
                                    }
                                    b.extend(a.p.postData, e);
                                    var q = a.p.scroll ? a.rows.length -
                                            1 : 1,
                                        e = b(a).triggerHandler("jqGridBeforeRequest");
                                    if (!1 !== e && "stop" !== e)
                                        if (b.isFunction(a.p.datatype)) a.p.datatype.call(a, a.p.postData, "load_" + a.p.id, q, c, l);
                                        else {
                                            if (b.isFunction(a.p.beforeRequest) && (e = a.p.beforeRequest.call(a), void 0 === e && (e = !0), !1 === e)) return;
                                            g = a.p.datatype.toLowerCase();
                                            switch (g) {
                                                case "json":
                                                case "jsonp":
                                                case "xml":
                                                case "script":
                                                    b.ajax(b.extend({
                                                        url: a.p.url,
                                                        type: a.p.mtype,
                                                        dataType: g,
                                                        data: b.isFunction(a.p.serializeGridData) ? a.p.serializeGridData.call(a, a.p.postData) : a.p.postData,
                                                        success: function(e, f, h) {
                                                            if (b.isFunction(a.p.beforeProcessing) && !1 === a.p.beforeProcessing.call(a, e, f, h)) T();
                                                            else {
                                                                "xml" === g ? K(e, a.grid.bDiv, q, 1 < c, l) : Y(e, a.grid.bDiv, q, 1 < c, l);
                                                                b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                                k && k.call(a, e);
                                                                b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                                d && a.grid.populateVisible();
                                                                if (a.p.loadonce || a.p.treeGrid) a.p.datatype = "local";
                                                                1 === c && T()
                                                            }
                                                        },
                                                        error: function(d, e, f) {
                                                            b.isFunction(a.p.loadError) && a.p.loadError.call(a, d, e, f);
                                                            1 === c && T()
                                                        },
                                                        beforeSend: function(c, d) {
                                                            var e = !0;
                                                            b.isFunction(a.p.loadBeforeSend) && (e = a.p.loadBeforeSend.call(a, c, d));
                                                            void 0 === e && (e = !0);
                                                            if (!1 === e) return !1;
                                                            P()
                                                        }
                                                    }, b.jgrid.ajaxOptions, a.p.ajaxGridOptions));
                                                    break;
                                                case "xmlstring":
                                                    P();
                                                    e = "string" !== typeof a.p.datastr ? a.p.datastr : b.parseXML(a.p.datastr);
                                                    K(e, a.grid.bDiv);
                                                    b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                    h && a.p.loadComplete.call(a, e);
                                                    b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                    a.p.datatype = "local";
                                                    a.p.datastr = null;
                                                    T();
                                                    break;
                                                case "jsonstring":
                                                    P();
                                                    e = "string" === typeof a.p.datastr ? b.jgrid.parse(a.p.datastr) :
                                                        a.p.datastr;
                                                    Y(e, a.grid.bDiv);
                                                    b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                    h && a.p.loadComplete.call(a, e);
                                                    b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                    a.p.datatype = "local";
                                                    a.p.datastr = null;
                                                    T();
                                                    break;
                                                case "local":
                                                case "clientside":
                                                    P(), a.p.datatype = "local", e = oa(), Y(e, a.grid.bDiv, q, 1 < c, l), b(a).triggerHandler("jqGridLoadComplete", [e]), k && k.call(a, e), b(a).triggerHandler("jqGridAfterLoadComplete", [e]), d && a.grid.populateVisible(), T()
                                            }
                                        }
                                }
                            },
                            ha = function(c) {
                                b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv)[a.p.useProp ?
                                    "prop" : "attr"]("checked", c);
                                if (a.p.frozenColumns && a.p.id + "_frozen") b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.fhDiv)[a.p.useProp ? "prop" : "attr"]("checked", c)
                            },
                            qa = function(c, e) {
                                var d = "",
                                    g = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
                                    k = "",
                                    l, m, n, p, q = function(c) {
                                        var e;
                                        b.isFunction(a.p.onPaging) && (e = a.p.onPaging.call(a, c));
                                        if ("stop" === e) return !1;
                                        a.p.selrow = null;
                                        a.p.multiselect && (a.p.selarrrow = [], ha(!1));
                                        a.p.savedRow = [];
                                        return !0
                                    };
                                c = c.substr(1);
                                e += "_" + c;
                                l = "pg_" + c;
                                m = c + "_left";
                                n = c + "_center";
                                p = c + "_right";
                                b("#" + b.jgrid.jqID(c)).append("<div id='" + l + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" + m + "' align='left'></td><td id='" + n + "' align='center' style='white-space:pre;'></td><td id='" + p + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr");
                                if (0 < a.p.rowList.length) {
                                    k = "<td dir='" + f +
                                        "'>";
                                    k += "<select class='ui-pg-selbox' role='listbox'>";
                                    for (m = 0; m < a.p.rowList.length; m++) k += '<option role="option" value="' + a.p.rowList[m] + '"' + (a.p.rowNum === a.p.rowList[m] ? ' selected="selected"' : "") + ">" + a.p.rowList[m] + "</option>";
                                    k += "</select></td>"
                                }
                                "rtl" === f && (g += k);
                                !0 === a.p.pginput && (d = "<td dir='" + f + "'>" + b.jgrid.format(a.p.pgtext || "", "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>", "<span id='sp_1_" + b.jgrid.jqID(c) + "'></span>") + "</td>");
                                !0 === a.p.pgbuttons ?
                                    (m = ["first" + e, "prev" + e, "next" + e, "last" + e], "rtl" === f && m.reverse(), g += "<td id='" + m[0] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>", g += "<td id='" + m[1] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>", g = g + ("" !== d ? "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" + d + "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" :
                                            "") + ("<td id='" + m[2] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>"), g += "<td id='" + m[3] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>") : "" !== d && (g += d);
                                "ltr" === f && (g += k);
                                g += "</tr></tbody></table>";
                                !0 === a.p.viewrecords && b("td#" + c + "_" + a.p.recordpos, "#" + l).append("<div dir='" + f + "' style='text-align:" + a.p.recordpos + "' class='ui-paging-info'></div>");
                                b("td#" + c + "_" + a.p.pagerpos, "#" + l).append(g);
                                k = b(".ui-jqgrid").css("font-size") ||
                                    "11px";
                                b(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + k + ";visibility:hidden;' ></div>");
                                g = b(g).clone().appendTo("#testpg").width();
                                b("#testpg").remove();
                                0 < g && ("" !== d && (g += 50), b("td#" + c + "_" + a.p.pagerpos, "#" + l).width(g));
                                a.p._nvtd = [];
                                a.p._nvtd[0] = g ? Math.floor((a.p.width - g) / 2) : Math.floor(a.p.width / 3);
                                a.p._nvtd[1] = 0;
                                g = null;
                                b(".ui-pg-selbox", "#" + l).bind("change", function() {
                                    if (!q("records")) return !1;
                                    a.p.page = Math.round(a.p.rowNum * (a.p.page - 1) /
                                            this.value - 0.5) + 1;
                                    a.p.rowNum = this.value;
                                    a.p.pager && b(".ui-pg-selbox", a.p.pager).val(this.value);
                                    a.p.toppager && b(".ui-pg-selbox", a.p.toppager).val(this.value);
                                    Q();
                                    return !1
                                });
                                !0 === a.p.pgbuttons && (b(".ui-pg-button", "#" + l).hover(function() {
                                    b(this).hasClass("ui-state-disabled") ? this.style.cursor = "default" : (b(this).addClass("ui-state-hover"), this.style.cursor = "pointer")
                                }, function() {
                                    b(this).hasClass("ui-state-disabled") || (b(this).removeClass("ui-state-hover"), this.style.cursor = "default")
                                }), b("#first" + b.jgrid.jqID(e) +
                                    ", #prev" + b.jgrid.jqID(e) + ", #next" + b.jgrid.jqID(e) + ", #last" + b.jgrid.jqID(e)).click(function() {
                                    if (b(this).hasClass("ui-state-disabled")) return !1;
                                    var c = r(a.p.page, 1),
                                        d = r(a.p.lastpage, 1),
                                        g = !1,
                                        f = !0,
                                        h = !0,
                                        k = !0,
                                        l = !0;
                                    0 === d || 1 === d ? l = k = h = f = !1 : 1 < d && 1 <= c ? 1 === c ? h = f = !1 : c === d && (l = k = !1) : 1 < d && 0 === c && (l = k = !1, c = d - 1);
                                    if (!q(this.id)) return !1;
                                    this.id === "first" + e && f && (a.p.page = 1, g = !0);
                                    this.id === "prev" + e && h && (a.p.page = c - 1, g = !0);
                                    this.id === "next" + e && k && (a.p.page = c + 1, g = !0);
                                    this.id === "last" + e && l && (a.p.page = d, g = !0);
                                    g && Q();
                                    return !1
                                }));
                                !0 === a.p.pginput && b("input.ui-pg-input", "#" + l).keypress(function(c) {
                                    if (13 === (c.charCode || c.keyCode || 0)) {
                                        if (!q("user")) return !1;
                                        b(this).val(r(b(this).val(), 1));
                                        a.p.page = 0 < b(this).val() ? b(this).val() : a.p.page;
                                        Q();
                                        return !1
                                    }
                                    return this
                                })
                            },
                            wa = function(c, e) {
                                var d, g = "",
                                    f = a.p.colModel,
                                    h = !1,
                                    k;
                                k = a.p.frozenColumns ? e : a.grid.headers[c].el;
                                var l = "";
                                b("span.ui-grid-ico-sort", k).addClass("ui-state-disabled");
                                b(k).attr("aria-selected", "false");
                                if (f[c].lso)
                                    if ("asc" === f[c].lso) f[c].lso += "-desc", l = "desc";
                                    else if ("desc" === f[c].lso) f[c].lso += "-asc", l = "asc";
                                    else {
                                        if ("asc-desc" === f[c].lso || "desc-asc" === f[c].lso) f[c].lso = ""
                                    } else f[c].lso = l = f[c].firstsortorder || "asc";
                                l ? (b("span.s-ico", k).show(), b("span.ui-icon-" + l, k).removeClass("ui-state-disabled"), b(k).attr("aria-selected", "true")) : a.p.viewsortcols[0] || b("span.s-ico", k).hide();
                                a.p.sortorder = "";
                                b.each(f, function(b) {
                                    this.lso && (0 < b && h && (g += ", "), d = this.lso.split("-"), g += f[b].index || f[b].name, g += " " + d[d.length - 1], h = !0, a.p.sortorder = d[d.length - 1])
                                });
                                k = g.lastIndexOf(a.p.sortorder);
                                g = g.substring(0, k);
                                a.p.sortname = g
                            },
                            ra = function(c, d, e, g, f) {
                                if (a.p.colModel[d].sortable && !(0 < a.p.savedRow.length)) {
                                    e || (a.p.lastsort === d ? "asc" === a.p.sortorder ? a.p.sortorder = "desc" : "desc" === a.p.sortorder && (a.p.sortorder = "asc") : a.p.sortorder = a.p.colModel[d].firstsortorder || "asc", a.p.page = 1);
                                    if (a.p.multiSort) wa(d, f);
                                    else {
                                        if (g) {
                                            if (a.p.lastsort === d && a.p.sortorder === g && !e) return;
                                            a.p.sortorder = g
                                        }
                                        e = a.grid.headers[a.p.lastsort].el;
                                        f = a.p.frozenColumns ? f : a.grid.headers[d].el;
                                        b("span.ui-grid-ico-sort", e).addClass("ui-state-disabled");
                                        b(e).attr("aria-selected", "false");
                                        a.p.frozenColumns && (a.grid.fhDiv.find("span.ui-grid-ico-sort").addClass("ui-state-disabled"), a.grid.fhDiv.find("th").attr("aria-selected", "false"));
                                        b("span.ui-icon-" + a.p.sortorder, f).removeClass("ui-state-disabled");
                                        b(f).attr("aria-selected", "true");
                                        a.p.viewsortcols[0] || a.p.lastsort === d || (a.p.frozenColumns && a.grid.fhDiv.find("span.s-ico").hide(), b("span.s-ico", e).hide(), b("span.s-ico", f).show());
                                        c = c.substring(5 + a.p.id.length + 1);
                                        a.p.sortname = a.p.colModel[d].index ||
                                            c
                                    }
                                    "stop" === b(a).triggerHandler("jqGridSortCol", [a.p.sortname, d, a.p.sortorder]) ? a.p.lastsort = d : b.isFunction(a.p.onSortCol) && "stop" === a.p.onSortCol.call(a, a.p.sortname, d, a.p.sortorder) ? a.p.lastsort = d : ("local" === a.p.datatype ? a.p.deselectAfterSort && b(a).jqGrid("resetSelection") : (a.p.selrow = null, a.p.multiselect && ha(!1), a.p.selarrrow = [], a.p.savedRow = []), a.p.scroll && (f = a.grid.bDiv.scrollLeft, X.call(a, !0, !1), a.grid.hDiv.scrollLeft = f), a.p.subGrid && "local" === a.p.datatype && b("td.sgexpanded", "#" + b.jgrid.jqID(a.p.id)).each(function() {
                                        b(this).trigger("click")
                                    }),
                                        Q(), a.p.lastsort = d, a.p.sortname !== c && d && (a.p.lastsort = d))
                                }
                            },
                            xa = function(c) {
                                c = b(a.grid.headers[c].el);
                                c = [c.position().left + c.outerWidth()];
                                "rtl" === a.p.direction && (c[0] = a.p.width - c[0]);
                                c[0] -= a.grid.bDiv.scrollLeft;
                                c.push(b(a.grid.hDiv).position().top);
                                c.push(b(a.grid.bDiv).offset().top - b(a.grid.hDiv).offset().top + b(a.grid.bDiv).height());
                                return c
                            },
                            sa = function(c) {
                                var d, e = a.grid.headers,
                                    g = b.jgrid.getCellIndex(c);
                                for (d = 0; d < e.length; d++)
                                    if (c === e[d].el) {
                                        g = d;
                                        break
                                    }
                                return g
                            };
                        this.p.id = this.id; - 1 === b.inArray(a.p.multikey, ["shiftKey", "altKey", "ctrlKey"]) && (a.p.multikey = !1);
                        a.p.keyIndex = !1;
                        a.p.keyName = !1;
                        for (g = 0; g < a.p.colModel.length; g++) a.p.colModel[g] = b.extend(!0, {}, a.p.cmTemplate, a.p.colModel[g].template || {}, a.p.colModel[g]), !1 === a.p.keyIndex && !0 === a.p.colModel[g].key && (a.p.keyIndex = g);
                        a.p.sortorder = a.p.sortorder.toLowerCase();
                        b.jgrid.cell_width = b.jgrid.cellWidth();
                        !0 === a.p.grouping && (a.p.scroll = !1, a.p.rownumbers = !1, a.p.treeGrid = !1, a.p.gridview = !0);
                        if (!0 === this.p.treeGrid) {
                            try {
                                b(this).jqGrid("setTreeGrid")
                            } catch (za) {}
                            "local" !==
                            a.p.datatype && (a.p.localReader = {
                                id: "_id_"
                            })
                        }
                        if (this.p.subGrid) try {
                            b(a).jqGrid("setSubGrid")
                        } catch (Aa) {}
                        this.p.multiselect && (this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox'/>"), this.p.colModel.unshift({
                            name: "cb",
                            width: b.jgrid.cell_width ? a.p.multiselectWidth + a.p.cellLayout : a.p.multiselectWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            align: "center",
                            fixed: !0
                        }));
                        this.p.rownumbers && (this.p.colNames.unshift(""), this.p.colModel.unshift({
                            name: "rn",
                            width: a.p.rownumWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            align: "center",
                            fixed: !0
                        }));
                        a.p.xmlReader = b.extend(!0, {
                            root: "rows",
                            row: "row",
                            page: "rows>page",
                            total: "rows>total",
                            records: "rows>records",
                            repeatitems: !0,
                            cell: "cell",
                            id: "[id]",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                row: "row",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.xmlReader);
                        a.p.jsonReader = b.extend(!0, {
                                root: "rows",
                                page: "page",
                                total: "total",
                                records: "records",
                                repeatitems: !0,
                                cell: "cell",
                                id: "id",
                                userdata: "userdata",
                                subgrid: {
                                    root: "rows",
                                    repeatitems: !0,
                                    cell: "cell"
                                }
                            },
                            a.p.jsonReader);
                        a.p.localReader = b.extend(!0, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: !1,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.localReader);
                        a.p.scroll && (a.p.pgbuttons = !1, a.p.pginput = !1, a.p.rowList = []);
                        a.p.data.length && O();
                        var D = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
                            ta, F, ja, fa, ka, y, t, ba, ua = ba = "",
                            ga = [],
                            va = [];
                        F = [];
                        if (!0 === a.p.shrinkToFit && !0 === a.p.forceFit)
                            for (g = a.p.colModel.length - 1; 0 <= g; g--)
                                if (!a.p.colModel[g].hidden) {
                                    a.p.colModel[g].resizable = !1;
                                    break
                                }
                        "horizontal" === a.p.viewsortcols[1] && (ba = " ui-i-asc", ua = " ui-i-desc");
                        ta = n ? "class='ui-th-div-ie'" : "";
                        ba = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" + ba + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + f + "'></span>" + ("<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + ua + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + f + "'></span></span>");
                        if (a.p.multiSort)
                            for (ga = a.p.sortname.split(","), g = 0; g < ga.length; g++) F = b.trim(ga[g]).split(" "),
                                ga[g] = b.trim(F[0]), va[g] = F[1] ? b.trim(F[1]) : a.p.sortorder || "asc";
                        for (g = 0; g < this.p.colNames.length; g++) F = a.p.headertitles ? ' title="' + b.jgrid.stripHtml(a.p.colNames[g]) + '"' : "", D += "<th id='" + a.p.id + "_" + a.p.colModel[g].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + f + "'" + F + ">", F = a.p.colModel[g].index || a.p.colModel[g].name, D += "<div id='jqgh_" + a.p.id + "_" + a.p.colModel[g].name + "' " + ta + ">" + a.p.colNames[g], a.p.colModel[g].width = a.p.colModel[g].width ? parseInt(a.p.colModel[g].width, 10) :
                            150, "boolean" !== typeof a.p.colModel[g].title && (a.p.colModel[g].title = !0), a.p.colModel[g].lso = "", F === a.p.sortname && (a.p.lastsort = g), a.p.multiSort && (F = b.inArray(F, ga), -1 !== F && (a.p.colModel[g].lso = va[F])), D += ba + "</div></th>";
                        D += "</tr></thead>";
                        ba = null;
                        b(this).append(D);
                        b("thead tr:first th", this).hover(function() {
                            b(this).addClass("ui-state-hover")
                        }, function() {
                            b(this).removeClass("ui-state-hover")
                        });
                        if (this.p.multiselect) {
                            var la = [],
                                ca;
                            b("#cb_" + b.jgrid.jqID(a.p.id), this).bind("click", function() {
                                a.p.selarrrow = [];
                                var c = !0 === a.p.frozenColumns ? a.p.id + "_frozen" : "";
                                this.checked ? (b(a.rows).each(function(d) {
                                    0 < d && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("jqgroup") && !b(this).hasClass("ui-state-disabled") && (b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp ? "prop" : "attr"]("checked", !0), b(this).addClass("ui-state-highlight").attr("aria-selected", "true"), a.p.selarrrow.push(this.id), a.p.selrow = this.id, c && (b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp ?
                                        "prop" : "attr"]("checked", !0), b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).addClass("ui-state-highlight")))
                                }), ca = !0, la = []) : (b(a.rows).each(function(d) {
                                    0 < d && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("ui-state-disabled") && (b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp ? "prop" : "attr"]("checked", !1), b(this).removeClass("ui-state-highlight").attr("aria-selected", "false"), la.push(this.id), c && (b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp ?
                                        "prop" : "attr"]("checked", !1), b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).removeClass("ui-state-highlight")))
                                }), a.p.selrow = null, ca = !1);
                                b(a).triggerHandler("jqGridSelectAll", [ca ? a.p.selarrrow : la, ca]);
                                b.isFunction(a.p.onSelectAll) && a.p.onSelectAll.call(a, ca ? a.p.selarrrow : la, ca)
                            })
                        }!0 === a.p.autowidth && (D = b(m).innerWidth(), a.p.width = 0 < D ? D : "nw");
                        (function() {
                            var d = 0,
                                e = b.jgrid.cell_width ? 0 : r(a.p.cellLayout, 0),
                                g = 0,
                                f, h = r(a.p.scrollOffset, 0),
                                k, m = !1,
                                n, p = 0,
                                q;
                            b.each(a.p.colModel, function() {
                                void 0 === this.hidden && (this.hidden = !1);
                                if (a.p.grouping && a.p.autowidth) {
                                    var c = b.inArray(this.name, a.p.groupingView.groupField);
                                    0 <= c && a.p.groupingView.groupColumnShow.length > c && (this.hidden = !a.p.groupingView.groupColumnShow[c])
                                }
                                this.widthOrg = k = r(this.width, 0);
                                !1 === this.hidden && (d += k + e, this.fixed ? p += k + e : g++)
                            });
                            isNaN(a.p.width) && (a.p.width = d + (!1 !== a.p.shrinkToFit || isNaN(a.p.height) ? 0 : h));
                            c.width = a.p.width;
                            a.p.tblwidth = d;
                            !1 === a.p.shrinkToFit && !0 === a.p.forceFit && (a.p.forceFit = !1);
                            !0 === a.p.shrinkToFit && 0 < g && (n = c.width - e * g - p, isNaN(a.p.height) ||
                            (n -= h, m = !0), d = 0, b.each(a.p.colModel, function(b) {
                                !1 !== this.hidden || this.fixed || (this.width = k = Math.round(n * this.width / (a.p.tblwidth - e * g - p)), d += k, f = b)
                            }), q = 0, m ? c.width - p - (d + e * g) !== h && (q = c.width - p - (d + e * g) - h) : m || 1 === Math.abs(c.width - p - (d + e * g)) || (q = c.width - p - (d + e * g)), a.p.colModel[f].width += q, a.p.tblwidth = d + q + e * g + p, a.p.tblwidth > a.p.width && (a.p.colModel[f].width -= a.p.tblwidth - parseInt(a.p.width, 10), a.p.tblwidth = a.p.width))
                        })();
                        b(m).css("width", c.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" +
                            a.p.id + "'>&#160;</div>");
                        b(k).css("width", c.width + "px");
                        var D = b("thead:first", a).get(0),
                            V = "";
                        a.p.footerrow && (V += "<table role='grid' style='width:" + a.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" + f + "'>");
                        var k = b("tr:first", D),
                            da = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
                        a.p.disableClick = !1;
                        b("th", k).each(function(d) {
                            ja = a.p.colModel[d].width;
                            void 0 === a.p.colModel[d].resizable && (a.p.colModel[d].resizable = !0);
                            a.p.colModel[d].resizable ? (fa = document.createElement("span"), b(fa).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-" + f).css("cursor", "col-resize"), b(this).addClass(a.p.resizeclass)) : fa = "";
                            b(this).css("width", ja + "px").prepend(fa);
                            fa = null;
                            var e = "";
                            a.p.colModel[d].hidden && (b(this).css("display", "none"), e = "display:none;");
                            da += "<td role='gridcell' style='height:0px;width:" + ja + "px;" + e + "'></td>";
                            c.headers[d] = {
                                width: ja,
                                el: this
                            };
                            ka = a.p.colModel[d].sortable;
                            "boolean" !== typeof ka && (ka = a.p.colModel[d].sortable = !0);
                            e = a.p.colModel[d].name;
                            "cb" !== e && "subgrid" !== e && "rn" !== e && a.p.viewsortcols[2] && b(">div", this).addClass("ui-jqgrid-sortable");
                            ka && (a.p.multiSort ? a.p.viewsortcols[0] ? (b("div span.s-ico", this).show(), a.p.colModel[d].lso && b("div span.ui-icon-" + a.p.colModel[d].lso, this).removeClass("ui-state-disabled")) : a.p.colModel[d].lso && (b("div span.s-ico", this).show(), b("div span.ui-icon-" + a.p.colModel[d].lso, this).removeClass("ui-state-disabled")) : a.p.viewsortcols[0] ? (b("div span.s-ico", this).show(), d === a.p.lastsort &&
                            b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled")) : d === a.p.lastsort && (b("div span.s-ico", this).show(), b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled")));
                            a.p.footerrow && (V += "<td role='gridcell' " + p(d, 0, "", null, "", !1) + ">&#160;</td>")
                        }).mousedown(function(d) {
                            if (1 === b(d.target).closest("th>span.ui-jqgrid-resize").length) {
                                var e = sa(this);
                                if (!0 === a.p.forceFit) {
                                    var g = a.p,
                                        f = e,
                                        h;
                                    for (h = e + 1; h < a.p.colModel.length; h++)
                                        if (!0 !== a.p.colModel[h].hidden) {
                                            f = h;
                                            break
                                        }
                                    g.nv =
                                        f - e
                                }
                                c.dragStart(e, d, xa(e));
                                return !1
                            }
                        }).click(function(c) {
                            if (a.p.disableClick) return a.p.disableClick = !1;
                            var d = "th>div.ui-jqgrid-sortable",
                                e, g;
                            a.p.viewsortcols[2] || (d = "th>div>span>span.ui-grid-ico-sort");
                            c = b(c.target).closest(d);
                            if (1 === c.length) {
                                var f;
                                if (a.p.frozenColumns) {
                                    var h = b(this)[0].id.substring(a.p.id.length + 1);
                                    b(a.p.colModel).each(function(a) {
                                        if (this.name === h) return f = a, !1
                                    })
                                } else f = sa(this);
                                a.p.viewsortcols[2] || (e = !0, g = c.attr("sort"));
                                null != f && ra(b("div", this)[0].id, f, e, g, this);
                                return !1
                            }
                        });
                        if (a.p.sortable && b.fn.sortable) try {
                            b(a).jqGrid("sortableColumns", k)
                        } catch (Ba) {}
                        a.p.footerrow && (V += "</tr></tbody></table>");
                        da += "</tr>";
                        k = document.createElement("tbody");
                        this.appendChild(k);
                        b(this).addClass("ui-jqgrid-btable").append(da);
                        var da = null,
                            k = b("<table class='ui-jqgrid-htable' style='width:" + a.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(D),
                            J = a.p.caption && !0 === a.p.hiddengrid ? !0 : !1;
                        g = b("<div class='ui-jqgrid-hbox" +
                            ("rtl" === f ? "-rtl" : "") + "'></div>");
                        D = null;
                        c.hDiv = document.createElement("div");
                        b(c.hDiv).css({
                            width: c.width + "px"
                        }).addClass("ui-state-default ui-jqgrid-hdiv").append(g);
                        b(g).append(k);
                        k = null;
                        J && b(c.hDiv).hide();
                        a.p.pager && ("string" === typeof a.p.pager ? "#" !== a.p.pager.substr(0, 1) && (a.p.pager = "#" + a.p.pager) : a.p.pager = "#" + b(a.p.pager).attr("id"), b(a.p.pager).css({
                            width: c.width + "px"
                        }).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom").appendTo(m), J && b(a.p.pager).hide(), qa(a.p.pager, ""));
                        !1 ===
                        a.p.cellEdit && !0 === a.p.hoverrows && b(a).bind("mouseover", function(a) {
                            t = b(a.target).closest("tr.jqgrow");
                            "ui-subgrid" !== b(t).attr("class") && b(t).addClass("ui-state-hover")
                        }).bind("mouseout", function(a) {
                            t = b(a.target).closest("tr.jqgrow");
                            b(t).removeClass("ui-state-hover")
                        });
                        var B, N, ma;
                        b(a).before(c.hDiv).click(function(c) {
                            y = c.target;
                            t = b(y, a.rows).closest("tr.jqgrow");
                            if (0 === b(t).length || -1 < t[0].className.indexOf("ui-state-disabled") || (b(y, a).closest("table.ui-jqgrid-btable").attr("id") || "").replace("_frozen",
                                    "") !== a.id) return this;
                            var d = b(y).hasClass("cbox"),
                                e = b(a).triggerHandler("jqGridBeforeSelectRow", [t[0].id, c]);
                            (e = !1 === e || "stop" === e ? !1 : !0) && b.isFunction(a.p.beforeSelectRow) && (e = a.p.beforeSelectRow.call(a, t[0].id, c));
                            if ("A" !== y.tagName && ("INPUT" !== y.tagName && "TEXTAREA" !== y.tagName && "OPTION" !== y.tagName && "SELECT" !== y.tagName || d) && !0 === e)
                                if (B = t[0].id, N = b.jgrid.getCellIndex(y), ma = b(y).closest("td,th").html(), b(a).triggerHandler("jqGridCellSelect", [B, N, ma, c]), b.isFunction(a.p.onCellSelect) && a.p.onCellSelect.call(a,
                                        B, N, ma, c), !0 === a.p.cellEdit)
                                    if (a.p.multiselect && d) b(a).jqGrid("setSelection", B, !0, c);
                                    else {
                                        B = t[0].rowIndex;
                                        try {
                                            b(a).jqGrid("editCell", B, N, !0)
                                        } catch (g) {}
                                    } else if (a.p.multikey) c[a.p.multikey] ? b(a).jqGrid("setSelection", B, !0, c) : a.p.multiselect && d && (d = b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + B).is(":checked"), b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + B)[a.p.useProp ? "prop" : "attr"]("checked", d));
                                else {
                                    if (a.p.multiselect && a.p.multiboxonly && !d) {
                                        var f = a.p.frozenColumns ? a.p.id + "_frozen" : "";
                                        b(a.p.selarrrow).each(function(c,
                                                                       d) {
                                            var e = b(a).jqGrid("getGridRowById", d);
                                            b(e).removeClass("ui-state-highlight");
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d))[a.p.useProp ? "prop" : "attr"]("checked", !1);
                                            f && (b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(f)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(f))[a.p.useProp ? "prop" : "attr"]("checked", !1))
                                        });
                                        a.p.selarrrow = []
                                    }
                                    b(a).jqGrid("setSelection", B, !0, c)
                                }
                        }).bind("reloadGrid", function(c, d) {
                            !0 === a.p.treeGrid && (a.p.datatype = a.p.treedatatype);
                            d && d.current && a.grid.selectionPreserver(a);
                            "local" === a.p.datatype ? (b(a).jqGrid("resetSelection"), a.p.data.length && O()) : a.p.treeGrid || (a.p.selrow = null, a.p.multiselect && (a.p.selarrrow = [], ha(!1)), a.p.savedRow = []);
                            a.p.scroll && X.call(a, !0, !1);
                            if (d && d.page) {
                                var e = d.page;
                                e > a.p.lastpage && (e = a.p.lastpage);
                                1 > e && (e = 1);
                                a.p.page = e;
                                a.grid.bDiv.scrollTop = a.grid.prevRowHeight ? (e - 1) * a.grid.prevRowHeight * a.p.rowNum : 0
                            }
                            a.grid.prevRowHeight && a.p.scroll ? (delete a.p.lastpage, a.grid.populateVisible()) : a.grid.populate();
                            !0 === a.p._inlinenav && b(a).jqGrid("showAddEditButtons");
                            return !1
                        }).dblclick(function(c) {
                            y = c.target;
                            t = b(y, a.rows).closest("tr.jqgrow");
                            0 !== b(t).length && (B = t[0].rowIndex, N = b.jgrid.getCellIndex(y), b(a).triggerHandler("jqGridDblClickRow", [b(t).attr("id"), B, N, c]), b.isFunction(a.p.ondblClickRow) && a.p.ondblClickRow.call(a, b(t).attr("id"), B, N, c))
                        }).bind("contextmenu", function(c) {
                            y = c.target;
                            t = b(y, a.rows).closest("tr.jqgrow");
                            0 !== b(t).length && (a.p.multiselect || b(a).jqGrid("setSelection", t[0].id, !0, c), B = t[0].rowIndex,
                                N = b.jgrid.getCellIndex(y), b(a).triggerHandler("jqGridRightClickRow", [b(t).attr("id"), B, N, c]), b.isFunction(a.p.onRightClickRow) && a.p.onRightClickRow.call(a, b(t).attr("id"), B, N, c))
                        });
                        c.bDiv = document.createElement("div");
                        n && "auto" === String(a.p.height).toLowerCase() && (a.p.height = "100%");
                        b(c.bDiv).append(b('<div style="position:relative;' + (n && 8 > b.jgrid.msiever() ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({
                            height: a.p.height + (isNaN(a.p.height) ? "" : "px"),
                            width: c.width + "px"
                        }).scroll(c.scrollGrid);
                        b("table:first", c.bDiv).css({
                            width: a.p.tblwidth + "px"
                        });
                        b.support.tbody || 2 === b("tbody", this).length && b("tbody:gt(0)", this).remove();
                        a.p.multikey && (b.jgrid.msie ? b(c.bDiv).bind("selectstart", function() {
                            return !1
                        }) : b(c.bDiv).bind("mousedown", function() {
                            return !1
                        }));
                        J && b(c.bDiv).hide();
                        c.cDiv = document.createElement("div");
                        var na = !0 === a.p.hidegrid ? b("<a role='link' class='ui-jqgrid-titlebar-close ui-corner-all HeaderButton' />").hover(function() {
                                na.addClass("ui-state-hover")
                            },
                            function() {
                                na.removeClass("ui-state-hover")
                            }).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css("rtl" === f ? "left" : "right", "0px") : "";
                        b(c.cDiv).append(na).append("<span class='ui-jqgrid-title'>" + a.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-jqgrid-caption" + ("rtl" === f ? "-rtl" : "") + " ui-widget-header ui-corner-top ui-helper-clearfix");
                        b(c.cDiv).insertBefore(c.hDiv);
                        a.p.toolbar[0] && (c.uDiv = document.createElement("div"), "top" === a.p.toolbar[1] ? b(c.uDiv).insertBefore(c.hDiv) : "bottom" ===
                            a.p.toolbar[1] && b(c.uDiv).insertAfter(c.hDiv), "both" === a.p.toolbar[1] ? (c.ubDiv = document.createElement("div"), b(c.uDiv).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id).insertBefore(c.hDiv), b(c.ubDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id).insertAfter(c.hDiv), J && b(c.ubDiv).hide()) : b(c.uDiv).width(c.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id), J && b(c.uDiv).hide());
                        a.p.toppager && (a.p.toppager = b.jgrid.jqID(a.p.id) + "_toppager", c.topDiv =
                            b("<div id='" + a.p.toppager + "'></div>")[0], a.p.toppager = "#" + a.p.toppager, b(c.topDiv).addClass("ui-state-default ui-jqgrid-toppager").width(c.width).insertBefore(c.hDiv), qa(a.p.toppager, "_t"));
                        a.p.footerrow && (c.sDiv = b("<div class='ui-jqgrid-sdiv'></div>")[0], g = b("<div class='ui-jqgrid-hbox" + ("rtl" === f ? "-rtl" : "") + "'></div>"), b(c.sDiv).append(g).width(c.width).insertAfter(c.hDiv), b(g).append(V), c.footers = b(".ui-jqgrid-ftable", c.sDiv)[0].rows[0].cells, a.p.rownumbers && (c.footers[0].className = "ui-state-default jqgrid-rownum"),
                        J && b(c.sDiv).hide());
                        g = null;
                        if (a.p.caption) {
                            var ya = a.p.datatype;
                            !0 === a.p.hidegrid && (b(".ui-jqgrid-titlebar-close", c.cDiv).click(function(d) {
                                var e = b.isFunction(a.p.onHeaderClick),
                                    g = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
                                    f, h = this;
                                !0 === a.p.toolbar[0] && ("both" === a.p.toolbar[1] && (g += ", #" + b(c.ubDiv).attr("id")), g += ", #" + b(c.uDiv).attr("id"));
                                f = b(g, "#gview_" + b.jgrid.jqID(a.p.id)).length;
                                "visible" === a.p.gridstate ? b(g, "#gbox_" + b.jgrid.jqID(a.p.id)).slideUp("fast", function() {
                                    f--;
                                    0 === f && (b("span", h).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"), a.p.gridstate = "hidden", b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).hide(), b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, d]), e && (J || a.p.onHeaderClick.call(a, a.p.gridstate, d)))
                                }) : "hidden" === a.p.gridstate && b(g, "#gbox_" + b.jgrid.jqID(a.p.id)).slideDown("fast", function() {
                                        f--;
                                        0 === f && (b("span", h).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"),
                                        J && (a.p.datatype = ya, Q(), J = !1), a.p.gridstate = "visible", b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).show(), b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, d]), e && (J || a.p.onHeaderClick.call(a, a.p.gridstate, d)))
                                    });
                                return !1
                            }), J && (a.p.datatype = "local", b(".ui-jqgrid-titlebar-close", c.cDiv).trigger("click")))
                        } else b(c.cDiv).hide();
                        b(c.hDiv).after(c.bDiv).mousemove(function(a) {
                            if (c.resizing) return c.dragMove(a), !1
                        });
                        b(".ui-jqgrid-labels",
                            c.hDiv).bind("selectstart", function() {
                            return !1
                        });
                        b(document).bind("mouseup.jqGrid" + a.p.id, function() {
                            return c.resizing ? (c.dragEnd(), !1) : !0
                        });
                        a.formatCol = p;
                        a.sortData = ra;
                        a.updatepager = function(c, d) {
                            var e, g, f, h, k, l, m, n = "",
                                p = a.p.pager ? "_" + b.jgrid.jqID(a.p.pager.substr(1)) : "",
                                q = a.p.toppager ? "_" + a.p.toppager.substr(1) : "";
                            f = parseInt(a.p.page, 10) - 1;
                            0 > f && (f = 0);
                            f *= parseInt(a.p.rowNum, 10);
                            k = f + a.p.reccount;
                            if (a.p.scroll) {
                                e = b("tbody:first > tr:gt(0)", a.grid.bDiv);
                                f = k - e.length;
                                a.p.reccount = e.length;
                                if (e = e.outerHeight() ||
                                        a.grid.prevRowHeight) g = f * e, m = parseInt(a.p.records, 10) * e, b(">div:first", a.grid.bDiv).css({
                                    height: m
                                }).children("div:first").css({
                                    height: g,
                                    display: g ? "" : "none"
                                }), 0 == a.grid.bDiv.scrollTop && 1 < a.p.page && (a.grid.bDiv.scrollTop = a.p.rowNum * (a.p.page - 1) * e);
                                a.grid.bDiv.scrollLeft = a.grid.hDiv.scrollLeft
                            }
                            n = a.p.pager || "";
                            if (n += a.p.toppager ? n ? "," + a.p.toppager : a.p.toppager : "") m = b.jgrid.formatter.integer || {}, e = r(a.p.page), g = r(a.p.lastpage), b(".selbox", n)[this.p.useProp ? "prop" : "attr"]("disabled", !1), !0 === a.p.pginput &&
                            (b(".ui-pg-input", n).val(a.p.page), h = a.p.toppager ? "#sp_1" + p + ",#sp_1" + q : "#sp_1" + p, b(h).html(b.fmatter ? b.fmatter.util.NumberFormat(a.p.lastpage, m) : a.p.lastpage)), a.p.viewrecords && (0 === a.p.reccount ? b(".ui-paging-info", n).html(a.p.emptyrecords) : (h = f + 1, l = a.p.records, b.fmatter && (h = b.fmatter.util.NumberFormat(h, m), k = b.fmatter.util.NumberFormat(k, m), l = b.fmatter.util.NumberFormat(l, m)), b(".ui-paging-info", n).html(b.jgrid.format(a.p.recordtext, h, k, l)))), !0 === a.p.pgbuttons && (0 >= e && (e = g = 0), 1 === e || 0 === e ? (b("#first" +
                                p + ", #prev" + p).addClass("ui-state-disabled").removeClass("ui-state-hover"), a.p.toppager && b("#first_t" + q + ", #prev_t" + q).addClass("ui-state-disabled").removeClass("ui-state-hover")) : (b("#first" + p + ", #prev" + p).removeClass("ui-state-disabled"), a.p.toppager && b("#first_t" + q + ", #prev_t" + q).removeClass("ui-state-disabled")), e === g || 0 === e ? (b("#next" + p + ", #last" + p).addClass("ui-state-disabled").removeClass("ui-state-hover"), a.p.toppager && b("#next_t" + q + ", #last_t" + q).addClass("ui-state-disabled").removeClass("ui-state-hover")) :
                                (b("#next" + p + ", #last" + p).removeClass("ui-state-disabled"), a.p.toppager && b("#next_t" + q + ", #last_t" + q).removeClass("ui-state-disabled")));
                            !0 === c && !0 === a.p.rownumbers && b(">td.jqgrid-rownum", a.rows).each(function(a) {
                                b(this).html(f + 1 + a)
                            });
                            d && a.p.jqgdnd && b(a).jqGrid("gridDnD", "updateDnD");
                            b(a).triggerHandler("jqGridGridComplete");
                            b.isFunction(a.p.gridComplete) && a.p.gridComplete.call(a);
                            b(a).triggerHandler("jqGridAfterGridComplete")
                        };
                        a.refreshIndex = O;
                        a.setHeadCheckBox = ha;
                        a.constructTr = $;
                        a.formatter = function(a,
                                               b, c, d, e) {
                            return x(a, b, c, d, e)
                        };
                        b.extend(c, {
                            populate: Q,
                            emptyRows: X,
                            beginReq: P,
                            endReq: T
                        });
                        this.grid = c;
                        a.addXmlData = function(b) {
                            K(b, a.grid.bDiv)
                        };
                        a.addJSONData = function(b) {
                            Y(b, a.grid.bDiv)
                        };
                        this.grid.cols = this.rows[0].cells;
                        b(a).triggerHandler("jqGridInitGrid");
                        b.isFunction(a.p.onInitGrid) && a.p.onInitGrid.call(a);
                        Q();
                        a.p.hiddengrid = !1
                    }
                }
            }
        })
    };
    b.jgrid.extend({
        getGridParam: function(b) {
            var f = this[0];
            if (f && f.grid) return b ? void 0 !== f.p[b] ? f.p[b] : null : f.p
        },
        setGridParam: function(e) {
            return this.each(function() {
                this.grid &&
                "object" === typeof e && b.extend(!0, this.p, e)
            })
        },
        getGridRowById: function(e) {
            var f;
            this.each(function() {
                try {
                    for (var c = this.rows.length; c--;)
                        if (e.toString() === this.rows[c].id) {
                            f = this.rows[c];
                            break
                        }
                } catch (d) {
                    f = b(this.grid.bDiv).find("#" + b.jgrid.jqID(e))
                }
            });
            return f
        },
        getDataIDs: function() {
            var e = [],
                f = 0,
                c, d = 0;
            this.each(function() {
                if ((c = this.rows.length) && 0 < c)
                    for (; f < c;) b(this.rows[f]).hasClass("jqgrow") && (e[d] = this.rows[f].id, d++), f++
            });
            return e
        },
        setSelection: function(e, f, c) {
            return this.each(function() {
                var d,
                    a, l, g, h, k;
                void 0 !== e && (f = !1 === f ? !1 : !0, !(a = b(this).jqGrid("getGridRowById", e)) || !a.className || -1 < a.className.indexOf("ui-state-disabled") || (!0 === this.p.scrollrows && (l = b(this).jqGrid("getGridRowById", e).rowIndex, 0 <= l && (d = b(this.grid.bDiv)[0].clientHeight, g = b(this.grid.bDiv)[0].scrollTop, h = b(this.rows[l]).position().top, l = this.rows[l].clientHeight, h + l >= d + g ? b(this.grid.bDiv)[0].scrollTop = h - (d + g) + l + g : h < d + g && h < g && (b(this.grid.bDiv)[0].scrollTop = h))), !0 === this.p.frozenColumns && (k = this.p.id + "_frozen"), this.p.multiselect ?
                    (this.setHeadCheckBox(!1), this.p.selrow = a.id, g = b.inArray(this.p.selrow, this.p.selarrrow), -1 === g ? ("ui-subgrid" !== a.className && b(a).addClass("ui-state-highlight").attr("aria-selected", "true"), d = !0, this.p.selarrrow.push(this.p.selrow)) : ("ui-subgrid" !== a.className && b(a).removeClass("ui-state-highlight").attr("aria-selected", "false"), d = !1, this.p.selarrrow.splice(g, 1), h = this.p.selarrrow[0], this.p.selrow = void 0 === h ? null : h), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(a.id))[this.p.useProp ? "prop" : "attr"]("checked",
                        d), k && (-1 === g ? b("#" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(k)).addClass("ui-state-highlight") : b("#" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(k)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(k))[this.p.useProp ? "prop" : "attr"]("checked", d)), f && (b(this).triggerHandler("jqGridSelectRow", [a.id, d, c]), this.p.onSelectRow && this.p.onSelectRow.call(this, a.id, d, c))) : "ui-subgrid" !== a.className && (this.p.selrow !== a.id ? (b(b(this).jqGrid("getGridRowById", this.p.selrow)).removeClass("ui-state-highlight").attr({
                        "aria-selected": "false",
                        tabindex: "-1"
                    }), b(a).addClass("ui-state-highlight").attr({
                        "aria-selected": "true",
                        tabindex: "0"
                    }), k && (b("#" + b.jgrid.jqID(this.p.selrow), "#" + b.jgrid.jqID(k)).removeClass("ui-state-highlight"), b("#" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(k)).addClass("ui-state-highlight")), d = !0) : d = !1, this.p.selrow = a.id, f && (b(this).triggerHandler("jqGridSelectRow", [a.id, d, c]), this.p.onSelectRow && this.p.onSelectRow.call(this, a.id, d, c)))))
            })
        },
        resetSelection: function(e) {
            return this.each(function() {
                var f = this,
                    c, d;
                !0 === f.p.frozenColumns &&
                (d = f.p.id + "_frozen");
                if (void 0 !== e) {
                    c = e === f.p.selrow ? f.p.selrow : e;
                    b("#" + b.jgrid.jqID(f.p.id) + " tbody:first tr#" + b.jgrid.jqID(c)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                    d && b("#" + b.jgrid.jqID(c), "#" + b.jgrid.jqID(d)).removeClass("ui-state-highlight");
                    if (f.p.multiselect) {
                        b("#jqg_" + b.jgrid.jqID(f.p.id) + "_" + b.jgrid.jqID(c), "#" + b.jgrid.jqID(f.p.id))[f.p.useProp ? "prop" : "attr"]("checked", !1);
                        if (d) b("#jqg_" + b.jgrid.jqID(f.p.id) + "_" + b.jgrid.jqID(c), "#" + b.jgrid.jqID(d))[f.p.useProp ? "prop" :
                            "attr"]("checked", !1);
                        f.setHeadCheckBox(!1)
                    }
                    c = null
                } else f.p.multiselect ? (b(f.p.selarrrow).each(function(a, c) {
                    b(b(f).jqGrid("getGridRowById", c)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                    b("#jqg_" + b.jgrid.jqID(f.p.id) + "_" + b.jgrid.jqID(c))[f.p.useProp ? "prop" : "attr"]("checked", !1);
                    d && (b("#" + b.jgrid.jqID(c), "#" + b.jgrid.jqID(d)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(f.p.id) + "_" + b.jgrid.jqID(c), "#" + b.jgrid.jqID(d))[f.p.useProp ? "prop" : "attr"]("checked", !1))
                }), f.setHeadCheckBox(!1),
                    f.p.selarrrow = [], f.p.selrow = null) : f.p.selrow && (b("#" + b.jgrid.jqID(f.p.id) + " tbody:first tr#" + b.jgrid.jqID(f.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false"), d && b("#" + b.jgrid.jqID(f.p.selrow), "#" + b.jgrid.jqID(d)).removeClass("ui-state-highlight"), f.p.selrow = null);
                !0 === f.p.cellEdit && 0 <= parseInt(f.p.iCol, 10) && 0 <= parseInt(f.p.iRow, 10) && (b("td:eq(" + f.p.iCol + ")", f.rows[f.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(f.rows[f.p.iRow]).removeClass("selected-row ui-state-hover"));
                f.p.savedRow = []
            })
        },
        getRowData: function(e) {
            var f = {},
                c, d = !1,
                a, l = 0;
            this.each(function() {
                var g = this,
                    h, k;
                if (void 0 === e) d = !0, c = [], a = g.rows.length;
                else {
                    k = b(g).jqGrid("getGridRowById", e);
                    if (!k) return f;
                    a = 2
                }
                for (; l < a;) d && (k = g.rows[l]), b(k).hasClass("jqgrow") && (b('td[role="gridcell"]', k).each(function(a) {
                    h = g.p.colModel[a].name;
                    if ("cb" !== h && "subgrid" !== h && "rn" !== h)
                        if (!0 === g.p.treeGrid && h === g.p.ExpandColumn) f[h] = b.jgrid.htmlDecode(b("span:first", this).html());
                        else try {
                            f[h] = b.unformat.call(g, this, {
                                    rowId: k.id,
                                    colModel: g.p.colModel[a]
                                },
                                a)
                        } catch (c) {
                            f[h] = b.jgrid.htmlDecode(b(this).html())
                        }
                }), d && (c.push(f), f = {})), l++
            });
            return c || f
        },
        delRowData: function(e) {
            var f = !1,
                c, d;
            this.each(function() {
                c = b(this).jqGrid("getGridRowById", e);
                if (!c) return !1;
                b(c).remove();
                this.p.records--;
                this.p.reccount--;
                this.updatepager(!0, !1);
                f = !0;
                this.p.multiselect && (d = b.inArray(e, this.p.selarrrow), -1 !== d && this.p.selarrrow.splice(d, 1));
                this.p.selrow = this.p.multiselect && 0 < this.p.selarrrow.length ? this.p.selarrrow[this.p.selarrrow.length - 1] : null;
                if ("local" === this.p.datatype) {
                    var a =
                            b.jgrid.stripPref(this.p.idPrefix, e),
                        a = this.p._index[a];
                    void 0 !== a && (this.p.data.splice(a, 1), this.refreshIndex())
                }
                if (!0 === this.p.altRows && f) {
                    var l = this.p.altclass;
                    b(this.rows).each(function(a) {
                        1 === a % 2 ? b(this).addClass(l) : b(this).removeClass(l)
                    })
                }
            });
            return f
        },
        setRowData: function(e, f, c) {
            var d, a = !0,
                l;
            this.each(function() {
                if (!this.grid) return !1;
                var g = this,
                    h, k, n = typeof c,
                    m = {};
                k = b(this).jqGrid("getGridRowById", e);
                if (!k) return !1;
                if (f) try {
                    if (b(this.p.colModel).each(function(a) {
                            d = this.name;
                            var c = b.jgrid.getAccessor(f,
                                d);
                            void 0 !== c && (m[d] = this.formatter && "string" === typeof this.formatter && "date" === this.formatter ? b.unformat.date.call(g, c, this) : c, h = g.formatter(e, c, a, f, "edit"), l = this.title ? {
                                title: b.jgrid.stripHtml(h)
                            } : {}, !0 === g.p.treeGrid && d === g.p.ExpandColumn ? b("td[role='gridcell']:eq(" + a + ") > span:first", k).html(h).attr(l) : b("td[role='gridcell']:eq(" + a + ")", k).html(h).attr(l))
                        }), "local" === g.p.datatype) {
                        var r = b.jgrid.stripPref(g.p.idPrefix, e),
                            p = g.p._index[r],
                            q;
                        if (g.p.treeGrid)
                            for (q in g.p.treeReader) g.p.treeReader.hasOwnProperty(q) &&
                            delete m[g.p.treeReader[q]];
                        void 0 !== p && (g.p.data[p] = b.extend(!0, g.p.data[p], m));
                        m = null
                    }
                } catch (x) {
                    a = !1
                }
                a && ("string" === n ? b(k).addClass(c) : null !== c && "object" === n && b(k).css(c), b(g).triggerHandler("jqGridAfterGridComplete"))
            });
            return a
        },
        addRowData: function(e, f, c, d) {
            c || (c = "last");
            var a = !1,
                l, g, h, k, n, m, r, p, q = "",
                x, G, U, M, ea, W;
            f && (b.isArray(f) ? (x = !0, c = "last", G = e) : (f = [f], x = !1), this.each(function() {
                var X = f.length;
                n = !0 === this.p.rownumbers ? 1 : 0;
                h = !0 === this.p.multiselect ? 1 : 0;
                k = !0 === this.p.subGrid ? 1 : 0;
                x || (void 0 !==
                e ? e = String(e) : (e = b.jgrid.randId(), !1 !== this.p.keyIndex && (G = this.p.colModel[this.p.keyIndex + h + k + n].name, void 0 !== f[0][G] && (e = f[0][G]))));
                U = this.p.altclass;
                for (var O = 0, $ = "", K = {}, Y = b.isFunction(this.p.afterInsertRow) ? !0 : !1; O < X;) {
                    M = f[O];
                    g = [];
                    if (x) {
                        try {
                            e = M[G], void 0 === e && (e = b.jgrid.randId())
                        } catch (oa) {
                            e = b.jgrid.randId()
                        }
                        $ = !0 === this.p.altRows ? 0 === (this.rows.length - 1) % 2 ? U : "" : ""
                    }
                    W = e;
                    e = this.p.idPrefix + e;
                    n && (q = this.formatCol(0, 1, "", null, e, !0), g[g.length] = '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' +
                        q + ">0</td>");
                    h && (p = '<input role="checkbox" type="checkbox" id="jqg_' + this.p.id + "_" + e + '" class="cbox"/>', q = this.formatCol(n, 1, "", null, e, !0), g[g.length] = '<td role="gridcell" ' + q + ">" + p + "</td>");
                    k && (g[g.length] = b(this).jqGrid("addSubGridCell", h + n, 1));
                    for (r = h + k + n; r < this.p.colModel.length; r++) ea = this.p.colModel[r], l = ea.name, K[l] = M[l], p = this.formatter(e, b.jgrid.getAccessor(M, l), r, M), q = this.formatCol(r, 1, p, M, e, K), g[g.length] = '<td role="gridcell" ' + q + ">" + p + "</td>";
                    g.unshift(this.constructTr(e, !1, $, K, M, !1));
                    g[g.length] = "</tr>";
                    if (0 === this.rows.length) b("table:first", this.grid.bDiv).append(g.join(""));
                    else switch (c) {
                        case "last":
                            b(this.rows[this.rows.length - 1]).after(g.join(""));
                            m = this.rows.length - 1;
                            break;
                        case "first":
                            b(this.rows[0]).after(g.join(""));
                            m = 1;
                            break;
                        case "after":
                            if (m = b(this).jqGrid("getGridRowById", d)) b(this.rows[m.rowIndex + 1]).hasClass("ui-subgrid") ? b(this.rows[m.rowIndex + 1]).after(g) : b(m).after(g.join("")), m = m.rowIndex + 1;
                            break;
                        case "before":
                            if (m = b(this).jqGrid("getGridRowById", d)) b(m).before(g.join("")),
                                m = m.rowIndex - 1
                    }!0 === this.p.subGrid && b(this).jqGrid("addSubGrid", h + n, m);
                    this.p.records++;
                    this.p.reccount++;
                    b(this).triggerHandler("jqGridAfterInsertRow", [e, M, M]);
                    Y && this.p.afterInsertRow.call(this, e, M, M);
                    O++;
                    "local" === this.p.datatype && (K[this.p.localReader.id] = W, this.p._index[W] = this.p.data.length, this.p.data.push(K), K = {})
                }!0 !== this.p.altRows || x || ("last" === c ? 1 === (this.rows.length - 1) % 2 && b(this.rows[this.rows.length - 1]).addClass(U) : b(this.rows).each(function(a) {
                    1 === a % 2 ? b(this).addClass(U) : b(this).removeClass(U)
                }));
                this.updatepager(!0, !0);
                a = !0
            }));
            return a
        },
        footerData: function(e, f, c) {
            function d(a) {
                for (var b in a)
                    if (a.hasOwnProperty(b)) return !1;
                return !0
            }
            var a, l = !1,
                g = {},
                h;
            void 0 == e && (e = "get");
            "boolean" !== typeof c && (c = !0);
            e = e.toLowerCase();
            this.each(function() {
                var k = this,
                    n;
                if (!k.grid || !k.p.footerrow || "set" === e && d(f)) return !1;
                l = !0;
                b(this.p.colModel).each(function(d) {
                    a = this.name;
                    "set" === e ? void 0 !== f[a] && (n = c ? k.formatter("", f[a], d, f, "edit") : f[a], h = this.title ? {
                            title: b.jgrid.stripHtml(n)
                        } : {}, b("tr.footrow td:eq(" + d +
                            ")", k.grid.sDiv).html(n).attr(h), l = !0) : "get" === e && (g[a] = b("tr.footrow td:eq(" + d + ")", k.grid.sDiv).html())
                })
            });
            return "get" === e ? g : l
        },
        showHideCol: function(e, f) {
            return this.each(function() {
                var c = this,
                    d = !1,
                    a = b.jgrid.cell_width ? 0 : c.p.cellLayout,
                    l;
                if (c.grid) {
                    "string" === typeof e && (e = [e]);
                    f = "none" !== f ? "" : "none";
                    var g = "" === f ? !0 : !1,
                        h = c.p.groupHeader && ("object" === typeof c.p.groupHeader || b.isFunction(c.p.groupHeader));
                    h && b(c).jqGrid("destroyGroupHeader", !1);
                    b(this.p.colModel).each(function(h) {
                        if (-1 !== b.inArray(this.name,
                                e) && this.hidden === g) {
                            if (!0 === c.p.frozenColumns && !0 === this.frozen) return !0;
                            b("tr[role=rowheader]", c.grid.hDiv).each(function() {
                                b(this.cells[h]).css("display", f)
                            });
                            b(c.rows).each(function() {
                                b(this).hasClass("jqgroup") || b(this.cells[h]).css("display", f)
                            });
                            c.p.footerrow && b("tr.footrow td:eq(" + h + ")", c.grid.sDiv).css("display", f);
                            l = parseInt(this.width, 10);
                            c.p.tblwidth = "none" === f ? c.p.tblwidth - (l + a) : c.p.tblwidth + (l + a);
                            this.hidden = !g;
                            d = !0;
                            b(c).triggerHandler("jqGridShowHideCol", [g, this.name, h])
                        }
                    });
                    !0 === d &&
                    (!0 !== c.p.shrinkToFit || isNaN(c.p.height) || (c.p.tblwidth += parseInt(c.p.scrollOffset, 10)), b(c).jqGrid("setGridWidth", !0 === c.p.shrinkToFit ? c.p.tblwidth : c.p.width));
                    h && b(c).jqGrid("setGroupHeaders", c.p.groupHeader)
                }
            })
        },
        hideCol: function(e) {
            return this.each(function() {
                b(this).jqGrid("showHideCol", e, "none")
            })
        },
        showCol: function(e) {
            return this.each(function() {
                b(this).jqGrid("showHideCol", e, "")
            })
        },
        remapColumns: function(e, f, c) {
            function d(a) {
                var c;
                c = a.length ? b.makeArray(a) : b.extend({}, a);
                b.each(e, function(b) {
                    a[b] =
                        c[this]
                })
            }

            function a(a, c) {
                b(">tr" + (c || ""), a).each(function() {
                    var a = this,
                        c = b.makeArray(a.cells);
                    b.each(e, function() {
                        var b = c[this];
                        b && a.appendChild(b)
                    })
                })
            }
            var l = this.get(0);
            d(l.p.colModel);
            d(l.p.colNames);
            d(l.grid.headers);
            a(b("thead:first", l.grid.hDiv), c && ":not(.ui-jqgrid-labels)");
            f && a(b("#" + b.jgrid.jqID(l.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
            l.p.footerrow && a(b("tbody:first", l.grid.sDiv));
            l.p.remapColumns && (l.p.remapColumns.length ? d(l.p.remapColumns) : l.p.remapColumns = b.makeArray(e));
            l.p.lastsort = b.inArray(l.p.lastsort, e);
            l.p.treeGrid && (l.p.expColInd = b.inArray(l.p.expColInd, e));
            b(l).triggerHandler("jqGridRemapColumns", [e, f, c])
        },
        setGridWidth: function(e, f) {
            return this.each(function() {
                if (this.grid) {
                    var c = this,
                        d, a = 0,
                        l = b.jgrid.cell_width ? 0 : c.p.cellLayout,
                        g, h = 0,
                        k = !1,
                        n = c.p.scrollOffset,
                        m, r = 0,
                        p;
                    "boolean" !== typeof f && (f = c.p.shrinkToFit);
                    if (!isNaN(e)) {
                        e = parseInt(e, 10);
                        c.grid.width = c.p.width = e;
                        b("#gbox_" + b.jgrid.jqID(c.p.id)).css("width", e + "px");
                        b("#gview_" + b.jgrid.jqID(c.p.id)).css("width",
                            e + "px");
                        b(c.grid.bDiv).css("width", e + "px");
                        b(c.grid.hDiv).css("width", e + "px");
                        c.p.pager && b(c.p.pager).css("width", e + "px");
                        c.p.toppager && b(c.p.toppager).css("width", e + "px");
                        !0 === c.p.toolbar[0] && (b(c.grid.uDiv).css("width", e + "px"), "both" === c.p.toolbar[1] && b(c.grid.ubDiv).css("width", e + "px"));
                        c.p.footerrow && b(c.grid.sDiv).css("width", e + "px");
                        !1 === f && !0 === c.p.forceFit && (c.p.forceFit = !1);
                        if (!0 === f) {
                            b.each(c.p.colModel, function() {
                                !1 === this.hidden && (d = this.widthOrg, a += d + l, this.fixed ? r += d + l : h++)
                            });
                            if (0 ===
                                h) return;
                            c.p.tblwidth = a;
                            m = e - l * h - r;
                            !isNaN(c.p.height) && (b(c.grid.bDiv)[0].clientHeight < b(c.grid.bDiv)[0].scrollHeight || 1 === c.rows.length) && (k = !0, m -= n);
                            var a = 0,
                                q = 0 < c.grid.cols.length;
                            b.each(c.p.colModel, function(b) {
                                !1 !== this.hidden || this.fixed || (d = this.widthOrg, d = Math.round(m * d / (c.p.tblwidth - l * h - r)), 0 > d || (this.width = d, a += d, c.grid.headers[b].width = d, c.grid.headers[b].el.style.width = d + "px", c.p.footerrow && (c.grid.footers[b].style.width = d + "px"), q && (c.grid.cols[b].style.width = d + "px"), g = b))
                            });
                            if (!g) return;
                            p = 0;
                            k ? e - r - (a + l * h) !== n && (p = e - r - (a + l * h) - n) : 1 !== Math.abs(e - r - (a + l * h)) && (p = e - r - (a + l * h));
                            c.p.colModel[g].width += p;
                            c.p.tblwidth = a + p + l * h + r;
                            c.p.tblwidth > e ? (k = c.p.tblwidth - parseInt(e, 10), c.p.tblwidth = e, d = c.p.colModel[g].width -= k) : d = c.p.colModel[g].width;
                            c.grid.headers[g].width = d;
                            c.grid.headers[g].el.style.width = d + "px";
                            q && (c.grid.cols[g].style.width = d + "px");
                            c.p.footerrow && (c.grid.footers[g].style.width = d + "px")
                        }
                        c.p.tblwidth && (b("table:first", c.grid.bDiv).css("width", c.p.tblwidth + "px"), b("table:first", c.grid.hDiv).css("width",
                            c.p.tblwidth + "px"), c.grid.hDiv.scrollLeft = c.grid.bDiv.scrollLeft, c.p.footerrow && b("table:first", c.grid.sDiv).css("width", c.p.tblwidth + "px"))
                    }
                }
            })
        },
        setGridHeight: function(e) {
            return this.each(function() {
                if (this.grid) {
                    var f = b(this.grid.bDiv);
                    f.css({
                        height: e + (isNaN(e) ? "" : "px")
                    });
                    !0 === this.p.frozenColumns && b("#" + b.jgrid.jqID(this.p.id) + "_frozen").parent().height(f.height() - 16);
                    this.p.height = e;
                    this.p.scroll && this.grid.populateVisible()
                }
            })
        },
        setCaption: function(e) {
            return this.each(function() {
                this.p.caption =
                    e;
                b("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl", this.grid.cDiv).html(e);
                b(this.grid.cDiv).show()
            })
        },
        setLabel: function(e, f, c, d) {
            return this.each(function() {
                var a = -1;
                if (this.grid && void 0 !== e && (b(this.p.colModel).each(function(b) {
                        if (this.name === e) return a = b, !1
                    }), 0 <= a)) {
                    var l = b("tr.ui-jqgrid-labels th:eq(" + a + ")", this.grid.hDiv);
                    if (f) {
                        var g = b(".s-ico", l);
                        b("[id^=jqgh_]", l).empty().html(f).append(g);
                        this.p.colNames[a] = f
                    }
                    c && ("string" === typeof c ? b(l).addClass(c) : b(l).css(c));
                    "object" === typeof d && b(l).attr(d)
                }
            })
        },
        setCell: function(e, f, c, d, a, l) {
            return this.each(function() {
                var g = -1,
                    h, k;
                if (this.grid && (isNaN(f) ? b(this.p.colModel).each(function(a) {
                        if (this.name === f) return g = a, !1
                    }) : g = parseInt(f, 10), 0 <= g && (h = b(this).jqGrid("getGridRowById", e)))) {
                    var n = b("td:eq(" + g + ")", h);
                    if ("" !== c || !0 === l) h = this.formatter(e, c, g, h, "edit"), k = this.p.colModel[g].title ? {
                        title: b.jgrid.stripHtml(h)
                    } : {}, this.p.treeGrid && 0 < b(".tree-wrap", b(n)).length ? b("span", b(n)).html(h).attr(k) : b(n).html(h).attr(k), "local" === this.p.datatype && (h = this.p.colModel[g],
                        c = h.formatter && "string" === typeof h.formatter && "date" === h.formatter ? b.unformat.date.call(this, c, h) : c, k = this.p._index[b.jgrid.stripPref(this.p.idPrefix, e)], void 0 !== k && (this.p.data[k][h.name] = c));
                    "string" === typeof d ? b(n).addClass(d) : d && b(n).css(d);
                    "object" === typeof a && b(n).attr(a)
                }
            })
        },
        getCell: function(e, f) {
            var c = !1;
            this.each(function() {
                var d = -1;
                if (this.grid && (isNaN(f) ? b(this.p.colModel).each(function(a) {
                        if (this.name === f) return d = a, !1
                    }) : d = parseInt(f, 10), 0 <= d)) {
                    var a = b(this).jqGrid("getGridRowById", e);
                    if (a) try {
                        c = b.unformat.call(this, b("td:eq(" + d + ")", a), {
                            rowId: a.id,
                            colModel: this.p.colModel[d]
                        }, d)
                    } catch (l) {
                        c = b.jgrid.htmlDecode(b("td:eq(" + d + ")", a).html())
                    }
                }
            });
            return c
        },
        getCol: function(e, f, c) {
            var d = [],
                a, l = 0,
                g, h, k;
            f = "boolean" !== typeof f ? !1 : f;
            void 0 === c && (c = !1);
            this.each(function() {
                var n = -1;
                if (this.grid && (isNaN(e) ? b(this.p.colModel).each(function(a) {
                        if (this.name === e) return n = a, !1
                    }) : n = parseInt(e, 10), 0 <= n)) {
                    var m = this.rows.length,
                        r = 0,
                        p = 0;
                    if (m && 0 < m) {
                        for (; r < m;) {
                            if (b(this.rows[r]).hasClass("jqgrow")) {
                                try {
                                    a =
                                        b.unformat.call(this, b(this.rows[r].cells[n]), {
                                            rowId: this.rows[r].id,
                                            colModel: this.p.colModel[n]
                                        }, n)
                                } catch (q) {
                                    a = b.jgrid.htmlDecode(this.rows[r].cells[n].innerHTML)
                                }
                                c ? (k = parseFloat(a), isNaN(k) || (l += k, void 0 === h && (h = g = k), g = Math.min(g, k), h = Math.max(h, k), p++)) : f ? d.push({
                                    id: this.rows[r].id,
                                    value: a
                                }) : d.push(a)
                            }
                            r++
                        }
                        if (c) switch (c.toLowerCase()) {
                            case "sum":
                                d = l;
                                break;
                            case "avg":
                                d = l / p;
                                break;
                            case "count":
                                d = m - 1;
                                break;
                            case "min":
                                d = g;
                                break;
                            case "max":
                                d = h
                        }
                    }
                }
            });
            return d
        },
        clearGridData: function(e) {
            return this.each(function() {
                if (this.grid) {
                    "boolean" !==
                    typeof e && (e = !1);
                    if (this.p.deepempty) b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:gt(0)").remove();
                    else {
                        var f = b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:first")[0];
                        b("#" + b.jgrid.jqID(this.p.id) + " tbody:first").empty().append(f)
                    }
                    this.p.footerrow && e && b(".ui-jqgrid-ftable td", this.grid.sDiv).html("&#160;");
                    this.p.selrow = null;
                    this.p.selarrrow = [];
                    this.p.savedRow = [];
                    this.p.records = 0;
                    this.p.page = 1;
                    this.p.lastpage = 0;
                    this.p.reccount = 0;
                    this.p.data = [];
                    this.p._index = {};
                    this.updatepager(!0, !1)
                }
            })
        },
        getInd: function(e,
                         f) {
            var c = !1,
                d;
            this.each(function() {
                (d = b(this).jqGrid("getGridRowById", e)) && (c = !0 === f ? d : d.rowIndex)
            });
            return c
        },
        bindKeys: function(e) {
            var f = b.extend({
                onEnter: null,
                onSpace: null,
                onLeftKey: null,
                onRightKey: null,
                scrollingRows: !0
            }, e || {});
            return this.each(function() {
                var c = this;
                b("body").is("[role]") || b("body").attr("role", "application");
                c.p.scrollrows = f.scrollingRows;
                b(c).keydown(function(d) {
                    var a = b(c).find("tr[tabindex=0]")[0],
                        e, g, h, k = c.p.treeReader.expanded_field;
                    if (a)
                        if (h = c.p._index[b.jgrid.stripPref(c.p.idPrefix,
                                a.id)], 37 === d.keyCode || 38 === d.keyCode || 39 === d.keyCode || 40 === d.keyCode) {
                            if (38 === d.keyCode) {
                                g = a.previousSibling;
                                e = "";
                                if (g)
                                    if (b(g).is(":hidden"))
                                        for (; g;) {
                                            if (g = g.previousSibling, !b(g).is(":hidden") && b(g).hasClass("jqgrow")) {
                                                e = g.id;
                                                break
                                            }
                                        } else e = g.id;
                                b(c).jqGrid("setSelection", e, !0, d);
                                d.preventDefault()
                            }
                            if (40 === d.keyCode) {
                                g = a.nextSibling;
                                e = "";
                                if (g)
                                    if (b(g).is(":hidden"))
                                        for (; g;) {
                                            if (g = g.nextSibling, !b(g).is(":hidden") && b(g).hasClass("jqgrow")) {
                                                e = g.id;
                                                break
                                            }
                                        } else e = g.id;
                                b(c).jqGrid("setSelection", e, !0, d);
                                d.preventDefault()
                            }
                            37 === d.keyCode && (c.p.treeGrid && c.p.data[h][k] && b(a).find("div.treeclick").trigger("click"), b(c).triggerHandler("jqGridKeyLeft", [c.p.selrow]), b.isFunction(f.onLeftKey) && f.onLeftKey.call(c, c.p.selrow));
                            39 === d.keyCode && (c.p.treeGrid && !c.p.data[h][k] && b(a).find("div.treeclick").trigger("click"), b(c).triggerHandler("jqGridKeyRight", [c.p.selrow]), b.isFunction(f.onRightKey) && f.onRightKey.call(c, c.p.selrow))
                        } else 13 === d.keyCode ? (b(c).triggerHandler("jqGridKeyEnter", [c.p.selrow]), b.isFunction(f.onEnter) &&
                        f.onEnter.call(c, c.p.selrow)) : 32 === d.keyCode && (b(c).triggerHandler("jqGridKeySpace", [c.p.selrow]), b.isFunction(f.onSpace) && f.onSpace.call(c, c.p.selrow))
                })
            })
        },
        unbindKeys: function() {
            return this.each(function() {
                b(this).unbind("keydown")
            })
        },
        getLocalRow: function(e) {
            var f = !1,
                c;
            this.each(function() {
                void 0 !== e && (c = this.p._index[b.jgrid.stripPref(this.p.idPrefix, e)], 0 <= c && (f = this.p.data[c]))
            });
            return f
        }
    })
})(jQuery);
(function(a) {
    a.fmatter = {};
    a.extend(a.fmatter, {
        isBoolean: function(a) {
            return "boolean" === typeof a
        },
        isObject: function(c) {
            return c && ("object" === typeof c || a.isFunction(c)) || !1
        },
        isString: function(a) {
            return "string" === typeof a
        },
        isNumber: function(a) {
            return "number" === typeof a && isFinite(a)
        },
        isValue: function(a) {
            return this.isObject(a) || this.isString(a) || this.isNumber(a) || this.isBoolean(a)
        },
        isEmpty: function(c) {
            if (!this.isString(c) && this.isValue(c)) return !1;
            if (!this.isValue(c)) return !0;
            c = a.trim(c).replace(/\&nbsp\;/ig,
                "").replace(/\&#160\;/ig, "");
            return "" === c
        }
    });
    a.fn.fmatter = function(c, b, d, e, f) {
        var g = b;
        d = a.extend({}, a.jgrid.formatter, d);
        try {
            g = a.fn.fmatter[c].call(this, b, d, e, f)
        } catch (h) {}
        return g
    };
    a.fmatter.util = {
        NumberFormat: function(c, b) {
            a.fmatter.isNumber(c) || (c *= 1);
            if (a.fmatter.isNumber(c)) {
                var d = 0 > c,
                    e = String(c),
                    f = b.decimalSeparator || ".",
                    g;
                if (a.fmatter.isNumber(b.decimalPlaces)) {
                    var h = b.decimalPlaces,
                        e = Math.pow(10, h),
                        e = String(Math.round(c * e) / e);
                    g = e.lastIndexOf(".");
                    if (0 < h)
                        for (0 > g ? (e += f, g = e.length - 1) : "." !== f &&
                            (e = e.replace(".", f)); e.length - 1 - g < h;) e += "0"
                }
                if (b.thousandsSeparator) {
                    h = b.thousandsSeparator;
                    g = e.lastIndexOf(f);
                    g = -1 < g ? g : e.length;
                    var f = e.substring(g),
                        l = -1,
                        k;
                    for (k = g; 0 < k; k--) l++, 0 === l % 3 && k !== g && (!d || 1 < k) && (f = h + f), f = e.charAt(k - 1) + f;
                    e = f
                }
                e = b.prefix ? b.prefix + e : e;
                return e = b.suffix ? e + b.suffix : e
            }
            return c
        }
    };
    a.fn.fmatter.defaultFormat = function(c, b) {
        return a.fmatter.isValue(c) && "" !== c ? c : b.defaultValue || "&#160;"
    };
    a.fn.fmatter.email = function(c, b) {
        return a.fmatter.isEmpty(c) ? a.fn.fmatter.defaultFormat(c, b) : '<a href="mailto:' +
            c + '">' + c + "</a>"
    };
    a.fn.fmatter.checkbox = function(c, b) {
        var d = a.extend({}, b.checkbox),
            e;
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        e = !0 === d.disabled ? 'disabled="disabled"' : "";
        if (a.fmatter.isEmpty(c) || void 0 === c) c = a.fn.fmatter.defaultFormat(c, d);
        c = String(c);
        c = (c + "").toLowerCase();
        return '<input type="checkbox" ' + (0 > c.search(/(false|f|0|no|n|off|undefined)/i) ? " checked='checked' " : "") + ' value="' + c + '" offval="no" ' + e + "/>"
    };
    a.fn.fmatter.link = function(c,
                                 b) {
        var d = {
                target: b.target
            },
            e = "";
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        d.target && (e = "target=" + d.target);
        return a.fmatter.isEmpty(c) ? a.fn.fmatter.defaultFormat(c, b) : "<a " + e + ' href="' + c + '">' + c + "</a>"
    };
    a.fn.fmatter.showlink = function(c, b) {
        var d = {
                baseLinkUrl: b.baseLinkUrl,
                showAction: b.showAction,
                addParam: b.addParam || "",
                target: b.target,
                idName: b.idName
            },
            e = "";
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        d.target && (e = "target=" + d.target);
        d = d.baseLinkUrl + d.showAction + "?" + d.idName + "=" + b.rowId + d.addParam;
        return a.fmatter.isString(c) || a.fmatter.isNumber(c) ? "<a " + e + ' href="' + d + '">' + c + "</a>" : a.fn.fmatter.defaultFormat(c, b)
    };
    a.fn.fmatter.integer = function(c, b) {
        var d = a.extend({}, b.integer);
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        return a.fmatter.isEmpty(c) ? d.defaultValue : a.fmatter.util.NumberFormat(c, d)
    };
    a.fn.fmatter.number = function(c, b) {
        var d = a.extend({},
            b.number);
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        return a.fmatter.isEmpty(c) ? d.defaultValue : a.fmatter.util.NumberFormat(c, d)
    };
    a.fn.fmatter.currency = function(c, b) {
        var d = a.extend({}, b.currency);
        void 0 !== b.colModel && void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        return a.fmatter.isEmpty(c) ? d.defaultValue : a.fmatter.util.NumberFormat(c, d)
    };
    a.fn.fmatter.date = function(c, b, d, e) {
        d = a.extend({}, b.date);
        void 0 !== b.colModel &&
        void 0 !== b.colModel.formatoptions && (d = a.extend({}, d, b.colModel.formatoptions));
        return d.reformatAfterEdit || "edit" !== e ? a.fmatter.isEmpty(c) ? a.fn.fmatter.defaultFormat(c, b) : a.jgrid.parseDate(d.srcformat, c, d.newformat, d) : a.fn.fmatter.defaultFormat(c, b)
    };
    a.fn.fmatter.select = function(c, b) {
        c = String(c);
        var d = !1,
            e = [],
            f, g;
        void 0 !== b.colModel.formatoptions ? (d = b.colModel.formatoptions.value, f = void 0 === b.colModel.formatoptions.separator ? ":" : b.colModel.formatoptions.separator, g = void 0 === b.colModel.formatoptions.delimiter ?
            ";" : b.colModel.formatoptions.delimiter) : void 0 !== b.colModel.editoptions && (d = b.colModel.editoptions.value, f = void 0 === b.colModel.editoptions.separator ? ":" : b.colModel.editoptions.separator, g = void 0 === b.colModel.editoptions.delimiter ? ";" : b.colModel.editoptions.delimiter);
        if (d) {
            var h = !0 === b.colModel.editoptions.multiple ? !0 : !1,
                l = [];
            h && (l = c.split(","), l = a.map(l, function(b) {
                return a.trim(b)
            }));
            if (a.fmatter.isString(d)) {
                var k = d.split(g),
                    m = 0,
                    n;
                for (n = 0; n < k.length; n++)
                    if (g = k[n].split(f), 2 < g.length && (g[1] = a.map(g,
                            function(a, b) {
                                if (0 < b) return a
                            }).join(f)), h) - 1 < a.inArray(g[0], l) && (e[m] = g[1], m++);
                    else if (a.trim(g[0]) === a.trim(c)) {
                        e[0] = g[1];
                        break
                    }
            } else a.fmatter.isObject(d) && (h ? e = a.map(l, function(a) {
                return d[a]
            }) : e[0] = d[c] || "")
        }
        c = e.join(", ");
        return "" === c ? a.fn.fmatter.defaultFormat(c, b) : c
    };
    a.fn.fmatter.rowactions = function(c) {
        var b = a(this).closest("tr.jqgrow"),
            d = b.attr("id"),
            e = a(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/, "$1"),
            e = a("#" + e),
            f = e[0],
            g = f.p,
            h = g.colModel[a.jgrid.getCellIndex(this)],
            l = h.frozen ? a("tr#" + d + " td:eq(" + a.jgrid.getCellIndex(this) + ") > div", e) : a(this).parent(),
            k = {
                extraparam: {}
            },
            m = function(b) {
                a.isFunction(k.afterRestobre) && k.afterRestore.call(f, b);
                l.find("div.ui-inline-edit,div.ui-inline-del").show();
                l.find("div.ui-inline-save,div.ui-inline-cancel").hide()
            };
        void 0 !== h.formatoptions && (k = a.extend(k, h.formatoptions));
        void 0 !== g.editOptions && (k.editOptions = g.editOptions);
        void 0 !== g.delOptions && (k.delOptions = g.delOptions);
        b.hasClass("jqgrid-new-row") && (k.extraparam[g.prmNames.oper] =
            g.prmNames.addoper);
        b = {
            keys: k.keys,
            oneditfunc: k.onEdit,
            successfunc: k.onSuccess,
            url: k.url,
            extraparam: k.extraparam,
            aftersavefunc: function(b, c) {
                a.isFunction(k.afterSave) && k.afterSave.call(f, b, c);
                l.find("div.ui-inline-edit,div.ui-inline-del").show();
                l.find("div.ui-inline-save,div.ui-inline-cancel").hide()
            },
            errorfunc: k.onError,
            afterrestorefunc: m,
            restoreAfterError: k.restoreAfterError,
            mtype: k.mtype
        };
        switch (c) {
            case "edit":
                e.jqGrid("editRow", d, b);
                l.find("div.ui-inline-edit,div.ui-inline-del").hide();
                l.find("div.ui-inline-save,div.ui-inline-cancel").show();
                e.triggerHandler("jqGridAfterGridComplete");
                break;
            case "save":
                e.jqGrid("saveRow", d, b) && (l.find("div.ui-inline-edit,div.ui-inline-del").show(), l.find("div.ui-inline-save,div.ui-inline-cancel").hide(), e.triggerHandler("jqGridAfterGridComplete"));
                break;
            case "cancel":
                e.jqGrid("restoreRow", d, m);
                l.find("div.ui-inline-edit,div.ui-inline-del").show();
                l.find("div.ui-inline-save,div.ui-inline-cancel").hide();
                e.triggerHandler("jqGridAfterGridComplete");
                break;
            case "del":
                e.jqGrid("delGridRow", d, k.delOptions);
                break;
            case "formedit":
                e.jqGrid("setSelection", d), e.jqGrid("editGridRow", d, k.editOptions)
        }
    };
    a.fn.fmatter.actions = function(c, b) {
        var d = {
                keys: !1,
                editbutton: !0,
                delbutton: !0,
                editformbutton: !1
            },
            e = b.rowId,
            f = "";
        void 0 !== b.colModel.formatoptions && (d = a.extend(d, b.colModel.formatoptions));
        if (void 0 === e || a.fmatter.isEmpty(e)) return "";
        d.editformbutton ? f += "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + ("id='jEditButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ") +
            "><span class='ui-icon ui-icon-pencil'></span></div>" : d.editbutton && (f += "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + ("id='jEditButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ") + "><span class='ui-icon ui-icon-pencil'></span></div>");
        d.delbutton && (f += "<div title='" + a.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " +
            ("id='jDeleteButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ") + "><span class='ui-icon ui-icon-trash'></span></div>");
        f += "<div title='" + a.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " + ("id='jSaveButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ") +
            "><span class='ui-icon ui-icon-disk'></span></div>";
        f += "<div title='" + a.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' " + ("id='jCancelButton_" + e + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ") + "><span class='ui-icon ui-icon-cancel'></span></div>";
        return "<div style='margin-left:8px;'>" + f + "</div>"
    };
    a.unformat = function(c,
                          b, d, e) {
        var f, g = b.colModel.formatter,
            h = b.colModel.formatoptions || {},
            l = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
            k = b.colModel.unformat || a.fn.fmatter[g] && a.fn.fmatter[g].unformat;
        if (void 0 !== k && a.isFunction(k)) f = k.call(this, a(c).text(), b, c);
        else if (void 0 !== g && a.fmatter.isString(g)) switch (f = a.jgrid.formatter || {}, g) {
            case "integer":
                h = a.extend({}, f.integer, h);
                b = h.thousandsSeparator.replace(l, "\\$1");
                b = RegExp(b, "g");
                f = a(c).text().replace(b, "");
                break;
            case "number":
                h = a.extend({}, f.number, h);
                b = h.thousandsSeparator.replace(l,
                    "\\$1");
                b = RegExp(b, "g");
                f = a(c).text().replace(b, "").replace(h.decimalSeparator, ".");
                break;
            case "currency":
                h = a.extend({}, f.currency, h);
                b = h.thousandsSeparator.replace(l, "\\$1");
                b = RegExp(b, "g");
                f = a(c).text();
                h.prefix && h.prefix.length && (f = f.substr(h.prefix.length));
                h.suffix && h.suffix.length && (f = f.substr(0, f.length - h.suffix.length));
                f = f.replace(b, "").replace(h.decimalSeparator, ".");
                break;
            case "checkbox":
                h = b.colModel.editoptions ? b.colModel.editoptions.value.split(":") : ["Yes", "No"];
                f = a("input", c).is(":checked") ?
                    h[0] : h[1];
                break;
            case "select":
                f = a.unformat.select(c, b, d, e);
                break;
            case "actions":
                return "";
            default:
                f = a(c).text()
        }
        return void 0 !== f ? f : !0 === e ? a(c).text() : a.jgrid.htmlDecode(a(c).html())
    };
    a.unformat.select = function(c, b, d, e) {
        d = [];
        c = a(c).text();
        if (!0 === e) return c;
        e = a.extend({}, void 0 !== b.colModel.formatoptions ? b.colModel.formatoptions : b.colModel.editoptions);
        b = void 0 === e.separator ? ":" : e.separator;
        var f = void 0 === e.delimiter ? ";" : e.delimiter;
        if (e.value) {
            var g = e.value;
            e = !0 === e.multiple ? !0 : !1;
            var h = [];
            e && (h =
                c.split(","), h = a.map(h, function(b) {
                return a.trim(b)
            }));
            if (a.fmatter.isString(g)) {
                var l = g.split(f),
                    k = 0,
                    m;
                for (m = 0; m < l.length; m++)
                    if (f = l[m].split(b), 2 < f.length && (f[1] = a.map(f, function(a, b) {
                            if (0 < b) return a
                        }).join(b)), e) - 1 < a.inArray(f[1], h) && (d[k] = f[0], k++);
                    else if (a.trim(f[1]) === a.trim(c)) {
                        d[0] = f[0];
                        break
                    }
            } else if (a.fmatter.isObject(g) || a.isArray(g)) e || (h[0] = c), d = a.map(h, function(b) {
                var c;
                a.each(g, function(a, d) {
                    if (d === b) return c = a, !1
                });
                if (void 0 !== c) return c
            });
            return d.join(", ")
        }
        return c || ""
    };
    a.unformat.date =
        function(c, b) {
            var d = a.jgrid.formatter.date || {};
            void 0 !== b.formatoptions && (d = a.extend({}, d, b.formatoptions));
            return a.fmatter.isEmpty(c) ? a.fn.fmatter.defaultFormat(c, b) : a.jgrid.parseDate(d.newformat, c, d.srcformat, d)
        }
})(jQuery);
(function(a) {
    a.jgrid.extend({
        getColProp: function(a) {
            var c = {},
                d = this[0];
            if (!d.grid) return !1;
            var d = d.p.colModel,
                h;
            for (h = 0; h < d.length; h++)
                if (d[h].name === a) {
                    c = d[h];
                    break
                }
            return c
        },
        setColProp: function(b, c) {
            return this.each(function() {
                if (this.grid && c) {
                    var d = this.p.colModel,
                        h;
                    for (h = 0; h < d.length; h++)
                        if (d[h].name === b) {
                            a.extend(!0, this.p.colModel[h], c);
                            break
                        }
                }
            })
        },
        sortGrid: function(a, c, d) {
            return this.each(function() {
                var h = -1,
                    k, e = !1;
                if (this.grid) {
                    a || (a = this.p.sortname);
                    for (k = 0; k < this.p.colModel.length; k++)
                        if (this.p.colModel[k].index ===
                            a || this.p.colModel[k].name === a) {
                            h = k;
                            !0 === this.p.frozenColumns && !0 === this.p.colModel[k].frozen && (e = this.grid.fhDiv.find("#" + this.p.id + "_" + a));
                            break
                        } - 1 !== h && (k = this.p.colModel[h].sortable, e || (e = this.grid.headers[h].el), "boolean" !== typeof k && (k = !0), "boolean" !== typeof c && (c = !1), k && this.sortData("jqgh_" + this.p.id + "_" + a, h, c, d, e))
                }
            })
        },
        clearBeforeUnload: function() {
            return this.each(function() {
                var b = this.grid;
                a.isFunction(b.emptyRows) && b.emptyRows.call(this, !0, !0);
                a(document).unbind("mouseup.jqGrid" + this.p.id);
                a(b.hDiv).unbind("mousemove");
                a(this).unbind();
                b.dragEnd = null;
                b.dragMove = null;
                b.dragStart = null;
                b.emptyRows = null;
                b.populate = null;
                b.populateVisible = null;
                b.scrollGrid = null;
                b.selectionPreserver = null;
                b.bDiv = null;
                b.cDiv = null;
                b.hDiv = null;
                b.cols = null;
                var c, d = b.headers.length;
                for (c = 0; c < d; c++) b.headers[c].el = null;
                this.grid = this.addJSONData = this.addXmlData = this.formatter = this.constructTr = this.setHeadCheckBox = this.refreshIndex = this.updatepager = this.sortData = this.formatCol = null
            })
        },
        GridDestroy: function() {
            return this.each(function() {
                if (this.grid) {
                    this.p.pager &&
                    a(this.p.pager).remove();
                    try {
                        a(this).jqGrid("clearBeforeUnload"), a("#gbox_" + a.jgrid.jqID(this.id)).remove()
                    } catch (b) {}
                }
            })
        },
        GridUnload: function() {
            return this.each(function() {
                if (this.grid) {
                    var b = a(this).attr("id"),
                        c = a(this).attr("class");
                    this.p.pager && a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");
                    var d = document.createElement("table");
                    a(d).attr({
                        id: b
                    });
                    d.className = c;
                    b = a.jgrid.jqID(this.id);
                    a(d).removeClass("ui-jqgrid-btable");
                    1 === a(this.p.pager).parents("#gbox_" +
                        b).length ? (a(d).insertBefore("#gbox_" + b).show(), a(this.p.pager).insertBefore("#gbox_" + b)) : a(d).insertBefore("#gbox_" + b).show();
                    a(this).jqGrid("clearBeforeUnload");
                    a("#gbox_" + b).remove()
                }
            })
        },
        setGridState: function(b) {
            return this.each(function() {
                this.grid && ("hidden" === b ? (a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), this.p.pager && a(this.p.pager).slideUp("fast"), this.p.toppager && a(this.p.toppager).slideUp("fast"), !0 === this.p.toolbar[0] && ("both" === this.p.toolbar[1] &&
                a(this.grid.ubDiv).slideUp("fast"), a(this.grid.uDiv).slideUp("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"), this.p.gridstate = "hidden") : "visible" === b && (a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideDown("fast"), this.p.pager && a(this.p.pager).slideDown("fast"), this.p.toppager && a(this.p.toppager).slideDown("fast"), !0 === this.p.toolbar[0] && ("both" === this.p.toolbar[1] && a(this.grid.ubDiv).slideDown("fast"), a(this.grid.uDiv).slideDown("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + a.jgrid.jqID(this.p.id)).slideDown("fast"), a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"), this.p.gridstate = "visible"))
            })
        },
        filterToolbar: function(b) {
            b = a.extend({
                autosearch: !0,
                searchOnEnter: !0,
                beforeSearch: null,
                afterSearch: null,
                beforeClear: null,
                afterClear: null,
                searchurl: "",
                stringResult: !1,
                groupOp: "AND",
                defaultSearch: "bw",
                searchOperators: !1,
                resetIcon: "x",
                operands: {
                    eq: "==",
                    ne: "!",
                    lt: "<",
                    le: "<=",
                    gt: ">",
                    ge: ">=",
                    bw: "^",
                    bn: "!^",
                    "in": "=",
                    ni: "!=",
                    ew: "|",
                    en: "!@",
                    cn: "~",
                    nc: "!~",
                    nu: "#",
                    nn: "!#"
                }
            }, a.jgrid.search, b || {});
            return this.each(function() {
                var c = this;
                if (!this.ftoolbar) {
                    var d = function() {
                            var d = {},
                                f = 0,
                                g, m, e = {},
                                q;
                            a.each(c.p.colModel, function() {
                                var l = a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv);
                                m = this.index ||
                                    this.name;
                                q = b.searchOperators ? l.parent().prev().children("a").attr("soper") || b.defaultSearch : this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : "select" === this.stype ? "eq" : b.defaultSearch;
                                if ((g = "custom" === this.stype && a.isFunction(this.searchoptions.custom_value) && 0 < l.length && "SPAN" === l[0].nodeName.toUpperCase() ? this.searchoptions.custom_value.call(c, l.children(".customelement:first"), "get") : l.val()) || "nu" === q || "nn" === q) d[m] = g, e[m] = q, f++;
                                else try {
                                    delete c.p.postData[m]
                                } catch (k) {}
                            });
                            var k = 0 < f ? !0 : !1;
                            if (!0 === b.stringResult || "local" === c.p.datatype) {
                                var l = '{"groupOp":"' + b.groupOp + '","rules":[',
                                    n = 0;
                                a.each(d, function(a, b) {
                                    0 < n && (l += ",");
                                    l += '{"field":"' + a + '",';
                                    l += '"op":"' + e[a] + '",';
                                    l += '"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                    n++
                                });
                                l += "]}";
                                a.extend(c.p.postData, {
                                    filters: l
                                });
                                a.each(["searchField", "searchString", "searchOper"], function(a, b) {
                                    c.p.postData.hasOwnProperty(b) && delete c.p.postData[b]
                                })
                            } else a.extend(c.p.postData, d);
                            var r;
                            c.p.searchurl && (r = c.p.url, a(c).jqGrid("setGridParam", {
                                url: c.p.searchurl
                            }));
                            var h = "stop" === a(c).triggerHandler("jqGridToolbarBeforeSearch") ? !0 : !1;
                            !h && a.isFunction(b.beforeSearch) && (h = b.beforeSearch.call(c));
                            h || a(c).jqGrid("setGridParam", {
                                search: k
                            }).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            r && a(c).jqGrid("setGridParam", {
                                url: r
                            });
                            a(c).triggerHandler("jqGridToolbarAfterSearch");
                            a.isFunction(b.afterSearch) && b.afterSearch.call(c)
                        },
                        h = function(e, f, g) {
                            a("#sopt_menu").remove();
                            f = parseInt(f, 10);
                            g = parseInt(g, 10) + 18;
                            f = '<ul id="sopt_menu" class="ui-search-menu" role="menu" tabindex="0" style="font-size:' +
                                (a(".ui-jqgrid-view").css("font-size") || "11px") + ";left:" + f + "px;top:" + g + 'px;">';
                            g = a(e).attr("soper");
                            var k, h = [],
                                q, p = 0,
                                l = a(e).attr("colname");
                            for (k = c.p.colModel.length; p < k && c.p.colModel[p].name !== l;) p++;
                            p = c.p.colModel[p];
                            l = a.extend({}, p.searchoptions);
                            l.sopt || (l.sopt = [], l.sopt[0] = "select" === p.stype ? "eq" : b.defaultSearch);
                            a.each(b.odata, function() {
                                h.push(this.oper)
                            });
                            for (p = 0; p < l.sopt.length; p++) q = a.inArray(l.sopt[p], h), -1 !== q && (k = g === b.odata[q].oper ? "ui-state-highlight" : "", f += '<li class="ui-menu-item ' +
                                k + '" role="presentation"><a class="ui-corner-all g-menu-item" tabindex="0" role="menuitem" value="' + b.odata[q].oper + '" oper="' + b.operands[b.odata[q].oper] + '"><table cellspacing="0" cellpadding="0" border="0"><tr><td width="25px">' + b.operands[b.odata[q].oper] + "</td><td>" + b.odata[q].text + "</td></tr></table></a></li>");
                            f += "</ul>";
                            a("body").append(f);
                            a("#sopt_menu").addClass("ui-menu ui-widget ui-widget-content ui-corner-all");
                            a("#sopt_menu > li > a").hover(function() {
                                    a(this).addClass("ui-state-hover")
                                },
                                function() {
                                    a(this).removeClass("ui-state-hover")
                                }).click(function(f) {
                                f = a(this).attr("value");
                                var g = a(this).attr("oper");
                                a(c).triggerHandler("jqGridToolbarSelectOper", [f, g, e]);
                                a("#sopt_menu").hide();
                                a(e).text(g).attr("soper", f);
                                !0 === b.autosearch && (g = a(e).parent().next().children()[0], (a(g).val() || "nu" === f || "nn" === f) && d())
                            })
                        },
                        k = a("<tr class='ui-search-toolbar' role='rowheader'></tr>"),
                        e;
                    a.each(c.p.colModel, function(h) {
                        var f = this,
                            g, m;
                        m = "";
                        var x = "=",
                            q, p = a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" +
                                c.p.direction + "'></th>"),
                            l = a("<div style='position:relative;height:100%;padding-right:0.3em;padding-left:0.3em;'></div>"),
                            n = a("<table class='ui-search-table' cellspacing='0'><tr><td class='ui-search-oper'></td><td class='ui-search-input'></td><td class='ui-search-clear'></td></tr></table>");
                        !0 === this.hidden && a(p).css("display", "none");
                        this.search = !1 === this.search ? !1 : !0;
                        void 0 === this.stype && (this.stype = "text");
                        g = a.extend({}, this.searchoptions || {});
                        if (this.search) {
                            if (b.searchOperators) {
                                m = g.sopt ? g.sopt[0] :
                                    "select" === f.stype ? "eq" : b.defaultSearch;
                                for (q = 0; q < b.odata.length; q++)
                                    if (b.odata[q].oper === m) {
                                        x = b.operands[m] || "";
                                        break
                                    }
                                m = "<a title='" + (null != g.searchtitle ? g.searchtitle : b.operandTitle) + "' style='padding-right: 0.5em;' soper='" + m + "' class='soptclass' colname='" + this.name + "'>" + x + "</a>"
                            }
                            a("td:eq(0)", n).attr("colindex", h).append(m);
                            void 0 === g.clearSearch && (g.clearSearch = !0);
                            g.clearSearch ? (m = b.resetTitle || "Clear Search Value", a("td:eq(2)", n).append("<a title='" + m + "' style='padding-right: 0.3em;padding-left: 0.3em;' class='clearsearchclass'>" +
                                b.resetIcon + "</a>")) : a("td:eq(2)", n).hide();
                            switch (this.stype) {
                                case "select":
                                    if (m = this.surl || g.dataUrl) a(l).append(n), a.ajax(a.extend({
                                        url: m,
                                        dataType: "html",
                                        success: function(e) {
                                            void 0 !== g.buildSelect ? (e = g.buildSelect(e)) && a("td:eq(1)", n).append(e) : a("td:eq(1)", n).append(e);
                                            void 0 !== g.defaultValue && a("select", l).val(g.defaultValue);
                                            a("select", l).attr({
                                                name: f.index || f.name,
                                                id: "gs_" + f.name
                                            });
                                            g.attr && a("select", l).attr(g.attr);
                                            a("select", l).css({
                                                width: "100%"
                                            });
                                            a.jgrid.bindEv.call(c, a("select", l)[0], g);
                                            !0 === b.autosearch && a("select", l).change(function() {
                                                d();
                                                return !1
                                            });
                                            e = null
                                        }
                                    }, a.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                                    else {
                                        var r, w, u;
                                        f.searchoptions ? (r = void 0 === f.searchoptions.value ? "" : f.searchoptions.value, w = void 0 === f.searchoptions.separator ? ":" : f.searchoptions.separator, u = void 0 === f.searchoptions.delimiter ? ";" : f.searchoptions.delimiter) : f.editoptions && (r = void 0 === f.editoptions.value ? "" : f.editoptions.value, w = void 0 === f.editoptions.separator ? ":" : f.editoptions.separator, u = void 0 === f.editoptions.delimiter ?
                                                ";" : f.editoptions.delimiter);
                                        if (r) {
                                            var t = document.createElement("select");
                                            t.style.width = "100%";
                                            a(t).attr({
                                                name: f.index || f.name,
                                                id: "gs_" + f.name
                                            });
                                            var v;
                                            if ("string" === typeof r)
                                                for (m = r.split(u), v = 0; v < m.length; v++) r = m[v].split(w), u = document.createElement("option"), u.value = r[0], u.innerHTML = r[1], t.appendChild(u);
                                            else if ("object" === typeof r)
                                                for (v in r) r.hasOwnProperty(v) && (u = document.createElement("option"), u.value = v, u.innerHTML = r[v], t.appendChild(u));
                                            void 0 !== g.defaultValue && a(t).val(g.defaultValue);
                                            g.attr &&
                                            a(t).attr(g.attr);
                                            a(l).append(n);
                                            a.jgrid.bindEv.call(c, t, g);
                                            a("td:eq(1)", n).append(t);
                                            !0 === b.autosearch && a(t).change(function() {
                                                d();
                                                return !1
                                            })
                                        }
                                    }
                                    break;
                                case "text":
                                    w = void 0 !== g.defaultValue ? g.defaultValue : "";
                                    a("td:eq(1)", n).append("<input type='text' style='width:100%;padding:0px;' name='" + (f.index || f.name) + "' id='gs_" + f.name + "' value='" + w + "'/>");
                                    a(l).append(n);
                                    g.attr && a("input", l).attr(g.attr);
                                    a.jgrid.bindEv.call(c, a("input", l)[0], g);
                                    !0 === b.autosearch && (b.searchOnEnter ? a("input", l).keypress(function(a) {
                                        return 13 ===
                                        (a.charCode || a.keyCode || 0) ? (d(), !1) : this
                                    }) : a("input", l).keydown(function(a) {
                                        switch (a.which) {
                                            case 13:
                                                return !1;
                                            case 9:
                                            case 16:
                                            case 37:
                                            case 38:
                                            case 39:
                                            case 40:
                                            case 27:
                                                break;
                                            default:
                                                e && clearTimeout(e), e = setTimeout(function() {
                                                    d()
                                                }, 500)
                                        }
                                    }));
                                    break;
                                case "custom":
                                    a("td:eq(1)", n).append("<span style='width:95%;padding:0px;' name='" + (f.index || f.name) + "' id='gs_" + f.name + "'/>");
                                    a(l).append(n);
                                    try {
                                        if (a.isFunction(g.custom_element))
                                            if (t = g.custom_element.call(c, void 0 !== g.defaultValue ? g.defaultValue : "", g)) t = a(t).addClass("customelement"),
                                                a(l).find(">span").append(t);
                                            else throw "e2";
                                        else throw "e1";
                                    } catch (y) {
                                        "e1" === y && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose), "e2" === y ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, "string" === typeof y ? y : y.message, a.jgrid.edit.bClose)
                                    }
                            }
                        }
                        a(p).append(l);
                        a(k).append(p);
                        b.searchOperators || a("td:eq(0)", n).hide()
                    });
                    a("table thead",
                        c.grid.hDiv).append(k);
                    b.searchOperators && (a(".soptclass", k).click(function(b) {
                        var c = a(this).offset();
                        h(this, c.left, c.top);
                        b.stopPropagation()
                    }), a("body").on("click", function(b) {
                        "soptclass" !== b.target.className && a("#sopt_menu").hide()
                    }));
                    a(".clearsearchclass", k).click(function(e) {
                        e = a(this).parents("tr:first");
                        var f = parseInt(a("td.ui-search-oper", e).attr("colindex"), 10),
                            g = a.extend({}, c.p.colModel[f].searchoptions || {}),
                            g = g.defaultValue ? g.defaultValue : "";
                        "select" === c.p.colModel[f].stype ? g ? a("td.ui-search-input select",
                            e).val(g) : a("td.ui-search-input select", e)[0].selectedIndex = 0 : a("td.ui-search-input input", e).val(g);
                        !0 === b.autosearch && d()
                    });
                    this.ftoolbar = !0;
                    this.triggerToolbar = d;
                    this.clearToolbar = function(d) {
                        var f = {},
                            g = 0,
                            e;
                        d = "boolean" !== typeof d ? !0 : d;
                        a.each(c.p.colModel, function() {
                            var b, d = a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv);
                            this.searchoptions && void 0 !== this.searchoptions.defaultValue && (b = this.searchoptions.defaultValue);
                            e = this.index || this.name;
                            switch (this.stype) {
                                case "select":
                                    d.find("option").each(function(c) {
                                        0 ===
                                        c && (this.selected = !0);
                                        if (a(this).val() === b) return this.selected = !0, !1
                                    });
                                    if (void 0 !== b) f[e] = b, g++;
                                    else try {
                                        delete c.p.postData[e]
                                    } catch (h) {}
                                    break;
                                case "text":
                                    d.val(b || "");
                                    if (void 0 !== b) f[e] = b, g++;
                                    else try {
                                        delete c.p.postData[e]
                                    } catch (k) {}
                                    break;
                                case "custom":
                                    a.isFunction(this.searchoptions.custom_value) && 0 < d.length && "SPAN" === d[0].nodeName.toUpperCase() && this.searchoptions.custom_value.call(c, d.children(".customelement:first"), "set", b || "")
                            }
                        });
                        var k = 0 < g ? !0 : !1;
                        c.p.resetsearch = !0;
                        if (!0 === b.stringResult ||
                            "local" === c.p.datatype) {
                            var h = '{"groupOp":"' + b.groupOp + '","rules":[',
                                p = 0;
                            a.each(f, function(a, b) {
                                0 < p && (h += ",");
                                h += '{"field":"' + a + '",';
                                h += '"op":"eq",';
                                h += '"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                p++
                            });
                            h += "]}";
                            a.extend(c.p.postData, {
                                filters: h
                            });
                            a.each(["searchField", "searchString", "searchOper"], function(a, b) {
                                c.p.postData.hasOwnProperty(b) && delete c.p.postData[b]
                            })
                        } else a.extend(c.p.postData, f);
                        var l;
                        c.p.searchurl && (l = c.p.url, a(c).jqGrid("setGridParam", {
                            url: c.p.searchurl
                        }));
                        var n =
                            "stop" === a(c).triggerHandler("jqGridToolbarBeforeClear") ? !0 : !1;
                        !n && a.isFunction(b.beforeClear) && (n = b.beforeClear.call(c));
                        n || d && a(c).jqGrid("setGridParam", {
                            search: k
                        }).trigger("reloadGrid", [{
                            page: 1
                        }]);
                        l && a(c).jqGrid("setGridParam", {
                            url: l
                        });
                        a(c).triggerHandler("jqGridToolbarAfterClear");
                        a.isFunction(b.afterClear) && b.afterClear()
                    };
                    this.toggleToolbar = function() {
                        var b = a("tr.ui-search-toolbar", c.grid.hDiv),
                            d = !0 === c.p.frozenColumns ? a("tr.ui-search-toolbar", c.grid.fhDiv) : !1;
                        "none" === b.css("display") ? (b.show(),
                        d && d.show()) : (b.hide(), d && d.hide())
                    }
                }
            })
        },
        destroyFilterToolbar: function() {
            return this.each(function() {
                this.ftoolbar && (this.toggleToolbar = this.clearToolbar = this.triggerToolbar = null, this.ftoolbar = !1, a(this.grid.hDiv).find("table thead tr.ui-search-toolbar").remove())
            })
        },
        destroyGroupHeader: function(b) {
            void 0 === b && (b = !0);
            return this.each(function() {
                var c, d, h, k, e, s;
                d = this.grid;
                var f = a("table.ui-jqgrid-htable thead", d.hDiv),
                    g = this.p.colModel;
                if (d) {
                    a(this).unbind(".setGroupHeaders");
                    c = a("<tr>", {
                        role: "rowheader"
                    }).addClass("ui-jqgrid-labels");
                    k = d.headers;
                    d = 0;
                    for (h = k.length; d < h; d++) {
                        e = g[d].hidden ? "none" : "";
                        e = a(k[d].el).width(k[d].width).css("display", e);
                        try {
                            e.removeAttr("rowSpan")
                        } catch (m) {
                            e.attr("rowSpan", 1)
                        }
                        c.append(e);
                        s = e.children("span.ui-jqgrid-resize");
                        0 < s.length && (s[0].style.height = "");
                        e.children("div")[0].style.top = ""
                    }
                    a(f).children("tr.ui-jqgrid-labels").remove();
                    a(f).prepend(c);
                    !0 === b && a(this).jqGrid("setGridParam", {
                        groupHeader: null
                    })
                }
            })
        },
        setGroupHeaders: function(b) {
            b = a.extend({
                useColSpanStyle: !1,
                groupHeaders: []
            }, b || {});
            return this.each(function() {
                this.p.groupHeader =
                    b;
                var c, d, h = 0,
                    k, e, s, f, g, m = this.p.colModel,
                    x = m.length,
                    q = this.grid.headers,
                    p = a("table.ui-jqgrid-htable", this.grid.hDiv),
                    l = p.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header");
                k = p.children("thead");
                var n = p.find(".jqg-first-row-header");
                void 0 === n[0] ? n = a("<tr>", {
                    role: "row",
                    "aria-hidden": "true"
                }).addClass("jqg-first-row-header").css("height", "auto") : n.empty();
                var r, w = function(a, b) {
                    var c = b.length,
                        d;
                    for (d = 0; d < c; d++)
                        if (b[d].startColumnName === a) return d;
                    return -1
                };
                a(this).prepend(k);
                k = a("<tr>", {
                    role: "rowheader"
                }).addClass("ui-jqgrid-labels jqg-third-row-header");
                for (c = 0; c < x; c++)
                    if (s = q[c].el, f = a(s), d = m[c], e = {
                            height: "0px",
                            width: q[c].width + "px",
                            display: d.hidden ? "none" : ""
                        }, a("<th>", {
                            role: "gridcell"
                        }).css(e).addClass("ui-first-th-" + this.p.direction).appendTo(n), s.style.width = "", e = w(d.name, b.groupHeaders), 0 <= e) {
                        e = b.groupHeaders[e];
                        h = e.numberOfColumns;
                        g = e.titleText;
                        for (e = d = 0; e < h && c + e < x; e++) m[c + e].hidden || d++;
                        e = a("<th>").attr({
                            role: "columnheader"
                        }).addClass("ui-state-default ui-th-column-header ui-th-" +
                            this.p.direction).css({
                            height: "22px",
                            "border-top": "0 none"
                        }).html(g);
                        0 < d && e.attr("colspan", String(d));
                        this.p.headertitles && e.attr("title", e.text());
                        0 === d && e.hide();
                        f.before(e);
                        k.append(s);
                        h -= 1
                    } else 0 === h ? b.useColSpanStyle ? f.attr("rowspan", "2") : (a("<th>", {
                        role: "columnheader"
                    }).addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction).css({
                        display: d.hidden ? "none" : "",
                        "border-top": "0 none"
                    }).insertBefore(f), k.append(s)) : (k.append(s), h--);
                m = a(this).children("thead");
                m.prepend(n);
                k.insertAfter(l);
                p.append(m);
                b.useColSpanStyle && (p.find("span.ui-jqgrid-resize").each(function() {
                    var b = a(this).parent();
                    b.is(":visible") && (this.style.cssText = "height: " + b.height() + "px !important; cursor: col-resize;")
                }), p.find("div.ui-jqgrid-sortable").each(function() {
                    var b = a(this),
                        c = b.parent();
                    c.is(":visible") && c.is(":has(span.ui-jqgrid-resize)") && b.css("top", (c.height() - b.outerHeight()) / 2 + "px")
                }));
                r = m.find("tr.jqg-first-row-header");
                a(this).bind("jqGridResizeStop.setGroupHeaders", function(a, b, c) {
                    r.find("th").eq(c).width(b)
                })
            })
        },
        setFrozenColumns: function() {
            return this.each(function() {
                if (this.grid) {
                    var b = this,
                        c = b.p.colModel,
                        d = 0,
                        h = c.length,
                        k = -1,
                        e = !1;
                    if (!0 !== b.p.subGrid && !0 !== b.p.treeGrid && !0 !== b.p.cellEdit && !b.p.sortable && !b.p.scroll) {
                        b.p.rownumbers && d++;
                        for (b.p.multiselect && d++; d < h;) {
                            if (!0 === c[d].frozen) e = !0, k = d;
                            else break;
                            d++
                        }
                        if (0 <= k && e) {
                            c = b.p.caption ? a(b.grid.cDiv).outerHeight() : 0;
                            d = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).height();
                            b.p.toppager && (c += a(b.grid.topDiv).outerHeight());
                            !0 === b.p.toolbar[0] && "bottom" !==
                            b.p.toolbar[1] && (c += a(b.grid.uDiv).outerHeight());
                            b.grid.fhDiv = a('<div style="position:absolute;left:0px;top:' + c + "px;height:" + d + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
                            b.grid.fbDiv = a('<div style="position:absolute;left:0px;top:' + (parseInt(c, 10) + parseInt(d, 10) + 1) + 'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
                            a("#gview_" + a.jgrid.jqID(b.p.id)).append(b.grid.fhDiv);
                            c = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).clone(!0);
                            if (b.p.groupHeader) {
                                a("tr.jqg-first-row-header, tr.jqg-third-row-header",
                                    c).each(function() {
                                    a("th:gt(" + k + ")", this).remove()
                                });
                                var s = -1,
                                    f = -1,
                                    g, m;
                                a("tr.jqg-second-row-header th", c).each(function() {
                                    g = parseInt(a(this).attr("colspan"), 10);
                                    if (m = parseInt(a(this).attr("rowspan"), 10)) s++, f++;
                                    g && (s += g, f++);
                                    if (s === k) return !1
                                });
                                s !== k && (f = k);
                                a("tr.jqg-second-row-header", c).each(function() {
                                    a("th:gt(" + f + ")", this).remove()
                                })
                            } else a("tr", c).each(function() {
                                a("th:gt(" + k + ")", this).remove()
                            });
                            a(c).width(1);
                            a(b.grid.fhDiv).append(c).mousemove(function(a) {
                                if (b.grid.resizing) return b.grid.dragMove(a), !1
                            });
                            a(b).bind("jqGridResizeStop.setFrozenColumns", function(c, d, e) {
                                c = a(".ui-jqgrid-htable", b.grid.fhDiv);
                                a("th:eq(" + e + ")", c).width(d);
                                c = a(".ui-jqgrid-btable", b.grid.fbDiv);
                                a("tr:first td:eq(" + e + ")", c).width(d)
                            });
                            a(b).bind("jqGridSortCol.setFrozenColumns", function(c, d, e) {
                                c = a("tr.ui-jqgrid-labels:last th:eq(" + b.p.lastsort + ")", b.grid.fhDiv);
                                d = a("tr.ui-jqgrid-labels:last th:eq(" + e + ")", b.grid.fhDiv);
                                a("span.ui-grid-ico-sort", c).addClass("ui-state-disabled");
                                a(c).attr("aria-selected", "false");
                                a("span.ui-icon-" +
                                    b.p.sortorder, d).removeClass("ui-state-disabled");
                                a(d).attr("aria-selected", "true");
                                b.p.viewsortcols[0] || b.p.lastsort === e || (a("span.s-ico", c).hide(), a("span.s-ico", d).show())
                            });
                            a("#gview_" + a.jgrid.jqID(b.p.id)).append(b.grid.fbDiv);
                            a(b.grid.bDiv).scroll(function() {
                                a(b.grid.fbDiv).scrollTop(a(this).scrollTop())
                            });
                            !0 === b.p.hoverrows && a("#" + a.jgrid.jqID(b.p.id)).unbind("mouseover").unbind("mouseout");
                            a(b).bind("jqGridAfterGridComplete.setFrozenColumns", function() {
                                a("#" + a.jgrid.jqID(b.p.id) + "_frozen").remove();
                                a(b.grid.fbDiv).height(a(b.grid.bDiv).height() - 16);
                                var c = a("#" + a.jgrid.jqID(b.p.id)).clone(!0);
                                a("tr[role=row]", c).each(function() {
                                    a("td[role=gridcell]:gt(" + k + ")", this).remove()
                                });
                                a(c).width(1).attr("id", b.p.id + "_frozen");
                                a(b.grid.fbDiv).append(c);
                                !0 === b.p.hoverrows && (a("tr.jqgrow", c).hover(function() {
                                    a(this).addClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).addClass("ui-state-hover")
                                }, function() {
                                    a(this).removeClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" +
                                        a.jgrid.jqID(b.p.id)).removeClass("ui-state-hover")
                                }), a("tr.jqgrow", "#" + a.jgrid.jqID(b.p.id)).hover(function() {
                                    a(this).addClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) + "_frozen").addClass("ui-state-hover")
                                }, function() {
                                    a(this).removeClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) + "_frozen").removeClass("ui-state-hover")
                                }));
                                c = null
                            });
                            b.grid.hDiv.loading || a(b).triggerHandler("jqGridAfterGridComplete");
                            b.p.frozenColumns = !0
                        }
                    }
                }
            })
        },
        destroyFrozenColumns: function() {
            return this.each(function() {
                if (this.grid &&
                    !0 === this.p.frozenColumns) {
                    a(this.grid.fhDiv).remove();
                    a(this.grid.fbDiv).remove();
                    this.grid.fhDiv = null;
                    this.grid.fbDiv = null;
                    a(this).unbind(".setFrozenColumns");
                    if (!0 === this.p.hoverrows) {
                        var b;
                        a("#" + a.jgrid.jqID(this.p.id)).bind("mouseover", function(c) {
                            b = a(c.target).closest("tr.jqgrow");
                            "ui-subgrid" !== a(b).attr("class") && a(b).addClass("ui-state-hover")
                        }).bind("mouseout", function(c) {
                            b = a(c.target).closest("tr.jqgrow");
                            a(b).removeClass("ui-state-hover")
                        })
                    }
                    this.p.frozenColumns = !1
                }
            })
        }
    })
})(jQuery);
(function(a) {
    a.extend(a.jgrid, {
        showModal: function(a) {
            a.w.show()
        },
        closeModal: function(a) {
            a.w.hide().attr("aria-hidden", "true");
            a.o && a.o.remove()
        },
        hideModal: function(d, b) {
            b = a.extend({
                jqm: !0,
                gb: ""
            }, b || {});
            if (b.onClose) {
                var c = b.gb && "string" === typeof b.gb && "#gbox_" === b.gb.substr(0, 6) ? b.onClose.call(a("#" + b.gb.substr(6))[0], d) : b.onClose(d);
                if ("boolean" === typeof c && !c) return
            }
            if (a.fn.jqm && !0 === b.jqm) a(d).attr("aria-hidden", "true").jqmHide();
            else {
                if ("" !== b.gb) try {
                    a(".jqgrid-overlay:first", b.gb).hide()
                } catch (g) {}
                a(d).hide().attr("aria-hidden",
                    "true")
            }
        },
        findPos: function(a) {
            var b = 0,
                c = 0;
            if (a.offsetParent) {
                do b += a.offsetLeft, c += a.offsetTop; while (a = a.offsetParent)
            }
            return [b, c]
        },
        createModal: function(d, b, c, g, e, h, f) {
            c = a.extend(!0, {}, a.jgrid.jqModal || {}, c);
            var k = document.createElement("div"),
                l, m = this;
            f = a.extend({}, f || {});
            l = "rtl" === a(c.gbox).attr("dir") ? !0 : !1;
            k.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
            k.id = d.themodal;
            var n = document.createElement("div");
            n.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
            n.id = d.modalhead;
            a(n).append("<span class='ui-jqdialog-title'>" + c.caption + "</span>");
            var q = a("<a class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function() {
                q.addClass("ui-state-hover")
            }, function() {
                q.removeClass("ui-state-hover")
            }).append("<span class='ui-icon ui-icon-closethick'></span>");
            a(n).append(q);
            l ? (k.dir = "rtl", a(".ui-jqdialog-title", n).css("float", "right"), a(".ui-jqdialog-titlebar-close", n).css("left", "0.3em")) : (k.dir = "ltr", a(".ui-jqdialog-title", n).css("float", "left"), a(".ui-jqdialog-titlebar-close",
                n).css("right", "0.3em"));
            var p = document.createElement("div");
            a(p).addClass("ui-jqdialog-content ui-widget-content").attr("id", d.modalcontent);
            a(p).append(b);
            k.appendChild(p);
            a(k).prepend(n);
            !0 === h ? a("body").append(k) : "string" === typeof h ? a(h).append(k) : a(k).insertBefore(g);
            a(k).css(f);
            void 0 === c.jqModal && (c.jqModal = !0);
            b = {};
            if (a.fn.jqm && !0 === c.jqModal) 0 === c.left && 0 === c.top && c.overlay && (f = [], f = a.jgrid.findPos(e), c.left = f[0] + 4, c.top = f[1] + 4), b.top = c.top + "px", b.left = c.left;
            else if (0 !== c.left || 0 !== c.top) b.left =
                c.left, b.top = c.top + "px";
            a("a.ui-jqdialog-titlebar-close", n).click(function() {
                var b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") || c.onClose,
                    e = a("#" + a.jgrid.jqID(d.themodal)).data("gbox") || c.gbox;
                m.hideModal("#" + a.jgrid.jqID(d.themodal), {
                    gb: e,
                    jqm: c.jqModal,
                    onClose: b
                });
                return !1
            });
            0 !== c.width && c.width || (c.width = 300);
            0 !== c.height && c.height || (c.height = 200);
            c.zIndex || (g = a(g).parents("*[role=dialog]").filter(":first").css("z-index"), c.zIndex = g ? parseInt(g, 10) + 2 : 950);
            g = 0;
            l && b.left && !h && (g = a(c.gbox).width() -
                (isNaN(c.width) ? 0 : parseInt(c.width, 10)) - 8, b.left = parseInt(b.left, 10) + parseInt(g, 10));
            b.left && (b.left += "px");
            a(k).css(a.extend({
                width: isNaN(c.width) ? "auto" : c.width + "px",
                height: isNaN(c.height) ? "auto" : c.height + "px",
                zIndex: c.zIndex,
                overflow: "hidden"
            }, b)).attr({
                tabIndex: "-1",
                role: "dialog",
                "aria-labelledby": d.modalhead,
                "aria-hidden": "true"
            });
            void 0 === c.drag && (c.drag = !0);
            void 0 === c.resize && (c.resize = !0);
            if (c.drag)
                if (a(n).css("cursor", "move"), a.fn.jqDrag) a(k).jqDrag(n);
                else try {
                    a(k).draggable({
                        handle: a("#" +
                            a.jgrid.jqID(n.id))
                    })
                } catch (r) {}
            if (c.resize)
                if (a.fn.jqResize) a(k).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'></div>"), a("#" + a.jgrid.jqID(d.themodal)).jqResize(".jqResize", d.scrollelm ? "#" + a.jgrid.jqID(d.scrollelm) : !1);
                else try {
                    a(k).resizable({
                        handles: "se, sw",
                        alsoResize: d.scrollelm ? "#" + a.jgrid.jqID(d.scrollelm) : !1
                    })
                } catch (s) {}!0 === c.closeOnEscape && a(k).keydown(function(b) {
                27 == b.which && (b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") || c.onClose,
                    m.hideModal("#" + a.jgrid.jqID(d.themodal), {
                        gb: c.gbox,
                        jqm: c.jqModal,
                        onClose: b
                    }))
            })
        },
        viewModal: function(d, b) {
            b = a.extend({
                toTop: !0,
                overlay: 10,
                modal: !1,
                overlayClass: "ui-widget-overlay",
                onShow: a.jgrid.showModal,
                onHide: a.jgrid.closeModal,
                gbox: "",
                jqm: !0,
                jqM: !0
            }, b || {});
            if (a.fn.jqm && !0 === b.jqm) b.jqM ? a(d).attr("aria-hidden", "false").jqm(b).jqmShow() : a(d).attr("aria-hidden", "false").jqmShow();
            else {
                "" !== b.gbox && (a(".jqgrid-overlay:first", b.gbox).show(), a(d).data("gbox", b.gbox));
                a(d).show().attr("aria-hidden",
                    "false");
                try {
                    a(":input:visible", d)[0].focus()
                } catch (c) {}
            }
        },
        info_dialog: function(d, b, c, g) {
            var e = {
                width: 290,
                height: "auto",
                dataheight: "auto",
                drag: !0,
                resize: !1,
                left: 250,
                top: 170,
                zIndex: 1E3,
                jqModal: !0,
                modal: !1,
                closeOnEscape: !0,
                align: "center",
                buttonalign: "center",
                buttons: []
            };
            a.extend(!0, e, a.jgrid.jqModal || {}, {
                caption: "<b>" + d + "</b>"
            }, g || {});
            var h = e.jqModal,
                f = this;
            a.fn.jqm && !h && (h = !1);
            d = "";
            if (0 < e.buttons.length)
                for (g = 0; g < e.buttons.length; g++) void 0 === e.buttons[g].id && (e.buttons[g].id = "info_button_" + g), d +=
                    "<a id='" + e.buttons[g].id + "' class='fm-button ui-state-default ui-corner-all'>" + e.buttons[g].text + "</a>";
            g = isNaN(e.dataheight) ? e.dataheight : e.dataheight + "px";
            b = "<div id='info_id'>" + ("<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" + g + ";" + ("text-align:" + e.align + ";") + "'>" + b + "</div>");
            b += c ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + e.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a id='closedialog' class='fm-button ui-state-default ui-corner-all'>" +
                c + "</a>" + d + "</div>" : "" !== d ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + e.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" + d + "</div>" : "";
            b += "</div>";
            try {
                "false" === a("#info_dialog").attr("aria-hidden") && a.jgrid.hideModal("#info_dialog", {
                    jqm: h
                }), a("#info_dialog").remove()
            } catch (k) {}
            a.jgrid.createModal({
                themodal: "info_dialog",
                modalhead: "info_head",
                modalcontent: "info_content",
                scrollelm: "infocnt"
            }, b, e, "", "", !0);
            d && a.each(e.buttons,
                function(b) {
                    a("#" + a.jgrid.jqID(this.id), "#info_id").bind("click", function() {
                        e.buttons[b].onClick.call(a("#info_dialog"));
                        return !1
                    })
                });
            a("#closedialog", "#info_id").click(function() {
                f.hideModal("#info_dialog", {
                    jqm: h,
                    onClose: a("#info_dialog").data("onClose") || e.onClose,
                    gb: a("#info_dialog").data("gbox") || e.gbox
                });
                return !1
            });
            a(".fm-button", "#info_dialog").hover(function() {
                a(this).addClass("ui-state-hover")
            }, function() {
                a(this).removeClass("ui-state-hover")
            });
            a.isFunction(e.beforeOpen) && e.beforeOpen();
            a.jgrid.viewModal("#info_dialog", {
                onHide: function(a) {
                    a.w.hide().remove();
                    a.o && a.o.remove()
                },
                modal: e.modal,
                jqm: h
            });
            a.isFunction(e.afterOpen) && e.afterOpen();
            try {
                a("#info_dialog").focus()
            } catch (l) {}
        },
        bindEv: function(d, b) {
            a.isFunction(b.dataInit) && b.dataInit.call(this, d, b);
            b.dataEvents && a.each(b.dataEvents, function() {
                void 0 !== this.data ? a(d).bind(this.type, this.data, this.fn) : a(d).bind(this.type, this.fn)
            })
        },
        createEl: function(d, b, c, g, e) {
            function h(b, d, c) {
                var e = "dataInit dataEvents dataUrl buildSelect sopt searchhidden defaultValue attr custom_element custom_value".split(" ");
                void 0 !== c && a.isArray(c) && a.merge(e, c);
                a.each(d, function(d, c) {
                    -1 === a.inArray(d, e) && a(b).attr(d, c)
                });
                d.hasOwnProperty("id") || a(b).attr("id", a.jgrid.randId())
            }
            var f = "",
                k = this;
            switch (d) {
                case "textarea":
                    f = document.createElement("textarea");
                    g ? b.cols || a(f).css({
                            width: "98%"
                        }) : b.cols || (b.cols = 20);
                    b.rows || (b.rows = 2);
                    if ("&nbsp;" === c || "&#160;" === c || 1 === c.length && 160 === c.charCodeAt(0)) c = "";
                    f.value = c;
                    h(f, b);
                    a(f).attr({
                        role: "textbox",
                        multiline: "true"
                    });
                    break;
                case "checkbox":
                    f = document.createElement("input");
                    f.type =
                        "checkbox";
                    b.value ? (d = b.value.split(":"), c === d[0] && (f.checked = !0, f.defaultChecked = !0), f.value = d[0], a(f).attr("offval", d[1])) : (d = (c + "").toLowerCase(), 0 > d.search(/(false|f|0|no|n|off|undefined)/i) && "" !== d ? (f.checked = !0, f.defaultChecked = !0, f.value = c) : f.value = "on", a(f).attr("offval", "off"));
                    h(f, b, ["value"]);
                    a(f).attr("role", "checkbox");
                    break;
                case "select":
                    f = document.createElement("select");
                    f.setAttribute("role", "select");
                    g = [];
                    !0 === b.multiple ? (d = !0, f.multiple = "multiple", a(f).attr("aria-multiselectable",
                        "true")) : d = !1;
                    if (void 0 !== b.dataUrl) {
                        d = b.name ? String(b.id).substring(0, String(b.id).length - String(b.name).length - 1) : String(b.id);
                        var l = b.postData || e.postData;
                        k.p && k.p.idPrefix && (d = a.jgrid.stripPref(k.p.idPrefix, d));
                        a.ajax(a.extend({
                                url: a.isFunction(b.dataUrl) ? b.dataUrl.call(k, d, c, String(b.name)) : b.dataUrl,
                                type: "GET",
                                dataType: "html",
                                data: a.isFunction(l) ? l.call(k, d, c, String(b.name)) : l,
                                context: {
                                    elem: f,
                                    options: b,
                                    vl: c
                                },
                                success: function(b) {
                                    var d = [],
                                        c = this.elem,
                                        e = this.vl,
                                        f = a.extend({}, this.options),
                                        g = !0 ===
                                            f.multiple;
                                    b = a.isFunction(f.buildSelect) ? f.buildSelect.call(k, b) : b;
                                    "string" === typeof b && (b = a(a.trim(b)).html());
                                    b && (a(c).append(b), h(c, f, l ? ["postData"] : void 0), void 0 === f.size && (f.size = g ? 3 : 1), g ? (d = e.split(","), d = a.map(d, function(b) {
                                        return a.trim(b)
                                    })) : d[0] = a.trim(e), setTimeout(function() {
                                        a("option", c).each(function(b) {
                                            0 === b && c.multiple && (this.selected = !1);
                                            a(this).attr("role", "option");
                                            if (-1 < a.inArray(a.trim(a(this).text()), d) || -1 < a.inArray(a.trim(a(this).val()), d)) this.selected = "selected"
                                        })
                                    }, 0))
                                }
                            },
                            e || {}))
                    } else if (b.value) {
                        var m;
                        void 0 === b.size && (b.size = d ? 3 : 1);
                        d && (g = c.split(","), g = a.map(g, function(b) {
                            return a.trim(b)
                        }));
                        "function" === typeof b.value && (b.value = b.value());
                        var n, q, p = void 0 === b.separator ? ":" : b.separator;
                        e = void 0 === b.delimiter ? ";" : b.delimiter;
                        if ("string" === typeof b.value)
                            for (n = b.value.split(e), m = 0; m < n.length; m++) q = n[m].split(p), 2 < q.length && (q[1] = a.map(q, function(a, b) {
                                if (0 < b) return a
                            }).join(p)), e = document.createElement("option"), e.setAttribute("role", "option"), e.value = q[0], e.innerHTML =
                                q[1], f.appendChild(e), d || a.trim(q[0]) !== a.trim(c) && a.trim(q[1]) !== a.trim(c) || (e.selected = "selected"), d && (-1 < a.inArray(a.trim(q[1]), g) || -1 < a.inArray(a.trim(q[0]), g)) && (e.selected = "selected");
                        else if ("object" === typeof b.value)
                            for (m in p = b.value, p) p.hasOwnProperty(m) && (e = document.createElement("option"), e.setAttribute("role", "option"), e.value = m, e.innerHTML = p[m], f.appendChild(e), d || a.trim(m) !== a.trim(c) && a.trim(p[m]) !== a.trim(c) || (e.selected = "selected"), d && (-1 < a.inArray(a.trim(p[m]), g) || -1 < a.inArray(a.trim(m),
                                g)) && (e.selected = "selected"));
                        h(f, b, ["value"])
                    }
                    break;
                case "text":
                case "password":
                case "button":
                    m = "button" === d ? "button" : "textbox";
                    f = document.createElement("input");
                    f.type = d;
                    f.value = c;
                    h(f, b);
                    "button" !== d && (g ? b.size || a(f).css({
                            width: "98%"
                        }) : b.size || (b.size = 20));
                    a(f).attr("role", m);
                    break;
                case "image":
                case "file":
                    f = document.createElement("input");
                    f.type = d;
                    h(f, b);
                    break;
                case "custom":
                    f = document.createElement("span");
                    try {
                        if (a.isFunction(b.custom_element))
                            if (p = b.custom_element.call(k, c, b)) p = a(p).addClass("customelement").attr({
                                id: b.id,
                                name: b.name
                            }), a(f).empty().append(p);
                            else throw "e2";
                        else throw "e1";
                    } catch (r) {
                        "e1" === r && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose), "e2" === r ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, "string" === typeof r ? r : r.message, a.jgrid.edit.bClose)
                    }
            }
            return f
        },
        checkDate: function(a, b) {
            var c = {},
                g;
            a = a.toLowerCase();
            g = -1 !== a.indexOf("/") ?
                "/" : -1 !== a.indexOf("-") ? "-" : -1 !== a.indexOf(".") ? "." : "/";
            a = a.split(g);
            b = b.split(g);
            if (3 !== b.length) return !1;
            var e = -1,
                h, f = g = -1,
                k;
            for (k = 0; k < a.length; k++) h = isNaN(b[k]) ? 0 : parseInt(b[k], 10), c[a[k]] = h, h = a[k], -1 !== h.indexOf("y") && (e = k), -1 !== h.indexOf("m") && (f = k), -1 !== h.indexOf("d") && (g = k);
            h = "y" === a[e] || "yyyy" === a[e] ? 4 : "yy" === a[e] ? 2 : -1;
            k = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var l;
            if (-1 === e) return !1;
            l = c[a[e]].toString();
            2 === h && 1 === l.length && (h = 1);
            if (l.length !== h || 0 === c[a[e]] && "00" !== b[e] || -1 === f) return !1;
            l = c[a[f]].toString();
            if (1 > l.length || 1 > c[a[f]] || 12 < c[a[f]] || -1 === g) return !1;
            l = c[a[g]].toString();
            if (!(h = 1 > l.length) && !(h = 1 > c[a[g]]) && !(h = 31 < c[a[g]])) {
                if (h = 2 === c[a[f]]) e = c[a[e]], h = c[a[g]] > (0 !== e % 4 || 0 === e % 100 && 0 !== e % 400 ? 28 : 29);
                h = h || c[a[g]] > k[c[a[f]]]
            }
            return h ? !1 : !0
        },
        isEmpty: function(a) {
            return a.match(/^\s+$/) || "" === a ? !0 : !1
        },
        checkTime: function(d) {
            var b = /^(\d{1,2}):(\d{2})([apAP][Mm])?$/;
            if (!a.jgrid.isEmpty(d))
                if (d = d.match(b)) {
                    if (d[3]) {
                        if (1 > d[1] || 12 < d[1]) return !1
                    } else if (23 < d[1]) return !1;
                    if (59 < d[2]) return !1
                } else return !1;
            return !0
        },
        checkValues: function(d, b, c, g) {
            var e, h, f;
            f = this.p.colModel;
            if (void 0 === c)
                if ("string" === typeof b)
                    for (c = 0, g = f.length; c < g; c++) {
                        if (f[c].name === b) {
                            e = f[c].editrules;
                            b = c;
                            null != f[c].formoptions && (h = f[c].formoptions.label);
                            break
                        }
                    } else 0 <= b && (e = f[b].editrules);
            else e = c, h = void 0 === g ? "_" : g;
            if (e) {
                h || (h = null != this.p.colNames ? this.p.colNames[b] : f[b].label);
                if (!0 === e.required && a.jgrid.isEmpty(d)) return [!1, h + ": " + a.jgrid.edit.msg.required, ""];
                c = !1 === e.required ? !1 : !0;
                if (!0 === e.number && (!1 !== c || !a.jgrid.isEmpty(d)) &&
                    isNaN(d)) return [!1, h + ": " + a.jgrid.edit.msg.number, ""];
                if (void 0 !== e.minValue && !isNaN(e.minValue) && parseFloat(d) < parseFloat(e.minValue)) return [!1, h + ": " + a.jgrid.edit.msg.minValue + " " + e.minValue, ""];
                if (void 0 !== e.maxValue && !isNaN(e.maxValue) && parseFloat(d) > parseFloat(e.maxValue)) return [!1, h + ": " + a.jgrid.edit.msg.maxValue + " " + e.maxValue, ""];
                if (!(!0 !== e.email || !1 === c && a.jgrid.isEmpty(d) || (g = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                        g.test(d)))) return [!1, h + ": " + a.jgrid.edit.msg.email, ""];
                if (!(!0 !== e.integer || !1 === c && a.jgrid.isEmpty(d) || !isNaN(d) && 0 === d % 1 && -1 === d.indexOf("."))) return [!1, h + ": " + a.jgrid.edit.msg.integer, ""];
                if (!(!0 !== e.date || !1 === c && a.jgrid.isEmpty(d) || (f[b].formatoptions && f[b].formatoptions.newformat ? (f = f[b].formatoptions.newformat, a.jgrid.formatter.date.masks.hasOwnProperty(f) && (f = a.jgrid.formatter.date.masks[f])) : f = f[b].datefmt || "Y-m-d", a.jgrid.checkDate(f, d)))) return [!1, h + ": " + a.jgrid.edit.msg.date + " - " + f,
                    ""
                ];
                if (!0 === e.time && !(!1 === c && a.jgrid.isEmpty(d) || a.jgrid.checkTime(d))) return [!1, h + ": " + a.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""];
                if (!(!0 !== e.url || !1 === c && a.jgrid.isEmpty(d) || (g = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i, g.test(d)))) return [!1, h + ": " + a.jgrid.edit.msg.url, ""];
                if (!0 === e.custom && (!1 !== c || !a.jgrid.isEmpty(d))) return a.isFunction(e.custom_func) ? (d = e.custom_func.call(this, d, h, b), a.isArray(d) ? d : [!1, a.jgrid.edit.msg.customarray,
                    ""
                ]) : [!1, a.jgrid.edit.msg.customfcheck, ""]
            }
            return [!0, "", ""]
        }
    })
})(jQuery);
(function(a) {
    var b = {};
    a.jgrid.extend({
        searchGrid: function(b) {
            b = a.extend(!0, {
                recreateFilter: !1,
                drag: !0,
                sField: "searchField",
                sValue: "searchString",
                sOper: "searchOper",
                sFilter: "filters",
                loadDefaults: !0,
                beforeShowSearch: null,
                afterShowSearch: null,
                onInitializeSearch: null,
                afterRedraw: null,
                afterChange: null,
                closeAfterSearch: !1,
                closeAfterReset: !1,
                closeOnEscape: !1,
                searchOnEnter: !1,
                multipleSearch: !1,
                multipleGroup: !1,
                top: 0,
                left: 0,
                jqModal: !0,
                modal: !1,
                resize: !0,
                width: 450,
                height: "auto",
                dataheight: "auto",
                showQuery: !1,
                errorcheck: !0,
                sopt: null,
                stringResult: void 0,
                onClose: null,
                onSearch: null,
                onReset: null,
                toTop: !0,
                overlay: 30,
                columns: [],
                tmplNames: null,
                tmplFilters: null,
                tmplLabel: " Template: ",
                showOnLoad: !1,
                layer: null,
                operands: {
                    eq: "=",
                    ne: "<>",
                    lt: "<",
                    le: "<=",
                    gt: ">",
                    ge: ">=",
                    bw: "LIKE",
                    bn: "NOT LIKE",
                    "in": "IN",
                    ni: "NOT IN",
                    ew: "LIKE",
                    en: "NOT LIKE",
                    cn: "LIKE",
                    nc: "NOT LIKE",
                    nu: "IS NULL",
                    nn: "ISNOT NULL"
                }
            }, a.jgrid.search, b || {});
            return this.each(function() {
                function c(c) {
                    w = a(e).triggerHandler("jqGridFilterBeforeShow", [c]);
                    void 0 ===
                    w && (w = !0);
                    w && a.isFunction(b.beforeShowSearch) && (w = b.beforeShowSearch.call(e, c));
                    w && (a.jgrid.viewModal("#" + a.jgrid.jqID(s.themodal), {
                        gbox: "#gbox_" + a.jgrid.jqID(h),
                        jqm: b.jqModal,
                        modal: b.modal,
                        overlay: b.overlay,
                        toTop: b.toTop
                    }), a(e).triggerHandler("jqGridFilterAfterShow", [c]), a.isFunction(b.afterShowSearch) && b.afterShowSearch.call(e, c))
                }
                var e = this;
                if (e.grid) {
                    var h = "fbox_" + e.p.id,
                        w = !0,
                        t = !0,
                        s = {
                            themodal: "searchmod" + h,
                            modalhead: "searchhd" + h,
                            modalcontent: "searchcnt" + h,
                            scrollelm: h
                        },
                        r = e.p.postData[b.sFilter];
                    "string" === typeof r && (r = a.jgrid.parse(r));
                    !0 === b.recreateFilter && a("#" + a.jgrid.jqID(s.themodal)).remove();
                    if (void 0 !== a("#" + a.jgrid.jqID(s.themodal))[0]) c(a("#fbox_" + a.jgrid.jqID(+e.p.id)));
                    else {
                        var f = a("<div><div id='" + h + "' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_" + a.jgrid.jqID(e.p.id)),
                            k = "left",
                            u = "";
                        "rtl" === e.p.direction && (k = "right", u = " style='text-align:left'", f.attr("dir", "rtl"));
                        var x = a.extend([], e.p.colModel),
                            d = "<a id='" + h + "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>" +
                                b.Find + "</a>",
                            v = "<a id='" + h + "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" + b.Reset + "</a>",
                            g = "",
                            m = "",
                            p, q = !1,
                            y = -1;
                        b.showQuery && (g = "<a id='" + h + "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>");
                        b.columns.length ? (x = b.columns, y = 0, p = x[0].index || x[0].name) : a.each(x, function(a, b) {
                            b.label || (b.label = e.p.colNames[a]);
                            if (!q) {
                                var c =
                                        void 0 === b.search ? !0 : b.search,
                                    d = !0 === b.hidden;
                                if (b.searchoptions && !0 === b.searchoptions.searchhidden && c || c && !d) q = !0, p = b.index || b.name, y = a
                            }
                        });
                        if (!r && p || !1 === b.multipleSearch) {
                            var D = "eq";
                            0 <= y && x[y].searchoptions && x[y].searchoptions.sopt ? D = x[y].searchoptions.sopt[0] : b.sopt && b.sopt.length && (D = b.sopt[0]);
                            r = {
                                groupOp: "AND",
                                rules: [{
                                    field: p,
                                    op: D,
                                    data: ""
                                }]
                            }
                        }
                        q = !1;
                        b.tmplNames && b.tmplNames.length && (q = !0, m = b.tmplLabel, m += "<select class='ui-template'>", m += "<option value='default'>Default</option>", a.each(b.tmplNames,
                            function(a, b) {
                                m += "<option value='" + a + "'>" + b + "</option>"
                            }), m += "</select>");
                        k = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" + h + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:" + k + "'>" + v + m + "</td><td class='EditButton' " + u + ">" + g + d + "</td></tr></tbody></table>";
                        h = a.jgrid.jqID(h);
                        a("#" + h).jqFilter({
                            columns: x,
                            filter: b.loadDefaults ? r : null,
                            showQuery: b.showQuery,
                            errorcheck: b.errorcheck,
                            sopt: b.sopt,
                            groupButton: b.multipleGroup,
                            ruleButtons: b.multipleSearch,
                            afterRedraw: b.afterRedraw,
                            ops: b.odata,
                            operands: b.operands,
                            ajaxSelectOptions: e.p.ajaxSelectOptions,
                            groupOps: b.groupOps,
                            onChange: function() {
                                this.p.showQuery && a(".query", this).html(this.toUserFriendlyString());
                                a.isFunction(b.afterChange) && b.afterChange.call(e, a("#" + h), b)
                            },
                            direction: e.p.direction,
                            id: e.p.id
                        });
                        f.append(k);
                        q && b.tmplFilters && b.tmplFilters.length && a(".ui-template", f).bind("change", function() {
                            var c = a(this).val();
                            "default" === c ? a("#" + h).jqFilter("addFilter",
                                r) : a("#" + h).jqFilter("addFilter", b.tmplFilters[parseInt(c, 10)]);
                            return !1
                        });
                        !0 === b.multipleGroup && (b.multipleSearch = !0);
                        a(e).triggerHandler("jqGridFilterInitialize", [a("#" + h)]);
                        a.isFunction(b.onInitializeSearch) && b.onInitializeSearch.call(e, a("#" + h));
                        b.gbox = "#gbox_" + h;
                        b.layer ? a.jgrid.createModal(s, f, b, "#gview_" + a.jgrid.jqID(e.p.id), a("#gbox_" + a.jgrid.jqID(e.p.id))[0], "#" + a.jgrid.jqID(b.layer), {
                            position: "relative"
                        }) : a.jgrid.createModal(s, f, b, "#gview_" + a.jgrid.jqID(e.p.id), a("#gbox_" + a.jgrid.jqID(e.p.id))[0]);
                        (b.searchOnEnter || b.closeOnEscape) && a("#" + a.jgrid.jqID(s.themodal)).keydown(function(c) {
                            var d = a(c.target);
                            if (b.searchOnEnter && 13 === c.which && !(d.hasClass("add-group") || d.hasClass("add-rule") || d.hasClass("delete-group") || d.hasClass("delete-rule") || d.hasClass("fm-button") && d.is("[id$=_query]"))) return a("#" + h + "_search").click(), !1;
                            if (b.closeOnEscape && 27 === c.which) return a("#" + a.jgrid.jqID(s.modalhead)).find(".ui-jqdialog-titlebar-close").click(), !1
                        });
                        g && a("#" + h + "_query").bind("click", function() {
                            a(".queryresult",
                                f).toggle();
                            return !1
                        });
                        void 0 === b.stringResult && (b.stringResult = b.multipleSearch);
                        a("#" + h + "_search").bind("click", function() {
                            var c = a("#" + h),
                                d = {},
                                n, g;
                            c.find(".input-elm:focus").change();
                            g = c.jqFilter("filterData");
                            if (b.errorcheck && (c[0].hideError(), b.showQuery || c.jqFilter("toSQLString"), c[0].p.error)) return c[0].showError(), !1;
                            if (b.stringResult) {
                                try {
                                    n = xmlJsonClass.toJson(g, "", "", !1)
                                } catch (f) {
                                    try {
                                        n = JSON.stringify(g)
                                    } catch (k) {}
                                }
                                "string" === typeof n && (d[b.sFilter] = n, a.each([b.sField, b.sValue, b.sOper], function() {
                                    d[this] =
                                        ""
                                }))
                            } else b.multipleSearch ? (d[b.sFilter] = g, a.each([b.sField, b.sValue, b.sOper], function() {
                                d[this] = ""
                            })) : (d[b.sField] = g.rules[0].field, d[b.sValue] = g.rules[0].data, d[b.sOper] = g.rules[0].op, d[b.sFilter] = "");
                            e.p.search = !0;
                            a.extend(e.p.postData, d);
                            t = a(e).triggerHandler("jqGridFilterSearch");
                            void 0 === t && (t = !0);
                            t && a.isFunction(b.onSearch) && (t = b.onSearch.call(e, e.p.filters));
                            !1 !== t && a(e).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            b.closeAfterSearch && a.jgrid.hideModal("#" + a.jgrid.jqID(s.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(e.p.id),
                                jqm: b.jqModal,
                                onClose: b.onClose
                            });
                            return !1
                        });
                        a("#" + h + "_reset").bind("click", function() {
                            var c = {},
                                d = a("#" + h);
                            e.p.search = !1;
                            e.p.resetsearch = !0;
                            !1 === b.multipleSearch ? c[b.sField] = c[b.sValue] = c[b.sOper] = "" : c[b.sFilter] = "";
                            d[0].resetFilter();
                            q && a(".ui-template", f).val("default");
                            a.extend(e.p.postData, c);
                            t = a(e).triggerHandler("jqGridFilterReset");
                            void 0 === t && (t = !0);
                            t && a.isFunction(b.onReset) && (t = b.onReset.call(e));
                            !1 !== t && a(e).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            b.closeAfterReset && a.jgrid.hideModal("#" + a.jgrid.jqID(s.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(e.p.id),
                                jqm: b.jqModal,
                                onClose: b.onClose
                            });
                            return !1
                        });
                        c(a("#" + h));
                        a(".fm-button:not(.ui-state-disabled)", f).hover(function() {
                            a(this).addClass("ui-state-hover")
                        }, function() {
                            a(this).removeClass("ui-state-hover")
                        })
                    }
                }
            })
        },
        editGridRow: function(z, c) {
            c = a.extend(!0, {
                    top: 0,
                    left: 0,
                    width: 300,
                    datawidth: "auto",
                    height: "auto",
                    dataheight: "auto",
                    modal: !1,
                    overlay: 30,
                    drag: !0,
                    resize: !0,
                    url: null,
                    mtype: "POST",
                    clearAfterAdd: !0,
                    closeAfterEdit: !1,
                    reloadAfterSubmit: !0,
                    onInitializeForm: null,
                    beforeInitData: null,
                    beforeShowForm: null,
                    afterShowForm: null,
                    beforeSubmit: null,
                    afterSubmit: null,
                    onclickSubmit: null,
                    afterComplete: null,
                    onclickPgButtons: null,
                    afterclickPgButtons: null,
                    editData: {},
                    recreateForm: !1,
                    jqModal: !0,
                    closeOnEscape: !1,
                    addedrow: "first",
                    topinfo: "",
                    bottominfo: "",
                    saveicon: [],
                    closeicon: [],
                    savekey: [!1, 13],
                    navkeys: [!1, 38, 40],
                    checkOnSubmit: !1,
                    checkOnUpdate: !1,
                    _savedData: {},
                    processing: !1,
                    onClose: null,
                    ajaxEditOptions: {},
                    serializeEditData: null,
                    viewPagerButtons: !0,
                    overlayClass: "ui-widget-overlay"
                }, a.jgrid.edit,
                c || {});
            b[a(this)[0].p.id] = c;
            return this.each(function() {
                function e() {
                    a(p + " > tbody > tr > td > .FormElement").each(function() {
                        var b = a(".customelement", this);
                        if (b.length) {
                            var c = a(b[0]).attr("name");
                            a.each(d.p.colModel, function() {
                                if (this.name === c && this.editoptions && a.isFunction(this.editoptions.custom_value)) {
                                    try {
                                        if (l[c] = this.editoptions.custom_value.call(d, a("#" + a.jgrid.jqID(c), p), "get"), void 0 === l[c]) throw "e1";
                                    } catch (b) {
                                        "e1" === b ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " +
                                            a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, b.message, a.jgrid.edit.bClose)
                                    }
                                    return !0
                                }
                            })
                        } else {
                            switch (a(this).get(0).type) {
                                case "checkbox":
                                    a(this).is(":checked") ? l[this.name] = a(this).val() : (b = a(this).attr("offval"), l[this.name] = b);
                                    break;
                                case "select-one":
                                    l[this.name] = a("option:selected", this).val();
                                    break;
                                case "select-multiple":
                                    l[this.name] = a(this).val();
                                    l[this.name] = l[this.name] ? l[this.name].join(",") : "";
                                    a("option:selected", this).each(function(b, c) {
                                        a(c).text()
                                    });
                                    break;
                                case "password":
                                case "text":
                                case "textarea":
                                case "button":
                                    l[this.name] = a(this).val()
                            }
                            d.p.autoencode && (l[this.name] = a.jgrid.htmlEncode(l[this.name]))
                        }
                    });
                    return !0
                }

                function h(c, e, n, f) {
                    var k, l, p, h = 0,
                        q, m, r, C = [],
                        u = !1,
                        z = "",
                        t;
                    for (t = 1; t <= f; t++) z += "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
                    "_empty" !== c && (u = a(e).jqGrid("getInd", c));
                    a(e.p.colModel).each(function(t) {
                        k = this.name;
                        m = (l = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) ? "style='display:none'" : "";
                        if ("cb" !== k && "subgrid" !== k && !0 === this.editable && "rn" !== k) {
                            if (!1 === u) q = "";
                            else if (k === e.p.ExpandColumn && !0 === e.p.treeGrid) q = a("td[role='gridcell']:eq(" + t + ")", e.rows[u]).text();
                            else {
                                try {
                                    q = a.unformat.call(e, a("td[role='gridcell']:eq(" + t + ")", e.rows[u]), {
                                        rowId: c,
                                        colModel: this
                                    }, t)
                                } catch (w) {
                                    q = this.edittype && "textarea" === this.edittype ? a("td[role='gridcell']:eq(" + t + ")", e.rows[u]).text() : a("td[role='gridcell']:eq(" + t + ")", e.rows[u]).html()
                                }
                                if (!q || "&nbsp;" === q || "&#160;" === q || 1 === q.length && 160 === q.charCodeAt(0)) q =
                                    ""
                            }
                            var s = a.extend({}, this.editoptions || {}, {
                                    id: k,
                                    name: k
                                }),
                                y = a.extend({}, {
                                    elmprefix: "",
                                    elmsuffix: "",
                                    rowabove: !1,
                                    rowcontent: ""
                                }, this.formoptions || {}),
                                v = parseInt(y.rowpos, 10) || h + 1,
                                A = parseInt(2 * (parseInt(y.colpos, 10) || 1), 10);
                            "_empty" === c && s.defaultValue && (q = a.isFunction(s.defaultValue) ? s.defaultValue.call(d) : s.defaultValue);
                            this.edittype || (this.edittype = "text");
                            d.p.autoencode && (q = a.jgrid.htmlDecode(q));
                            r = a.jgrid.createEl.call(d, this.edittype, s, q, !1, a.extend({}, a.jgrid.ajaxOptions, e.p.ajaxSelectOptions || {}));
                            if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) b[d.p.id]._savedData[k] = q;
                            a(r).addClass("FormElement"); - 1 < a.inArray(this.edittype, ["text", "textarea", "password", "select"]) && a(r).addClass("ui-widget-content ui-corner-all");
                            p = a(n).find("tr[rowpos=" + v + "]");
                            if (y.rowabove) {
                                var x = a("<tr><td class='contentinfo' colspan='" + 2 * f + "'>" + y.rowcontent + "</td></tr>");
                                a(n).append(x);
                                x[0].rp = v
                            }
                            0 === p.length && (p = a("<tr " + m + " rowpos='" + v + "'></tr>").addClass("FormData").attr("id", "tr_" + k), a(p).append(z), a(n).append(p),
                                p[0].rp = v);
                            a("td:eq(" + (A - 2) + ")", p[0]).html(void 0 === y.label ? e.p.colNames[t] : y.label);
                            a("td:eq(" + (A - 1) + ")", p[0]).append(y.elmprefix).append(r).append(y.elmsuffix);
                            "custom" === this.edittype && a.isFunction(s.custom_value) && s.custom_value.call(d, a("#" + k, "#" + g), "set", q);
                            a.jgrid.bindEv.call(d, r, s);
                            C[h] = t;
                            h++
                        }
                    });
                    0 < h && (t = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (2 * f - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" + e.p.id + "_id' value='" +
                        c + "'/></td></tr>"), t[0].rp = h + 999, a(n).append(t), b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) && (b[d.p.id]._savedData[e.p.id + "_id"] = c);
                    return C
                }

                function w(c, e, n) {
                    var g, k = 0,
                        f, l, q, h, r;
                    if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) b[d.p.id]._savedData = {}, b[d.p.id]._savedData[e.p.id + "_id"] = c;
                    var m = e.p.colModel;
                    if ("_empty" === c) a(m).each(function() {
                        g = this.name;
                        q = a.extend({}, this.editoptions || {});
                        (l = a("#" + a.jgrid.jqID(g), "#" + n)) && l.length && null !== l[0] && (h = "", "custom" === this.edittype && a.isFunction(q.custom_value) ?
                            q.custom_value.call(d, a("#" + g, "#" + n), "set", h) : q.defaultValue ? (h = a.isFunction(q.defaultValue) ? q.defaultValue.call(d) : q.defaultValue, "checkbox" === l[0].type ? (r = h.toLowerCase(), 0 > r.search(/(false|f|0|no|n|off|undefined)/i) && "" !== r ? (l[0].checked = !0, l[0].defaultChecked = !0, l[0].value = h) : (l[0].checked = !1, l[0].defaultChecked = !1)) : l.val(h)) : "checkbox" === l[0].type ? (l[0].checked = !1, l[0].defaultChecked = !1, h = a(l).attr("offval")) : l[0].type && "select" === l[0].type.substr(0, 6) ? l[0].selectedIndex = 0 : l.val(h), !0 === b[d.p.id].checkOnSubmit ||
                        b[d.p.id].checkOnUpdate) && (b[d.p.id]._savedData[g] = h)
                    }), a("#id_g", "#" + n).val(c);
                    else {
                        var t = a(e).jqGrid("getInd", c, !0);
                        t && (a('td[role="gridcell"]', t).each(function(l) {
                            g = m[l].name;
                            if ("cb" !== g && "subgrid" !== g && "rn" !== g && !0 === m[l].editable) {
                                if (g === e.p.ExpandColumn && !0 === e.p.treeGrid) f = a(this).text();
                                else try {
                                    f = a.unformat.call(e, a(this), {
                                        rowId: c,
                                        colModel: m[l]
                                    }, l)
                                } catch (q) {
                                    f = "textarea" === m[l].edittype ? a(this).text() : a(this).html()
                                }
                                d.p.autoencode && (f = a.jgrid.htmlDecode(f));
                                if (!0 === b[d.p.id].checkOnSubmit ||
                                    b[d.p.id].checkOnUpdate) b[d.p.id]._savedData[g] = f;
                                g = a.jgrid.jqID(g);
                                switch (m[l].edittype) {
                                    case "password":
                                    case "text":
                                    case "button":
                                    case "image":
                                    case "textarea":
                                        if ("&nbsp;" === f || "&#160;" === f || 1 === f.length && 160 === f.charCodeAt(0)) f = "";
                                        a("#" + g, "#" + n).val(f);
                                        break;
                                    case "select":
                                        var h = f.split(","),
                                            h = a.map(h, function(b) {
                                                return a.trim(b)
                                            });
                                        a("#" + g + " option", "#" + n).each(function() {
                                            m[l].editoptions.multiple || a.trim(f) !== a.trim(a(this).text()) && h[0] !== a.trim(a(this).text()) && h[0] !== a.trim(a(this).val()) ? m[l].editoptions.multiple ?
                                                -1 < a.inArray(a.trim(a(this).text()), h) || -1 < a.inArray(a.trim(a(this).val()), h) ? this.selected = !0 : this.selected = !1 : this.selected = !1 : this.selected = !0
                                        });
                                        break;
                                    case "checkbox":
                                        f = String(f);
                                        if (m[l].editoptions && m[l].editoptions.value)
                                            if (m[l].editoptions.value.split(":")[0] === f) a("#" + g, "#" + n)[d.p.useProp ? "prop" : "attr"]({
                                                checked: !0,
                                                defaultChecked: !0
                                            });
                                            else a("#" + g, "#" + n)[d.p.useProp ? "prop" : "attr"]({
                                                checked: !1,
                                                defaultChecked: !1
                                            });
                                        else f = f.toLowerCase(), 0 > f.search(/(false|f|0|no|n|off|undefined)/i) && "" !== f ? (a("#" +
                                            g, "#" + n)[d.p.useProp ? "prop" : "attr"]("checked", !0), a("#" + g, "#" + n)[d.p.useProp ? "prop" : "attr"]("defaultChecked", !0)) : (a("#" + g, "#" + n)[d.p.useProp ? "prop" : "attr"]("checked", !1), a("#" + g, "#" + n)[d.p.useProp ? "prop" : "attr"]("defaultChecked", !1));
                                        break;
                                    case "custom":
                                        try {
                                            if (m[l].editoptions && a.isFunction(m[l].editoptions.custom_value)) m[l].editoptions.custom_value.call(d, a("#" + g, "#" + n), "set", f);
                                            else throw "e1";
                                        } catch (p) {
                                            "e1" === p ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined,
                                                a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, p.message, a.jgrid.edit.bClose)
                                        }
                                }
                                k++
                            }
                        }), 0 < k && a("#id_g", p).val(c))
                    }
                }

                function t() {
                    a.each(d.p.colModel, function(a, b) {
                        b.editoptions && !0 === b.editoptions.NullIfEmpty && l.hasOwnProperty(b.name) && "" === l[b.name] && (l[b.name] = "null")
                    })
                }

                function s() {
                    var e, n = [!0, "", ""],
                        f = {},
                        k = d.p.prmNames,
                        h, m, r, u, s, C = a(d).triggerHandler("jqGridAddEditBeforeCheckValues", [a("#" + g), B]);
                    C && "object" === typeof C && (l = C);
                    a.isFunction(b[d.p.id].beforeCheckValues) && (C = b[d.p.id].beforeCheckValues.call(d,
                        l, a("#" + g), B)) && "object" === typeof C && (l = C);
                    for (r in l)
                        if (l.hasOwnProperty(r) && (n = a.jgrid.checkValues.call(d, l[r], r), !1 === n[0])) break;
                    t();
                    n[0] && (f = a(d).triggerHandler("jqGridAddEditClickSubmit", [b[d.p.id], l, B]), void 0 === f && a.isFunction(b[d.p.id].onclickSubmit) && (f = b[d.p.id].onclickSubmit.call(d, b[d.p.id], l, B) || {}), n = a(d).triggerHandler("jqGridAddEditBeforeSubmit", [l, a("#" + g), B]), void 0 === n && (n = [!0, "", ""]), n[0] && a.isFunction(b[d.p.id].beforeSubmit) && (n = b[d.p.id].beforeSubmit.call(d, l, a("#" + g), B)));
                    if (n[0] && !b[d.p.id].processing) {
                        b[d.p.id].processing = !0;
                        a("#sData", p + "_2").addClass("ui-state-active");
                        m = k.oper;
                        h = k.id;
                        l[m] = "_empty" === a.trim(l[d.p.id + "_id"]) ? k.addoper : k.editoper;
                        l[m] !== k.addoper ? l[h] = l[d.p.id + "_id"] : void 0 === l[h] && (l[h] = l[d.p.id + "_id"]);
                        delete l[d.p.id + "_id"];
                        l = a.extend(l, b[d.p.id].editData, f);
                        if (!0 === d.p.treeGrid)
                            for (s in l[m] === k.addoper && (u = a(d).jqGrid("getGridParam", "selrow"), l["adjacency" === d.p.treeGridModel ? d.p.treeReader.parent_id_field : "parent_id"] = u), d.p.treeReader) d.p.treeReader.hasOwnProperty(s) &&
                            (f = d.p.treeReader[s], !l.hasOwnProperty(f) || l[m] === k.addoper && "parent_id_field" === s || delete l[f]);
                        l[h] = a.jgrid.stripPref(d.p.idPrefix, l[h]);
                        s = a.extend({
                            url: b[d.p.id].url || a(d).jqGrid("getGridParam", "editurl"),
                            type: b[d.p.id].mtype,
                            data: a.isFunction(b[d.p.id].serializeEditData) ? b[d.p.id].serializeEditData.call(d, l) : l,
                            complete: function(f, r) {
                                var s;
                                l[h] = d.p.idPrefix + l[h];
                                300 <= f.status && 304 !== f.status ? (n[0] = !1, n[1] = a(d).triggerHandler("jqGridAddEditErrorTextFormat", [f, B]), a.isFunction(b[d.p.id].errorTextFormat) ?
                                    n[1] = b[d.p.id].errorTextFormat.call(d, f, B) : n[1] = r + " Status: '" + f.statusText + "'. Error code: " + f.status) : (n = a(d).triggerHandler("jqGridAddEditAfterSubmit", [f, l, B]), void 0 === n && (n = [!0, "", ""]), n[0] && a.isFunction(b[d.p.id].afterSubmit) && (n = b[d.p.id].afterSubmit.call(d, f, l, B)));
                                if (!1 === n[0]) a("#FormError>td", p).html(n[1]), a("#FormError", p).show();
                                else if (d.p.autoencode && a.each(l, function(b, c) {
                                        l[b] = a.jgrid.htmlDecode(c)
                                    }), l[m] === k.addoper ? (n[2] || (n[2] = a.jgrid.randId()), l[h] = n[2], b[d.p.id].reloadAfterSubmit ?
                                        a(d).trigger("reloadGrid") : !0 === d.p.treeGrid ? a(d).jqGrid("addChildNode", n[2], u, l) : a(d).jqGrid("addRowData", n[2], l, c.addedrow), b[d.p.id].closeAfterAdd ? (!0 !== d.p.treeGrid && a(d).jqGrid("setSelection", n[2]), a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                        gb: "#gbox_" + a.jgrid.jqID(v),
                                        jqm: c.jqModal,
                                        onClose: b[d.p.id].onClose
                                    })) : b[d.p.id].clearAfterAdd && w("_empty", d, g)) : (b[d.p.id].reloadAfterSubmit ? (a(d).trigger("reloadGrid"), b[d.p.id].closeAfterEdit || setTimeout(function() {
                                            a(d).jqGrid("setSelection", l[h])
                                        },
                                        1E3)) : !0 === d.p.treeGrid ? a(d).jqGrid("setTreeRow", l[h], l) : a(d).jqGrid("setRowData", l[h], l), b[d.p.id].closeAfterEdit && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                        gb: "#gbox_" + a.jgrid.jqID(v),
                                        jqm: c.jqModal,
                                        onClose: b[d.p.id].onClose
                                    })), a.isFunction(b[d.p.id].afterComplete) && (e = f, setTimeout(function() {
                                        a(d).triggerHandler("jqGridAddEditAfterComplete", [e, l, a("#" + g), B]);
                                        b[d.p.id].afterComplete.call(d, e, l, a("#" + g), B);
                                        e = null
                                    }, 500)), b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate)
                                    if (a("#" + g).data("disabled", !1), "_empty" !== b[d.p.id]._savedData[d.p.id + "_id"])
                                        for (s in b[d.p.id]._savedData) b[d.p.id]._savedData.hasOwnProperty(s) && l[s] && (b[d.p.id]._savedData[s] = l[s]);
                                b[d.p.id].processing = !1;
                                a("#sData", p + "_2").removeClass("ui-state-active");
                                try {
                                    a(":input:visible", "#" + g)[0].focus()
                                } catch (t) {}
                            }
                        }, a.jgrid.ajaxOptions, b[d.p.id].ajaxEditOptions);
                        s.url || b[d.p.id].useDataProxy || (a.isFunction(d.p.dataProxy) ? b[d.p.id].useDataProxy = !0 : (n[0] = !1, n[1] += " " + a.jgrid.errors.nourl));
                        n[0] && (b[d.p.id].useDataProxy ? (f = d.p.dataProxy.call(d,
                            s, "set_" + d.p.id), void 0 === f && (f = [!0, ""]), !1 === f[0] ? (n[0] = !1, n[1] = f[1] || "Error deleting the selected row!") : (s.data.oper === k.addoper && b[d.p.id].closeAfterAdd && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                            gb: "#gbox_" + a.jgrid.jqID(v),
                            jqm: c.jqModal,
                            onClose: b[d.p.id].onClose
                        }), s.data.oper === k.editoper && b[d.p.id].closeAfterEdit && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                            gb: "#gbox_" + a.jgrid.jqID(v),
                            jqm: c.jqModal,
                            onClose: b[d.p.id].onClose
                        }))) : a.ajax(s))
                    }!1 === n[0] && (a("#FormError>td", p).html(n[1]),
                        a("#FormError", p).show())
                }

                function r(a, b) {
                    var c = !1,
                        d;
                    for (d in a)
                        if (a.hasOwnProperty(d) && a[d] != b[d]) {
                            c = !0;
                            break
                        }
                    return c
                }

                function f() {
                    var c = !0;
                    a("#FormError", p).hide();
                    b[d.p.id].checkOnUpdate && (l = {}, e(), M = r(l, b[d.p.id]._savedData)) && (a("#" + g).data("disabled", !0), a(".confirm", "#" + q.themodal).show(), c = !1);
                    return c
                }

                function k() {
                    var b;
                    if ("_empty" !== z && void 0 !== d.p.savedRow && 0 < d.p.savedRow.length && a.isFunction(a.fn.jqGrid.restoreRow))
                        for (b = 0; b < d.p.savedRow.length; b++)
                            if (d.p.savedRow[b].id == z) {
                                a(d).jqGrid("restoreRow",
                                    z);
                                break
                            }
                }

                function u(b, c) {
                    var d = c[1].length - 1;
                    0 === b ? a("#pData", p + "_2").addClass("ui-state-disabled") : void 0 !== c[1][b - 1] && a("#" + a.jgrid.jqID(c[1][b - 1])).hasClass("ui-state-disabled") ? a("#pData", p + "_2").addClass("ui-state-disabled") : a("#pData", p + "_2").removeClass("ui-state-disabled");
                    b === d ? a("#nData", p + "_2").addClass("ui-state-disabled") : void 0 !== c[1][b + 1] && a("#" + a.jgrid.jqID(c[1][b + 1])).hasClass("ui-state-disabled") ? a("#nData", p + "_2").addClass("ui-state-disabled") : a("#nData", p + "_2").removeClass("ui-state-disabled")
                }

                function x() {
                    var b = a(d).jqGrid("getDataIDs"),
                        c = a("#id_g", p).val();
                    return [a.inArray(c, b), b]
                }
                var d = this;
                if (d.grid && z) {
                    var v = d.p.id,
                        g = "FrmGrid_" + v,
                        m = "TblGrid_" + v,
                        p = "#" + a.jgrid.jqID(m),
                        q = {
                            themodal: "editmod" + v,
                            modalhead: "edithd" + v,
                            modalcontent: "editcnt" + v,
                            scrollelm: g
                        },
                        y = a.isFunction(b[d.p.id].beforeShowForm) ? b[d.p.id].beforeShowForm : !1,
                        D = a.isFunction(b[d.p.id].afterShowForm) ? b[d.p.id].afterShowForm : !1,
                        A = a.isFunction(b[d.p.id].beforeInitData) ? b[d.p.id].beforeInitData : !1,
                        E = a.isFunction(b[d.p.id].onInitializeForm) ?
                            b[d.p.id].onInitializeForm : !1,
                        n = !0,
                        C = 1,
                        I = 0,
                        l, M, B, g = a.jgrid.jqID(g);
                    "new" === z ? (z = "_empty", B = "add", c.caption = b[d.p.id].addCaption) : (c.caption = b[d.p.id].editCaption, B = "edit");
                    c.recreateForm || a(d).data("formProp") && a.extend(b[a(this)[0].p.id], a(d).data("formProp"));
                    var N = !0;
                    c.checkOnUpdate && c.jqModal && !c.modal && (N = !1);
                    var H = isNaN(b[a(this)[0].p.id].dataheight) ? b[a(this)[0].p.id].dataheight : b[a(this)[0].p.id].dataheight + "px",
                        n = isNaN(b[a(this)[0].p.id].datawidth) ? b[a(this)[0].p.id].datawidth : b[a(this)[0].p.id].datawidth +
                            "px",
                        H = a("<form name='FormPost' id='" + g + "' class='FormGrid' onSubmit='return false;' style='width:" + n + ";overflow:auto;position:relative;height:" + H + ";'></form>").data("disabled", !1),
                        F = a("<table id='" + m + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                        n = a(d).triggerHandler("jqGridAddEditBeforeInitData", [a("#" + g), B]);
                    void 0 === n && (n = !0);
                    n && A && (n = A.call(d, a("#" + g), B));
                    if (!1 !== n) {
                        k();
                        a(d.p.colModel).each(function() {
                            var a = this.formoptions;
                            C = Math.max(C, a ? a.colpos ||
                                0 : 0);
                            I = Math.max(I, a ? a.rowpos || 0 : 0)
                        });
                        a(H).append(F);
                        A = a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" + 2 * C + "'></td></tr>");
                        A[0].rp = 0;
                        a(F).append(A);
                        A = a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" + 2 * C + "'>" + b[d.p.id].topinfo + "</td></tr>");
                        A[0].rp = 0;
                        a(F).append(A);
                        var n = (A = "rtl" === d.p.direction ? !0 : !1) ? "nData" : "pData",
                            G = A ? "pData" : "nData";
                        h(z, d, F, C);
                        var n = "<a id='" + n + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
                            G = "<a id='" + G + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
                            J = "<a id='sData' class='fm-button ui-state-default ui-corner-all'>" + c.bSubmit + "</a>",
                            K = "<a id='cData' class='fm-button ui-state-default ui-corner-all'>" + c.bCancel + "</a>",
                            m = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + m + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" +
                                (A ? G + n : n + G) + "</td><td class='EditButton'>" + J + K + "</td></tr>" + ("<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + b[d.p.id].bottominfo + "</td></tr>"),
                            m = m + "</tbody></table>";
                        if (0 < I) {
                            var L = [];
                            a.each(a(F)[0].rows, function(a, b) {
                                L[a] = b
                            });
                            L.sort(function(a, b) {
                                return a.rp > b.rp ? 1 : a.rp < b.rp ? -1 : 0
                            });
                            a.each(L, function(b, c) {
                                a("tbody", F).append(c)
                            })
                        }
                        c.gbox = "#gbox_" + a.jgrid.jqID(v);
                        var O = !1;
                        !0 === c.closeOnEscape && (c.closeOnEscape = !1, O = !0);
                        m = a("<div></div>").append(H).append(m);
                        a.jgrid.createModal(q,
                            m, b[a(this)[0].p.id], "#gview_" + a.jgrid.jqID(d.p.id), a("#gbox_" + a.jgrid.jqID(d.p.id))[0]);
                        A && (a("#pData, #nData", p + "_2").css("float", "right"), a(".EditButton", p + "_2").css("text-align", "left"));
                        b[d.p.id].topinfo && a(".tinfo", p).show();
                        b[d.p.id].bottominfo && a(".binfo", p + "_2").show();
                        m = m = null;
                        a("#" + a.jgrid.jqID(q.themodal)).keydown(function(e) {
                            var n = e.target;
                            if (!0 === a("#" + g).data("disabled")) return !1;
                            if (!0 === b[d.p.id].savekey[0] && e.which === b[d.p.id].savekey[1] && "TEXTAREA" !== n.tagName) return a("#sData",
                                p + "_2").trigger("click"), !1;
                            if (27 === e.which) {
                                if (!f()) return !1;
                                O && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                    gb: c.gbox,
                                    jqm: c.jqModal,
                                    onClose: b[d.p.id].onClose
                                });
                                return !1
                            }
                            if (!0 === b[d.p.id].navkeys[0]) {
                                if ("_empty" === a("#id_g", p).val()) return !0;
                                if (e.which === b[d.p.id].navkeys[1]) return a("#pData", p + "_2").trigger("click"), !1;
                                if (e.which === b[d.p.id].navkeys[2]) return a("#nData", p + "_2").trigger("click"), !1
                            }
                        });
                        c.checkOnUpdate && (a("a.ui-jqdialog-titlebar-close span", "#" + a.jgrid.jqID(q.themodal)).removeClass("jqmClose"),
                            a("a.ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(q.themodal)).unbind("click").click(function() {
                                if (!f()) return !1;
                                a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                    gb: "#gbox_" + a.jgrid.jqID(v),
                                    jqm: c.jqModal,
                                    onClose: b[d.p.id].onClose
                                });
                                return !1
                            }));
                        c.saveicon = a.extend([!0, "left", "ui-icon-disk"], c.saveicon);
                        c.closeicon = a.extend([!0, "left", "ui-icon-close"], c.closeicon);
                        !0 === c.saveicon[0] && a("#sData", p + "_2").addClass("right" === c.saveicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " +
                            c.saveicon[2] + "'></span>");
                        !0 === c.closeicon[0] && a("#cData", p + "_2").addClass("right" === c.closeicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.closeicon[2] + "'></span>");
                        if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) J = "<a id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + c.bYes + "</a>", G = "<a id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + c.bNo + "</a>", K = "<a id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" +
                            c.bExit + "</a>", m = c.zIndex || 999, m++, a("<div class='" + c.overlayClass + " jqgrid-overlay confirm' style='z-index:" + m + ";display:none;'>&#160;</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:" + (m + 1) + "'>" + c.saveData + "<br/><br/>" + J + G + K + "</div>").insertAfter("#" + g), a("#sNew", "#" + a.jgrid.jqID(q.themodal)).click(function() {
                            s();
                            a("#" + g).data("disabled", !1);
                            a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide();
                            return !1
                        }), a("#nNew", "#" + a.jgrid.jqID(q.themodal)).click(function() {
                            a(".confirm",
                                "#" + a.jgrid.jqID(q.themodal)).hide();
                            a("#" + g).data("disabled", !1);
                            setTimeout(function() {
                                a(":input:visible", "#" + g)[0].focus()
                            }, 0);
                            return !1
                        }), a("#cNew", "#" + a.jgrid.jqID(q.themodal)).click(function() {
                            a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide();
                            a("#" + g).data("disabled", !1);
                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(v),
                                jqm: c.jqModal,
                                onClose: b[d.p.id].onClose
                            });
                            return !1
                        });
                        a(d).triggerHandler("jqGridAddEditInitializeForm", [a("#" + g), B]);
                        E && E.call(d, a("#" + g), B);
                        "_empty" !==
                        z && b[d.p.id].viewPagerButtons ? a("#pData,#nData", p + "_2").show() : a("#pData,#nData", p + "_2").hide();
                        a(d).triggerHandler("jqGridAddEditBeforeShowForm", [a("#" + g), B]);
                        y && y.call(d, a("#" + g), B);
                        a("#" + a.jgrid.jqID(q.themodal)).data("onClose", b[d.p.id].onClose);
                        a.jgrid.viewModal("#" + a.jgrid.jqID(q.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(v),
                            jqm: c.jqModal,
                            overlay: c.overlay,
                            modal: c.modal,
                            overlayClass: c.overlayClass,
                            onHide: function(b) {
                                a(d).data("formProp", {
                                    top: parseFloat(a(b.w).css("top")),
                                    left: parseFloat(a(b.w).css("left")),
                                    width: a(b.w).width(),
                                    height: a(b.w).height(),
                                    dataheight: a("#" + g).height(),
                                    datawidth: a("#" + g).width()
                                });
                                b.w.remove();
                                b.o && b.o.remove()
                            }
                        });
                        N || a("." + a.jgrid.jqID(c.overlayClass)).click(function() {
                            if (!f()) return !1;
                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(v),
                                jqm: c.jqModal,
                                onClose: b[d.p.id].onClose
                            });
                            return !1
                        });
                        a(".fm-button", "#" + a.jgrid.jqID(q.themodal)).hover(function() {
                            a(this).addClass("ui-state-hover")
                        }, function() {
                            a(this).removeClass("ui-state-hover")
                        });
                        a("#sData", p + "_2").click(function() {
                            l = {};
                            a("#FormError", p).hide();
                            e();
                            "_empty" === l[d.p.id + "_id"] ? s() : !0 === c.checkOnSubmit ? (M = r(l, b[d.p.id]._savedData)) ? (a("#" + g).data("disabled", !0), a(".confirm", "#" + a.jgrid.jqID(q.themodal)).show()) : s() : s();
                            return !1
                        });
                        a("#cData", p + "_2").click(function() {
                            if (!f()) return !1;
                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(v),
                                jqm: c.jqModal,
                                onClose: b[d.p.id].onClose
                            });
                            return !1
                        });
                        a("#nData", p + "_2").click(function() {
                            if (!f()) return !1;
                            a("#FormError", p).hide();
                            var b = x();
                            b[0] = parseInt(b[0],
                                10);
                            if (-1 !== b[0] && b[1][b[0] + 1]) {
                                a(d).triggerHandler("jqGridAddEditClickPgButtons", ["next", a("#" + g), b[1][b[0]]]);
                                var e;
                                if (a.isFunction(c.onclickPgButtons) && (e = c.onclickPgButtons.call(d, "next", a("#" + g), b[1][b[0]]), void 0 !== e && !1 === e) || a("#" + a.jgrid.jqID(b[1][b[0] + 1])).hasClass("ui-state-disabled")) return !1;
                                w(b[1][b[0] + 1], d, g);
                                a(d).jqGrid("setSelection", b[1][b[0] + 1]);
                                a(d).triggerHandler("jqGridAddEditAfterClickPgButtons", ["next", a("#" + g), b[1][b[0]]]);
                                a.isFunction(c.afterclickPgButtons) && c.afterclickPgButtons.call(d,
                                    "next", a("#" + g), b[1][b[0] + 1]);
                                u(b[0] + 1, b)
                            }
                            return !1
                        });
                        a("#pData", p + "_2").click(function() {
                            if (!f()) return !1;
                            a("#FormError", p).hide();
                            var b = x();
                            if (-1 !== b[0] && b[1][b[0] - 1]) {
                                a(d).triggerHandler("jqGridAddEditClickPgButtons", ["prev", a("#" + g), b[1][b[0]]]);
                                var e;
                                if (a.isFunction(c.onclickPgButtons) && (e = c.onclickPgButtons.call(d, "prev", a("#" + g), b[1][b[0]]), void 0 !== e && !1 === e) || a("#" + a.jgrid.jqID(b[1][b[0] - 1])).hasClass("ui-state-disabled")) return !1;
                                w(b[1][b[0] - 1], d, g);
                                a(d).jqGrid("setSelection", b[1][b[0] - 1]);
                                a(d).triggerHandler("jqGridAddEditAfterClickPgButtons", ["prev", a("#" + g), b[1][b[0]]]);
                                a.isFunction(c.afterclickPgButtons) && c.afterclickPgButtons.call(d, "prev", a("#" + g), b[1][b[0] - 1]);
                                u(b[0] - 1, b)
                            }
                            return !1
                        });
                        a(d).triggerHandler("jqGridAddEditAfterShowForm", [a("#" + g), B]);
                        D && D.call(d, a("#" + g), B);
                        y = x();
                        u(y[0], y)
                    }
                }
            })
        },
        viewGridRow: function(z, c) {
            c = a.extend(!0, {
                top: 0,
                left: 0,
                width: 0,
                datawidth: "auto",
                height: "auto",
                dataheight: "auto",
                modal: !1,
                overlay: 30,
                drag: !0,
                resize: !0,
                jqModal: !0,
                closeOnEscape: !1,
                labelswidth: "30%",
                closeicon: [],
                navkeys: [!1, 38, 40],
                onClose: null,
                beforeShowForm: null,
                beforeInitData: null,
                viewPagerButtons: !0,
                recreateForm: !1
            }, a.jgrid.view, c || {});
            b[a(this)[0].p.id] = c;
            return this.each(function() {
                function e() {
                    !0 !== b[r.p.id].closeOnEscape && !0 !== b[r.p.id].navkeys[0] || setTimeout(function() {
                        a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(v.modalhead)).focus()
                    }, 0)
                }

                function h(b, d, e, f) {
                    var g, k, h, q = 0,
                        m, p, r = [],
                        s = !1,
                        t, u = "<td class='CaptionTD form-view-label ui-widget-content' width='" + c.labelswidth + "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>",
                        y = "",
                        z = ["integer", "number", "currency"],
                        v = 0,
                        w = 0,
                        A, x, D;
                    for (t = 1; t <= f; t++) y += 1 === t ? u : "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>";
                    a(d.p.colModel).each(function() {
                        (k = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) || "right" !== this.align || (this.formatter && -1 !== a.inArray(this.formatter, z) ? v = Math.max(v, parseInt(this.width, 10)) : w = Math.max(w, parseInt(this.width, 10)))
                    });
                    A = 0 !== v ? v : 0 !== w ? w : 0;
                    s = a(d).jqGrid("getInd",
                        b);
                    a(d.p.colModel).each(function(b) {
                        g = this.name;
                        x = !1;
                        p = (k = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) ? "style='display:none'" : "";
                        D = "boolean" !== typeof this.viewable ? !0 : this.viewable;
                        if ("cb" !== g && "subgrid" !== g && "rn" !== g && D) {
                            m = !1 === s ? "" : g === d.p.ExpandColumn && !0 === d.p.treeGrid ? a("td:eq(" + b + ")", d.rows[s]).text() : a("td:eq(" + b + ")", d.rows[s]).html();
                            x = "right" === this.align && 0 !== A ? !0 : !1;
                            var c = a.extend({}, {
                                    rowabove: !1,
                                    rowcontent: ""
                                }, this.formoptions || {}),
                                n = parseInt(c.rowpos, 10) ||
                                    q + 1,
                                t = parseInt(2 * (parseInt(c.colpos, 10) || 1), 10);
                            if (c.rowabove) {
                                var u = a("<tr><td class='contentinfo' colspan='" + 2 * f + "'>" + c.rowcontent + "</td></tr>");
                                a(e).append(u);
                                u[0].rp = n
                            }
                            h = a(e).find("tr[rowpos=" + n + "]");
                            0 === h.length && (h = a("<tr " + p + " rowpos='" + n + "'></tr>").addClass("FormData").attr("id", "trv_" + g), a(h).append(y), a(e).append(h), h[0].rp = n);
                            a("td:eq(" + (t - 2) + ")", h[0]).html("<b>" + (void 0 === c.label ? d.p.colNames[b] : c.label) + "</b>");
                            a("td:eq(" + (t - 1) + ")", h[0]).append("<span>" + m + "</span>").attr("id", "v_" + g);
                            x && a("td:eq(" + (t - 1) + ") span", h[0]).css({
                                "text-align": "right",
                                width: A + "px"
                            });
                            r[q] = b;
                            q++
                        }
                    });
                    0 < q && (b = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (2 * f - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" + b + "'/></td></tr>"), b[0].rp = q + 99, a(e).append(b));
                    return r
                }

                function w(b, c) {
                    var d, e, f = 0,
                        g, k;
                    if (k = a(c).jqGrid("getInd", b, !0)) a("td", k).each(function(b) {
                        d = c.p.colModel[b].name;
                        e = c.p.colModel[b].editrules && !0 === c.p.colModel[b].editrules.edithidden ?
                            !1 : !0 === c.p.colModel[b].hidden ? !0 : !1;
                        "cb" !== d && "subgrid" !== d && "rn" !== d && (g = d === c.p.ExpandColumn && !0 === c.p.treeGrid ? a(this).text() : a(this).html(), d = a.jgrid.jqID("v_" + d), a("#" + d + " span", "#" + u).html(g), e && a("#" + d, "#" + u).parents("tr:first").hide(), f++)
                    }), 0 < f && a("#id_g", "#" + u).val(b)
                }

                function t(b, c) {
                    var d = c[1].length - 1;
                    0 === b ? a("#pData", "#" + u + "_2").addClass("ui-state-disabled") : void 0 !== c[1][b - 1] && a("#" + a.jgrid.jqID(c[1][b - 1])).hasClass("ui-state-disabled") ? a("#pData", u + "_2").addClass("ui-state-disabled") :
                        a("#pData", "#" + u + "_2").removeClass("ui-state-disabled");
                    b === d ? a("#nData", "#" + u + "_2").addClass("ui-state-disabled") : void 0 !== c[1][b + 1] && a("#" + a.jgrid.jqID(c[1][b + 1])).hasClass("ui-state-disabled") ? a("#nData", u + "_2").addClass("ui-state-disabled") : a("#nData", "#" + u + "_2").removeClass("ui-state-disabled")
                }

                function s() {
                    var b = a(r).jqGrid("getDataIDs"),
                        c = a("#id_g", "#" + u).val();
                    return [a.inArray(c, b), b]
                }
                var r = this;
                if (r.grid && z) {
                    var f = r.p.id,
                        k = "ViewGrid_" + a.jgrid.jqID(f),
                        u = "ViewTbl_" + a.jgrid.jqID(f),
                        x = "ViewGrid_" +
                            f,
                        d = "ViewTbl_" + f,
                        v = {
                            themodal: "viewmod" + f,
                            modalhead: "viewhd" + f,
                            modalcontent: "viewcnt" + f,
                            scrollelm: k
                        },
                        g = a.isFunction(b[r.p.id].beforeInitData) ? b[r.p.id].beforeInitData : !1,
                        m = !0,
                        p = 1,
                        q = 0;
                    c.recreateForm || a(r).data("viewProp") && a.extend(b[a(this)[0].p.id], a(r).data("viewProp"));
                    var y = isNaN(b[a(this)[0].p.id].dataheight) ? b[a(this)[0].p.id].dataheight : b[a(this)[0].p.id].dataheight + "px",
                        D = isNaN(b[a(this)[0].p.id].datawidth) ? b[a(this)[0].p.id].datawidth : b[a(this)[0].p.id].datawidth + "px",
                        x = a("<form name='FormPost' id='" +
                            x + "' class='FormGrid' style='width:" + D + ";overflow:auto;position:relative;height:" + y + ";'></form>"),
                        A = a("<table id='" + d + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
                    g && (m = g.call(r, a("#" + k)), void 0 === m && (m = !0));
                    if (!1 !== m) {
                        a(r.p.colModel).each(function() {
                            var a = this.formoptions;
                            p = Math.max(p, a ? a.colpos || 0 : 0);
                            q = Math.max(q, a ? a.rowpos || 0 : 0)
                        });
                        a(x).append(A);
                        h(z, r, A, p);
                        d = "rtl" === r.p.direction ? !0 : !1;
                        g = "<a id='" + (d ? "nData" : "pData") + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";
                        m = "<a id='" + (d ? "pData" : "nData") + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>";
                        y = "<a id='cData' class='fm-button ui-state-default ui-corner-all'>" + c.bClose + "</a>";
                        if (0 < q) {
                            var E = [];
                            a.each(a(A)[0].rows, function(a, b) {
                                E[a] = b
                            });
                            E.sort(function(a, b) {
                                return a.rp > b.rp ? 1 : a.rp < b.rp ? -1 : 0
                            });
                            a.each(E, function(b, c) {
                                a("tbody", A).append(c)
                            })
                        }
                        c.gbox = "#gbox_" + a.jgrid.jqID(f);
                        x = a("<div></div>").append(x).append("<table border='0' class='EditTable' id='" +
                            u + "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" + c.labelswidth + "'>" + (d ? m + g : g + m) + "</td><td class='EditButton'>" + y + "</td></tr></tbody></table>");
                        a.jgrid.createModal(v, x, c, "#gview_" + a.jgrid.jqID(r.p.id), a("#gview_" + a.jgrid.jqID(r.p.id))[0]);
                        d && (a("#pData, #nData", "#" + u + "_2").css("float", "right"), a(".EditButton", "#" + u + "_2").css("text-align", "left"));
                        c.viewPagerButtons || a("#pData, #nData", "#" + u + "_2").hide();
                        x = null;
                        a("#" + v.themodal).keydown(function(d) {
                            if (27 === d.which) return b[r.p.id].closeOnEscape &&
                            a.jgrid.hideModal("#" + a.jgrid.jqID(v.themodal), {
                                gb: c.gbox,
                                jqm: c.jqModal,
                                onClose: c.onClose
                            }), !1;
                            if (!0 === c.navkeys[0]) {
                                if (d.which === c.navkeys[1]) return a("#pData", "#" + u + "_2").trigger("click"), !1;
                                if (d.which === c.navkeys[2]) return a("#nData", "#" + u + "_2").trigger("click"), !1
                            }
                        });
                        c.closeicon = a.extend([!0, "left", "ui-icon-close"], c.closeicon);
                        !0 === c.closeicon[0] && a("#cData", "#" + u + "_2").addClass("right" === c.closeicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.closeicon[2] +
                            "'></span>");
                        a.isFunction(c.beforeShowForm) && c.beforeShowForm.call(r, a("#" + k));
                        a.jgrid.viewModal("#" + a.jgrid.jqID(v.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(f),
                            jqm: c.jqModal,
                            overlay: c.overlay,
                            modal: c.modal,
                            onHide: function(b) {
                                a(r).data("viewProp", {
                                    top: parseFloat(a(b.w).css("top")),
                                    left: parseFloat(a(b.w).css("left")),
                                    width: a(b.w).width(),
                                    height: a(b.w).height(),
                                    dataheight: a("#" + k).height(),
                                    datawidth: a("#" + k).width()
                                });
                                b.w.remove();
                                b.o && b.o.remove()
                            }
                        });
                        a(".fm-button:not(.ui-state-disabled)", "#" + u + "_2").hover(function() {
                                a(this).addClass("ui-state-hover")
                            },
                            function() {
                                a(this).removeClass("ui-state-hover")
                            });
                        e();
                        a("#cData", "#" + u + "_2").click(function() {
                            a.jgrid.hideModal("#" + a.jgrid.jqID(v.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(f),
                                jqm: c.jqModal,
                                onClose: c.onClose
                            });
                            return !1
                        });
                        a("#nData", "#" + u + "_2").click(function() {
                            a("#FormError", "#" + u).hide();
                            var b = s();
                            b[0] = parseInt(b[0], 10); - 1 !== b[0] && b[1][b[0] + 1] && (a.isFunction(c.onclickPgButtons) && c.onclickPgButtons.call(r, "next", a("#" + k), b[1][b[0]]), w(b[1][b[0] + 1], r), a(r).jqGrid("setSelection", b[1][b[0] + 1]), a.isFunction(c.afterclickPgButtons) &&
                            c.afterclickPgButtons.call(r, "next", a("#" + k), b[1][b[0] + 1]), t(b[0] + 1, b));
                            e();
                            return !1
                        });
                        a("#pData", "#" + u + "_2").click(function() {
                            a("#FormError", "#" + u).hide();
                            var b = s(); - 1 !== b[0] && b[1][b[0] - 1] && (a.isFunction(c.onclickPgButtons) && c.onclickPgButtons.call(r, "prev", a("#" + k), b[1][b[0]]), w(b[1][b[0] - 1], r), a(r).jqGrid("setSelection", b[1][b[0] - 1]), a.isFunction(c.afterclickPgButtons) && c.afterclickPgButtons.call(r, "prev", a("#" + k), b[1][b[0] - 1]), t(b[0] - 1, b));
                            e();
                            return !1
                        });
                        x = s();
                        t(x[0], x)
                    }
                }
            })
        },
        delGridRow: function(z,
                             c) {
            c = a.extend(!0, {
                top: 0,
                left: 0,
                width: 240,
                height: "auto",
                dataheight: "auto",
                modal: !1,
                overlay: 30,
                drag: !0,
                resize: !0,
                url: "",
                mtype: "POST",
                reloadAfterSubmit: !0,
                beforeShowForm: null,
                beforeInitData: null,
                afterShowForm: null,
                beforeSubmit: null,
                onclickSubmit: null,
                afterSubmit: null,
                jqModal: !0,
                closeOnEscape: !1,
                delData: {},
                delicon: [],
                cancelicon: [],
                onClose: null,
                ajaxDelOptions: {},
                processing: !1,
                serializeDelData: null,
                useDataProxy: !1
            }, a.jgrid.del, c || {});
            b[a(this)[0].p.id] = c;
            return this.each(function() {
                var e = this;
                if (e.grid &&
                    z) {
                    var h = a.isFunction(b[e.p.id].beforeShowForm),
                        w = a.isFunction(b[e.p.id].afterShowForm),
                        t = a.isFunction(b[e.p.id].beforeInitData) ? b[e.p.id].beforeInitData : !1,
                        s = e.p.id,
                        r = {},
                        f = !0,
                        k = "DelTbl_" + a.jgrid.jqID(s),
                        u, x, d, v, g = "DelTbl_" + s,
                        m = {
                            themodal: "delmod" + s,
                            modalhead: "delhd" + s,
                            modalcontent: "delcnt" + s,
                            scrollelm: k
                        };
                    a.isArray(z) && (z = z.join());
                    if (void 0 !== a("#" + a.jgrid.jqID(m.themodal))[0]) {
                        t && (f = t.call(e, a("#" + k)), void 0 === f && (f = !0));
                        if (!1 === f) return;
                        a("#DelData>td", "#" + k).text(z);
                        a("#DelError", "#" + k).hide();
                        !0 === b[e.p.id].processing && (b[e.p.id].processing = !1, a("#dData", "#" + k).removeClass("ui-state-active"));
                        h && b[e.p.id].beforeShowForm.call(e, a("#" + k));
                        a.jgrid.viewModal("#" + a.jgrid.jqID(m.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(s),
                            jqm: b[e.p.id].jqModal,
                            jqM: !1,
                            overlay: b[e.p.id].overlay,
                            modal: b[e.p.id].modal
                        })
                    } else {
                        var p = isNaN(b[e.p.id].dataheight) ? b[e.p.id].dataheight : b[e.p.id].dataheight + "px",
                            q = isNaN(c.datawidth) ? c.datawidth : c.datawidth + "px",
                            g = "<div id='" + g + "' class='formdata' style='width:" + q + ";overflow:auto;position:relative;height:" +
                                p + ";'><table class='DelTable'><tbody>",
                            g = g + "<tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>",
                            g = g + ("<tr id='DelData' style='display:none'><td >" + z + "</td></tr>"),
                            g = g + ('<tr><td class="delmsg" style="white-space:pre;">' + b[e.p.id].msg + "</td></tr><tr><td >&#160;</td></tr>"),
                            g = g + "</tbody></table></div>",
                            g = g + ("<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + k + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>" +
                                ("<a id='dData' class='fm-button ui-state-default ui-corner-all'>" + c.bSubmit + "</a>") + "&#160;" + ("<a id='eData' class='fm-button ui-state-default ui-corner-all'>" + c.bCancel + "</a>") + "</td></tr></tbody></table>");
                        c.gbox = "#gbox_" + a.jgrid.jqID(s);
                        a.jgrid.createModal(m, g, c, "#gview_" + a.jgrid.jqID(e.p.id), a("#gview_" + a.jgrid.jqID(e.p.id))[0]);
                        t && (f = t.call(e, a("#" + k)), void 0 === f && (f = !0));
                        if (!1 === f) return;
                        a(".fm-button", "#" + k + "_2").hover(function() {
                            a(this).addClass("ui-state-hover")
                        }, function() {
                            a(this).removeClass("ui-state-hover")
                        });
                        c.delicon = a.extend([!0, "left", "ui-icon-scissors"], b[e.p.id].delicon);
                        c.cancelicon = a.extend([!0, "left", "ui-icon-cancel"], b[e.p.id].cancelicon);
                        !0 === c.delicon[0] && a("#dData", "#" + k + "_2").addClass("right" === c.delicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.delicon[2] + "'></span>");
                        !0 === c.cancelicon[0] && a("#eData", "#" + k + "_2").addClass("right" === c.cancelicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.cancelicon[2] + "'></span>");
                        a("#dData", "#" + k + "_2").click(function() {
                            var f = [!0, ""],
                                g, h = a("#DelData>td", "#" + k).text();
                            r = {};
                            a.isFunction(b[e.p.id].onclickSubmit) && (r = b[e.p.id].onclickSubmit.call(e, b[e.p.id], h) || {});
                            a.isFunction(b[e.p.id].beforeSubmit) && (f = b[e.p.id].beforeSubmit.call(e, h));
                            if (f[0] && !b[e.p.id].processing) {
                                b[e.p.id].processing = !0;
                                d = e.p.prmNames;
                                u = a.extend({}, b[e.p.id].delData, r);
                                v = d.oper;
                                u[v] = d.deloper;
                                x = d.id;
                                h = String(h).split(",");
                                if (!h.length) return !1;
                                for (g in h) h.hasOwnProperty(g) && (h[g] = a.jgrid.stripPref(e.p.idPrefix,
                                    h[g]));
                                u[x] = h.join();
                                a(this).addClass("ui-state-active");
                                g = a.extend({
                                    url: b[e.p.id].url || a(e).jqGrid("getGridParam", "editurl"),
                                    type: b[e.p.id].mtype,
                                    data: a.isFunction(b[e.p.id].serializeDelData) ? b[e.p.id].serializeDelData.call(e, u) : u,
                                    complete: function(d, g) {
                                        var q;
                                        300 <= d.status && 304 !== d.status ? (f[0] = !1, a.isFunction(b[e.p.id].errorTextFormat) ? f[1] = b[e.p.id].errorTextFormat.call(e, d) : f[1] = g + " Status: '" + d.statusText + "'. Error code: " + d.status) : a.isFunction(b[e.p.id].afterSubmit) && (f = b[e.p.id].afterSubmit.call(e,
                                                d, u));
                                        if (!1 === f[0]) a("#DelError>td", "#" + k).html(f[1]), a("#DelError", "#" + k).show();
                                        else {
                                            if (b[e.p.id].reloadAfterSubmit && "local" !== e.p.datatype) a(e).trigger("reloadGrid");
                                            else {
                                                if (!0 === e.p.treeGrid) try {
                                                    a(e).jqGrid("delTreeNode", e.p.idPrefix + h[0])
                                                } catch (p) {} else
                                                    for (q = 0; q < h.length; q++) a(e).jqGrid("delRowData", e.p.idPrefix + h[q]);
                                                e.p.selrow = null;
                                                e.p.selarrrow = []
                                            }
                                            a.isFunction(b[e.p.id].afterComplete) && setTimeout(function() {
                                                b[e.p.id].afterComplete.call(e, d, h)
                                            }, 500)
                                        }
                                        b[e.p.id].processing = !1;
                                        a("#dData", "#" +
                                            k + "_2").removeClass("ui-state-active");
                                        f[0] && a.jgrid.hideModal("#" + a.jgrid.jqID(m.themodal), {
                                            gb: "#gbox_" + a.jgrid.jqID(s),
                                            jqm: c.jqModal,
                                            onClose: b[e.p.id].onClose
                                        })
                                    }
                                }, a.jgrid.ajaxOptions, b[e.p.id].ajaxDelOptions);
                                g.url || b[e.p.id].useDataProxy || (a.isFunction(e.p.dataProxy) ? b[e.p.id].useDataProxy = !0 : (f[0] = !1, f[1] += " " + a.jgrid.errors.nourl));
                                f[0] && (b[e.p.id].useDataProxy ? (g = e.p.dataProxy.call(e, g, "del_" + e.p.id), void 0 === g && (g = [!0, ""]), !1 === g[0] ? (f[0] = !1, f[1] = g[1] || "Error deleting the selected row!") : a.jgrid.hideModal("#" +
                                    a.jgrid.jqID(m.themodal), {
                                    gb: "#gbox_" + a.jgrid.jqID(s),
                                    jqm: c.jqModal,
                                    onClose: b[e.p.id].onClose
                                })) : a.ajax(g))
                            }!1 === f[0] && (a("#DelError>td", "#" + k).html(f[1]), a("#DelError", "#" + k).show());
                            return !1
                        });
                        a("#eData", "#" + k + "_2").click(function() {
                            a.jgrid.hideModal("#" + a.jgrid.jqID(m.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(s),
                                jqm: b[e.p.id].jqModal,
                                onClose: b[e.p.id].onClose
                            });
                            return !1
                        });
                        h && b[e.p.id].beforeShowForm.call(e, a("#" + k));
                        a.jgrid.viewModal("#" + a.jgrid.jqID(m.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(s),
                            jqm: b[e.p.id].jqModal,
                            overlay: b[e.p.id].overlay,
                            modal: b[e.p.id].modal
                        })
                    }
                    w && b[e.p.id].afterShowForm.call(e, a("#" + k));
                    !0 === b[e.p.id].closeOnEscape && setTimeout(function() {
                        a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(m.modalhead)).focus()
                    }, 0)
                }
            })
        },
        navGrid: function(b, c, e, h, w, t, s) {
            c = a.extend({
                edit: !0,
                editicon: "ui-icon-pencil",
                add: !0,
                addicon: "ui-icon-plus",
                del: !0,
                delicon: "ui-icon-trash",
                search: !0,
                searchicon: "ui-icon-search",
                refresh: !0,
                refreshicon: "ui-icon-refresh",
                refreshstate: "firstpage",
                view: !1,
                viewicon: "ui-icon-document",
                position: "left",
                closeOnEscape: !0,
                beforeRefresh: null,
                afterRefresh: null,
                cloneToTop: !1,
                alertwidth: 200,
                alertheight: "auto",
                alerttop: null,
                alertleft: null,
                alertzIndex: null
            }, a.jgrid.nav, c || {});
            return this.each(function() {
                if (!this.nav) {
                    var r = {
                            themodal: "alertmod_" + this.p.id,
                            modalhead: "alerthd_" + this.p.id,
                            modalcontent: "alertcnt_" + this.p.id
                        },
                        f = this,
                        k;
                    if (f.grid && "string" === typeof b) {
                        void 0 === a("#" + r.themodal)[0] && (c.alerttop || c.alertleft || (void 0 !== window.innerWidth ? (c.alertleft = window.innerWidth, c.alerttop = window.innerHeight) :
                            void 0 !== document.documentElement && void 0 !== document.documentElement.clientWidth && 0 !== document.documentElement.clientWidth ? (c.alertleft = document.documentElement.clientWidth, c.alerttop = document.documentElement.clientHeight) : (c.alertleft = 1024, c.alerttop = 768), c.alertleft = c.alertleft / 2 - parseInt(c.alertwidth, 10) / 2, c.alerttop = c.alerttop / 2 - 25), a.jgrid.createModal(r, "<div>" + c.alerttext + "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>", {
                            gbox: "#gbox_" + a.jgrid.jqID(f.p.id),
                            jqModal: !0,
                            drag: !0,
                            resize: !0,
                            caption: c.alertcap,
                            top: c.alerttop,
                            left: c.alertleft,
                            width: c.alertwidth,
                            height: c.alertheight,
                            closeOnEscape: c.closeOnEscape,
                            zIndex: c.alertzIndex
                        }, "#gview_" + a.jgrid.jqID(f.p.id), a("#gbox_" + a.jgrid.jqID(f.p.id))[0], !0));
                        var u = 1,
                            x, d = function() {
                                a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                            },
                            v = function() {
                                a(this).removeClass("ui-state-hover")
                            };
                        c.cloneToTop && f.p.toppager && (u = 2);
                        for (x = 0; x < u; x++) {
                            var g = a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
                                m, p;
                            0 === x ? (m = b, p = f.p.id, m === f.p.toppager && (p += "_top", u = 1)) : (m = f.p.toppager, p = f.p.id + "_top");
                            "rtl" === f.p.direction && a(g).attr("dir", "rtl").css("float", "right");
                            c.add && (h = h || {}, k = a("<td class='ui-pg-button ui-corner-all'></td>"), a(k).append("<div class='ui-pg-div'><span class='ui-icon " + c.addicon + "'></span>" + c.addtext + "</div>"), a("tr", g).append(k), a(k, g).attr({
                                title: c.addtitle || "",
                                id: h.id || "add_" + p
                            }).click(function() {
                                a(this).hasClass("ui-state-disabled") || (a.isFunction(c.addfunc) ? c.addfunc.call(f) :
                                    a(f).jqGrid("editGridRow", "new", h));
                                return !1
                            }).hover(d, v), k = null);
                            c.edit && (k = a("<td class='ui-pg-button ui-corner-all'></td>"), e = e || {}, a(k).append("<div class='ui-pg-div'><span class='ui-icon " + c.editicon + "'></span>" + c.edittext + "</div>"), a("tr", g).append(k), a(k, g).attr({
                                title: c.edittitle || "",
                                id: e.id || "edit_" + p
                            }).click(function() {
                                if (!a(this).hasClass("ui-state-disabled")) {
                                    var b = f.p.selrow;
                                    b ? a.isFunction(c.editfunc) ? c.editfunc.call(f, b) : a(f).jqGrid("editGridRow", b, e) : (a.jgrid.viewModal("#" + r.themodal, {
                                        gbox: "#gbox_" + a.jgrid.jqID(f.p.id),
                                        jqm: !0
                                    }), a("#jqg_alrt").focus())
                                }
                                return !1
                            }).hover(d, v), k = null);
                            c.view && (k = a("<td class='ui-pg-button ui-corner-all'></td>"), s = s || {}, a(k).append("<div class='ui-pg-div'><span class='ui-icon " + c.viewicon + "'></span>" + c.viewtext + "</div>"), a("tr", g).append(k), a(k, g).attr({
                                title: c.viewtitle || "",
                                id: s.id || "view_" + p
                            }).click(function() {
                                if (!a(this).hasClass("ui-state-disabled")) {
                                    var b = f.p.selrow;
                                    b ? a.isFunction(c.viewfunc) ? c.viewfunc.call(f, b) : a(f).jqGrid("viewGridRow", b, s) :
                                        (a.jgrid.viewModal("#" + r.themodal, {
                                            gbox: "#gbox_" + a.jgrid.jqID(f.p.id),
                                            jqm: !0
                                        }), a("#jqg_alrt").focus())
                                }
                                return !1
                            }).hover(d, v), k = null);
                            c.del && (k = a("<td class='ui-pg-button ui-corner-all'></td>"), w = w || {}, a(k).append("<div class='ui-pg-div'><span class='ui-icon " + c.delicon + "'></span>" + c.deltext + "</div>"), a("tr", g).append(k), a(k, g).attr({
                                title: c.deltitle || "",
                                id: w.id || "del_" + p
                            }).click(function() {
                                if (!a(this).hasClass("ui-state-disabled")) {
                                    var b;
                                    f.p.multiselect ? (b = f.p.selarrrow, 0 === b.length && (b = null)) : b =
                                        f.p.selrow;
                                    b ? a.isFunction(c.delfunc) ? c.delfunc.call(f, b) : a(f).jqGrid("delGridRow", b, w) : (a.jgrid.viewModal("#" + r.themodal, {
                                        gbox: "#gbox_" + a.jgrid.jqID(f.p.id),
                                        jqm: !0
                                    }), a("#jqg_alrt").focus())
                                }
                                return !1
                            }).hover(d, v), k = null);
                            (c.add || c.edit || c.del || c.view) && a("tr", g).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>");
                            c.search && (k = a("<td class='ui-pg-button ui-corner-all'></td>"), t = t || {}, a(k).append("<div class='ui-pg-div'><span class='ui-icon " +
                                c.searchicon + "'></span>" + c.searchtext + "</div>"), a("tr", g).append(k), a(k, g).attr({
                                title: c.searchtitle || "",
                                id: t.id || "search_" + p
                            }).click(function() {
                                a(this).hasClass("ui-state-disabled") || (a.isFunction(c.searchfunc) ? c.searchfunc.call(f, t) : a(f).jqGrid("searchGrid", t));
                                return !1
                            }).hover(d, v), t.showOnLoad && !0 === t.showOnLoad && a(k, g).click(), k = null);
                            c.refresh && (k = a("<td class='ui-pg-button ui-corner-all'></td>"), a(k).append("<div class='ui-pg-div'><span class='ui-icon " + c.refreshicon + "'></span>" + c.refreshtext +
                                "</div>"), a("tr", g).append(k), a(k, g).attr({
                                title: c.refreshtitle || "",
                                id: "refresh_" + p
                            }).click(function() {
                                if (!a(this).hasClass("ui-state-disabled")) {
                                    a.isFunction(c.beforeRefresh) && c.beforeRefresh.call(f);
                                    f.p.search = !1;
                                    f.p.resetsearch = !0;
                                    try {
                                        var b = f.p.id;
                                        f.p.postData.filters = "";
                                        try {
                                            a("#fbox_" + a.jgrid.jqID(b)).jqFilter("resetFilter")
                                        } catch (d) {}
                                        a.isFunction(f.clearToolbar) && f.clearToolbar.call(f, !1)
                                    } catch (e) {}
                                    switch (c.refreshstate) {
                                        case "firstpage":
                                            a(f).trigger("reloadGrid", [{
                                                page: 1
                                            }]);
                                            break;
                                        case "current":
                                            a(f).trigger("reloadGrid", [{
                                                current: !0
                                            }])
                                    }
                                    a.isFunction(c.afterRefresh) && c.afterRefresh.call(f)
                                }
                                return !1
                            }).hover(d, v), k = null);
                            k = a(".ui-jqgrid").css("font-size") || "11px";
                            a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + k + ";visibility:hidden;' ></div>");
                            k = a(g).clone().appendTo("#testpg2").width();
                            a("#testpg2").remove();
                            a(m + "_" + c.position, m).append(g);
                            f.p._nvtd && (k > f.p._nvtd[0] && (a(m + "_" + c.position, m).width(k), f.p._nvtd[0] = k), f.p._nvtd[1] = k);
                            g = k = k = null;
                            this.nav = !0
                        }
                    }
                }
            })
        },
        navButtonAdd: function(b,
                               c) {
            c = a.extend({
                caption: "newButton",
                title: "",
                buttonicon: "ui-icon-newwin",
                onClickButton: null,
                position: "last",
                cursor: "pointer"
            }, c || {});
            return this.each(function() {
                if (this.grid) {
                    "string" === typeof b && 0 !== b.indexOf("#") && (b = "#" + a.jgrid.jqID(b));
                    var e = a(".navtable", b)[0],
                        h = this;
                    if (e && (!c.id || void 0 === a("#" + a.jgrid.jqID(c.id), e)[0])) {
                        var w = a("<td></td>");
                        "NONE" === c.buttonicon.toString().toUpperCase() ? a(w).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>" + c.caption + "</div>") : a(w).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon " +
                            c.buttonicon + "'></span>" + c.caption + "</div>");
                        c.id && a(w).attr("id", c.id);
                        "first" === c.position ? 0 === e.rows[0].cells.length ? a("tr", e).append(w) : a("tr td:eq(0)", e).before(w) : a("tr", e).append(w);
                        a(w, e).attr("title", c.title || "").click(function(b) {
                            a(this).hasClass("ui-state-disabled") || a.isFunction(c.onClickButton) && c.onClickButton.call(h, b);
                            return !1
                        }).hover(function() {
                            a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                        }, function() {
                            a(this).removeClass("ui-state-hover")
                        })
                    }
                }
            })
        },
        navSeparatorAdd: function(b,
                                  c) {
            c = a.extend({
                sepclass: "ui-separator",
                sepcontent: "",
                position: "last"
            }, c || {});
            return this.each(function() {
                if (this.grid) {
                    "string" === typeof b && 0 !== b.indexOf("#") && (b = "#" + a.jgrid.jqID(b));
                    var e = a(".navtable", b)[0];
                    if (e) {
                        var h = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" + c.sepclass + "'></span>" + c.sepcontent + "</td>";
                        "first" === c.position ? 0 === e.rows[0].cells.length ? a("tr", e).append(h) : a("tr td:eq(0)", e).before(h) : a("tr", e).append(h)
                    }
                }
            })
        },
        GridToForm: function(b, c) {
            return this.each(function() {
                var e =
                        this,
                    h;
                if (e.grid) {
                    var w = a(e).jqGrid("getRowData", b);
                    if (w)
                        for (h in w) w.hasOwnProperty(h) && (a("[name=" + a.jgrid.jqID(h) + "]", c).is("input:radio") || a("[name=" + a.jgrid.jqID(h) + "]", c).is("input:checkbox") ? a("[name=" + a.jgrid.jqID(h) + "]", c).each(function() {
                            if (a(this).val() == w[h]) a(this)[e.p.useProp ? "prop" : "attr"]("checked", !0);
                            else a(this)[e.p.useProp ? "prop" : "attr"]("checked", !1)
                        }) : a("[name=" + a.jgrid.jqID(h) + "]", c).val(w[h]))
                }
            })
        },
        FormToGrid: function(b, c, e, h) {
            return this.each(function() {
                if (this.grid) {
                    e || (e =
                        "set");
                    h || (h = "first");
                    var w = a(c).serializeArray(),
                        t = {};
                    a.each(w, function(a, b) {
                        t[b.name] = b.value
                    });
                    "add" === e ? a(this).jqGrid("addRowData", b, t, h) : "set" === e && a(this).jqGrid("setRowData", b, t)
                }
            })
        }
    })
})(jQuery);
(function(a) {
    a.fn.jqFilter = function(d) {
        if ("string" === typeof d) {
            var q = a.fn.jqFilter[d];
            if (!q) throw "jqFilter - No such method: " + d;
            var x = a.makeArray(arguments).slice(1);
            return q.apply(this, x)
        }
        var n = a.extend(!0, {
            filter: null,
            columns: [],
            onChange: null,
            afterRedraw: null,
            checkValues: null,
            error: !1,
            errmsg: "",
            errorcheck: !0,
            showQuery: !0,
            sopt: null,
            ops: [],
            operands: null,
            numopts: "eq ne lt le gt ge nu nn in ni".split(" "),
            stropts: "eq ne bw bn ew en cn nc nu nn in ni".split(" "),
            strarr: ["text", "string", "blob"],
            groupOps: [{
                op: "AND",
                text: "AND"
            }, {
                op: "OR",
                text: "OR"
            }],
            groupButton: !0,
            ruleButtons: !0,
            direction: "ltr"
        }, a.jgrid.filter, d || {});
        return this.each(function() {
            if (!this.filter) {
                this.p = n;
                if (null === this.p.filter || void 0 === this.p.filter) this.p.filter = {
                    groupOp: this.p.groupOps[0].op,
                    rules: [],
                    groups: []
                };
                var d, q = this.p.columns.length,
                    f, w = /msie/i.test(navigator.userAgent) && !window.opera;
                this.p.initFilter = a.extend(!0, {}, this.p.filter);
                if (q) {
                    for (d = 0; d < q; d++) f = this.p.columns[d], f.stype ? f.inputtype = f.stype : f.inputtype || (f.inputtype = "text"),
                        f.sorttype ? f.searchtype = f.sorttype : f.searchtype || (f.searchtype = "string"), void 0 === f.hidden && (f.hidden = !1), f.label || (f.label = f.name), f.index && (f.name = f.index), f.hasOwnProperty("searchoptions") || (f.searchoptions = {}), f.hasOwnProperty("searchrules") || (f.searchrules = {});
                    this.p.showQuery && a(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='" + this.p.direction + "'><tbody><tr><td class='query'></td></tr></tbody></table>");
                    var u =
                        function(g, l) {
                            var b = [!0, ""],
                                c = a("#" + a.jgrid.jqID(n.id))[0] || null;
                            if (a.isFunction(l.searchrules)) b = l.searchrules.call(c, g, l);
                            else if (a.jgrid && a.jgrid.checkValues) try {
                                b = a.jgrid.checkValues.call(c, g, -1, l.searchrules, l.label)
                            } catch (m) {}
                            b && b.length && !1 === b[0] && (n.error = !b[0], n.errmsg = b[1])
                        };
                    this.onchange = function() {
                        this.p.error = !1;
                        this.p.errmsg = "";
                        return a.isFunction(this.p.onChange) ? this.p.onChange.call(this, this.p) : !1
                    };
                    this.reDraw = function() {
                        a("table.group:first", this).remove();
                        var g = this.createTableForGroup(n.filter,
                            null);
                        a(this).append(g);
                        a.isFunction(this.p.afterRedraw) && this.p.afterRedraw.call(this, this.p)
                    };
                    this.createTableForGroup = function(g, l) {
                        var b = this,
                            c, m = a("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>"),
                            e = "left";
                        "rtl" === this.p.direction && (e = "right", m.attr("dir", "rtl"));
                        null === l && m.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='" + e + "'></th></tr>");
                        var h = a("<tr></tr>");
                        m.append(h);
                        e = a("<th colspan='5' align='" +
                            e + "'></th>");
                        h.append(e);
                        if (!0 === this.p.ruleButtons) {
                            var d = a("<select class='opsel'></select>");
                            e.append(d);
                            var h = "",
                                k;
                            for (c = 0; c < n.groupOps.length; c++) k = g.groupOp === b.p.groupOps[c].op ? " selected='selected'" : "", h += "<option value='" + b.p.groupOps[c].op + "'" + k + ">" + b.p.groupOps[c].text + "</option>";
                            d.append(h).bind("change", function() {
                                g.groupOp = a(d).val();
                                b.onchange()
                            })
                        }
                        h = "<span></span>";
                        this.p.groupButton && (h = a("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>"), h.bind("click",
                            function() {
                                void 0 === g.groups && (g.groups = []);
                                g.groups.push({
                                    groupOp: n.groupOps[0].op,
                                    rules: [],
                                    groups: []
                                });
                                b.reDraw();
                                b.onchange();
                                return !1
                            }));
                        e.append(h);
                        if (!0 === this.p.ruleButtons) {
                            var h = a("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>"),
                                f;
                            h.bind("click", function() {
                                void 0 === g.rules && (g.rules = []);
                                for (c = 0; c < b.p.columns.length; c++) {
                                    var e = void 0 === b.p.columns[c].search ? !0 : b.p.columns[c].search,
                                        l = !0 === b.p.columns[c].hidden;
                                    if (!0 === b.p.columns[c].searchoptions.searchhidden &&
                                        e || e && !l) {
                                        f = b.p.columns[c];
                                        break
                                    }
                                }
                                e = f.searchoptions.sopt ? f.searchoptions.sopt : b.p.sopt ? b.p.sopt : -1 !== a.inArray(f.searchtype, b.p.strarr) ? b.p.stropts : b.p.numopts;
                                g.rules.push({
                                    field: f.name,
                                    op: e[0],
                                    data: ""
                                });
                                b.reDraw();
                                return !1
                            });
                            e.append(h)
                        }
                        null !== l && (h = a("<input type='button' value='-' title='Delete group' class='delete-group'/>"), e.append(h), h.bind("click", function() {
                            for (c = 0; c < l.groups.length; c++)
                                if (l.groups[c] === g) {
                                    l.groups.splice(c, 1);
                                    break
                                }
                            b.reDraw();
                            b.onchange();
                            return !1
                        }));
                        if (void 0 !== g.groups)
                            for (c =
                                     0; c < g.groups.length; c++) e = a("<tr></tr>"), m.append(e), h = a("<td class='first'></td>"), e.append(h), h = a("<td colspan='4'></td>"), h.append(this.createTableForGroup(g.groups[c], g)), e.append(h);
                        void 0 === g.groupOp && (g.groupOp = b.p.groupOps[0].op);
                        if (void 0 !== g.rules)
                            for (c = 0; c < g.rules.length; c++) m.append(this.createTableRowForRule(g.rules[c], g));
                        return m
                    };
                    this.createTableRowForRule = function(g, l) {
                        var b = this,
                            c = a("#" + a.jgrid.jqID(n.id))[0] || null,
                            m = a("<tr></tr>"),
                            e, h, f, k, d = "",
                            s;
                        m.append("<td class='first'></td>");
                        var p = a("<td class='columns'></td>");
                        m.append(p);
                        var q = a("<select></select>"),
                            r, t = [];
                        p.append(q);
                        q.bind("change", function() {
                            g.field = a(q).val();
                            f = a(this).parents("tr:first");
                            for (e = 0; e < b.p.columns.length; e++)
                                if (b.p.columns[e].name === g.field) {
                                    k = b.p.columns[e];
                                    break
                                }
                            if (k) {
                                k.searchoptions.id = a.jgrid.randId();
                                w && "text" === k.inputtype && !k.searchoptions.size && (k.searchoptions.size = 10);
                                var d = a.jgrid.createEl.call(c, k.inputtype, k.searchoptions, "", !0, b.p.ajaxSelectOptions || {}, !0);
                                a(d).addClass("input-elm");
                                h =
                                    k.searchoptions.sopt ? k.searchoptions.sopt : b.p.sopt ? b.p.sopt : -1 !== a.inArray(k.searchtype, b.p.strarr) ? b.p.stropts : b.p.numopts;
                                var l = "",
                                    m = 0;
                                t = [];
                                a.each(b.p.ops, function() {
                                    t.push(this.oper)
                                });
                                for (e = 0; e < h.length; e++) r = a.inArray(h[e], t), -1 !== r && (0 === m && (g.op = b.p.ops[r].oper), l += "<option value='" + b.p.ops[r].oper + "'>" + b.p.ops[r].text + "</option>", m++);
                                a(".selectopts", f).empty().append(l);
                                a(".selectopts", f)[0].selectedIndex = 0;
                                a.jgrid.msie && 9 > a.jgrid.msiever() && (l = parseInt(a("select.selectopts", f)[0].offsetWidth,
                                        10) + 1, a(".selectopts", f).width(l), a(".selectopts", f).css("width", "auto"));
                                a(".data", f).empty().append(d);
                                a.jgrid.bindEv.call(c, d, k.searchoptions);
                                a(".input-elm", f).bind("change", function(e) {
                                    e = e.target;
                                    g.data = "SPAN" === e.nodeName.toUpperCase() && k.searchoptions && a.isFunction(k.searchoptions.custom_value) ? k.searchoptions.custom_value.call(c, a(e).children(".customelement:first"), "get") : e.value;
                                    b.onchange()
                                });
                                setTimeout(function() {
                                    g.data = a(d).val();
                                    b.onchange()
                                }, 0)
                            }
                        });
                        for (e = p = 0; e < b.p.columns.length; e++) {
                            s =
                                void 0 === b.p.columns[e].search ? !0 : b.p.columns[e].search;
                            var u = !0 === b.p.columns[e].hidden;
                            if (!0 === b.p.columns[e].searchoptions.searchhidden && s || s && !u) s = "", g.field === b.p.columns[e].name && (s = " selected='selected'", p = e), d += "<option value='" + b.p.columns[e].name + "'" + s + ">" + b.p.columns[e].label + "</option>"
                        }
                        q.append(d);
                        d = a("<td class='operators'></td>");
                        m.append(d);
                        k = n.columns[p];
                        k.searchoptions.id = a.jgrid.randId();
                        w && "text" === k.inputtype && !k.searchoptions.size && (k.searchoptions.size = 10);
                        p = a.jgrid.createEl.call(c,
                            k.inputtype, k.searchoptions, g.data, !0, b.p.ajaxSelectOptions || {}, !0);
                        if ("nu" === g.op || "nn" === g.op) a(p).attr("readonly", "true"), a(p).attr("disabled", "true");
                        var v = a("<select class='selectopts'></select>");
                        d.append(v);
                        v.bind("change", function() {
                            g.op = a(v).val();
                            f = a(this).parents("tr:first");
                            var c = a(".input-elm", f)[0];
                            "nu" === g.op || "nn" === g.op ? (g.data = "", "SELECT" !== c.tagName.toUpperCase() && (c.value = ""), c.setAttribute("readonly", "true"), c.setAttribute("disabled", "true")) : ("SELECT" === c.tagName.toUpperCase() &&
                            (g.data = c.value), c.removeAttribute("readonly"), c.removeAttribute("disabled"));
                            b.onchange()
                        });
                        h = k.searchoptions.sopt ? k.searchoptions.sopt : b.p.sopt ? b.p.sopt : -1 !== a.inArray(k.searchtype, b.p.strarr) ? b.p.stropts : b.p.numopts;
                        d = "";
                        a.each(b.p.ops, function() {
                            t.push(this.oper)
                        });
                        for (e = 0; e < h.length; e++) r = a.inArray(h[e], t), -1 !== r && (s = g.op === b.p.ops[r].oper ? " selected='selected'" : "", d += "<option value='" + b.p.ops[r].oper + "'" + s + ">" + b.p.ops[r].text + "</option>");
                        v.append(d);
                        d = a("<td class='data'></td>");
                        m.append(d);
                        d.append(p);
                        a.jgrid.bindEv.call(c, p, k.searchoptions);
                        a(p).addClass("input-elm").bind("change", function() {
                            g.data = "custom" === k.inputtype ? k.searchoptions.custom_value.call(c, a(this).children(".customelement:first"), "get") : a(this).val();
                            b.onchange()
                        });
                        d = a("<td></td>");
                        m.append(d);
                        !0 === this.p.ruleButtons && (p = a("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>"), d.append(p), p.bind("click", function() {
                            for (e = 0; e < l.rules.length; e++)
                                if (l.rules[e] === g) {
                                    l.rules.splice(e, 1);
                                    break
                                }
                            b.reDraw();
                            b.onchange();
                            return !1
                        }));
                        return m
                    };
                    this.getStringForGroup = function(a) {
                        var d = "(",
                            b;
                        if (void 0 !== a.groups)
                            for (b = 0; b < a.groups.length; b++) {
                                1 < d.length && (d += " " + a.groupOp + " ");
                                try {
                                    d += this.getStringForGroup(a.groups[b])
                                } catch (c) {
                                    alert(c)
                                }
                            }
                        if (void 0 !== a.rules) try {
                            for (b = 0; b < a.rules.length; b++) 1 < d.length && (d += " " + a.groupOp + " "), d += this.getStringForRule(a.rules[b])
                        } catch (f) {
                            alert(f)
                        }
                        d += ")";
                        return "()" === d ? "" : d
                    };
                    this.getStringForRule = function(d) {
                        var f = "",
                            b = "",
                            c, m;
                        for (c = 0; c < this.p.ops.length; c++)
                            if (this.p.ops[c].oper ===
                                d.op) {
                                f = this.p.operands.hasOwnProperty(d.op) ? this.p.operands[d.op] : "";
                                b = this.p.ops[c].oper;
                                break
                            }
                        for (c = 0; c < this.p.columns.length; c++)
                            if (this.p.columns[c].name === d.field) {
                                m = this.p.columns[c];
                                break
                            }
                        if (void 0 == m) return "";
                        c = d.data;
                        if ("bw" === b || "bn" === b) c += "%";
                        if ("ew" === b || "en" === b) c = "%" + c;
                        if ("cn" === b || "nc" === b) c = "%" + c + "%";
                        if ("in" === b || "ni" === b) c = " (" + c + ")";
                        n.errorcheck && u(d.data, m);
                        return -1 !== a.inArray(m.searchtype, ["int", "integer", "float", "number", "currency"]) || "nn" === b || "nu" === b ? d.field + " " + f + " " + c :
                            d.field + " " + f + ' "' + c + '"'
                    };
                    this.resetFilter = function() {
                        this.p.filter = a.extend(!0, {}, this.p.initFilter);
                        this.reDraw();
                        this.onchange()
                    };
                    this.hideError = function() {
                        a("th.ui-state-error", this).html("");
                        a("tr.error", this).hide()
                    };
                    this.showError = function() {
                        a("th.ui-state-error", this).html(this.p.errmsg);
                        a("tr.error", this).show()
                    };
                    this.toUserFriendlyString = function() {
                        return this.getStringForGroup(n.filter)
                    };
                    this.toString = function() {
                        function a(b) {
                            var c = "(",
                                f;
                            if (void 0 !== b.groups)
                                for (f = 0; f < b.groups.length; f++) 1 <
                                c.length && (c = "OR" === b.groupOp ? c + " || " : c + " && "), c += a(b.groups[f]);
                            if (void 0 !== b.rules)
                                for (f = 0; f < b.rules.length; f++) {
                                    1 < c.length && (c = "OR" === b.groupOp ? c + " || " : c + " && ");
                                    var e = b.rules[f];
                                    if (d.p.errorcheck) {
                                        for (var h = void 0, n = void 0, h = 0; h < d.p.columns.length; h++)
                                            if (d.p.columns[h].name === e.field) {
                                                n = d.p.columns[h];
                                                break
                                            }
                                        n && u(e.data, n)
                                    }
                                    c += e.op + "(item." + e.field + ",'" + e.data + "')"
                                }
                            c += ")";
                            return "()" === c ? "" : c
                        }
                        var d = this;
                        return a(this.p.filter)
                    };
                    this.reDraw();
                    if (this.p.showQuery) this.onchange();
                    this.filter = !0
                }
            }
        })
    };
    a.extend(a.fn.jqFilter, {
        toSQLString: function() {
            var a = "";
            this.each(function() {
                a = this.toUserFriendlyString()
            });
            return a
        },
        filterData: function() {
            var a;
            this.each(function() {
                a = this.p.filter
            });
            return a
        },
        getParameter: function(a) {
            return void 0 !== a && this.p.hasOwnProperty(a) ? this.p[a] : this.p
        },
        resetFilter: function() {
            return this.each(function() {
                this.resetFilter()
            })
        },
        addFilter: function(d) {
            "string" === typeof d && (d = a.jgrid.parse(d));
            this.each(function() {
                this.p.filter = d;
                this.reDraw();
                this.onchange()
            })
        }
    })
})(jQuery);
(function(a) {
    a.jgrid.inlineEdit = a.jgrid.inlineEdit || {};
    a.jgrid.extend({
        editRow: function(c, e, b, l, h, n, p, g, f) {
            var m = {},
                d = a.makeArray(arguments).slice(1);
            "object" === a.type(d[0]) ? m = d[0] : (void 0 !== e && (m.keys = e), a.isFunction(b) && (m.oneditfunc = b), a.isFunction(l) && (m.successfunc = l), void 0 !== h && (m.url = h), void 0 !== n && (m.extraparam = n), a.isFunction(p) && (m.aftersavefunc = p), a.isFunction(g) && (m.errorfunc = g), a.isFunction(f) && (m.afterrestorefunc = f));
            m = a.extend(!0, {
                keys: !1,
                oneditfunc: null,
                successfunc: null,
                url: null,
                extraparam: {},
                aftersavefunc: null,
                errorfunc: null,
                afterrestorefunc: null,
                restoreAfterError: !0,
                mtype: "POST"
            }, a.jgrid.inlineEdit, m);
            return this.each(function() {
                var d = this,
                    f, e, b, g = 0,
                    h = null,
                    n = {},
                    l, q;
                d.grid && (l = a(d).jqGrid("getInd", c, !0), !1 !== l && (b = a.isFunction(m.beforeEditRow) ? m.beforeEditRow.call(d, m, c) : void 0, void 0 === b && (b = !0), b && (b = a(l).attr("editable") || "0", "0" !== b || a(l).hasClass("not-editable-row") || (q = d.p.colModel, a('td[role="gridcell"]', l).each(function(b) {
                    f = q[b].name;
                    var l = !0 === d.p.treeGrid && f ===
                        d.p.ExpandColumn;
                    if (l) e = a("span:first", this).html();
                    else try {
                        e = a.unformat.call(d, this, {
                            rowId: c,
                            colModel: q[b]
                        }, b)
                    } catch (m) {
                        e = q[b].edittype && "textarea" === q[b].edittype ? a(this).text() : a(this).html()
                    }
                    if ("cb" !== f && "subgrid" !== f && "rn" !== f && (d.p.autoencode && (e = a.jgrid.htmlDecode(e)), n[f] = e, !0 === q[b].editable)) {
                        null === h && (h = b);
                        l ? a("span:first", this).html("") : a(this).html("");
                        var p = a.extend({}, q[b].editoptions || {}, {
                            id: c + "_" + f,
                            name: f
                        });
                        q[b].edittype || (q[b].edittype = "text");
                        if ("&nbsp;" === e || "&#160;" === e || 1 ===
                            e.length && 160 === e.charCodeAt(0)) e = "";
                        var x = a.jgrid.createEl.call(d, q[b].edittype, p, e, !0, a.extend({}, a.jgrid.ajaxOptions, d.p.ajaxSelectOptions || {}));
                        a(x).addClass("editable");
                        l ? a("span:first", this).append(x) : a(this).append(x);
                        a.jgrid.bindEv.call(d, x, p);
                        "select" === q[b].edittype && void 0 !== q[b].editoptions && !0 === q[b].editoptions.multiple && void 0 === q[b].editoptions.dataUrl && a.jgrid.msie && a(x).width(a(x).width());
                        g++
                    }
                }), 0 < g && (n.id = c, d.p.savedRow.push(n), a(l).attr("editable", "1"), setTimeout(function() {
                    a("td:eq(" +
                        h + ") input", l).focus()
                }, 0), !0 === m.keys && a(l).bind("keydown", function(b) {
                    if (27 === b.keyCode) {
                        a(d).jqGrid("restoreRow", c, m.afterrestorefunc);
                        if (d.p._inlinenav) try {
                            a(d).jqGrid("showAddEditButtons")
                        } catch (f) {}
                        return !1
                    }
                    if (13 === b.keyCode) {
                        if ("TEXTAREA" === b.target.tagName) return !0;
                        if (a(d).jqGrid("saveRow", c, m) && d.p._inlinenav) try {
                            a(d).jqGrid("showAddEditButtons")
                        } catch (e) {}
                        return !1
                    }
                }), a(d).triggerHandler("jqGridInlineEditRow", [c, m]), a.isFunction(m.oneditfunc) && m.oneditfunc.call(d, c))))))
            })
        },
        saveRow: function(c,
                          e, b, l, h, n, p) {
            var g = a.makeArray(arguments).slice(1),
                f = {};
            "object" === a.type(g[0]) ? f = g[0] : (a.isFunction(e) && (f.successfunc = e), void 0 !== b && (f.url = b), void 0 !== l && (f.extraparam = l), a.isFunction(h) && (f.aftersavefunc = h), a.isFunction(n) && (f.errorfunc = n), a.isFunction(p) && (f.afterrestorefunc = p));
            var f = a.extend(!0, {
                    successfunc: null,
                    url: null,
                    extraparam: {},
                    aftersavefunc: null,
                    errorfunc: null,
                    afterrestorefunc: null,
                    restoreAfterError: !0,
                    mtype: "POST"
                }, a.jgrid.inlineEdit, f),
                m = !1,
                d = this[0],
                r, k = {},
                y = {},
                v = {},
                w, z, u;
            if (!d.grid) return m;
            u = a(d).jqGrid("getInd", c, !0);
            if (!1 === u) return m;
            g = a.isFunction(f.beforeSaveRow) ? f.beforeSaveRow.call(d, f, c) : void 0;
            void 0 === g && (g = !0);
            if (g) {
                g = a(u).attr("editable");
                f.url = f.url || d.p.editurl;
                if ("1" === g) {
                    var t;
                    a('td[role="gridcell"]', u).each(function(c) {
                        t = d.p.colModel[c];
                        r = t.name;
                        if ("cb" !== r && "subgrid" !== r && !0 === t.editable && "rn" !== r && !a(this).hasClass("not-editable-cell")) {
                            switch (t.edittype) {
                                case "checkbox":
                                    var b = ["Yes", "No"];
                                    t.editoptions && (b = t.editoptions.value.split(":"));
                                    k[r] = a("input", this).is(":checked") ?
                                        b[0] : b[1];
                                    break;
                                case "text":
                                case "password":
                                case "textarea":
                                case "button":
                                    k[r] = a("input, textarea", this).val();
                                    break;
                                case "select":
                                    if (t.editoptions.multiple) {
                                        var b = a("select", this),
                                            e = [];
                                        k[r] = a(b).val();
                                        k[r] = k[r] ? k[r].join(",") : "";
                                        a("select option:selected", this).each(function(d, b) {
                                            e[d] = a(b).text()
                                        });
                                        y[r] = e.join(",")
                                    } else k[r] = a("select option:selected", this).val(), y[r] = a("select option:selected", this).text();
                                    t.formatter && "select" === t.formatter && (y = {});
                                    break;
                                case "custom":
                                    try {
                                        if (t.editoptions && a.isFunction(t.editoptions.custom_value)) {
                                            if (k[r] =
                                                    t.editoptions.custom_value.call(d, a(".customelement", this), "get"), void 0 === k[r]) throw "e2";
                                        } else throw "e1";
                                    } catch (g) {
                                        "e1" === g && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose), "e2" === g ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, g.message, a.jgrid.edit.bClose)
                                    }
                            }
                            z = a.jgrid.checkValues.call(d, k[r], c);
                            if (!1 === z[0]) return !1;
                            d.p.autoencode &&
                            (k[r] = a.jgrid.htmlEncode(k[r]));
                            "clientArray" !== f.url && t.editoptions && !0 === t.editoptions.NullIfEmpty && "" === k[r] && (v[r] = "null")
                        }
                    });
                    if (!1 === z[0]) {
                        try {
                            var q = a(d).jqGrid("getGridRowById", c),
                                s = a.jgrid.findPos(q);
                            a.jgrid.info_dialog(a.jgrid.errors.errcap, z[1], a.jgrid.edit.bClose, {
                                left: s[0],
                                top: s[1] + a(q).outerHeight()
                            })
                        } catch (A) {
                            alert(z[1])
                        }
                        return m
                    }
                    g = d.p.prmNames;
                    q = c;
                    s = !1 === d.p.keyIndex ? g.id : d.p.colModel[d.p.keyIndex + (!0 === d.p.rownumbers ? 1 : 0) + (!0 === d.p.multiselect ? 1 : 0) + (!0 === d.p.subGrid ? 1 : 0)].name;
                    k && (k[g.oper] =
                        g.editoper, void 0 === k[s] || "" === k[s] ? k[s] = c : u.id !== d.p.idPrefix + k[s] && (g = a.jgrid.stripPref(d.p.idPrefix, c), void 0 !== d.p._index[g] && (d.p._index[k[s]] = d.p._index[g], delete d.p._index[g]), c = d.p.idPrefix + k[s], a(u).attr("id", c), d.p.selrow === q && (d.p.selrow = c), a.isArray(d.p.selarrrow) && (g = a.inArray(q, d.p.selarrrow), 0 <= g && (d.p.selarrrow[g] = c)), d.p.multiselect && (g = "jqg_" + d.p.id + "_" + c, a("input.cbox", u).attr("id", g).attr("name", g))), void 0 === d.p.inlineData && (d.p.inlineData = {}), k = a.extend({}, k, d.p.inlineData,
                        f.extraparam));
                    if ("clientArray" === f.url) {
                        k = a.extend({}, k, y);
                        d.p.autoencode && a.each(k, function(d, b) {
                            k[d] = a.jgrid.htmlDecode(b)
                        });
                        g = a(d).jqGrid("setRowData", c, k);
                        a(u).attr("editable", "0");
                        for (s = 0; s < d.p.savedRow.length; s++)
                            if (String(d.p.savedRow[s].id) === String(q)) {
                                w = s;
                                break
                            }
                        0 <= w && d.p.savedRow.splice(w, 1);
                        a(d).triggerHandler("jqGridInlineAfterSaveRow", [c, g, k, f]);
                        a.isFunction(f.aftersavefunc) && f.aftersavefunc.call(d, c, g, f);
                        m = !0;
                        a(u).removeClass("jqgrid-new-row").unbind("keydown")
                    } else a("#lui_" + a.jgrid.jqID(d.p.id)).show(),
                        v = a.extend({}, k, v), v[s] = a.jgrid.stripPref(d.p.idPrefix, v[s]), a.ajax(a.extend({
                        url: f.url,
                        data: a.isFunction(d.p.serializeRowData) ? d.p.serializeRowData.call(d, v) : v,
                        type: f.mtype,
                        async: !1,
                        complete: function(b, e) {
                            a("#lui_" + a.jgrid.jqID(d.p.id)).hide();
                            if ("success" === e) {
                                var g = !0,
                                    h;
                                h = a(d).triggerHandler("jqGridInlineSuccessSaveRow", [b, c, f]);
                                a.isArray(h) || (h = [!0, k]);
                                h[0] && a.isFunction(f.successfunc) && (h = f.successfunc.call(d, b));
                                a.isArray(h) ? (g = h[0], k = h[1] || k) : g = h;
                                if (!0 === g) {
                                    d.p.autoencode && a.each(k, function(b,
                                                                         d) {
                                        k[b] = a.jgrid.htmlDecode(d)
                                    });
                                    k = a.extend({}, k, y);
                                    a(d).jqGrid("setRowData", c, k);
                                    a(u).attr("editable", "0");
                                    for (g = 0; g < d.p.savedRow.length; g++)
                                        if (String(d.p.savedRow[g].id) === String(c)) {
                                            w = g;
                                            break
                                        }
                                    0 <= w && d.p.savedRow.splice(w, 1);
                                    a(d).triggerHandler("jqGridInlineAfterSaveRow", [c, b, k, f]);
                                    a.isFunction(f.aftersavefunc) && f.aftersavefunc.call(d, c, b);
                                    m = !0;
                                    a(u).removeClass("jqgrid-new-row").unbind("keydown")
                                } else a(d).triggerHandler("jqGridInlineErrorSaveRow", [c, b, e, null, f]), a.isFunction(f.errorfunc) && f.errorfunc.call(d,
                                    c, b, e, null), !0 === f.restoreAfterError && a(d).jqGrid("restoreRow", c, f.afterrestorefunc)
                            }
                        },
                        error: function(b, e, g) {
                            a("#lui_" + a.jgrid.jqID(d.p.id)).hide();
                            a(d).triggerHandler("jqGridInlineErrorSaveRow", [c, b, e, g, f]);
                            if (a.isFunction(f.errorfunc)) f.errorfunc.call(d, c, b, e, g);
                            else {
                                b = b.responseText || b.statusText;
                                try {
                                    a.jgrid.info_dialog(a.jgrid.errors.errcap, '<div class="ui-state-error">' + b + "</div>", a.jgrid.edit.bClose, {
                                        buttonalign: "right"
                                    })
                                } catch (h) {
                                    alert(b)
                                }
                            }!0 === f.restoreAfterError && a(d).jqGrid("restoreRow",
                                c, f.afterrestorefunc)
                        }
                    }, a.jgrid.ajaxOptions, d.p.ajaxRowOptions || {}))
                }
                return m
            }
        },
        restoreRow: function(c, e) {
            var b = a.makeArray(arguments).slice(1),
                l = {};
            "object" === a.type(b[0]) ? l = b[0] : a.isFunction(e) && (l.afterrestorefunc = e);
            l = a.extend(!0, {}, a.jgrid.inlineEdit, l);
            return this.each(function() {
                var b = this,
                    e = -1,
                    p, g = {},
                    f;
                if (b.grid && (p = a(b).jqGrid("getInd", c, !0), !1 !== p && (f = a.isFunction(l.beforeCancelRow) ? l.beforeCancelRow.call(b, l, sr) : void 0, void 0 === f && (f = !0), f))) {
                    for (f = 0; f < b.p.savedRow.length; f++)
                        if (String(b.p.savedRow[f].id) ===
                            String(c)) {
                            e = f;
                            break
                        }
                    if (0 <= e) {
                        if (a.isFunction(a.fn.datepicker)) try {
                            a("input.hasDatepicker", "#" + a.jgrid.jqID(p.id)).datepicker("hide")
                        } catch (m) {}
                        a.each(b.p.colModel, function() {
                            !0 === this.editable && b.p.savedRow[e].hasOwnProperty(this.name) && (g[this.name] = b.p.savedRow[e][this.name])
                        });
                        a(b).jqGrid("setRowData", c, g);
                        a(p).attr("editable", "0").unbind("keydown");
                        b.p.savedRow.splice(e, 1);
                        a("#" + a.jgrid.jqID(c), "#" + a.jgrid.jqID(b.p.id)).hasClass("jqgrid-new-row") && setTimeout(function() {
                            a(b).jqGrid("delRowData",
                                c);
                            a(b).jqGrid("showAddEditButtons")
                        }, 0)
                    }
                    a(b).triggerHandler("jqGridInlineAfterRestoreRow", [c]);
                    a.isFunction(l.afterrestorefunc) && l.afterrestorefunc.call(b, c)
                }
            })
        },
        addRow: function(c) {
            c = a.extend(!0, {
                rowID: null,
                initdata: {},
                position: "first",
                useDefValues: !0,
                useFormatter: !1,
                addRowParams: {
                    extraparam: {}
                }
            }, c || {});
            return this.each(function() {
                if (this.grid) {
                    var e = this,
                        b = a.isFunction(c.beforeAddRow) ? c.beforeAddRow.call(e, c.addRowParams) : void 0;
                    void 0 === b && (b = !0);
                    b && (c.rowID = a.isFunction(c.rowID) ? c.rowID.call(e,
                        c) : null != c.rowID ? c.rowID : a.jgrid.randId(), !0 === c.useDefValues && a(e.p.colModel).each(function() {
                        if (this.editoptions && this.editoptions.defaultValue) {
                            var b = this.editoptions.defaultValue,
                                b = a.isFunction(b) ? b.call(e) : b;
                            c.initdata[this.name] = b
                        }
                    }), a(e).jqGrid("addRowData", c.rowID, c.initdata, c.position), c.rowID = e.p.idPrefix + c.rowID, a("#" + a.jgrid.jqID(c.rowID), "#" + a.jgrid.jqID(e.p.id)).addClass("jqgrid-new-row"), c.useFormatter ? a("#" + a.jgrid.jqID(c.rowID) + " .ui-inline-edit", "#" + a.jgrid.jqID(e.p.id)).click() :
                        (b = e.p.prmNames, c.addRowParams.extraparam[b.oper] = b.addoper, a(e).jqGrid("editRow", c.rowID, c.addRowParams), a(e).jqGrid("setSelection", c.rowID)))
                }
            })
        },
        inlineNav: function(c, e) {
            e = a.extend(!0, {
                edit: !0,
                editicon: "ui-icon-pencil",
                add: !0,
                addicon: "ui-icon-plus",
                save: !0,
                saveicon: "ui-icon-disk",
                cancel: !0,
                cancelicon: "ui-icon-cancel",
                addParams: {
                    addRowParams: {
                        extraparam: {}
                    }
                },
                editParams: {},
                restoreAfterSelect: !0
            }, a.jgrid.nav, e || {});
            return this.each(function() {
                if (this.grid) {
                    var b = this,
                        l, h = a.jgrid.jqID(b.p.id);
                    b.p._inlinenav = !0;
                    if (!0 === e.addParams.useFormatter) {
                        var n = b.p.colModel,
                            p;
                        for (p = 0; p < n.length; p++)
                            if (n[p].formatter && "actions" === n[p].formatter) {
                                n[p].formatoptions && (n = a.extend({
                                    keys: !1,
                                    onEdit: null,
                                    onSuccess: null,
                                    afterSave: null,
                                    onError: null,
                                    afterRestore: null,
                                    extraparam: {},
                                    url: null
                                }, n[p].formatoptions), e.addParams.addRowParams = {
                                    keys: n.keys,
                                    oneditfunc: n.onEdit,
                                    successfunc: n.onSuccess,
                                    url: n.url,
                                    extraparam: n.extraparam,
                                    aftersavefunc: n.afterSave,
                                    errorfunc: n.onError,
                                    afterrestorefunc: n.afterRestore
                                });
                                break
                            }
                    }
                    e.add && a(b).jqGrid("navButtonAdd",
                        c, {
                            caption: e.addtext,
                            title: e.addtitle,
                            buttonicon: e.addicon,
                            id: b.p.id + "_iladd",
                            onClickButton: function() {
                                a(b).jqGrid("addRow", e.addParams);
                                e.addParams.useFormatter || (a("#" + h + "_ilsave").removeClass("ui-state-disabled"), a("#" + h + "_ilcancel").removeClass("ui-state-disabled"), a("#" + h + "_iladd").addClass("ui-state-disabled"), a("#" + h + "_iledit").addClass("ui-state-disabled"))
                            }
                        });
                    e.edit && a(b).jqGrid("navButtonAdd", c, {
                        caption: e.edittext,
                        title: e.edittitle,
                        buttonicon: e.editicon,
                        id: b.p.id + "_iledit",
                        onClickButton: function() {
                            var c =
                                a(b).jqGrid("getGridParam", "selrow");
                            c ? (a(b).jqGrid("editRow", c, e.editParams), a("#" + h + "_ilsave").removeClass("ui-state-disabled"), a("#" + h + "_ilcancel").removeClass("ui-state-disabled"), a("#" + h + "_iladd").addClass("ui-state-disabled"), a("#" + h + "_iledit").addClass("ui-state-disabled")) : (a.jgrid.viewModal("#alertmod", {
                                gbox: "#gbox_" + h,
                                jqm: !0
                            }), a("#jqg_alrt").focus())
                        }
                    });
                    e.save && (a(b).jqGrid("navButtonAdd", c, {
                        caption: e.savetext || "",
                        title: e.savetitle || "Save row",
                        buttonicon: e.saveicon,
                        id: b.p.id + "_ilsave",
                        onClickButton: function() {
                            var c =
                                b.p.savedRow[0].id;
                            if (c) {
                                var f = b.p.prmNames,
                                    m = f.oper,
                                    d = e.editParams;
                                a("#" + a.jgrid.jqID(c), "#" + h).hasClass("jqgrid-new-row") ? (e.addParams.addRowParams.extraparam[m] = f.addoper, d = e.addParams.addRowParams) : (e.editParams.extraparam || (e.editParams.extraparam = {}), e.editParams.extraparam[m] = f.editoper);
                                a(b).jqGrid("saveRow", c, d) && a(b).jqGrid("showAddEditButtons")
                            } else a.jgrid.viewModal("#alertmod", {
                                gbox: "#gbox_" + h,
                                jqm: !0
                            }), a("#jqg_alrt").focus()
                        }
                    }), a("#" + h + "_ilsave").addClass("ui-state-disabled"));
                    e.cancel &&
                    (a(b).jqGrid("navButtonAdd", c, {
                        caption: e.canceltext || "",
                        title: e.canceltitle || "Cancel row editing",
                        buttonicon: e.cancelicon,
                        id: b.p.id + "_ilcancel",
                        onClickButton: function() {
                            var c = b.p.savedRow[0].id,
                                f = e.editParams;
                            c ? (a("#" + a.jgrid.jqID(c), "#" + h).hasClass("jqgrid-new-row") && (f = e.addParams.addRowParams), a(b).jqGrid("restoreRow", c, f), a(b).jqGrid("showAddEditButtons")) : (a.jgrid.viewModal("#alertmod", {
                                gbox: "#gbox_" + h,
                                jqm: !0
                            }), a("#jqg_alrt").focus())
                        }
                    }), a("#" + h + "_ilcancel").addClass("ui-state-disabled"));
                    !0 ===
                    e.restoreAfterSelect && (l = a.isFunction(b.p.beforeSelectRow) ? b.p.beforeSelectRow : !1, b.p.beforeSelectRow = function(c, f) {
                        var h = !0;
                        0 < b.p.savedRow.length && !0 === b.p._inlinenav && c !== b.p.selrow && null !== b.p.selrow && (b.p.selrow === e.addParams.rowID ? a(b).jqGrid("delRowData", b.p.selrow) : a(b).jqGrid("restoreRow", b.p.selrow, e.editParams), a(b).jqGrid("showAddEditButtons"));
                        l && (h = l.call(b, c, f));
                        return h
                    })
                }
            })
        },
        showAddEditButtons: function() {
            return this.each(function() {
                if (this.grid) {
                    var c = a.jgrid.jqID(this.p.id);
                    a("#" +
                        c + "_ilsave").addClass("ui-state-disabled");
                    a("#" + c + "_ilcancel").addClass("ui-state-disabled");
                    a("#" + c + "_iladd").removeClass("ui-state-disabled");
                    a("#" + c + "_iledit").removeClass("ui-state-disabled")
                }
            })
        }
    })
})(jQuery);
(function(b) {
    b.jgrid.extend({
        editCell: function(d, f, a) {
            return this.each(function() {
                var c = this,
                    g, e, h, k;
                if (c.grid && !0 === c.p.cellEdit) {
                    f = parseInt(f, 10);
                    c.p.selrow = c.rows[d].id;
                    c.p.knv || b(c).jqGrid("GridNav");
                    if (0 < c.p.savedRow.length) {
                        if (!0 === a && d == c.p.iRow && f == c.p.iCol) return;
                        b(c).jqGrid("saveCell", c.p.savedRow[0].id, c.p.savedRow[0].ic)
                    } else window.setTimeout(function() {
                        b("#" + b.jgrid.jqID(c.p.knv)).attr("tabindex", "-1").focus()
                    }, 0);
                    k = c.p.colModel[f];
                    g = k.name;
                    if ("subgrid" !== g && "cb" !== g && "rn" !== g) {
                        h = b("td:eq(" +
                            f + ")", c.rows[d]);
                        if (!0 !== k.editable || !0 !== a || h.hasClass("not-editable-cell")) 0 <= parseInt(c.p.iCol, 10) && 0 <= parseInt(c.p.iRow, 10) && (b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")), h.addClass("edit-cell ui-state-highlight"), b(c.rows[d]).addClass("selected-row ui-state-hover"), e = h.html().replace(/\&#160\;/ig, ""), b(c).triggerHandler("jqGridSelectCell", [c.rows[d].id, g, e, d, f]), b.isFunction(c.p.onSelectCell) &&
                        c.p.onSelectCell.call(c, c.rows[d].id, g, e, d, f);
                        else {
                            0 <= parseInt(c.p.iCol, 10) && 0 <= parseInt(c.p.iRow, 10) && (b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover"));
                            b(h).addClass("edit-cell ui-state-highlight");
                            b(c.rows[d]).addClass("selected-row ui-state-hover");
                            try {
                                e = b.unformat.call(c, h, {
                                    rowId: c.rows[d].id,
                                    colModel: k
                                }, f)
                            } catch (m) {
                                e = k.edittype && "textarea" === k.edittype ? b(h).text() : b(h).html()
                            }
                            c.p.autoencode &&
                            (e = b.jgrid.htmlDecode(e));
                            k.edittype || (k.edittype = "text");
                            c.p.savedRow.push({
                                id: d,
                                ic: f,
                                name: g,
                                v: e
                            });
                            if ("&nbsp;" === e || "&#160;" === e || 1 === e.length && 160 === e.charCodeAt(0)) e = "";
                            if (b.isFunction(c.p.formatCell)) {
                                var l = c.p.formatCell.call(c, c.rows[d].id, g, e, d, f);
                                void 0 !== l && (e = l)
                            }
                            b(c).triggerHandler("jqGridBeforeEditCell", [c.rows[d].id, g, e, d, f]);
                            b.isFunction(c.p.beforeEditCell) && c.p.beforeEditCell.call(c, c.rows[d].id, g, e, d, f);
                            var l = b.extend({}, k.editoptions || {}, {
                                    id: d + "_" + g,
                                    name: g
                                }),
                                q = b.jgrid.createEl.call(c,
                                    k.edittype, l, e, !0, b.extend({}, b.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                            b(h).html("").append(q).attr("tabindex", "0");
                            b.jgrid.bindEv.call(c, q, l);
                            window.setTimeout(function() {
                                b(q).focus()
                            }, 0);
                            b("input, select, textarea", h).bind("keydown", function(a) {
                                27 === a.keyCode && (0 < b("input.hasDatepicker", h).length ? b(".ui-datepicker").is(":hidden") ? b(c).jqGrid("restoreCell", d, f) : b("input.hasDatepicker", h).datepicker("hide") : b(c).jqGrid("restoreCell", d, f));
                                if (13 === a.keyCode) return b(c).jqGrid("saveCell", d, f), !1;
                                if (9 === a.keyCode) {
                                    if (c.grid.hDiv.loading) return !1;
                                    a.shiftKey ? b(c).jqGrid("prevCell", d, f) : b(c).jqGrid("nextCell", d, f)
                                }
                                a.stopPropagation()
                            });
                            b(c).triggerHandler("jqGridAfterEditCell", [c.rows[d].id, g, e, d, f]);
                            b.isFunction(c.p.afterEditCell) && c.p.afterEditCell.call(c, c.rows[d].id, g, e, d, f)
                        }
                        c.p.iCol = f;
                        c.p.iRow = d
                    }
                }
            })
        },
        saveCell: function(d, f) {
            return this.each(function() {
                var a = this,
                    c;
                if (a.grid && !0 === a.p.cellEdit) {
                    c = 1 <= a.p.savedRow.length ? 0 : null;
                    if (null !== c) {
                        var g = b("td:eq(" + f + ")", a.rows[d]),
                            e, h, k = a.p.colModel[f],
                            m = k.name,
                            l = b.jgrid.jqID(m);
                        switch (k.edittype) {
                            case "select":
                                if (k.editoptions.multiple) {
                                    var l = b("#" + d + "_" + l, a.rows[d]),
                                        q = [];
                                    (e = b(l).val()) ? e.join(","): e = "";
                                    b("option:selected", l).each(function(a, c) {
                                        q[a] = b(c).text()
                                    });
                                    h = q.join(",")
                                } else e = b("#" + d + "_" + l + " option:selected", a.rows[d]).val(), h = b("#" + d + "_" + l + " option:selected", a.rows[d]).text();
                                k.formatter && (h = e);
                                break;
                            case "checkbox":
                                var n = ["Yes", "No"];
                                k.editoptions && (n = k.editoptions.value.split(":"));
                                h = e = b("#" + d + "_" + l, a.rows[d]).is(":checked") ? n[0] : n[1];
                                break;
                            case "password":
                            case "text":
                            case "textarea":
                            case "button":
                                h = e = b("#" + d + "_" + l, a.rows[d]).val();
                                break;
                            case "custom":
                                try {
                                    if (k.editoptions && b.isFunction(k.editoptions.custom_value)) {
                                        e = k.editoptions.custom_value.call(a, b(".customelement", g), "get");
                                        if (void 0 === e) throw "e2";
                                        h = e
                                    } else throw "e1";
                                } catch (r) {
                                    "e1" === r && b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.nodefined, b.jgrid.edit.bClose), "e2" === r ? b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " +
                                        b.jgrid.edit.msg.novalue, b.jgrid.edit.bClose) : b.jgrid.info_dialog(b.jgrid.errors.errcap, r.message, b.jgrid.edit.bClose)
                                }
                        }
                        if (h !== a.p.savedRow[c].v) {
                            if (c = b(a).triggerHandler("jqGridBeforeSaveCell", [a.rows[d].id, m, e, d, f])) h = e = c;
                            b.isFunction(a.p.beforeSaveCell) && (c = a.p.beforeSaveCell.call(a, a.rows[d].id, m, e, d, f)) && (h = e = c);
                            var s = b.jgrid.checkValues.call(a, e, f);
                            if (!0 === s[0]) {
                                c = b(a).triggerHandler("jqGridBeforeSubmitCell", [a.rows[d].id, m, e, d, f]) || {};
                                b.isFunction(a.p.beforeSubmitCell) && ((c = a.p.beforeSubmitCell.call(a,
                                    a.rows[d].id, m, e, d, f)) || (c = {}));
                                0 < b("input.hasDatepicker", g).length && b("input.hasDatepicker", g).datepicker("hide");
                                if ("remote" === a.p.cellsubmit)
                                    if (a.p.cellurl) {
                                        var p = {};
                                        a.p.autoencode && (e = b.jgrid.htmlEncode(e));
                                        p[m] = e;
                                        n = a.p.prmNames;
                                        k = n.id;
                                        l = n.oper;
                                        p[k] = b.jgrid.stripPref(a.p.idPrefix, a.rows[d].id);
                                        p[l] = n.editoper;
                                        p = b.extend(c, p);
                                        b("#lui_" + b.jgrid.jqID(a.p.id)).show();
                                        a.grid.hDiv.loading = !0;
                                        b.ajax(b.extend({
                                                url: a.p.cellurl,
                                                data: b.isFunction(a.p.serializeCellData) ? a.p.serializeCellData.call(a, p) : p,
                                                type: "POST",
                                                complete: function(c, k) {
                                                    b("#lui_" + a.p.id).hide();
                                                    a.grid.hDiv.loading = !1;
                                                    if ("success" === k) {
                                                        var l = b(a).triggerHandler("jqGridAfterSubmitCell", [a, c, p.id, m, e, d, f]) || [!0, ""];
                                                        !0 === l[0] && b.isFunction(a.p.afterSubmitCell) && (l = a.p.afterSubmitCell.call(a, c, p.id, m, e, d, f));
                                                        !0 === l[0] ? (b(g).empty(), b(a).jqGrid("setCell", a.rows[d].id, f, h, !1, !1, !0), b(g).addClass("dirty-cell"), b(a.rows[d]).addClass("edited"), b(a).triggerHandler("jqGridAfterSaveCell", [a.rows[d].id, m, e, d, f]), b.isFunction(a.p.afterSaveCell) &&
                                                        a.p.afterSaveCell.call(a, a.rows[d].id, m, e, d, f), a.p.savedRow.splice(0, 1)) : (b.jgrid.info_dialog(b.jgrid.errors.errcap, l[1], b.jgrid.edit.bClose), b(a).jqGrid("restoreCell", d, f))
                                                    }
                                                },
                                                error: function(c, e, h) {
                                                    b("#lui_" + b.jgrid.jqID(a.p.id)).hide();
                                                    a.grid.hDiv.loading = !1;
                                                    b(a).triggerHandler("jqGridErrorCell", [c, e, h]);
                                                    b.isFunction(a.p.errorCell) ? a.p.errorCell.call(a, c, e, h) : b.jgrid.info_dialog(b.jgrid.errors.errcap, c.status + " : " + c.statusText + "<br/>" + e, b.jgrid.edit.bClose);
                                                    b(a).jqGrid("restoreCell", d, f)
                                                }
                                            }, b.jgrid.ajaxOptions,
                                            a.p.ajaxCellOptions || {}))
                                    } else try {
                                        b.jgrid.info_dialog(b.jgrid.errors.errcap, b.jgrid.errors.nourl, b.jgrid.edit.bClose), b(a).jqGrid("restoreCell", d, f)
                                    } catch (t) {}
                                "clientArray" === a.p.cellsubmit && (b(g).empty(), b(a).jqGrid("setCell", a.rows[d].id, f, h, !1, !1, !0), b(g).addClass("dirty-cell"), b(a.rows[d]).addClass("edited"), b(a).triggerHandler("jqGridAfterSaveCell", [a.rows[d].id, m, e, d, f]), b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, m, e, d, f), a.p.savedRow.splice(0, 1))
                            } else try {
                                window.setTimeout(function() {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap,
                                        e + " " + s[1], b.jgrid.edit.bClose)
                                }, 100), b(a).jqGrid("restoreCell", d, f)
                            } catch (u) {}
                        } else b(a).jqGrid("restoreCell", d, f)
                    }
                    window.setTimeout(function() {
                        b("#" + b.jgrid.jqID(a.p.knv)).attr("tabindex", "-1").focus()
                    }, 0)
                }
            })
        },
        restoreCell: function(d, f) {
            return this.each(function() {
                var a = this,
                    c;
                if (a.grid && !0 === a.p.cellEdit) {
                    c = 1 <= a.p.savedRow.length ? 0 : null;
                    if (null !== c) {
                        var g = b("td:eq(" + f + ")", a.rows[d]);
                        if (b.isFunction(b.fn.datepicker)) try {
                            b("input.hasDatepicker", g).datepicker("hide")
                        } catch (e) {}
                        b(g).empty().attr("tabindex",
                            "-1");
                        b(a).jqGrid("setCell", a.rows[d].id, f, a.p.savedRow[c].v, !1, !1, !0);
                        b(a).triggerHandler("jqGridAfterRestoreCell", [a.rows[d].id, a.p.savedRow[c].v, d, f]);
                        b.isFunction(a.p.afterRestoreCell) && a.p.afterRestoreCell.call(a, a.rows[d].id, a.p.savedRow[c].v, d, f);
                        a.p.savedRow.splice(0, 1)
                    }
                    window.setTimeout(function() {
                        b("#" + a.p.knv).attr("tabindex", "-1").focus()
                    }, 0)
                }
            })
        },
        nextCell: function(d, f) {
            return this.each(function() {
                var a = !1,
                    c;
                if (this.grid && !0 === this.p.cellEdit) {
                    for (c = f + 1; c < this.p.colModel.length; c++)
                        if (!0 ===
                            this.p.colModel[c].editable) {
                            a = c;
                            break
                        }!1 !== a ? b(this).jqGrid("editCell", d, a, !0) : 0 < this.p.savedRow.length && b(this).jqGrid("saveCell", d, f)
                }
            })
        },
        prevCell: function(d, f) {
            return this.each(function() {
                var a = !1,
                    c;
                if (this.grid && !0 === this.p.cellEdit) {
                    for (c = f - 1; 0 <= c; c--)
                        if (!0 === this.p.colModel[c].editable) {
                            a = c;
                            break
                        }!1 !== a ? b(this).jqGrid("editCell", d, a, !0) : 0 < this.p.savedRow.length && b(this).jqGrid("saveCell", d, f)
                }
            })
        },
        GridNav: function() {
            return this.each(function() {
                function d(c, d, e) {
                    if ("v" === e.substr(0, 1)) {
                        var f =
                                b(a.grid.bDiv)[0].clientHeight,
                            g = b(a.grid.bDiv)[0].scrollTop,
                            n = a.rows[c].offsetTop + a.rows[c].clientHeight,
                            r = a.rows[c].offsetTop;
                        "vd" === e && n >= f && (b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop + a.rows[c].clientHeight);
                        "vu" === e && r < g && (b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop - a.rows[c].clientHeight)
                    }
                    "h" === e && (e = b(a.grid.bDiv)[0].clientWidth, f = b(a.grid.bDiv)[0].scrollLeft, g = a.rows[c].cells[d].offsetLeft, a.rows[c].cells[d].offsetLeft + a.rows[c].cells[d].clientWidth >= e + parseInt(f,
                        10) ? b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft + a.rows[c].cells[d].clientWidth : g < f && (b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft - a.rows[c].cells[d].clientWidth))
                }

                function f(b, c) {
                    var d, e;
                    if ("lft" === c)
                        for (d = b + 1, e = b; 0 <= e; e--)
                            if (!0 !== a.p.colModel[e].hidden) {
                                d = e;
                                break
                            }
                    if ("rgt" === c)
                        for (d = b - 1, e = b; e < a.p.colModel.length; e++)
                            if (!0 !== a.p.colModel[e].hidden) {
                                d = e;
                                break
                            }
                    return d
                }
                var a = this;
                if (a.grid && !0 === a.p.cellEdit) {
                    a.p.knv = a.p.id + "_kn";
                    var c = b("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='" +
                            a.p.knv + "'></div></div>"),
                        g, e;
                    b(c).insertBefore(a.grid.cDiv);
                    b("#" + a.p.knv).focus().keydown(function(c) {
                        e = c.keyCode;
                        "rtl" === a.p.direction && (37 === e ? e = 39 : 39 === e && (e = 37));
                        switch (e) {
                            case 38:
                                0 < a.p.iRow - 1 && (d(a.p.iRow - 1, a.p.iCol, "vu"), b(a).jqGrid("editCell", a.p.iRow - 1, a.p.iCol, !1));
                                break;
                            case 40:
                                a.p.iRow + 1 <= a.rows.length - 1 && (d(a.p.iRow + 1, a.p.iCol, "vd"), b(a).jqGrid("editCell", a.p.iRow + 1, a.p.iCol, !1));
                                break;
                            case 37:
                                0 <= a.p.iCol - 1 && (g = f(a.p.iCol - 1, "lft"), d(a.p.iRow, g, "h"), b(a).jqGrid("editCell", a.p.iRow, g, !1));
                                break;
                            case 39:
                                a.p.iCol + 1 <= a.p.colModel.length - 1 && (g = f(a.p.iCol + 1, "rgt"), d(a.p.iRow, g, "h"), b(a).jqGrid("editCell", a.p.iRow, g, !1));
                                break;
                            case 13:
                                0 <= parseInt(a.p.iCol, 10) && 0 <= parseInt(a.p.iRow, 10) && b(a).jqGrid("editCell", a.p.iRow, a.p.iCol, !0);
                                break;
                            default:
                                return !0
                        }
                        return !1
                    })
                }
            })
        },
        getChangedCells: function(d) {
            var f = [];
            d || (d = "all");
            this.each(function() {
                var a = this,
                    c;
                a.grid && !0 === a.p.cellEdit && b(a.rows).each(function(g) {
                    var e = {};
                    b(this).hasClass("edited") && (b("td", this).each(function(f) {
                        c = a.p.colModel[f].name;
                        if ("cb" !== c && "subgrid" !== c)
                            if ("dirty" === d) {
                                if (b(this).hasClass("dirty-cell")) try {
                                    e[c] = b.unformat.call(a, this, {
                                        rowId: a.rows[g].id,
                                        colModel: a.p.colModel[f]
                                    }, f)
                                } catch (k) {
                                    e[c] = b.jgrid.htmlDecode(b(this).html())
                                }
                            } else try {
                                e[c] = b.unformat.call(a, this, {
                                    rowId: a.rows[g].id,
                                    colModel: a.p.colModel[f]
                                }, f)
                            } catch (m) {
                                e[c] = b.jgrid.htmlDecode(b(this).html())
                            }
                    }), e.id = this.id, f.push(e))
                })
            });
            return f
        }
    })
})(jQuery);
(function(c) {
    c.fn.jqm = function(a) {
        var k = {
            overlay: 50,
            closeoverlay: !0,
            overlayClass: "jqmOverlay",
            closeClass: "jqmClose",
            trigger: ".jqModal",
            ajax: d,
            ajaxText: "",
            target: d,
            modal: d,
            toTop: d,
            onShow: d,
            onHide: d,
            onLoad: d
        };
        return this.each(function() {
            if (this._jqm) return l[this._jqm].c = c.extend({}, l[this._jqm].c, a);
            n++;
            this._jqm = n;
            l[n] = {
                c: c.extend(k, c.jqm.params, a),
                a: d,
                w: c(this).addClass("jqmID" + n),
                s: n
            };
            k.trigger && c(this).jqmAddTrigger(k.trigger)
        })
    };
    c.fn.jqmAddClose = function(a) {
        return r(this, a, "jqmHide")
    };
    c.fn.jqmAddTrigger =
        function(a) {
            return r(this, a, "jqmShow")
        };
    c.fn.jqmShow = function(a) {
        return this.each(function() {
            c.jqm.open(this._jqm, a)
        })
    };
    c.fn.jqmHide = function(a) {
        return this.each(function() {
            c.jqm.close(this._jqm, a)
        })
    };
    c.jqm = {
        hash: {},
        open: function(a, k) {
            var b = l[a],
                e = b.c,
                h = "." + e.closeClass,
                f = parseInt(b.w.css("z-index")),
                f = 0 < f ? f : 3E3,
                g = c("<div></div>").css({
                    height: "100%",
                    width: "100%",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    "z-index": f - 1,
                    opacity: e.overlay / 100
                });
            if (b.a) return d;
            b.t = k;
            b.a = !0;
            b.w.css("z-index", f);
            e.modal ? (m[0] || setTimeout(function() {
                    s("bind")
                },
                1), m.push(a)) : 0 < e.overlay ? e.closeoverlay && b.w.jqmAddClose(g) : g = d;
            b.o = g ? g.addClass(e.overlayClass).prependTo("body") : d;
            e.ajax ? (f = e.target || b.w, g = e.ajax, f = "string" == typeof f ? c(f, b.w) : c(f), g = "@" == g.substr(0, 1) ? c(k).attr(g.substring(1)) : g, f.html(e.ajaxText).load(g, function() {
                e.onLoad && e.onLoad.call(this, b);
                h && b.w.jqmAddClose(c(h, b.w));
                p(b)
            })) : h && b.w.jqmAddClose(c(h, b.w));
            e.toTop && b.o && b.w.before('<span id="jqmP' + b.w[0]._jqm + '"></span>').insertAfter(b.o);
            e.onShow ? e.onShow(b) : b.w.show();
            p(b);
            return d
        },
        close: function(a) {
            a = l[a];
            if (!a.a) return d;
            a.a = d;
            m[0] && (m.pop(), m[0] || s("unbind"));
            a.c.toTop && a.o && c("#jqmP" + a.w[0]._jqm).after(a.w).remove();
            if (a.c.onHide) a.c.onHide(a);
            else a.w.hide(), a.o && a.o.remove();
            return d
        },
        params: {}
    };
    var n = 0,
        l = c.jqm.hash,
        m = [],
        d = !1,
        p = function(a) {
            try {
                c(":input:visible", a.w)[0].focus()
            } catch (d) {}
        },
        s = function(a) {
            c(document)[a]("keypress", q)[a]("keydown", q)[a]("mousedown", q)
        },
        q = function(a) {
            var d = l[m[m.length - 1]],
                b = !c(a.target).parents(".jqmID" + d.s)[0];
            b && (c(".jqmID" + d.s).each(function() {
                var d =
                        c(this),
                    h = d.offset();
                if (h.top <= a.pageY && a.pageY <= h.top + d.height() && h.left <= a.pageX && a.pageX <= h.left + d.width()) return b = !1
            }), p(d));
            return !b
        },
        r = function(a, k, b) {
            return a.each(function() {
                var a = this._jqm;
                c(k).each(function() {
                    this[b] || (this[b] = [], c(this).click(function() {
                        for (var a in {
                            jqmShow: 1,
                            jqmHide: 1
                        })
                            for (var b in this[a])
                                if (l[this[a][b]]) l[this[a][b]].w[a](this);
                        return d
                    }));
                    this[b].push(a)
                })
            })
        }
})(jQuery);
(function(b) {
    b.fn.jqDrag = function(a) {
        return h(this, a, "d")
    };
    b.fn.jqResize = function(a, b) {
        return h(this, a, "r", b)
    };
    b.jqDnR = {
        dnr: {},
        e: 0,
        drag: function(a) {
            "d" == d.k ? e.css({
                left: d.X + a.pageX - d.pX,
                top: d.Y + a.pageY - d.pY
            }) : (e.css({
                width: Math.max(a.pageX - d.pX + d.W, 0),
                height: Math.max(a.pageY - d.pY + d.H, 0)
            }), f && g.css({
                width: Math.max(a.pageX - f.pX + f.W, 0),
                height: Math.max(a.pageY - f.pY + f.H, 0)
            }));
            return !1
        },
        stop: function() {
            b(document).unbind("mousemove", c.drag).unbind("mouseup", c.stop)
        }
    };
    var c = b.jqDnR,
        d = c.dnr,
        e = c.e,
        g, f, h = function(a,
                           c, h, n) {
            return a.each(function() {
                c = c ? b(c, a) : a;
                c.bind("mousedown", {
                    e: a,
                    k: h
                }, function(a) {
                    var c = a.data,
                        k = {};
                    e = c.e;
                    g = n ? b(n) : !1;
                    if ("relative" != e.css("position")) try {
                        e.position(k)
                    } catch (h) {}
                    d = {
                        X: k.left || l("left") || 0,
                        Y: k.top || l("top") || 0,
                        W: l("width") || e[0].scrollWidth || 0,
                        H: l("height") || e[0].scrollHeight || 0,
                        pX: a.pageX,
                        pY: a.pageY,
                        k: c.k
                    };
                    f = g && "d" != c.k ? {
                        X: k.left || m("left") || 0,
                        Y: k.top || m("top") || 0,
                        W: g[0].offsetWidth || m("width") || 0,
                        H: g[0].offsetHeight || m("height") || 0,
                        pX: a.pageX,
                        pY: a.pageY,
                        k: c.k
                    } : !1;
                    if (b("input.hasDatepicker",
                            e[0])[0]) try {
                        b("input.hasDatepicker", e[0]).datepicker("hide")
                    } catch (p) {}
                    b(document).mousemove(b.jqDnR.drag).mouseup(b.jqDnR.stop);
                    return !1
                })
            })
        },
        l = function(a) {
            return parseInt(e.css(a), 10) || !1
        },
        m = function(a) {
            return parseInt(g.css(a), 10) || !1
        }
})(jQuery);
(function(b) {
    b.jgrid.extend({
        setSubGrid: function() {
            return this.each(function() {
                var d, c;
                this.p.subGridOptions = b.extend({
                    plusicon: "ui-icon-plus",
                    minusicon: "ui-icon-minus",
                    openicon: "ui-icon-carat-1-sw",
                    expandOnLoad: !1,
                    delayOnLoad: 50,
                    selectOnExpand: !1,
                    selectOnCollapse: !1,
                    reloadOnExpand: !0
                }, this.p.subGridOptions || {});
                this.p.colNames.unshift("");
                this.p.colModel.unshift({
                    name: "subgrid",
                    width: b.jgrid.cell_width ? this.p.subGridWidth + this.p.cellLayout : this.p.subGridWidth,
                    sortable: !1,
                    resizable: !1,
                    hidedlg: !0,
                    search: !1,
                    fixed: !0
                });
                d = this.p.subGridModel;
                if (d[0])
                    for (d[0].align = b.extend([], d[0].align || []), c = 0; c < d[0].name.length; c++) d[0].align[c] = d[0].align[c] || "left"
            })
        },
        addSubGridCell: function(b, c) {
            var a = "",
                p, n;
            this.each(function() {
                a = this.formatCol(b, c);
                n = this.p.id;
                p = this.p.subGridOptions.plusicon
            });
            return '<td role="gridcell" aria-describedby="' + n + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + a + "><a style='cursor:pointer;'><span class='ui-icon " + p + "'></span></a></td>"
        },
        addSubGrid: function(d, c) {
            return this.each(function() {
                var a =
                    this;
                if (a.grid) {
                    var p = function(c, d, h) {
                            d = b("<td align='" + a.p.subGridModel[0].align[h] + "'></td>").html(d);
                            b(c).append(d)
                        },
                        n = function(c, d) {
                            var h, f, e, g = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                k = b("<tr></tr>");
                            for (f = 0; f < a.p.subGridModel[0].name.length; f++) h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"), b(h).html(a.p.subGridModel[0].name[f]), b(h).width(a.p.subGridModel[0].width[f]), b(k).append(h);
                            b(g).append(k);
                            c && (e = a.p.xmlReader.subgrid,
                                b(e.root + " " + e.row, c).each(function() {
                                    k = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                    if (!0 === e.repeatitems) b(e.cell, this).each(function(a) {
                                        p(k, b(this).text() || "&#160;", a)
                                    });
                                    else {
                                        var c = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                                        if (c)
                                            for (f = 0; f < c.length; f++) p(k, b(c[f], this).text() || "&#160;", f)
                                    }
                                    b(g).append(k)
                                }));
                            h = b("table:first", a.grid.bDiv).attr("id") + "_";
                            b("#" + b.jgrid.jqID(h + d)).append(g);
                            a.grid.hDiv.loading = !1;
                            b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                            return !1
                        },
                        r = function(c, d) {
                            var h,
                                f, e, g, k, m = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                l = b("<tr></tr>");
                            for (f = 0; f < a.p.subGridModel[0].name.length; f++) h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"), b(h).html(a.p.subGridModel[0].name[f]), b(h).width(a.p.subGridModel[0].width[f]), b(l).append(h);
                            b(m).append(l);
                            if (c && (g = a.p.jsonReader.subgrid, h = b.jgrid.getAccessor(c, g.root), void 0 !== h))
                                for (f = 0; f < h.length; f++) {
                                    e = h[f];
                                    l = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                    if (!0 === g.repeatitems)
                                        for (g.cell && (e = e[g.cell]), k = 0; k < e.length; k++) p(l, e[k] || "&#160;", k);
                                    else {
                                        var n = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                                        if (n.length)
                                            for (k = 0; k < n.length; k++) p(l, e[n[k]] || "&#160;", k)
                                    }
                                    b(m).append(l)
                                }
                            f = b("table:first", a.grid.bDiv).attr("id") + "_";
                            b("#" + b.jgrid.jqID(f + d)).append(m);
                            a.grid.hDiv.loading = !1;
                            b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                            return !1
                        },
                        v = function(c) {
                            var e, d, f, g;
                            e = b(c).attr("id");
                            d = {
                                nd_: (new Date).getTime()
                            };
                            d[a.p.prmNames.subgridid] = e;
                            if (!a.p.subGridModel[0]) return !1;
                            if (a.p.subGridModel[0].params)
                                for (g = 0; g < a.p.subGridModel[0].params.length; g++)
                                    for (f = 0; f < a.p.colModel.length; f++) a.p.colModel[f].name === a.p.subGridModel[0].params[g] && (d[a.p.colModel[f].name] = b("td:eq(" + f + ")", c).text().replace(/\&#160\;/ig, ""));
                            if (!a.grid.hDiv.loading) switch (a.grid.hDiv.loading = !0, b("#load_" + b.jgrid.jqID(a.p.id)).show(), a.p.subgridtype || (a.p.subgridtype = a.p.datatype), b.isFunction(a.p.subgridtype) ? a.p.subgridtype.call(a, d) : a.p.subgridtype = a.p.subgridtype.toLowerCase(), a.p.subgridtype) {
                                case "xml":
                                case "json":
                                    b.ajax(b.extend({
                                        type: a.p.mtype,
                                        url: a.p.subGridUrl,
                                        dataType: a.p.subgridtype,
                                        data: b.isFunction(a.p.serializeSubGridData) ? a.p.serializeSubGridData.call(a, d) : d,
                                        complete: function(c) {
                                            "xml" === a.p.subgridtype ? n(c.responseXML, e) : r(b.jgrid.parse(c.responseText), e)
                                        }
                                    }, b.jgrid.ajaxOptions, a.p.ajaxSubgridOptions || {}))
                            }
                            return !1
                        },
                        e, m, s, t = 0,
                        g, l;
                    b.each(a.p.colModel, function() {
                        !0 !== this.hidden && "rn" !== this.name && "cb" !== this.name || t++
                    });
                    var u = a.rows.length,
                        q = 1;
                    void 0 !== c && 0 < c && (q = c, u = c + 1);
                    for (; q < u;) b(a.rows[q]).hasClass("jqgrow") && b(a.rows[q].cells[d]).bind("click",
                        function() {
                            var c = b(this).parent("tr")[0];
                            l = c.nextSibling;
                            if (b(this).hasClass("sgcollapsed")) {
                                m = a.p.id;
                                e = c.id;
                                if (!0 === a.p.subGridOptions.reloadOnExpand || !1 === a.p.subGridOptions.reloadOnExpand && !b(l).hasClass("ui-subgrid")) {
                                    s = 1 <= d ? "<td colspan='" + d + "'>&#160;</td>" : "";
                                    g = b(a).triggerHandler("jqGridSubGridBeforeExpand", [m + "_" + e, e]);
                                    (g = !1 === g || "stop" === g ? !1 : !0) && b.isFunction(a.p.subGridBeforeExpand) && (g = a.p.subGridBeforeExpand.call(a, m + "_" + e, e));
                                    if (!1 === g) return !1;
                                    b(c).after("<tr role='row' class='ui-subgrid'>" +
                                        s + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + a.p.subGridOptions.openicon + "'></span></td><td colspan='" + parseInt(a.p.colNames.length - 1 - t, 10) + "' class='ui-widget-content subgrid-data'><div id=" + m + "_" + e + " class='tablediv'></div></td></tr>");
                                    b(a).triggerHandler("jqGridSubGridRowExpanded", [m + "_" + e, e]);
                                    b.isFunction(a.p.subGridRowExpanded) ? a.p.subGridRowExpanded.call(a, m + "_" + e, e) : v(c)
                                } else b(l).show();
                                b(this).html("<a style='cursor:pointer;'><span class='ui-icon " + a.p.subGridOptions.minusicon +
                                    "'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");
                                a.p.subGridOptions.selectOnExpand && b(a).jqGrid("setSelection", e)
                            } else if (b(this).hasClass("sgexpanded")) {
                                g = b(a).triggerHandler("jqGridSubGridRowColapsed", [m + "_" + e, e]);
                                g = !1 === g || "stop" === g ? !1 : !0;
                                e = c.id;
                                g && b.isFunction(a.p.subGridRowColapsed) && (g = a.p.subGridRowColapsed.call(a, m + "_" + e, e));
                                if (!1 === g) return !1;
                                !0 === a.p.subGridOptions.reloadOnExpand ? b(l).remove(".ui-subgrid") : b(l).hasClass("ui-subgrid") && b(l).hide();
                                b(this).html("<a style='cursor:pointer;'><span class='ui-icon " +
                                    a.p.subGridOptions.plusicon + "'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed");
                                a.p.subGridOptions.selectOnCollapse && b(a).jqGrid("setSelection", e)
                            }
                            return !1
                        }), q++;
                    !0 === a.p.subGridOptions.expandOnLoad && b(a.rows).filter(".jqgrow").each(function(a, c) {
                        b(c.cells[0]).click()
                    });
                    a.subGridXml = function(a, b) {
                        n(a, b)
                    };
                    a.subGridJson = function(a, b) {
                        r(a, b)
                    }
                }
            })
        },
        expandSubGridRow: function(d) {
            return this.each(function() {
                if ((this.grid || d) && !0 === this.p.subGrid) {
                    var c = b(this).jqGrid("getInd", d, !0);
                    c && (c = b("td.sgcollapsed",
                        c)[0]) && b(c).trigger("click")
                }
            })
        },
        collapseSubGridRow: function(d) {
            return this.each(function() {
                if ((this.grid || d) && !0 === this.p.subGrid) {
                    var c = b(this).jqGrid("getInd", d, !0);
                    c && (c = b("td.sgexpanded", c)[0]) && b(c).trigger("click")
                }
            })
        },
        toggleSubGridRow: function(d) {
            return this.each(function() {
                if ((this.grid || d) && !0 === this.p.subGrid) {
                    var c = b(this).jqGrid("getInd", d, !0);
                    if (c) {
                        var a = b("td.sgcollapsed", c)[0];
                        a ? b(a).trigger("click") : (a = b("td.sgexpanded", c)[0]) && b(a).trigger("click")
                    }
                }
            })
        }
    })
})(jQuery);
(function(d) {
    d.extend(d.jgrid, {
        template: function(b) {
            var k = d.makeArray(arguments).slice(1),
                a, c = k.length;
            null == b && (b = "");
            return b.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g, function(b, m) {
                if (!isNaN(parseInt(m, 10))) return k[parseInt(m, 10)];
                for (a = 0; a < c; a++)
                    if (d.isArray(k[a]))
                        for (var e = k[a], f = e.length; f--;)
                            if (m === e[f].nm) return e[f].v
            })
        }
    });
    d.jgrid.extend({
        groupingSetup: function() {
            return this.each(function() {
                var b, k, a = this.p.colModel,
                    c = this.p.groupingView;
                if (null === c || "object" !== typeof c && !d.isFunction(c)) this.p.grouping = !1;
                else if (c.groupField.length) {
                    void 0 === c.visibiltyOnNextGrouping && (c.visibiltyOnNextGrouping = []);
                    c.lastvalues = [];
                    c._locgr || (c.groups = []);
                    c.counters = [];
                    for (b = 0; b < c.groupField.length; b++) c.groupOrder[b] || (c.groupOrder[b] = "asc"), c.groupText[b] || (c.groupText[b] = "{0}"), "boolean" !== typeof c.groupColumnShow[b] && (c.groupColumnShow[b] = !0), "boolean" !== typeof c.groupSummary[b] && (c.groupSummary[b] = !1), c.groupSummaryPos[b] || (c.groupSummaryPos[b] = "footer"), !0 === c.groupColumnShow[b] ? (c.visibiltyOnNextGrouping[b] = !0, d(this).jqGrid("showCol", c.groupField[b])) : (c.visibiltyOnNextGrouping[b] = d("#" + d.jgrid.jqID(this.p.id + "_" + c.groupField[b])).is(":visible"), d(this).jqGrid("hideCol", c.groupField[b]));
                    c.summary = [];
                    c.hideFirstGroupCol && (c.formatDisplayField[0] = function(a) {
                        return a
                    });
                    b = 0;
                    for (k = a.length; b < k; b++) c.hideFirstGroupCol && !a[b].hidden && c.groupField[0] === a[b].name && (a[b].formatter = function() {
                        return ""
                    }), a[b].summaryType && (a[b].summaryDivider ? c.summary.push({
                        nm: a[b].name,
                        st: a[b].summaryType,
                        v: "",
                        sd: a[b].summaryDivider,
                        vd: "",
                        sr: a[b].summaryRound,
                        srt: a[b].summaryRoundType || "round"
                    }) : c.summary.push({
                        nm: a[b].name,
                        st: a[b].summaryType,
                        v: "",
                        sr: a[b].summaryRound,
                        srt: a[b].summaryRoundType || "round"
                    }))
                } else this.p.grouping = !1
            })
        },
        groupingPrepare: function(b, k) {
            this.each(function() {
                var a = this.p.groupingView,
                    c = this,
                    g, m = a.groupField.length,
                    e, f, h, p = 0;
                for (g = 0; g < m; g++) e = a.groupField[g], h = a.displayField[g], f = b[e], h = null == h ? null : b[h], null == h && (h = f), void 0 !== f && (0 === k ? (a.groups.push({
                    idx: g,
                    dataIndex: e,
                    value: f,
                    displayValue: h,
                    startRow: k,
                    cnt: 1,
                    summary: []
                }), a.lastvalues[g] = f, a.counters[g] = {
                    cnt: 1,
                    pos: a.groups.length - 1,
                    summary: d.extend(!0, [], a.summary)
                }) : "object" === typeof f || (d.isArray(a.isInTheSameGroup) && d.isFunction(a.isInTheSameGroup[g]) ? a.isInTheSameGroup[g].call(c, a.lastvalues[g], f, g, a) : a.lastvalues[g] === f) ? 1 === p ? (a.groups.push({
                    idx: g,
                    dataIndex: e,
                    value: f,
                    displayValue: h,
                    startRow: k,
                    cnt: 1,
                    summary: []
                }), a.lastvalues[g] = f, a.counters[g] = {
                    cnt: 1,
                    pos: a.groups.length - 1,
                    summary: d.extend(!0, [], a.summary)
                }) : (a.counters[g].cnt += 1, a.groups[a.counters[g].pos].cnt =
                    a.counters[g].cnt) : (a.groups.push({
                    idx: g,
                    dataIndex: e,
                    value: f,
                    displayValue: h,
                    startRow: k,
                    cnt: 1,
                    summary: []
                }), a.lastvalues[g] = f, p = 1, a.counters[g] = {
                    cnt: 1,
                    pos: a.groups.length - 1,
                    summary: d.extend(!0, [], a.summary)
                }), d.each(a.counters[g].summary, function() {
                    d.isFunction(this.st) ? this.v = this.st.call(c, this.v, this.nm, b) : (this.v = d(c).jqGrid("groupingCalculations.handler", this.st, this.v, this.nm, this.sr, this.srt, b), "avg" === this.st.toLowerCase() && this.sd && (this.vd = d(c).jqGrid("groupingCalculations.handler", this.st,
                        this.vd, this.sd, this.sr, this.srt, b)))
                }), a.groups[a.counters[g].pos].summary = a.counters[g].summary)
            });
            return this
        },
        groupingToggle: function(b) {
            this.each(function() {
                var k = this.p.groupingView,
                    a = b.split("_"),
                    c = parseInt(a[a.length - 2], 10);
                a.splice(a.length - 2, 2);
                var g = a.join("_"),
                    a = k.minusicon,
                    m = k.plusicon,
                    e = d("#" + d.jgrid.jqID(b)),
                    e = e.length ? e[0].nextSibling : null,
                    f = d("#" + d.jgrid.jqID(b) + " span.tree-wrap-" + this.p.direction),
                    h = function(a) {
                        a = d.map(a.split(" "), function(a) {
                            if (a.substring(0, g.length + 1) === g + "_") return parseInt(a.substring(g.length +
                                1), 10)
                        });
                        return 0 < a.length ? a[0] : void 0
                    },
                    p, r = !1,
                    q = this.p.frozenColumns ? this.p.id + "_frozen" : !1,
                    n = q ? d("#" + d.jgrid.jqID(b), "#" + d.jgrid.jqID(q)) : !1,
                    n = n && n.length ? n[0].nextSibling : null;
                if (f.hasClass(a)) {
                    if (k.showSummaryOnHide) {
                        if (e)
                            for (; e && !(d(e).hasClass("jqfoot") && parseInt(d(e).attr("jqfootlevel"), 10) <= c);) d(e).hide(), e = e.nextSibling, q && (d(n).hide(), n = n.nextSibling)
                    } else if (e)
                        for (; e;) {
                            k = h(e.className);
                            if (void 0 !== k && k <= c) break;
                            d(e).hide();
                            e = e.nextSibling;
                            q && (d(n).hide(), n = n.nextSibling)
                        }
                    f.removeClass(a).addClass(m);
                    r = !0
                } else {
                    if (e)
                        for (p = void 0; e;) {
                            k = h(e.className);
                            void 0 === p && (p = void 0 === k);
                            if (void 0 !== k) {
                                if (k <= c) break;
                                k === c + 1 && (d(e).show().find(">td>span.tree-wrap-" + this.p.direction).removeClass(a).addClass(m), q && d(n).show().find(">td>span.tree-wrap-" + this.p.direction).removeClass(a).addClass(m))
                            } else p && (d(e).show(), q && d(n).show());
                            e = e.nextSibling;
                            q && (n = n.nextSibling)
                        }
                    f.removeClass(m).addClass(a)
                }
                d(this).triggerHandler("jqGridGroupingClickGroup", [b, r]);
                d.isFunction(this.p.onClickGroup) && this.p.onClickGroup.call(this,
                    b, r)
            });
            return !1
        },
        groupingRender: function(b, k, a, c) {
            return this.each(function() {
                function g(a, b, c) {
                    var d = !1;
                    if (0 === b) d = c[a];
                    else {
                        var e = c[a].idx;
                        if (0 === e) d = c[a];
                        else
                            for (; 0 <= a; a--)
                                if (c[a].idx === e - b) {
                                    d = c[a];
                                    break
                                }
                    }
                    return d
                }

                function m(a, b, c, f) {
                    var h = g(a, b, c),
                        m = e.p.colModel,
                        n, q = h.cnt;
                    a = "";
                    var p;
                    for (p = f; p < k; p++) {
                        var r = "<td " + e.formatCol(p, 1, "") + ">&#160;</td>",
                            t = "{0}";
                        d.each(h.summary, function() {
                            if (this.nm === m[p].name) {
                                m[p].summaryTpl && (t = m[p].summaryTpl);
                                "string" === typeof this.st && "avg" === this.st.toLowerCase() &&
                                (this.sd && this.vd ? this.v /= this.vd : this.v && 0 < q && (this.v /= q));
                                try {
                                    this.groupCount = h.cnt, this.groupIndex = h.dataIndex, this.groupValue = h.value, n = e.formatter("", this.v, p, this)
                                } catch (a) {
                                    n = this.v
                                }
                                r = "<td " + e.formatCol(p, 1, "") + ">" + d.jgrid.format(t, n) + "</td>";
                                return !1
                            }
                        });
                        a += r
                    }
                    return a
                }
                var e = this,
                    f = e.p.groupingView,
                    h = "",
                    p = "",
                    r, q, n = f.groupCollapse ? f.plusicon : f.minusicon,
                    t, y = [],
                    z = f.groupField.length,
                    n = n + (" tree-wrap-" + e.p.direction);
                d.each(e.p.colModel, function(a, b) {
                    var c;
                    for (c = 0; c < z; c++)
                        if (f.groupField[c] === b.name) {
                            y[c] =
                                a;
                            break
                        }
                });
                var x = 0,
                    A = d.makeArray(f.groupSummary);
                A.reverse();
                d.each(f.groups, function(g, l) {
                    if (f._locgr && !(l.startRow + l.cnt > (a - 1) * c && l.startRow < a * c)) return !0;
                    x++;
                    q = e.p.id + "ghead_" + l.idx;
                    r = q + "_" + g;
                    p = "<span style='cursor:pointer;' class='ui-icon " + n + "' onclick=\"jQuery('#" + d.jgrid.jqID(e.p.id) + "').jqGrid('groupingToggle','" + r + "');return false;\"></span>";
                    try {
                        d.isArray(f.formatDisplayField) && d.isFunction(f.formatDisplayField[l.idx]) ? (l.displayValue = f.formatDisplayField[l.idx].call(e, l.displayValue, l.value,
                            e.p.colModel[y[l.idx]], l.idx, f), t = l.displayValue) : t = e.formatter(r, l.displayValue, y[l.idx], l.value)
                    } catch (C) {
                        t = l.displayValue
                    }
                    "header" === f.groupSummaryPos[l.idx] ? (h += '<tr id="' + r + '"' + (f.groupCollapse && 0 < l.idx ? ' style="display:none;" ' : " ") + 'role="row" class= "ui-widget-content jqgroup ui-row-' + e.p.direction + " " + q + '"><td style="padding-left:' + 12 * l.idx + 'px;">' + p + d.jgrid.template(f.groupText[l.idx], t, l.cnt, l.summary) + "</td>", h += m(g, l.idx - 1, f.groups, 1), h += "</tr>") : h += '<tr id="' + r + '"' + (f.groupCollapse &&
                        0 < l.idx ? ' style="display:none;" ' : " ") + 'role="row" class= "ui-widget-content jqgroup ui-row-' + e.p.direction + " " + q + '"><td style="padding-left:' + 12 * l.idx + 'px;" colspan="' + k + '">' + p + d.jgrid.template(f.groupText[l.idx], t, l.cnt, l.summary) + "</td></tr>";
                    if (z - 1 === l.idx) {
                        var s = f.groups[g + 1],
                            v, u = 0;
                        v = l.startRow;
                        var B = void 0 !== s ? f.groups[g + 1].startRow : b.length;
                        f._locgr && (u = (a - 1) * c, u > l.startRow && (v = u));
                        for (; v < B && b[v - u]; v++) h += b[v - u].join("");
                        if ("header" !== f.groupSummaryPos[l.idx]) {
                            var w;
                            if (void 0 !== s) {
                                for (w = 0; w <
                                f.groupField.length && s.dataIndex !== f.groupField[w]; w++);
                                x = f.groupField.length - w
                            }
                            for (s = 0; s < x; s++) A[s] && (u = "", f.groupCollapse && !f.showSummaryOnHide && (u = ' style="display:none;"'), h += "<tr" + u + ' jqfootlevel="' + (l.idx - s) + '" role="row" class="ui-widget-content jqfoot ui-row-' + e.p.direction + '">', h += m(g, s, f.groups, 0), h += "</tr>");
                            x = w
                        }
                    }
                });
                d("#" + d.jgrid.jqID(e.p.id) + " tbody:first").append(h);
                h = null
            })
        },
        groupingGroupBy: function(b, k) {
            return this.each(function() {
                "string" === typeof b && (b = [b]);
                var a = this.p.groupingView;
                this.p.grouping = !0;
                void 0 === a.visibiltyOnNextGrouping && (a.visibiltyOnNextGrouping = []);
                var c;
                for (c = 0; c < a.groupField.length; c++)!a.groupColumnShow[c] && a.visibiltyOnNextGrouping[c] && d(this).jqGrid("showCol", a.groupField[c]);
                for (c = 0; c < b.length; c++) a.visibiltyOnNextGrouping[c] = d("#" + d.jgrid.jqID(this.p.id) + "_" + d.jgrid.jqID(b[c])).is(":visible");
                this.p.groupingView = d.extend(this.p.groupingView, k || {});
                a.groupField = b;
                d(this).trigger("reloadGrid")
            })
        },
        groupingRemove: function(b) {
            return this.each(function() {
                void 0 ===
                b && (b = !0);
                this.p.grouping = !1;
                if (!0 === b) {
                    var k = this.p.groupingView,
                        a;
                    for (a = 0; a < k.groupField.length; a++)!k.groupColumnShow[a] && k.visibiltyOnNextGrouping[a] && d(this).jqGrid("showCol", k.groupField);
                    d("tr.jqgroup, tr.jqfoot", "#" + d.jgrid.jqID(this.p.id) + " tbody:first").remove();
                    d("tr.jqgrow:hidden", "#" + d.jgrid.jqID(this.p.id) + " tbody:first").show()
                } else d(this).trigger("reloadGrid")
            })
        },
        groupingCalculations: {
            handler: function(b, d, a, c, g, m) {
                var e = {
                    sum: function() {
                        return parseFloat(d || 0) + parseFloat(m[a] || 0)
                    },
                    min: function() {
                        return "" === d ? parseFloat(m[a] || 0) : Math.min(parseFloat(d), parseFloat(m[a] || 0))
                    },
                    max: function() {
                        return "" === d ? parseFloat(m[a] || 0) : Math.max(parseFloat(d), parseFloat(m[a] || 0))
                    },
                    count: function() {
                        "" === d && (d = 0);
                        return m.hasOwnProperty(a) ? d + 1 : 0
                    },
                    avg: function() {
                        return e.sum()
                    }
                };
                if (!e[b]) throw "jqGrid Grouping No such method: " + b;
                b = e[b]();
                null != c && ("fixed" === g ? b = b.toFixed(c) : (c = Math.pow(10, c), b = Math.round(b * c) / c));
                return b
            }
        }
    })
})(jQuery);
(function(d) {
    d.jgrid.extend({
        setTreeNode: function(b, c) {
            return this.each(function() {
                var a = this;
                if (a.grid && a.p.treeGrid)
                    for (var h = a.p.expColInd, e = a.p.treeReader.expanded_field, k = a.p.treeReader.leaf_field, g = a.p.treeReader.level_field, f = a.p.treeReader.icon_field, n = a.p.treeReader.loaded, m, p, q, l; b < c;) l = d.jgrid.stripPref(a.p.idPrefix, a.rows[b].id), l = a.p.data[a.p._index[l]], "nested" !== a.p.treeGridModel || l[k] || (m = parseInt(l[a.p.treeReader.left_field], 10), p = parseInt(l[a.p.treeReader.right_field], 10), l[k] = p ===
                    m + 1 ? "true" : "false", a.rows[b].cells[a.p._treeleafpos].innerHTML = l[k]), m = parseInt(l[g], 10), 0 === a.p.tree_root_level ? (q = m + 1, p = m) : (q = m, p = m - 1), q = "<div class='tree-wrap tree-wrap-" + a.p.direction + "' style='width:" + 18 * q + "px;'>", q += "<div style='" + ("rtl" === a.p.direction ? "right:" : "left:") + 18 * p + "px;' class='ui-icon ", void 0 !== l[n] && (l[n] = "true" === l[n] || !0 === l[n] ? !0 : !1), "true" === l[k] || !0 === l[k] ? (q += (void 0 !== l[f] && "" !== l[f] ? l[f] : a.p.treeIcons.leaf) + " tree-leaf treeclick", l[k] = !0, p = "leaf") : (l[k] = !1, p = ""), l[e] = ("true" ===
                        l[e] || !0 === l[e] ? !0 : !1) && (l[n] || void 0 === l[n]), q = !1 === l[e] ? q + (!0 === l[k] ? "'" : a.p.treeIcons.plus + " tree-plus treeclick'") : q + (!0 === l[k] ? "'" : a.p.treeIcons.minus + " tree-minus treeclick'"), q += "></div></div>", d(a.rows[b].cells[h]).wrapInner("<span class='cell-wrapper" + p + "'></span>").prepend(q), m !== parseInt(a.p.tree_root_level, 10) && ((l = (l = d(a).jqGrid("getNodeParent", l)) && l.hasOwnProperty(e) ? l[e] : !0) || d(a.rows[b]).css("display", "none")), d(a.rows[b].cells[h]).find("div.treeclick").bind("click", function(b) {
                        b =
                            d.jgrid.stripPref(a.p.idPrefix, d(b.target || b.srcElement, a.rows).closest("tr.jqgrow")[0].id);
                        b = a.p._index[b];
                        a.p.data[b][k] || (a.p.data[b][e] ? (d(a).jqGrid("collapseRow", a.p.data[b]), d(a).jqGrid("collapseNode", a.p.data[b])) : (d(a).jqGrid("expandRow", a.p.data[b]), d(a).jqGrid("expandNode", a.p.data[b])));
                        return !1
                    }), !0 === a.p.ExpandColClick && d(a.rows[b].cells[h]).find("span.cell-wrapper").css("cursor", "pointer").bind("click", function(b) {
                        b = d.jgrid.stripPref(a.p.idPrefix, d(b.target || b.srcElement, a.rows).closest("tr.jqgrow")[0].id);
                        var c = a.p._index[b];
                        a.p.data[c][k] || (a.p.data[c][e] ? (d(a).jqGrid("collapseRow", a.p.data[c]), d(a).jqGrid("collapseNode", a.p.data[c])) : (d(a).jqGrid("expandRow", a.p.data[c]), d(a).jqGrid("expandNode", a.p.data[c])));
                        d(a).jqGrid("setSelection", b);
                        return !1
                    }), b++
            })
        },
        setTreeGrid: function() {
            return this.each(function() {
                var b = this,
                    c = 0,
                    a, h = !1,
                    e, k, g = [];
                if (b.p.treeGrid) {
                    b.p.treedatatype || d.extend(b.p, {
                        treedatatype: b.p.datatype
                    });
                    b.p.subGrid = !1;
                    b.p.altRows = !1;
                    b.p.pgbuttons = !1;
                    b.p.pginput = !1;
                    b.p.gridview = !0;
                    null ===
                    b.p.rowTotal && (b.p.rowNum = 1E4);
                    b.p.multiselect = !1;
                    b.p.rowList = [];
                    b.p.expColInd = 0;
                    a = "ui-icon-triangle-1-" + ("rtl" === b.p.direction ? "w" : "e");
                    b.p.treeIcons = d.extend({
                        plus: a,
                        minus: "ui-icon-triangle-1-s",
                        leaf: "ui-icon-radio-off"
                    }, b.p.treeIcons || {});
                    "nested" === b.p.treeGridModel ? b.p.treeReader = d.extend({
                        level_field: "level",
                        left_field: "lft",
                        right_field: "rgt",
                        leaf_field: "isLeaf",
                        expanded_field: "expanded",
                        loaded: "loaded",
                        icon_field: "icon"
                    }, b.p.treeReader) : "adjacency" === b.p.treeGridModel && (b.p.treeReader = d.extend({
                            level_field: "level",
                            parent_id_field: "parent",
                            leaf_field: "isLeaf",
                            expanded_field: "expanded",
                            loaded: "loaded",
                            icon_field: "icon"
                        }, b.p.treeReader));
                    for (e in b.p.colModel)
                        if (b.p.colModel.hasOwnProperty(e))
                            for (k in a = b.p.colModel[e].name, a !== b.p.ExpandColumn || h || (h = !0, b.p.expColInd = c), c++, b.p.treeReader) b.p.treeReader.hasOwnProperty(k) && b.p.treeReader[k] === a && g.push(a);
                    d.each(b.p.treeReader, function(a, e) {
                        e && -1 === d.inArray(e, g) && ("leaf_field" === a && (b.p._treeleafpos = c), c++, b.p.colNames.push(e), b.p.colModel.push({
                            name: e,
                            width: 1,
                            hidden: !0,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            editable: !0,
                            search: !1
                        }))
                    })
                }
            })
        },
        expandRow: function(b) {
            this.each(function() {
                var c = this;
                if (c.grid && c.p.treeGrid) {
                    var a = d(c).jqGrid("getNodeChildren", b),
                        h = c.p.treeReader.expanded_field;
                    d(a).each(function() {
                        var a = c.p.idPrefix + d.jgrid.getAccessor(this, c.p.localReader.id);
                        d(d(c).jqGrid("getGridRowById", a)).css("display", "");
                        this[h] && d(c).jqGrid("expandRow", this)
                    })
                }
            })
        },
        collapseRow: function(b) {
            this.each(function() {
                var c = this;
                if (c.grid && c.p.treeGrid) {
                    var a = d(c).jqGrid("getNodeChildren",
                        b),
                        h = c.p.treeReader.expanded_field;
                    d(a).each(function() {
                        var a = c.p.idPrefix + d.jgrid.getAccessor(this, c.p.localReader.id);
                        d(d(c).jqGrid("getGridRowById", a)).css("display", "none");
                        this[h] && d(c).jqGrid("collapseRow", this)
                    })
                }
            })
        },
        getRootNodes: function() {
            var b = [];
            this.each(function() {
                var c = this;
                if (c.grid && c.p.treeGrid) switch (c.p.treeGridModel) {
                    case "nested":
                        var a = c.p.treeReader.level_field;
                        d(c.p.data).each(function() {
                            parseInt(this[a], 10) === parseInt(c.p.tree_root_level, 10) && b.push(this)
                        });
                        break;
                    case "adjacency":
                        var h =
                            c.p.treeReader.parent_id_field;
                        d(c.p.data).each(function() {
                            null !== this[h] && "null" !== String(this[h]).toLowerCase() || b.push(this)
                        })
                }
            });
            return b
        },
        getNodeDepth: function(b) {
            var c = null;
            this.each(function() {
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                    case "nested":
                        c = parseInt(b[this.p.treeReader.level_field], 10) - parseInt(this.p.tree_root_level, 10);
                        break;
                    case "adjacency":
                        c = d(this).jqGrid("getNodeAncestors", b).length
                }
            });
            return c
        },
        getNodeParent: function(b) {
            var c = null;
            this.each(function() {
                var a =
                    this;
                if (a.grid && a.p.treeGrid) switch (a.p.treeGridModel) {
                    case "nested":
                        var h = a.p.treeReader.left_field,
                            e = a.p.treeReader.right_field,
                            k = a.p.treeReader.level_field,
                            g = parseInt(b[h], 10),
                            f = parseInt(b[e], 10),
                            n = parseInt(b[k], 10);
                        d(this.p.data).each(function() {
                            if (parseInt(this[k], 10) === n - 1 && parseInt(this[h], 10) < g && parseInt(this[e], 10) > f) return c = this, !1
                        });
                        break;
                    case "adjacency":
                        var m = a.p.treeReader.parent_id_field,
                            p = a.p.localReader.id;
                        d(this.p.data).each(function() {
                            if (this[p] === d.jgrid.stripPref(a.p.idPrefix,
                                    b[m])) return c = this, !1
                        })
                }
            });
            return c
        },
        getNodeChildren: function(b) {
            var c = [];
            this.each(function() {
                var a = this;
                if (a.grid && a.p.treeGrid) switch (a.p.treeGridModel) {
                    case "nested":
                        var h = a.p.treeReader.left_field,
                            e = a.p.treeReader.right_field,
                            k = a.p.treeReader.level_field,
                            g = parseInt(b[h], 10),
                            f = parseInt(b[e], 10),
                            n = parseInt(b[k], 10);
                        d(this.p.data).each(function() {
                            parseInt(this[k], 10) === n + 1 && parseInt(this[h], 10) > g && parseInt(this[e], 10) < f && c.push(this)
                        });
                        break;
                    case "adjacency":
                        var m = a.p.treeReader.parent_id_field,
                            p = a.p.localReader.id;
                        d(this.p.data).each(function() {
                            this[m] == d.jgrid.stripPref(a.p.idPrefix, b[p]) && c.push(this)
                        })
                }
            });
            return c
        },
        getFullTreeNode: function(b) {
            var c = [];
            this.each(function() {
                var a = this,
                    h;
                if (a.grid && a.p.treeGrid) switch (a.p.treeGridModel) {
                    case "nested":
                        var e = a.p.treeReader.left_field,
                            k = a.p.treeReader.right_field,
                            g = a.p.treeReader.level_field,
                            f = parseInt(b[e], 10),
                            n = parseInt(b[k], 10),
                            m = parseInt(b[g], 10);
                        d(this.p.data).each(function() {
                            parseInt(this[g], 10) >= m && parseInt(this[e], 10) >= f && parseInt(this[e],
                                10) <= n && c.push(this)
                        });
                        break;
                    case "adjacency":
                        if (b) {
                            c.push(b);
                            var p = a.p.treeReader.parent_id_field,
                                q = a.p.localReader.id;
                            d(this.p.data).each(function(b) {
                                h = c.length;
                                for (b = 0; b < h; b++)
                                    if (d.jgrid.stripPref(a.p.idPrefix, c[b][q]) === this[p]) {
                                        c.push(this);
                                        break
                                    }
                            })
                        }
                }
            });
            return c
        },
        getNodeAncestors: function(b) {
            var c = [];
            this.each(function() {
                if (this.grid && this.p.treeGrid)
                    for (var a = d(this).jqGrid("getNodeParent", b); a;) c.push(a), a = d(this).jqGrid("getNodeParent", a)
            });
            return c
        },
        isVisibleNode: function(b) {
            var c = !0;
            this.each(function() {
                if (this.grid &&
                    this.p.treeGrid) {
                    var a = d(this).jqGrid("getNodeAncestors", b),
                        h = this.p.treeReader.expanded_field;
                    d(a).each(function() {
                        c = c && this[h];
                        if (!c) return !1
                    })
                }
            });
            return c
        },
        isNodeLoaded: function(b) {
            var c;
            this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var a = this.p.treeReader.leaf_field,
                        h = this.p.treeReader.loaded;
                    c = void 0 !== b ? void 0 !== b[h] ? b[h] : b[a] || 0 < d(this).jqGrid("getNodeChildren", b).length ? !0 : !1 : !1
                }
            });
            return c
        },
        expandNode: function(b) {
            return this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var c = this.p.treeReader.expanded_field,
                        a = this.p.treeReader.parent_id_field,
                        h = this.p.treeReader.loaded,
                        e = this.p.treeReader.level_field,
                        k = this.p.treeReader.left_field,
                        g = this.p.treeReader.right_field;
                    if (!b[c]) {
                        var f = d.jgrid.getAccessor(b, this.p.localReader.id),
                            n = d("#" + this.p.idPrefix + d.jgrid.jqID(f), this.grid.bDiv)[0],
                            m = this.p._index[f];
                        d(this).jqGrid("isNodeLoaded", this.p.data[m]) ? (b[c] = !0, d("div.treeclick", n).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus")) : this.grid.hDiv.loading || (b[c] = !0,
                                d("div.treeclick", n).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus"), this.p.treeANode = n.rowIndex, this.p.datatype = this.p.treedatatype, "nested" === this.p.treeGridModel ? d(this).jqGrid("setGridParam", {
                                postData: {
                                    nodeid: f,
                                    n_left: b[k],
                                    n_right: b[g],
                                    n_level: b[e]
                                }
                            }) : d(this).jqGrid("setGridParam", {
                                postData: {
                                    nodeid: f,
                                    parentid: b[a],
                                    n_level: b[e]
                                }
                            }), d(this).trigger("reloadGrid"), b[h] = !0, "nested" === this.p.treeGridModel ? d(this).jqGrid("setGridParam", {
                                postData: {
                                    nodeid: "",
                                    n_left: "",
                                    n_right: "",
                                    n_level: ""
                                }
                            }) : d(this).jqGrid("setGridParam", {
                                postData: {
                                    nodeid: "",
                                    parentid: "",
                                    n_level: ""
                                }
                            }))
                    }
                }
            })
        },
        collapseNode: function(b) {
            return this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var c = this.p.treeReader.expanded_field;
                    b[c] && (b[c] = !1, c = d.jgrid.getAccessor(b, this.p.localReader.id), c = d("#" + this.p.idPrefix + d.jgrid.jqID(c), this.grid.bDiv)[0], d("div.treeclick", c).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus"))
                }
            })
        },
        SortTree: function(b,
                           c, a, h) {
            return this.each(function() {
                if (this.grid && this.p.treeGrid) {
                    var e, k, g, f = [],
                        n = this,
                        m;
                    e = d(this).jqGrid("getRootNodes");
                    e = d.jgrid.from(e);
                    e.orderBy(b, c, a, h);
                    m = e.select();
                    e = 0;
                    for (k = m.length; e < k; e++) g = m[e], f.push(g), d(this).jqGrid("collectChildrenSortTree", f, g, b, c, a, h);
                    d.each(f, function(a) {
                        var b = d.jgrid.getAccessor(this, n.p.localReader.id);
                        d("#" + d.jgrid.jqID(n.p.id) + " tbody tr:eq(" + a + ")").after(d("tr#" + d.jgrid.jqID(b), n.grid.bDiv))
                    });
                    f = m = e = null
                }
            })
        },
        collectChildrenSortTree: function(b, c, a, h, e, k) {
            return this.each(function() {
                if (this.grid &&
                    this.p.treeGrid) {
                    var g, f, n, m;
                    g = d(this).jqGrid("getNodeChildren", c);
                    g = d.jgrid.from(g);
                    g.orderBy(a, h, e, k);
                    m = g.select();
                    g = 0;
                    for (f = m.length; g < f; g++) n = m[g], b.push(n), d(this).jqGrid("collectChildrenSortTree", b, n, a, h, e, k)
                }
            })
        },
        setTreeRow: function(b, c) {
            var a = !1;
            this.each(function() {
                this.grid && this.p.treeGrid && (a = d(this).jqGrid("setRowData", b, c))
            });
            return a
        },
        delTreeNode: function(b) {
            return this.each(function() {
                var c = this.p.localReader.id,
                    a, h = this.p.treeReader.left_field,
                    e = this.p.treeReader.right_field,
                    k, g, f;
                if (this.grid && this.p.treeGrid && (a = this.p._index[b], void 0 !== a)) {
                    k = parseInt(this.p.data[a][e], 10);
                    g = k - parseInt(this.p.data[a][h], 10) + 1;
                    var n = d(this).jqGrid("getFullTreeNode", this.p.data[a]);
                    if (0 < n.length)
                        for (a = 0; a < n.length; a++) d(this).jqGrid("delRowData", n[a][c]);
                    if ("nested" === this.p.treeGridModel) {
                        c = d.jgrid.from(this.p.data).greater(h, k, {
                            stype: "integer"
                        }).select();
                        if (c.length)
                            for (f in c) c.hasOwnProperty(f) && (c[f][h] = parseInt(c[f][h], 10) - g);
                        c = d.jgrid.from(this.p.data).greater(e, k, {
                            stype: "integer"
                        }).select();
                        if (c.length)
                            for (f in c) c.hasOwnProperty(f) && (c[f][e] = parseInt(c[f][e], 10) - g)
                    }
                }
            })
        },
        addChildNode: function(b, c, a, h) {
            var e = this[0];
            if (a) {
                var k = e.p.treeReader.expanded_field,
                    g = e.p.treeReader.leaf_field,
                    f = e.p.treeReader.level_field,
                    n = e.p.treeReader.parent_id_field,
                    m = e.p.treeReader.left_field,
                    p = e.p.treeReader.right_field,
                    q = e.p.treeReader.loaded,
                    l, u, t, w, s;
                l = 0;
                var v = c,
                    x;
                void 0 === h && (h = !1);
                if (void 0 === b || null === b) {
                    s = e.p.data.length - 1;
                    if (0 <= s)
                        for (; 0 <= s;) l = Math.max(l, parseInt(e.p.data[s][e.p.localReader.id],
                            10)), s--;
                    b = l + 1
                }
                var y = d(e).jqGrid("getInd", c);
                x = !1;
                void 0 === c || null === c || "" === c ? (v = c = null, l = "last", w = e.p.tree_root_level, s = e.p.data.length + 1) : (l = "after", u = e.p._index[c], t = e.p.data[u], c = t[e.p.localReader.id], w = parseInt(t[f], 10) + 1, s = d(e).jqGrid("getFullTreeNode", t), s.length ? (v = s = s[s.length - 1][e.p.localReader.id], s = d(e).jqGrid("getInd", v) + 1) : s = d(e).jqGrid("getInd", c) + 1, t[g] && (x = !0, t[k] = !0, d(e.rows[y]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(e.p.treeIcons.leaf +
                    " tree-leaf").addClass(e.p.treeIcons.minus + " tree-minus"), e.p.data[u][g] = !1, t[q] = !0));
                u = s + 1;
                void 0 === a[k] && (a[k] = !1);
                void 0 === a[q] && (a[q] = !1);
                a[f] = w;
                void 0 === a[g] && (a[g] = !0);
                "adjacency" === e.p.treeGridModel && (a[n] = c);
                if ("nested" === e.p.treeGridModel) {
                    var r;
                    if (null !== c) {
                        g = parseInt(t[p], 10);
                        f = d.jgrid.from(e.p.data);
                        f = f.greaterOrEquals(p, g, {
                            stype: "integer"
                        });
                        f = f.select();
                        if (f.length)
                            for (r in f) f.hasOwnProperty(r) && (f[r][m] = f[r][m] > g ? parseInt(f[r][m], 10) + 2 : f[r][m], f[r][p] = f[r][p] >= g ? parseInt(f[r][p], 10) +
                                2 : f[r][p]);
                        a[m] = g;
                        a[p] = g + 1
                    } else {
                        g = parseInt(d(e).jqGrid("getCol", p, !1, "max"), 10);
                        f = d.jgrid.from(e.p.data).greater(m, g, {
                            stype: "integer"
                        }).select();
                        if (f.length)
                            for (r in f) f.hasOwnProperty(r) && (f[r][m] = parseInt(f[r][m], 10) + 2);
                        f = d.jgrid.from(e.p.data).greater(p, g, {
                            stype: "integer"
                        }).select();
                        if (f.length)
                            for (r in f) f.hasOwnProperty(r) && (f[r][p] = parseInt(f[r][p], 10) + 2);
                        a[m] = g + 1;
                        a[p] = g + 2
                    }
                }
                if (null === c || d(e).jqGrid("isNodeLoaded", t) || x) d(e).jqGrid("addRowData", b, a, l, v), d(e).jqGrid("setTreeNode", s, u);
                t && !t[k] &&
                h && d(e.rows[y]).find("div.treeclick").click()
            }
        }
    })
})(jQuery);
(function(d) {
    function I(d, n) {
        var h, e, v = [],
            r;
        if (!this || "function" !== typeof d || d instanceof RegExp) throw new TypeError;
        r = this.length;
        for (h = 0; h < r; h++)
            if (this.hasOwnProperty(h) && (e = this[h], d.call(n, e, h, this))) {
                v.push(e);
                break
            }
        return v
    }
    d.assocArraySize = function(d) {
        var n = 0,
            h;
        for (h in d) d.hasOwnProperty(h) && n++;
        return n
    };
    d.jgrid.extend({
        pivotSetup: function(q, n) {
            var h = [],
                e = [],
                v = [],
                r = [],
                b = {
                    grouping: !0,
                    groupingView: {
                        groupField: [],
                        groupSummary: [],
                        groupSummaryPos: []
                    }
                },
                f = [],
                c = d.extend({
                    rowTotals: !1,
                    rowTotalsText: "Total",
                    colTotals: !1,
                    groupSummary: !0,
                    groupSummaryPos: "header",
                    frozenStaticCols: !1
                }, n || {});
            this.each(function() {
                function n(C, c, a) {
                    C = I.call(C, c, a);
                    return 0 < C.length ? C[0] : null
                }

                function J(c, a) {
                    var d = 0,
                        f = !0,
                        h;
                    for (h in c) {
                        if (c[h] != this[d]) {
                            f = !1;
                            break
                        }
                        d++;
                        if (d >= this.length) break
                    }
                    f && (D = a);
                    return f
                }

                function E(c, a, f, h) {
                    var g = a.length,
                        b, k, e, l;
                    l = d.isArray(f) ? f.length : 1;
                    r = [];
                    for (e = r.root = 0; e < l; e++) {
                        var n = [],
                            m;
                        for (b = 0; b < g; b++) {
                            if (null == f) m = k = d.trim(a[b].member) + "_" + a[b].aggregator;
                            else {
                                m = f[e].replace(/\s+/g, "");
                                try {
                                    k =
                                        1 === g ? m : m + "_" + a[b].aggregator + "_" + b
                                } catch (v) {}
                            }
                            var t = h,
                                u = k,
                                x = n,
                                y = k,
                                w = h[k],
                                p = a[b].member,
                                q = c,
                                s = void 0;
                            switch (a[b].aggregator) {
                                case "sum":
                                    s = parseFloat(w || 0) + parseFloat(q[p] || 0);
                                    break;
                                case "count":
                                    if ("" === w || null == w) w = 0;
                                    s = q.hasOwnProperty(p) ? w + 1 : 0;
                                    break;
                                case "min":
                                    s = "" === w || null == w ? parseFloat(q[p] || 0) : Math.min(parseFloat(w), parseFloat(q[p] || 0));
                                    break;
                                case "max":
                                    s = "" === w || null == w ? parseFloat(q[p] || 0) : Math.max(parseFloat(w), parseFloat(q[p] || 0))
                            }
                            t[u] = x[y] = s
                        }
                        r[m] = n
                    }
                    return h
                }

                function H(a) {
                    var d, b, g, k, e;
                    for (g in a)
                        if (a.hasOwnProperty(g)) {
                            if ("object" !==
                                typeof a[g] && ("level" === g && (void 0 === F[a.level] && (F[a.level] = "", 0 < a.level && "_r_Totals" !== a.text && (f[a.level - 1] = {
                                    useColSpanStyle: !1,
                                    groupHeaders: []
                                })), F[a.level] !== a.text && a.children.length && "_r_Totals" !== a.text && 0 < a.level && (f[a.level - 1].groupHeaders.push({
                                    titleText: a.text
                                }), b = f[a.level - 1].groupHeaders.length, e = 1 === b ? K : G + (b - 1) * z, f[a.level - 1].groupHeaders[b - 1].startColumnName = h[e].name, f[a.level - 1].groupHeaders[b - 1].numberOfColumns = h.length - e, G = h.length), F[a.level] = a.text), a.level === l && "level" === g &&
                                0 < l))
                                if (1 < z) {
                                    b = 1;
                                    for (d in a.fields) 1 === b && f[l - 1].groupHeaders.push({
                                        startColumnName: d,
                                        numberOfColumns: 1,
                                        titleText: a.text
                                    }), b++;
                                    f[l - 1].groupHeaders[f[l - 1].groupHeaders.length - 1].numberOfColumns = b - 1
                                } else f.splice(l - 1, 1);
                            null != a[g] && "object" === typeof a[g] && H(a[g]);
                            if ("level" === g && 0 < a.level)
                                for (d in b = 0, a.fields) {
                                    e = {};
                                    for (k in c.aggregates[b])
                                        if (c.aggregates[b].hasOwnProperty(k)) switch (k) {
                                            case "member":
                                            case "label":
                                            case "aggregator":
                                                break;
                                            default:
                                                e[k] = c.aggregates[b][k]
                                        }
                                    1 < z ? (e.name = d, e.label = c.aggregates[b].label ||
                                        d) : (e.name = a.text, e.label = "_r_Totals" === a.text ? c.rowTotalsText : a.text);
                                    h.push(e);
                                    b++
                                }
                        }
                }
                var m, D, a, y = q.length,
                    s, l, z, k, p = 0;
                c.rowTotals && 0 < c.yDimension.length && (c.yDimension.splice(0, 0, {
                    dataName: c.yDimension[0].dataName
                }), c.yDimension[0].converter = function() {
                    return "_r_Totals"
                });
                s = d.isArray(c.xDimension) ? c.xDimension.length : 0;
                l = c.yDimension.length;
                z = d.isArray(c.aggregates) ? c.aggregates.length : 0;
                if (0 === s || 0 === z) throw "xDimension or aggregates optiona are not set!";
                var x;
                for (a = 0; a < s; a++) x = {
                    name: c.xDimension[a].dataName,
                    frozen: c.frozenStaticCols
                }, x = d.extend(!0, x, c.xDimension[a]), h.push(x);
                x = s - 1;
                for (var A = {}; p < y;) {
                    m = q[p];
                    var t = [],
                        u = [];
                    k = {};
                    a = 0;
                    do t[a] = d.trim(m[c.xDimension[a].dataName]), k[c.xDimension[a].dataName] = t[a], a++; while (a < s);
                    var g = 0;
                    D = -1;
                    a = n(e, J, t);
                    if (!a) {
                        g = 0;
                        if (1 <= l) {
                            for (g = 0; g < l; g++) u[g] = d.trim(m[c.yDimension[g].dataName]), c.yDimension[g].converter && d.isFunction(c.yDimension[g].converter) && (u[g] = c.yDimension[g].converter.call(this, u[g], t, u));
                            k = E(m, c.aggregates, u, k)
                        } else 0 === l && (k = E(m, c.aggregates, null, k));
                        e.push(k)
                    } else if (0 <= D) {
                        g = 0;
                        if (1 <= l) {
                            for (g = 0; g < l; g++) u[g] = d.trim(m[c.yDimension[g].dataName]), c.yDimension[g].converter && d.isFunction(c.yDimension[g].converter) && (u[g] = c.yDimension[g].converter.call(this, u[g], t, u));
                            a = E(m, c.aggregates, u, a)
                        } else 0 === l && (a = E(m, c.aggregates, null, a));
                        e[D] = a
                    }
                    m = 0;
                    var t = k = null,
                        B;
                    for (B in r) {
                        if (0 === m) A.children && void 0 !== A.children || (A = {
                            text: B,
                            level: 0,
                            children: []
                        }), k = A.children;
                        else {
                            t = null;
                            for (a = 0; a < k.length; a++)
                                if (k[a].text === B) {
                                    t = k[a];
                                    break
                                }
                            t ? k = t.children : (k.push({
                                children: [],
                                text: B,
                                level: m,
                                fields: r[B]
                            }), k = k[k.length - 1].children)
                        }
                        m++
                    }
                    p++
                }
                var F = [],
                    G = h.length,
                    K = G;
                0 < l && (f[l - 1] = {
                    useColSpanStyle: !1,
                    groupHeaders: []
                });
                H(A, 0);
                if (c.colTotals)
                    for (p = e.length; p--;)
                        for (a = s; a < h.length; a++) y = h[a].name, v[y] = v[y] ? v[y] + parseFloat(e[p][y] || 0) : parseFloat(e[p][y] || 0);
                if (0 < x)
                    for (a = 0; a < x; a++) b.groupingView.groupField[a] = h[a].name, b.groupingView.groupSummary[a] = c.groupSummary, b.groupingView.groupSummaryPos[a] = c.groupSummaryPos;
                else b.grouping = !1;
                b.sortname = h[x].name;
                b.groupingView.hideFirstGroupCol = !0
            });
            return {
                colModel: h,
                rows: e,
                groupOptions: b,
                groupHeaders: f,
                summary: v
            }
        },
        jqPivot: function(q, n, h, e) {
            return this.each(function() {
                function v(b) {
                    var f = jQuery(r).jqGrid("pivotSetup", b, n),
                        c = 0 < d.assocArraySize(f.summary) ? !0 : !1,
                        e = d.jgrid.from(f.rows);
                    for (b = 0; b < f.groupOptions.groupingView.groupField.length; b++) e.orderBy(f.groupOptions.groupingView.groupField[b], "a", "text", "");
                    jQuery(r).jqGrid(d.extend({
                        datastr: d.extend(e.select(), c ? {
                            userdata: f.summary
                        } : {}),
                        datatype: "jsonstring",
                        footerrow: c,
                        userDataOnFooter: c,
                        colModel: f.colModel,
                        viewrecords: !0,
                        sortname: n.xDimension[0].dataName
                    }, h || {}, f.groupOptions));
                    f = f.groupHeaders;
                    if (f.length)
                        for (b = 0; b < f.length; b++) f[b] && f[b].groupHeaders.length && jQuery(r).jqGrid("setGroupHeaders", f[b]);
                    n.frozenStaticCols && jQuery(r).jqGrid("setFrozenColumns")
                }
                var r = this;
                "string" === typeof q ? d.ajax(d.extend({
                    url: q,
                    dataType: "json",
                    success: function(b) {
                        v(d.jgrid.getAccessor(b, e && e.reader ? e.reader : "rows"))
                    }
                }, e || {})) : v(q)
            })
        }
    })
})(jQuery);
(function(c) {
    c.jgrid.extend({
        jqGridImport: function(a) {
            a = c.extend({
                imptype: "xml",
                impstring: "",
                impurl: "",
                mtype: "GET",
                impData: {},
                xmlGrid: {
                    config: "roots>grid",
                    data: "roots>rows"
                },
                jsonGrid: {
                    config: "grid",
                    data: "data"
                },
                ajaxOptions: {}
            }, a || {});
            return this.each(function() {
                var d = this,
                    f = function(a, b) {
                        var e = c(b.xmlGrid.config, a)[0],
                            h = c(b.xmlGrid.data, a)[0],
                            f, g;
                        if (xmlJsonClass.xml2json && c.jgrid.parse) {
                            e = xmlJsonClass.xml2json(e, " ");
                            e = c.jgrid.parse(e);
                            for (g in e) e.hasOwnProperty(g) && (f = e[g]);
                            h ? (h = e.grid.datatype,
                                e.grid.datatype = "xmlstring", e.grid.datastr = a, c(d).jqGrid(f).jqGrid("setGridParam", {
                                datatype: h
                            })) : c(d).jqGrid(f)
                        } else alert("xml2json or parse are not present")
                    },
                    b = function(a, b) {
                        if (a && "string" === typeof a) {
                            var e = !1;
                            c.jgrid.useJSON && (c.jgrid.useJSON = !1, e = !0);
                            var f = c.jgrid.parse(a);
                            e && (c.jgrid.useJSON = !0);
                            e = f[b.jsonGrid.config];
                            if (f = f[b.jsonGrid.data]) {
                                var g = e.datatype;
                                e.datatype = "jsonstring";
                                e.datastr = f;
                                c(d).jqGrid(e).jqGrid("setGridParam", {
                                    datatype: g
                                })
                            } else c(d).jqGrid(e)
                        }
                    };
                switch (a.imptype) {
                    case "xml":
                        c.ajax(c.extend({
                            url: a.impurl,
                            type: a.mtype,
                            data: a.impData,
                            dataType: "xml",
                            complete: function(b, g) {
                                "success" === g && (f(b.responseXML, a), c(d).triggerHandler("jqGridImportComplete", [b, a]), c.isFunction(a.importComplete) && a.importComplete(b))
                            }
                        }, a.ajaxOptions));
                        break;
                    case "xmlstring":
                        if (a.impstring && "string" === typeof a.impstring) {
                            var g = c.parseXML(a.impstring);
                            g && (f(g, a), c(d).triggerHandler("jqGridImportComplete", [g, a]), c.isFunction(a.importComplete) && a.importComplete(g), a.impstring = null);
                            g = null
                        }
                        break;
                    case "json":
                        c.ajax(c.extend({
                            url: a.impurl,
                            type: a.mtype,
                            data: a.impData,
                            dataType: "json",
                            complete: function(f) {
                                try {
                                    b(f.responseText, a), c(d).triggerHandler("jqGridImportComplete", [f, a]), c.isFunction(a.importComplete) && a.importComplete(f)
                                } catch (g) {}
                            }
                        }, a.ajaxOptions));
                        break;
                    case "jsonstring":
                        a.impstring && "string" === typeof a.impstring && (b(a.impstring, a), c(d).triggerHandler("jqGridImportComplete", [a.impstring, a]), c.isFunction(a.importComplete) && a.importComplete(a.impstring), a.impstring = null)
                }
            })
        },
        jqGridExport: function(a) {
            a = c.extend({
                exptype: "xmlstring",
                root: "grid",
                ident: "\t"
            }, a || {});
            var d = null;
            this.each(function() {
                if (this.grid) {
                    var f, b = c.extend(!0, {}, c(this).jqGrid("getGridParam"));
                    b.rownumbers && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                    b.multiselect && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                    b.subGrid && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                    b.knv = null;
                    if (b.treeGrid)
                        for (f in b.treeReader) b.treeReader.hasOwnProperty(f) && (b.colNames.splice(b.colNames.length - 1), b.colModel.splice(b.colModel.length - 1));
                    switch (a.exptype) {
                        case "xmlstring":
                            d =
                                "<" + a.root + ">" + xmlJsonClass.json2xml(b, a.ident) + "</" + a.root + ">";
                            break;
                        case "jsonstring":
                            d = "{" + xmlJsonClass.toJson(b, a.root, a.ident, !1) + "}", void 0 !== b.postData.filters && (d = d.replace(/filters":"/, 'filters":'), d = d.replace(/}]}"/, "}]}"))
                    }
                }
            });
            return d
        },
        excelExport: function(a) {
            a = c.extend({
                exptype: "remote",
                url: null,
                oper: "oper",
                tag: "excel",
                exportOptions: {}
            }, a || {});
            return this.each(function() {
                if (this.grid) {
                    var d;
                    "remote" === a.exptype && (d = c.extend({}, this.p.postData), d[a.oper] = a.tag, d = jQuery.param(d), d = -1 !==
                    a.url.indexOf("?") ? a.url + "&" + d : a.url + "?" + d, window.location = d)
                }
            })
        }
    })
})(jQuery);
var xmlJsonClass = {
    xml2json: function(a, b) {
        9 === a.nodeType && (a = a.documentElement);
        var g = this.removeWhite(a),
            g = this.toObj(g),
            g = this.toJson(g, a.nodeName, "\t");
        return "{\n" + b + (b ? g.replace(/\t/g, b) : g.replace(/\t|\n/g, "")) + "\n}"
    },
    json2xml: function(a, b) {
        var g = function(a, b, e) {
                var d = "",
                    f, k;
                if (a instanceof Array)
                    if (0 === a.length) d += e + "<" + b + ">__EMPTY_ARRAY_</" + b + ">\n";
                    else
                        for (f = 0, k = a.length; f < k; f += 1) var n = e + g(a[f], b, e + "\t") + "\n",
                            d = d + n;
                else if ("object" === typeof a) {
                    f = !1;
                    d += e + "<" + b;
                    for (k in a) a.hasOwnProperty(k) &&
                    ("@" === k.charAt(0) ? d += " " + k.substr(1) + '="' + a[k].toString() + '"' : f = !0);
                    d += f ? ">" : "/>";
                    if (f) {
                        for (k in a) a.hasOwnProperty(k) && ("#text" === k ? d += a[k] : "#cdata" === k ? d += "<![CDATA[" + a[k] + "]]\x3e" : "@" !== k.charAt(0) && (d += g(a[k], k, e + "\t")));
                        d += ("\n" === d.charAt(d.length - 1) ? e : "") + "</" + b + ">"
                    }
                } else "function" === typeof a ? d += e + "<" + b + "><![CDATA[" + a + "]]\x3e</" + b + ">" : (void 0 === a && (a = ""), d = '""' === a.toString() || 0 === a.toString().length ? d + (e + "<" + b + ">__EMPTY_STRING_</" + b + ">") : d + (e + "<" + b + ">" + a.toString() + "</" + b + ">"));
                return d
            },
            f = "",
            e;
        for (e in a) a.hasOwnProperty(e) && (f += g(a[e], e, ""));
        return b ? f.replace(/\t/g, b) : f.replace(/\t|\n/g, "")
    },
    toObj: function(a) {
        var b = {},
            g = /function/i;
        if (1 === a.nodeType) {
            if (a.attributes.length) {
                var f;
                for (f = 0; f < a.attributes.length; f += 1) b["@" + a.attributes[f].nodeName] = (a.attributes[f].nodeValue || "").toString()
            }
            if (a.firstChild) {
                var e = f = 0,
                    h = !1,
                    c;
                for (c = a.firstChild; c; c = c.nextSibling) 1 === c.nodeType ? h = !0 : 3 === c.nodeType && c.nodeValue.match(/[^ \f\n\r\t\v]/) ? f += 1 : 4 === c.nodeType && (e += 1);
                if (h)
                    if (2 > f && 2 > e)
                        for (this.removeWhite(a),
                                 c = a.firstChild; c; c = c.nextSibling) 3 === c.nodeType ? b["#text"] = this.escape(c.nodeValue) : 4 === c.nodeType ? g.test(c.nodeValue) ? b[c.nodeName] = [b[c.nodeName], c.nodeValue] : b["#cdata"] = this.escape(c.nodeValue) : b[c.nodeName] ? b[c.nodeName] instanceof Array ? b[c.nodeName][b[c.nodeName].length] = this.toObj(c) : b[c.nodeName] = [b[c.nodeName], this.toObj(c)] : b[c.nodeName] = this.toObj(c);
                    else a.attributes.length ? b["#text"] = this.escape(this.innerXml(a)) : b = this.escape(this.innerXml(a));
                else if (f) a.attributes.length ? b["#text"] =
                    this.escape(this.innerXml(a)) : (b = this.escape(this.innerXml(a)), "__EMPTY_ARRAY_" === b ? b = "[]" : "__EMPTY_STRING_" === b && (b = ""));
                else if (e)
                    if (1 < e) b = this.escape(this.innerXml(a));
                    else
                        for (c = a.firstChild; c; c = c.nextSibling)
                            if (g.test(a.firstChild.nodeValue)) {
                                b = a.firstChild.nodeValue;
                                break
                            } else b["#cdata"] = this.escape(c.nodeValue)
            }
            a.attributes.length || a.firstChild || (b = null)
        } else 9 === a.nodeType ? b = this.toObj(a.documentElement) : alert("unhandled node type: " + a.nodeType);
        return b
    },
    toJson: function(a, b, g, f) {
        void 0 ===
        f && (f = !0);
        var e = b ? '"' + b + '"' : "",
            h = "\t",
            c = "\n";
        f || (c = h = "");
        if ("[]" === a) e += b ? ":[]" : "[]";
        else if (a instanceof Array) {
            var l, d, m = [];
            d = 0;
            for (l = a.length; d < l; d += 1) m[d] = this.toJson(a[d], "", g + h, f);
            e += (b ? ":[" : "[") + (1 < m.length ? c + g + h + m.join("," + c + g + h) + c + g : m.join("")) + "]"
        } else if (null === a) e += (b && ":") + "null";
        else if ("object" === typeof a) {
            l = [];
            for (d in a) a.hasOwnProperty(d) && (l[l.length] = this.toJson(a[d], d, g + h, f));
            e += (b ? ":{" : "{") + (1 < l.length ? c + g + h + l.join("," + c + g + h) + c + g : l.join("")) + "}"
        } else e = "string" === typeof a ? e +
            ((b && ":") + '"' + a.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"') : e + ((b && ":") + a.toString());
        return e
    },
    innerXml: function(a) {
        var b = "";
        if ("innerHTML" in a) b = a.innerHTML;
        else {
            var g = function(a) {
                var b = "",
                    h;
                if (1 === a.nodeType) {
                    b += "<" + a.nodeName;
                    for (h = 0; h < a.attributes.length; h += 1) b += " " + a.attributes[h].nodeName + '="' + (a.attributes[h].nodeValue || "").toString() + '"';
                    if (a.firstChild) {
                        b += ">";
                        for (h = a.firstChild; h; h = h.nextSibling) b += g(h);
                        b += "</" + a.nodeName + ">"
                    } else b += "/>"
                } else 3 === a.nodeType ? b += a.nodeValue : 4 === a.nodeType &&
                    (b += "<![CDATA[" + a.nodeValue + "]]\x3e");
                return b
            };
            for (a = a.firstChild; a; a = a.nextSibling) b += g(a)
        }
        return b
    },
    escape: function(a) {
        return a.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r")
    },
    removeWhite: function(a) {
        a.normalize();
        var b;
        for (b = a.firstChild; b;)
            if (3 === b.nodeType)
                if (b.nodeValue.match(/[^ \f\n\r\t\v]/)) b = b.nextSibling;
                else {
                    var g = b.nextSibling;
                    a.removeChild(b);
                    b = g
                } else 1 === b.nodeType && this.removeWhite(b), b = b.nextSibling;
        return a
    }
};

function tableToGrid(l, m) {
    jQuery(l).each(function() {
        if (!this.grid) {
            jQuery(this).width("99%");
            var b = jQuery(this).width(),
                c = jQuery("tr td:first-child input[type=checkbox]:first", jQuery(this)),
                a = jQuery("tr td:first-child input[type=radio]:first", jQuery(this)),
                c = 0 < c.length,
                a = !c && 0 < a.length,
                k = c || a,
                d = [],
                e = [];
            jQuery("th", jQuery(this)).each(function() {
                0 === d.length && k ? (d.push({
                    name: "__selection__",
                    index: "__selection__",
                    width: 0,
                    hidden: !0
                }), e.push("__selection__")) : (d.push({
                    name: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                    index: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                    width: jQuery(this).width() || 150
                }), e.push(jQuery(this).html()))
            });
            var f = [],
                g = [],
                h = [];
            jQuery("tbody > tr", jQuery(this)).each(function() {
                var b = {},
                    a = 0;
                jQuery("td", jQuery(this)).each(function() {
                    if (0 === a && k) {
                        var c = jQuery("input", jQuery(this)),
                            e = c.attr("value");
                        g.push(e || f.length);
                        c.is(":checked") && h.push(e);
                        b[d[a].name] = c.attr("value")
                    } else b[d[a].name] = jQuery(this).html();
                    a++
                });
                0 < a && f.push(b)
            });
            jQuery(this).empty();
            jQuery(this).addClass("scroll");
            jQuery(this).jqGrid(jQuery.extend({
                datatype: "local",
                width: b,
                colNames: e,
                colModel: d,
                multiselect: c
            }, m || {}));
            for (b = 0; b < f.length; b++) a = null, 0 < g.length && (a = g[b]) && a.replace && (a = encodeURIComponent(a).replace(/[.\-%]/g, "_")), null === a && (a = b + 1), jQuery(this).jqGrid("addRowData", a, f[b]);
            for (b = 0; b < h.length; b++) jQuery(this).jqGrid("setSelection", h[b])
        }
    })
};
(function(b) {
    b.jgrid.msie && 8 === b.jgrid.msiever() && (b.expr[":"].hidden = function(b) {
        return 0 === b.offsetWidth || 0 === b.offsetHeight || "none" === b.style.display
    });
    b.jgrid._multiselect = !1;
    if (b.ui && b.ui.multiselect) {
        if (b.ui.multiselect.prototype._setSelected) {
            var r = b.ui.multiselect.prototype._setSelected;
            b.ui.multiselect.prototype._setSelected = function(a, d) {
                var c = r.call(this, a, d);
                if (d && this.selectedList) {
                    var e = this.element;
                    this.selectedList.find("li").each(function() {
                        b(this).data("optionLink") && b(this).data("optionLink").remove().appendTo(e)
                    })
                }
                return c
            }
        }
        b.ui.multiselect.prototype.destroy &&
        (b.ui.multiselect.prototype.destroy = function() {
            this.element.show();
            this.container.remove();
            void 0 === b.Widget ? b.widget.prototype.destroy.apply(this, arguments) : b.Widget.prototype.destroy.apply(this, arguments)
        });
        b.jgrid._multiselect = !0
    }
    b.jgrid.extend({
        sortableColumns: function(a) {
            return this.each(function() {
                function d() {
                    c.p.disableClick = !0
                }
                var c = this,
                    e = b.jgrid.jqID(c.p.id),
                    e = {
                        tolerance: "pointer",
                        axis: "x",
                        scrollSensitivity: "1",
                        items: ">th:not(:has(#jqgh_" + e + "_cb,#jqgh_" + e + "_rn,#jqgh_" + e + "_subgrid),:hidden)",
                        placeholder: {
                            element: function(a) {
                                return b(document.createElement(a[0].nodeName)).addClass(a[0].className + " ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0]
                            },
                            update: function(b, a) {
                                a.height(b.currentItem.innerHeight() - parseInt(b.currentItem.css("paddingTop") || 0, 10) - parseInt(b.currentItem.css("paddingBottom") || 0, 10));
                                a.width(b.currentItem.innerWidth() - parseInt(b.currentItem.css("paddingLeft") || 0, 10) - parseInt(b.currentItem.css("paddingRight") || 0, 10))
                            }
                        },
                        update: function(a,
                                         e) {
                            var d = b(e.item).parent(),
                                d = b(">th", d),
                                f = {},
                                g = c.p.id + "_";
                            b.each(c.p.colModel, function(b) {
                                f[this.name] = b
                            });
                            var l = [];
                            d.each(function() {
                                var a = b(">div", this).get(0).id.replace(/^jqgh_/, "").replace(g, "");
                                f.hasOwnProperty(a) && l.push(f[a])
                            });
                            b(c).jqGrid("remapColumns", l, !0, !0);
                            b.isFunction(c.p.sortable.update) && c.p.sortable.update(l);
                            setTimeout(function() {
                                c.p.disableClick = !1
                            }, 50)
                        }
                    };
                c.p.sortable.options ? b.extend(e, c.p.sortable.options) : b.isFunction(c.p.sortable) && (c.p.sortable = {
                        update: c.p.sortable
                    });
                if (e.start) {
                    var g =
                        e.start;
                    e.start = function(b, a) {
                        d();
                        g.call(this, b, a)
                    }
                } else e.start = d;
                c.p.sortable.exclude && (e.items += ":not(" + c.p.sortable.exclude + ")");
                a.sortable(e).data("sortable").floating = !0
            })
        },
        columnChooser: function(a) {
            function d(a, c) {
                a && ("string" === typeof a ? b.fn[a] && b.fn[a].apply(c, b.makeArray(arguments).slice(2)) : b.isFunction(a) && a.apply(c, b.makeArray(arguments).slice(2)))
            }
            var c = this;
            if (!b("#colchooser_" + b.jgrid.jqID(c[0].p.id)).length) {
                var e = b('<div id="colchooser_' + c[0].p.id + '" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'),
                    g = b("select", e);
                a = b.extend({
                    width: 420,
                    height: 240,
                    classname: null,
                    done: function(b) {
                        b && c.jqGrid("remapColumns", b, !0)
                    },
                    msel: "multiselect",
                    dlog: "dialog",
                    dialog_opts: {
                        minWidth: 470
                    },
                    dlog_opts: function(a) {
                        var c = {};
                        c[a.bSubmit] = function() {
                            a.apply_perm();
                            a.cleanup(!1)
                        };
                        c[a.bCancel] = function() {
                            a.cleanup(!0)
                        };
                        return b.extend(!0, {
                            buttons: c,
                            close: function() {
                                a.cleanup(!0)
                            },
                            modal: a.modal || !1,
                            resizable: a.resizable || !0,
                            width: a.width + 20
                        }, a.dialog_opts || {})
                    },
                    apply_perm: function() {
                        b("option", g).each(function() {
                            this.selected ?
                                c.jqGrid("showCol", k[this.value].name) : c.jqGrid("hideCol", k[this.value].name)
                        });
                        var e = [];
                        b("option:selected", g).each(function() {
                            e.push(parseInt(this.value, 10))
                        });
                        b.each(e, function() {
                            delete p[k[parseInt(this, 10)].name]
                        });
                        b.each(p, function() {
                            var b = parseInt(this, 10);
                            var a = e,
                                c = b;
                            if (0 <= c) {
                                var d = a.slice(),
                                    k = d.splice(c, Math.max(a.length - c, c));
                                c > a.length && (c = a.length);
                                d[c] = b;
                                e = d.concat(k)
                            } else e = void 0
                        });
                        a.done && a.done.call(c, e)
                    },
                    cleanup: function(b) {
                        d(a.dlog, e, "destroy");
                        d(a.msel, g, "destroy");
                        e.remove();
                        b && a.done && a.done.call(c)
                    },
                    msel_opts: {}
                }, b.jgrid.col, a || {});
                if (b.ui && b.ui.multiselect && "multiselect" === a.msel) {
                    if (!b.jgrid._multiselect) {
                        alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");
                        return
                    }
                    a.msel_opts = b.extend(b.ui.multiselect.defaults, a.msel_opts)
                }
                a.caption && e.attr("title", a.caption);
                a.classname && (e.addClass(a.classname), g.addClass(a.classname));
                a.width && (b(">div", e).css({
                    width: a.width,
                    margin: "0 auto"
                }), g.css("width", a.width));
                a.height && (b(">div", e).css("height",
                    a.height), g.css("height", a.height - 10));
                var k = c.jqGrid("getGridParam", "colModel"),
                    t = c.jqGrid("getGridParam", "colNames"),
                    p = {},
                    f = [];
                g.empty();
                b.each(k, function(a) {
                    p[this.name] = a;
                    this.hidedlg ? this.hidden || f.push(a) : g.append("<option value='" + a + "' " + (this.hidden ? "" : "selected='selected'") + ">" + b.jgrid.stripHtml(t[a]) + "</option>")
                });
                var q = b.isFunction(a.dlog_opts) ? a.dlog_opts.call(c, a) : a.dlog_opts;
                d(a.dlog, e, q);
                q = b.isFunction(a.msel_opts) ? a.msel_opts.call(c, a) : a.msel_opts;
                d(a.msel, g, q)
            }
        },
        sortableRows: function(a) {
            return this.each(function() {
                var d =
                    this;
                d.grid && !d.p.treeGrid && b.fn.sortable && (a = b.extend({
                    cursor: "move",
                    axis: "y",
                    items: ".jqgrow"
                }, a || {}), a.start && b.isFunction(a.start) ? (a._start_ = a.start, delete a.start) : a._start_ = !1, a.update && b.isFunction(a.update) ? (a._update_ = a.update, delete a.update) : a._update_ = !1, a.start = function(c, e) {
                    b(e.item).css("border-width", "0");
                    b("td", e.item).each(function(b) {
                        this.style.width = d.grid.cols[b].style.width
                    });
                    if (d.p.subGrid) {
                        var g = b(e.item).attr("id");
                        try {
                            b(d).jqGrid("collapseSubGridRow", g)
                        } catch (k) {}
                    }
                    a._start_ &&
                    a._start_.apply(this, [c, e])
                }, a.update = function(c, e) {
                    b(e.item).css("border-width", "");
                    !0 === d.p.rownumbers && b("td.jqgrid-rownum", d.rows).each(function(a) {
                        b(this).html(a + 1 + (parseInt(d.p.page, 10) - 1) * parseInt(d.p.rowNum, 10))
                    });
                    a._update_ && a._update_.apply(this, [c, e])
                }, b("tbody:first", d).sortable(a), b("tbody:first", d).disableSelection())
            })
        },
        gridDnD: function(a) {
            return this.each(function() {
                function d() {
                    var a = b.data(c, "dnd");
                    b("tr.jqgrow:not(.ui-draggable)", c).draggable(b.isFunction(a.drag) ? a.drag.call(b(c),
                        a) : a.drag)
                }
                var c = this,
                    e, g;
                if (c.grid && !c.p.treeGrid && b.fn.draggable && b.fn.droppable)
                    if (void 0 === b("#jqgrid_dnd")[0] && b("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>"), "string" === typeof a && "updateDnD" === a && !0 === c.p.jqgdnd) d();
                    else if (a = b.extend({
                            drag: function(a) {
                                return b.extend({
                                    start: function(e, d) {
                                        var f;
                                        if (c.p.subGrid) {
                                            f = b(d.helper).attr("id");
                                            try {
                                                b(c).jqGrid("collapseSubGridRow", f)
                                            } catch (g) {}
                                        }
                                        for (f = 0; f < b.data(c, "dnd").connectWith.length; f++) 0 === b(b.data(c, "dnd").connectWith[f]).jqGrid("getGridParam",
                                            "reccount") && b(b.data(c, "dnd").connectWith[f]).jqGrid("addRowData", "jqg_empty_row", {});
                                        d.helper.addClass("ui-state-highlight");
                                        b("td", d.helper).each(function(b) {
                                            this.style.width = c.grid.headers[b].width + "px"
                                        });
                                        a.onstart && b.isFunction(a.onstart) && a.onstart.call(b(c), e, d)
                                    },
                                    stop: function(e, d) {
                                        var f;
                                        d.helper.dropped && !a.dragcopy && (f = b(d.helper).attr("id"), void 0 === f && (f = b(this).attr("id")), b(c).jqGrid("delRowData", f));
                                        for (f = 0; f < b.data(c, "dnd").connectWith.length; f++) b(b.data(c, "dnd").connectWith[f]).jqGrid("delRowData",
                                            "jqg_empty_row");
                                        a.onstop && b.isFunction(a.onstop) && a.onstop.call(b(c), e, d)
                                    }
                                }, a.drag_opts || {})
                            },
                            drop: function(a) {
                                return b.extend({
                                    accept: function(a) {
                                        if (!b(a).hasClass("jqgrow")) return a;
                                        a = b(a).closest("table.ui-jqgrid-btable");
                                        return 0 < a.length && void 0 !== b.data(a[0], "dnd") ? (a = b.data(a[0], "dnd").connectWith, -1 !== b.inArray("#" + b.jgrid.jqID(this.id), a) ? !0 : !1) : !1
                                    },
                                    drop: function(e, d) {
                                        if (b(d.draggable).hasClass("jqgrow")) {
                                            var f = b(d.draggable).attr("id"),
                                                f = d.draggable.parent().parent().jqGrid("getRowData",
                                                    f);
                                            if (!a.dropbyname) {
                                                var g = 0,
                                                    l = {},
                                                    h, n, s = b("#" + b.jgrid.jqID(this.id)).jqGrid("getGridParam", "colModel");
                                                try {
                                                    for (n in f) f.hasOwnProperty(n) && (h = s[g].name, "cb" !== h && "rn" !== h && "subgrid" !== h && f.hasOwnProperty(n) && s[g] && (l[h] = f[n]), g++);
                                                    f = l
                                                } catch (r) {}
                                            }
                                            d.helper.dropped = !0;
                                            a.beforedrop && b.isFunction(a.beforedrop) && (h = a.beforedrop.call(this, e, d, f, b("#" + b.jgrid.jqID(c.p.id)), b(this)), void 0 !== h && null !== h && "object" === typeof h && (f = h));
                                            if (d.helper.dropped) {
                                                var m;
                                                a.autoid && (b.isFunction(a.autoid) ? m = a.autoid.call(this,
                                                    f) : (m = Math.ceil(1E3 * Math.random()), m = a.autoidprefix + m));
                                                b("#" + b.jgrid.jqID(this.id)).jqGrid("addRowData", m, f, a.droppos)
                                            }
                                            a.ondrop && b.isFunction(a.ondrop) && a.ondrop.call(this, e, d, f)
                                        }
                                    }
                                }, a.drop_opts || {})
                            },
                            onstart: null,
                            onstop: null,
                            beforedrop: null,
                            ondrop: null,
                            drop_opts: {
                                activeClass: "ui-state-active",
                                hoverClass: "ui-state-hover"
                            },
                            drag_opts: {
                                revert: "invalid",
                                helper: "clone",
                                cursor: "move",
                                appendTo: "#jqgrid_dnd",
                                zIndex: 5E3
                            },
                            dragcopy: !1,
                            dropbyname: !1,
                            droppos: "first",
                            autoid: !0,
                            autoidprefix: "dnd_"
                        }, a || {}), a.connectWith)
                        for (a.connectWith =
                                 a.connectWith.split(","), a.connectWith = b.map(a.connectWith, function(a) {
                            return b.trim(a)
                        }), b.data(c, "dnd", a), 0 === c.p.reccount || c.p.jqgdnd || d(), c.p.jqgdnd = !0, e = 0; e < a.connectWith.length; e++) g = a.connectWith[e], b(g).droppable(b.isFunction(a.drop) ? a.drop.call(b(c), a) : a.drop)
            })
        },
        gridResize: function(a) {
            return this.each(function() {
                var d = this,
                    c = b.jgrid.jqID(d.p.id);
                d.grid && b.fn.resizable && (a = b.extend({}, a || {}), a.alsoResize ? (a._alsoResize_ = a.alsoResize, delete a.alsoResize) : a._alsoResize_ = !1, a.stop && b.isFunction(a.stop) ?
                    (a._stop_ = a.stop, delete a.stop) : a._stop_ = !1, a.stop = function(e, g) {
                    b(d).jqGrid("setGridParam", {
                        height: b("#gview_" + c + " .ui-jqgrid-bdiv").height()
                    });
                    b(d).jqGrid("setGridWidth", g.size.width, a.shrinkToFit);
                    a._stop_ && a._stop_.call(d, e, g)
                }, a.alsoResize = a._alsoResize_ ? eval("(" + ("{'#gview_" + c + " .ui-jqgrid-bdiv':true,'" + a._alsoResize_ + "':true}") + ")") : b(".ui-jqgrid-bdiv", "#gview_" + c), delete a._alsoResize_, b("#gbox_" + c).resizable(a))
            })
        }
    })
})(jQuery);/**
 * Created by guorui on 17-3-31.
 */
