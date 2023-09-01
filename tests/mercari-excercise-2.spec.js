import { searchConditionsTestData } from "../resources/test-data/search-conditions-test-data";
import * as Constants from "../utilities/constants"
const { test } = require("./fixtures/base-fixtures")

/** To run using terminal, use the command:
 *
 *    npx playwright test --grep "@SUITE-1" --project=chromium
 *
 * This will run the whole suite (Excercise 2, Scenario 1 and
 * Scenario 2). You can cherry-pick @MERCARI-1 to run Scenario 1
 * and @MERCARI-2 to run Scenario 2.
 *
 * I used tags as the unique identifier for each test. I used
 * fixtures and POM so I was not able to successfully run this
 * serially from scenario 1 to scenario 2. I just reused codes
 * to reacreate search history in scenario 2. */

test.describe("Mercari Exercise 2 (Web) @SUITE-1", async () => {
    /** Run before each test case */
    test.beforeEach(async ({ homepagePage }) => {
        await test.step("Go to Mercari top page", async () => {
            await homepagePage.goToMercariHomepage()
        })

        await test.step("Click on the search bar", async () => {
            await homepagePage.clickSearchBox()
        })
    })

    test(`Scenario 1: ${ searchConditionsTestData[0].scenario }  @MERCARI-1`,
        async ({ homepagePage, searchPage }) => {
        await test.step("Click on 'Select by category (カテゴリーからさがす)'", async () => {
            await homepagePage.selectSearchOption(searchConditionsTestData[0].searchOptionSelection)
        })

        await test.step("Select 'Books, Music & Games as the tier 1 category (本・音楽・ゲーム)'",
            async () => {
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.TIER, searchConditionsTestData[0]
                .categorySelection.t1)
        })

        await test.step("Select 'Books' as the tier 2 category (本)", async () => {
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES.TIER,
                searchConditionsTestData[0].categorySelection.t2)
        })

        await test.step("Select 'Computers & Technology' as the tier 3 category (コンピュータ/IT)",
            async () => {
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES
                .CATEGORIES.BOOKS.TIER, searchConditionsTestData[0].categorySelection.t3)
        })

        await test.step("Verify the search conditions on the left sidebar are set correctly",
            async () => {
            await searchPage.verifyUserSelectionAndSearchConditions()
        })
    })

    test(`Scenario 2: Search conditions are set correctly from the latest browsing history  @MERCARI-2`,
        async ({ homepagePage, searchPage }) => {
         await test.step("Make first search history", async () => {
            await homepagePage.selectSearchOption(searchConditionsTestData[0].searchOptionSelection)
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.TIER, searchConditionsTestData[0]
                .categorySelection.t1)
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES
                .TIER, searchConditionsTestData[0].categorySelection.t2)
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES
                .CATEGORIES.BOOKS.TIER, searchConditionsTestData[0].categorySelection.t3)
            await searchPage.verifyUserSelectionAndSearchConditions()
             await searchPage.saveCategoryBrowsingHistoryData(1)
        })

        await test.step("Make second search history", async () => {
            await homepagePage.goToMercariHomepage()
            await homepagePage.clickSearchBox()
            await homepagePage.selectSearchOption(searchConditionsTestData[1].searchOptionSelection)
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.TIER, searchConditionsTestData[1]
                .categorySelection.t1)
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES
                .TIER, searchConditionsTestData[1].categorySelection.t2)
            await homepagePage.selectACategory(Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES
                .CATEGORIES.BOOKS.TIER, searchConditionsTestData[1].categorySelection.t3)
            await searchPage.verifyUserSelectionAndSearchConditions()
            await searchPage.saveCategoryBrowsingHistoryData(2)
        })

        await test.step("Go back to Mercari top page", async () => {
            await homepagePage.goToMercariHomepage()
        })

        await test.step("Click on the search bar", async () => {
            await homepagePage.clickSearchBox()
        })

        await test.step("Verify there are 2 browsing histories and that they are in correct order",
            async () => {
            await homepagePage.verifySearchHistoryCount(2)
            await homepagePage.verifySearchHistoryOrder(2)
        })

        await test.step("Click the latest search history", async () => {
            await homepagePage.clickLatestSearchHistory()
            await searchPage.verifyUserSelectionAndSearchConditions()
        })

        await test.step("Input 'javascript' in the search bar and search with the keyword",
            async () => {
            await homepagePage.inputTextToSearchBar(searchConditionsTestData[1].searchKeyword)
            await searchPage.verifyThatKeywordWasSuccessfullySearched(searchConditionsTestData[1].searchKeyword)
            await searchPage.saveCategoryBrowsingHistoryData(3)
        })

        await test.step("Go back to Mercari top page", async () => {
            await homepagePage.goToMercariHomepage()
        })

        await test.step("Click on the search bar", async () => {
            await homepagePage.clickSearchBox()
        })

        await test.step("Verify there are 3 browsing histories and that they are in correct order",
            async () => {
            await homepagePage.verifySearchHistoryCount(3)
            await homepagePage.verifySearchHistoryOrder(3)
        })
    })
})
