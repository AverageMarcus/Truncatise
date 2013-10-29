var truncatise		= require("./"),
    chai			= require("chai"),
    mocha           = require("mocha");
    chai.should();

describe("Truncating to characters", function(){
	it("should be able to strip html", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p>", {TruncateLength: 10, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
			.should.equal("This is a ");
	});

	it("should be able handle and ignore self-closing tags", function(){
		truncatise("<p>This<img src=\"test.jpg\" /> is a test of self-closing tags such as <img src=\"test.jpg\" /></p>", {TruncateLength: 10, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
			.should.equal("This is a ");
	});

	it("should ignore comments",function() {
        truncatise("<p>This <!-- is a test --> <strong>is a test of comments</strong></p>",{TruncateLength: 10, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This  is a");
    });

	it("should strip comments",function() {
        truncatise("<p>This <!-- comment <a href='/'>link</a> test --><strong>is a test of comments</strong></p>",{TruncateLength: 7, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is");
    });

	it("should ignore tags in comments",function() {
        truncatise("<p>This <!-- is <a href='/'>a</a> test --><strong>is a test of comments</strong></p>",{TruncateLength: 9, TruncateBy : "character", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is a");
    });

	it("should correctly handle comments when not stripping tags",function() {
        truncatise("<p>This <!-- comment --><strong>is a test of comments</strong></p>",{TruncateLength: 9, TruncateBy : "character", Strict : true, StripHTML : false, Suffix : ''})
            .should.equal("<p>This <!-- comment --><strong>is a</strong></p>");
    });

	it("should return all if truncate length is longer than input",function() {
        truncatise("<p>This is a test of length</p>",{TruncateLength: 100, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is a test of length");
    });

	it("should handle encoded entities",function() {
        truncatise("<p>This is &amp; test of length</p>",{TruncateLength: 100, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is &amp; test of length");
    });

	it("should strip custom tags",function() {
        truncatise("<p>This is <faketag>a</faketag> test of length</p>",{TruncateLength: 100, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is a test of length");
    });

	it("should not split a word when not strict",function() {
        truncatise("<p>This is a test of strictness</p>",{TruncateLength: 12, TruncateBy : "characters", Strict : false, StripHTML : true, Suffix : ''})
            .should.equal("This is a test");
    });

	it("should split a word when strict is true",function() {
        truncatise("<p>This is a test of strictness</p>",{TruncateLength: 12, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ''})
            .should.equal("This is a te");
    });
});

describe("Truncating to words", function(){
	it("should be able to strip html", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p>", {TruncateLength: 3, TruncateBy : "words", StripHTML : true, Suffix : ''})
			.should.equal("This is a");
	});

	it("should be able to handle html tags", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p>", {TruncateLength: 3, TruncateBy : "words", StripHTML : false, Suffix : ''})
			.should.equal("<p>This is a</p>");
	});
});

describe("Truncating to paragraphs", function(){
	it("should be able to strip html", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p><p>With multiple paragraphs</p>", {TruncateLength: 1, TruncateBy : "paragraph", StripHTML : true, Suffix : ''})
			.should.equal("This is a test of html tag stripping ");
	});

	it("should be able to handle html tags", function(){
		truncatise("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p><p>With multiple paragraphs</p>", {TruncateLength: 1, TruncateBy : "paragraph", StripHTML : false, Suffix : ''})
			.should.equal("<p>This is a test of <b>html</b> <strong>tag</strong> <span class='cssClass'>stripping</span></p>");
	});

	it("should be able to handle several paragraphs", function(){
		truncatise("<p>This</p><p>is</p><p>a</p><p>test</p><p>of</p><p>multiple</p><p>paragraphs</p>", {TruncateLength: 3, TruncateBy : "paragraph", StripHTML : true, Suffix : ''})
			.should.equal("This is a ");
	});

	it("should be able to handle double newline as paragraphs", function(){
		truncatise("This is the first paragraph.\r\n\r\nThis is the second.\n\nThis is the third.", {TruncateLength: 2, TruncateBy : "paragraph", StripHTML : true, Suffix : ''})
			.should.equal("This is the first paragraph. This is the second. ");
	});
});

describe("Appending a suffix", function(){
	it("should append ... by default",function(){
		truncatise("This is a long paragraph that I intend to truncate.",{TruncateLength: 14, TruncateBy : "characters", Strict : true, StripHTML : true})
            .should.equal("This is a long...");
	});

	it("should append the provided suffix",function(){
		truncatise("This is a long paragraph that I intend to truncate.",{TruncateLength: 14, TruncateBy : "characters", Strict : true, StripHTML : true, Suffix : ' (Read More)'})
            .should.equal("This is a long (Read More)");
	});

	it("should place the suffix correctly within open tags",function(){
		truncatise("<p>This is a long paragraph that I intend to truncate.</p>",{TruncateLength: 2, TruncateBy : "words", StripHTML : false})
            .should.equal("<p>This is...</p>");
	});
});

describe("Handling tags", function(){
	it("should be able to close an open tag",function(){
		truncatise("<p>This is a long paragraph that I intend to truncate.</p>",{TruncateLength: 2, TruncateBy : "words", StripHTML : false, Suffix : ''})
            .should.equal("<p>This is</p>");
	});

	it("should be able to close multiple open tags",function(){
		truncatise("<p>This <a href=\"/\">is a long paragraph</a> that I intend to truncate.</p>",{TruncateLength: 2, TruncateBy : "words", StripHTML : false, Suffix : ''})
            .should.equal("<p>This <a href=\"/\">is</a></p>");
	});
});

describe("Performance testing",function() {
    var input = "";
    for (var i=0; i<1000000; i++) {
            input += "<p>This is a paragraph used for performance testing</p>\n";
    }
    
    describe("truncate to only 400 words from a 1000000 paragraph long string",function() {
        it("should take less than a second",function() {
                var startTime = Date.now();
				truncatise(input,{TruncateLength: 400, TruncateBy : "words", StripHTML : true, Suffix : ''});
                (Date.now() - startTime).should.be.lte(1000);
        });
    });
    
    describe("truncate to only 1000 words from a 1000000 paragraph long string",function() {
        it("should take less than a second",function() {
                var startTime = Date.now();
				truncatise(input,{TruncateLength: 1000, TruncateBy : "words", StripHTML : true, Suffix : ''});
                (Date.now() - startTime).should.be.lte(1000);
        });
    });
    
    describe("truncate to only 10000 words from a 1000000 paragraph long string",function() {
        it("should take less than a second",function() {
                var startTime = Date.now();
				truncatise(input,{TruncateLength: 10000, TruncateBy : "words", StripHTML : true, Suffix : ''});
                (Date.now() - startTime).should.be.lte(1000);
        });
    });
});