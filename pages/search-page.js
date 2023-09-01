import * as GlobalVariables from "../utilities/global-variables"
import * as Utils from "../utilities/utils";
import * as Constants from "../utilities/constants";
const { expect, test } = require("@playwright/test")

/** -------------------------------------------- //
//                   Variables                   //
// --------------------------------------------- */
let categorySavableInHistory

/** -------------------------------------------- //
//                Element Locators               //
// --------------------------------------------- */
const categoryTierOneDropdown = "li[data-testid='category_id'] .merSelect:nth-child(1) select"
const categoryTierTwoDropdown = "li[data-testid='category_id'] .merSelect:nth-child(2) select"
const searchPageHeader = "//h1"

/** -------------------------------------------- //
//                   Functions                   //
// --------------------------------------------- */
exports.SearchPage = class SearchPage {
    constructor(page) {
        this.page = page
    }

    /** Using the saved value in homepage-page.selectACategory(), we will check if the filters are correct */
    async verifyUserSelectionAndSearchConditions() {
        /** Assert tier 1 selection */
        await Utils.logInfo("Checking if [" + GlobalVariables.CategorySelectionByUser.get(1) + "] is selected as tier 1 category")
        await expect.soft(await this.page.locator("//option[@value='" + await this.getSelectedOptionIndex(
            categoryTierOneDropdown) + "']").textContent()).toBe(GlobalVariables.CategorySelectionByUser.get(1))

        /** Assert tier 2 selection */
        await Utils.logInfo("Checking if [" + GlobalVariables.CategorySelectionByUser.get(2) + "] is selected as tier 2 category")
        await expect.soft(await this.page.locator("//option[@value='" + await this.getSelectedOptionIndex(
            categoryTierTwoDropdown) + "']").textContent()).toBe(GlobalVariables.CategorySelectionByUser.get(2))

        /** Assert tier 3 selection */
        await Utils.logInfo("Checking if [" + GlobalVariables.CategorySelectionByUser.get(3) + "] is selected as tier 3 category")
        categorySavableInHistory = await this.page.locator("//input[@aria-checked='true']/../../div").textContent()
        await expect.soft(categorySavableInHistory).toBe(GlobalVariables.CategorySelectionByUser.get(3))
    }

    /** Since there are no indicators of the default value in dropdowns, I used $eval to get the value of the
     * dropdown element which returns the option number of the current selected option. Once returned, we
     * can use it in verifyUserSelectionAndSearchConditions() to get the option and extract is textContent */
    async getSelectedOptionIndex(dropdownElement) {
        await expect(this.page.locator(dropdownElement),
            "Category dropdown was not found").toBeVisible()
        return await this.page.$eval(dropdownElement, el => el.value)
    }

    /** Verify if keyword matches header of search page. Will also save keyword to categorySavableInHistory
     *  so we can use it in saveCategoryBrowsingHistoryData() to save the browsing history */
    async verifyThatKeywordWasSuccessfullySearched(keyword) {
        let headerText = await this.page.locator(searchPageHeader).textContent()
        await Utils.logInfo("Checking if [" + keyword + "] keyword was successfully searched")
        await expect(headerText.substring(0, headerText.indexOf(Constants.MERCARI_KEYWORDS.SEARCH_RESULTS_SUFFIX.JP) - 1),
            "Header did not match keyword.").toBe(keyword)

        /** if searched with existing category filtered, will include the category to history label */
        let currentPageURL = await this.page.url()

        if(currentPageURL.includes("category_id")) {
            categorySavableInHistory = keyword + ", " + categorySavableInHistory
        } else {
            categorySavableInHistory = keyword
        }
    }

    /** Save user browsing history in order */
    async saveCategoryBrowsingHistoryData(nth) {
        GlobalVariables.CategorySearchHistory.set(nth, categorySavableInHistory)
    }
}

