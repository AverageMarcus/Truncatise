# Truncatise
## JavaScript module to truncate HTML strings.

### Description
Provides the ability to truncate HTML strings down to excerpts based on character length, word length or paragraph length.

**Features:**
*	Truncate based on number of Characters, Words or Paragraphs.
*	Strip HTML from returned string.
*	Provides a strict flag to specify whether to cut-off mid word or not.
*	Configurable suffix appended to the end of the returned excerpt.

### Install
  npm install truncatise

### Options (with default values)

```javascript
{
  TruncateBy:     'words',  // Options are 'words', 'characters' or 'paragraphs'
  TruncateLength: 50,    	  // The count to be used with TruncatedBy
  StripHTML:      false,    // Whether or not the truncated text should contain HTML tags
  Strict:         true,     // If set to false the truncated text finish at the end of the word
  Suffix:         '...'     // Text to be appended to the end of the truncated text
}
```

### Example Usage

```javascript
var options = {
  TruncateLength: 4,
  TruncateBy : "words",
  Strict : false,
  StripHTML : true,
  Suffix : ' (Read More)'
};
var excerpt = truncatise("<p>This is a test of Truncatise</p>", options);
console.log(excerpt); // This is a test (Read More)
```
