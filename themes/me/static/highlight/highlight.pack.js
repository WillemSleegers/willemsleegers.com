/*
  Highlight.js 10.1.2 (edd73d24)
  License: BSD-3-Clause
  Copyright (c) 2006-2020, Ivan Sagalaev
*/
var hljs = (function () {
    "use strict";
    function e(n) {
        Object.freeze(n);
        var t = "function" == typeof n;
        return (
            Object.getOwnPropertyNames(n).forEach(function (r) {
                !Object.hasOwnProperty.call(n, r) || null === n[r] || ("object" != typeof n[r] && "function" != typeof n[r]) || (t && ("caller" === r || "callee" === r || "arguments" === r)) || Object.isFrozen(n[r]) || e(n[r]);
            }),
            n
        );
    }
    class n {
        constructor(e) {
            void 0 === e.data && (e.data = {}), (this.data = e.data);
        }
        ignoreMatch() {
            this.ignore = !0;
        }
    }
    function t(e) {
        return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    }
    function r(e, ...n) {
        var t = {};
        for (const n in e) t[n] = e[n];
        return (
            n.forEach(function (e) {
                for (const n in e) t[n] = e[n];
            }),
            t
        );
    }
    function a(e) {
        return e.nodeName.toLowerCase();
    }
    var i = Object.freeze({
        __proto__: null,
        escapeHTML: t,
        inherit: r,
        nodeStream: function (e) {
            var n = [];
            return (
                (function e(t, r) {
                    for (var i = t.firstChild; i; i = i.nextSibling)
                        3 === i.nodeType ? (r += i.nodeValue.length) : 1 === i.nodeType && (n.push({ event: "start", offset: r, node: i }), (r = e(i, r)), a(i).match(/br|hr|img|input/) || n.push({ event: "stop", offset: r, node: i }));
                    return r;
                })(e, 0),
                n
            );
        },
        mergeStreams: function (e, n, r) {
            var i = 0,
                s = "",
                o = [];
            function l() {
                return e.length && n.length ? (e[0].offset !== n[0].offset ? (e[0].offset < n[0].offset ? e : n) : "start" === n[0].event ? e : n) : e.length ? e : n;
            }
            function c(e) {
                s +=
                    "<" +
                    a(e) +
                    [].map
                        .call(e.attributes, function (e) {
                            return " " + e.nodeName + '="' + t(e.value) + '"';
                        })
                        .join("") +
                    ">";
            }
            function u(e) {
                s += "</" + a(e) + ">";
            }
            function d(e) {
                ("start" === e.event ? c : u)(e.node);
            }
            for (; e.length || n.length; ) {
                var g = l();
                if (((s += t(r.substring(i, g[0].offset))), (i = g[0].offset), g === e)) {
                    o.reverse().forEach(u);
                    do {
                        d(g.splice(0, 1)[0]), (g = l());
                    } while (g === e && g.length && g[0].offset === i);
                    o.reverse().forEach(c);
                } else "start" === g[0].event ? o.push(g[0].node) : o.pop(), d(g.splice(0, 1)[0]);
            }
            return s + t(r.substr(i));
        },
    });
    const s = "</span>",
        o = (e) => !!e.kind;
    class l {
        constructor(e, n) {
            (this.buffer = ""), (this.classPrefix = n.classPrefix), e.walk(this);
        }
        addText(e) {
            this.buffer += t(e);
        }
        openNode(e) {
            if (!o(e)) return;
            let n = e.kind;
            e.sublanguage || (n = `${this.classPrefix}${n}`), this.span(n);
        }
        closeNode(e) {
            o(e) && (this.buffer += s);
        }
        value() {
            return this.buffer;
        }
        span(e) {
            this.buffer += `<span class="${e}">`;
        }
    }
    class c {
        constructor() {
            (this.rootNode = { children: [] }), (this.stack = [this.rootNode]);
        }
        get top() {
            return this.stack[this.stack.length - 1];
        }
        get root() {
            return this.rootNode;
        }
        add(e) {
            this.top.children.push(e);
        }
        openNode(e) {
            const n = { kind: e, children: [] };
            this.add(n), this.stack.push(n);
        }
        closeNode() {
            if (this.stack.length > 1) return this.stack.pop();
        }
        closeAllNodes() {
            for (; this.closeNode(); );
        }
        toJSON() {
            return JSON.stringify(this.rootNode, null, 4);
        }
        walk(e) {
            return this.constructor._walk(e, this.rootNode);
        }
        static _walk(e, n) {
            return "string" == typeof n ? e.addText(n) : n.children && (e.openNode(n), n.children.forEach((n) => this._walk(e, n)), e.closeNode(n)), e;
        }
        static _collapse(e) {
            "string" != typeof e &&
                e.children &&
                (e.children.every((e) => "string" == typeof e)
                    ? (e.children = [e.children.join("")])
                    : e.children.forEach((e) => {
                          c._collapse(e);
                      }));
        }
    }
    class u extends c {
        constructor(e) {
            super(), (this.options = e);
        }
        addKeyword(e, n) {
            "" !== e && (this.openNode(n), this.addText(e), this.closeNode());
        }
        addText(e) {
            "" !== e && this.add(e);
        }
        addSublanguage(e, n) {
            const t = e.root;
            (t.kind = n), (t.sublanguage = !0), this.add(t);
        }
        toHTML() {
            return new l(this, this.options).value();
        }
        finalize() {
            return !0;
        }
    }
    function d(e) {
        return e ? ("string" == typeof e ? e : e.source) : null;
    }
    const g = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
        h = { begin: "\\\\[\\s\\S]", relevance: 0 },
        f = { className: "string", begin: "'", end: "'", illegal: "\\n", contains: [h] },
        p = { className: "string", begin: '"', end: '"', illegal: "\\n", contains: [h] },
        b = { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ },
        m = function (e, n, t = {}) {
            var a = r({ className: "comment", begin: e, end: n, contains: [] }, t);
            return a.contains.push(b), a.contains.push({ className: "doctag", begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):", relevance: 0 }), a;
        },
        v = m("//", "$"),
        x = m("/\\*", "\\*/"),
        E = m("#", "$");
    var _ = Object.freeze({
            __proto__: null,
            IDENT_RE: "[a-zA-Z]\\w*",
            UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
            NUMBER_RE: "\\b\\d+(\\.\\d+)?",
            C_NUMBER_RE: g,
            BINARY_NUMBER_RE: "\\b(0b[01]+)",
            RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
            SHEBANG: (e = {}) => {
                const n = /^#![ ]*\//;
                return (
                    e.binary &&
                        (e.begin = (function (...e) {
                            return e.map((e) => d(e)).join("");
                        })(n, /.*\b/, e.binary, /\b.*/)),
                    r(
                        {
                            className: "meta",
                            begin: n,
                            end: /$/,
                            relevance: 0,
                            "on:begin": (e, n) => {
                                0 !== e.index && n.ignoreMatch();
                            },
                        },
                        e
                    )
                );
            },
            BACKSLASH_ESCAPE: h,
            APOS_STRING_MODE: f,
            QUOTE_STRING_MODE: p,
            PHRASAL_WORDS_MODE: b,
            COMMENT: m,
            C_LINE_COMMENT_MODE: v,
            C_BLOCK_COMMENT_MODE: x,
            HASH_COMMENT_MODE: E,
            NUMBER_MODE: { className: "number", begin: "\\b\\d+(\\.\\d+)?", relevance: 0 },
            C_NUMBER_MODE: { className: "number", begin: g, relevance: 0 },
            BINARY_NUMBER_MODE: { className: "number", begin: "\\b(0b[01]+)", relevance: 0 },
            CSS_NUMBER_MODE: { className: "number", begin: "\\b\\d+(\\.\\d+)?(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?", relevance: 0 },
            REGEXP_MODE: { begin: /(?=\/[^/\n]*\/)/, contains: [{ className: "regexp", begin: /\//, end: /\/[gimuy]*/, illegal: /\n/, contains: [h, { begin: /\[/, end: /\]/, relevance: 0, contains: [h] }] }] },
            TITLE_MODE: { className: "title", begin: "[a-zA-Z]\\w*", relevance: 0 },
            UNDERSCORE_TITLE_MODE: { className: "title", begin: "[a-zA-Z_]\\w*", relevance: 0 },
            METHOD_GUARD: { begin: "\\.\\s*[a-zA-Z_]\\w*", relevance: 0 },
            END_SAME_AS_BEGIN: function (e) {
                return Object.assign(e, {
                    "on:begin": (e, n) => {
                        n.data._beginMatch = e[1];
                    },
                    "on:end": (e, n) => {
                        n.data._beginMatch !== e[1] && n.ignoreMatch();
                    },
                });
            },
        }),
        N = "of and for in not or if then".split(" ");
    function w(e, n) {
        return n
            ? +n
            : (function (e) {
                  return N.includes(e.toLowerCase());
              })(e)
            ? 0
            : 1;
    }
    const R = t,
        y = r,
        { nodeStream: O, mergeStreams: k } = i,
        M = Symbol("nomatch");
    return (function (t) {
        var a = [],
            i = Object.create(null),
            s = Object.create(null),
            o = [],
            l = !0,
            c = /(^(<[^>]+>|\t|)+|\n)/gm,
            g = "Could not find the language '{}', did you forget to load/include a language module?";
        const h = { disableAutodetect: !0, name: "Plain text", contains: [] };
        var f = { noHighlightRe: /^(no-?highlight)$/i, languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-", tabReplace: null, useBR: !1, languages: null, __emitter: u };
        function p(e) {
            return f.noHighlightRe.test(e);
        }
        function b(e, n, t, r) {
            var a = { code: n, language: e };
            S("before:highlight", a);
            var i = a.result ? a.result : m(a.language, a.code, t, r);
            return (i.code = a.code), S("after:highlight", i), i;
        }
        function m(e, t, a, s) {
            var o = t;
            function c(e, n) {
                var t = E.case_insensitive ? n[0].toLowerCase() : n[0];
                return Object.prototype.hasOwnProperty.call(e.keywords, t) && e.keywords[t];
            }
            function u() {
                null != y.subLanguage
                    ? (function () {
                          if ("" !== A) {
                              var e = null;
                              if ("string" == typeof y.subLanguage) {
                                  if (!i[y.subLanguage]) return void k.addText(A);
                                  (e = m(y.subLanguage, A, !0, O[y.subLanguage])), (O[y.subLanguage] = e.top);
                              } else e = v(A, y.subLanguage.length ? y.subLanguage : null);
                              y.relevance > 0 && (I += e.relevance), k.addSublanguage(e.emitter, e.language);
                          }
                      })()
                    : (function () {
                          if (!y.keywords) return void k.addText(A);
                          let e = 0;
                          y.keywordPatternRe.lastIndex = 0;
                          let n = y.keywordPatternRe.exec(A),
                              t = "";
                          for (; n; ) {
                              t += A.substring(e, n.index);
                              const r = c(y, n);
                              if (r) {
                                  const [e, a] = r;
                                  k.addText(t), (t = ""), (I += a), k.addKeyword(n[0], e);
                              } else t += n[0];
                              (e = y.keywordPatternRe.lastIndex), (n = y.keywordPatternRe.exec(A));
                          }
                          (t += A.substr(e)), k.addText(t);
                      })(),
                    (A = "");
            }
            function h(e) {
                return e.className && k.openNode(e.className), (y = Object.create(e, { parent: { value: y } }));
            }
            function p(e) {
                return 0 === y.matcher.regexIndex ? ((A += e[0]), 1) : ((L = !0), 0);
            }
            var b = {};
            function x(t, r) {
                var i = r && r[0];
                if (((A += t), null == i)) return u(), 0;
                if ("begin" === b.type && "end" === r.type && b.index === r.index && "" === i) {
                    if (((A += o.slice(r.index, r.index + 1)), !l)) {
                        const n = Error("0 width match regex");
                        throw ((n.languageName = e), (n.badRule = b.rule), n);
                    }
                    return 1;
                }
                if (((b = r), "begin" === r.type))
                    return (function (e) {
                        var t = e[0],
                            r = e.rule;
                        const a = new n(r),
                            i = [r.__beforeBegin, r["on:begin"]];
                        for (const n of i) if (n && (n(e, a), a.ignore)) return p(t);
                        return (
                            r && r.endSameAsBegin && (r.endRe = RegExp(t.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")),
                            r.skip ? (A += t) : (r.excludeBegin && (A += t), u(), r.returnBegin || r.excludeBegin || (A = t)),
                            h(r),
                            r.returnBegin ? 0 : t.length
                        );
                    })(r);
                if ("illegal" === r.type && !a) {
                    const e = Error('Illegal lexeme "' + i + '" for mode "' + (y.className || "<unnamed>") + '"');
                    throw ((e.mode = y), e);
                }
                if ("end" === r.type) {
                    var s = (function (e) {
                        var t = e[0],
                            r = o.substr(e.index),
                            a = (function e(t, r, a) {
                                let i = (function (e, n) {
                                    var t = e && e.exec(n);
                                    return t && 0 === t.index;
                                })(t.endRe, a);
                                if (i) {
                                    if (t["on:end"]) {
                                        const e = new n(t);
                                        t["on:end"](r, e), e.ignore && (i = !1);
                                    }
                                    if (i) {
                                        for (; t.endsParent && t.parent; ) t = t.parent;
                                        return t;
                                    }
                                }
                                if (t.endsWithParent) return e(t.parent, r, a);
                            })(y, e, r);
                        if (!a) return M;
                        var i = y;
                        i.skip ? (A += t) : (i.returnEnd || i.excludeEnd || (A += t), u(), i.excludeEnd && (A = t));
                        do {
                            y.className && k.closeNode(), y.skip || y.subLanguage || (I += y.relevance), (y = y.parent);
                        } while (y !== a.parent);
                        return a.starts && (a.endSameAsBegin && (a.starts.endRe = a.endRe), h(a.starts)), i.returnEnd ? 0 : t.length;
                    })(r);
                    if (s !== M) return s;
                }
                if ("illegal" === r.type && "" === i) return 1;
                if (B > 1e5 && B > 3 * r.index) throw Error("potential infinite loop, way more iterations than matches");
                return (A += i), i.length;
            }
            var E = T(e);
            if (!E) throw (console.error(g.replace("{}", e)), Error('Unknown language: "' + e + '"'));
            var _ = (function (e) {
                    function n(n, t) {
                        return RegExp(d(n), "m" + (e.case_insensitive ? "i" : "") + (t ? "g" : ""));
                    }
                    class t {
                        constructor() {
                            (this.matchIndexes = {}), (this.regexes = []), (this.matchAt = 1), (this.position = 0);
                        }
                        addRule(e, n) {
                            (n.position = this.position++),
                                (this.matchIndexes[this.matchAt] = n),
                                this.regexes.push([n, e]),
                                (this.matchAt +=
                                    (function (e) {
                                        return RegExp(e.toString() + "|").exec("").length - 1;
                                    })(e) + 1);
                        }
                        compile() {
                            0 === this.regexes.length && (this.exec = () => null);
                            const e = this.regexes.map((e) => e[1]);
                            (this.matcherRe = n(
                                (function (e, n = "|") {
                                    for (var t = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./, r = 0, a = "", i = 0; i < e.length; i++) {
                                        var s = (r += 1),
                                            o = d(e[i]);
                                        for (i > 0 && (a += n), a += "("; o.length > 0; ) {
                                            var l = t.exec(o);
                                            if (null == l) {
                                                a += o;
                                                break;
                                            }
                                            (a += o.substring(0, l.index)), (o = o.substring(l.index + l[0].length)), "\\" === l[0][0] && l[1] ? (a += "\\" + (+l[1] + s)) : ((a += l[0]), "(" === l[0] && r++);
                                        }
                                        a += ")";
                                    }
                                    return a;
                                })(e),
                                !0
                            )),
                                (this.lastIndex = 0);
                        }
                        exec(e) {
                            this.matcherRe.lastIndex = this.lastIndex;
                            const n = this.matcherRe.exec(e);
                            if (!n) return null;
                            const t = n.findIndex((e, n) => n > 0 && void 0 !== e),
                                r = this.matchIndexes[t];
                            return n.splice(0, t), Object.assign(n, r);
                        }
                    }
                    class a {
                        constructor() {
                            (this.rules = []), (this.multiRegexes = []), (this.count = 0), (this.lastIndex = 0), (this.regexIndex = 0);
                        }
                        getMatcher(e) {
                            if (this.multiRegexes[e]) return this.multiRegexes[e];
                            const n = new t();
                            return this.rules.slice(e).forEach(([e, t]) => n.addRule(e, t)), n.compile(), (this.multiRegexes[e] = n), n;
                        }
                        considerAll() {
                            this.regexIndex = 0;
                        }
                        addRule(e, n) {
                            this.rules.push([e, n]), "begin" === n.type && this.count++;
                        }
                        exec(e) {
                            const n = this.getMatcher(this.regexIndex);
                            n.lastIndex = this.lastIndex;
                            const t = n.exec(e);
                            return t && ((this.regexIndex += t.position + 1), this.regexIndex === this.count && (this.regexIndex = 0)), t;
                        }
                    }
                    function i(e, n) {
                        const t = e.input[e.index - 1],
                            r = e.input[e.index + e[0].length];
                        ("." !== t && "." !== r) || n.ignoreMatch();
                    }
                    if (e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
                    return (function t(s, o) {
                        const l = s;
                        if (s.compiled) return l;
                        (s.compiled = !0), (s.__beforeBegin = null), (s.keywords = s.keywords || s.beginKeywords);
                        let c = null;
                        if (
                            ("object" == typeof s.keywords && ((c = s.keywords.$pattern), delete s.keywords.$pattern),
                            s.keywords &&
                                (s.keywords = (function (e, n) {
                                    var t = {};
                                    return (
                                        "string" == typeof e
                                            ? r("keyword", e)
                                            : Object.keys(e).forEach(function (n) {
                                                  r(n, e[n]);
                                              }),
                                        t
                                    );
                                    function r(e, r) {
                                        n && (r = r.toLowerCase()),
                                            r.split(" ").forEach(function (n) {
                                                var r = n.split("|");
                                                t[r[0]] = [e, w(r[0], r[1])];
                                            });
                                    }
                                })(s.keywords, e.case_insensitive)),
                            s.lexemes && c)
                        )
                            throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
                        return (
                            (l.keywordPatternRe = n(s.lexemes || c || /\w+/, !0)),
                            o &&
                                (s.beginKeywords && ((s.begin = "\\b(" + s.beginKeywords.split(" ").join("|") + ")(?=\\b|\\s)"), (s.__beforeBegin = i)),
                                s.begin || (s.begin = /\B|\b/),
                                (l.beginRe = n(s.begin)),
                                s.endSameAsBegin && (s.end = s.begin),
                                s.end || s.endsWithParent || (s.end = /\B|\b/),
                                s.end && (l.endRe = n(s.end)),
                                (l.terminator_end = d(s.end) || ""),
                                s.endsWithParent && o.terminator_end && (l.terminator_end += (s.end ? "|" : "") + o.terminator_end)),
                            s.illegal && (l.illegalRe = n(s.illegal)),
                            void 0 === s.relevance && (s.relevance = 1),
                            s.contains || (s.contains = []),
                            (s.contains = [].concat(
                                ...s.contains.map(function (e) {
                                    return (function (e) {
                                        return (
                                            e.variants &&
                                                !e.cached_variants &&
                                                (e.cached_variants = e.variants.map(function (n) {
                                                    return r(e, { variants: null }, n);
                                                })),
                                            e.cached_variants
                                                ? e.cached_variants
                                                : (function e(n) {
                                                      return !!n && (n.endsWithParent || e(n.starts));
                                                  })(e)
                                                ? r(e, { starts: e.starts ? r(e.starts) : null })
                                                : Object.isFrozen(e)
                                                ? r(e)
                                                : e
                                        );
                                    })("self" === e ? s : e);
                                })
                            )),
                            s.contains.forEach(function (e) {
                                t(e, l);
                            }),
                            s.starts && t(s.starts, o),
                            (l.matcher = (function (e) {
                                const n = new a();
                                return e.contains.forEach((e) => n.addRule(e.begin, { rule: e, type: "begin" })), e.terminator_end && n.addRule(e.terminator_end, { type: "end" }), e.illegal && n.addRule(e.illegal, { type: "illegal" }), n;
                            })(l)),
                            l
                        );
                    })(e);
                })(E),
                N = "",
                y = s || _,
                O = {},
                k = new f.__emitter(f);
            !(function () {
                for (var e = [], n = y; n !== E; n = n.parent) n.className && e.unshift(n.className);
                e.forEach((e) => k.openNode(e));
            })();
            var A = "",
                I = 0,
                S = 0,
                B = 0,
                L = !1;
            try {
                for (y.matcher.considerAll(); ; ) {
                    B++, L ? (L = !1) : ((y.matcher.lastIndex = S), y.matcher.considerAll());
                    const e = y.matcher.exec(o);
                    if (!e) break;
                    const n = x(o.substring(S, e.index), e);
                    S = e.index + n;
                }
                return x(o.substr(S)), k.closeAllNodes(), k.finalize(), (N = k.toHTML()), { relevance: I, value: N, language: e, illegal: !1, emitter: k, top: y };
            } catch (n) {
                if (n.message && n.message.includes("Illegal")) return { illegal: !0, illegalBy: { msg: n.message, context: o.slice(S - 100, S + 100), mode: n.mode }, sofar: N, relevance: 0, value: R(o), emitter: k };
                if (l) return { illegal: !1, relevance: 0, value: R(o), emitter: k, language: e, top: y, errorRaised: n };
                throw n;
            }
        }
        function v(e, n) {
            n = n || f.languages || Object.keys(i);
            var t = (function (e) {
                    const n = { relevance: 0, emitter: new f.__emitter(f), value: R(e), illegal: !1, top: h };
                    return n.emitter.addText(e), n;
                })(e),
                r = t;
            return (
                n
                    .filter(T)
                    .filter(I)
                    .forEach(function (n) {
                        var a = m(n, e, !1);
                        (a.language = n), a.relevance > r.relevance && (r = a), a.relevance > t.relevance && ((r = t), (t = a));
                    }),
                r.language && (t.second_best = r),
                t
            );
        }
        function x(e) {
            return f.tabReplace || f.useBR ? e.replace(c, (e) => ("\n" === e ? (f.useBR ? "<br>" : e) : f.tabReplace ? e.replace(/\t/g, f.tabReplace) : e)) : e;
        }
        function E(e) {
            let n = null;
            const t = (function (e) {
                var n = e.className + " ";
                n += e.parentNode ? e.parentNode.className : "";
                const t = f.languageDetectRe.exec(n);
                if (t) {
                    var r = T(t[1]);
                    return r || (console.warn(g.replace("{}", t[1])), console.warn("Falling back to no-highlight mode for this block.", e)), r ? t[1] : "no-highlight";
                }
                return n.split(/\s+/).find((e) => p(e) || T(e));
            })(e);
            if (p(t)) return;
            S("before:highlightBlock", { block: e, language: t }), f.useBR ? ((n = document.createElement("div")).innerHTML = e.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, "\n")) : (n = e);
            const r = n.textContent,
                a = t ? b(t, r, !0) : v(r),
                i = O(n);
            if (i.length) {
                const e = document.createElement("div");
                (e.innerHTML = a.value), (a.value = k(i, O(e), r));
            }
            (a.value = x(a.value)),
                S("after:highlightBlock", { block: e, result: a }),
                (e.innerHTML = a.value),
                (e.className = (function (e, n, t) {
                    var r = n ? s[n] : t,
                        a = [e.trim()];
                    return e.match(/\bhljs\b/) || a.push("hljs"), e.includes(r) || a.push(r), a.join(" ").trim();
                })(e.className, t, a.language)),
                (e.result = { language: a.language, re: a.relevance, relavance: a.relevance }),
                a.second_best && (e.second_best = { language: a.second_best.language, re: a.second_best.relevance, relavance: a.second_best.relevance });
        }
        const N = () => {
            if (!N.called) {
                N.called = !0;
                var e = document.querySelectorAll("pre code");
                a.forEach.call(e, E);
            }
        };
        function T(e) {
            return (e = (e || "").toLowerCase()), i[e] || i[s[e]];
        }
        function A(e, { languageName: n }) {
            "string" == typeof e && (e = [e]),
                e.forEach((e) => {
                    s[e] = n;
                });
        }
        function I(e) {
            var n = T(e);
            return n && !n.disableAutodetect;
        }
        function S(e, n) {
            var t = e;
            o.forEach(function (e) {
                e[t] && e[t](n);
            });
        }
        Object.assign(t, {
            highlight: b,
            highlightAuto: v,
            fixMarkup: x,
            highlightBlock: E,
            configure: function (e) {
                f = y(f, e);
            },
            initHighlighting: N,
            initHighlightingOnLoad: function () {
                window.addEventListener("DOMContentLoaded", N, !1);
            },
            registerLanguage: function (e, n) {
                var r = null;
                try {
                    r = n(t);
                } catch (n) {
                    if ((console.error("Language definition for '{}' could not be registered.".replace("{}", e)), !l)) throw n;
                    console.error(n), (r = h);
                }
                r.name || (r.name = e), (i[e] = r), (r.rawDefinition = n.bind(null, t)), r.aliases && A(r.aliases, { languageName: e });
            },
            listLanguages: function () {
                return Object.keys(i);
            },
            getLanguage: T,
            registerAliases: A,
            requireLanguage: function (e) {
                var n = T(e);
                if (n) return n;
                throw Error("The '{}' language is required, but not loaded.".replace("{}", e));
            },
            autoDetection: I,
            inherit: y,
            addPlugin: function (e) {
                o.push(e);
            },
        }),
            (t.debugMode = function () {
                l = !1;
            }),
            (t.safeMode = function () {
                l = !0;
            }),
            (t.versionString = "10.1.2");
        for (const n in _) "object" == typeof _[n] && e(_[n]);
        return Object.assign(t, _), t;
    })({});
})();
"object" == typeof exports && "undefined" != typeof module && (module.exports = hljs);
hljs.registerLanguage(
    "xml",
    (function () {
        "use strict";
        return function (e) {
            var n = { className: "symbol", begin: "&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;" },
                a = { begin: "\\s", contains: [{ className: "meta-keyword", begin: "#?[a-z_][a-z1-9_-]+", illegal: "\\n" }] },
                s = e.inherit(a, { begin: "\\(", end: "\\)" }),
                t = e.inherit(e.APOS_STRING_MODE, { className: "meta-string" }),
                i = e.inherit(e.QUOTE_STRING_MODE, { className: "meta-string" }),
                c = {
                    endsWithParent: !0,
                    illegal: /</,
                    relevance: 0,
                    contains: [
                        { className: "attr", begin: "[A-Za-z0-9\\._:-]+", relevance: 0 },
                        { begin: /=\s*/, relevance: 0, contains: [{ className: "string", endsParent: !0, variants: [{ begin: /"/, end: /"/, contains: [n] }, { begin: /'/, end: /'/, contains: [n] }, { begin: /[^\s"'=<>`]+/ }] }] },
                    ],
                };
            return {
                name: "HTML, XML",
                aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
                case_insensitive: !0,
                contains: [
                    { className: "meta", begin: "<![a-z]", end: ">", relevance: 10, contains: [a, i, t, s, { begin: "\\[", end: "\\]", contains: [{ className: "meta", begin: "<![a-z]", end: ">", contains: [a, s, i, t] }] }] },
                    e.COMMENT("\x3c!--", "--\x3e", { relevance: 10 }),
                    { begin: "<\\!\\[CDATA\\[", end: "\\]\\]>", relevance: 10 },
                    n,
                    { className: "meta", begin: /<\?xml/, end: /\?>/, relevance: 10 },
                    { className: "tag", begin: "<style(?=\\s|>)", end: ">", keywords: { name: "style" }, contains: [c], starts: { end: "</style>", returnEnd: !0, subLanguage: ["css", "xml"] } },
                    { className: "tag", begin: "<script(?=\\s|>)", end: ">", keywords: { name: "script" }, contains: [c], starts: { end: "</script>", returnEnd: !0, subLanguage: ["javascript", "handlebars", "xml"] } },
                    { className: "tag", begin: "</?", end: "/?>", contains: [{ className: "name", begin: /[^\/><\s]+/, relevance: 0 }, c] },
                ],
            };
        };
    })()
);
hljs.registerLanguage(
    "markdown",
    (function () {
        "use strict";
        return function (n) {
            const e = { begin: "<", end: ">", subLanguage: "xml", relevance: 0 },
                a = {
                    begin: "\\[.+?\\][\\(\\[].*?[\\)\\]]",
                    returnBegin: !0,
                    contains: [
                        { className: "string", begin: "\\[", end: "\\]", excludeBegin: !0, returnEnd: !0, relevance: 0 },
                        { className: "link", begin: "\\]\\(", end: "\\)", excludeBegin: !0, excludeEnd: !0 },
                        { className: "symbol", begin: "\\]\\[", end: "\\]", excludeBegin: !0, excludeEnd: !0 },
                    ],
                    relevance: 10,
                },
                i = {
                    className: "strong",
                    contains: [],
                    variants: [
                        { begin: /_{2}/, end: /_{2}/ },
                        { begin: /\*{2}/, end: /\*{2}/ },
                    ],
                },
                s = {
                    className: "emphasis",
                    contains: [],
                    variants: [
                        { begin: /\*(?!\*)/, end: /\*/ },
                        { begin: /_(?!_)/, end: /_/, relevance: 0 },
                    ],
                };
            i.contains.push(s), s.contains.push(i);
            var c = [e, a];
            return (
                (i.contains = i.contains.concat(c)),
                (s.contains = s.contains.concat(c)),
                {
                    name: "Markdown",
                    aliases: ["md", "mkdown", "mkd"],
                    contains: [
                        {
                            className: "section",
                            variants: [
                                { begin: "^#{1,6}", end: "$", contains: (c = c.concat(i, s)) },
                                { begin: "(?=^.+?\\n[=-]{2,}$)", contains: [{ begin: "^[=-]*$" }, { begin: "^", end: "\\n", contains: c }] },
                            ],
                        },
                        e,
                        { className: "bullet", begin: "^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)", end: "\\s+", excludeEnd: !0 },
                        i,
                        s,
                        { className: "quote", begin: "^>\\s+", contains: c, end: "$" },
                        {
                            className: "code",
                            variants: [
                                { begin: "(`{3,})(.|\\n)*?\\1`*[ ]*" },
                                { begin: "(~{3,})(.|\\n)*?\\1~*[ ]*" },
                                { begin: "```", end: "```+[ ]*$" },
                                { begin: "~~~", end: "~~~+[ ]*$" },
                                { begin: "`.+?`" },
                                { begin: "(?=^( {4}|\\t))", contains: [{ begin: "^( {4}|\\t)", end: "(\\n)$" }], relevance: 0 },
                            ],
                        },
                        { begin: "^[-\\*]{3,}", end: "$" },
                        a,
                        {
                            begin: /^\[[^\n]+\]:/,
                            returnBegin: !0,
                            contains: [
                                { className: "symbol", begin: /\[/, end: /\]/, excludeBegin: !0, excludeEnd: !0 },
                                { className: "link", begin: /:\s*/, end: /$/, excludeBegin: !0 },
                            ],
                        },
                    ],
                }
            );
        };
    })()
);
hljs.registerLanguage(
    "django",
    (function () {
        "use strict";
        return function (e) {
            var t = {
                begin: /\|[A-Za-z]+:?/,
                keywords: {
                    name:
                        "truncatewords removetags linebreaksbr yesno get_digit timesince random striptags filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort dictsortreversed default_if_none pluralize lower join center default truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize localtime utc timezone",
                },
                contains: [e.QUOTE_STRING_MODE, e.APOS_STRING_MODE],
            };
            return {
                name: "Django",
                aliases: ["jinja"],
                case_insensitive: !0,
                subLanguage: "xml",
                contains: [
                    e.COMMENT(/\{%\s*comment\s*%}/, /\{%\s*endcomment\s*%}/),
                    e.COMMENT(/\{#/, /#}/),
                    {
                        className: "template-tag",
                        begin: /\{%/,
                        end: /%}/,
                        contains: [
                            {
                                className: "name",
                                begin: /\w+/,
                                keywords: {
                                    name:
                                        "comment endcomment load templatetag ifchanged endifchanged if endif firstof for endfor ifnotequal endifnotequal widthratio extends include spaceless endspaceless regroup ifequal endifequal ssi now with cycle url filter endfilter debug block endblock else autoescape endautoescape csrf_token empty elif endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix plural get_current_language language get_available_languages get_current_language_bidi get_language_info get_language_info_list localize endlocalize localtime endlocaltime timezone endtimezone get_current_timezone verbatim",
                                },
                                starts: { endsWithParent: !0, keywords: "in by as", contains: [t], relevance: 0 },
                            },
                        ],
                    },
                    { className: "template-variable", begin: /\{\{/, end: /}}/, contains: [t] },
                ],
            };
        };
    })()
);
hljs.registerLanguage(
    "javascript",
    (function () {
        "use strict";
        const e = [
                "as",
                "in",
                "of",
                "if",
                "for",
                "while",
                "finally",
                "var",
                "new",
                "function",
                "do",
                "return",
                "void",
                "else",
                "break",
                "catch",
                "instanceof",
                "with",
                "throw",
                "case",
                "default",
                "try",
                "switch",
                "continue",
                "typeof",
                "delete",
                "let",
                "yield",
                "const",
                "class",
                "debugger",
                "async",
                "await",
                "static",
                "import",
                "from",
                "export",
                "extends",
            ],
            n = ["true", "false", "null", "undefined", "NaN", "Infinity"],
            a = [].concat(
                [
                    "setInterval",
                    "setTimeout",
                    "clearInterval",
                    "clearTimeout",
                    "require",
                    "exports",
                    "eval",
                    "isFinite",
                    "isNaN",
                    "parseFloat",
                    "parseInt",
                    "decodeURI",
                    "decodeURIComponent",
                    "encodeURI",
                    "encodeURIComponent",
                    "escape",
                    "unescape",
                ],
                ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
                [
                    "Intl",
                    "DataView",
                    "Number",
                    "Math",
                    "Date",
                    "String",
                    "RegExp",
                    "Object",
                    "Function",
                    "Boolean",
                    "Error",
                    "Symbol",
                    "Set",
                    "Map",
                    "WeakSet",
                    "WeakMap",
                    "Proxy",
                    "Reflect",
                    "JSON",
                    "Promise",
                    "Float64Array",
                    "Int16Array",
                    "Int32Array",
                    "Int8Array",
                    "Uint16Array",
                    "Uint32Array",
                    "Float32Array",
                    "Array",
                    "Uint8Array",
                    "Uint8ClampedArray",
                    "ArrayBuffer",
                ],
                ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]
            );
        function s(e) {
            return r("(?=", e, ")");
        }
        function r(...e) {
            return e
                .map((e) =>
                    (function (e) {
                        return e ? ("string" == typeof e ? e : e.source) : null;
                    })(e)
                )
                .join("");
        }
        return function (t) {
            var i = "[A-Za-z$_][0-9A-Za-z$_]*",
                c = { begin: /<[A-Za-z0-9\\._:-]+/, end: /\/[A-Za-z0-9\\._:-]+>|\/>/ },
                o = { $pattern: "[A-Za-z$_][0-9A-Za-z$_]*", keyword: e.join(" "), literal: n.join(" "), built_in: a.join(" ") },
                l = { className: "number", variants: [{ begin: "\\b(0[bB][01]+)n?" }, { begin: "\\b(0[oO][0-7]+)n?" }, { begin: t.C_NUMBER_RE + "n?" }], relevance: 0 },
                E = { className: "subst", begin: "\\$\\{", end: "\\}", keywords: o, contains: [] },
                d = { begin: "html`", end: "", starts: { end: "`", returnEnd: !1, contains: [t.BACKSLASH_ESCAPE, E], subLanguage: "xml" } },
                g = { begin: "css`", end: "", starts: { end: "`", returnEnd: !1, contains: [t.BACKSLASH_ESCAPE, E], subLanguage: "css" } },
                u = { className: "string", begin: "`", end: "`", contains: [t.BACKSLASH_ESCAPE, E] };
            E.contains = [t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, d, g, u, l, t.REGEXP_MODE];
            var b = E.contains.concat([{ begin: /\(/, end: /\)/, contains: ["self"].concat(E.contains, [t.C_BLOCK_COMMENT_MODE, t.C_LINE_COMMENT_MODE]) }, t.C_BLOCK_COMMENT_MODE, t.C_LINE_COMMENT_MODE]),
                _ = { className: "params", begin: /\(/, end: /\)/, excludeBegin: !0, excludeEnd: !0, contains: b };
            return {
                name: "JavaScript",
                aliases: ["js", "jsx", "mjs", "cjs"],
                keywords: o,
                contains: [
                    t.SHEBANG({ binary: "node", relevance: 5 }),
                    { className: "meta", relevance: 10, begin: /^\s*['"]use (strict|asm)['"]/ },
                    t.APOS_STRING_MODE,
                    t.QUOTE_STRING_MODE,
                    d,
                    g,
                    u,
                    t.C_LINE_COMMENT_MODE,
                    t.COMMENT("/\\*\\*", "\\*/", {
                        relevance: 0,
                        contains: [
                            {
                                className: "doctag",
                                begin: "@[A-Za-z]+",
                                contains: [
                                    { className: "type", begin: "\\{", end: "\\}", relevance: 0 },
                                    { className: "variable", begin: i + "(?=\\s*(-)|$)", endsParent: !0, relevance: 0 },
                                    { begin: /(?=[^\n])\s/, relevance: 0 },
                                ],
                            },
                        ],
                    }),
                    t.C_BLOCK_COMMENT_MODE,
                    l,
                    { begin: r(/[{,\n]\s*/, s(r(/(((\/\/.*)|(\/\*(.|\n)*\*\/))\s*)*/, i + "\\s*:"))), relevance: 0, contains: [{ className: "attr", begin: i + s("\\s*:"), relevance: 0 }] },
                    {
                        begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                        keywords: "return throw case",
                        contains: [
                            t.C_LINE_COMMENT_MODE,
                            t.C_BLOCK_COMMENT_MODE,
                            t.REGEXP_MODE,
                            {
                                className: "function",
                                begin: "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" + t.UNDERSCORE_IDENT_RE + ")\\s*=>",
                                returnBegin: !0,
                                end: "\\s*=>",
                                contains: [
                                    {
                                        className: "params",
                                        variants: [{ begin: t.UNDERSCORE_IDENT_RE }, { className: null, begin: /\(\s*\)/, skip: !0 }, { begin: /\(/, end: /\)/, excludeBegin: !0, excludeEnd: !0, keywords: o, contains: b }],
                                    },
                                ],
                            },
                            { begin: /,/, relevance: 0 },
                            { className: "", begin: /\s/, end: /\s*/, skip: !0 },
                            {
                                variants: [
                                    { begin: "<>", end: "</>" },
                                    { begin: c.begin, end: c.end },
                                ],
                                subLanguage: "xml",
                                contains: [{ begin: c.begin, end: c.end, skip: !0, contains: ["self"] }],
                            },
                        ],
                        relevance: 0,
                    },
                    { className: "function", beginKeywords: "function", end: /\{/, excludeEnd: !0, contains: [t.inherit(t.TITLE_MODE, { begin: i }), _], illegal: /\[|%/ },
                    { begin: /\$[(.]/ },
                    t.METHOD_GUARD,
                    { className: "class", beginKeywords: "class", end: /[{;=]/, excludeEnd: !0, illegal: /[:"\[\]]/, contains: [{ beginKeywords: "extends" }, t.UNDERSCORE_TITLE_MODE] },
                    { beginKeywords: "constructor", end: /\{/, excludeEnd: !0 },
                    { begin: "(get|set)\\s+(?=" + i + "\\()", end: /{/, keywords: "get set", contains: [t.inherit(t.TITLE_MODE, { begin: i }), { begin: /\(\)/ }, _] },
                ],
                illegal: /#(?!!)/,
            };
        };
    })()
);
hljs.registerLanguage(
    "swift",
    (function () {
        "use strict";
        return function (e) {
            var i = {
                    keyword:
                        "#available #colorLiteral #column #else #elseif #endif #file #fileLiteral #function #if #imageLiteral #line #selector #sourceLocation _ __COLUMN__ __FILE__ __FUNCTION__ __LINE__ Any as as! as? associatedtype associativity break case catch class continue convenience default defer deinit didSet do dynamic dynamicType else enum extension fallthrough false fileprivate final for func get guard if import in indirect infix init inout internal is lazy left let mutating nil none nonmutating open operator optional override postfix precedence prefix private protocol Protocol public repeat required rethrows return right self Self set static struct subscript super switch throw throws true try try! try? Type typealias unowned var weak where while willSet",
                    literal: "true false nil",
                    built_in:
                        "abs advance alignof alignofValue anyGenerator assert assertionFailure bridgeFromObjectiveC bridgeFromObjectiveCUnconditional bridgeToObjectiveC bridgeToObjectiveCUnconditional c compactMap contains count countElements countLeadingZeros debugPrint debugPrintln distance dropFirst dropLast dump encodeBitsAsWords enumerate equal fatalError filter find getBridgedObjectiveCType getVaList indices insertionSort isBridgedToObjectiveC isBridgedVerbatimToObjectiveC isUniquelyReferenced isUniquelyReferencedNonObjC join lazy lexicographicalCompare map max maxElement min minElement numericCast overlaps partition posix precondition preconditionFailure print println quickSort readLine reduce reflect reinterpretCast reverse roundUpToAlignment sizeof sizeofValue sort split startsWith stride strideof strideofValue swap toString transcode underestimateCount unsafeAddressOf unsafeBitCast unsafeDowncast unsafeUnwrap unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer withUnsafePointerToObject withUnsafeMutablePointer withUnsafeMutablePointers withUnsafePointer withUnsafePointers withVaList zip",
                },
                n = e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
                t = { className: "subst", begin: /\\\(/, end: "\\)", keywords: i, contains: [] },
                a = {
                    className: "string",
                    contains: [e.BACKSLASH_ESCAPE, t],
                    variants: [
                        { begin: /"""/, end: /"""/ },
                        { begin: /"/, end: /"/ },
                    ],
                },
                r = { className: "number", begin: "\\b([\\d_]+(\\.[\\deE_]+)?|0x[a-fA-F0-9_]+(\\.[a-fA-F0-9p_]+)?|0b[01_]+|0o[0-7_]+)\\b", relevance: 0 };
            return (
                (t.contains = [r]),
                {
                    name: "Swift",
                    keywords: i,
                    contains: [
                        a,
                        e.C_LINE_COMMENT_MODE,
                        n,
                        { className: "type", begin: "\\b[A-Z][\\wÀ-ʸ']*[!?]" },
                        { className: "type", begin: "\\b[A-Z][\\wÀ-ʸ']*", relevance: 0 },
                        r,
                        {
                            className: "function",
                            beginKeywords: "func",
                            end: "{",
                            excludeEnd: !0,
                            contains: [
                                e.inherit(e.TITLE_MODE, { begin: /[A-Za-z$_][0-9A-Za-z$_]*/ }),
                                { begin: /</, end: />/ },
                                { className: "params", begin: /\(/, end: /\)/, endsParent: !0, keywords: i, contains: ["self", r, a, e.C_BLOCK_COMMENT_MODE, { begin: ":" }], illegal: /["']/ },
                            ],
                            illegal: /\[|%/,
                        },
                        { className: "class", beginKeywords: "struct protocol class extension enum", keywords: i, end: "\\{", excludeEnd: !0, contains: [e.inherit(e.TITLE_MODE, { begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/ })] },
                        {
                            className: "meta",
                            begin:
                                "(@discardableResult|@warn_unused_result|@exported|@lazy|@noescape|@NSCopying|@NSManaged|@objc|@objcMembers|@convention|@required|@noreturn|@IBAction|@IBDesignable|@IBInspectable|@IBOutlet|@infix|@prefix|@postfix|@autoclosure|@testable|@available|@nonobjc|@NSApplicationMain|@UIApplicationMain|@dynamicMemberLookup|@propertyWrapper)\\b",
                        },
                        { beginKeywords: "import", end: /$/, contains: [e.C_LINE_COMMENT_MODE, n] },
                    ],
                }
            );
        };
    })()
);
hljs.registerLanguage(
    "ini",
    (function () {
        "use strict";
        function e(e) {
            return e ? ("string" == typeof e ? e : e.source) : null;
        }
        function n(...n) {
            return n.map((n) => e(n)).join("");
        }
        return function (a) {
            var s = { className: "number", relevance: 0, variants: [{ begin: /([\+\-]+)?[\d]+_[\d_]+/ }, { begin: a.NUMBER_RE }] },
                i = a.COMMENT();
            i.variants = [
                { begin: /;/, end: /$/ },
                { begin: /#/, end: /$/ },
            ];
            var t = { className: "variable", variants: [{ begin: /\$[\w\d"][\w\d_]*/ }, { begin: /\$\{(.*?)}/ }] },
                r = { className: "literal", begin: /\bon|off|true|false|yes|no\b/ },
                l = {
                    className: "string",
                    contains: [a.BACKSLASH_ESCAPE],
                    variants: [
                        { begin: "'''", end: "'''", relevance: 10 },
                        { begin: '"""', end: '"""', relevance: 10 },
                        { begin: '"', end: '"' },
                        { begin: "'", end: "'" },
                    ],
                },
                c = { begin: /\[/, end: /\]/, contains: [i, r, t, l, s, "self"], relevance: 0 },
                g = "(" + [/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/].map((n) => e(n)).join("|") + ")";
            return {
                name: "TOML, also INI",
                aliases: ["toml"],
                case_insensitive: !0,
                illegal: /\S/,
                contains: [i, { className: "section", begin: /\[+/, end: /\]+/ }, { begin: n(g, "(\\s*\\.\\s*", g, ")*", n("(?=", /\s*=\s*[^#\s]/, ")")), className: "attr", starts: { end: /$/, contains: [i, c, r, t, l, s] } }],
            };
        };
    })()
);
hljs.registerLanguage(
    "http",
    (function () {
        "use strict";
        return function (e) {
            var n = "HTTP/[0-9\\.]+";
            return {
                name: "HTTP",
                aliases: ["https"],
                illegal: "\\S",
                contains: [
                    { begin: "^" + n, end: "$", contains: [{ className: "number", begin: "\\b\\d{3}\\b" }] },
                    { begin: "^[A-Z]+ (.*?) " + n + "$", returnBegin: !0, end: "$", contains: [{ className: "string", begin: " ", end: " ", excludeBegin: !0, excludeEnd: !0 }, { begin: n }, { className: "keyword", begin: "[A-Z]+" }] },
                    { className: "attribute", begin: "^\\w", end: ": ", excludeEnd: !0, illegal: "\\n|\\s|=", starts: { end: "$", relevance: 0 } },
                    { begin: "\\n\\n", starts: { subLanguage: [], endsWithParent: !0 } },
                ],
            };
        };
    })()
);
hljs.registerLanguage(
    "json",
    (function () {
        "use strict";
        return function (n) {
            var e = { literal: "true false null" },
                i = [n.C_LINE_COMMENT_MODE, n.C_BLOCK_COMMENT_MODE],
                t = [n.QUOTE_STRING_MODE, n.C_NUMBER_MODE],
                a = { end: ",", endsWithParent: !0, excludeEnd: !0, contains: t, keywords: e },
                l = { begin: "{", end: "}", contains: [{ className: "attr", begin: /"/, end: /"/, contains: [n.BACKSLASH_ESCAPE], illegal: "\\n" }, n.inherit(a, { begin: /:/ })].concat(i), illegal: "\\S" },
                s = { begin: "\\[", end: "\\]", contains: [n.inherit(a)], illegal: "\\S" };
            return (
                t.push(l, s),
                i.forEach(function (n) {
                    t.push(n);
                }),
                { name: "JSON", contains: t, keywords: e, illegal: "\\S" }
            );
        };
    })()
);
hljs.registerLanguage(
    "r",
    (function () {
        "use strict";
        return function (e) {
            var n = "([a-zA-Z]|\\.[a-zA-Z.])[a-zA-Z0-9._]*";
            return {
                name: "R",
                contains: [
                    e.HASH_COMMENT_MODE,
                    {
                        begin: n,
                        keywords: {
                            $pattern: n,
                            keyword: "function if in break next repeat else for return switch while try tryCatch stop warning require library attach detach setMethod setGeneric setGroupGeneric setClass ... install_github group_by describe_data add_stats write_stats read_stats tidy_stats t.test lm",
                            literal: "NULL NA TRUE FALSE T F Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
                        },
                        relevance: 0,
                    },
                    { className: "number", begin: "0[xX][0-9a-fA-F]+[Li]?\\b", relevance: 0 },
                    { className: "number", begin: "\\d+(?:[eE][+\\-]?\\d*)?L\\b", relevance: 0 },
                    { className: "number", begin: "\\d+\\.(?!\\d)(?:i\\b)?", relevance: 0 },
                    { className: "number", begin: "\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d*)?i?\\b", relevance: 0 },
                    { className: "number", begin: "\\.\\d+(?:[eE][+\\-]?\\d*)?i?\\b", relevance: 0 },
                    { begin: "`", end: "`", relevance: 0 },
                    {
                        className: "string",
                        contains: [e.BACKSLASH_ESCAPE],
                        variants: [
                            { begin: '"', end: '"' },
                            { begin: "'", end: "'" },
                        ],
                    },
                ],
            };
        };
    })()
);
hljs.registerLanguage(
    "ruby",
    (function () {
        "use strict";
        return function (e) {
            var n = "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?",
                a = {
                    keyword:
                        "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor",
                    literal: "true false nil",
                },
                s = { className: "doctag", begin: "@[A-Za-z]+" },
                i = { begin: "#<", end: ">" },
                r = [e.COMMENT("#", "$", { contains: [s] }), e.COMMENT("^\\=begin", "^\\=end", { contains: [s], relevance: 10 }), e.COMMENT("^__END__", "\\n$")],
                c = { className: "subst", begin: "#\\{", end: "}", keywords: a },
                t = {
                    className: "string",
                    contains: [e.BACKSLASH_ESCAPE, c],
                    variants: [
                        { begin: /'/, end: /'/ },
                        { begin: /"/, end: /"/ },
                        { begin: /`/, end: /`/ },
                        { begin: "%[qQwWx]?\\(", end: "\\)" },
                        { begin: "%[qQwWx]?\\[", end: "\\]" },
                        { begin: "%[qQwWx]?{", end: "}" },
                        { begin: "%[qQwWx]?<", end: ">" },
                        { begin: "%[qQwWx]?/", end: "/" },
                        { begin: "%[qQwWx]?%", end: "%" },
                        { begin: "%[qQwWx]?-", end: "-" },
                        { begin: "%[qQwWx]?\\|", end: "\\|" },
                        { begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/ },
                        { begin: /<<[-~]?'?(\w+)(?:.|\n)*?\n\s*\1\b/, returnBegin: !0, contains: [{ begin: /<<[-~]?'?/ }, e.END_SAME_AS_BEGIN({ begin: /(\w+)/, end: /(\w+)/, contains: [e.BACKSLASH_ESCAPE, c] })] },
                    ],
                },
                b = { className: "params", begin: "\\(", end: "\\)", endsParent: !0, keywords: a },
                d = [
                    t,
                    i,
                    {
                        className: "class",
                        beginKeywords: "class module",
                        end: "$|;",
                        illegal: /=/,
                        contains: [e.inherit(e.TITLE_MODE, { begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?" }), { begin: "<\\s*", contains: [{ begin: "(" + e.IDENT_RE + "::)?" + e.IDENT_RE }] }].concat(r),
                    },
                    { className: "function", beginKeywords: "def", end: "$|;", contains: [e.inherit(e.TITLE_MODE, { begin: n }), b].concat(r) },
                    { begin: e.IDENT_RE + "::" },
                    { className: "symbol", begin: e.UNDERSCORE_IDENT_RE + "(\\!|\\?)?:", relevance: 0 },
                    { className: "symbol", begin: ":(?!\\s)", contains: [t, { begin: n }], relevance: 0 },
                    { className: "number", begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b", relevance: 0 },
                    { begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))" },
                    { className: "params", begin: /\|/, end: /\|/, keywords: a },
                    {
                        begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
                        keywords: "unless",
                        contains: [
                            i,
                            {
                                className: "regexp",
                                contains: [e.BACKSLASH_ESCAPE, c],
                                illegal: /\n/,
                                variants: [
                                    { begin: "/", end: "/[a-z]*" },
                                    { begin: "%r{", end: "}[a-z]*" },
                                    { begin: "%r\\(", end: "\\)[a-z]*" },
                                    { begin: "%r!", end: "![a-z]*" },
                                    { begin: "%r\\[", end: "\\][a-z]*" },
                                ],
                            },
                        ].concat(r),
                        relevance: 0,
                    },
                ].concat(r);
            (c.contains = d), (b.contains = d);
            var g = [
                { begin: /^\s*=>/, starts: { end: "$", contains: d } },
                { className: "meta", begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>)", starts: { end: "$", contains: d } },
            ];
            return { name: "Ruby", aliases: ["rb", "gemspec", "podspec", "thor", "irb"], keywords: a, illegal: /\/\*/, contains: r.concat(g).concat(d) };
        };
    })()
);
hljs.registerLanguage(
    "yaml",
    (function () {
        "use strict";
        return function (e) {
            var n = "true false yes no null",
                a = "[\\w#;/?:@&=+$,.~*\\'()[\\]]+",
                s = {
                    className: "string",
                    relevance: 0,
                    variants: [{ begin: /'/, end: /'/ }, { begin: /"/, end: /"/ }, { begin: /\S+/ }],
                    contains: [
                        e.BACKSLASH_ESCAPE,
                        {
                            className: "template-variable",
                            variants: [
                                { begin: "{{", end: "}}" },
                                { begin: "%{", end: "}" },
                            ],
                        },
                    ],
                },
                i = e.inherit(s, { variants: [{ begin: /'/, end: /'/ }, { begin: /"/, end: /"/ }, { begin: /[^\s,{}[\]]+/ }] }),
                l = { end: ",", endsWithParent: !0, excludeEnd: !0, contains: [], keywords: n, relevance: 0 },
                t = { begin: "{", end: "}", contains: [l], illegal: "\\n", relevance: 0 },
                g = { begin: "\\[", end: "\\]", contains: [l], illegal: "\\n", relevance: 0 },
                b = [
                    { className: "attr", variants: [{ begin: "\\w[\\w :\\/.-]*:(?=[ \t]|$)" }, { begin: '"\\w[\\w :\\/.-]*":(?=[ \t]|$)' }, { begin: "'\\w[\\w :\\/.-]*':(?=[ \t]|$)" }] },
                    { className: "meta", begin: "^---s*$", relevance: 10 },
                    { className: "string", begin: "[\\|>]([0-9]?[+-])?[ ]*\\n( *)[\\S ]+\\n(\\2[\\S ]+\\n?)*" },
                    { begin: "<%[%=-]?", end: "[%-]?%>", subLanguage: "ruby", excludeBegin: !0, excludeEnd: !0, relevance: 0 },
                    { className: "type", begin: "!\\w+!" + a },
                    { className: "type", begin: "!<" + a + ">" },
                    { className: "type", begin: "!" + a },
                    { className: "type", begin: "!!" + a },
                    { className: "meta", begin: "&" + e.UNDERSCORE_IDENT_RE + "$" },
                    { className: "meta", begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$" },
                    { className: "bullet", begin: "\\-(?=[ ]|$)", relevance: 0 },
                    e.HASH_COMMENT_MODE,
                    { beginKeywords: n, keywords: { literal: n } },
                    { className: "number", begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b" },
                    { className: "number", begin: e.C_NUMBER_RE + "\\b" },
                    t,
                    g,
                    s,
                ],
                c = [...b];
            return c.pop(), c.push(i), (l.contains = c), { name: "YAML", case_insensitive: !0, aliases: ["yml", "YAML"], contains: b };
        };
    })()
);
hljs.registerLanguage(
    "makefile",
    (function () {
        "use strict";
        return function (e) {
            var i = { className: "variable", variants: [{ begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)", contains: [e.BACKSLASH_ESCAPE] }, { begin: /\$[@%<?\^\+\*]/ }] },
                n = { className: "string", begin: /"/, end: /"/, contains: [e.BACKSLASH_ESCAPE, i] },
                a = {
                    className: "variable",
                    begin: /\$\([\w-]+\s/,
                    end: /\)/,
                    keywords: {
                        built_in:
                            "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value",
                    },
                    contains: [i],
                },
                r = { begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)" },
                s = { className: "section", begin: /^[^\s]+:/, end: /$/, contains: [i] };
            return {
                name: "Makefile",
                aliases: ["mk", "mak"],
                keywords: { $pattern: /[\w-]+/, keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath" },
                contains: [e.HASH_COMMENT_MODE, i, n, a, r, { className: "meta", begin: /^\.PHONY:/, end: /$/, keywords: { $pattern: /[\.\w]+/, "meta-keyword": ".PHONY" } }, s],
            };
        };
    })()
);
hljs.registerLanguage(
    "css",
    (function () {
        "use strict";
        return function (e) {
            var n = {
                begin: /(?:[A-Z\_\.\-]+|--[a-zA-Z0-9_-]+)\s*:/,
                returnBegin: !0,
                end: ";",
                endsWithParent: !0,
                contains: [
                    {
                        className: "attribute",
                        begin: /\S/,
                        end: ":",
                        excludeEnd: !0,
                        starts: {
                            endsWithParent: !0,
                            excludeEnd: !0,
                            contains: [
                                {
                                    begin: /[\w-]+\(/,
                                    returnBegin: !0,
                                    contains: [
                                        { className: "built_in", begin: /[\w-]+/ },
                                        { begin: /\(/, end: /\)/, contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.CSS_NUMBER_MODE] },
                                    ],
                                },
                                e.CSS_NUMBER_MODE,
                                e.QUOTE_STRING_MODE,
                                e.APOS_STRING_MODE,
                                e.C_BLOCK_COMMENT_MODE,
                                { className: "number", begin: "#[0-9A-Fa-f]+" },
                                { className: "meta", begin: "!important" },
                            ],
                        },
                    },
                ],
            };
            return {
                name: "CSS",
                case_insensitive: !0,
                illegal: /[=\/|'\$]/,
                contains: [
                    e.C_BLOCK_COMMENT_MODE,
                    { className: "selector-id", begin: /#[A-Za-z0-9_-]+/ },
                    { className: "selector-class", begin: /\.[A-Za-z0-9_-]+/ },
                    { className: "selector-attr", begin: /\[/, end: /\]/, illegal: "$", contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE] },
                    { className: "selector-pseudo", begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/ },
                    { begin: "@(page|font-face)", lexemes: "@[a-z-]+", keywords: "@page @font-face" },
                    {
                        begin: "@",
                        end: "[{;]",
                        illegal: /:/,
                        returnBegin: !0,
                        contains: [
                            { className: "keyword", begin: /@\-?\w[\w]*(\-\w+)*/ },
                            {
                                begin: /\s/,
                                endsWithParent: !0,
                                excludeEnd: !0,
                                relevance: 0,
                                keywords: "and or not only",
                                contains: [{ begin: /[a-z-]+:/, className: "attribute" }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.CSS_NUMBER_MODE],
                            },
                        ],
                    },
                    { className: "selector-tag", begin: "[a-zA-Z-][a-zA-Z0-9_-]*", relevance: 0 },
                    { begin: "{", end: "}", illegal: /\S/, contains: [e.C_BLOCK_COMMENT_MODE, n] },
                ],
            };
        };
    })()
);
hljs.registerLanguage(
    "python",
    (function () {
        "use strict";
        return function (e) {
            var n = {
                    keyword: "and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda async await nonlocal|10",
                    built_in: "Ellipsis NotImplemented",
                    literal: "False None True",
                },
                a = { className: "meta", begin: /^(>>>|\.\.\.) / },
                i = { className: "subst", begin: /\{/, end: /\}/, keywords: n, illegal: /#/ },
                s = { begin: /\{\{/, relevance: 0 },
                r = {
                    className: "string",
                    contains: [e.BACKSLASH_ESCAPE],
                    variants: [
                        { begin: /(u|b)?r?'''/, end: /'''/, contains: [e.BACKSLASH_ESCAPE, a], relevance: 10 },
                        { begin: /(u|b)?r?"""/, end: /"""/, contains: [e.BACKSLASH_ESCAPE, a], relevance: 10 },
                        { begin: /(fr|rf|f)'''/, end: /'''/, contains: [e.BACKSLASH_ESCAPE, a, s, i] },
                        { begin: /(fr|rf|f)"""/, end: /"""/, contains: [e.BACKSLASH_ESCAPE, a, s, i] },
                        { begin: /(u|r|ur)'/, end: /'/, relevance: 10 },
                        { begin: /(u|r|ur)"/, end: /"/, relevance: 10 },
                        { begin: /(b|br)'/, end: /'/ },
                        { begin: /(b|br)"/, end: /"/ },
                        { begin: /(fr|rf|f)'/, end: /'/, contains: [e.BACKSLASH_ESCAPE, s, i] },
                        { begin: /(fr|rf|f)"/, end: /"/, contains: [e.BACKSLASH_ESCAPE, s, i] },
                        e.APOS_STRING_MODE,
                        e.QUOTE_STRING_MODE,
                    ],
                },
                l = { className: "number", relevance: 0, variants: [{ begin: e.BINARY_NUMBER_RE + "[lLjJ]?" }, { begin: "\\b(0o[0-7]+)[lLjJ]?" }, { begin: e.C_NUMBER_RE + "[lLjJ]?" }] },
                t = {
                    className: "params",
                    variants: [
                        { begin: /\(\s*\)/, skip: !0, className: null },
                        { begin: /\(/, end: /\)/, excludeBegin: !0, excludeEnd: !0, contains: ["self", a, l, r, e.HASH_COMMENT_MODE] },
                    ],
                };
            return (
                (i.contains = [r, l, a]),
                {
                    name: "Python",
                    aliases: ["py", "gyp", "ipython"],
                    keywords: n,
                    illegal: /(<\/|->|\?)|=>/,
                    contains: [
                        a,
                        l,
                        { beginKeywords: "if", relevance: 0 },
                        r,
                        e.HASH_COMMENT_MODE,
                        {
                            variants: [
                                { className: "function", beginKeywords: "def" },
                                { className: "class", beginKeywords: "class" },
                            ],
                            end: /:/,
                            illegal: /[${=;\n,]/,
                            contains: [e.UNDERSCORE_TITLE_MODE, t, { begin: /->/, endsWithParent: !0, keywords: "None" }],
                        },
                        { className: "meta", begin: /^[\t ]*@/, end: /$/ },
                        { begin: /\b(print|exec)\(/ },
                    ],
                }
            );
        };
    })()
);
hljs.registerLanguage(
    "stan",
    (function () {
        "use strict";
        return function (_) {
            return {
                name: "Stan",
                aliases: ["stanfuncs"],
                keywords: {
                    $pattern: _.IDENT_RE,
                    title: "functions model data parameters quantities transformed generated",
                    keyword: ["for", "in", "if", "else", "while", "break", "continue", "return"]
                        .concat(["int", "real", "vector", "ordered", "positive_ordered", "simplex", "unit_vector", "row_vector", "matrix", "cholesky_factor_corr|10", "cholesky_factor_cov|10", "corr_matrix|10", "cov_matrix|10", "void"])
                        .concat(["print", "reject", "increment_log_prob|10", "integrate_ode|10", "integrate_ode_rk45|10", "integrate_ode_bdf|10", "algebra_solver"])
                        .join(" "),
                    built_in:
                        "Phi Phi_approx abs acos acosh algebra_solver append_array append_col append_row asin asinh atan atan2 atanh bernoulli_cdf bernoulli_lccdf bernoulli_lcdf bernoulli_logit_lpmf bernoulli_logit_rng bernoulli_lpmf bernoulli_rng bessel_first_kind bessel_second_kind beta_binomial_cdf beta_binomial_lccdf beta_binomial_lcdf beta_binomial_lpmf beta_binomial_rng beta_cdf beta_lccdf beta_lcdf beta_lpdf beta_rng binary_log_loss binomial_cdf binomial_coefficient_log binomial_lccdf binomial_lcdf binomial_logit_lpmf binomial_lpmf binomial_rng block categorical_logit_lpmf categorical_logit_rng categorical_lpmf categorical_rng cauchy_cdf cauchy_lccdf cauchy_lcdf cauchy_lpdf cauchy_rng cbrt ceil chi_square_cdf chi_square_lccdf chi_square_lcdf chi_square_lpdf chi_square_rng cholesky_decompose choose col cols columns_dot_product columns_dot_self cos cosh cov_exp_quad crossprod csr_extract_u csr_extract_v csr_extract_w csr_matrix_times_vector csr_to_dense_matrix cumulative_sum determinant diag_matrix diag_post_multiply diag_pre_multiply diagonal digamma dims dirichlet_lpdf dirichlet_rng distance dot_product dot_self double_exponential_cdf double_exponential_lccdf double_exponential_lcdf double_exponential_lpdf double_exponential_rng e eigenvalues_sym eigenvectors_sym erf erfc exp exp2 exp_mod_normal_cdf exp_mod_normal_lccdf exp_mod_normal_lcdf exp_mod_normal_lpdf exp_mod_normal_rng expm1 exponential_cdf exponential_lccdf exponential_lcdf exponential_lpdf exponential_rng fabs falling_factorial fdim floor fma fmax fmin fmod frechet_cdf frechet_lccdf frechet_lcdf frechet_lpdf frechet_rng gamma_cdf gamma_lccdf gamma_lcdf gamma_lpdf gamma_p gamma_q gamma_rng gaussian_dlm_obs_lpdf get_lp gumbel_cdf gumbel_lccdf gumbel_lcdf gumbel_lpdf gumbel_rng head hypergeometric_lpmf hypergeometric_rng hypot inc_beta int_step integrate_ode integrate_ode_bdf integrate_ode_rk45 inv inv_Phi inv_chi_square_cdf inv_chi_square_lccdf inv_chi_square_lcdf inv_chi_square_lpdf inv_chi_square_rng inv_cloglog inv_gamma_cdf inv_gamma_lccdf inv_gamma_lcdf inv_gamma_lpdf inv_gamma_rng inv_logit inv_sqrt inv_square inv_wishart_lpdf inv_wishart_rng inverse inverse_spd is_inf is_nan lbeta lchoose lgamma lkj_corr_cholesky_lpdf lkj_corr_cholesky_rng lkj_corr_lpdf lkj_corr_rng lmgamma lmultiply log log10 log1m log1m_exp log1m_inv_logit log1p log1p_exp log2 log_determinant log_diff_exp log_falling_factorial log_inv_logit log_mix log_rising_factorial log_softmax log_sum_exp logistic_cdf logistic_lccdf logistic_lcdf logistic_lpdf logistic_rng logit lognormal_cdf lognormal_lccdf lognormal_lcdf lognormal_lpdf lognormal_rng machine_precision matrix_exp max mdivide_left_spd mdivide_left_tri_low mdivide_right_spd mdivide_right_tri_low mean min modified_bessel_first_kind modified_bessel_second_kind multi_gp_cholesky_lpdf multi_gp_lpdf multi_normal_cholesky_lpdf multi_normal_cholesky_rng multi_normal_lpdf multi_normal_prec_lpdf multi_normal_rng multi_student_t_lpdf multi_student_t_rng multinomial_lpmf multinomial_rng multiply_log multiply_lower_tri_self_transpose neg_binomial_2_cdf neg_binomial_2_lccdf neg_binomial_2_lcdf neg_binomial_2_log_lpmf neg_binomial_2_log_rng neg_binomial_2_lpmf neg_binomial_2_rng neg_binomial_cdf neg_binomial_lccdf neg_binomial_lcdf neg_binomial_lpmf neg_binomial_rng negative_infinity normal_cdf normal_lccdf normal_lcdf normal_lpdf normal_rng not_a_number num_elements ordered_logistic_lpmf ordered_logistic_rng owens_t pareto_cdf pareto_lccdf pareto_lcdf pareto_lpdf pareto_rng pareto_type_2_cdf pareto_type_2_lccdf pareto_type_2_lcdf pareto_type_2_lpdf pareto_type_2_rng pi poisson_cdf poisson_lccdf poisson_lcdf poisson_log_lpmf poisson_log_rng poisson_lpmf poisson_rng positive_infinity pow print prod qr_Q qr_R quad_form quad_form_diag quad_form_sym rank rayleigh_cdf rayleigh_lccdf rayleigh_lcdf rayleigh_lpdf rayleigh_rng reject rep_array rep_matrix rep_row_vector rep_vector rising_factorial round row rows rows_dot_product rows_dot_self scaled_inv_chi_square_cdf scaled_inv_chi_square_lccdf scaled_inv_chi_square_lcdf scaled_inv_chi_square_lpdf scaled_inv_chi_square_rng sd segment sin singular_values sinh size skew_normal_cdf skew_normal_lccdf skew_normal_lcdf skew_normal_lpdf skew_normal_rng softmax sort_asc sort_desc sort_indices_asc sort_indices_desc sqrt sqrt2 square squared_distance step student_t_cdf student_t_lccdf student_t_lcdf student_t_lpdf student_t_rng sub_col sub_row sum tail tan tanh target tcrossprod tgamma to_array_1d to_array_2d to_matrix to_row_vector to_vector trace trace_gen_quad_form trace_quad_form trigamma trunc uniform_cdf uniform_lccdf uniform_lcdf uniform_lpdf uniform_rng variance von_mises_lpdf von_mises_rng weibull_cdf weibull_lccdf weibull_lcdf weibull_lpdf weibull_rng wiener_lpdf wishart_lpdf wishart_rng",
                },
                contains: [
                    _.C_LINE_COMMENT_MODE,
                    _.COMMENT(/#/, /$/, { relevance: 0, keywords: { "meta-keyword": "include" } }),
                    _.COMMENT(/\/\*/, /\*\//, { relevance: 0, contains: [{ className: "doctag", begin: /@(return|param)/ }] }),
                    { begin: /<\s*lower\s*=/, keywords: "lower" },
                    { begin: /[<,]\s*upper\s*=/, keywords: "upper" },
                    { className: "keyword", begin: /\btarget\s*\+=/, relevance: 10 },
                    {
                        begin: "~\\s*(" + _.IDENT_RE + ")\\s*\\(",
                        keywords:
                            "bernoulli bernoulli_logit beta beta_binomial binomial binomial_logit categorical categorical_logit cauchy chi_square dirichlet double_exponential exp_mod_normal exponential frechet gamma gaussian_dlm_obs gumbel hypergeometric inv_chi_square inv_gamma inv_wishart lkj_corr lkj_corr_cholesky logistic lognormal multi_gp multi_gp_cholesky multi_normal multi_normal_cholesky multi_normal_prec multi_student_t multinomial neg_binomial neg_binomial_2 neg_binomial_2_log normal ordered_logistic pareto pareto_type_2 poisson poisson_log rayleigh scaled_inv_chi_square skew_normal student_t uniform von_mises weibull wiener wishart",
                    },
                    { className: "number", variants: [{ begin: /\b\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/ }, { begin: /\.\d+(?:[eE][+-]?\d+)?\b/ }], relevance: 0 },
                    { className: "string", begin: '"', end: '"', relevance: 0 },
                ],
            };
        };
    })()
);

