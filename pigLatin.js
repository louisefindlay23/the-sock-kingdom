(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw ((a.code = "MODULE_NOT_FOUND"), a);
                }
                var p = (n[i] = { exports: {} });
                e[i][0].call(
                    p.exports,
                    function (r) {
                        var n = e[i][1][r];
                        return o(n || r);
                    },
                    p,
                    p.exports,
                    r,
                    e,
                    n,
                    t
                );
            }
            return n[i].exports;
        }
        for (
            var u = "function" == typeof require && require, i = 0;
            i < t.length;
            i++
        )
            o(t[i]);
        return o;
    }
    return r;
})()(
    {
        1: [
            function (require, module, exports) {
                // Pig Latin Translator
                const PigLatin = require("pig-latinizer").default;
                const pigLatin = new PigLatin();

                function translate(text) {
                    console.info(pigLatin.translate("Hi people"));
                }
            },
            { "pig-latinizer": 2 },
        ],
        2: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });

                /**
                 * Translates English to Pig Latin.
                 */
                var PigLatin = /** @class */ (function () {
                    function PigLatin() {
                        /** Words which should be excluded from translation. Case-sensitive. */
                        this.exclusions = [];
                    }

                    /**
                     * Translates an English string, containing an arbitrary amount of text, to Pig Latin.
                     * Punctuation and whitespace are preserved, including blank lines.
                     *
                     * @param english The English string to translate.
                     */
                    PigLatin.prototype.translate = function (english) {
                        if (!english) {
                            return english;
                        }

                        return this._split(english)
                            .map(this._translateOne.bind(this))
                            .join("");
                    };

                    /**
                     * Translates a single fragment (word or separator) to Pig Latin.
                     * @param fragment The word to translate or ignore, or separator to ignore.
                     */
                    PigLatin.prototype._translateOne = function (fragment) {
                        // split into leading/trailing punctuation and the word itself;
                        // part 1 = punctuation, or empty string
                        // part 2 = the word up to any single apostrophe (if present)
                        // part 3 = apostrophe & word characters following it, or empty string
                        // part 4 = punctuation (including apostrophe if no word characters follow it), or empty string
                        var parts =
                            /^([\W_]*)([^\W_]+)(['\u2019\u02bc][^\W_]+|)([\W_]*)$/.exec(
                                fragment
                            );

                        if (!parts) {
                            return fragment; // we can't translate this non-word (it may be a separator)
                        }

                        var word = parts[2] + parts[3].substring(1);

                        if (this.exclusions.indexOf(word) !== -1) {
                            return fragment;
                        }

                        if (/[0-9]/.test(word)) {
                            return fragment; // don't translate words which contain a digit
                        }

                        var isAllCaps =
                            word === word.toUpperCase() && word.length > 1;
                        var firstLetterUpped = word[0].toUpperCase();

                        if ("AEIOU".indexOf(firstLetterUpped) !== -1) {
                            // begins with vowel; append "yay", but without doubling up a trailing "y"
                            var lastChar = word[word.length - 1];
                            var append =
                                lastChar === "y" || lastChar === "Y"
                                    ? "ay"
                                    : "yay";
                            word += isAllCaps ? append.toUpperCase() : append;
                        } else {
                            // begins with a consonant; find the first vowel (including "y", except at the start of the word)
                            var firstVowelPos = this._indexOfFirstVowel(word);

                            if (firstVowelPos !== -1) {
                                // (don't translate a word without vowels; maybe it's an acronym?)
                                // move leading consonants to the end, hyphenating if we're doubling them up, and append "ay"
                                var isCapitalized =
                                    !isAllCaps && word[0] === firstLetterUpped;
                                var consonants = word.substring(
                                    0,
                                    firstVowelPos
                                );

                                if (isCapitalized) {
                                    consonants = consonants.toLowerCase();
                                }

                                var consonantsRepeated =
                                    word
                                        .substr(-consonants.length)
                                        .toUpperCase() ===
                                    consonants.toUpperCase();
                                var firstConsonantRepeated =
                                    word.substr(-1).toUpperCase() ===
                                    consonants[0].toUpperCase();
                                var hyphen =
                                    consonantsRepeated || firstConsonantRepeated
                                        ? "-"
                                        : "";
                                word =
                                    word.substring(consonants.length) +
                                    hyphen +
                                    consonants +
                                    (isAllCaps ? "AY" : "ay");

                                if (isCapitalized) {
                                    word =
                                        word[0].toUpperCase() +
                                        word.substring(1);
                                }
                            }
                        }

                        return parts[1] + word + parts[4]; // restore any leading and/or trailing punctuation
                    };

                    /**
                     * Splits a string into an array of fragments, i.e. alternating words and separators.
                     * @param str The string to split.
                     */
                    PigLatin.prototype._split = function (str) {
                        // word separator = any whitespace, slash, underscore, Unicode dashes, regular dash
                        var re = /[\s/_\u2010-\u2015-]+/gm;
                        var fragments = [];
                        var lastLastIndex = 0;

                        while (true) {
                            var result = re.exec(str);

                            if (result === null) {
                                // no more separators, but there might be one more word

                                if (str && str.length > lastLastIndex) {
                                    fragments.push(
                                        str.substring(lastLastIndex)
                                    );
                                }
                                break;
                            }

                            var word = str.substring(
                                lastLastIndex,
                                result.index
                            );
                            fragments.push(word);
                            var separator = str.substring(
                                result.index,
                                re.lastIndex
                            );
                            fragments.push(separator);
                            lastLastIndex = re.lastIndex;
                        }

                        return fragments;
                    };

                    /**
                     * Gets the index of the first vowel in the given word, or -1 if it contains no vowels.
                     * @param word The word in which to find a vowel.
                     */
                    PigLatin.prototype._indexOfFirstVowel = function (word) {
                        // split off any leading Ys (result[1]), then search whatever's left, if anything (result[2]), for the first vowel
                        var result = /(y*)(.*)/i.exec(word);
                        var index = result[2].search(/[aeiouy]/i);
                        return index === -1 ? -1 : result[1].length + index;
                    };

                    return PigLatin;
                })();

                exports.default = PigLatin;
            },
            {},
        ],
    },
    {},
    [1]
);
