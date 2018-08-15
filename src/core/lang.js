export default {
    setLang(lang) {
        window.localStorage.setItem('user_lang', lang)
    },
    getLang(defaultLang) {
        let localLang = window.localStorage.getItem('user_lang') || 'en'

        if (localLang === null) {
            return defaultLang
        } else {
            return localLang
        }
    }
}