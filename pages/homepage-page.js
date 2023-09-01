import * as Constants from "../utilities/constants"
import * as Utils from "../utilities/utils"
import * as GlobalVariables from "../utilities/global-variables";
import {expect} from "@playwright/test";
const { test } = require("@playwright/test")

/** -------------------------------------------- //
//                Element Locators               //
// --------------------------------------------- */
const searchTextbox = "//form[contains(@class,'merSearchInput')]/input"
const searchButton = "(//mer-icon-button[@label='検索'])[1]"
const searchHistoryItems = "//section[@data-testid='search-history']//div[contains(@class, 'merListItem')]"

/** -------------------------------------------- //
//                   Functions                   //
// --------------------------------------------- */
exports.HomepagePage = class HomepagePage {
    constructor(page) {
        this.page = page
    }

    async goToMercariHomepage() {
        /** Using an env file to get the software under test's URL */
        await this.page.goto(process.env.MERCARI_PRODUCTION_URL)
    }

    async clickSearchBox() {
        await this.page.locator(searchTextbox).click()
    }

    async verifySearchHistoryCount(expectedNumberOfHistory) {
        await expect.soft(await this.page.locator(searchHistoryItems).count()).toBe(expectedNumberOfHistory)
    }


    /** Compare search history in front-end by getting all the element text under
     * searchHistoryItems into a loop, then compare with GlobalVariable.CategorySearchHistory,
     * which has the search history saved in order too. */
    async verifySearchHistoryOrder(expectedNumberOfHistory) {
        for(let i= 0; i < expectedNumberOfHistory; i++) {
            let searchHistoryFromFrontEnd = await this.page.locator(searchHistoryItems).nth(i).textContent()
            let searchHistoryFromSavedUserInput = GlobalVariables.CategorySearchHistory.get(GlobalVariables.
                CategorySearchHistory.size - i)

            await Utils.logInfo("Search history order ["+ (i + 1) + "] in front-end is " + searchHistoryFromFrontEnd + ". " +
                "Actual user input is " + searchHistoryFromSavedUserInput)
            await expect.soft(await this.page.locator(searchHistoryItems).nth(i).textContent(),
                "Incorrect search history in index " + (i + 1)).toBe(searchHistoryFromSavedUserInput)
        }
    }

    async selectSearchOption(searchOptionToSelect) {
        /** We can of course skip the switch statement and directly interact with the
         * element using the Japanese label, but this is just to showcase label localization
         * if the company decides to branch-out to other countries with different languages */
        switch(searchOptionToSelect) {
            case Constants.SEARCH_OPTIONS.SELECT_BY_CATEGORY.EN:
                searchOptionToSelect = Constants.SEARCH_OPTIONS.SELECT_BY_CATEGORY.JP
                break
            case Constants.SEARCH_OPTIONS.SELECT_BY_BRAND.EN:
                searchOptionToSelect = Constants.SEARCH_OPTIONS.SELECT_BY_BRAND.JP
                break
            default:
                await Utils.logDebug("Unknown Search Option: " + searchOptionToSelect)
                test.fixme()
                break
        }

        /** Proceed to selecting the search option */
        await this.page.locator("//p[text()[contains(., '" + searchOptionToSelect + "')]]/..").click()
    }

    /** Same as selectSearchOption(), for showcasing localization organization */
    async selectACategory(tier, categoryToSelect) {
        switch(categoryToSelect) {
            case Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES.LABEL.EN:
                categoryToSelect = Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES.LABEL.JP
                break
            case Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES.CATEGORIES.BOOKS.LABEL.EN:
                categoryToSelect = Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES.CATEGORIES
                    .BOOKS.LABEL.JP
                break
            case Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES.CATEGORIES.BOOKS.CATEGORIES
                .COMPUTERS_AND_TECHNOLOGY.LABEL.EN:
                categoryToSelect =  Constants.CATEGORIES_PER_TIERS.CATEGORIES
                    .BOOKS_MUSIC_GAMES.CATEGORIES.BOOKS.CATEGORIES.COMPUTERS_AND_TECHNOLOGY.LABEL.JP
                break
            case Constants.CATEGORIES_PER_TIERS.CATEGORIES.BOOKS_MUSIC_GAMES.CATEGORIES.BOOKS.CATEGORIES
                .NON_FICTION.LABEL.EN:
                categoryToSelect =  Constants.CATEGORIES_PER_TIERS.CATEGORIES
                    .BOOKS_MUSIC_GAMES.CATEGORIES.BOOKS.CATEGORIES.NON_FICTION.LABEL.JP
                break
            default:
                await Utils.logDebug("Unknown Category: " + categoryToSelect)
                test.fixme()
                break
        }

        /** Assign selected category depending on tier to a global
         *  variable so we can compare it in the last step */
        GlobalVariables.CategorySelectionByUser.set(tier, categoryToSelect)

        /** Proceed to selecting the category */
        await this.page.locator("//a[text()='" + categoryToSelect + "']").click()
    }

    async clickLatestSearchHistory() {
        await this.page.locator(searchHistoryItems).nth(0).click()
    }

    async inputTextToSearchBar(keyword) {
        await this.page.locator(searchTextbox).fill(keyword)
        await this.page.locator(searchButton).click()
    }
}