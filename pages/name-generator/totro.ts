// @source: https://dwheeler.com/totro.html

// @licstart  The following is the entire license notice for the Javascript code in this page.
// The Javascript code in this page is free software: you can
// redistribute it and/or modify it under the terms of the GNU
// General Public License (GNU GPL) as published by the Free Software
// Foundation, either version 3 of the License, or (at your option)
// any later version.  The code is distributed WITHOUT ANY WARRANTY;
// without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

// As additional permission under GNU GPL version 3 section 7, you
// may distribute non-source (e.g., minimized or compacted) forms of
// that code without the copy of the GNU GPL normally required by
// section 4, provided you include this license notice and a URL
// through which recipients can access the Corresponding Source.
// @licend  The above is the entire license notice for the Javascript code in this page.


// List of possible vowels, followed by list of possible consonants.
// In both lists, duplicates increase the likelihood of that selection.
// The second parameter indicates if the syllable can occur
// at the beginning, middle, or ending of a name, and is the sum of
// the following:
//  1=can be at ending,
//  2=can be at beginning
//  4=can be in middle
// Thus, the value 7 means "can be anywhere", 6 means "beginning or middle".
// 5 means "only middle or end", and 4 means "only in the middle".
// This is a binary encoding, as (middle) (beginning) (end).
// Occasionally, 'Y' will be duplicated as a vowel and a consonant.
// That's so rare that we won't worry about it, in fact it's interesting.
// There MUST be a possible vowel and possible consonant for any
// possible position; if you want to have "no vowel at the end", use
// ('',1) and make sure no other vowel includes "can be at end".

// Be careful when editing this - if you forget a comma, you'll get
// mysterious errors and "undefine" results in names, since Javascript
// doesn't have good error-catching facilities.
// You MUST NOT end the last item in the list with a comma - it's not okay in
// Javascipt (which is unfortunate, because that would make the problem
// slightly less likely).

class Syllable {
    value: string;
    bitmask: number;
}

let vowels = new Array<Syllable>(
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "a", bitmask: 7 }, { value: "e", bitmask: 7 }, { value: "i", bitmask: 7 }, { value: "o", bitmask: 7 }, { value: "u", bitmask: 7 },
    { value: "ae", bitmask: 7 }, { value: "ai", bitmask: 7 }, { value: "ao", bitmask: 7 }, { value: "au", bitmask: 7 }, { value: "aa", bitmask: 7 },
    { value: "ea", bitmask: 7 }, { value: "eo", bitmask: 7 }, { value: "eu", bitmask: 7 }, { value: "ee", bitmask: 7 },
    { value: "ia", bitmask: 7 }, { value: "io", bitmask: 7 }, { value: "iu", bitmask: 7 }, { value: "ii", bitmask: 7 },
    { value: "oa", bitmask: 7 }, { value: "oe", bitmask: 7 }, { value: "oi", bitmask: 7 }, { value: "ou", bitmask: 7 }, { value: "oo", bitmask: 7 },
    { value: "eau", bitmask: 7 },
    { value: "y", bitmask: 7 }
);

// List of possible consonants.

