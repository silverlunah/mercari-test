/** Constants/Enums divided by EN and JP for localization purposes */

/** -------------------------------------------- //
//          Mercari String Collection            //
// --------------------------------------------- */
export const MERCARI_KEYWORDS = Object.freeze({
    SEARCH_RESULTS_SUFFIX: {
        JP: "の検索結果"
    }
})

export const SEARCH_OPTIONS = Object.freeze({
    SELECT_BY_CATEGORY: {
        EN: "Select by category",
        JP: "カテゴリーからさがす"
    },
    SELECT_BY_BRAND: {
        EN: "Select by brand",
        JP: "ブランドからさがす"
    }
})

/** Created this approach so we can have a source of truth to all categories and which tier
 * they are depending on their parent category. We can add more categories here and reuse
 * in future tests. */
export const CATEGORIES_PER_TIERS = Object.freeze({
    TIER: 1,
    CATEGORIES : {
        BOOKS_MUSIC_GAMES: {
            LABEL: {
                EN: "Books, Music & Games",
                JP: "本・音楽・ゲーム"
            },
            TIER: 2,
            CATEGORIES : {
                BOOKS: {
                    LABEL: {
                        EN: "Books",
                        JP: "本"
                    },
                    TIER: 3,
                    CATEGORIES : {
                        COMPUTERS_AND_TECHNOLOGY: {
                            LABEL: {
                                EN: "Computers & Technology",
                                JP: "コンピュータ/IT"
                            },
                        },
                        NON_FICTION: {
                            LABEL: {
                                EN: "Non-Fiction",
                                JP: "ノンフィクション/教養"
                            },
                        }
                    }
                }
            }
        }
    }
})