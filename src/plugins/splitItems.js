/**
 * @param string natural_language_separator 
 * @param string voices
 * @return array
 */
const splitItems = function(natural_language_separator, voices) {
    var regexp = new RegExp("\n|\\s"+ natural_language_separator +"\\s");
    return voices.split(regexp).filter(function(voice){ return !!voice });
}

export default splitItems;