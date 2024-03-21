'use strict';

(function () {
    /**
     * A class that represents a non-rendered element.
     * @class
     */
    class BoundryElement {
        /**
         * The tag name of the element.
         * @type {(string)}
         * @public
         */
        tagName = '';

        /**
         * A map of attributes to their values.
         * @type {{[key: string]: string}}
         * @public
         */
        attributes = {};

        /**
         * The children of the element.
         * @type {(BoundryElement | string | HTMLElement)[]}
         * @public
         */
        children = [];

        /**
         * A target reference to the element.
         * @type {({current: HTMLElement} | null)}
         */
        ref = null;

        /**
         * Creates a new BoundryElement.
         * @param {string} tagName The tag name of the element.
         * @param {{[key: string]: string}} attributes A map of attributes to their values.
         * @param {(BoundryElement | string | HTMLElement)[]} children The children of the element.
         * @param {({current: HTMLElement} | null)} ref A target reference to the element.
         * @returns {BoundryElement}
         */
        static create(tagName, attributes, children, ref) {
            const element = new BoundryElement();
            element.tagName = tagName;
            element.attributes = attributes;
            element.children = children;
            element.ref = ref;
            return element;
        }
    }

    /**
     * Renders a tree of elements to the DOM.
     * @param {(BoundryElement | string | HTMLElement)} element The element to render.
     * @param {HTMLElement} parent The parent element to render to.
     * @returns {void}
     */
    const render = (element, parent) => {
        /**
         * The queue of elements to render.
         * @type {({element: BoundryElement | string | HTMLElement, parent: HTMLElement})[]}
         */
        const renderQueue = [{ element, parent }];

        // Loop through the render queue.
        while (renderQueue.length > 0) {
            const currentElement = renderQueue.shift();

            // Parrent and current element.
            const parent = currentElement.parent;
            const element = currentElement.element;

            // If the element is a BoundryElement.
            if (element instanceof BoundryElement) {
                // Create the element.
                const newElement = document.createElement(element.tagName);

                // If the element has a ref.
                if (element.ref) {
                    element.ref.current = newElement;
                }

                // Set the attributes.
                for (const [key, value] of Object.entries(element.attributes)) {
                    newElement.setAttribute(key, value);
                }

                // Append the element to the parent.
                parent.appendChild(newElement);

                // Add the children to the render queue.
                for (const child of element.children) {
                    renderQueue.push({ element: child, parent: newElement });
                }
            }

            // If the element is an HTMLElement.
            else if (element instanceof HTMLElement) {
                // Append the element to the parent.
                parent.appendChild(element);
            }

            // If the element is none of the above, we will force it to be a string.
            else {
                // Create a text node.
                const textNode = document.createTextNode(element);

                // Append the text node to the parent.
                parent.appendChild(textNode);
            }
        }
    };

    /**
     * Create a reference to an element.
     * @returns {{current: HTMLElement}}
     */
    const createRef = () => {
        return { current: null };
    };

    /**
     * Creates a new BoundryElement.
     * @param {string} tagName The tag name of the element.
     * @param {string} className The class name of the element.
     * @param {{[key: string]: string}} attributes A map of attributes to their values.
     * @param {(BoundryElement | string | HTMLElement)[]} children The children of the element.
     * @param {{current: HTMLElement} | null} ref A target reference to the element.
     */
    const h = (tagName, className, attributes, children, ref = null) => {
        // Create the element.
        const element = BoundryElement.create(
            tagName,
            {
                class: className,
                ...attributes
            },
            children,
            ref
        );

        // Return the element.
        return element;
    };

    /**
     * Removes all children from an element. (Used in hosting components)
     * @param {HTMLElement} element The element to remove the children from.
     * @returns {void}
     */
    const removeAllChildren = (element) => {
        Array.from(element.children).forEach((child) => {
            element.removeChild(child);
        });
    };

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * @param {number} min The minimum value.
     * @param {number} max The maximum value.
     * @param {number | undefined} seed The seed for the random number. (Optional)
     */
    const getRandomInt = (min, max, seed = Math.random()) =>
        Math.floor(seed * (max - min + 1)) + min;

    /**
     * Returns a random element from a list.
     * @template T
     * @param {T[]} list The list to get the random element from.
     * @param {number | undefined} seed The seed for the random number. (Optional)
     * @returns {T}
     */
    const randomFromList = (list, seed = Math.random()) =>
        list[getRandomInt(0, list.length - 1, seed)];
    /**
     * Randomly shuffle an array.
     * @template T
     * @param {T[]} array The array to shuffle.
     * @returns {T[]}
     */
    const shuffle = (array) => {
        const arrayCopy = [...array];
        let currentIndex = arrayCopy.length;
        let randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [arrayCopy[currentIndex], arrayCopy[randomIndex]] = [
                arrayCopy[randomIndex],
                arrayCopy[currentIndex]
            ];
        }

        return arrayCopy;
    };

    /**
     * Days in a week.
     */
    const daysOfWeek = [
        { english: 'Sunday', kanji: '日曜日', hiragana: 'にちようび' },
        { english: 'Monday', kanji: '月曜日', hiragana: 'げつようび' },
        { english: 'Tuesday', kanji: '火曜日', hiragana: 'かようび' },
        { english: 'Wednesday', kanji: '水曜日', hiragana: 'すいようび' },
        { english: 'Thursday', kanji: '木曜日', hiragana: 'もくようび' },
        { english: 'Friday', kanji: '金曜日', hiragana: 'きんようび' },
        { english: 'Saturday', kanji: '土曜日', hiragana: 'どようび' }
    ];

    /**
     * Days in a month.
     * @type {{english: string, kanji: string, hiragana: string}[]}
     */
    const days = [
        { english: '1st', kanji: '一日', hiragana: 'ついたち' },
        { english: '2nd', kanji: '二日', hiragana: 'ふつか' },
        { english: '3rd', kanji: '三日', hiragana: 'みっか' },
        { english: '4th', kanji: '四日', hiragana: 'よっか' },
        { english: '5th', kanji: '五日', hiragana: 'いつか' },
        { english: '6th', kanji: '六日', hiragana: 'むいか' },
        { english: '7th', kanji: '七日', hiragana: 'なのか' },
        { english: '8th', kanji: '八日', hiragana: 'ようか' },
        { english: '9th', kanji: '九日', hiragana: 'ここのか' },
        { english: '10th', kanji: '十日', hiragana: 'とおか' },
        { english: '11th', kanji: '十一日', hiragana: 'じゅういちにち' },
        { english: '12th', kanji: '十二日', hiragana: 'じゅうににち' },
        { english: '13th', kanji: '十三日', hiragana: 'じゅうさんにち' },
        { english: '14th', kanji: '十四日', hiragana: 'じゅうよっか' },
        { english: '15th', kanji: '十五日', hiragana: 'じゅうごにち' },
        { english: '16th', kanji: '十六日', hiragana: 'じゅうろくにち' },
        { english: '17th', kanji: '十七日', hiragana: 'じゅうしちにち' },
        { english: '18th', kanji: '十八日', hiragana: 'じゅうはちにち' },
        { english: '19th', kanji: '十九日', hiragana: 'じゅうくにち' },
        { english: '20th', kanji: '二十日', hiragana: 'はつか' },
        { english: '21st', kanji: '二十一日', hiragana: 'にじゅういちにち' },
        { english: '22nd', kanji: '二十二日', hiragana: 'にじゅうににち' },
        { english: '23rd', kanji: '二十三日', hiragana: 'にじゅうさんにち' },
        { english: '24th', kanji: '二十四日', hiragana: 'にじゅうよっか' },
        { english: '25th', kanji: '二十五日', hiragana: 'にじゅうごにち' },
        { english: '26th', kanji: '二十六日', hiragana: 'にじゅうろくにち' },
        { english: '27th', kanji: '二十七日', hiragana: 'にじゅうしちにち' },
        { english: '28th', kanji: '二十八日', hiragana: 'にじゅうはちにち' },
        { english: '29th', kanji: '二十九日', hiragana: 'にじゅうくにち' },
        { english: '30th', kanji: '三十日', hiragana: 'さんじゅうにち' },
        { english: '31st', kanji: '三十一日', hiragana: 'さんじゅういちにち' }
    ];

    /**
     * Months in a year.
     * @type {{english: string, kanji: string, hiragana: string}[]}
     */
    const months = [
        { english: 'January', kanji: '一月', hiragana: 'いちがつ' },
        { english: 'February', kanji: '二月', hiragana: 'にがつ' },
        { english: 'March', kanji: '三月', hiragana: 'さんがつ' },
        { english: 'April', kanji: '四月', hiragana: 'しがつ' },
        { english: 'May', kanji: '五月', hiragana: 'ごがつ' },
        { english: 'June', kanji: '六月', hiragana: 'ろくがつ' },
        { english: 'July', kanji: '七月', hiragana: 'しちがつ' },
        { english: 'August', kanji: '八月', hiragana: 'はちがつ' },
        { english: 'September', kanji: '九月', hiragana: 'くがつ' },
        { english: 'October', kanji: '十月', hiragana: 'じゅうがつ' },
        { english: 'November', kanji: '十一月', hiragana: 'じゅういちがつ' },
        { english: 'December', kanji: '十二月', hiragana: 'じゅうにがつ' }
    ];

    /**
     * Generate answers for years (hard coding for 100 years is not resonable).
     * @param {number} year The year to generate the answers for.
     * @returns {{imperialEnglish: string, imperialKanji: string, imperialHiragana: string, westernEnglish: string, westernKanji: string, westernHiragana: string}}
     */
    const dynamicYear = (year) => {
        /**
         * Convert a number to kanji.
         * Note: This is not a full implementation, it only goes up to 9999.
         * @param {number} number The number to convert.
         * @returns {string}
         * @see https://en.wikipedia.org/wiki/Japanese_numerals
         * @see https://www.sljfaq.org/afaq/numbers.html
         */
        const toKanji = (number) => {
            const kanjiSubs = {
                1: '一',
                2: '二',
                3: '三',
                4: '四',
                5: '五',
                6: '六',
                7: '七',
                8: '八',
                9: '九'
            };

            if (number === 0) return '零';

            // Get components.
            const thousands = Math.floor(number / 1000);
            const hundreds = Math.floor((number % 1000) / 100);
            const tens = Math.floor((number % 100) / 10);
            const ones = number % 10;

            // Convert to kanji.
            let kanji = '';

            if (thousands > 0) {
                kanji += (thousands === 1 ? '' : kanjiSubs[thousands]) + '千';
            }

            if (hundreds > 0) {
                kanji += (hundreds === 1 ? '' : kanjiSubs[hundreds]) + '百';
            }

            if (tens > 0) {
                kanji += (tens === 1 ? '' : kanjiSubs[tens]) + '十';
            }

            if (ones > 0) {
                kanji += kanjiSubs[ones];
            }

            return kanji;
        };

        /**
         * Convert a number to hiragana.
         * Note: This is not a full implementation, it only goes up to 9999.
         * @param {number} number The number to convert.
         * @returns {string}
         * @see https://en.wikipedia.org/wiki/Japanese_numerals
         * @see https://www.sljfaq.org/afaq/numbers.html
         */
        const toHiragana = (number) => {
            const hiraganaSubs = {
                1: 'いち',
                2: 'に',
                3: 'さん',
                4: 'よん',
                5: 'ご',
                6: 'ろく',
                7: 'なな',
                8: 'はち',
                9: 'きゅう'
            };

            if (number === 0) return 'れい';

            // Get components.
            const thousands = Math.floor(number / 1000);
            const hundreds = Math.floor((number % 1000) / 100);
            const tens = Math.floor((number % 100) / 10);
            const ones = number % 10;

            // Convert to hiragana.
            let hiragana = '';

            if (thousands > 0) {
                switch (thousands) {
                    case 1:
                        hiragana += 'せん';
                        break;
                    case 3:
                        hiragana += 'さんぜん';
                        break;
                    case 8:
                        hiragana += 'はっせん';
                        break;
                    default:
                        hiragana += hiraganaSubs[thousands] + 'せん';
                }
            }

            if (hundreds > 0) {
                switch (hundreds) {
                    case 1:
                        hiragana += 'ひゃく';
                        break;
                    case 3:
                        hiragana += 'さんびゃく';
                        break;
                    case 6:
                        hiragana += 'ろっぴゃく';
                        break;
                    case 8:
                        hiragana += 'はっぴゃく';
                        break;
                    default:
                        hiragana += hiraganaSubs[hundreds] + 'ひゃく';
                }
            }

            if (tens > 0) {
                hiragana += (tens === 1 ? '' : hiraganaSubs[tens]) + 'じゅう';
            }

            if (ones > 0) {
                hiragana += hiraganaSubs[ones];
            }

            return hiragana;
        };

        const standardYearKanji = toKanji(year);
        const standardYearHiragana = toHiragana(year);

        const imperialYear = year - 2018;
        const imperialYearKanji = toKanji(imperialYear);
        const imperialYearHiragana = toHiragana(imperialYear);

        return {
            imperialEnglish: 'Reiwa ' + imperialYear,
            imperialKanji: '令和' + imperialYearKanji + '年',
            imperialHiragana: 'れいわ' + imperialYearHiragana + 'ねん',
            westernEnglish: year.toString(),
            westernKanji: standardYearKanji + '年',
            westernHiragana: standardYearHiragana + 'ねん'
        };
    };

    /**
     * A quick utility to join a list of elements with "→"
     * @param {string[]} elements The elements to join.
     */
    const joinWithArrow = (elements) => {
        return elements.join(' → ');
    };

    /**
     * A list of questions on the test.
     * @type {({createQuestion: (function(Date, number): BoundryElement[]), answer: (function(Date, number): BoundryElement[])}[])[]}
     */
    const questionGenerator = [
        // 5 - Day of the week.
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['一昨日は何曜日でしたか？'])
            ],
            answer: (date, _) => {
                const day = new Date(date);
                day.setDate(day.getDate() - 2);
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What day was it the day before yesterday?',
                            daysOfWeek[day.getDay() % 7].english,
                            daysOfWeek[day.getDay() % 7].kanji,
                            daysOfWeek[day.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['昨日は何曜日でしたか？'])
            ],
            answer: (date, _) => {
                const day = new Date(date);
                day.setDate(day.getDate() - 1);
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What day was it yesterday?',
                            daysOfWeek[day.getDay() % 7].english,
                            daysOfWeek[day.getDay() % 7].kanji,
                            daysOfWeek[day.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['今日は何曜日ですか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What day is it today?',
                            daysOfWeek[date.getDay() % 7].english,
                            daysOfWeek[date.getDay() % 7].kanji,
                            daysOfWeek[date.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['明日は何曜日ですか？'])
            ],
            answer: (date, _) => {
                const day = new Date(date);
                day.setDate(day.getDate() + 1);
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What day is it tomorrow?',
                            daysOfWeek[day.getDay() % 7].english,
                            daysOfWeek[day.getDay() % 7].kanji,
                            daysOfWeek[day.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['明後日は何曜日ですか？'])
            ],
            answer: (date, _) => {
                const day = new Date(date);
                day.setDate(day.getDate() + 2);
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What day is it the day after tomorrow?',
                            daysOfWeek[day.getDay() % 7].english,
                            daysOfWeek[day.getDay() % 7].kanji,
                            daysOfWeek[day.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        // 5 - Date of the month.
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['一昨日は何日でしたか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What date was it the day before yesterday?',
                            days[date.getDate() - 3].english,
                            days[date.getDate() - 3].kanji,
                            days[date.getDate() - 3].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['昨日は何日でしたか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What date was it yesterday?',
                            days[date.getDate() - 2].english,
                            days[date.getDate() - 2].kanji,
                            days[date.getDate() - 2].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['今日は何日ですか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What date is it today?',
                            days[date.getDate() - 1].english,
                            days[date.getDate() - 1].kanji,
                            days[date.getDate() - 1].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['明日は何日ですか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What date is it tomorrow?',
                            days[date.getDate()].english,
                            days[date.getDate()].kanji,
                            days[date.getDate()].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['明後日は何日ですか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What date is it the day after tomorrow?',
                            days[date.getDate() + 1].english,
                            days[date.getDate() + 1].kanji,
                            days[date.getDate() + 1].hiragana
                        ])
                    ])
                ];
            }
        },
        // 3 - Month of the year.
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['先月は何月でしたか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What month was it last month?',
                            months[Math.max(date.getMonth() - 1, 0)].english,
                            months[Math.max(date.getMonth() - 1, 0)].kanji,
                            months[Math.max(date.getMonth() - 1, 0)].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['今月は何月ですか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What month is it this month?',
                            months[date.getMonth()].english,
                            months[date.getMonth()].kanji,
                            months[date.getMonth()].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, _1) => [
                h('span', '', {}, ['来月は何月ですか？'])
            ],
            answer: (date, _) => {
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What month is it next month?',
                            months[Math.min(date.getMonth() + 1, 12)].english,
                            months[Math.min(date.getMonth() + 1, 12)].kanji,
                            months[Math.min(date.getMonth() + 1, 12)].hiragana
                        ])
                    ])
                ];
            }
        },
        // 3 - Years
        {
            createQuestion: (_0, seed) => [
                h('span', '', {}, ['去年は何年でしたか？'])
            ],
            answer: (date, seed) => {
                const year = new Date(date).getFullYear();
                const answers = dynamicYear(year - 1);
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What year was it last year?',
                            answers.westernEnglish + ' - 2019 + 1',
                            answers.imperialEnglish,
                            answers.imperialKanji,
                            answers.imperialHiragana
                        ])
                    ]),
                    h('span', 'question--answer-or', {}, ['OR']),
                    h('span', '', {}, [
                        joinWithArrow([
                            answers.westernEnglish,
                            answers.westernKanji,
                            answers.westernHiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, seed) => [
                h('span', '', {}, ['今年は何年ですか？'])
            ],
            answer: (date, seed) => {
                const year = new Date(date).getFullYear();
                const answers = dynamicYear(year);
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What year is it this year?',
                            answers.westernEnglish + ' - 2019 + 1',
                            answers.imperialEnglish,
                            answers.imperialKanji,
                            answers.imperialHiragana
                        ])
                    ]),
                    h('span', 'question--answer-or', {}, ['OR']),
                    h('span', '', {}, [
                        joinWithArrow([
                            answers.westernEnglish,
                            answers.westernKanji,
                            answers.westernHiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (_0, seed) => [
                h('span', '', {}, ['来年は何年ですか？'])
            ],
            answer: (date, seed) => {
                const year = new Date(date).getFullYear();
                const answers = dynamicYear(year + 1);
                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What year is it next year?',
                            answers.westernEnglish + ' - 2019 + 1',
                            answers.imperialEnglish,
                            answers.imperialKanji,
                            answers.imperialHiragana
                        ])
                    ]),
                    h('span', 'question--answer-or', {}, ['OR']),
                    h('span', '', {}, [
                        joinWithArrow([
                            answers.westernEnglish,
                            answers.westernKanji,
                            answers.westernHiragana
                        ])
                    ])
                ];
            }
        },
        // 3 - Days of week relative to the current week -> date
        {
            createQuestion: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex - 1].filter((e) => e),
                    seed
                );
                return [
                    h('span', '', {}, [
                        '先週の' +
                            daysOfWeek[targetDay.getDay() % 7].kanji +
                            'は何日でしたか？'
                    ])
                ];
            },
            answer: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex - 1].filter((e) => e),
                    seed
                );

                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            "What date was last week's " +
                                daysOfWeek[targetDay.getDay() % 7].english +
                                '?',
                            daysOfWeek[targetDay.getDay() % 7].english,
                            daysOfWeek[targetDay.getDay() % 7].kanji,
                            daysOfWeek[targetDay.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex].filter((e) => e),
                    seed
                );
                return [
                    h('span', '', {}, [
                        '今週の' +
                            daysOfWeek[targetDay.getDay() % 7].kanji +
                            'は何日' +
                            (targetDay < date ? 'でしたか？' : 'ですか？')
                    ])
                ];
            },
            answer: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex].filter((e) => e),
                    seed
                );

                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What date ' +
                                (targetDay < date ? 'was' : 'is') +
                                " this week's " +
                                daysOfWeek[targetDay.getDay() % 7].english +
                                '?',
                            daysOfWeek[targetDay.getDay() % 7].english,
                            daysOfWeek[targetDay.getDay() % 7].kanji,
                            daysOfWeek[targetDay.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex + 1].filter((e) => e),
                    seed
                );
                return [
                    h('span', '', {}, [
                        '来週の' +
                            daysOfWeek[targetDay.getDay() % 7].kanji +
                            'は何日ですか？'
                    ])
                ];
            },
            answer: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex + 1].filter((e) => e),
                    seed
                );

                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            "What date is next week's " +
                                daysOfWeek[targetDay.getDay() % 7].english +
                                '?',
                            daysOfWeek[targetDay.getDay() % 7].english,
                            daysOfWeek[targetDay.getDay() % 7].kanji,
                            daysOfWeek[targetDay.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        // 3 - Date -> Day of week
        {
            createQuestion: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex - 1].filter((e) => e),
                    seed
                );
                return [
                    h('span', '', {}, [
                        '先週の' +
                            days[targetDay.getDate() - 1].kanji +
                            'は何曜日でしたか？'
                    ])
                ];
            },
            answer: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex - 1].filter((e) => e),
                    seed
                );

                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            "What day was last week's " +
                                days[targetDay.getDate() - 1].english +
                                '?',
                            daysOfWeek[targetDay.getDay() % 7].english,
                            daysOfWeek[targetDay.getDay() % 7].kanji,
                            daysOfWeek[targetDay.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex].filter((e) => e),
                    seed
                );
                return [
                    h('span', '', {}, [
                        '今週の' +
                            days[targetDay.getDate() - 1].kanji +
                            'は何曜日' +
                            (targetDay < date ? 'でしたか？' : 'ですか？')
                    ])
                ];
            },
            answer: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex].filter((e) => e),
                    seed
                );

                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            'What day ' +
                                (targetDay < date ? 'was' : 'is') +
                                " this week's " +
                                days[targetDay.getDate() - 1].english +
                                '?',
                            daysOfWeek[targetDay.getDay() % 7].english,
                            daysOfWeek[targetDay.getDay() % 7].kanji,
                            daysOfWeek[targetDay.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        },
        {
            createQuestion: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex + 1].filter((e) => e),
                    seed
                );
                return [
                    h('span', '', {}, [
                        '来週の' +
                            days[targetDay.getDate() - 1].kanji +
                            'は何曜日ですか？'
                    ])
                ];
            },
            answer: (date, seed) => {
                const weeks = getWeeks(new Date());
                const currentWeekIndex = weeks.findIndex((week) =>
                    week.some((day) => day && day.getDate() === date.getDate())
                );
                const targetDay = randomFromList(
                    weeks[currentWeekIndex + 1].filter((e) => e),
                    seed
                );

                return [
                    h('span', '', {}, [
                        joinWithArrow([
                            "What day is next week's " +
                                days[targetDay.getDate() - 1].english +
                                '?',
                            daysOfWeek[targetDay.getDay() % 7].english,
                            daysOfWeek[targetDay.getDay() % 7].kanji,
                            daysOfWeek[targetDay.getDay() % 7].hiragana
                        ])
                    ])
                ];
            }
        }
    ];

    /**
     * Get a list of weeks for a given month.
     * @param {Date} date The date to get the weeks for.
     * @returns {(Date | null)[][]}
     */
    const getWeeks = (date) => {
        // Get the days in the month.
        /** @type {number} */
        const daysInMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate();

        // Create a list of days with the correct date.
        /** @type {Date[]} */
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(date.getFullYear(), date.getMonth(), i));
        }

        // Create a list of weeks, with a sub array of days (starting on Sunday).
        /** @type {(Date | null)[][]} */
        const weeks = [];
        let currentWeek = [null, null, null, null, null, null, null];
        for (let i = 0; i < days.length; i++) {
            currentWeek[days[i].getDay()] = days[i];
            if (days[i].getDay() === 6 || i === days.length - 1) {
                weeks.push(currentWeek);
                currentWeek = [null, null, null, null, null, null, null];
            }
        }

        return weeks;
    };

    /**
     * A calendar component.
     * @param {Date} date The date to display.
     */
    const Calendar = (date) => {
        // Create a list of weeks, with a sub array of days (starting on Sunday).
        const weeks = getWeeks(date);

        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const specialDays = {
            1: '1st',
            2: '2nd',
            3: '3rd',
            21: '21st',
            22: '22nd',
            23: '23rd',
        }

        return h('div', 'calendar', {}, [
            h('div', 'calendar--header', {}, [
                h('p', 'calendar--month-year', {}, [
                    (specialDays[date.getDate()] || (date.getDate() + 'th')) + ' of ' + months[date.getMonth()] + ' ' + date.getFullYear()
                ])
            ]),
            h('div', 'calendar--body', {}, [
                h('div', 'calendar--weekdays', {}, [
                    h('p', 'calendar--weekday', {}, ['Sun']),
                    h('p', 'calendar--weekday', {}, ['Mon']),
                    h('p', 'calendar--weekday', {}, ['Tue']),
                    h('p', 'calendar--weekday', {}, ['Wed']),
                    h('p', 'calendar--weekday', {}, ['Thu']),
                    h('p', 'calendar--weekday', {}, ['Fri']),
                    h('p', 'calendar--weekday', {}, ['Sat'])
                ]),
                h(
                    'div',
                    'calendar--days',
                    {},
                    weeks.map((week) => {
                        return h(
                            'div',
                            'calendar--week',
                            {},
                            week.map((day) => {
                                const isEqualToDate =
                                    day && day.getDate() === date.getDate();

                                return h(
                                    'p',
                                    'calendar--day' +
                                        (isEqualToDate
                                            ? ' calendar--day-active'
                                            : ''),
                                    {},
                                    [day ? day.getDate() : '']
                                );
                            })
                        );
                    })
                )
            ])
        ]);
    };

    /**
     * A list of questions on the test. Note, this has two return results, one is a function to show or hide quesion answers.
     * @param {({createQuestion: (function(Date): BoundryElement), answer: (function(Date): BoundryElement)}[])[]} questions The list of questions (randomized).
     * @param {number[]} seeds The seeds for the questions / answers.
     * @param {Date} date The date to display.
     * @returns {[BoundryElement, function(boolean): void]}
     */
    const Questions = (questions, seeds, date) => {
        /** @type {{current: HTMLElement}} */
        const questionRefs = [];

        /**
         * Show or hide the answers to the questions.
         * @param {boolean} show If the answers should be shown.
         * @returns {void}
         * @public
         */
        const showHideAnswers = (show) => {
            for (let i = 0; i < questionRefs.length; i++) {
                const ref = questionRefs[i];

                // Make sure the ref is not null.
                if (!ref.current) continue;

                // Clear the children.
                removeAllChildren(ref.current);

                // Not showing the answers.
                if (!show) continue;

                // Show the answers.
                render(
                    h('blockquote', 'question--answers', {}, [
                        h('div', 'question--answer-effect', {}, []),
                        h('div', 'question--answer', {}, [
                            h('p', 'question--answer-title', {}, ['Answer:']),
                            ...questions[i].answer(date, seeds[i])
                        ])
                    ]),
                    ref.current
                );
            }
        };

        // Create the questions.
        return [
            h(
                'ol',
                'questions',
                {},
                questions.map((question, index) => {
                    const questionRef = createRef();
                    questionRefs.push(questionRef);
                    return h('div', 'question', {}, [
                        h(
                            'li',
                            'question--question',
                            {},
                            question.createQuestion(date, seeds[index])
                        ),
                        h('div', 'question--answer-host', {}, [], questionRef)
                    ]);
                })
            ),
            showHideAnswers
        ];
    };

    /**
     * The main entry point for the application.
     */
    const main = () => {
        const root = document.getElementById('root');

        const reloadButtonRef = createRef();
        const revealButtonRef = createRef();
        const calendarParentRef = createRef();
        const questionHostRef = createRef();

        /**
         * Generate a random date between the reiwa era and 20 years in the future.
         * @returns {Date}
         */
        const generateRandomDate = () => {
            // Random date (reiwa era 1st year to like ~30 years in the future)
            const year = getRandomInt(2019, 2049);
            // Self explanatory...
            const month = getRandomInt(0, 11);
            // Because of how the test works, there needs to be a one week buffer.
            const calendar = getWeeks(new Date(year, month, 1));
            let topPadding = calendar[0].filter((x) => x !== null).length;
            let bottomPadding = calendar[calendar.length - 1].filter(
                (x) => x !== null
            ).length;
            // Remove 1st and last week and flatten the array.
            const daysInMonth = calendar.slice(1, calendar.length - 1).flat();
            // Random day.
            topPadding = Math.max(2 - topPadding, 0);
            bottomPadding = Math.max(2 - bottomPadding, 0);
            const day = getRandomInt(
                topPadding,
                daysInMonth.length - bottomPadding - 1
            );
            return daysInMonth[day];
        };

        /** @type {Date} */
        let date = new Date();
        /** @type {({createQuestion: (function(Date): BoundryElement), answer: (function(Date): BoundryElement)}[])[]} */
        let currentQuestions = [];
        /** @type {number[]} */
        let seeds = [];
        /** @type {function(boolean): void} */
        let showHideAnswersFunction = () => {};
        /** @type {boolean} */
        let showAnswers = false;

        // Create the element.
        render(
            h('div', 'main-content', {}, [
                h('div', 'toolbar', {}, [
                    h(
                        'button',
                        'toolbar--button reload-button',
                        {},
                        ['New Test'],
                        reloadButtonRef
                    ),
                    h('div', 'spacer', {}, []),
                    h(
                        'button',
                        'toolbar--button reveal-button',
                        {},
                        ['Reveal Answers'],
                        revealButtonRef
                    )
                ]),
                h('header', 'header', {}, [
                    h('div', 'header--title-container', {}, [
                        h('h1', 'header--title', {}, ['日本語日付試し練習']),
                        h('h3', 'header--subtitle', {}, [
                            'Japanese Date Quiz Practice'
                        ])
                    ]),
                    h('div', 'spacer', {}, []),
                    h('div', 'header--calendar-host', {}, [], calendarParentRef)
                ]),
                h('div', 'questions', {}, [
                    h('h2', 'question--title', {}, ['Questions']),
                    h('div', 'question--host', {}, [], questionHostRef)
                ]),
                h('footer', 'footer', {}, [
                    h('p', 'footer--text', {}, [
                        h('span', '', {}, ['Made with ❤️ by ']),
                        h(
                            'a',
                            'footer--link',
                            { href: 'https://github.com/JoshuaBrest' },
                            ['Joshua Brest']
                        )
                    ]),
                    h('p', 'footer--text', {}, ['•']),
                    h('p', 'footer--text', {}, [
                        h('span', '', {}, ['Source code available on ']),
                        h(
                            'a',
                            'footer--link',
                            {
                                href: 'https://github.com/JoshuaBrest/japanese-dates-quiz-practice'
                            },
                            ['GitHub']
                        )
                    ]),
                    h('p', 'footer--text', {}, ['•']),
                    h('p', 'footer--text', {}, [
                        h('span', '', {}, ['Version ' + (window.COMMIT_HASH || '')])
                    ])
                ])
            ]),
            root
        );

        /**
         * Set up and create a new test.
         * @returns {void}
         */
        const newTest = () => {
            // Randomize the date.
            date = generateRandomDate();
            currentQuestions = shuffle(questionGenerator);
            seeds = Array(currentQuestions.length).map(() => Math.random());
            showHideAnswersFunction = (_) => {};
            showAnswers = false;

            // Change the button to say "Reveal Answers".
            revealButtonRef.current.textContent = 'Reveal Answers';

            removeAllChildren(calendarParentRef.current);
            render(Calendar(date), calendarParentRef.current);

            // Create the questions.
            removeAllChildren(questionHostRef.current);
            const [component, showHideAnswers] = Questions(
                currentQuestions,
                seeds,
                date
            );
            render(component, questionHostRef.current);
            showHideAnswersFunction = showHideAnswers;
        };

        // Add event listeners.
        reloadButtonRef.current.addEventListener('click', () => {
            newTest();
        });

        revealButtonRef.current.addEventListener('click', () => {
            revealButtonRef.current.textContent = showAnswers
                ? 'Reveal Answers'
                : 'Hide Answers';
            showAnswers = !showAnswers;
            showHideAnswersFunction(showAnswers);
        });

        // Create the first test.
        newTest();
    };

    document.addEventListener('DOMContentLoaded', main);
})();
