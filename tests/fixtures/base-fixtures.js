const base = require('@playwright/test')
const { HomepagePage } = require('../../pages/homepage-page')
const { SearchPage } = require('../../pages/search-page')

exports.test = base.test.extend({
    homepagePage: async ({ page }, use) => {
        await use(new HomepagePage(page))
    }, searchPage: async ({ page }, use) => {
        await use(new SearchPage(page))
    },
})