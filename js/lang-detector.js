// Script de détection de langue et redirection
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour obtenir la langue préférée du navigateur
    function getPreferredLanguage() {
        const languages = navigator.languages || [navigator.language || navigator.userLanguage];
        
        // Langues supportées par notre site
        const supportedLanguages = ['fr', 'en', 'es', 'de', 'it', 'pt', 'hr'];
        
        // Recherche de la première langue supportée dans les préférences du navigateur
        for (let lang of languages) {
            // Extraire le code de langue principal (ex: 'fr-FR' -> 'fr')
            const primaryLang = lang.split('-')[0].toLowerCase();
            if (supportedLanguages.includes(primaryLang)) {
                return primaryLang;
            }
        }
        
        // Par défaut, retourner le français
        return 'fr';
    }
    
    // Vérifier si nous sommes sur la page index.html principale
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const preferredLanguage = getPreferredLanguage();
        // Rediriger vers la version linguistique appropriée
        window.location.href = `index-${preferredLanguage}.html`;
    }
});
