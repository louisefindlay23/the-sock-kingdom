// Pig Latin Translator
const PigLatin = require("pig-latinizer").default;
const pigLatin = new PigLatin();
console.info(pigLatin.translate("Hi people"));
export default pigLatin;
