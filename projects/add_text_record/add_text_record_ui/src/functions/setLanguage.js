import l10n from '../l10n';

const loaders = {
    en: () => import('../l10n/en.po'),
    fr: () => import('../l10n/fr.po'),
};

const setLanguage = (language) => {
    const loader = loaders[language];
    return loader
        ? loader().then(({ default: data }) => l10n.load(data))
        : Promise.reject(new Error(`Unknown language ${language}`));
};

export default setLanguage;
