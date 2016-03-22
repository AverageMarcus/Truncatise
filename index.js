(function(exportTo) {
    "use strict";

    var selfClosingTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"];

    /**
     * Truncates a given HTML string to the specified length.
     * @param {string} text This is the HTMl string to be truncated
     * @param {object} options An options object defining how to truncate
     *      Default values:
     *      {
     *          TruncateBy : 'words',   // Options are 'words', 'characters' or 'paragraphs'
     *          TruncateLength : 50,    // The count to be used with TruncatedBy
     *          StripHTML : false,      // Whether or not the truncated text should contain HTML tags
     *          Strict : true,          // When set to false the truncated text finish at the end of the word
     *          Suffix : '...'          // Text to be appended to the end of the truncated text
     *      }
     * @return {string} This returns the provided string truncated to the
     *      length provided by the options. HTML tags may be stripped based
     *      on the given options.
     */
    var truncatise = function(text,options) {
        var options         = options || {},
            text            = (text || "").trim(),
            truncatedText   = "",
            currentState    = 0,
            isEndOfWord     = false,
            isTagOpen       = false,
            currentTag      = "",
            tagStack        = [],
            nextChar        = "";
        //Counters
        var charCounter         = 0,
            wordCounter         = 0,
            paragraphCounter    = 0;
        //currentState values
        var NOT_TAG         = 0,
            TAG_START       = 1,
            TAG_ATTRIBUTES  = 2;

        //Set default values
        options.TruncateBy      = (options.TruncateBy === undefined
                                    || typeof options.TruncateBy !==  "string"
                                    || !options.TruncateBy.match(/(word(s)?|character(s)?|paragraph(s)?)/))
                                ? 'words'
                                : options.TruncateBy.toLowerCase();
        options.TruncateLength  = (options.TruncateLength === undefined
                                    || typeof options.TruncateLength !== "number")
                                ? 50
                                : options.TruncateLength;
        options.StripHTML       = (options.StripHTML === undefined
                                    || typeof options.StripHTML !== "boolean")
                                ? false
                                : options.StripHTML;
        options.Strict          = (options.Strict === undefined
                                    || typeof options.Strict !== "boolean")
                                ? true
                                : options.Strict;
        options.Suffix          = (options.Suffix === undefined
                                    || typeof options.Suffix !== "string")
                                ? '...'
                                : options.Suffix;

        if(text === "" || (text.length <= options.TruncateLength && options.StripHTML === false)){
            return text;
        }

        //If not splitting on paragraphs we can quickly remove tags using regex
        if(options.StripHTML && !options.TruncateBy.match(/(paragraph(s)?)/)){
            text = String(text).replace(/<!--(.*?)-->/gm, '').replace(/<\/?[^>]+>/gi, '');
        }
        //Remove newline seperating paragraphs
        text = String(text).replace(/<\/p>(\r?\n)+<p>/gm, '</p><p>');
        //Replace double newlines with paragraphs
        if(options.StripHTML && String(text).match(/\r?\n\r?\n/)){
            text = String(text).replace(/((.+)(\r?\n\r?\n|$))/gi, "<p>$2</p>");
        }

        for (var pointer = 0; pointer < text.length; pointer++ ) {

            var currentChar = text[pointer];

            switch(currentChar){
                case "<":
                    if(currentState === NOT_TAG){
                        currentState = TAG_START;
                        currentTag = "";
                    }
                    if(!options.StripHTML){
                        truncatedText += currentChar;
                    }
                    break;
                case ">":
                    if(currentState === TAG_START || currentState === TAG_ATTRIBUTES){
                        currentState = NOT_TAG;
                        if(currentTag.toLowerCase() === "/p"){
                            paragraphCounter++;
                            if(options.StripHTML){
                                truncatedText += " ";
                            }
                        }

                        if(currentTag.indexOf("/") === -1){
                            tagStack.push(currentTag);
                        }else if(selfClosingTags.indexOf(currentTag) === -1){
                            tagStack.pop();
                        }
                    }
                    if(!options.StripHTML){
                        truncatedText += currentChar;
                    }
                    break;
                case " ":
                    if(currentState === TAG_START){
                        currentState = TAG_ATTRIBUTES;
                    }
                    if(currentState === NOT_TAG){
                        wordCounter++;
                        charCounter++;
                    }
                    if(currentState === NOT_TAG || !options.StripHTML){
                        truncatedText += currentChar;
                    }
                    break;
                default:
                    if(currentState === NOT_TAG){
                        charCounter++;
                    }
                    if(currentState === TAG_START){
                        currentTag += currentChar;
                    }
                    if(currentState === NOT_TAG || !options.StripHTML){
                        truncatedText += currentChar;
                    }
                    break;
            }

            nextChar = text[pointer + 1] || "";
            isEndOfWord = options.Strict ? true : (!currentChar.match(/[a-zA-ZÇ-Ü']/i) || !nextChar.match(/[a-zA-ZÇ-Ü']/i));

            if(options.TruncateBy.match(/word(s)?/i) && options.TruncateLength <= wordCounter){
                truncatedText = truncatedText.trimRight();
                break;
            }
            if(options.TruncateBy.match(/character(s)?/i) && options.TruncateLength <= charCounter && isEndOfWord){
                break;
            }
            if(options.TruncateBy.match(/paragraph(s)?/i) && options.TruncateLength === paragraphCounter){
                break;
            }
        }

        if(!options.StripHTML && tagStack.length > 0){
            while(tagStack.length > 0){
                var tag = tagStack.pop();
                if(tag!=="!--"){
                    truncatedText += "</"+tag+">";
                }
            }
        }

        if(pointer < text.length - 1) {
          if(truncatedText.match(/<\/p>$/gi)){
              truncatedText = truncatedText.replace(/(<\/p>)$/gi, options.Suffix + "$1");
          }else{
              truncatedText = truncatedText + options.Suffix;
          }
        }

        return truncatedText.trim();
    };

    // Export to node
    if (typeof module !== 'undefined' && module.exports){
        return module.exports = truncatise;
    }

    // Nope, export to the browser instead.
    exportTo.truncatise = truncatise;
}(this));