let consonants = new Array<Syllable>(
    { value: "b", bitmask: 7 }, { value: "c", bitmask: 7 }, { value: "d", bitmask: 7 }, { value: "f", bitmask: 7 }, { value: "g", bitmask: 7 }, { value: "h", bitmask: 7 },
    { value: "j", bitmask: 7 }, { value: "k", bitmask: 7 }, { value: "l", bitmask: 7 }, { value: "m", bitmask: 7 }, { value: "n", bitmask: 7 }, { value: "p", bitmask: 7 },
    { value: "qu", bitmask: 6 }, { value: "r", bitmask: 7 }, { value: "s", bitmask: 7 }, { value: "t", bitmask: 7 }, { value: "v", bitmask: 7 }, { value: "w", bitmask: 7 },
    { value: "x", bitmask: 6 }, { value: "y", bitmask: 7 }, { value: "z", bitmask: 7 },
    // Blends, sorted by second character:
    { value: "sc", bitmask: 7 },
    { value: "ch", bitmask: 7 }, { value: "gh", bitmask: 7 }, { value: "ph", bitmask: 7 }, { value: "sh", bitmask: 7 }, { value: "th", bitmask: 7 }, { value: "wh", bitmask: 6 },
    { value: "ck", bitmask: 5 }, { value: "nk", bitmask: 5 }, { value: "rk", bitmask: 5 }, { value: "sk", bitmask: 7 }, { value: "wk", bitmask: 0 },
    { value: "cl", bitmask: 6 }, { value: "fl", bitmask: 6 }, { value: "gl", bitmask: 6 }, { value: "kl", bitmask: 6 }, { value: "ll", bitmask: 6 }, { value: "pl", bitmask: 6 }, { value: "sl", bitmask: 6 },
    { value: "br", bitmask: 6 }, { value: "cr", bitmask: 6 }, { value: "dr", bitmask: 6 }, { value: "fr", bitmask: 6 }, { value: "gr", bitmask: 6 }, { value: "kr", bitmask: 6 },
    { value: "pr", bitmask: 6 }, { value: "sr", bitmask: 6 }, { value: "tr", bitmask: 6 },
    { value: "ss", bitmask: 5 },
    { value: "st", bitmask: 7 }, { value: "str", bitmask: 6 },
    // Repeat some entries to make them more common.
    { value: "b", bitmask: 7 }, { value: "c", bitmask: 7 }, { value: "d", bitmask: 7 }, { value: "f", bitmask: 7 }, { value: "g", bitmask: 7 }, { value: "h", bitmask: 7 },
    { value: "j", bitmask: 7 }, { value: "k", bitmask: 7 }, { value: "l", bitmask: 7 }, { value: "m", bitmask: 7 }, { value: "n", bitmask: 7 }, { value: "p", bitmask: 7 },
    { value: "r", bitmask: 7 }, { value: "s", bitmask: 7 }, { value: "t", bitmask: 7 }, { value: "v", bitmask: 7 }, { value: "w", bitmask: 7 },
    { value: "b", bitmask: 7 }, { value: "c", bitmask: 7 }, { value: "d", bitmask: 7 }, { value: "f", bitmask: 7 }, { value: "g", bitmask: 7 }, { value: "h", bitmask: 7 },
    { value: "j", bitmask: 7 }, { value: "k", bitmask: 7 }, { value: "l", bitmask: 7 }, { value: "m", bitmask: 7 }, { value: "n", bitmask: 7 }, { value: "p", bitmask: 7 },
    { value: "r", bitmask: 7 }, { value: "s", bitmask: 7 }, { value: "t", bitmask: 7 }, { value: "v", bitmask: 7 }, { value: "w", bitmask: 7 },
    { value: "br", bitmask: 6 }, { value: "dr", bitmask: 6 }, { value: "fr", bitmask: 6 }, { value: "gr", bitmask: 6 }, { value: "kr", bitmask: 6 },
)


// Return a random value between minvalue and maxvalue, inclusive,
// with equal probability.

function rolldie(minvalue: number, maxvalue: number): number {
    let result: number = minvalue;
    while (1) {
        result = Math.floor(Math.random() * (maxvalue - minvalue + 1) + minvalue);
        if ((result >= minvalue) && (result <= maxvalue)) { break; }
    }
    return result;
}

// Create a random name.  It must have at least between minsyl and maxsyl
// number of syllables (inclusive).

export default function GenerateRandomName(minSyllables: number, maxSyllables: number) {
    var data: Syllable;
    var generatedName = "";         // this accumulates the generated name.
    var amountOfSyllables = rolldie(minSyllables, maxSyllables); // Compute number of syllables in the name
    var isvowel = rolldie(0, 1); // randomly start with vowel or consonant
    for (var i = 1; i <= amountOfSyllables; i++) { // syllable #. Start is 1 (not 0)
        do {
            if (isvowel) {
                data = vowels[rolldie(0, vowels.length - 1)];
            } else {
                data = consonants[rolldie(0, consonants.length - 1)];
            }
            if (i == 1) { // first syllable.
                if (data.bitmask & 2) { break; }
            } else if (i == amountOfSyllables) { // last syllable.
                if (data.bitmask & 1) { break; }
            } else { // middle syllable.
                if (data.bitmask & 4) { break; }
            }
        } while (1)
        generatedName += data.value;
        isvowel = 1 - isvowel; // Alternate between vowels and consonants.
    }
    // Initial caps:
    generatedName = (generatedName.slice(0, 1)).toUpperCase() + generatedName.slice(1);
    return generatedName;
}